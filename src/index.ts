/**
 * dsh-mcp-apps host half: opens its own MCP connections to the servers the
 * official `mcp-client` plugin already configures (read-only reuse of their
 * loader-row config), discovers which tools carry `ui://` App resources, serves
 * the separate-origin sandbox proxy page, and exposes a fenced RPC channel the
 * browser half calls for the App list, App resources, and server-tool
 * passthrough. The official mcp-client package is never modified.
 *
 * RPC rides the Typert Gateway (the `mcp-apps` Remote service from
 * `./remote.ts`): no token-gated loopback POST handler and no
 * settings-namespace bootstrap. The sandbox proxy page itself still needs its
 * own loopback origin — the separate-port security model is unchanged.
 *
 * On-demand login: when the `dsh-mcp-auth` bundle is present its `mcpAuth`
 * service supplies an `authProvider` for each connection, so a protected tool
 * called from inside an App can answer 401, drive the consent flow, and be
 * retried — the "host runs the OAuth flow on 401 and retries" contract the MCP
 * Apps reference host implements. Without that bundle the connections behave as
 * before and a 401 stays a plain error.
 *
 * @module dsh-mcp-apps
 */

import z from '@deepseek-ai/schemastery'
import type { Context } from '@deepseek-ai/cordis'
import { UnauthorizedError } from '@modelcontextprotocol/sdk/client/auth.js'
import {
  connectAndDiscover, discoverServerConfigs, readAppResource,
  type ConnectedServer, type LazyAuthLike, type McpServerConfig,
} from './connections.ts'
import { registerServerTools, withLiveCredentials, type ToolsRuntimeLike } from './tool-bridge.ts'
import { SandboxServer } from './sandbox-server.ts'
import { McpAppsRemoteService } from './remote.ts'

export * from './remote.ts'

export const name = 'mcp-apps'
export const inject = ['tools']

/**
 * The slice of `dsh-mcp-auth`'s provided service this bundle uses.
 *
 * Resolved through `ctx.get` at apply time rather than declared in `inject`:
 * `inject` has no optional form in this Cordis version, so declaring it would
 * make the auth bundle a hard requirement and leave App support silently
 * unapplied in any profile that does not install it.
 */
interface McpAuthLike {
  lazyAuth(serverName: string, serverUrl: string, scope?: string): Promise<LazyAuthLike>
}

const EndpointSchema = z.object({
  /** Bootstrap the browser half reads: listener origin + per-boot token. */
  endpointJson: z.string().default(''),
})
void EndpointSchema

export const Config = z.object({
  /** Allowlist of mcp-client `serverName` values; empty mirrors every row. */
  servers: z.array(z.string()).default([]),
  /** Loopback port for the sandbox origin; 0 lets the OS assign one. */
  sandboxPort: z.number().default(0),
  /**
   * Register every connected server's tools on the harness `tools` runtime,
   * backed by this bundle's live-credential connection (default false). When
   * false nothing touches the tool registry. When true, tools whose names the
   * official mcp-client row already owns are skipped with a warning — remove
   * that row from the profile to let this bridge take over.
   */
  registerTools: z.boolean().default(false),
})

type RpcOutcome = { ok: true; value: unknown } | { ok: false; error: { code: string; message: string } }

function ok(value: unknown): RpcOutcome {
  return { ok: true, value }
}

function fail(error: unknown): RpcOutcome {
  return { ok: false, error: { code: 'mcp-apps', message: error instanceof Error ? error.message : String(error) } }
}

export async function apply(ctx: Context, config: z.infer<typeof Config>): Promise<void> {
  const listener = new SandboxServer()
  await listener.start(config.sandboxPort)
  ctx.effect(() => () => listener.stop(), 'mcp-apps: sandbox origin')

  /**
   * Resolve the auth service **at connection time**, never at apply time.
   *
   * Services are provided by sibling plugins and the apply order between two
   * bundles is not ours to decide, so looking `mcpAuth` up while `apply` runs
   * captures `undefined` for the whole process whenever this bundle happens to
   * be applied first — which is exactly what happened the first time. Reading
   * it when the first request actually arrives is late enough for every plugin
   * to be up, and still avoids the hard `inject` dependency that would disable
   * App support in profiles without the auth bundle.
   */
  const resolveAuthService = (): McpAuthLike | undefined => ctx.get('mcpAuth') as unknown as McpAuthLike | undefined

  // Connections are lazy: nothing connects until the browser half first asks.
  const connected = new Map<string, ConnectedServer>()
  let discovery: Promise<void> | undefined

  // Lazy-auth handles own a loopback listener each; release them with the
  // plugin, otherwise a reload leaks one listener per configured server.
  // Registered tools are disposed here too so a plugin reload never leaves
  // registry entries pointing at a dead connection.
  const toolDisposers = new Map<string, Map<string, () => void>>()
  ctx.effect(() => () => {
    for (const server of toolDisposers.values()) for (const dispose of server.values()) dispose()
    toolDisposers.clear()
    for (const server of connected.values()) server.auth?.dispose()
    connected.clear()
  }, 'mcp-apps: lazy auth handles + tool registrations')

  /**
   * Register one server's tools on the harness runtime, when enabled.
   *
   * Runs after discovery so a connection (and its live-credential handle)
   * exists first. Skipped entirely when `registerTools` is false: the
   * registry is not touched, matching the behaviour before the bridge.
   */
  const bridgeTools = (server: ConnectedServer): void => {
    if (!config.registerTools) return
    const previous = toolDisposers.get(server.config.serverName)
    if (previous !== undefined) return // already bridged this server
    const runtime = ctx.tools as unknown as ToolsRuntimeLike
    const call = withLiveCredentials(server.auth, (signal, rawName, args) => server.client.callTool(
      { name: rawName, arguments: args },
      undefined,
      { signal, timeout: 60_000 },
    ) as Promise<{ content?: unknown[]; isError?: boolean; structuredContent?: unknown }>)
    const { disposers, skipped } = registerServerTools(server.config.serverName, server.allTools, call, {
      runtime,
      warn: (message) => { ctx.logger.warn(message) },
    })
    toolDisposers.set(server.config.serverName, disposers)
    const names = [...disposers.keys()]
    console.info(`[dsh-mcp-apps] tool bridge: registered ${names.length} tool(s) for "${server.config.serverName}"${names.length > 0 ? ` (${names.join(', ')})` : ''}${skipped.length > 0 ? `, skipped ${skipped.length} already-registered` : ''}`)
  }

  const ensureServers = async (): Promise<void> => {
    if (discovery === undefined) {
      discovery = (async () => {
        const configs: McpServerConfig[] = discoverServerConfigs(ctx, config.servers)
        for (const cfg of configs) {
          try {
            const authService = resolveAuthService()
            const hooks = authService !== undefined
              ? { lazyAuth: (serverName: string, serverUrl: string) => authService.lazyAuth(serverName, serverUrl) }
              : {}
            const server = await connectAndDiscover(cfg, hooks)
            connected.set(cfg.serverName, server)
            try {
              bridgeTools(server)
            } catch (error) {
              // A bridge failure must not take App support down: Apps still
              // render, and the tools stay owned by whoever registered them.
              ctx.logger.warn(`mcp-apps: tool bridge failed for server "${cfg.serverName}": ${error instanceof Error ? error.message : String(error)}`)
            }
          } catch (error) {
            ctx.logger.warn(`mcp-apps: App discovery failed for server "${cfg.serverName}": ${error instanceof Error ? error.message : String(error)}`)
          }
        }
      })()
    }
    await discovery
  }

  const serverOf = (serverName: string): ConnectedServer | undefined => connected.get(serverName)

  /**
   * Whether a request failure means "this connection's credentials are gone
   * and a login could fix them".
   *
   * Two shapes qualify. `UnauthorizedError` is the SDK saying a consent page
   * has to be approved. A message mentioning a rejected refresh (or a revoked
   * grant) is the SDK's *refresh* path failing — it never becomes
   * `UnauthorizedError` because the refresh path cannot ask for a human. The
   * demo makes this reachable: its "Revoke token" tool is itself protected,
   * so a fresh login triggered from that button ends up revoked by its own
   * call, and without this branch every later request would fail forever with
   * the stored-but-dead grant.
   */
  const isFixableByLogin = (error: unknown): boolean => {
    if (error instanceof UnauthorizedError) return true
    const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()
    return message.includes('refresh token')
      || message.includes('revoked')
      || message.includes('invalid_grant')
  }

  /**
   * Run one request against a server, completing an on-demand login and
   * retrying once when the SDK reports the request was not authorized.
   *
   * The transport already handles the *non-interactive* half of a 401 by
   * itself: it re-runs the auth flow and resends the request when that
   * succeeds without user interaction. It throws `UnauthorizedError` only when
   * a human has to approve a consent page — which is precisely the case this
   * retry exists for. A rejected refresh is the other case (see {@link isFixableByLogin}).
   *
   * @param server - the connected server the request targets.
   * @param run - the request, re-invoked once after a successful login.
   */
  const withLazyAuth = async <T>(server: ConnectedServer, run: () => Promise<T>): Promise<T> => {
    try {
      return await run()
    } catch (error) {
      if (!isFixableByLogin(error) || server.auth === undefined) throw error
      console.info(`[dsh-mcp-apps] "${server.config.serverName}" needs authorization; waiting for the consent page`)
      const outcome = await server.auth.authorize()
      if (outcome !== 'AUTHORIZED') throw error
      // The transport reads the bearer from the provider on every request, so
      // the retry carries the token the flow just stored.
      return await run()
    }
  }

  const handler = async (endpoint: string, payload: unknown): Promise<RpcOutcome> => {
    await ensureServers()
    if (endpoint === 'list') {
      const apps = [...connected.values()].flatMap((entry) => entry.apps)
      return ok({ apps, sandboxOrigin: listener.origin })
    }
    const body = (payload ?? {}) as Record<string, unknown>
    if (endpoint === 'resource') {
      const toolName = typeof body.toolName === 'string' ? body.toolName : ''
      const server = [...connected.values()].find((s) => s.apps.some((a) => a.toolName === toolName))
      if (server === undefined) return fail(new Error(`no App resource for tool ${JSON.stringify(toolName)}`))
      const app = server.apps.find((a) => a.toolName === toolName)
      const { html, csp, permissions } = await withLazyAuth(server, () => readAppResource(server, app.resourceUri))
      return ok({
        html,
        cspJson: csp === undefined ? null : JSON.stringify(csp),
        permissionsJson: permissions === undefined ? null : JSON.stringify(permissions),
        sandboxOrigin: listener.origin,
      })
    }
    if (endpoint === 'call-tool') {
      const server = serverOf(String(body.serverName ?? ''))
      if (server === undefined) return fail(new Error(`unknown server ${JSON.stringify(String(body.serverName ?? ''))}`))
      const result = await withLazyAuth(server, () => server.client.callTool({ name: String(body.name ?? ''), arguments: body.arguments as Record<string, unknown> | undefined }))
      return ok(result)
    }
    if (endpoint === 'read-resource') {
      const server = serverOf(String(body.serverName ?? ''))
      if (server === undefined) return fail(new Error(`unknown server ${JSON.stringify(String(body.serverName ?? ''))}`))
      return ok(await withLazyAuth(server, () => server.client.readResource({ uri: String(body.uri ?? '') })))
    }
    if (endpoint === 'list-resources') {
      const server = serverOf(String(body.serverName ?? ''))
      if (server === undefined) return fail(new Error(`unknown server ${JSON.stringify(String(body.serverName ?? ''))}`))
      return ok(await withLazyAuth(server, () => server.client.listResources()))
    }
    return fail(new Error(`unknown endpoint ${JSON.stringify(endpoint)}`))
  }

  // RPC rides the Typert Gateway: the Remote service below exposes the shared
  // handler to the browser half (no loopback POST surface, no per-boot token,
  // no settings-namespace bootstrap). The sandbox listener still serves the
  // separate-origin proxy page the App iframes load.
  listener.setRpcHandler(async (endpoint, payload) => handler(endpoint, payload))
  new McpAppsRemoteService(ctx, {
    dispatch: async (endpoint, payload) => handler(endpoint, payload),
    sandboxOrigin: () => listener.origin,
    sandboxKey: () => listener.embedKey,
  })
}

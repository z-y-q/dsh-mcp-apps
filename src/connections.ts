/**
 * MCP connections for App discovery. Opens this bundle's OWN connection to
 * each configured MCP server because the official `mcp-client` plugin discards
 * tool `_meta` when it builds `ToolDefinition`s and exposes no
 * `resources/read` path — App discovery cannot ride on its connection. Server
 * configuration is READ-ONLY and reused from the loader's `mcp-client` rows so
 * nothing is configured twice — read from the row fiber's already-interpolated
 * config, so this connection carries the same credentials the mcp-client row
 * itself received (see {@link effectiveConfig}).
 *
 * @module dsh-mcp-apps/connections
 */

import type { Context } from '@deepseek-ai/cordis'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js'
import type { OAuthClientProvider } from '@modelcontextprotocol/sdk/client/auth.js'
import { getToolUiResourceUri, RESOURCE_MIME_TYPE } from '@modelcontextprotocol/ext-apps/app-bridge'
import type { Tool } from '@modelcontextprotocol/sdk/types.js'
import type { McpAppToolInfo } from './protocol.ts'
import { publicToolName } from './naming.ts'

/** Loader-row config of one mcp-client instance (subset this bundle reads). */
export interface McpServerConfig {
  readonly serverName: string
  readonly transport: 'stdio' | 'streamable-http'
  readonly command?: string
  readonly args?: readonly string[]
  readonly env?: Readonly<Record<string, string>>
  readonly cwd?: string
  readonly url?: string
  readonly headers?: Readonly<Record<string, string>>
}

/**
 * What this bundle needs from the auth bundle (`dsh-mcp-auth`'s `mcpAuth`
 * service) to perform an on-demand login.
 *
 * Deliberately structural rather than an import of that package: the two
 * bundles are installed side by side with their own dependency trees, so a
 * type-only dependency would be a coupling nobody benefits from, and the
 * service may simply not be present in a given profile.
 */
export interface LazyAuthLike {
  /** Handed to the SDK transport as `authProvider`. */
  readonly provider: OAuthClientProvider
  /** Finish the authorization, waiting for the user when needed. */
  authorize(): Promise<'AUTHORIZED' | 'FAILED'>
  /** The most recent authorization URL, for display. */
  authorizationUrl(): string | null
  /** Release the handle's loopback listener. */
  dispose(): void
}

/**
 * Drop any `Authorization` header from a static header map.
 *
 * Required whenever an `authProvider` is installed: the SDK builds request
 * headers as `{ ...bearerFromProvider, ...requestInit.headers }`, spreading the
 * static map **last**. A stale `Authorization` left in there therefore wins over
 * the provider's fresh token and silently defeats the whole lazy-auth flow.
 * Comparison is case-insensitive because HTTP header names are.
 *
 * @param headers - the row's configured headers.
 * @returns a copy without any `Authorization` entry.
 */
export function stripAuthorization(headers: Readonly<Record<string, string>>): Record<string, string> {
  const result: Record<string, string> = {}
  for (const [key, value] of Object.entries(headers)) {
    if (key.toLowerCase() !== 'authorization') result[key] = value
  }
  return result
}

/** Per-connection hooks the host half supplies. */
export interface ConnectOptions {
  /**
   * Resolve the lazy-auth handle for one server. Absent means on-demand login
   * is unavailable and a 401 stays a plain error — the behaviour before this
   * existed.
   */
  readonly lazyAuth?: (serverName: string, serverUrl: string) => Promise<LazyAuthLike>
}

const IMPLEMENTATION = { name: '@z-y-q/dsh-mcp-apps', version: '0.1.1' }

/** The loader-entry surface this bundle needs to resolve `!!js` values. */
interface LoaderEntryLike {
  readonly options: { name?: unknown; disabled?: unknown; config?: unknown }
  /** Config the row's own plugin received: `internal/config` already ran on it. */
  readonly fiber?: { readonly config?: unknown }
  /** Public `Entry` method: evaluates an expression in that entry's own scope. */
  evaluate?: (expr: string) => unknown
}

/**
 * The config a row's plugin actually runs with.
 *
 * `entry.options.config` is the serialized row, so a `!!js` value is still the
 * raw `{__jsExpr}` node there. The interpolated config — the one the loader
 * produced by running `internal/config` in the *fiber's* scope — is what the
 * owning plugin received, and reading it is also what makes injected services
 * work: an expression like `ctx.mcpAuth.headers(...)` needs the row's own
 * `inject` list, which the bare entry context does not carry (`entry.evaluate`
 * throws `cannot get property "mcpAuth" without inject` there).
 * @param entry - the loader entry to read.
 * @returns the fiber's resolved config, or the serialized row as a fallback.
 */
function effectiveConfig(entry: LoaderEntryLike): unknown {
  const fiberConfig = entry.fiber?.config
  return fiberConfig === undefined ? entry.options.config : fiberConfig
}

/** A serialized loader `!!js` node, as it survives in `entry.options.config`. */
interface JsExprNode {
  __jsExpr: string
}

/**
 * `entry.options.config` is the *serialized* entry config: the loader only
 * interpolates a `!!js` value on its way into the plugin's fiber, so what a
 * reader of someone else's row sees is the raw `{__jsExpr}` node. A plain
 * object with that key is therefore the tag, not data.
 * @param value - candidate config node.
 * @returns true when the node is a serialized `!!js` expression.
 */
export function isJsExprNode(value: unknown): value is JsExprNode {
  return typeof value === 'object' && value !== null && typeof (value as JsExprNode).__jsExpr === 'string'
}

/**
 * Recursively replace serialized `!!js` nodes with their evaluated values, so a
 * row config reused from the loader carries what its own plugin receives (for
 * example the headers `dsh-mcp-auth` injects through `ctx.mcpAuth.headers()`).
 *
 * A node that cannot be evaluated is left in place and reported: silently
 * keeping it would hand a transport a headers object that sends no
 * `Authorization` at all, which looks exactly like a server-side 401.
 *
 * @param entry - the entry owning the config; `evaluate` runs in its scope.
 * @param value - config value to walk (the entry's effective config).
 * @param warn - sink for one-line diagnostics.
 * @param path - dotted path of `value` inside the config, for diagnostics.
 * @returns the config with every resolvable `!!js` node replaced.
 */
export function resolveJsExprs(
  entry: LoaderEntryLike,
  value: unknown,
  warn: (message: string) => void,
  path = 'config',
): unknown {
  if (isJsExprNode(value)) {
    if (typeof entry.evaluate !== 'function') {
      warn(`${path} is a "!!js" expression but this loader entry exposes no evaluate(); using the raw node`)
      return value
    }
    try {
      return entry.evaluate(value.__jsExpr)
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error)
      warn(`${path} "!!js" expression failed to evaluate: ${detail}${detail.includes('without inject') ? ' (the row must be started before its expressions can be read)' : ''}`)
      return value
    }
  }
  if (Array.isArray(value)) return value.map((item, index) => resolveJsExprs(entry, item, warn, `${path}[${index}]`))
  if (typeof value === 'object' && value !== null) {
    const resolved: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value)) resolved[key] = resolveJsExprs(entry, item, warn, `${path}.${key}`)
    return resolved
  }
  return value
}

/**
 * Read the mcp-client row configs from the loader tree.
 * @param ctx - host context carrying the loader service.
 * @param only - optional allowlist of `serverName` values; empty means all.
 * @returns every enabled mcp-client server config, `!!js` values resolved.
 */
export function discoverServerConfigs(ctx: Context, only: readonly string[]): McpServerConfig[] {
  const found: McpServerConfig[] = []
  const seen = new Set<string>()
  for (const entry of ctx.loader.entries()) {
    const { name, disabled, config } = entry.options
    // A disabled row still declares its server config. With the tool bridge a
    // disabled row is how a profile says "the official client must not own
    // these tools (or credentials), but this bundle should still discover the
    // server" — so only the name filter applies here, not `disabled`.
    if (name !== '@deepseek-ai/dsh-mcp-client') continue
    const unresolved: string[] = []
    const raw = resolveJsExprs(
      entry as LoaderEntryLike,
      effectiveConfig(entry as LoaderEntryLike),
      (message) => {
        unresolved.push(message)
        ctx.logger.warn(`mcp-apps: mcp-client row config ${message}`)
      },
    )
    const cfg = raw as McpServerConfig | undefined
    if (cfg === undefined || typeof cfg.serverName !== 'string') continue
    if (seen.has(cfg.serverName)) continue
    if (only.length > 0 && !only.includes(cfg.serverName)) continue
    if (cfg.transport !== 'stdio' && cfg.transport !== 'streamable-http') continue
    seen.add(cfg.serverName)
    // Header NAMES only (never values): the one field that decides whether this
    // connection is authenticated, and the first thing to check when a
    // protected server's Apps fail to appear.
    if (process.env.DSH_MCP_APPS_DEBUG === '1') {
      const evaluable = typeof (entry as LoaderEntryLike).evaluate
      console.info(`[dsh-mcp-apps] row "${cfg.serverName}": url=${cfg.url ?? '(stdio)'} evaluate=${evaluable} header keys=[${Object.keys(cfg.headers ?? {}).join(', ')}]${unresolved.length > 0 ? ` unresolved=${unresolved.join(' | ')}` : ''}`)
    }
    found.push(cfg)
  }
  return found
}

/** One connected server: its client plus the discovered App tool set. */
export interface ConnectedServer {
  readonly config: McpServerConfig
  readonly client: Client
  readonly apps: readonly McpAppToolInfo[]
  /** Every tool the server listed (not only App-bearing ones), for the bridge. */
  readonly allTools: readonly Tool[]
  /**
   * On-demand login handle, present only for HTTP servers when the auth bundle
   * supplied one. The owner must `dispose()` it: it holds a loopback listener.
   */
  readonly auth?: LazyAuthLike
}

/**
 * Connect to one server and discover its App-bearing tools.
 *
 * For an HTTP server this also wires up on-demand login when the auth bundle is
 * available: the returned client can then be retried after a 401 instead of
 * failing outright.
 *
 * @param config - the mcp-client row config for this server.
 * @param options - host-supplied hooks (lazy auth).
 * @returns the connected client with its App tool list and, when wired, its auth handle.
 */
export async function connectAndDiscover(
  config: McpServerConfig,
  options: ConnectOptions = {},
): Promise<ConnectedServer> {
  const client = new Client(IMPLEMENTATION)
  let auth: LazyAuthLike | undefined
  if (config.transport === 'stdio') {
    // An omitted env lets the SDK supply its sanitized ambient environment;
    // declared env vars replace it wholesale, matching mcp-client's merge intent.
    const env = config.env !== undefined && Object.keys(config.env).length > 0
      ? { ...config.env }
      : undefined
    await client.connect(new StdioClientTransport({
      command: config.command ?? '',
      args: [...(config.args ?? [])],
      ...(env !== undefined ? { env } : {}),
      ...(config.cwd ? { cwd: config.cwd } : {}),
    }))
  } else {
    const url = config.url ?? ''
    if (options.lazyAuth !== undefined && url.length > 0) {
      try {
        auth = await options.lazyAuth(config.serverName, url)
      } catch (error) {
        // A missing/broken auth bundle must not take App support down with it:
        // Apps still render, protected tools just keep answering 401.
        console.warn(`[dsh-mcp-apps] lazy auth unavailable for "${config.serverName}": ${error instanceof Error ? error.message : String(error)}`)
      }
    }
    const configured: Record<string, string> = { ...(config.headers ?? {}) }
    // Authorization belongs to the provider alone once one is installed; see
    // stripAuthorization for why leaving a static one in place breaks the flow.
    const headers = auth === undefined ? configured : stripAuthorization(configured)
    await client.connect(new StreamableHTTPClientTransport(new URL(url), {
      requestInit: { headers },
      ...(auth !== undefined ? { authProvider: auth.provider } : {}),
    }))
  }

  const apps: McpAppToolInfo[] = []
  const allTools: Tool[] = []
  let cursor: string | undefined
  do {
    const response = await client.listTools(cursor !== undefined ? { cursor } : undefined)
    for (const tool of response.tools as Tool[]) {
      allTools.push(tool)
      // getToolUiResourceUri returns undefined when no _meta.ui is present and
      // throws only when a present value is not a ui:// URI.
      let uri: string | undefined
      try {
        uri = getToolUiResourceUri(tool)
      } catch {
        continue
      }
      if (uri === undefined) continue
      apps.push({
        toolName: publicToolName(config.serverName, tool.name),
        serverName: config.serverName,
        resourceUri: uri,
      })
    }
    cursor = response.nextCursor
  } while (cursor !== undefined)

  return { config, client, apps, allTools, ...(auth !== undefined ? { auth } : {}) }
}

/**
 * Read one `ui://` App resource and validate it per the MCP Apps spec.
 * @param server - the connected server owning the resource.
 * @param uri - the `ui://` resource URI from the tool's `_meta.ui`.
 * @returns the App HTML plus its CSP/permissions metadata.
 */
export async function readAppResource(
  server: ConnectedServer,
  uri: string,
): Promise<{ html: string; csp: unknown; permissions: unknown }> {
  const resource = await server.client.readResource({ uri })
  if (resource.contents.length !== 1) {
    throw new Error(`Unexpected contents count: ${resource.contents.length}`)
  }
  const content = resource.contents[0] as Record<string, unknown>
  // "text/html;profile=mcp-app" signals this resource is an MCP App UI.
  if (content.mimeType !== RESOURCE_MIME_TYPE) {
    throw new Error(`Unsupported MIME type: ${String(content.mimeType)}`)
  }
  const html = typeof content.blob === 'string' ? atob(content.blob) : String(content.text ?? '')
  // Content-level (resources/read) _meta takes precedence; fall back to the
  // listing-level (resources/list) _meta per the spec.
  const contentMeta = (content._meta ?? content.meta) as { ui?: { csp?: unknown; permissions?: unknown } } | undefined
  let csp = contentMeta?.ui?.csp
  let permissions = contentMeta?.ui?.permissions
  if (csp === undefined && permissions === undefined) {
    try {
      const listing = await server.client.listResources()
      const entry = listing.resources.find((r) => r.uri === uri) as { _meta?: { ui?: { csp?: unknown; permissions?: unknown } } } | undefined
      csp = entry?._meta?.ui?.csp
      permissions = entry?._meta?.ui?.permissions
    } catch {
      // A server without resources/list keeps the content-level metadata only.
    }
  }
  return { html, csp, permissions }
}

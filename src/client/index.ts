/**
 * dsh-mcp-apps browser half: mounts this package's hand-maintained Typert
 * Remote contribution on the gateway connection (`ctx.remote.$mount`), then
 * activates the toolviews inside `ctx.inject` — the mounted namespace
 * materializes as the `remote.mcp-apps` service, reached through the traced
 * `remote` service's namespace property (the official voice-input pattern).
 * Each App-bearing MCP tool gets one keyed `tool.call.toolview` row; the App's
 * `ui://` resource renders inside the separate-origin sandbox through the
 * official `AppBridge`.
 * @module dsh-mcp-apps/client
 */

import { McpAppRow } from './McpAppRow.tsx'
// Hand-maintained contribution (the generator's package mode cannot see npm
// deps); inlined at build time.
// @ts-expect-error manual artifact without type declarations
import contribution from '../typert.remote-client.manual.js'

/** RPC face the toolview components receive through their inject share. */
export interface ClientRpcFace {
  call<T>(endpoint: string, payload: unknown): Promise<T>
}

/** The mounted namespace: method calls forwarded through the gateway. */
interface McpAppsNs {
  list(): Promise<unknown>
  resource(request: unknown): Promise<unknown>
  'call-tool'(request: unknown): Promise<unknown>
  'read-resource'(request: unknown): Promise<unknown>
  'list-resources'(request: unknown): Promise<unknown>
}

interface SlotsCtx {
  inject: (name: string, install: () => unknown) => () => void
  register: (options: {
    name: string
    key: string
    inject?: () => { rpc: ClientRpcFace }
  }, component: unknown) => () => void
}

interface InjectCtx {
  /** The base Remote service; the namespace resolves through its traced surface. */
  remote: { 'mcp-apps': McpAppsNs }
  slots: SlotsCtx
}

/** Subset of the cordis Context face this entry uses. */
interface ClientCtx {
  remote: { $mount(c: unknown): Promise<{ (): Promise<void> }> }
  slots: SlotsCtx
  inject(keys: readonly string[], body: (inner: InjectCtx) => void | Promise<void>): unknown
  on?: (event: string, listener: () => void) => () => void
}

export const inject = ['remote', 'slots']

export async function apply(ctx: ClientCtx): Promise<void> {
  // 1) Publish this package's Remote contribution on the gateway connection.
  const disposeRemote = await ctx.remote.$mount(contribution)
  // 2) The mounted namespace arrives as the `remote.mcp-apps` service; wait
  //    for it through a nested injection and register the toolviews inside,
  //    so they live exactly as long as both services do.
  const ui = ctx.inject(['remote.mcp-apps', 'slots'], (inner: InjectCtx) => {
    // The namespace service is exposed as a property of the traced `remote`
    // service (the voice-input pattern); `inner.remote['mcp-apps']` is it.
    const ns = inner.remote['mcp-apps']
    // Remote methods resolve to a result envelope ({ok, value} | {ok, error});
    // the rows want plain values and thrown failures.
    const unwrap = <T>(result: { ok: true; value: T } | { ok: false; error: unknown }): T => {
      if (!result.ok) throw result.error
      return result.value
    }
    // RPC over the Typert Gateway; endpoint names keep the legacy dispatch so
    // McpAppRow's `rpc.call('resource', …)` surface is unchanged.
    const rpc: ClientRpcFace = {
      async call<T>(endpoint: string, payload: unknown): Promise<T> {
        if (endpoint === 'list') return unwrap(await ns.list()) as T
        if (endpoint === 'resource') return unwrap(await ns.resource(payload)) as T
        if (endpoint === 'call-tool') {
          const body = (payload ?? {}) as { serverName?: string; name?: string; arguments?: unknown }
          return unwrap(await ns['call-tool']({
            serverName: String(body.serverName ?? ''),
            name: String(body.name ?? ''),
            argsJson: JSON.stringify(body.arguments ?? {}),
          })) as T
        }
        if (endpoint === 'read-resource') {
          const body = (payload ?? {}) as { serverName?: string; uri?: string }
          return unwrap(await ns['read-resource']({ serverName: String(body.serverName ?? ''), uri: String(body.uri ?? '') })) as T
        }
        if (endpoint === 'list-resources') {
          const body = (payload ?? {}) as { serverName?: string }
          return unwrap(await ns['list-resources']({ serverName: String(body.serverName ?? '') })) as T
        }
        throw new Error(`mcp-apps: unknown endpoint ${JSON.stringify(endpoint)}`)
      },
    }

    // Disposer for the rows currently installed. A connection generation change
    // re-runs `registerApps`, and the keyed-slot registry rejects a second row
    // for a key that is still held — so the previous rows are withdrawn first.
    let disposeRows: (() => void) | undefined

    const registerApps = (): void => {
      Promise.resolve(rpc.call<{ apps?: { toolName: string }[] }>('list', {}))
        .then((list) => {
          const apps = list?.apps ?? []
          // Registered rows are the only browser-visible proof that discovery
          // reached this page; without a log an empty `apps` and a broken chain
          // look identical from the outside.
          console.info(`[dsh-mcp-apps] registering ${apps.length} App toolview(s): ${apps.map((app) => app.toolName).join(', ') || '(none)'}`)
          disposeRows?.()
          disposeRows = inner.slots.inject('tool.call.toolview', () => {
            const disposers = apps.map((app) =>
              inner.slots.register(
                { name: 'tool.call.toolview', key: app.toolName, inject: () => ({ rpc }) },
                McpAppRow,
              ))
            return () => { for (const dispose of disposers) dispose() }
          })
        })
        .catch((error: unknown) => {
          // Host half absent or the call failed: surface it instead of hiding
          // every App toolview with no trace. The generic tool row still renders
          // these calls, so the UI degrades gracefully.
          console.warn('[dsh-mcp-apps] list failed:', error)
        })
    }
    registerApps()
    ctx.on?.('connection/reset', registerApps)
  })
  // Withdraw the namespace together with this fiber. cordis `ctx.inject`
  // returns a fiber-like handle whose dispose unregisters the inner plugin.
  const handle = ui as { dispose?: () => Promise<void> }
  return async () => {
    try { await handle.dispose?.() } catch { /* already gone */ }
    await disposeRemote()
  }
}

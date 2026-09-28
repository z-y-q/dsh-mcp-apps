/**
 * dsh-mcp-apps browser half: reads the listener bootstrap (origin + per-boot
 * token) from the authenticated settings namespace, then registers one keyed
 * `tool.call.toolview` row per App-bearing MCP tool. The App\'s `ui://`
 * resource renders inside the separate-origin sandbox through the official
 * `AppBridge`.
 * @module dsh-mcp-apps/client
 */

import { McpAppRow } from './McpAppRow.tsx'

/** RPC face the toolview components receive through their inject share. */
export interface ClientRpcFace {
  call<T>(endpoint: string, payload: unknown): Promise<T>
}

/** Bootstrap row the host half publishes through the settings namespace. */
interface EndpointInfo {
  origin: string
  token: string
}

interface SlotsCtx {
  inject: (name: string, install: () => unknown) => () => void
  register: (options: {
    name: string
    key: string
    inject?: () => { rpc: ClientRpcFace }
  }, component: unknown) => () => void
}

/** One settings namespace row as the gateway serializes it. */
interface NamespaceRow {
  ns: string
  value?: { endpointJson?: string }
}

/**
 * The browser-side settings Remote, reached as `ctx.remote.settings` (declare
 * it in `inject`). The connection handle exposes no `api` property, so reading
 * settings through `connection.api.settings` yields `undefined` and registers
 * no toolview at all, with no visible trace.
 */
interface SettingsApi {
  describe(): Promise<{ ok?: boolean; value?: { namespaces?: NamespaceRow[] } }>
}

function endpointOf(view: { endpointJson?: string } | undefined): EndpointInfo | undefined {
  const raw = view?.endpointJson
  if (typeof raw !== 'string' || raw.length === 0) return undefined
  try {
    const parsed = JSON.parse(raw) as EndpointInfo
    if (typeof parsed.origin === 'string' && typeof parsed.token === 'string') return parsed
  } catch {
    // A malformed row falls through to the not-ready path.
  }
  return undefined
}

export const inject = ['slots', 'remote', 'remote.settings']

export function apply(ctx: { remote?: { settings?: SettingsApi }; slots: SlotsCtx; on?: (event: string, listener: () => void) => () => void }): void {
  const settings = ctx.remote?.settings
  if (settings === undefined) {
    console.warn('[dsh-mcp-apps] remote.settings is unavailable; no App toolviews register')
    return
  }

  // Disposer for the rows currently installed. A connection generation change
  // re-runs `registerApps`, and the keyed-slot registry rejects a second row for
  // a key that is still held — so the previous rows are withdrawn first.
  let disposeRows: (() => void) | undefined

  const registerApps = (): void => {
    settings.describe()
      .then(async (response) => {
        const ns = response?.value?.namespaces?.find((item) => item.ns === 'mcp-apps')
        const info = endpointOf(ns?.value)
        if (info === undefined) {
          console.warn('[dsh-mcp-apps] settings namespace "mcp-apps" is not readable yet; no App toolviews register')
          return
        }
        // RPC over this bundle's own token-gated listener.
        const rpc: ClientRpcFace = {
          async call<T>(endpoint: string, payload: unknown): Promise<T> {
            const fetchResponse = await fetch(`${info.origin}/rpc/${endpoint}`, {
              method: 'POST',
              headers: { 'content-type': 'application/json', authorization: `Bearer ${info.token}` },
              body: JSON.stringify(payload ?? {}),
            })
            return await fetchResponse.json() as T
          },
        }
        const list = await rpc.call<{ apps?: { toolName: string }[]; ok?: boolean }>('list', {})
        const envelope = list as { ok?: boolean; value?: { apps: { toolName: string }[] } }
        const apps = envelope !== null && typeof envelope === 'object' && 'ok' in envelope
          ? (envelope.ok === true ? envelope.value?.apps ?? [] : [])
          : (list as { apps?: { toolName: string }[] })?.apps ?? []
        // Registered rows are the only browser-visible proof that discovery
        // reached this page; without a log an empty `apps` and a broken chain
        // look identical from the outside.
        console.info(`[dsh-mcp-apps] registering ${apps.length} App toolview(s): ${apps.map((app) => app.toolName).join(', ') || '(none)'}`)
        disposeRows?.()
        disposeRows = ctx.slots.inject('tool.call.toolview', () => {
          const disposers = apps.map((app) =>
            ctx.slots.register(
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
        console.warn('[dsh-mcp-apps] settings describe failed:', error)
      })
  }
  registerApps()
  ctx.on?.('connection/reset', registerApps)
}

/**
 * dsh-mcp-apps host Remote face: the Typert-exposed twin of the old
 * token-gated loopback RPC. The Gateway discovers this service through its
 * `typertRemote` binding (source-mode discovery), so the browser half calls
 * these methods as `ctx.remote['mcp-apps'].<method>(...)` — the per-boot
 * bearer token, the CORS surface, and the settings-namespace bootstrap all
 * disappear. The sandbox proxy page itself STAYS on the separate-origin
 * loopback listener (the security model requires the distinct port); only the
 * RPC channel moved.
 *
 * Method names keep the old endpoint names (`list`, `resource`, `call-tool`,
 * `read-resource`, `list-resources`) so the browser half's dispatch reads the
 * same; each name equals its JS method name (single words or kebab→camel with
 * an explicit `implementation` in the hand-maintained manifest), so the
 * Gateway's `descriptor.implementation ?? descriptor.method` reflection finds
 * every method.
 *
 * Wire-shape rules (the generator projects TS types to strict zod codecs):
 * exported interfaces only, JSON-shaped fields, `| null` unions, no
 * `Record<string, …>` maps — `arguments` travels as an unknown scalar and
 * MCP payloads as serialized JSON fields.
 *
 * @module dsh-mcp-apps/remote
 */

import type { Context } from '@deepseek-ai/cordis'
import { TypertRemoteService, Remote } from '@deepseek-ai/dsh-typert-protocol'
import type { McpAppToolInfo } from './protocol.ts'

/** Result of the `list` Remote method: App rows plus the sandbox origin. */
export interface McpAppsListResult {
  apps: McpAppToolInfo[]
  /** Origin (scheme+host+port) of the sandbox proxy listener. */
  sandboxOrigin: string
}

/** Request of the `resource` Remote method. */
export interface McpAppsResourceRequest {
  toolName: string
}

/** Result of the `resource` Remote method. */
export interface McpAppsResourceResult {
  html: string
  /** Serialized `McpUiResourceCsp` JSON, or null when the resource declared none. */
  cspJson: string | null
  /** Serialized `McpUiResourcePermissions` JSON, or null when absent. */
  permissionsJson: string | null
  sandboxOrigin: string
  /** Per-boot embed key the host page presents to the sandbox proxy (needed
   * where the embedding page sends no Referer, e.g. the desktop `dsh-app://` origin). */
  sandboxKey: string
}

/** Request of the `call-tool` Remote method. */
export interface McpAppsCallToolRequest {
  serverName: string
  name: string
  /** Tool arguments as a JSON-serializable value. */
  argsJson: string
}

/** Result of the `call-tool` Remote method. */
export interface McpAppsCallToolResult {
  /** Serialized SDK CallToolResult JSON. */
  resultJson: string
}

/** Request of the `read-resource` Remote method. */
export interface McpAppsReadResourceRequest {
  serverName: string
  uri: string
}

/** Result of the `read-resource` Remote method. */
export interface McpAppsReadResourceResult {
  /** Serialized SDK ReadResourceResult JSON. */
  resultJson: string
}

/** Request of the `list-resources` Remote method. */
export interface McpAppsListResourcesRequest {
  serverName: string
}

/** Result of the `list-resources` Remote method. */
export interface McpAppsListResourcesResult {
  /** Serialized SDK ListResourcesResult JSON. */
  resultJson: string
}

/** Collaborators the apply() half hands the Remote face. */
export interface McpAppsRemoteDeps {
  /**
   * Dispatch one legacy endpoint through the shared handler. This is the same
   * function the loopback listener served; `bootstrap` below carries the
   * sandbox origin alongside.
   */
  readonly dispatch: (endpoint: string, payload: unknown) => Promise<unknown>
  /** The separate-origin sandbox listener's origin (empty until started). */
  readonly sandboxOrigin: () => string
  /** The sandbox listener's per-boot embed key (empty until started). */
  readonly sandboxKey: () => string
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** MCP Apps RPC for the browser toolviews. */
    'mcp-apps': McpAppsRemoteService
  }
}

/**
 * Typert Remote service for the MCP Apps browser half. Discovered by the
 * Gateway without any registration: extending `TypertRemoteService` puts the
 * `typertRemote` binding on the instance, and `new …(ctx, …)` inside apply()
 * registers the cordis service the same way the official bundles do.
 */
export class McpAppsRemoteService extends TypertRemoteService {
  private readonly deps: McpAppsRemoteDeps

  constructor(ctx: Context, deps: McpAppsRemoteDeps) {
    super(ctx, 'mcp-apps')
    this.deps = deps
  }

  /** List App-bearing tools and the sandbox origin. */
  @Remote('list')
  async list(): Promise<McpAppsListResult> {
    const outcome = await this.deps.dispatch('list', {}) as { ok: boolean; value?: { apps?: McpAppToolInfo[] } }
    if (outcome?.ok !== true) throw new Error('mcp-apps: list failed')
    return { apps: outcome.value?.apps ?? [], sandboxOrigin: this.deps.sandboxOrigin() }
  }

  /** Read one tool's `ui://` resource. */
  @Remote('resource')
  async resource(request: McpAppsResourceRequest): Promise<McpAppsResourceResult> {
    const outcome = await this.deps.dispatch('resource', { toolName: request.toolName }) as {
      ok: boolean
      value?: { html?: string; cspJson?: string | null; permissionsJson?: string | null; sandboxOrigin?: string }
    }
    if (outcome?.ok !== true) throw new Error('mcp-apps: resource failed')
    return {
      html: outcome.value?.html ?? '',
      cspJson: outcome.value?.cspJson ?? null,
      permissionsJson: outcome.value?.permissionsJson ?? null,
      sandboxOrigin: outcome.value?.sandboxOrigin ?? this.deps.sandboxOrigin(),
      sandboxKey: this.deps.sandboxKey(),
    }
  }

  /** Call a tool on the server that owns it (live-credential connection). */
  @Remote('call-tool')
  async callTool(request: McpAppsCallToolRequest): Promise<McpAppsCallToolResult> {
    let args: unknown = {}
    try { args = JSON.parse(request.argsJson) } catch { /* empty arguments */ }
    const outcome = await this.deps.dispatch('call-tool', { serverName: request.serverName, name: request.name, arguments: args }) as { ok: boolean; value?: unknown }
    if (outcome?.ok !== true) throw new Error('mcp-apps: call-tool failed')
    return { resultJson: JSON.stringify(outcome.value ?? null) }
  }

  /** Read one resource on a connected server. */
  @Remote('read-resource')
  async readResource(request: McpAppsReadResourceRequest): Promise<McpAppsReadResourceResult> {
    const outcome = await this.deps.dispatch('read-resource', { serverName: request.serverName, uri: request.uri }) as { ok: boolean; value?: unknown }
    if (outcome?.ok !== true) throw new Error('mcp-apps: read-resource failed')
    return { resultJson: JSON.stringify(outcome.value ?? null) }
  }

  /** List resources on a connected server. */
  @Remote('list-resources')
  async listResources(request: McpAppsListResourcesRequest): Promise<McpAppsListResourcesResult> {
    const outcome = await this.deps.dispatch('list-resources', { serverName: request.serverName }) as { ok: boolean; value?: unknown }
    if (outcome?.ok !== true) throw new Error('mcp-apps: list-resources failed')
    return { resultJson: JSON.stringify(outcome.value ?? null) }
  }
}

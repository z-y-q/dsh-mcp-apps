/**
 * Wire payloads shared by the host half and the browser half. JSON only.
 * @module dsh-mcp-apps/protocol
 */

/** One MCP tool discovered to carry a `ui://` App resource. */
export interface McpAppToolInfo {
  /** Wire tool name (`mcp__<serverName>__<rawName>`) matching the tool registry. */
  readonly toolName: string
  /** Stable local server namespace from the mcp-client row config. */
  readonly serverName: string
  /** The `ui://` resource backing this tool's view. */
  readonly resourceUri: string
}

/** Payload of the `list` endpoint. */
export interface McpAppsListResult {
  readonly apps: readonly McpAppToolInfo[]
  /** Origin (scheme+host+port) of the sandbox proxy listener. */
  readonly sandboxOrigin: string
}

/** Payload of the `resource` endpoint. */
export interface McpAppResourceResult {
  readonly html: string
  /** Serialized `McpUiResourceCsp` JSON, or null when the resource declared none. */
  readonly cspJson: string | null
  /** Serialized `McpUiResourcePermissions` JSON, or null when absent. */
  readonly permissionsJson: string | null
}

/** Payload of the `call-tool` endpoint. */
export interface McpAppCallToolPayload {
  readonly serverName: string
  readonly name: string
  readonly arguments: unknown
}

/** Payload of the `read-resource` endpoint. */
export interface McpAppReadResourcePayload {
  readonly serverName: string
  readonly uri: string
}

/** Payload of the `list-resources` endpoint. */
export interface McpAppListResourcesPayload {
  readonly serverName: string
}

/** RPC channel shared by both halves. */
export const MCP_APPS_CHANNEL = '/mcp-apps'

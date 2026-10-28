/* Hand-maintained Typert host artifact for dsh-mcp-apps.
 * The official generator's package mode only recognizes packages under a
 * workspace's ./packages directory, while this plugin consumes the protocol
 * from npm; the manifest below mirrors what the generator would emit for
 * src/remote.ts (loader-validated field-for-field). Kebab-case wire names get
 * an explicit `implementation` pointing at the camelCase JS method — the
 * gateway reflects `descriptor.implementation ?? descriptor.method`. */
import { z } from 'zod'

const _McpAppToolInfo_schema = () => z.object({
  'toolName': z.string(),
  'serverName': z.string(),
  'resourceUri': z.string(),
})

const _McpAppsListResult_schema = () => z.object({
  'apps': z.array(_McpAppToolInfo_schema()),
  'sandboxOrigin': z.string(),
})

const _McpAppsResourceRequest_schema = () => z.object({
  'toolName': z.string(),
})

const _McpAppsResourceResult_schema = () => z.object({
  'html': z.string(),
  'cspJson': z.string().nullable(),
  'permissionsJson': z.string().nullable(),
  'sandboxOrigin': z.string(),
  'sandboxKey': z.string(),
})

const _McpAppsCallToolRequest_schema = () => z.object({
  'serverName': z.string(),
  'name': z.string(),
  'argsJson': z.string(),
})

const _McpAppsCallToolResult_schema = () => z.object({
  'resultJson': z.string(),
})

const _McpAppsReadResourceRequest_schema = () => z.object({
  'serverName': z.string(),
  'uri': z.string(),
})

const _McpAppsReadResourceResult_schema = () => z.object({
  'resultJson': z.string(),
})

const _McpAppsListResourcesRequest_schema = () => z.object({
  'serverName': z.string(),
})

const _McpAppsListResourcesResult_schema = () => z.object({
  'resultJson': z.string(),
})

export const TYPERT = {
  package: '@z-y-q/dsh-mcp-apps',
  face: 'host',
  schemas: [],
  invocations: [
    {
      id: '@z-y-q/dsh-mcp-apps#mcp-apps/list',
      service: 'mcp-apps',
      namespace: 'mcp-apps',
      method: 'list',
      invocation: { kind: 'direct' },
      parameters: [],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-mcp-apps/client#McpAppsListResult',
        create: _McpAppsListResult_schema,
      },
      sourceLocation: { 'file': 'src/remote.ts', 'line': 118, 'column': 3 },
    },
    {
      id: '@z-y-q/dsh-mcp-apps#mcp-apps/resource',
      service: 'mcp-apps',
      namespace: 'mcp-apps',
      method: 'resource',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'request',
          wire: 'request',
          source: 'json',
          codec: {
            mode: 'strict',
            typeSymbol: 'dsh-mcp-apps/client#McpAppsResourceRequest',
            create: _McpAppsResourceRequest_schema,
          },
        },
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-mcp-apps/client#McpAppsResourceResult',
        create: _McpAppsResourceResult_schema,
      },
      sourceLocation: { 'file': 'src/remote.ts', 'line': 133, 'column': 3 },
    },
    {
      id: '@z-y-q/dsh-mcp-apps#mcp-apps/call-tool',
      service: 'mcp-apps',
      namespace: 'mcp-apps',
      method: 'call-tool',
      implementation: 'callTool',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'request',
          wire: 'request',
          source: 'json',
          codec: {
            mode: 'strict',
            typeSymbol: 'dsh-mcp-apps/client#McpAppsCallToolRequest',
            create: _McpAppsCallToolRequest_schema,
          },
        },
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-mcp-apps/client#McpAppsCallToolResult',
        create: _McpAppsCallToolResult_schema,
      },
      sourceLocation: { 'file': 'src/remote.ts', 'line': 148, 'column': 3 },
    },
    {
      id: '@z-y-q/dsh-mcp-apps#mcp-apps/read-resource',
      service: 'mcp-apps',
      namespace: 'mcp-apps',
      method: 'read-resource',
      implementation: 'readResource',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'request',
          wire: 'request',
          source: 'json',
          codec: {
            mode: 'strict',
            typeSymbol: 'dsh-mcp-apps/client#McpAppsReadResourceRequest',
            create: _McpAppsReadResourceRequest_schema,
          },
        },
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-mcp-apps/client#McpAppsReadResourceResult',
        create: _McpAppsReadResourceResult_schema,
      },
      sourceLocation: { 'file': 'src/remote.ts', 'line': 162, 'column': 3 },
    },
    {
      id: '@z-y-q/dsh-mcp-apps#mcp-apps/list-resources',
      service: 'mcp-apps',
      namespace: 'mcp-apps',
      method: 'list-resources',
      implementation: 'listResources',
      invocation: { kind: 'direct' },
      parameters: [
        {
          name: 'request',
          wire: 'request',
          source: 'json',
          codec: {
            mode: 'strict',
            typeSymbol: 'dsh-mcp-apps/client#McpAppsListResourcesRequest',
            create: _McpAppsListResourcesRequest_schema,
          },
        },
      ],
      result: {
        mode: 'strict',
        typeSymbol: 'dsh-mcp-apps/client#McpAppsListResourcesResult',
        create: _McpAppsListResourcesResult_schema,
      },
      sourceLocation: { 'file': 'src/remote.ts', 'line': 172, 'column': 3 },
    },
  ],
  model: {
    services: [
      {
        description: 'MCP Apps RPC for the browser toolviews.',
        summary: 'MCP Apps RPC for the browser toolviews.',
        tags: [],
        jsDoc: '',
        key: 'mcp-apps',
        exportName: 'McpAppsRemoteService',
        members: [],
        types: [
          {
            'name': 'McpAppsListResult',
            'declaration': 'export interface McpAppsListResult {\n    apps: McpAppToolInfo[];\n    sandboxOrigin: string;\n}',
          },
          {
            'name': 'McpAppsResourceResult',
            'declaration': 'export interface McpAppsResourceResult {\n    html: string;\n    cspJson: string | null;\n    permissionsJson: string | null;\n    sandboxOrigin: string;\n    sandboxKey: string;\n}',
          },
        ],
    }],
    events: [],
    objects: [],
  },
}

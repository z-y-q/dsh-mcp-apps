/* Hand-maintained Typert remote-client artifact for dsh-mcp-apps.
 * Mirrors the generator's client-face emission for the five @Remote methods
 * declared in src/remote.ts; the browser entry $mount()s this contribution. */
import { z } from 'zod'

const _McpAppsListResult_schema = () => z.object({
  'apps': z.array(z.object({
    'toolName': z.string(),
    'serverName': z.string(),
    'resourceUri': z.string(),
  })),
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

export const TYPERT_REMOTE = {
  package: '@z-y-q/dsh-mcp-apps',
  descriptors: [
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
    },
    {
      id: '@z-y-q/dsh-mcp-apps#mcp-apps/call-tool',
      service: 'mcp-apps',
      namespace: 'mcp-apps',
      method: 'call-tool',
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
    },
    {
      id: '@z-y-q/dsh-mcp-apps#mcp-apps/read-resource',
      service: 'mcp-apps',
      namespace: 'mcp-apps',
      method: 'read-resource',
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
    },
    {
      id: '@z-y-q/dsh-mcp-apps#mcp-apps/list-resources',
      service: 'mcp-apps',
      namespace: 'mcp-apps',
      method: 'list-resources',
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
    },
  ],
}

export default TYPERT_REMOTE

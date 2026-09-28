/** Persistent mini MCP server for the real-stack e2e: one tool with a ui:// App resource. */
import { createServer } from 'node:http'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {
  CallToolRequestSchema, ListToolsRequestSchema,
  ListResourcesRequestSchema, ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const PORT = Number(process.env.PORT ?? 3927)
const APP_HTML = '<!doctype html><html><body style="font-family:sans-serif"><h1>DEMO APP OK</h1><p>rendered from ui://demo-app</p></body></html>'
const CSP = { connectDomains: ['api.example.com'] }
const PERMISSIONS = { camera: true }

function makeServer() {
  const server = new Server({ name: 'demo-mcp', version: '1.0.0' }, { capabilities: { tools: {}, resources: {} } })
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [{
      name: 'demo_app',
      description: 'Demo tool with an App view',
      inputSchema: { type: 'object', properties: {} },
      _meta: { ui: { resourceUri: 'ui://demo-app' } },
    }],
  }))
  server.setRequestHandler(CallToolRequestSchema, async (request) => ({
    content: [{ type: 'text', text: `called ${request.params.name}` }],
  }))
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [{ uri: 'ui://demo-app', name: 'demo', mimeType: 'text/html;profile=mcp-app', _meta: { ui: { csp: CSP, permissions: PERMISSIONS } } }],
  }))
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => ({
    contents: [{ uri: request.params.uri, mimeType: 'text/html;profile=mcp-app', text: APP_HTML, _meta: { ui: { csp: CSP, permissions: PERMISSIONS } } }],
  }))
  return server
}

const httpServer = createServer(async (req, res) => {
  if (req.url !== '/mcp') { res.writeHead(404); res.end(); return }
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
  res.on('close', () => transport.close())
  await makeServer().connect(transport)
  await transport.handleRequest(req, res)
})
httpServer.listen(PORT, '127.0.0.1', () => console.log(`demo-mcp listening on http://127.0.0.1:${PORT}/mcp`))

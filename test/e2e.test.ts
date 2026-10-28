/**
 * End-to-end: a real MCP server over Streamable HTTP carrying a `ui://` App
 * resource -> this bundle's host half (real SDK client, discovery, resource
 * read, token-gated loopback RPC) -> the browser half's registration flow over
 * real HTTP. Everything between is the real shipped code.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'node:http'
import { readFileSync } from 'node:fs'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {
  CallToolRequestSchema, ListToolsRequestSchema,
  ListResourcesRequestSchema, ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'

const APP_HTML = '<!doctype html><html><body><h1>DEMO APP OK</h1></body></html>'
const CSP = { connectDomains: ['api.example.com'] }
const PERMISSIONS = { camera: true }

function makeServer(): Server {
  const server = new Server({ name: 'demo-mcp', version: '1.0.0' }, { capabilities: { tools: {}, resources: {} } })
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [{
      name: 'demo_app',
      description: 'Demo tool with an App view',
      inputSchema: { type: 'object' as const, properties: {} },
      _meta: { ui: { resourceUri: 'ui://demo-app' } },
    }],
  }))
  server.setRequestHandler(CallToolRequestSchema, async (request) => ({
    content: [{ type: 'text', text: `called ${request.params.name}` }],
  }))
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [{
      uri: 'ui://demo-app', name: 'demo', mimeType: 'text/html;profile=mcp-app',
      _meta: { ui: { csp: CSP, permissions: PERMISSIONS } },
    }],
  }))
  server.setRequestHandler(ReadResourceRequestSchema, async (request) => ({
    contents: [{
      uri: request.params.uri, mimeType: 'text/html;profile=mcp-app', text: APP_HTML,
      _meta: { ui: { csp: CSP, permissions: PERMISSIONS } },
    }],
  }))
  return server
}

async function startMcpServer(): Promise<{ url: string; close: () => void }> {
  const httpServer = createServer(async (req, res) => {
    if (req.url !== '/mcp') { res.writeHead(404); res.end(); return }
    // Stateless: one Server + transport pair per request.
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
    res.on('close', () => transport.close())
    await makeServer().connect(transport)
    await transport.handleRequest(req, res)
  })
  await new Promise<void>((resolve) => httpServer.listen(0, '127.0.0.1', resolve))
  const { port } = httpServer.address()
  return { url: `http://127.0.0.1:${port}/mcp`, close: () => httpServer.close() }
}

test('end to end: mcp server -> host discovery -> token RPC -> sandbox -> client registration', async () => {
  const mcp = await startMcpServer()
  const plugin = await import('../lib/index.js')

  // Boot the host half; capture the endpoint bootstrap exactly as the settings
  // namespace would receive it.
  let endpointInfo: { origin: string; token: string } | null = null
  const effects: (() => void)[] = []
  const ctx = {
    logger: { warn: (message: string) => console.warn('warn:', message) },
    // Optional collaborators come from the reflection layer; the real Context
    // has `get`, so the stub must too (no auth bundle in this fixture).
    get: () => undefined,
    // cordis Service 构造会向 ctx.reflect.provide 注册自身(Real Context 同款)
    reflect: { provide: () => () => {} },
    // Hard inject of this bundle: record registrations (registerTools defaults
    // to false, so none are expected in this fixture).
    tools: { registered: new Map(), register: (definition: { name: string }) => { throw new Error('registerTools should be off by default') } },
    loader: {
      entries: () => [{
        options: {
          name: '@deepseek-ai/dsh-mcp-client',
          disabled: false,
          config: { transport: 'streamable-http', serverName: 'demo', url: mcp.url },
        },
      }],
    },
    settings: {
      register: (_ns: string, schema: { (value: {}): object }) => ({
        get: () => schema({}),
        update: async (patch: { endpointJson: string }) => { endpointInfo = JSON.parse(patch.endpointJson) },
      }),
    },
    effect: (setup: () => (() => void) | void) => {
      const dispose = setup()
      if (typeof dispose === 'function') effects.push(dispose)
      return () => {}
    },
  }
  await plugin.apply(ctx, plugin.Config({}))
  assert.notEqual(endpointInfo, null)

  // The browser half's RPC face: real HTTP against the token-gated listener.
  const rpc = {
    call: async <T,>(endpoint: string, payload: unknown): Promise<T> => {
      const response = await fetch(`${endpointInfo!.origin}/rpc/${endpoint}`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${endpointInfo!.token}` },
        body: JSON.stringify(payload ?? {}),
      })
      return await response.json() as T
    },
  }

  // list: the tool is discovered with its exact public wire name.
  const list = await rpc.call<{ ok: boolean; value: { apps: { toolName: string; serverName: string; resourceUri: string }[]; sandboxOrigin: string } }>('list', {})
  assert.equal(list.ok, true)
  assert.deepEqual(list.value.apps, [{ toolName: 'mcp__demo__demo_app', serverName: 'demo', resourceUri: 'ui://demo-app' }])

  // resource: HTML plus CSP/permissions metadata round-trip from the server.
  const resource = await rpc.call<{ ok: boolean; value: { html: string; cspJson: string | null; permissionsJson: string | null; sandboxOrigin: string } }>('resource', { toolName: 'mcp__demo__demo_app' })
  assert.equal(resource.ok, true)
  assert.equal(resource.value.html, APP_HTML)
  assert.deepEqual(JSON.parse(resource.value.cspJson!), CSP)
  assert.deepEqual(JSON.parse(resource.value.permissionsJson!), PERMISSIONS)

  // sandbox listener: the resource's own CSP reaches the proxy page header.
  const page = await fetch(`${resource.value.sandboxOrigin}/sandbox.html?csp=${encodeURIComponent(resource.value.cspJson!)}`)
  assert.equal(page.status, 200)
  assert.match(page.headers.get('content-security-policy')!, /connect-src 'self' api\.example\.com/)
  assert.match(await page.text(), /sandbox-proxy-ready/)

  // tool passthrough from an App reaches the real MCP server.
  const call = await rpc.call<{ ok: boolean; value: { content: { text: string }[] } }>('call-tool', { serverName: 'demo', name: 'demo_app', arguments: {} })
  assert.equal(call.ok, true)
  assert.equal(call.value.content[0].text, 'called demo_app')

  // browser half: load the BUILT lib/client.js through the module-table handoff
  // and drive it with the settings bootstrap + real HTTP RPC.
  const clientPlugin = await import('node:vm').then((vm) => {
    let factory: ((require: (name: string) => unknown) => Record<string, unknown>) | undefined
    ;(globalThis as Record<string, unknown>).window = {
      __ModuleLoader__: { load: (value: { factory: typeof factory }) => { factory = value.factory } },
    }
    ;(globalThis as Record<string, unknown>).document = {
      head: { appendChild: () => {} },
      createElement: () => ({ dataset: {}, remove: () => {} }),
    }
    const source = readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8')
    vm.runInThisContext(source, { filename: 'client.js' })
    const React = {
      createElement: (type: unknown, props: unknown, ...children: unknown[]) => ({ type, props, children }),
      useEffect: () => {}, useState: (v: unknown) => [v, () => {}], useRef: () => ({}),
    }
    assert.ok(factory !== undefined, 'module-table handoff captured the factory')
    return factory!((name) => {
      assert.equal(name, 'react')
      return React
    })
  })
  const registrations: { options: { name: string; key: string; inject?: unknown }; component: unknown }[] = []
  let injectedSlot: (() => () => void) | null = null
  const clientCtx = {
    // The browser half reads the bootstrap through `ctx.remote.settings`
    // (the ConnectionHandle exposes no `api`), so the stub mirrors that face.
    remote: {
      settings: {
        describe: async () => ({
          value: { namespaces: [{ ns: 'mcp-apps', value: { endpointJson: JSON.stringify(endpointInfo) } }] },
        }),
      },
    },
    slots: {
      inject: (name: string, install: () => () => void) => {
        assert.equal(name, 'tool.call.toolview')
        injectedSlot = install
        return () => {}
      },
      register: (options: { name: string; key: string; inject?: unknown }, component: unknown) => {
        registrations.push({ options, component })
        return () => {}
      },
    },
    on: () => () => {},
  }
  await (clientPlugin.apply as (ctx: unknown) => Promise<void>)(clientCtx)
  // The list round-trip is async; poll until the registration lands.
  for (let i = 0; i < 100 && registrations.length === 0; i++) await new Promise((r) => setTimeout(r, 20))
  assert.notEqual(injectedSlot, null)
  injectedSlot!()
  assert.equal(registrations.length, 1)
  assert.equal(registrations[0].options.name, 'tool.call.toolview')
  assert.equal(registrations[0].options.key, 'mcp__demo__demo_app')
  assert.equal(typeof registrations[0].component, 'function')
  const injectShare = (registrations[0].options.inject as () => { rpc: { call: unknown } })()
  assert.equal(typeof injectShare.rpc.call, 'function')

  for (const dispose of effects) if (typeof dispose === 'function') dispose()
  mcp.close()
}, 30000)

/**
 * Regression: a row config reused from the loader keeps its `!!js` values as
 * serialized `{__jsExpr}` nodes, so reading them verbatim (the pre-fix
 * behaviour) hands the transport a headers object that sends no
 * `Authorization` at all — indistinguishable from a server-side 401.
 *
 * The tests drive the real `discoverServerConfigs` / `connectAndDiscover` path
 * against a real MCP server that requires the header, plus a control case with
 * a literal header.
 */
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createServer } from 'node:http'
import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import {
  ListToolsRequestSchema, ListResourcesRequestSchema, ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js'
import { discoverServerConfigs, resolveJsExprs, isJsExprNode, connectAndDiscover } from '../src/connections.ts'

const SECRET = 'Bearer SECRET-TOKEN'

test('isJsExprNode only accepts the serialized loader tag', () => {
  assert.equal(isJsExprNode({ __jsExpr: 'a' }), true)
  assert.equal(isJsExprNode({ __jsExpr: 1 }), false)
  assert.equal(isJsExprNode({ headers: {} }), false)
  assert.equal(isJsExprNode(null), false)
  assert.equal(isJsExprNode('__jsExpr'), false)
})

test('the row fiber config wins over the serialized row (the live dsh path)', async (t) => {
  const guarded = await startGuardedServer()
  t.after(() => guarded.close())

  // A started row: `options.config` still holds the serialized `!!js` node while
  // `fiber.config` holds what the loader interpolated in the row's own scope —
  // that scope is the only one where `ctx.mcpAuth` is reachable, so reading the
  // fiber is what makes injected credentials show up here.
  const { ctx, warnings } = ctxFor({
    options: {
      id: 'demo-row',
      name: '@deepseek-ai/dsh-mcp-client',
      disabled: false,
      config: {
        transport: 'streamable-http',
        serverName: 'demo',
        url: guarded.url,
        headers: { __jsExpr: "ctx.mcpAuth.headers('demo')" },
      },
    },
    fiber: {
      config: {
        transport: 'streamable-http',
        serverName: 'demo',
        url: guarded.url,
        toolCallTimeoutMs: 30000,
        failOnStartupError: false,
        headers: { authorization: SECRET },
      },
    },
    evaluate: () => { throw new Error('must not be called: the fiber config already resolved') },
  })

  const configs = discoverServerConfigs(ctx, [])
  assert.deepEqual(configs[0].headers, { authorization: SECRET })
  assert.deepEqual(warnings, [])

  const connected = await connectAndDiscover(configs[0])
  assert.equal(connected.apps.length, 1)
  assert.ok(guarded.seen.every((value) => value === SECRET))
})

test('without a fiber the raw row is walked and its nodes reported', () => {
  const warnings = []
  const { ctx } = ctxFor({
    options: {
      id: 'demo-row',
      name: '@deepseek-ai/dsh-mcp-client',
      disabled: false,
      config: { transport: 'streamable-http', serverName: 'demo', url: 'http://127.0.0.1:1/mcp', headers: { __jsExpr: 'ctx.mcpAuth.headers("demo")' } },
    },
    evaluate: () => { throw new Error('cannot get property "mcpAuth" without inject') },
  })
  ctx.logger.warn = (message) => warnings.push(String(message))
  const configs = discoverServerConfigs(ctx, [])
  assert.deepEqual(configs[0].headers, { __jsExpr: 'ctx.mcpAuth.headers("demo")' })
  assert.equal(warnings.length, 1)
  assert.match(warnings[0], /without inject.*the row must be started/)
})

test('resolveJsExprs walks nested config and reports unevaluable nodes', () => {
  const entry = { options: {}, evaluate: (expr) => expr.split('+').length }
  assert.deepEqual(
    resolveJsExprs(entry, { headers: { a: { __jsExpr: 'x+y' } }, list: [{ __jsExpr: 'x' }] }, () => {}),
    { headers: { a: 2 }, list: [1] },
  )

  const warnings = []
  const burst = { options: {}, evaluate: () => { throw new Error('boom') } }
  assert.deepEqual(
    resolveJsExprs(burst, { headers: { __jsExpr: 'x' } }, (m) => warnings.push(m)),
    { headers: { __jsExpr: 'x' } },
  )
  assert.equal(warnings.length, 1)
  assert.match(warnings[0], /config\.headers "!!js" expression failed to evaluate: boom/)

  const warnings2 = []
  assert.deepEqual(
    resolveJsExprs({ options: {} }, { headers: { __jsExpr: 'x' } }, (m) => warnings2.push(m)),
    { headers: { __jsExpr: 'x' } },
  )
  assert.match(warnings2[0], /exposes no evaluate\(\)/)
})

test('a literal row config passes through untouched and silently', () => {
  const warnings = []
  const entry = { options: {}, evaluate: () => { throw new Error('must not be called') } }
  const config = { transport: 'stdio', serverName: 'demo', command: 'node', args: ['a'] }
  assert.deepEqual(resolveJsExprs(entry, config, (m) => warnings.push(m)), config)
  assert.deepEqual(warnings, [])
})

function makeServer() {
  const server = new Server({ name: 'demo-mcp', version: '1.0.0' }, { capabilities: { tools: {}, resources: {} } })
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [{ name: 'demo_app', description: 'App tool', inputSchema: { type: 'object', properties: {} }, _meta: { ui: { resourceUri: 'ui://demo-app' } } }],
  }))
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [{ uri: 'ui://demo-app', name: 'demo', mimeType: 'text/html;profile=mcp-app' }],
  }))
  server.setRequestHandler(ReadResourceRequestSchema, async (r) => ({
    contents: [{ uri: r.params.uri, mimeType: 'text/html;profile=mcp-app', text: '<h1>APP</h1>' }],
  }))
  return server
}

/** A guarded MCP server: it answers 401 unless the injected header arrived. */
async function startGuardedServer() {
  const seen = []
  const httpServer = createServer(async (req, res) => {
    seen.push(req.headers.authorization ?? null)
    if (req.headers.authorization !== SECRET) {
      res.writeHead(401, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32001, message: 'unauthorized' }, id: null }))
      return
    }
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined })
    res.on('close', () => transport.close())
    await makeServer().connect(transport)
    await transport.handleRequest(req, res)
  })
  await new Promise((resolve) => httpServer.listen(0, '127.0.0.1', resolve))
  return { url: `http://127.0.0.1:${httpServer.address().port}/mcp`, seen, close: () => httpServer.close() }
}

function ctxFor(entry) {
  const warnings = []
  return {
    warnings,
    ctx: {
      logger: { warn: (message) => warnings.push(String(message)) },
      loader: { entries: () => [entry] },
    },
  }
}

test('an injected !!js header reaches the App discovery connection', async (t) => {
  const guarded = await startGuardedServer()
  t.after(() => guarded.close())

  const { ctx, warnings } = ctxFor({
    options: {
      id: 'demo-row',
      name: '@deepseek-ai/dsh-mcp-client',
      disabled: false,
      // What a real tree stores for `headers: !!js ctx.mcpAuth.headers('demo')`.
      config: {
        transport: 'streamable-http',
        serverName: 'demo',
        url: guarded.url,
        headers: { __jsExpr: "({ authorization: 'Bearer ' + 'SECRET-TOKEN' })" },
      },
    },
    // The loader's own `Entry.evaluate`, which runs the expression in the
    // entry's context scope.
    evaluate: (expr) => (0, eval)(expr),
  })

  const configs = discoverServerConfigs(ctx, [])
  assert.equal(configs.length, 1)
  assert.deepEqual(configs[0].headers, { authorization: SECRET })
  assert.deepEqual(warnings, [])

  const connected = await connectAndDiscover(configs[0])
  assert.equal(connected.apps.length, 1)
  assert.equal(connected.apps[0].toolName, 'mcp__demo__demo_app')
  assert.ok(guarded.seen.every((value) => value === SECRET))
})

test('an unresolvable !!js header is kept raw but reported', async (t) => {
  const guarded = await startGuardedServer()
  t.after(() => guarded.close())

  const { ctx, warnings } = ctxFor({
    options: {
      id: 'demo-row',
      name: '@deepseek-ai/dsh-mcp-client',
      disabled: false,
      config: { transport: 'streamable-http', serverName: 'demo', url: guarded.url, headers: { __jsExpr: 'ctx.mcpAuth.headers("demo")' } },
    },
  })

  const configs = discoverServerConfigs(ctx, [])
  assert.deepEqual(configs[0].headers, { __jsExpr: 'ctx.mcpAuth.headers("demo")' })
  assert.equal(warnings.length, 1)
  assert.match(warnings[0], /exposes no evaluate\(\)/)

  await assert.rejects(() => connectAndDiscover(configs[0]), /unauthorized/)
  assert.ok(guarded.seen.every((value) => value === null))
})

test('a literal header still works (control)', async (t) => {
  const guarded = await startGuardedServer()
  t.after(() => guarded.close())

  const { ctx, warnings } = ctxFor({
    options: {
      id: 'demo-row',
      name: '@deepseek-ai/dsh-mcp-client',
      disabled: false,
      config: { transport: 'streamable-http', serverName: 'demo', url: guarded.url, headers: { authorization: SECRET } },
    },
  })

  const configs = discoverServerConfigs(ctx, [])
  assert.deepEqual(warnings, [])
  const connected = await connectAndDiscover(configs[0])
  assert.equal(connected.apps.length, 1)
})

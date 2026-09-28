import assert from 'node:assert/strict'
import { test } from 'node:test'
import { publicToolName } from '../src/naming.ts'
import { sanitizeCspDomains, buildCspHeader } from '../src/csp.ts'
import { sandboxPageHtml } from '../src/sandbox-page.ts'
import { SandboxServer } from '../src/sandbox-server.ts'
import { stripAuthorization } from '../src/connections.ts'

test('stripAuthorization hands authorization to the authProvider alone', () => {
  // The SDK spreads requestInit.headers *after* the bearer it derives from the
  // provider, so a stale static Authorization silently overrides the fresh
  // token. The row config always carries one (mcp-client rows inject
  // `!!js ctx.mcpAuth.headers(...)`), so this must drop it whenever a provider
  // is installed. Case-insensitive: header names are.
  const configured = { Authorization: 'Bearer stale', authorization: 'Bearer also-stale', 'x-api-key': 'keep-me' }
  assert.deepEqual(stripAuthorization(configured), { 'x-api-key': 'keep-me' })
  // The caller's object must not be mutated: it is the row's own config.
  assert.equal(configured.Authorization, 'Bearer stale')
  assert.deepEqual(stripAuthorization({}), {})
  assert.deepEqual(stripAuthorization({ 'x-mcp-token': 'v' }), { 'x-mcp-token': 'v' })
})

test('publicToolName matches the official mcp-client vectors', () => {
  assert.equal(publicToolName('github', 'create_issue'), 'mcp__github__create_issue')
  assert.equal(publicToolName('everything', 'get-sum'), 'mcp__everything__get-sum')
  assert.notEqual(publicToolName('x', 'admin.reset'), publicToolName('x', 'admin_reset'))
})

test('sanitizeCspDomains rejects directive-breaking entries', () => {
  assert.deepEqual(
    sanitizeCspDomains(['good.example', "evil'; script-src", 'with space', 42, undefined]),
    ['good.example'],
  )
  assert.deepEqual(sanitizeCspDomains(undefined), [])
})

test('buildCspHeader locks down frame/object/base-uri by default', () => {
  const header = buildCspHeader(undefined)
  assert.match(header, /frame-src 'none'/)
  assert.match(header, /object-src 'none'/)
  assert.match(header, /base-uri 'none'/)
  const withDomains = buildCspHeader({ connectDomains: ['api.example'], frameDomains: ['maps.example'] })
  assert.match(withDomains, /connect-src 'self' api\.example/)
  assert.match(withDomains, /frame-src maps\.example/)
})

test('sandbox page is self-contained and carries the relay', () => {
  const html = sandboxPageHtml()
  assert.doesNotMatch(html, /<script[^>]+src=/)
  assert.match(html, /sandbox-resource-ready/)
  assert.match(html, /sandbox-proxy-ready/)
  assert.match(html, /allow-scripts allow-same-origin allow-forms/)
})

test('sandbox server serves only sandbox.html with CSP headers', async () => {
  const server = new SandboxServer()
  await server.start(0)
  assert.match(server.origin, /^http:\/\/127\.0\.0\.1:\d+$/)
  const good = await fetch(`${server.origin}/sandbox.html?csp=${encodeURIComponent(JSON.stringify({ connectDomains: ['api.example'] }))}`)
  assert.equal(good.status, 200)
  assert.match(good.headers.get('content-security-policy') ?? '', /connect-src 'self' api\.example/)
  assert.match(good.headers.get('cache-control') ?? '', /no-store/)
  const bad = await fetch(`${server.origin}/api/anything`)
  assert.equal(bad.status, 404)
  server.stop()
})

test('built host half exports the plugin shape', async () => {
  const plugin = await import('../lib/index.js')
  assert.equal(plugin.name, 'mcp-apps')
  // 'tools' joined 'settings' with the tool-registration bridge: the harness
  // tools runtime is what the bridge registers definitions on.
  assert.deepEqual(plugin.inject, ['settings', 'tools'])
  assert.equal(typeof plugin.apply, 'function')
  assert.equal(typeof plugin.Config, 'function')
})

test('host apply publishes endpoint bootstrap and serves token-gated RPC', async () => {
  const plugin = await import('../lib/index.js')
  const resolved = plugin.Config({})
  let endpointInfo = null
  const effects = []
  const ctx = {
    logger: { warn: () => {} },
    // Optional collaborators are resolved through the reflection layer; a stub
    // that omits `get` is not the real Context and would fail apply().
    get: () => undefined,
    loader: { entries: () => [] },
    // The harness tools runtime is a hard inject of this bundle; the stub
    // records registrations so tests can assert the bridge's behaviour.
    tools: (() => {
      const registered = new Map()
      return {
        registered,
        register: (definition) => { registered.set(definition.name, definition); return () => registered.delete(definition.name) },
      }
    })(),
    settings: {
      register: (ns, schema) => ({
        get: () => schema({}),
        update: async (patch) => {
          const parsed = JSON.parse(patch.endpointJson)
          endpointInfo = parsed
        },
      }),
    },
    effect: (setup) => { effects.push(setup()); return () => {} },
  }
  await plugin.apply(ctx, resolved)
  assert.notEqual(endpointInfo, null)
  assert.match(endpointInfo.origin, /^http:\/\/127\.0\.0\.1:\d+$/)
  assert.equal(typeof endpointInfo.token, 'string')

  const call = async (endpoint, payload) => {
    const response = await fetch(`${endpointInfo.origin}/rpc/${endpoint}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${endpointInfo.token}` },
      body: JSON.stringify(payload ?? {}),
    })
    return response.json()
  }
  const list = await call('list', {})
  assert.equal(list.ok, true)
  assert.deepEqual(list.value.apps, [])
  assert.equal(list.value.sandboxOrigin, endpointInfo.origin)
  const unknown = await call('nope', {})
  assert.equal(unknown.ok, false)
  const wrongToken = await fetch(`${endpointInfo.origin}/rpc/list`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: 'Bearer wrong' },
    body: '{}',
  })
  assert.equal(wrongToken.status, 401)
  for (const dispose of effects) if (typeof dispose === 'function') dispose()
})

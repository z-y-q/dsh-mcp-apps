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
  const html = sandboxPageHtml('test-embed-key')
  assert.doesNotMatch(html, /<script[^>]+src=/)
  assert.match(html, /sandbox-resource-ready/)
  assert.match(html, /sandbox-proxy-ready/)
  assert.match(html, /allow-scripts allow-same-origin allow-forms/)
  // The per-boot embed key is inlined for the no-referrer (desktop) handshake.
  assert.match(html, /"test-embed-key"/)
  assert.match(html, /__sandboxKey/)
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
  // Only the harness tools runtime is a hard inject: optional collaborators
  // (settings, mcpAuth) are resolved through ctx.get at apply time.
  assert.deepEqual(plugin.inject, ['tools'])
  assert.equal(typeof plugin.apply, 'function')
  assert.equal(typeof plugin.Config, 'function')
})

test('sandbox listener serves token-gated RPC with a per-boot embed key', async () => {
  const server = new SandboxServer()
  server.setRpcHandler(async (endpoint) => ({ ok: true, value: { endpoint } }))
  await server.start(0)
  assert.match(server.origin, /^http:\/\/127\.0\.0\.1:\d+$/)
  assert.equal(typeof server.rpcToken, 'string')
  assert.equal(typeof server.embedKey, 'string')
  assert.notEqual(server.embedKey, '')
  // The embed key is inlined into the served page (no-referrer handshake).
  const page = await fetch(`${server.origin}/sandbox.html`)
  assert.match(await page.text(), new RegExp(server.embedKey))
  // RPC without the per-boot bearer is refused.
  const anon = await fetch(`${server.origin}/rpc/list`, {
    method: 'POST', headers: { 'content-type': 'application/json' }, body: '{}',
  })
  assert.equal(anon.status, 401)
  const authed = await fetch(`${server.origin}/rpc/list`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${server.rpcToken}` },
    body: '{}',
  })
  assert.equal(authed.status, 200)
  assert.equal((await authed.json()).ok, true)
  const wrongToken = await fetch(`${server.origin}/rpc/list`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: 'Bearer wrong' },
    body: '{}',
  })
  assert.equal(wrongToken.status, 401)
  server.stop()
})

/**
 * Tool-bridge tests: the bridge must register tools under exactly the official
 * mcp-client's public names and shapes, skip (never hijack) names the official
 * row already owns, and route execution through the live-credential retry.
 */

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { registerServerTools, withLiveCredentials } from '../src/tool-bridge.ts'

/** A fake harness tools runtime that records registrations. */
function fakeRuntime({ owned = [] } = {}) {
  const registered = new Map()
  const warnings = []
  const register = (definition) => {
    if (owned.includes(definition.name)) {
      throw new Error(`tool "${definition.name}" is already registered (for a per-agent variant, register through that agent's \`agent.ctx\` instead)`)
    }
    registered.set(definition.name, definition)
    return () => registered.delete(definition.name)
  }
  return { registered, register, warnings }
}

const tool = (name, extra = {}) => ({
  name,
  description: `${name} description`,
  inputSchema: { type: 'object', properties: {} },
  ...extra,
})

test('registers under the official public names and disposes cleanly', () => {
  const runtime = fakeRuntime()
  const call = async () => ({ content: [{ type: 'text', text: 'ok' }] })
  const { disposers, skipped } = registerServerTools('lazy-auth', [
    tool('get_secret'), tool('show_auth_button'),
  ], call, { runtime: { register: runtime.register }, warn: (m) => runtime.warnings.push(m) })

  assert.deepEqual([...disposers.keys()].sort(), ['mcp__lazy-auth__get_secret', 'mcp__lazy-auth__show_auth_button'])
  assert.deepEqual(skipped, [])
  assert.deepEqual(runtime.warnings, [])
  for (const dispose of disposers.values()) dispose()
  assert.equal(runtime.registered.size, 0)
})

test('an already-registered name is skipped with a warning, never hijacked', () => {
  // The official mcp-client row owns the name; the bridge must leave it alone.
  const runtime = fakeRuntime({ owned: ['mcp__lazy-auth__get_secret'] })
  const call = async () => ({ content: [] })
  const { disposers, skipped } = registerServerTools('lazy-auth', [
    tool('get_secret'), tool('show_auth_button'),
  ], call, { runtime: { register: runtime.register }, warn: (m) => runtime.warnings.push(m) })

  assert.deepEqual(skipped, ['mcp__lazy-auth__get_secret'])
  assert.deepEqual([...disposers.keys()], ['mcp__lazy-auth__show_auth_button'])
  assert.equal(runtime.warnings.length, 1)
  assert.match(runtime.warnings[0], /already registered/)
  // And the definition the official row owns is not our execute.
  assert.ok(!runtime.registered.has('mcp__lazy-auth__get_secret'))
})

test('a duplicate raw tool listing is rejected as an invalid tool list', () => {
  const runtime = fakeRuntime()
  const call = async () => ({ content: [] })
  assert.throws(
    () => registerServerTools('x', [tool('dup'), tool('dup')], call, { runtime: { register: runtime.register }, warn: () => {} }),
    /listed tool "dup" more than once/,
  )
  assert.equal(runtime.registered.size, 0)
})

test('execute maps content, structuredContent, and isError like the official bridge', async () => {
  const runtime = fakeRuntime()
  const calls = []
  const call = async (rawName) => {
    calls.push(rawName)
    return { content: [{ type: 'text', text: `hello ${rawName}` }], structuredContent: { sum: 42 } }
  }
  const { disposers } = registerServerTools('s', [tool('add')], call, { runtime: { register: runtime.register }, warn: () => {} })
  const definition = runtime.registered.get('mcp__s__add')
  const signal = new AbortController().signal
  const value = await definition.execute({ a: 1 }, { signal })
  assert.deepEqual(calls, ['add'])
  assert.deepEqual(value.content, [{ type: 'text', text: 'hello add' }])
  assert.deepEqual(value.structuredContent, { sum: 42 })
  // render extracts the text blocks
  const rendered = definition.output.render({}, value)
  assert.deepEqual(rendered, [{ type: 'text', text: 'hello add' }])
  // the raw name goes on the wire, never the public name
  for (const dispose of disposers.values()) dispose()
})

test('isError throws; taskSupport required fails at call time with the official message', async () => {
  const runtime = fakeRuntime()
  const failing = async () => ({ content: [{ type: 'text', text: 'denied' }], isError: true })
  const { disposers } = registerServerTools('s', [tool('get'), tool('task', { execution: { taskSupport: 'required' } })], failing, { runtime: { register: runtime.register }, warn: () => {} })

  await assert.rejects(
    () => runtime.registered.get('mcp__s__get').execute({}, { signal: new AbortController().signal }),
    /denied/,
  )
  await assert.rejects(
    () => runtime.registered.get('mcp__s__task').execute({}, { signal: new AbortController().signal }),
    /requires task-based execution, which this bridge does not support/,
  )
  for (const dispose of disposers.values()) dispose()
})

test('withLiveCredentials retries once after a successful authorize', async () => {
  const attempts = []
  const call = async () => {
    attempts.push('call')
    if (attempts.length === 1) {
      const error = new Error('Refresh token invalid or revoked')
      throw error
    }
    return { content: [{ type: 'text', text: 'after retry' }] }
  }
  const auth = {
    provider: {} ,
    authorize: async () => 'AUTHORIZED' ,
    authorizationUrl: () => null,
    lastError: () => null,
    dispose: () => {},
  }
  const wrapped = withLiveCredentials(auth, (signal, rawName, args) => call())
  const value = await wrapped('get', {}, new AbortController().signal)
  assert.deepEqual(attempts, ['call', 'call'])
  assert.equal(value.content[0].text, 'after retry')
})

test('withLiveCredentials rethrows when authorize fails, and never retries without a handle', async () => {
  let attempts = 0
  const call = async () => {
    attempts += 1
    throw new Error('Refresh token invalid or revoked')
  }
  const failed = { provider: {} , authorize: async () => 'FAILED' , authorizationUrl: () => null, lastError: () => 'x', dispose: () => {} }
  await assert.rejects(() => withLiveCredentials(failed, (s, n, a) => call())('g', {}, new AbortController().signal), /Refresh token/)
  assert.equal(attempts, 1) // authorize FAILED: no new credentials, no retry

  attempts = 0
  await assert.rejects(() => withLiveCredentials(undefined, (s, n, a) => call())('g', {}, new AbortController().signal), /Refresh token/)
  assert.equal(attempts, 1) // no handle: no retry
})

test('an unrelated error is not treated as an auth failure', async () => {
  const call = async () => { throw new Error('connection reset by peer') }
  const auth = { provider: {} , authorize: async () => { throw new Error('must not be called') }, authorizationUrl: () => null, lastError: () => null, dispose: () => {} }
  await assert.rejects(() => withLiveCredentials(auth, (s, n, a) => call())('g', {}, new AbortController().signal), /connection reset/)
})

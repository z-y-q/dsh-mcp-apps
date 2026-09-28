/**
 * The mcp-apps loopback listener. Serves TWO purposes on one origin:
 *
 * 1. `GET /sandbox.html` — the separate-origin sandbox proxy page with the
 *    resource-declared CSP as an HTTP response header.
 * 2. `POST /rpc/<endpoint>` — this bundle's private RPC: a random per-boot
 *    bearer token (published to the browser only through the authenticated
 *    settings namespace) gates every call, and CORS echoes the caller because
 *    the dsh GUI origin differs from this port by design.
 *
 * A SEPARATE PORT from the dsh web server is REQUIRED for the sandbox: the
 * inner App iframe carries `allow-same-origin`, so sharing the dsh port would
 * make untrusted App HTML same-origin with the dsh API.
 *
 * @module dsh-mcp-apps/sandbox-server
 */

import { createServer, type Server } from 'node:http'
import type { AddressInfo } from 'node:net'
import { randomUUID } from 'node:crypto'
import { buildCspHeader, type McpResourceCsp } from './csp.ts'
import { sandboxPageHtml } from './sandbox-page.ts'

/** The one sandbox path; every other non-rpc path is a 404. */
const SANDBOX_PATH = '/sandbox.html'
/** RPC paths are `/rpc/<endpoint>`; endpoint segments match the harness rules. */
const RPC_PREFIX = '/rpc/'
const ENDPOINT_PATTERN = /^[A-Za-z0-9_$.-]+$/
/** Request body cap for RPC calls. */
const MAX_RPC_BODY_BYTES = 5 * 1024 * 1024

export class SandboxServer {
  private server: Server | undefined
  private originValue = ''
  private token = ''
  private rpcHandler: ((endpoint: string, payload: unknown) => Promise<unknown>) | undefined

  /** Resolved origin (`http://127.0.0.1:<port>`), set once `start` succeeds. */
  get origin(): string {
    return this.originValue
  }

  /** The per-boot bearer token RPC callers must present. */
  get rpcToken(): string {
    return this.token
  }

  /**
   * Bind the loopback listener.
   * @param port - configured port; 0 lets the OS assign one.
   */
  start(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = createServer((req, res) => {
        void this.dispatch(req, res)
      })
      server.once('error', reject)
      // Loopback only: the sandbox origin must never be LAN-reachable.
      server.listen(port, '127.0.0.1', () => {
        const address = server.address() as AddressInfo
        this.server = server
        this.originValue = `http://127.0.0.1:${address.port}`
        this.token = randomUUID()
        resolve()
      })
    })
  }

  /**
   * Install the RPC handler (called for every authenticated request).
   * @param handler - endpoint dispatcher returning an RpcOutcome-shaped value.
   */
  setRpcHandler(handler: (endpoint: string, payload: unknown) => Promise<unknown>): void {
    this.rpcHandler = handler
  }

  private async dispatch(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse): Promise<void> {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1')
    if (url.pathname === SANDBOX_PATH) {
      this.serveSandbox(url, res)
      return
    }
    if (url.pathname.startsWith(RPC_PREFIX)) {
      await this.serveRpc(req, res, url)
      return
    }
    res.writeHead(404)
    res.end('Only sandbox.html and /rpc are served on this port')
  }

  private serveSandbox(url: URL, res: import('node:http').ServerResponse): void {
    if (res.req?.method !== undefined && res.req.method !== 'GET' && res.req.method !== 'HEAD') {
      res.writeHead(405)
      res.end()
      return
    }
    let csp: McpResourceCsp | undefined
    const raw = url.searchParams.get('csp')
    if (raw !== null) {
      try {
        csp = JSON.parse(raw) as McpResourceCsp
      } catch {
        // An unparsable csp param falls back to the restrictive default
        // header; it never widens permissions.
        csp = undefined
      }
    }
    res.setHeader('Content-Security-Policy', buildCspHeader(csp))
    // No caching so every load gets a fresh CSP for its resource.
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.setHeader('Pragma', 'no-cache')
    res.setHeader('Expires', '0')
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(sandboxPageHtml())
  }

  private async serveRpc(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse, url: URL): Promise<void> {
    const origin = req.headers.origin ?? ''
    this.cors(res, origin)
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }
    if (req.method !== 'POST') {
      res.writeHead(405, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: { code: 'method', message: 'POST only' } }))
      return
    }
    // The per-boot token is the gate; it reaches the browser only through the
    // authenticated settings channel.
    if (req.headers.authorization !== `Bearer ${this.token}`) {
      res.writeHead(401, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: { code: 'auth', message: 'invalid token' } }))
      return
    }
    const endpoint = url.pathname.slice(RPC_PREFIX.length)
    if (!ENDPOINT_PATTERN.test(endpoint)) {
      res.writeHead(404, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: { code: 'not-found', message: 'unknown endpoint' } }))
      return
    }
    const body = await this.readBody(req)
    if (body === undefined) {
      res.writeHead(413, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: { code: 'size', message: 'body too large' } }))
      return
    }
    let payload: unknown = {}
    if (body.length > 0) {
      try {
        payload = JSON.parse(body)
      } catch {
        res.writeHead(400, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ ok: false, error: { code: 'json', message: 'body is not JSON' } }))
        return
      }
    }
    if (this.rpcHandler === undefined) {
      res.writeHead(503, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: { code: 'unavailable', message: 'no handler' } }))
      return
    }
    try {
      const outcome = await this.rpcHandler(endpoint, payload)
      res.writeHead(200, { 'content-type': 'application/json' })
      res.end(JSON.stringify(outcome))
    } catch (error) {
      res.writeHead(500, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ ok: false, error: { code: 'handler', message: error instanceof Error ? error.message : String(error) } }))
    }
  }

  private cors(res: import('node:http').ServerResponse, origin: string): void {
    if (origin.length === 0) return
    res.setHeader('access-control-allow-origin', origin)
    res.setHeader('vary', 'Origin')
    res.setHeader('access-control-allow-methods', 'POST, OPTIONS')
    res.setHeader('access-control-allow-headers', 'content-type, authorization')
    res.setHeader('access-control-max-age', '600')
  }

  private readBody(req: import('node:http').IncomingMessage): Promise<Buffer | undefined> {
    return new Promise((resolve) => {
      const chunks: Buffer[] = []
      let size = 0
      req.on('data', (chunk: Buffer) => {
        size += chunk.length
        if (size > MAX_RPC_BODY_BYTES) {
          resolve(undefined)
          req.destroy()
          return
        }
        chunks.push(chunk)
      })
      req.on('end', () => resolve(Buffer.concat(chunks)))
      req.on('error', () => resolve(undefined))
    })
  }

  /** Close the listener. Idempotent. */
  stop(): void {
    if (this.server !== undefined) {
      this.server.close()
      this.server = undefined
      this.originValue = ''
      this.token = ''
    }
  }
}

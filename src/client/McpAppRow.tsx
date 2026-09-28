/**
 * One MCP App tool row: loads the tool's `ui://` resource through the host RPC,
 * mounts the separate-origin sandbox proxy iframe, and drives the official
 * `AppBridge` handshake (proxy-ready -> resource-ready -> initialized ->
 * tool input/result). Tool-call passthrough from the App forwards over the same
 * RPC to the host-side MCP connection.
 * @module dsh-mcp-apps/client/McpAppRow
 */

import { createElement, useEffect, useRef, useState } from 'react'
import { AppBridge, PostMessageTransport, buildAllowAttribute, type Implementation, type McpUiResourceCsp, type McpUiResourcePermissions } from '@modelcontextprotocol/ext-apps/app-bridge'
import type { CallToolResult, ContentBlock } from '@modelcontextprotocol/sdk/types.js'

const IMPLEMENTATION: Implementation = { name: 'dsh-mcp-apps', version: '0.1.0' }
const PROXY_READY = 'ui/notifications/sandbox-proxy-ready'

/** Owner props this row reads (structural subset of the toolview contract). */
export interface McpAppRowProps {
  readonly toolName: string
  readonly block: {
    readonly kind?: string
    readonly argsRaw?: string
    readonly call?: { readonly name: string; readonly argsRaw: string | null } | null
    readonly content?: readonly ContentBlock[]
    readonly isError?: boolean
  }
  readonly rpc: {
    call<T>(endpoint: string, payload: unknown): Promise<T>
  }
}

interface ResourceResponse {
  readonly html: string
  readonly cspJson: string | null
  readonly permissionsJson: string | null
  readonly sandboxOrigin: string
}

type Envelope<T> = { ok: true; value: T } | { ok: false; error: { message: string } }

function unwrap<T>(response: Envelope<T> | T): T {
  if (response !== null && typeof response === 'object' && 'ok' in response) {
    const env = response as Envelope<T>
    if (!env.ok) throw new Error(env.error.message)
    return env.value
  }
  return response as T
}

function parseArgs(block: McpAppRowProps['block']): Record<string, unknown> {
  const raw = block.kind === 'tool-result' ? block.call?.argsRaw : block.argsRaw
  if (typeof raw !== 'string' || raw.length === 0) return {}
  try {
    const parsed: unknown = JSON.parse(raw)
    return parsed !== null && typeof parsed === 'object' ? parsed as Record<string, unknown> : {}
  } catch {
    return {}
  }
}

export function McpAppRow(props: McpAppRowProps): ReturnType<typeof createElement> {
  const { toolName, block, rpc } = props
  const [phase, setPhase] = useState<'loading' | 'ready' | 'error'>('loading')
  const [height, setHeight] = useState<number | undefined>(undefined)
  const [message, setMessage] = useState('')
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const bridgeRef = useRef<AppBridge | null>(null)
  const sentResult = useRef(false)

  useEffect(() => {
    let cancelled = false
    const iframe = () => iframeRef.current
    let windowListener: ((event: MessageEvent) => void) | null = null
    let bridge: AppBridge | null = null

    const run = async (): Promise<void> => {
      try {
        const resource = unwrap<ResourceResponse>(await rpc.call('resource', { toolName }))
        if (cancelled) return
        const csp: McpUiResourceCsp | undefined = resource.cspJson === null ? undefined : JSON.parse(resource.cspJson) as McpUiResourceCsp
        const permissions: McpUiResourcePermissions | undefined = resource.permissionsJson === null ? undefined : JSON.parse(resource.permissionsJson) as McpUiResourcePermissions
        const frame = iframe()
        if (frame === null) return

        const proxyReady = new Promise<void>((resolve) => {
          windowListener = ({ source, data }: MessageEvent) => {
            if (source === frame.contentWindow && data !== null && typeof data === 'object' && (data as { method?: string }).method === PROXY_READY) resolve()
          }
          window.addEventListener('message', windowListener)
        })

        frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms')
        const allow = buildAllowAttribute(permissions)
        if (allow) frame.setAttribute('allow', allow)

        const url = new URL(`${resource.sandboxOrigin}/sandbox.html`)
        if (csp !== undefined) url.searchParams.set('csp', JSON.stringify(csp))
        frame.src = url.href

        await proxyReady
        if (cancelled) return

        const dark = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-color-scheme: dark)').matches
        bridge = new AppBridge(null, IMPLEMENTATION, { openLinks: {} }, {
          hostContext: {
            theme: dark ? 'dark' : 'light',
            platform: 'web',
            containerDimensions: { maxHeight: 6000 },
            displayMode: 'inline',
            availableDisplayModes: ['inline'],
          },
        })
        bridgeRef.current = bridge

        bridge.oncalltool = async (params) =>
          unwrap(await rpc.call('call-tool', { serverName: toolName.split('__')[1] ?? '', name: params.name, arguments: params.arguments }))
        bridge.onreadresource = async (params) =>
          unwrap(await rpc.call('read-resource', { serverName: toolName.split('__')[1] ?? '', uri: params.uri }))
        bridge.onlistresources = async () =>
          unwrap(await rpc.call('list-resources', { serverName: toolName.split('__')[1] ?? '' }))
        bridge.onopenlink = async ({ url }) => { window.open(url, '_blank', 'noopener,noreferrer'); return {} }
        bridge.onloggingmessage = () => {}
        bridge.onsizechange = ({ width, height: h }) => {
          if (h !== undefined) setHeight(h)
          if (width !== undefined) {
            const frame2 = iframe()
            if (frame2 !== null) frame2.style.minWidth = `min(${width}px, 100%)`
          }
        }

        const initialized = new Promise<void>((resolve) => {
          if (bridge === null) return
          const previous = bridge.oninitialized
          bridge.oninitialized = (...args: unknown[]) => {
            resolve()
            if (bridge !== null) bridge.oninitialized = previous
            previous?.(...args as [])
          }
        })

        if (frame.contentWindow === null) return
        await bridge.connect(new PostMessageTransport(frame.contentWindow, frame.contentWindow))
        await bridge.sendSandboxResourceReady({ html: resource.html, csp, permissions })
        await initialized
        if (cancelled) return

        await bridge.sendToolInput({ arguments: parseArgs(block) })
        setPhase('ready')
      } catch (error) {
        if (!cancelled) {
          setMessage(error instanceof Error ? error.message : String(error))
          setPhase('error')
        }
      }
    }
    void run()

    return () => {
      cancelled = true
      if (windowListener !== null) window.removeEventListener('message', windowListener)
      const current = bridgeRef.current
      bridgeRef.current = null
      if (current !== null) {
        void current.teardownResource({}).catch(() => {})
        void current.close().catch(() => {})
      }
    }
    // One init per tool call row; args/result flow through the effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolName])

  useEffect(() => {
    if (phase !== 'ready' || sentResult.current) return
    if (block.kind !== 'tool-result') return
    sentResult.current = true
    const bridge = bridgeRef.current
    if (bridge === null) return
    void bridge.sendToolResult({
      content: [...(block.content ?? [])],
      isError: block.isError === true,
    } as CallToolResult).catch(() => {})
  }, [phase, block])

  // The iframe mounts immediately (the handshake needs it in the DOM); the
  // loading/error note renders above it until the App initializes.
  return createElement('div', { style: { width: '100%' } },
    phase !== 'ready'
      ? createElement('div', { 'data-mcp-app': phase }, phase === 'loading' ? '正在加载 MCP 应用…' : `MCP 应用加载失败：${message}`)
      : null,
    createElement('iframe', {
      ref: iframeRef,
      title: `MCP 应用 ${toolName}`,
      style: {
        width: '100%',
        height: height !== undefined ? `${height}px` : '240px',
        border: 'none',
        display: 'block',
      },
    }),
  )
}

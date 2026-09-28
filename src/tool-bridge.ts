/**
 * Tool registration bridge: register every tool of a connected MCP server on
 * the harness `tools` runtime under the same public names the official
 * `@deepseek-ai/dsh-mcp-client` would use — but backed by this bundle's own
 * connection, whose credentials are live (the `authProvider` lazy-auth handle)
 * rather than the boot-time snapshot the official row injects.
 *
 * Why this exists: the official mcp-client row evaluates
 * `headers: !!js ctx.mcpAuth.headers(…)` once at boot and freezes the value
 * into its transport's `requestInit`. A token stored after boot — or a
 * re-authorization after a revoke — never reaches that connection until the
 * process restarts. This bridge gives the model the same tools through a
 * connection that asks the provider for the token on every request, so a
 * completed login applies immediately, everywhere.
 *
 * Behaviour notes (aligned field-by-field with the official bridge so the
 * `dsh-mcp-security` baseline fingerprint does not change):
 *  - public names: `publicToolName` (already pinned to the official vectors);
 *  - `execute` forwards `exec.signal` and treats `isError: true` as a throw;
 *  - output schema: the official `{ content, structuredContent? }` shape;
 *  - `taskSupport === 'required'` tools are registered but fail at call time
 *    with the official message (they are listed, never silently dropped);
 *  - a name already registered by the official row is **skipped with a warn**
 *    (never hijacked): both rows can coexist, and removing the official row
 *    from the profile lets this bridge take over with no other change.
 *
 * @module dsh-mcp-apps/tool-bridge
 */

import type { Tool } from '@modelcontextprotocol/sdk/types.js'
import type { LazyAuthLike } from './connections.ts'
import { publicToolName } from './naming.ts'

/** The `tools` runtime surface this bridge uses (public harness API). */
export interface ToolsRuntimeLike {
  register(definition: ToolDefinitionLike): () => void
}

/**
 * Structural subset of `@deepseek-ai/dsh-tools`' `ToolDefinition` — enough to
 * register a tool; the registry owns the full contract.
 */
export interface ToolDefinitionLike {
  readonly name: string
  readonly description: string
  readonly parameters: unknown
  readonly output: {
    readonly schema: unknown
    render(args: unknown, value: unknown): unknown
  }
  execute(args: unknown, exec: { signal: AbortSignal }): Promise<unknown>
}

/** Result of registering one server's tools. */
export interface RegisteredServer {
  /** Disposers for every successfully registered tool. */
  readonly disposers: Map<string, () => void>
  /** Public names skipped because the name was already taken. */
  readonly skipped: readonly string[]
}

/** Extract the text of a content array the way the official bridge renders it. */
function extractText(content: readonly unknown[]): string {
  const parts: string[] = []
  for (const block of content) {
    if (block !== null && typeof block === 'object' && (block as { type?: unknown }).type === 'text') {
      parts.push(String((block as { text?: unknown }).text ?? ''))
    }
  }
  return parts.join('\n')
}

/** Whether a content block array contains an image block (matched loosely). */
function containsImage(content: readonly unknown[]): boolean {
  return content.some((block) => block !== null && typeof block === 'object' && (block as { type?: unknown }).type === 'image')
}

/**
 * Build the harness output declaration for one MCP tool, mirroring the
 * official bridge: a `{ content, structuredContent? }` object schema whose
 * render extracts the text blocks.
 */
function createOutput(rawName: string, structuredSchema: unknown): ToolDefinitionLike['output'] {
  const hasStructured = structuredSchema !== undefined && structuredSchema !== null
  return {
    schema: {
      type: 'object',
      properties: {
        content: { type: 'array', items: {} },
        structuredContent: hasStructured ? structuredSchema : {},
      },
      required: hasStructured ? ['content', 'structuredContent'] : ['content'],
      additionalProperties: false,
    },
    render(_args: unknown, value: unknown) {
      const content = (value as { content?: unknown[] })?.content
      return [{ type: 'text', text: extractText(Array.isArray(content) ? content : [], rawName) }]
    },
  }
}

/** Narrow a tools/list entry's outputSchema to a JSON schema-ish value. */
function supportedOutputSchema(outputSchema: unknown): unknown {
  if (outputSchema === null || typeof outputSchema !== 'object') return undefined
  return outputSchema
}

/** Inputs for {@link registerServerTools}. */
export interface RegisterOptions {
  /** The harness tools runtime (`ctx.tools`). */
  readonly runtime: ToolsRuntimeLike
  /** Logger used for skip warnings (the harness `ctx.logger`). */
  readonly warn: (message: string) => void
}

/**
 * Register every tool of one server on the harness tools runtime.
 *
 * Registration is atomic per server in the failure direction: if a tool's
 * registration throws for a reason other than "already registered", the tools
 * registered so far in this pass are disposed again so the registry is left as
 * it was found. A name the official mcp-client row already owns is skipped
 * with a warning — coexistence first, takeover by removing that row.
 *
 * @param serverName - the mcp-client `serverName` (namespace of public names).
 * @param tools - the server's `tools/list` entries.
 * @param call - executes one raw tool call over the live connection; the
 *   bridge does not own a client, it owns a policy (auth retry included).
 * @param options - runtime and logger.
 * @returns the disposers and the skipped names.
 */
export function registerServerTools(
  serverName: string,
  tools: readonly Tool[],
  call: (rawName: string, args: Record<string, unknown>, signal: AbortSignal) => Promise<{ content?: unknown[]; isError?: boolean; structuredContent?: unknown }>,
  options: RegisterOptions,
): RegisteredServer {
  const disposers = new Map<string, () => void>()
  const skipped: string[] = []
  // Two phases, like the official bridge: build every definition first (an
  // invalid tool list must throw before anything is registered), then
  // register. Registering mid-iteration would leak earlier tools in the
  // registry when a later duplicate throws.
  const definitions: { publicName: string; definition: ToolDefinitionLike }[] = []
  for (const tool of tools) {
    const publicName = publicToolName(serverName, tool.name)
    if (definitions.some((entry) => entry.publicName === publicName)) {
      throw new Error(`mcp-apps(${serverName}): server listed tool "${tool.name}" more than once — invalid tool list`)
    }
    const taskRequired = (tool as { execution?: { taskSupport?: unknown } }).execution?.taskSupport === 'required'
    const definition: ToolDefinitionLike = {
      name: publicName,
      description: tool.description ?? '',
      parameters: tool.inputSchema,
      output: createOutput(tool.name, supportedOutputSchema(tool.outputSchema)),
      async execute(args, exec) {
        if (taskRequired) {
          throw new Error(`Tool "${tool.name}" requires task-based execution, which this bridge does not support`)
        }
        const result = await call(tool.name, typeof args === 'object' && args !== null ? args as Record<string, unknown> : {}, exec.signal)
        const content = Array.isArray(result.content) ? result.content : []
        if (content.length === 0 && !Array.isArray(result.content)) {
          const rendered = 'structuredContent' in result && result.structuredContent !== undefined
            ? JSON.stringify(result.structuredContent)
            : '(no output)'
          const text = typeof rendered === 'string' ? rendered : '(no output)'
          if (result.isError === true) throw new Error(text)
          return {
            content: [{ type: 'text', text }],
            ...result.structuredContent !== undefined ? { structuredContent: result.structuredContent } : {},
          }
        }
        const text = extractText(content, tool.name)
        if (result.isError === true) throw new Error(text)
        return {
          content,
          ...result.structuredContent !== undefined ? { structuredContent: result.structuredContent } : {},
        }
      },
    }
    definitions.push({ publicName, definition })
  }
  for (const { publicName, definition } of definitions) {
    try {
      disposers.set(publicName, options.runtime.register(definition))
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      if (message.includes('already registered')) {
        // The official row owns this name. Never hijack: skip, warn, move on.
        options.warn(`mcp-apps: tool "${publicName}" already registered (by the official mcp-client row?); skipping — remove that row to let the live-credential bridge take over`)
        skipped.push(publicName)
        continue
      }
      for (const dispose of disposers.values()) dispose()
      disposers.clear()
      throw error
    }
  }
  return { disposers, skipped }
}

/**
 * Wrap a connection's `callTool` in the lazy-auth retry policy the bridge
 * needs: an `UnauthorizedError` (or a dead-refresh error) from the live
 * connection completes an authorization and retries once.
 * @param auth - the connection's lazy-auth handle, when present.
 * @param call - the raw call over the connection's client.
 * @returns the retried call.
 */
export function withLiveCredentials(
  auth: LazyAuthLike | undefined,
  call: (signal: AbortSignal, rawName: string, args: Record<string, unknown>) => Promise<{ content?: unknown[]; isError?: boolean; structuredContent?: unknown }>,
): (rawName: string, args: Record<string, unknown>, signal: AbortSignal) => Promise<{ content?: unknown[]; isError?: boolean; structuredContent?: unknown }> {
  return async (rawName, args, signal) => {
    const run = () => call(signal, rawName, args)
    try {
      return await run()
    } catch (error) {
      if (auth === undefined) throw error
      const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase()
      const fixable = message.includes('unauthorized') || message.includes('refresh token')
        || message.includes('revoked') || message.includes('invalid_grant')
      if (!fixable) throw error
      const outcome = await auth.authorize()
      // A FAILED authorization produced no new credentials; rethrowing the
      // original error without retrying keeps the failure honest (a retry
      // with the same dead token would just fail identically).
      if (outcome !== 'AUTHORIZED') throw error
      return await run()
    }
  }
}

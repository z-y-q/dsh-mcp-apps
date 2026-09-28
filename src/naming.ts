/**
 * Public tool-name derivation, algorithmically identical to
 * `@deepseek-ai/dsh-mcp-client/src/tools.ts` (`publicToolName`). The official
 * package does not export the function from its root entry and a standalone
 * bundle must not reach into `./src/*`, so the rule is restated here and pinned
 * by tests against the official vectors (github/create_issue,
 * everything/get-sum, admin.reset vs admin_reset).
 * @module dsh-mcp-apps/naming
 */

import { createHash } from 'node:crypto'

const INVALID_NAME_CHARS = /[^A-Za-z0-9_-]/g
const MAX_PUBLIC_NAME_LENGTH = 64
const HASH_LENGTH = 12

/**
 * Derive the model-facing public tool name for one server tool.
 * @param serverName - stable local namespace from the mcp-client row config.
 * @param rawName - the MCP server's own tool name.
 * @returns the name the harness tool registry uses for this tool.
 */
export function publicToolName(serverName: string, rawName: string): string {
  const joined = `mcp__${serverName}__${rawName}`
  const normalized = joined.replace(INVALID_NAME_CHARS, '_')
  if (normalized === joined && normalized.length <= MAX_PUBLIC_NAME_LENGTH) return normalized
  const hash = createHash('sha256').update(`${serverName}\0${rawName}`).digest('hex').slice(0, HASH_LENGTH)
  return `${normalized.slice(0, MAX_PUBLIC_NAME_LENGTH - HASH_LENGTH - 1)}_${hash}`
}

/**
 * CSP header construction for the sandbox proxy page, ported from the official
 * basic-host reference (`serve.ts`). CSP is delivered as an HTTP response
 * header — never a meta tag — so untrusted content cannot tamper with it.
 * @module dsh-mcp-apps/csp
 */

/** Domain allowlists carried by an MCP App resource (`McpUiResourceCsp`). */
export interface McpResourceCsp {
  resourceDomains?: string[]
  connectDomains?: string[]
  frameDomains?: string[]
  baseUriDomains?: string[]
}

/**
 * Reject CSP domain entries that could break out into a new directive or
 * inject CSP keywords: `;`/newlines start directives, quotes inject keywords,
 * spaces inject extra sources.
 * @param domains - candidate entries from the resource metadata.
 * @returns only entries that are plain strings free of those characters.
 */
export function sanitizeCspDomains(domains: readonly unknown[] | undefined): string[] {
  if (!Array.isArray(domains)) return []
  return domains.filter((d): d is string => typeof d === 'string' && !/[;\r\n'" ]/.test(d))
}

/**
 * Build the `Content-Security-Policy` header value for one resource.
 * @param csp - the resource-declared allowlists, when present.
 * @returns the joined CSP directive list.
 */
export function buildCspHeader(csp?: McpResourceCsp): string {
  const resourceDomains = sanitizeCspDomains(csp?.resourceDomains).join(' ')
  const connectDomains = sanitizeCspDomains(csp?.connectDomains).join(' ')
  const frameDomains = sanitizeCspDomains(csp?.frameDomains).join(' ') || null
  const baseUriDomains = sanitizeCspDomains(csp?.baseUriDomains).join(' ') || null

  const directives = [
    "default-src 'self' 'unsafe-inline'",
    `script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: ${resourceDomains}`.trim(),
    `style-src 'self' 'unsafe-inline' blob: data: ${resourceDomains}`.trim(),
    `img-src 'self' data: blob: ${resourceDomains}`.trim(),
    `font-src 'self' data: blob: ${resourceDomains}`.trim(),
    `media-src 'self' data: blob: ${resourceDomains}`.trim(),
    `connect-src 'self' ${connectDomains}`.trim(),
    `worker-src 'self' blob: ${resourceDomains}`.trim(),
    frameDomains ? `frame-src ${frameDomains}` : "frame-src 'none'",
    "object-src 'none'",
    baseUriDomains ? `base-uri ${baseUriDomains}` : "base-uri 'none'",
  ]
  return directives.join('; ')
}

/**
 * The sandbox proxy page served from the separate sandbox origin, ported from
 * the official basic-host reference (`sandbox.html` + `src/sandbox.ts`).
 *
 * Double-iframe architecture: this page is the OUTER sandbox proxy iframe on a
 * separate origin; it creates an INNER iframe for the untrusted App HTML. Per
 * the MCP Apps specification the Host and the Sandbox MUST have different
 * origins. The page is fully self-contained (one inline script, no imports) so
 * the host half can serve it as a static string; the Permission-Policy allow
 * attribute mapping mirrors `buildAllowAttribute` from
 * `@modelcontextprotocol/ext-apps` (camera/microphone/geolocation/clipboardWrite).
 *
 * @module dsh-mcp-apps/sandbox-page
 */

const PROXY_SCRIPT = String.raw`
'use strict';
// Loopback-only embedding: the referrer is the dsh host page.
var ALLOWED_REFERRER_PATTERN = /^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/;

if (window.self === window.top) {
  throw new Error('This file is only to be used in an iframe sandbox.');
}
if (!document.referrer) {
  throw new Error('No referrer, cannot validate embedding site.');
}
if (!document.referrer.match(ALLOWED_REFERRER_PATTERN)) {
  throw new Error('Embedding domain not allowed in referrer ' + document.referrer + '.');
}

// The origin every parent message must come from.
var EXPECTED_HOST_ORIGIN = new URL(document.referrer).origin;
var OWN_ORIGIN = new URL(window.location.href).origin;

// Security self-test: window.top MUST be unreachable — if it is accessible,
// the sandbox configuration is broken and untrusted content could escape.
try {
  window.top.alert('If you see this, the sandbox is not setup securely.');
  throw 'FAIL';
} catch (e) {
  if (e === 'FAIL') throw new Error('The sandbox is not setup securely.');
}

// Mirrors buildAllowAttribute from @modelcontextprotocol/ext-apps.
function buildAllowAttribute(permissions) {
  if (!permissions) return '';
  var parts = [];
  if (permissions.microphone) parts.push('microphone');
  if (permissions.camera) parts.push('camera');
  if (permissions.geolocation) parts.push('geolocation');
  if (permissions.clipboardWrite) parts.push('clipboard-write');
  return parts.join('; ');
}

var inner = document.createElement('iframe');
inner.style = 'width:100%; height:100%; border:none;';
inner.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms');
document.body.appendChild(inner);

var RESOURCE_READY_NOTIFICATION = 'ui/notifications/sandbox-resource-ready';
var PROXY_READY_NOTIFICATION = 'ui/notifications/sandbox-proxy-ready';

// Bidirectional relay: Host (parent) <-> Sandbox (this frame) <-> View (inner).
// The proxy intercepts sandbox-resource-ready to configure and load the inner
// iframe; every other message is forwarded in both directions because the
// parent and the inner iframe have different origins. CSP is enforced via the
// HTTP response headers set by the host from the ?csp= query param.
window.addEventListener('message', function (event) {
  if (event.source === window.parent) {
    if (event.origin !== EXPECTED_HOST_ORIGIN) {
      console.error('[Sandbox] Rejecting message from unexpected origin:', event.origin, 'expected:', EXPECTED_HOST_ORIGIN);
      return;
    }
    if (event.data && event.data.method === RESOURCE_READY_NOTIFICATION) {
      var params = event.data.params || {};
      if (typeof params.sandbox === 'string') {
        inner.setAttribute('sandbox', params.sandbox);
      }
      var allowAttribute = buildAllowAttribute(params.permissions);
      if (allowAttribute) inner.setAttribute('allow', allowAttribute);
      if (typeof params.html === 'string') {
        // document.write instead of srcdoc (which the CesiumJS Map won't work with).
        var doc = inner.contentDocument || (inner.contentWindow && inner.contentWindow.document);
        if (doc) {
          doc.open();
          doc.write(params.html);
          doc.close();
        } else {
          console.warn('[Sandbox] document.write not available, falling back to srcdoc');
          inner.srcdoc = params.html;
        }
      }
    } else if (inner.contentWindow) {
      inner.contentWindow.postMessage(event.data, '*');
    }
  } else if (event.source === inner.contentWindow) {
    if (event.origin !== OWN_ORIGIN) {
      console.error('[Sandbox] Rejecting message from inner iframe with unexpected origin:', event.origin, 'expected:', OWN_ORIGIN);
      return;
    }
    window.parent.postMessage(event.data, EXPECTED_HOST_ORIGIN);
  }
});

window.parent.postMessage({
  jsonrpc: '2.0',
  method: PROXY_READY_NOTIFICATION,
  params: {},
}, EXPECTED_HOST_ORIGIN);
`

/**
 * The sandbox proxy document. CSP arrives via the HTTP response header, never
 * from this markup.
 * @returns the full `text/html` document string.
 */
export function sandboxPageHtml(): string {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="color-scheme" content="light dark">
    <title>MCP Apps Sandbox Proxy</title>
    <style>
      html, body { margin: 0; height: 100vh; width: 100vw; background-color: transparent; }
      body { display: flex; flex-direction: column; }
      * { box-sizing: border-box; }
      iframe { background-color: transparent; border: 0px none transparent; padding: 0px; overflow: hidden; flex-grow: 1; color-scheme: inherit; }
    </style>
  </head>
  <body>
    <script>${PROXY_SCRIPT}</script>
  </body>
</html>
`
}

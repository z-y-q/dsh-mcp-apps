import z from "@deepseek-ai/schemastery";
import * as dshSettings from "@deepseek-ai/dsh-settings";
import { UnauthorizedError } from "@modelcontextprotocol/sdk/client/auth.js";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { RESOURCE_MIME_TYPE, getToolUiResourceUri } from "@modelcontextprotocol/ext-apps/app-bridge";
import { createHash, randomUUID } from "node:crypto";
import { createServer } from "node:http";
//#region src/naming.ts
/**
* Public tool-name derivation, algorithmically identical to
* `@deepseek-ai/dsh-mcp-client/src/tools.ts` (`publicToolName`). The official
* package does not export the function from its root entry and a standalone
* bundle must not reach into `./src/*`, so the rule is restated here and pinned
* by tests against the official vectors (github/create_issue,
* everything/get-sum, admin.reset vs admin_reset).
* @module dsh-mcp-apps/naming
*/
const INVALID_NAME_CHARS = /[^A-Za-z0-9_-]/g;
const MAX_PUBLIC_NAME_LENGTH = 64;
const HASH_LENGTH = 12;
/**
* Derive the model-facing public tool name for one server tool.
* @param serverName - stable local namespace from the mcp-client row config.
* @param rawName - the MCP server's own tool name.
* @returns the name the harness tool registry uses for this tool.
*/
function publicToolName(serverName, rawName) {
	const joined = `mcp__${serverName}__${rawName}`;
	const normalized = joined.replace(INVALID_NAME_CHARS, "_");
	if (normalized === joined && normalized.length <= MAX_PUBLIC_NAME_LENGTH) return normalized;
	const hash = createHash("sha256").update(`${serverName}\0${rawName}`).digest("hex").slice(0, HASH_LENGTH);
	return `${normalized.slice(0, 51)}_${hash}`;
}
//#endregion
//#region src/connections.ts
/**
* Drop any `Authorization` header from a static header map.
*
* Required whenever an `authProvider` is installed: the SDK builds request
* headers as `{ ...bearerFromProvider, ...requestInit.headers }`, spreading the
* static map **last**. A stale `Authorization` left in there therefore wins over
* the provider's fresh token and silently defeats the whole lazy-auth flow.
* Comparison is case-insensitive because HTTP header names are.
*
* @param headers - the row's configured headers.
* @returns a copy without any `Authorization` entry.
*/
function stripAuthorization(headers) {
	const result = {};
	for (const [key, value] of Object.entries(headers)) if (key.toLowerCase() !== "authorization") result[key] = value;
	return result;
}
const IMPLEMENTATION = {
	name: "@z-y-q/dsh-mcp-apps",
	version: "0.1.1"
};
/**
* The config a row's plugin actually runs with.
*
* `entry.options.config` is the serialized row, so a `!!js` value is still the
* raw `{__jsExpr}` node there. The interpolated config — the one the loader
* produced by running `internal/config` in the *fiber's* scope — is what the
* owning plugin received, and reading it is also what makes injected services
* work: an expression like `ctx.mcpAuth.headers(...)` needs the row's own
* `inject` list, which the bare entry context does not carry (`entry.evaluate`
* throws `cannot get property "mcpAuth" without inject` there).
* @param entry - the loader entry to read.
* @returns the fiber's resolved config, or the serialized row as a fallback.
*/
function effectiveConfig(entry) {
	const fiberConfig = entry.fiber?.config;
	return fiberConfig === void 0 ? entry.options.config : fiberConfig;
}
/**
* `entry.options.config` is the *serialized* entry config: the loader only
* interpolates a `!!js` value on its way into the plugin's fiber, so what a
* reader of someone else's row sees is the raw `{__jsExpr}` node. A plain
* object with that key is therefore the tag, not data.
* @param value - candidate config node.
* @returns true when the node is a serialized `!!js` expression.
*/
function isJsExprNode(value) {
	return typeof value === "object" && value !== null && typeof value.__jsExpr === "string";
}
/**
* Recursively replace serialized `!!js` nodes with their evaluated values, so a
* row config reused from the loader carries what its own plugin receives (for
* example the headers `dsh-mcp-auth` injects through `ctx.mcpAuth.headers()`).
*
* A node that cannot be evaluated is left in place and reported: silently
* keeping it would hand a transport a headers object that sends no
* `Authorization` at all, which looks exactly like a server-side 401.
*
* @param entry - the entry owning the config; `evaluate` runs in its scope.
* @param value - config value to walk (the entry's effective config).
* @param warn - sink for one-line diagnostics.
* @param path - dotted path of `value` inside the config, for diagnostics.
* @returns the config with every resolvable `!!js` node replaced.
*/
function resolveJsExprs(entry, value, warn, path = "config") {
	if (isJsExprNode(value)) {
		if (typeof entry.evaluate !== "function") {
			warn(`${path} is a "!!js" expression but this loader entry exposes no evaluate(); using the raw node`);
			return value;
		}
		try {
			return entry.evaluate(value.__jsExpr);
		} catch (error) {
			const detail = error instanceof Error ? error.message : String(error);
			warn(`${path} "!!js" expression failed to evaluate: ${detail}${detail.includes("without inject") ? " (the row must be started before its expressions can be read)" : ""}`);
			return value;
		}
	}
	if (Array.isArray(value)) return value.map((item, index) => resolveJsExprs(entry, item, warn, `${path}[${index}]`));
	if (typeof value === "object" && value !== null) {
		const resolved = {};
		for (const [key, item] of Object.entries(value)) resolved[key] = resolveJsExprs(entry, item, warn, `${path}.${key}`);
		return resolved;
	}
	return value;
}
/**
* Read the mcp-client row configs from the loader tree.
* @param ctx - host context carrying the loader service.
* @param only - optional allowlist of `serverName` values; empty means all.
* @returns every enabled mcp-client server config, `!!js` values resolved.
*/
function discoverServerConfigs(ctx, only) {
	const found = [];
	const seen = /* @__PURE__ */ new Set();
	for (const entry of ctx.loader.entries()) {
		const { name, disabled, config } = entry.options;
		if (name !== "@deepseek-ai/dsh-mcp-client") continue;
		const unresolved = [];
		const cfg = resolveJsExprs(entry, effectiveConfig(entry), (message) => {
			unresolved.push(message);
			ctx.logger.warn(`mcp-apps: mcp-client row config ${message}`);
		});
		if (cfg === void 0 || typeof cfg.serverName !== "string") continue;
		if (seen.has(cfg.serverName)) continue;
		if (only.length > 0 && !only.includes(cfg.serverName)) continue;
		if (cfg.transport !== "stdio" && cfg.transport !== "streamable-http") continue;
		seen.add(cfg.serverName);
		if (process.env.DSH_MCP_APPS_DEBUG === "1") {
			const evaluable = typeof entry.evaluate;
			console.info(`[dsh-mcp-apps] row "${cfg.serverName}": url=${cfg.url ?? "(stdio)"} evaluate=${evaluable} header keys=[${Object.keys(cfg.headers ?? {}).join(", ")}]${unresolved.length > 0 ? ` unresolved=${unresolved.join(" | ")}` : ""}`);
		}
		found.push(cfg);
	}
	return found;
}
/**
* Connect to one server and discover its App-bearing tools.
*
* For an HTTP server this also wires up on-demand login when the auth bundle is
* available: the returned client can then be retried after a 401 instead of
* failing outright.
*
* @param config - the mcp-client row config for this server.
* @param options - host-supplied hooks (lazy auth).
* @returns the connected client with its App tool list and, when wired, its auth handle.
*/
async function connectAndDiscover(config, options = {}) {
	const client = new Client(IMPLEMENTATION);
	let auth;
	if (config.transport === "stdio") {
		const env = config.env !== void 0 && Object.keys(config.env).length > 0 ? { ...config.env } : void 0;
		await client.connect(new StdioClientTransport({
			command: config.command ?? "",
			args: [...config.args ?? []],
			...env !== void 0 ? { env } : {},
			...config.cwd ? { cwd: config.cwd } : {}
		}));
	} else {
		const url = config.url ?? "";
		if (options.lazyAuth !== void 0 && url.length > 0) try {
			auth = await options.lazyAuth(config.serverName, url);
		} catch (error) {
			console.warn(`[dsh-mcp-apps] lazy auth unavailable for "${config.serverName}": ${error instanceof Error ? error.message : String(error)}`);
		}
		const configured = { ...config.headers ?? {} };
		const headers = auth === void 0 ? configured : stripAuthorization(configured);
		await client.connect(new StreamableHTTPClientTransport(new URL(url), {
			requestInit: { headers },
			...auth !== void 0 ? { authProvider: auth.provider } : {}
		}));
	}
	const apps = [];
	const allTools = [];
	let cursor;
	do {
		const response = await client.listTools(cursor !== void 0 ? { cursor } : void 0);
		for (const tool of response.tools) {
			allTools.push(tool);
			let uri;
			try {
				uri = getToolUiResourceUri(tool);
			} catch {
				continue;
			}
			if (uri === void 0) continue;
			apps.push({
				toolName: publicToolName(config.serverName, tool.name),
				serverName: config.serverName,
				resourceUri: uri
			});
		}
		cursor = response.nextCursor;
	} while (cursor !== void 0);
	return {
		config,
		client,
		apps,
		allTools,
		...auth !== void 0 ? { auth } : {}
	};
}
/**
* Read one `ui://` App resource and validate it per the MCP Apps spec.
* @param server - the connected server owning the resource.
* @param uri - the `ui://` resource URI from the tool's `_meta.ui`.
* @returns the App HTML plus its CSP/permissions metadata.
*/
async function readAppResource(server, uri) {
	const resource = await server.client.readResource({ uri });
	if (resource.contents.length !== 1) throw new Error(`Unexpected contents count: ${resource.contents.length}`);
	const content = resource.contents[0];
	if (content.mimeType !== RESOURCE_MIME_TYPE) throw new Error(`Unsupported MIME type: ${String(content.mimeType)}`);
	const html = typeof content.blob === "string" ? atob(content.blob) : String(content.text ?? "");
	const contentMeta = content._meta ?? content.meta;
	let csp = contentMeta?.ui?.csp;
	let permissions = contentMeta?.ui?.permissions;
	if (csp === void 0 && permissions === void 0) try {
		const entry = (await server.client.listResources()).resources.find((r) => r.uri === uri);
		csp = entry?._meta?.ui?.csp;
		permissions = entry?._meta?.ui?.permissions;
	} catch {}
	return {
		html,
		csp,
		permissions
	};
}
//#endregion
//#region src/tool-bridge.ts
/** Extract the text of a content array the way the official bridge renders it. */
function extractText(content) {
	const parts = [];
	for (const block of content) if (block !== null && typeof block === "object" && block.type === "text") parts.push(String(block.text ?? ""));
	return parts.join("\n");
}
/**
* Build the harness output declaration for one MCP tool, mirroring the
* official bridge: a `{ content, structuredContent? }` object schema whose
* render extracts the text blocks.
*/
function createOutput(rawName, structuredSchema) {
	const hasStructured = structuredSchema !== void 0 && structuredSchema !== null;
	return {
		schema: {
			type: "object",
			properties: {
				content: {
					type: "array",
					items: {}
				},
				structuredContent: hasStructured ? structuredSchema : {}
			},
			required: hasStructured ? ["content", "structuredContent"] : ["content"],
			additionalProperties: false
		},
		render(_args, value) {
			const content = value?.content;
			return [{
				type: "text",
				text: extractText(Array.isArray(content) ? content : [], rawName)
			}];
		}
	};
}
/** Narrow a tools/list entry's outputSchema to a JSON schema-ish value. */
function supportedOutputSchema(outputSchema) {
	if (outputSchema === null || typeof outputSchema !== "object") return void 0;
	return outputSchema;
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
function registerServerTools(serverName, tools, call, options) {
	const disposers = /* @__PURE__ */ new Map();
	const skipped = [];
	const definitions = [];
	for (const tool of tools) {
		const publicName = publicToolName(serverName, tool.name);
		if (definitions.some((entry) => entry.publicName === publicName)) throw new Error(`mcp-apps(${serverName}): server listed tool "${tool.name}" more than once — invalid tool list`);
		const taskRequired = tool.execution?.taskSupport === "required";
		const definition = {
			name: publicName,
			description: tool.description ?? "",
			parameters: tool.inputSchema,
			output: createOutput(tool.name, supportedOutputSchema(tool.outputSchema)),
			async execute(args, exec) {
				if (taskRequired) throw new Error(`Tool "${tool.name}" requires task-based execution, which this bridge does not support`);
				const result = await call(tool.name, typeof args === "object" && args !== null ? args : {}, exec.signal);
				const content = Array.isArray(result.content) ? result.content : [];
				if (content.length === 0 && !Array.isArray(result.content)) {
					const rendered = "structuredContent" in result && result.structuredContent !== void 0 ? JSON.stringify(result.structuredContent) : "(no output)";
					const text = typeof rendered === "string" ? rendered : "(no output)";
					if (result.isError === true) throw new Error(text);
					return {
						content: [{
							type: "text",
							text
						}],
						...result.structuredContent !== void 0 ? { structuredContent: result.structuredContent } : {}
					};
				}
				const text = extractText(content, tool.name);
				if (result.isError === true) throw new Error(text);
				return {
					content,
					...result.structuredContent !== void 0 ? { structuredContent: result.structuredContent } : {}
				};
			}
		};
		definitions.push({
			publicName,
			definition
		});
	}
	for (const { publicName, definition } of definitions) try {
		disposers.set(publicName, options.runtime.register(definition));
	} catch (error) {
		if ((error instanceof Error ? error.message : String(error)).includes("already registered")) {
			options.warn(`mcp-apps: tool "${publicName}" already registered (by the official mcp-client row?); skipping — remove that row to let the live-credential bridge take over`);
			skipped.push(publicName);
			continue;
		}
		for (const dispose of disposers.values()) dispose();
		disposers.clear();
		throw error;
	}
	return {
		disposers,
		skipped
	};
}
/**
* Wrap a connection's `callTool` in the lazy-auth retry policy the bridge
* needs: an `UnauthorizedError` (or a dead-refresh error) from the live
* connection completes an authorization and retries once.
* @param auth - the connection's lazy-auth handle, when present.
* @param call - the raw call over the connection's client.
* @returns the retried call.
*/
function withLiveCredentials(auth, call) {
	return async (rawName, args, signal) => {
		const run = () => call(signal, rawName, args);
		try {
			return await run();
		} catch (error) {
			if (auth === void 0) throw error;
			const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
			if (!(message.includes("unauthorized") || message.includes("refresh token") || message.includes("revoked") || message.includes("invalid_grant"))) throw error;
			if (await auth.authorize() !== "AUTHORIZED") throw error;
			return await run();
		}
	};
}
//#endregion
//#region src/csp.ts
/**
* Reject CSP domain entries that could break out into a new directive or
* inject CSP keywords: `;`/newlines start directives, quotes inject keywords,
* spaces inject extra sources.
* @param domains - candidate entries from the resource metadata.
* @returns only entries that are plain strings free of those characters.
*/
function sanitizeCspDomains(domains) {
	if (!Array.isArray(domains)) return [];
	return domains.filter((d) => typeof d === "string" && !/[;\r\n'" ]/.test(d));
}
/**
* Build the `Content-Security-Policy` header value for one resource.
* @param csp - the resource-declared allowlists, when present.
* @returns the joined CSP directive list.
*/
function buildCspHeader(csp) {
	const resourceDomains = sanitizeCspDomains(csp?.resourceDomains).join(" ");
	const connectDomains = sanitizeCspDomains(csp?.connectDomains).join(" ");
	const frameDomains = sanitizeCspDomains(csp?.frameDomains).join(" ") || null;
	const baseUriDomains = sanitizeCspDomains(csp?.baseUriDomains).join(" ") || null;
	return [
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
		baseUriDomains ? `base-uri ${baseUriDomains}` : "base-uri 'none'"
	].join("; ");
}
//#endregion
//#region src/sandbox-page.ts
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
`;
/**
* The sandbox proxy document. CSP arrives via the HTTP response header, never
* from this markup.
* @returns the full `text/html` document string.
*/
function sandboxPageHtml() {
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
    <script>${PROXY_SCRIPT}<\/script>
  </body>
</html>
`;
}
//#endregion
//#region src/sandbox-server.ts
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
/** The one sandbox path; every other non-rpc path is a 404. */
const SANDBOX_PATH = "/sandbox.html";
/** RPC paths are `/rpc/<endpoint>`; endpoint segments match the harness rules. */
const RPC_PREFIX = "/rpc/";
const ENDPOINT_PATTERN = /^[A-Za-z0-9_$.-]+$/;
/** Request body cap for RPC calls. */
const MAX_RPC_BODY_BYTES = 5242880;
var SandboxServer = class {
	server;
	originValue = "";
	token = "";
	rpcHandler;
	/** Resolved origin (`http://127.0.0.1:<port>`), set once `start` succeeds. */
	get origin() {
		return this.originValue;
	}
	/** The per-boot bearer token RPC callers must present. */
	get rpcToken() {
		return this.token;
	}
	/**
	* Bind the loopback listener.
	* @param port - configured port; 0 lets the OS assign one.
	*/
	start(port) {
		return new Promise((resolve, reject) => {
			const server = createServer((req, res) => {
				this.dispatch(req, res);
			});
			server.once("error", reject);
			server.listen(port, "127.0.0.1", () => {
				const address = server.address();
				this.server = server;
				this.originValue = `http://127.0.0.1:${address.port}`;
				this.token = randomUUID();
				resolve();
			});
		});
	}
	/**
	* Install the RPC handler (called for every authenticated request).
	* @param handler - endpoint dispatcher returning an RpcOutcome-shaped value.
	*/
	setRpcHandler(handler) {
		this.rpcHandler = handler;
	}
	async dispatch(req, res) {
		const url = new URL(req.url ?? "/", "http://127.0.0.1");
		if (url.pathname === SANDBOX_PATH) {
			this.serveSandbox(url, res);
			return;
		}
		if (url.pathname.startsWith(RPC_PREFIX)) {
			await this.serveRpc(req, res, url);
			return;
		}
		res.writeHead(404);
		res.end("Only sandbox.html and /rpc are served on this port");
	}
	serveSandbox(url, res) {
		if (res.req?.method !== void 0 && res.req.method !== "GET" && res.req.method !== "HEAD") {
			res.writeHead(405);
			res.end();
			return;
		}
		let csp;
		const raw = url.searchParams.get("csp");
		if (raw !== null) try {
			csp = JSON.parse(raw);
		} catch {
			csp = void 0;
		}
		res.setHeader("Content-Security-Policy", buildCspHeader(csp));
		res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
		res.setHeader("Pragma", "no-cache");
		res.setHeader("Expires", "0");
		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.end(sandboxPageHtml());
	}
	async serveRpc(req, res, url) {
		const origin = req.headers.origin ?? "";
		this.cors(res, origin);
		if (req.method === "OPTIONS") {
			res.writeHead(204);
			res.end();
			return;
		}
		if (req.method !== "POST") {
			res.writeHead(405, { "content-type": "application/json" });
			res.end(JSON.stringify({
				ok: false,
				error: {
					code: "method",
					message: "POST only"
				}
			}));
			return;
		}
		if (req.headers.authorization !== `Bearer ${this.token}`) {
			res.writeHead(401, { "content-type": "application/json" });
			res.end(JSON.stringify({
				ok: false,
				error: {
					code: "auth",
					message: "invalid token"
				}
			}));
			return;
		}
		const endpoint = url.pathname.slice(5);
		if (!ENDPOINT_PATTERN.test(endpoint)) {
			res.writeHead(404, { "content-type": "application/json" });
			res.end(JSON.stringify({
				ok: false,
				error: {
					code: "not-found",
					message: "unknown endpoint"
				}
			}));
			return;
		}
		const body = await this.readBody(req);
		if (body === void 0) {
			res.writeHead(413, { "content-type": "application/json" });
			res.end(JSON.stringify({
				ok: false,
				error: {
					code: "size",
					message: "body too large"
				}
			}));
			return;
		}
		let payload = {};
		if (body.length > 0) try {
			payload = JSON.parse(body);
		} catch {
			res.writeHead(400, { "content-type": "application/json" });
			res.end(JSON.stringify({
				ok: false,
				error: {
					code: "json",
					message: "body is not JSON"
				}
			}));
			return;
		}
		if (this.rpcHandler === void 0) {
			res.writeHead(503, { "content-type": "application/json" });
			res.end(JSON.stringify({
				ok: false,
				error: {
					code: "unavailable",
					message: "no handler"
				}
			}));
			return;
		}
		try {
			const outcome = await this.rpcHandler(endpoint, payload);
			res.writeHead(200, { "content-type": "application/json" });
			res.end(JSON.stringify(outcome));
		} catch (error) {
			res.writeHead(500, { "content-type": "application/json" });
			res.end(JSON.stringify({
				ok: false,
				error: {
					code: "handler",
					message: error instanceof Error ? error.message : String(error)
				}
			}));
		}
	}
	cors(res, origin) {
		if (origin.length === 0) return;
		res.setHeader("access-control-allow-origin", origin);
		res.setHeader("vary", "Origin");
		res.setHeader("access-control-allow-methods", "POST, OPTIONS");
		res.setHeader("access-control-allow-headers", "content-type, authorization");
		res.setHeader("access-control-max-age", "600");
	}
	readBody(req) {
		return new Promise((resolve) => {
			const chunks = [];
			let size = 0;
			req.on("data", (chunk) => {
				size += chunk.length;
				if (size > MAX_RPC_BODY_BYTES) {
					resolve(void 0);
					req.destroy();
					return;
				}
				chunks.push(chunk);
			});
			req.on("end", () => resolve(Buffer.concat(chunks)));
			req.on("error", () => resolve(void 0));
		});
	}
	/** Close the listener. Idempotent. */
	stop() {
		if (this.server !== void 0) {
			this.server.close();
			this.server = void 0;
			this.originValue = "";
			this.token = "";
		}
	}
};
//#endregion
//#region src/index.ts
/**
* dsh-mcp-apps host half: opens its own MCP connections to the servers the
* official `mcp-client` plugin already configures (read-only reuse of their
* loader-row config), discovers which tools carry `ui://` App resources, serves
* the separate-origin sandbox proxy page, and exposes a fenced generic RPC
* channel the browser half calls for the App list, App resources, and
* server-tool passthrough. The official mcp-client package is never modified.
*
* On-demand login: when the `dsh-mcp-auth` bundle is present its `mcpAuth`
* service supplies an `authProvider` for each connection, so a protected tool
* called from inside an App can answer 401, drive the consent flow, and be
* retried — the "host runs the OAuth flow on 401 and retries" contract the MCP
* Apps reference host implements. Without that bundle the connections behave as
* before and a 401 stays a plain error.
*
* @module dsh-mcp-apps
*/
const name = "mcp-apps";
const inject = ["settings", "tools"];
const settingsNamespace = dshSettings.settingsNamespace;
const NS = settingsNamespace !== void 0 ? settingsNamespace("mcp-apps") : "mcp-apps";
const EndpointSchema = z.object({ 
/** Bootstrap the browser half reads: listener origin + per-boot token. */
endpointJson: z.string().default("") });
const Config = z.object({
	/** Allowlist of mcp-client `serverName` values; empty mirrors every row. */
	servers: z.array(z.string()).default([]),
	/** Loopback port for the sandbox origin; 0 lets the OS assign one. */
	sandboxPort: z.number().default(0),
	/**
	* Register every connected server's tools on the harness `tools` runtime,
	* backed by this bundle's live-credential connection (default false). When
	* false nothing touches the tool registry. When true, tools whose names the
	* official mcp-client row already owns are skipped with a warning — remove
	* that row from the profile to let this bridge take over.
	*/
	registerTools: z.boolean().default(false)
});
function ok(value) {
	return {
		ok: true,
		value
	};
}
function fail(error) {
	return {
		ok: false,
		error: {
			code: "mcp-apps",
			message: error instanceof Error ? error.message : String(error)
		}
	};
}
async function apply(ctx, config) {
	const listener = new SandboxServer();
	await listener.start(config.sandboxPort);
	ctx.effect(() => () => listener.stop(), "mcp-apps: sandbox origin");
	/**
	* Resolve the auth service **at connection time**, never at apply time.
	*
	* Services are provided by sibling plugins and the apply order between two
	* bundles is not ours to decide, so looking `mcpAuth` up while `apply` runs
	* captures `undefined` for the whole process whenever this bundle happens to
	* be applied first — which is exactly what happened the first time. Reading
	* it when the first request actually arrives is late enough for every plugin
	* to be up, and still avoids the hard `inject` dependency that would disable
	* App support in profiles without the auth bundle.
	*/
	const resolveAuthService = () => ctx.get("mcpAuth");
	const connected = /* @__PURE__ */ new Map();
	let discovery;
	const toolDisposers = /* @__PURE__ */ new Map();
	ctx.effect(() => () => {
		for (const server of toolDisposers.values()) for (const dispose of server.values()) dispose();
		toolDisposers.clear();
		for (const server of connected.values()) server.auth?.dispose();
		connected.clear();
	}, "mcp-apps: lazy auth handles + tool registrations");
	/**
	* Register one server's tools on the harness runtime, when enabled.
	*
	* Runs after discovery so a connection (and its live-credential handle)
	* exists first. Skipped entirely when `registerTools` is false: the
	* registry is not touched, matching the behaviour before the bridge.
	*/
	const bridgeTools = (server) => {
		if (!config.registerTools) return;
		if (toolDisposers.get(server.config.serverName) !== void 0) return;
		const runtime = ctx.tools;
		const call = withLiveCredentials(server.auth, (signal, rawName, args) => server.client.callTool({
			name: rawName,
			arguments: args
		}, void 0, {
			signal,
			timeout: 6e4
		}));
		const { disposers, skipped } = registerServerTools(server.config.serverName, server.allTools, call, {
			runtime,
			warn: (message) => {
				ctx.logger.warn(message);
			}
		});
		toolDisposers.set(server.config.serverName, disposers);
		const names = [...disposers.keys()];
		console.info(`[dsh-mcp-apps] tool bridge: registered ${names.length} tool(s) for "${server.config.serverName}"${names.length > 0 ? ` (${names.join(", ")})` : ""}${skipped.length > 0 ? `, skipped ${skipped.length} already-registered` : ""}`);
	};
	const ensureServers = async () => {
		if (discovery === void 0) discovery = (async () => {
			const configs = discoverServerConfigs(ctx, config.servers);
			for (const cfg of configs) try {
				const authService = resolveAuthService();
				const server = await connectAndDiscover(cfg, authService !== void 0 ? { lazyAuth: (serverName, serverUrl) => authService.lazyAuth(serverName, serverUrl) } : {});
				connected.set(cfg.serverName, server);
				try {
					bridgeTools(server);
				} catch (error) {
					ctx.logger.warn(`mcp-apps: tool bridge failed for server "${cfg.serverName}": ${error instanceof Error ? error.message : String(error)}`);
				}
			} catch (error) {
				ctx.logger.warn(`mcp-apps: App discovery failed for server "${cfg.serverName}": ${error instanceof Error ? error.message : String(error)}`);
			}
		})();
		await discovery;
	};
	const serverOf = (serverName) => connected.get(serverName);
	/**
	* Whether a request failure means "this connection's credentials are gone
	* and a login could fix them".
	*
	* Two shapes qualify. `UnauthorizedError` is the SDK saying a consent page
	* has to be approved. A message mentioning a rejected refresh (or a revoked
	* grant) is the SDK's *refresh* path failing — it never becomes
	* `UnauthorizedError` because the refresh path cannot ask for a human. The
	* demo makes this reachable: its "Revoke token" tool is itself protected,
	* so a fresh login triggered from that button ends up revoked by its own
	* call, and without this branch every later request would fail forever with
	* the stored-but-dead grant.
	*/
	const isFixableByLogin = (error) => {
		if (error instanceof UnauthorizedError) return true;
		const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
		return message.includes("refresh token") || message.includes("revoked") || message.includes("invalid_grant");
	};
	/**
	* Run one request against a server, completing an on-demand login and
	* retrying once when the SDK reports the request was not authorized.
	*
	* The transport already handles the *non-interactive* half of a 401 by
	* itself: it re-runs the auth flow and resends the request when that
	* succeeds without user interaction. It throws `UnauthorizedError` only when
	* a human has to approve a consent page — which is precisely the case this
	* retry exists for. A rejected refresh is the other case (see {@link isFixableByLogin}).
	*
	* @param server - the connected server the request targets.
	* @param run - the request, re-invoked once after a successful login.
	*/
	const withLazyAuth = async (server, run) => {
		try {
			return await run();
		} catch (error) {
			if (!isFixableByLogin(error) || server.auth === void 0) throw error;
			console.info(`[dsh-mcp-apps] "${server.config.serverName}" needs authorization; waiting for the consent page`);
			if (await server.auth.authorize() !== "AUTHORIZED") throw error;
			return await run();
		}
	};
	const handler = async (endpoint, payload) => {
		await ensureServers();
		if (endpoint === "list") return ok({
			apps: [...connected.values()].flatMap((entry) => entry.apps),
			sandboxOrigin: listener.origin
		});
		const body = payload ?? {};
		if (endpoint === "resource") {
			const toolName = typeof body.toolName === "string" ? body.toolName : "";
			const server = [...connected.values()].find((s) => s.apps.some((a) => a.toolName === toolName));
			if (server === void 0) return fail(/* @__PURE__ */ new Error(`no App resource for tool ${JSON.stringify(toolName)}`));
			const app = server.apps.find((a) => a.toolName === toolName);
			const { html, csp, permissions } = await withLazyAuth(server, () => readAppResource(server, app.resourceUri));
			return ok({
				html,
				cspJson: csp === void 0 ? null : JSON.stringify(csp),
				permissionsJson: permissions === void 0 ? null : JSON.stringify(permissions),
				sandboxOrigin: listener.origin
			});
		}
		if (endpoint === "call-tool") {
			const server = serverOf(String(body.serverName ?? ""));
			if (server === void 0) return fail(/* @__PURE__ */ new Error(`unknown server ${JSON.stringify(String(body.serverName ?? ""))}`));
			return ok(await withLazyAuth(server, () => server.client.callTool({
				name: String(body.name ?? ""),
				arguments: body.arguments
			})));
		}
		if (endpoint === "read-resource") {
			const server = serverOf(String(body.serverName ?? ""));
			if (server === void 0) return fail(/* @__PURE__ */ new Error(`unknown server ${JSON.stringify(String(body.serverName ?? ""))}`));
			return ok(await withLazyAuth(server, () => server.client.readResource({ uri: String(body.uri ?? "") })));
		}
		if (endpoint === "list-resources") {
			const server = serverOf(String(body.serverName ?? ""));
			if (server === void 0) return fail(/* @__PURE__ */ new Error(`unknown server ${JSON.stringify(String(body.serverName ?? ""))}`));
			return ok(await withLazyAuth(server, () => server.client.listResources()));
		}
		return fail(/* @__PURE__ */ new Error(`unknown endpoint ${JSON.stringify(endpoint)}`));
	};
	listener.setRpcHandler(async (endpoint, payload) => handler(endpoint, payload));
	await ctx.settings.register(NS, EndpointSchema).update({ endpointJson: JSON.stringify({
		origin: listener.origin,
		token: listener.rpcToken
	}) });
}
//#endregion
export { Config, apply, inject, name };

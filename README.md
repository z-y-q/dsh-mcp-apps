# dsh-mcp-apps

> **Requires: dsh v0.1.5-rc.2**（peerDependencies 已精确到 `^0.1.5-rc.2`，装错版本 npm 会拒绝）


MCP Apps display for DeepSeek Harness: renders the `ui://` App resources an MCP
server attaches to its tools inside the tool-call rows of the dsh web GUI, using
the official `@modelcontextprotocol/ext-apps` `AppBridge` and the double-iframe
sandbox architecture from the MCP Apps specification.

The official `@deepseek-ai/dsh-mcp-client` package is never modified. This
bundle reuses its loader-row server configuration (read-only) and opens its own
MCP connections, because the official plugin discards tool `_meta` and exposes
no `resources/read`.

## Install

Add the package to your dsh profile and list it in the profile's
`dsh.profile.bundles`; the bundled `cordis.patch.yml` inserts the `mcp-apps`
host row automatically.

## Config

```yaml
- id: mcp-apps
  name: '@z-y-q/dsh-mcp-apps'
  config:
    servers: []          # allowlist of mcp-client serverName values; empty = all
    sandboxPort: 0       # loopback port for the sandbox origin; 0 = OS-assigned
    registerTools: false # live-credential tool bridge switch (see below); off by default
```

## Security model

- The sandbox proxy page is served from its own loopback-only listener, on a
  port distinct from the dsh web server. A separate PORT is required: the inner
  App iframe carries `allow-same-origin`, so sharing the dsh port would make
  untrusted App HTML same-origin with the dsh API. On a distinct port, a
  cross-origin fetch of the main `/api` fails the harness trust fence
  (`origin.host !== host authority`).
- CSP is delivered as an HTTP response header derived from the resource's
  declared allowlists — never a meta tag. Domain entries containing
  `;`, quotes, spaces, or newlines are rejected.
- The sandbox proxy validates its embedder by referrer (loopback only) and
  refuses top-level loads; all relayed messages carry origin checks.
- Tool/resource calls initiated by an App forward through this bundle's host
  half to its own MCP connection.

## Reusing an mcp-client row's config (including `!!js`)

Server config is read only from the loader's `@deepseek-ai/dsh-mcp-client` rows,
from the row fiber's **already-interpolated** config (`entry.fiber.config`), so:

- credentials injected with `headers: !!js ctx.mcpAuth.headers('x')` reach this
  bundle's own connection too — otherwise a server that requires them shows no
  Apps at all, with only a warn as evidence.
- when the row has no fiber yet, the serialized `entry.options.config` is used
  and any leftover `{__jsExpr}` node is evaluated on a best-effort basis; a node
  that cannot be evaluated is kept as-is and warned about, never silently sent
  as a credential-free request.

`dsh-mcp-auth`'s `headers()` snapshots at bootstrap. That only matters when **no
`authProvider` is installed** (see below): once one is, credentials come from the
provider on every request and a login completed after boot takes effect
immediately.

Debugging: with `DSH_MCP_APPS_DEBUG=1` the discovery pass logs each row's URL and
header **names** (never values) — the quickest way to see whether a connection
carries credentials.

## On-demand login (401 → consent → retry)

The MCP Apps reference host specifies that when an App calls a protected tool,
the server answers 401 + `WWW-Authenticate` and **the host runs the OAuth flow
and retries**. This bundle implements that half.

When `dsh-mcp-auth` is present (resolved through `ctx.get('mcpAuth')`, deliberately
**not** via `inject`, so App support still applies in a profile that does not
install it):

1. Each connection asks it for a lazy-auth handle and passes `provider` to the
   `StreamableHTTPClientTransport` as `authProvider`.
2. **`Authorization` is stripped from the static headers** (`stripAuthorization`).
   This is required: the SDK's `_commonHeaders()` spreads `requestInit.headers`
   *after* the bearer derived from the provider, so a leftover static header
   overrides the freshly obtained token.
3. When a protected call fails with `UnauthorizedError`, `authorize()` runs and
   waits for the approval, then the call is **retried once** — the transport
   reads the token from the provider per request, so the retry carries it.

A `FAILED` outcome rethrows the original error and records why on the auth side
(`lastError()` / `oauthError` in `list`): a silent failure would make "authorization
is broken" indistinguishable from "the user cancelled".

Without `dsh-mcp-auth` the behaviour is exactly as before: a 401 is just an error.

## Live-credential tool bridge (`registerTools: true`)

**What it solves**: the official `dsh-mcp-client` row's credentials are a `!!js`
snapshot **evaluated once at boot** (loader semantics + the schema copy that
severs object identity + the transport reusing one `headers` object — three
gates, none of them bypassable), so a login or re-authorization completed after
boot is invisible to model-side calls and **requires restarting dsh**.

**How**: this bundle registers every server's tools on the harness runtime via
`ctx.tools.register` (**public API** — the same one the official mcp-client
uses), with names and shapes **aligned field-by-field with the official
bridge** — `mcp__<server>__<tool>` (64-char truncation + 12-hex sha256
suffix), `exec.signal` forwarding, `isError → throw`, the
content/structuredContent output schema, and `taskSupport: 'required'` tools
failing at call time with the official message. The `dsh-mcp-security`
baseline fingerprint therefore does not change; its gate keeps applying.

**Execution path**: `execute` rides this bundle's own connection (the
`authProvider` live credentials) — the token is read per request; a 401 or a
rejected refresh triggers the consent flow, and after approval **the very call
is retried**. A failed authorization rethrows the original error.

**Taking over (choose one)**:

1. **Yield mode (recommended)**: set the official row to `disabled: true`. The
   row stays — discovery reads its url/serverName (falling back from the
   unavailable `fiber.config` snapshot to `options.config` plus best-effort
   `!!js` evaluation) — but the official client registers nothing and opens no
   connection; the bridge owns everything.
2. **Coexistence**: keep the official row enabled. Name collisions are
   **skipped with a warning, never hijacked** (the registry's
   `already registered` semantics), so migration can be gradual; disable a row
   when you want that server fully on live credentials.

**Off by default**: with `registerTools: false` the tool registry is never
touched, matching this bundle's earlier behaviour.

## Known limitations

- App display requires the GUI to be reached over loopback (`127.0.0.1` /
  `localhost`); the sandbox proxy is not reachable from LAN browsers.
- App discovery opens a second connection to each configured MCP server.
- `updateModelContext` and `ui/message` notifications from Apps are accepted
  and ignored; only `inline` display mode is offered.
- Tools registered by the bridge carry no `_meta` (the App resource marker) —
  same as the official registration path; App cards are handled separately by
  this bundle's discovery, so the two do not conflict.
- Servers still on the official row (not yielded) keep the boot-time snapshot
  for model-side calls.
- Each lazy-auth handle holds a loopback listener for its lifetime; they are
  disposed with the plugin (`ctx.effect`), and every tool registration is
  unregistered at the same time.

## Model experience

With `registerTools: false` (default) nothing model-visible changes. With it
on, the model sees tools **identical in name and shape** to the official
registrations (the only difference is the live-credential execution path); no
new prompt sections or session events, and KV-cache behavior is unchanged.

## Development

```sh
pnpm install --ignore-workspace
pnpm run build   # tsdown -> lib/index.js (host) + lib/client.js (browser)
pnpm test        # node --test --test-force-exit test/*.test.mjs test/*.test.ts
```

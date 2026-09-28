# dsh-mcp-apps

> **Requires: dsh v0.1.5-rc.2**（peerDependencies 已精确到 `^0.1.5-rc.2`，装错版本 npm 会拒绝）


为 DeepSeek Harness 提供 MCP Apps 展示：把 MCP 服务器附加在工具上的 `ui://`
应用资源渲染到 dsh 网页版的工具调用卡片里，使用官方
`@modelcontextprotocol/ext-apps` 的 `AppBridge` 与 MCP Apps 规范的双层
iframe 沙箱架构。

官方 `@deepseek-ai/dsh-mcp-client` 包不会被修改。本 bundle 只读复用其在
loader 里的服务器配置，并自行建立 MCP 连接——因为官方插件会丢弃工具的
`_meta`，也不提供 `resources/read`。

## 安装

把本包加入 dsh profile 并列入 profile 的 `dsh.profile.bundles`；包内
`cordis.patch.yml` 会自动插入 `mcp-apps` 宿主行。

## 配置

```yaml
- id: mcp-apps
  name: '@z-y-q/dsh-mcp-apps'
  config:
    servers: []          # mcp-client serverName 白名单；留空表示全部
    sandboxPort: 0       # 沙箱源的回环端口；0 表示由系统分配
    registerTools: false # 活凭据工具桥开关（见下节）；默认关闭
```

## 安全模型

- 沙箱代理页由独立的仅回环监听器提供，端口与 dsh 网页服务器不同。必须
  使用独立端口：内层 App iframe 带有 `allow-same-origin`，若与 dsh 同端口，
  不受信任的 App HTML 就会与 dsh API 同源。独立端口下，跨源请求主 `/api`
  会被 harness 信任栅栏拒绝（`origin.host !== host authority`）。
- CSP 以 HTTP 响应头下发（来自资源声明的域名白名单），绝不使用 meta 标签。
  含 `;`、引号、空格或换行的域名条目会被拒绝。
- 沙箱代理通过 referrer 校验嵌入方（仅回环），拒绝顶层加载；所有转发的
  消息都带来源校验。
- App 发起的工具/资源调用经本 bundle 宿主侧转发到自己的 MCP 连接。

## 复用 mcp-client 行的配置（含 `!!js`）

服务器配置只读复用 loader 里 `@deepseek-ai/dsh-mcp-client` 的行，读的是**该行
fiber 已插值好的配置**（`entry.fiber.config`），因此：

- 行里用 `headers: !!js ctx.mcpAuth.headers('x')` 注入的凭据，会**同样出现在本
  插件自己的那条连接上**——否则需要鉴权的服务器上 App 会静默不显示（只留一条 warn）。
- 若该行尚未启动（没有 fiber），退回读序列化原文 `entry.options.config`，
  并对残留的 `{__jsExpr}` 节点尽力求值；求值失败时**原样保留并 warn**，绝不静默发一个
  不带 `Authorization` 的请求。

注意 `dsh-mcp-auth` 的 `headers()` 在**引导时**取快照。但那**只影响**没有装
`authProvider` 的情况（见下节）；装了之后凭据由 provider 每次请求现取，
引导之后新完成的登录**立刻**生效。

调试：`DSH_MCP_APPS_DEBUG=1` 时，发现阶段会打印每行的 URL 与**请求头名字**
（从不打印值），用于判断"这条连接到底带没带凭据"。

## 按需登录（401 → 弹授权 → 自动重试）

MCP Apps 参考宿主有一条约定：App 里调用受保护工具时，服务器回 401 +
`WWW-Authenticate`，**宿主去跑 OAuth 然后重试**。本插件把这半条补上了。

装上 `dsh-mcp-auth` 时（通过 `ctx.get('mcpAuth')` 解析，**不写进 `inject`**，
所以在没有该 bundle 的 profile 里 App 功能照常可用）：

1. 建连接时向它要一个懒认证句柄，把 `provider` 交给
   `StreamableHTTPClientTransport` 的 `authProvider`。
2. **同时从静态 headers 里剥掉 `Authorization`**（`stripAuthorization`）——
   必须这么做：SDK 的 `_commonHeaders()` 把 `requestInit.headers` 展开在
   provider 的 bearer **之后**，留下的静态头会覆盖刚拿到的令牌。
3. 受保护工具调用失败且异常是 `UnauthorizedError` 时，调 `authorize()`
   等人批准，成功后**重试一次**（transport 每次都向 provider 取令牌，所以
   重试自然带上新令牌）。

`authorize()` 返回 `FAILED` 时抛回原始异常，并在 mcp-auth 侧记录原因
（`lastError()` / `list` 的 `oauthError`）——不静默失败，否则"授权坏了"和
"用户取消了"外观一致。

未装 `dsh-mcp-auth` 时行为与从前完全一致：401 直接当错误抛出。

## 活凭据工具桥（`registerTools: true`）

**解决什么**：官方 `dsh-mcp-client` 行的凭据是 `!!js` **启动时求值一次的快照**（loader
语义 + schema 拷贝断引用 + transport 复用同一份 headers，三道闸都无法绕过），所以
启动后新完成的登录/重新授权，模型侧永远看不到，**必须重启 dsh**。

**怎么做**：本插件用 `ctx.tools.register`（**公开 API**，官方 mcp-client 用的同一个）
把每个服务器的全部工具注册给模型，名字与形状**逐字段对齐官方**——
`mcp__<server>__<tool>`（64 字符截断 + 12 位 sha256 后缀）、`exec.signal` 透传、
`isError → throw`、content/structuredContent 输出 schema、`taskSupport: required`
的工具调用时报官方同款错误。因此 `dsh-mcp-security` 的基线指纹**不变**，安全门照常生效。

**执行路径**：`execute` 走本插件自己的连接（`authProvider` 活凭据）——每次调用现取
令牌；401/refresh 被拒 → 自动弹授权 → 用户同意 → **重试当次调用**。授权失败则原样抛错。

**接管方式（二选一）**：

1. **让位模式（推荐）**：官方行加 `disabled: true`。行保留——本插件的发现逻辑会读
   disabled 行的 url/serverName（`fiber.config` 快照不可用时走 `options.config` +
   `!!js` 尽力求值的兜底路径）——但官方不再注册工具、不建连接，全部由桥接管。
2. **共存模式**：官方行保持启用。重名工具桥会**跳过并 warn，绝不抢注**（注册表
   `already registered` 语义），可渐进迁移；想让某服务器彻底切到活凭据时再 disable 那行。

**默认关闭**：`registerTools: false` 时不碰工具注册表，行为与本插件早期版本一致。

## 已知限制

- 展示 App 需要通过回环地址（`127.0.0.1` / `localhost`）访问 GUI；沙箱代理
  对局域网浏览器不可达。
- App 发现会为每个已配置的 MCP 服务器建立第二条连接。
- App 的 `updateModelContext` 与 `ui/message` 通知被接受但忽略；只提供
  `inline` 显示模式。
- 工具桥注册的工具不带 `_meta`（App 资源标记）——与官方注册行为一致；App 卡片
  由本插件的发现逻辑另行负责，两者不冲突。
- 仍走官方行（未让位）的服务器，模型侧凭据依旧是启动快照。
- 懒认证句柄各持一个回环监听器，随插件卸载一起关闭（`ctx.effect` 里 dispose）；
  工具注册同样在卸载时全部反注册。

## 模型体验

`registerTools: false`（默认）时不改变任何模型可见面。`registerTools: true` 时模型会
看到与官方注册**完全同名同形状**的工具（唯一的差别在执行路径的凭据是活的），无新增
提示词段落或会话事件，KV 缓存行为不变。

## 开发

```sh
pnpm install --ignore-workspace
pnpm run build   # tsdown -> lib/index.js（宿主）+ lib/client.js（浏览器）
pnpm test        # node --test --test-force-exit test/*.test.mjs test/*.test.ts
```

> `node --test test/` 会把 `test/` 目录本身当模块加载而报 `MODULE_NOT_FOUND`，
> 所以显式列出用例文件。

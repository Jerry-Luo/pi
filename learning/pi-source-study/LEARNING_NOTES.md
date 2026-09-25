# 学习笔记

这里保存自己的解释、调用链、图示文字与待验证推测。`STUDY_STATE.md` 保存当前位置，本文件保存理解过程。

## 记录模板

```markdown
## 课时 NN：名称

### 课时 NN：具体链路
`输入 → 边界 → 状态变化 → 输出`

### 课时 NN：已验证事实
- `路径:符号`：事实。

### 课时 NN：设计原因
- 问题：
- 具体例子：
- 当前方案：

### 课时 NN：待验证问题
- 问题；下一次应读取的路径或测试。
```

---

## 课时 00：仓库地图与学习环境

### 00.1 README

### 00.1 具体链路
`coding-agent CLI → agent 运行时 → ai Provider 抽象 → tui 终端界面`

### 00.1 已验证事实
- `README.md`：`packages/coding-agent` 是交互式 Coding Agent CLI。
- `README.md`：`packages/agent` 提供带工具调用和状态管理的 Agent 运行时。
- `README.md`：`packages/ai` 统一多个 LLM Provider；`packages/tui` 提供差分渲染的终端 UI。

### 00.1 设计原因
- 问题：CLI 产品既要管理用户配置和会话，又要执行模型与工具循环。
- 具体例子：若 Agent 直接实现每个模型厂商的协议，增加 Provider 会修改运行时循环。
- 当前方案：产品层、Agent 运行时、模型协议适配层和终端 UI 分层协作。

### 00.1 待验证问题
- 无。

### 00.2 根 package.json

### 00.2 已验证事实
- 根 `package.json`：工作区包括 `packages/*`、`packages/session-backends/*` 和部分带依赖的扩展示例。
- 根 `package.json`：构建顺序为 `chord → tui → telemetry → ai → agent → session-backends/sqlite-node → protocol → client → server → coding-agent`。

### 00.2 设计原因
- 问题：工作区需要在消费方构建前提供可用产物。
- 具体例子：`coding-agent` 最后构建，但其用户输入的运行链路不经过所有先构建的包。
- 当前方案：将构建依赖顺序与运行时调用顺序分开理解。

### 00.3.1 coding-agent manifest

### 00.3.1 已验证事实
- `packages/coding-agent/package.json`：发布包名为 `@earendil-works/pi-coding-agent`，CLI 映射为 `bin.pi → dist/bundle/cli.js`。
- `packages/coding-agent/package.json`：生产内部依赖为 `@earendil-works/chord`、`@earendil-works/pi-agent-core`、`@earendil-works/pi-ai` 与 `@earendil-works/pi-tui`。

### 00.3.1 设计原因
- 问题：CLI 产品不应直接实现 Agent 循环、厂商模型协议和终端组件系统。
- 当前方案：`coding-agent` 组合 Agent Core、AI、TUI 与 Chord 的独立能力。

### 00.3.2 Web 应用边界推理

### 00.3.2 已验证事实
- Web 应用可直接组合 `pi-agent-core` 与 `pi-ai`，并用浏览器 UI 替代 `pi-tui`。
- `pi-coding-agent` 绑定 CLI、终端会话、扩展资源和 TUI 生命周期，不适合作为 Web UI 的嵌入层。

### 00.3.2 设计原因
- 问题：浏览器和终端的输入、输出和生命周期不同。
- 当前方案：复用与界面无关的 Agent 和模型层，在产品边界实现浏览器界面。

### 00.4 UI 可替换边界

### 00.4 已验证事实
- Agent 以消息、工具和事件建立 UI 无关边界；UI 负责适配输入并消费事件呈现结果。
- 替换终端 UI 不会改变模型 Provider 或工具调用循环。

### 00.4 设计原因
- 问题：同一 Agent 能力必须适配终端和浏览器等不同交互环境。
- 当前方案：将模型与工具循环置于 Agent 层，把 UI 特定逻辑保留在产品层。

---

## 课时 01：CLI 启动与交互入口

### 阅读方式
- 从用户实际执行的入口开始，沿控制流顺序逐行阅读。
- 每次只解释 5–20 行：每个非空行、陌生的 TypeScript/JavaScript 语法、变量当前值及其下一步去向。
- 遇到函数调用时，先说明输入、输出和调用原因；仅在当前控制流到达时进入函数体。
- 保持“安装与构建”“程序启动”“会话运行”三条链路分开，避免跨层跳读。

### 01.1 已读入口
- `~/.nvm/versions/node/v26.7.0/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js:1–5`：shebang 启动 Node；导入 Node 内置模块；启用编译缓存；随后基于当前模块路径加载 `cli-runtime.js`。

### 01.1 本次定向阅读
- `~/.nvm/versions/node/v26.7.0/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli-runtime.js:1–3`：第 1 行是可执行脚本声明；第 2 行为 Node ESM 创建 `require`；第 3 行静态导入主 chunk 的 `APP_NAME`、`configureHttpDispatcher`、`main` 及七个副作用 chunk，随后定义并调用 `setupCli()`，最后调用 `main(process.argv.slice(2))`。
- 静态 `import` 的依赖模块在本模块主体求值前求值；因此不能按第 3 行从左到右把它们当成普通函数调用。`setupCli()` 在 `main(...)` 之前，但不在依赖模块的求值之前。
- 当前安装产物的主 chunk 名为 `chunk-4DKZACXI.js`；旧状态记录的 `chunk-CMRUVXTE.js` 不是当前文件内容。chunk 名字不应被视为稳定调用边界。
- 只要仓库与安装版本不一致，就应立即提醒学习者将两者更新到完全一致。当前仓库为 `0.87.1`，已安装包为 `0.87.0`；对齐前以仓库源码学习，但暂停用安装产物验证仓库行为。
- 后续讲解必须直接给出正在学习的文件路径、最小完整源码和行号，并逐行说明语法、当前值、执行效果及下一步去向，不能只给摘要让学习者自行寻找文件。
- 因果、边界和调用链结论由导师直接说明；只按调用链顺序逐步讲解，不向学习者提问或设置检查题，学习者有问题时主动提出。
- `packages/coding-agent/src/cli.ts:1–6` 是 bundle 背后的源码入口：静态导入 `setupCli` 与 `main`，先执行进程级 CLI 初始化，再把 `process.argv.slice(2)` 交给 `main`。

### 01.1 推理结论与下一项
- 主 chunk 的模块顶层初始化先于 `setupCli()` 和 `main(...)`，因为 ESM 会先求值静态依赖，再求值当前模块主体。
- `setupCli()` 必须先于 `main(...)`：`main` 的认证、包管理、配置解析和后续 Provider 路径都应在 CLI 进程标识、环境变量、warning 策略及初始 HTTP dispatcher 已建立的环境中运行。
- 当前仓库与已安装 Pi 的 `package.json:3` 均为 `0.87.1`，版本已对齐。
- `packages/coding-agent/src/main.ts:566–588`：`main` 的入参来自 `cli.ts`；先处理可选计时、扩展工厂、离线环境标志，再用 `runAuthCommand` 对认证命令早返回。普通启动则进行安装清理，并用 `projectTrusted: false` 的设置管理器读取全局代理配置；`applyHttpProxySettings` 后重新调用 `configureHttpDispatcher`。在此阶段尚未解析常规参数或创建会话。
- 下一段：`packages/coding-agent/src/main.ts:590–606`，继续看 package/config 命令是否短路。

### 01.1 package/config 命令分流
- `packages/coding-agent/src/main.ts:590–601`：`handlePackageCommand` 先接收原始 `args` 和合并后的 `extensionFactories`。未识别 package 命令时返回 `false`；识别后通常按 `process.exitCode ?? 0` 强制退出，避免扩展留下的活动句柄阻止一次性命令结束。
- Windows 上成功的 `pi update` 是强制退出的窄例外：`main` 直接返回，让 Node 自然排空事件循环，规避 `fetch()` teardown 期间可能发生的 Node 断言。
- `packages/coding-agent/src/main.ts:603–605`：只有 package handler 未接管时才调用 `handleConfigCommand`；config 一旦被处理，`main` 返回，因此不会进入通用 `parseArgs`、Session、Agent runtime 或 UI 创建。
- `packages/coding-agent/src/package-manager-cli.ts:791–803,864–875`：两个 handler 都以布尔值表达“是否接管当前命令”；这使 `main` 只负责顶层分流，而具体命令保留自己的解析和执行边界。
- `extensionFactories` 会参与 package/config 所需的设置、资源与项目信任解析，但此时仍未创建 Agent Session。
- 下一段：`packages/coding-agent/src/main.ts:607–617`，继续看通用参数解析与 diagnostics 处理。

### 01.1 通用参数解析与 diagnostics
- `packages/coding-agent/src/main.ts:607`：只有未被 auth/package/config 命令接管的原始 `args` 才交给通用 `parseArgs`；参数结构的内部细节留到课程指定的 `cli/args.ts` 阅读项。
- `packages/coding-agent/src/main.ts:608–616`：解析产生的 diagnostics 会全部遍历并输出到 stderr；error 使用红色，warning 使用黄色，前缀也由类型决定。
- diagnostics 中只要存在任一 error，进程就以状态码 1 退出；仅有 warning 时不会中断，因此后续启动仍可继续。
- `packages/coding-agent/src/main.ts:617`：成功通过诊断门禁后记录 `parseArgs` 计时点；存在 error 时不会执行到这里。
- 下一段：`packages/coding-agent/src/main.ts:619–636`，继续看 version/export 一次性命令分流。

### 01.1 version/export 一次性命令分流
- `packages/coding-agent/src/main.ts:619–622`：`parsed.version` 为真时只输出构建版本并以状态码 0 退出；该路径不会创建 Session、Agent runtime 或 UI。
- `packages/coding-agent/src/main.ts:624–628`：`parsed.export` 提供待导出的会话来源；第一个 `parsed.messages` 位置参数被解释为可选输出路径，然后异步调用 `exportFromFile`。
- `packages/coding-agent/src/main.ts:629–635`：导出异常被收窄为可显示消息并以状态码 1 退出；导出成功则打印实际输出路径并以状态码 0 退出。
- 当前课程场景是“交互终端、带初始 prompt、创建新会话”，因此 `parsed.version` 为假且 `parsed.export` 未定义，这两个分支都会跳过。
- 下一段：`packages/coding-agent/src/main.ts:638–647`，继续看 app mode、stdout 接管与 RPC 文件参数校验。

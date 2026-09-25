# 学习状态

> 此文件是学习进度的唯一状态源。每次读取一个新源码项前先更新“当前项”；读完后立即更新勾选、事实和下一项。

## 当前检查点

- 当前课时：`01`（CLI 启动与交互入口）
- 状态：`进行中`（可选：未开始 / 进行中 / 阻塞 / 已完成）
- 当前项：`01.1 — 进入仓库 packages/coding-agent/src/main.ts:main`
- 下一步：`继续 main.ts:638–647 的 app mode、stdout 接管与 RPC 文件参数校验；直接给出源码并逐行讲解。`
- 上次确认的源码：`packages/coding-agent/src/main.ts:619–636`
- 阻塞原因：`无；仓库与已安装 Pi 均为 0.87.1。`

## 课时完成情况

- [x] 00 仓库地图与学习环境
- [ ] 01 CLI 启动与交互入口
- [ ] 02 Agent 的状态、事件与循环
- [ ] 03 工具调用生命周期
- [ ] 04 Session、存储与上下文压缩
- [ ] 05 模型、认证与 Provider 抽象
- [ ] 06 TUI 渲染与输入处理
- [ ] 07 编码代理的运行时编排
- [ ] 08 扩展系统与配置资源
- [ ] 09 其余工作区的系统边界
- [ ] 10 全链路复盘与贡献准备

## 当前课时的逐项进度

将当前课时中已经完成的项复制到这里并勾选；不要提前复制后续课时。

- [ ] 01.1 从真实 `pi` 启动器映射回仓库 `packages/coding-agent/src/cli.ts`，按执行顺序逐行阅读至 `main`。

## 已验证事实

只记录带有文件路径或测试证据的事实；推测写入“待验证问题”。

- `README.md`：Pi 的核心产品链路包含编码代理 CLI、Agent 运行时、统一多 Provider 的 AI API，以及终端 UI。
- `README.md`：`packages/coding-agent`、`packages/agent`、`packages/ai`、`packages/tui` 是课程优先学习的四个工作区。
- `README.md`：`agent` 是可被上层应用使用的 Agent 运行时；`coding-agent` 是面向用户的 CLI 产品层。
- 根 `package.json`：`build` 是依赖构建顺序；它不能直接表示一次用户请求的运行调用链。
- 根 `package.json`：`workspaces` 还包含 `packages/session-backends/*` 和若干带依赖的 Coding Agent 扩展示例。
- 根 `package.json`：构建顺序在 `telemetry` 与 `agent` 之间包含 `ai`。
- `packages/coding-agent/package.json`：发布包为 `@earendil-works/pi-coding-agent`，并以 `bin.pi → dist/bundle/cli.js` 提供 CLI。
- `packages/coding-agent/package.json`：生产内部依赖包括 `chord`、`pi-agent-core`、`pi-ai` 与 `pi-tui`。
- `packages/coding-agent/src/cli.ts:1–6`：仓库 CLI 源码入口先调用 `setupCli()`，再将 `process.argv.slice(2)` 传给异步 `main`。
- `packages/coding-agent/src/cli/setup.ts:1–13`：`setupCli` 在进入 `main` 前设置进程标题、两个环境变量和 warning 策略，并初始化 HTTP dispatcher。
- `~/.nvm/versions/node/v26.7.0/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js:1–5`：已安装的 `pi` 启动器启用 Node 编译缓存后加载同目录的 `cli-runtime.js`。
- `~/.nvm/versions/node/v26.7.0/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli-runtime.js:2–3`：当前安装产物从 `./chunks/chunk-4DKZACXI.js` 静态导入 `APP_NAME`、`configureHttpDispatcher`、`main`，另有七个副作用导入；模块依赖先于本模块代码求值，随后执行 `setupCli()` 和 `main(process.argv.slice(2))`。旧记录中的 `chunk-CMRUVXTE.js` 文件名已不适用于当前安装产物。
- `packages/coding-agent/package.json:30–33`：本仓库构建先以 `tsgo` 生成未打包 JavaScript，再执行 `scripts/build-coding-agent-bundle.mjs`。
- `scripts/build-coding-agent-bundle.mjs`：esbuild 以 `dist/cli.js` 为 `cli-runtime` 入口，开启 bundle、ESM splitting；随后脚本写入只启用编译缓存并加载 `cli-runtime.js` 的 `dist/bundle/cli.js` 启动器。
- 先前检查时当前仓库与已安装包均为 `0.86.1`，当时构建脚本写入的启动器内容与已安装 `dist/bundle/cli.js` 一致。
- 当前 `packages/coding-agent/package.json:3` 与已安装 `@earendil-works/pi-coding-agent/package.json:3` 均为 `0.87.1`；仓库源码与实际安装版本已对齐。
- `packages/coding-agent/src/main.ts:566–577`：`main` 先重置可选启动计时、合并内建与传入扩展工厂、归一化离线标记；认证命令若被处理则直接返回，不进入常规启动。
- `packages/coding-agent/src/main.ts:579–588`：非认证路径先做安装清理，再以不信任项目的设置管理器读取全局代理设置，应用环境代理并重新配置 HTTP dispatcher；此时尚未创建会话。
- `packages/coding-agent/src/main.ts:590–601`：package handler 在通用参数解析前接管一次性命令；通常按 `process.exitCode ?? 0` 强制退出，唯独 Windows 上成功的 `pi update` 从 `main` 返回，让事件循环自然排空以规避 Node teardown 断言。
- `packages/coding-agent/src/main.ts:603–605` 与 `packages/coding-agent/src/package-manager-cli.ts:791–803`：只有 package handler 未接管时才检查首参数为 `config` 的命令；config 一旦被处理，`main` 立即返回，不会创建常规会话。
- `packages/coding-agent/src/package-manager-cli.ts:743–788,829–834`：package/config 命令接收合并后的 `extensionFactories`，因为其设置与项目信任解析可能需要扩展参与；这不等于创建 Agent Session。
- `packages/coding-agent/src/main.ts:607–617`：只有未被 auth/package/config 接管的参数才进入通用 `parseArgs`；所有 diagnostics 会先按 error/warning 着色输出到 stderr，任一 error 使进程以 1 退出，仅有 warning 时继续并记录 `parseArgs` 启动计时。
- `packages/coding-agent/src/main.ts:619–622`：`--version` 在通用参数解析成功后输出 `VERSION` 并以状态码 0 退出，不创建 Session 或 UI。
- `packages/coding-agent/src/main.ts:624–636`：`--export` 将第一个位置消息参数作为可选输出路径传给 `exportFromFile`；失败时输出规范化错误并以 1 退出，成功时输出目标路径并以 0 退出。
- 00.3：Web 应用应复用 `pi-agent-core` 与 `pi-ai`，并以自身 UI 替代 CLI 产品层和 TUI；`chord` 按服务组合需求选择。
- 00.4：Agent 以消息、工具和事件作为 UI 无关的边界，因此替换终端 UI 不需要重写模型 Provider 或工具循环。

## 待验证问题

- 第 01 课：`packages/coding-agent/src/main.ts` 在一次 CLI 启动中承担哪些产品层决策？

## 会话日志

每次结束或暂停时追加一条。保持简短，以便下一会话快速定位。

| 日期 | 课时 | 结果 | 下一项 |
| --- | --- | --- | --- |
| 未开始 | 00 | 初始化课程 | 00.1 |
| 当前会话 | 00 | 完成 README 理解检查；确认四个核心包的分层 | 00.2 |
| 当前会话 | 00 | 完成根 workspace 与构建顺序学习 | 00.3 |
| 当前会话 | 00 | 00.3 首次回答误读根 manifest；恢复目标已明确为 coding-agent manifest | 00.3 |
| 当前会话 | 00 | 完成 coding-agent manifest：确认 bin 与四个内部生产依赖 | 00.3：agent manifest |
| 当前会话 | 00 | 学习策略改为场景讲解、定向阅读与推理；停止 package manifest 抄写 | 00.3：核心包边界推理 |
| 当前会话 | 00 | 完成 Web 应用复用 Agent 的边界推理 | 00.4：四层主链路 |
| 当前会话 | 00 | 完成四层职责与 UI 可替换边界；第 00 课完成 | 01.1 |
| 当前会话 | 01 | 01.1 进行中：已读 main 的模式、会话、运行时和模式分流路径，等待推理回答 | 01.1 |
| 当前会话 | 01 | 01.1 改从 cli.ts 入口学习：确认 shebang、setupCli 与 main 的直接调用，等待参数传递推理 | 01.1 |
| 当前会话 | 01 | 01.1 确认已安装启动器经 cli-runtime.js 导入并调用打包后的 main | 01.1 |
| 当前会话 | 01 | 01.1 确认当前仓库构建为 tsgo 后交给 esbuild；发现仓库 0.85.1 与已安装包 0.86.1 不匹配 | 01.1 |
| 当前会话 | 01 | 更新后重验完成：仓库和已安装包均为 0.86.1，构建脚本已明确生成 cli-runtime.js 与缓存启动器 | 01.1 |
| 当前会话 | 01 | 01.1 改用三层状态表讲解，避免混淆终端、进程、会话和运行时目录 | 01.1 |
| 当前会话 | 01 | 01.1 开始按执行顺序逐行阅读：完成已安装 cli.js:1–5，下一项为 cli-runtime.js:1 | 01.1 |
| 当前会话 | 01 | 暂停：当前项进行中；最后读到已安装 cli.js:1–5，下一项 cli-runtime.js:1，沿实际执行顺序逐行学习 | 01.1 |
| 当前会话 | 01 | 读到已安装 cli-runtime.js:1–3；发现当前 chunk 名称与旧记录不同；等待静态导入、setupCli、main 的执行顺序推理 | 01.1 |
| 当前会话 | 01 | 按反馈重讲 cli-runtime.js 全部三行；核对发现已安装包已升至 0.87.0，而仓库仍为 0.86.1 | 01.1 |
| 当前会话 | 01 | 用户更新仓库至 0.87.1；学习主线从安装产物切回仓库 cli.ts，安装包 0.87.0 仅作入口旁证 | 01.1：cli.ts → setupCli |
| 当前会话 | 01 | 完成仓库 setupCli；改为导师直接给出推理结论；版本未一致时必须提醒对齐 | 01.1：main |
| 当前会话 | 01 | 仓库与安装版本均为 0.87.1；讲解 main.ts:566–588，下一步 package/config 命令分流 | 01.1：main.ts:590–606 |
| 当前会话 | 01 | 完成 main.ts:590–606：确认 package/config 一次性命令在通用参数解析前短路 | 01.1：main.ts:607–617 |
| 当前会话 | 01 | 明确教学方式：只按调用链逐步讲解，不主动提问；当前源码检查点不变 | 01.1：main.ts:607–617 |
| 当前会话 | 01 | 完成 main.ts:607–617：通用参数解析会汇总输出 diagnostics，存在 error 时退出 | 01.1：main.ts:619–636 |
| 当前会话 | 01 | 完成 main.ts:619–636：version/export 在会话创建前完成并退出 | 01.1：main.ts:638–647 |

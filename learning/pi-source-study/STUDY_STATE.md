# 学习状态

> 此文件是学习进度的唯一状态源。每次读取一个新源码项前先更新“当前项”；读完后立即更新勾选、事实和下一项。

## 当前检查点

- 当前课时：`01`（CLI 启动与交互入口）
- 状态：`进行中`（可选：未开始 / 进行中 / 阻塞 / 已完成）
- 当前项：`01.1 — 追踪 cli-runtime.js 的构建来源与 main 的职责`
- 下一步：`回答“为何将缓存启动器与 CLI runtime 分离”的推理题；当前项保持进行中。`
- 上次确认的源码：`packages/coding-agent/package.json:30–33、scripts/build-coding-agent-bundle.mjs:1–187；已安装 dist/bundle/cli.js:1–5、cli-runtime.js:1`
- 阻塞原因：`无`

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

- [ ] 01.1 追踪 `cli-runtime.js` 的构建来源与 `main` 的职责。

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
- `~/.nvm/versions/node/v26.7.0/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli.js:1–5`：已安装的 `pi` 启动器启用 Node 编译缓存后加载同目录的 `cli-runtime.js`。
- `~/.nvm/versions/node/v26.7.0/lib/node_modules/@earendil-works/pi-coding-agent/dist/bundle/cli-runtime.js:1`：运行时包从 `chunk-CMRUVXTE.js` 导入 `main`，执行 `setupCli()`，再以 `process.argv.slice(2)` 调用 `main`。
- `packages/coding-agent/package.json:30–33`：本仓库构建先以 `tsgo` 生成未打包 JavaScript，再执行 `scripts/build-coding-agent-bundle.mjs`。
- `scripts/build-coding-agent-bundle.mjs:132–163`：当前仓库以 `dist/cli.js` 为 esbuild 入口，开启 bundle、ESM splitting，并输出 `dist/bundle/cli.js` 与 chunks。
- 当前仓库版本为 `0.85.1`，已安装包版本为 `0.86.1`；当前构建脚本中没有 `cli-runtime.js`，故不能用本检出版本证明该启动器的精确生成步骤。
- 00.3：Web 应用应复用 `pi-agent-core` 与 `pi-ai`，并以自身 UI 替代 CLI 产品层和 TUI；`chord` 按服务组合需求选择。
- 00.4：Agent 以消息、工具和事件作为 UI 无关的边界，因此替换终端 UI 不需要重写模型 Provider 或工具循环。

## 待验证问题

- 第 01 课：`packages/coding-agent/src/main.ts` 在一次 CLI 启动中承担哪些产品层决策？
- 已安装 `0.86.1` 包中 `cli-runtime.js` 的精确生成提交或脚本是什么？需要对应版本的源码或发布构建记录验证。

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

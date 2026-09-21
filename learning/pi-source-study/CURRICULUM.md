# Pi 源码学习课程

每课均有范围、阅读顺序、提问、产出和完成条件。阅读顺序是导师备课与定向阅读的导航，不是学习者的逐文件抄写清单。

每课固定采用“场景 → 讲解 → 定向阅读 → 推理 → 检查点”：导师先解释真实执行场景和关键设计，再让学习者读取足以验证解释的最小源码片段；练习只检验调用链、边界和取舍。

## 00：仓库地图与学习环境

**目标**：建立工作区地图，知道主产品为何由四个核心包构成。

**导师材料**：`README.md`、根 `package.json`、四个核心包的 `package.json` 与根 TypeScript 配置。它们只用于建立边界地图；不要求学习者逐项复述字段。

**场景与讲解**：用户执行 `pi` 时，`coding-agent` 是产品入口；它组合 `agent` 的状态与工具循环、`ai` 的 Provider 能力，以及 `tui` 的终端显示。根 `build` 的顺序反映工作区构建依赖，不等同于该场景的运行调用顺序。

**推理问题**：若一个 Web 应用想复用 Pi 的模型与工具循环，但不需要终端界面，它应该复用哪些包、避开哪个包？为什么？

**产出**：在笔记中写出主链路：`CLI 输入 → 编码代理编排 → Agent 事件循环 → 模型流 → TUI 输出`，并为每个箭头标出负责的包。

**完成条件**：不看 README 能说明四个核心包的职责，且每项都有路径证据。

---

## 01：CLI 启动与交互入口

**目标**：从命令行参数追到交互模式和会话创建。

**阅读顺序**：

1. `packages/coding-agent/src/cli.ts`：CLI 的可执行入口。
2. `packages/coding-agent/src/main.ts`：先读 `main`、`resolveAppMode`、`createSessionManager`、`buildSessionOptions`。
3. `packages/coding-agent/src/cli/args.ts`：`Args` 与 `Mode`；只记录启动决策所需字段。
4. `packages/coding-agent/src/core/agent-session.ts`：先看公开状态和构造边界，不深挖模型切换细节。
5. `packages/coding-agent/src/modes/interactive/interactive-mode.ts`：只读 `InteractiveMode`、`init`、`run`、`mountInteractiveTui`。
6. `packages/coding-agent/test/initial-message.test.ts`、`packages/coding-agent/test/session-id-readonly.test.ts`：用测试确认初始消息与会话参数的规则。

**追踪任务**：选择一个“交互终端、带初始 prompt、创建新会话”的场景，写出参数如何变成会话、运行时和交互模式。

**产出**：一条不少于五步的调用链；列出 `text/json/rpc` 三种模式中本课已确认的分流点。

**完成条件**：能解释 `main` 为什么必须先完成参数和会话决策，再创建交互 UI。

---

## 02：Agent 的状态、事件与循环

**目标**：理解一次 Agent turn 的公开契约和内部循环。

**阅读顺序**：

1. `packages/agent/src/types.ts`：`AgentContext`、`AgentLoopConfig`、`AgentMessage`、`AgentEvent`。
2. `packages/agent/src/agent.ts`：`Agent` 构造器、`prompt`、`continue`、订阅机制与队列语义。
3. `packages/agent/src/agent-loop.ts`：`agentLoop`、`runAgentLoop`、`runAgentLoopContinue`、`runLoop`。
4. `packages/agent/test/agent-loop.test.ts`：从事件断言还原一个正常 turn 与一个失败路径。

**追踪任务**：从 `Agent.prompt()` 开始，列出一轮没有工具调用的事件顺序；再写出 `continue()` 不能以 assistant 消息结束的原因。

**产出**：事件序列图和“状态由谁拥有、谁只观察状态”的说明。

**完成条件**：能区分 `Agent`（长寿命状态与编排）和 `runAgentLoop`（一轮执行）的职责。

---

## 03：工具调用生命周期

**目标**：理解模型发起工具调用后的验证、执行、事件与结果回写。

**阅读顺序**：

1. `packages/coding-agent/src/core/tools/index.ts`：从 `Tool` 类型和内建工具装配开始。
2. `packages/agent/src/types.ts`：工具相关类型与 `AgentLoopConfig` 中的工具钩子。
3. `packages/agent/src/agent-loop.ts`：`prepareToolCall`、顺序和并行执行路径、结果消息创建与事件发射。
4. `packages/agent/src/harness/execution/tools.ts`：了解 Harness 层的工具执行边界。
5. `packages/agent/test/harness/execution-tools.test.ts` 与 `packages/agent/test/harness/runtime/drive-tools.test.ts`：寻找失败、进度更新和终止的证据。

**追踪任务**：选择一个工具调用，写出 `tool_execution_start → 执行/更新 → tool_execution_end → tool result message` 的顺序；比较顺序和并行模式的不同。

**产出**：工具调用时序与“为什么工具结果必须进入下一轮模型上下文”的解释。

**完成条件**：能从 `AgentLoopConfig` 指出验证、执行前后钩子和停止语义所在位置。

---

## 04：Session、存储与上下文压缩

**目标**：理解 Pi 如何保存、分支化、恢复和压缩会话，而不把全部历史永久塞进上下文。

**阅读顺序**：

1. `packages/agent/src/harness/session/types.ts`：`Entry`、`Session`、`Storage`、`Branch`。
2. `packages/agent/src/harness/session/session.ts` 与 `memory.ts`：先比较公开行为和内存实现。
3. `packages/agent/src/harness/session/jsonl/repo.ts`、`storage.ts`：了解 JSONL 持久化边界。
4. `packages/agent/src/harness/compaction/compaction.ts`：从 `getMessageFromEntry` 和压缩候选逻辑理解上下文收敛。
5. `packages/agent/test/harness/jsonl-session-repo.test.ts`、`compaction.test.ts`：用测试确认恢复和压缩约束。

**追踪任务**：描述一次“追加消息、保存、重开会话、压缩历史”的数据流，并标明 entry、branch 和 model context 各自不是同一件事。

**产出**：三层边界表：持久记录、会话读取 API、发送给模型的消息。

**完成条件**：能解释为什么 `Entry` 有多种类型，以及为什么 compaction 不能简单删除旧消息。

---

## 05：模型、认证与 Provider 抽象

**目标**：理解统一模型层如何把不同厂商的目录、认证和流式 API 统一给 Agent 使用。

**阅读顺序**：

1. `packages/ai/src/types.ts`：模型、消息、工具和流式事件的通用类型。
2. `packages/ai/src/models.ts`：`Provider`、`Models`、`ModelsImpl`、`stream`、`streamSimple`、`getAuth`、`refresh`。
3. `packages/ai/src/auth/types.ts` 与 `auth/credential-store.ts`：凭据的公开契约和内存实现。
4. `packages/ai/src/api/anthropic-messages.ts`：选择一个具体协议适配器，理解“统一类型到厂商请求”的转换；不要试图一次读完全部 Provider。
5. `packages/ai/test/models-runtime.test.ts` 与相关 Provider 测试：确认刷新、认证或流的行为。

**追踪任务**：从 `AgentLoopConfig.model` 到 `Models.streamSimple` 追踪一条请求；区分 Provider 注册、可用模型查询和实际请求三个阶段。

**产出**：Provider 接口中“产品层需要知道的能力”与“厂商协议细节”的分界。

**完成条件**：能解释 Agent 为什么依赖抽象 `Model` 和 `StreamFn`，而非直接依赖 Anthropic/OpenAI HTTP 请求。

---

## 06：TUI 渲染与输入处理

**目标**：从 AgentEvent 追到屏幕更新，理解 Pi 如何把终端 I/O 和组件渲染解耦。

**阅读顺序**：

1. `packages/tui/src/terminal.ts`：`Terminal` 的最小能力与实现替换价值。
2. `packages/tui/src/tui.ts`：`Component`、`Container`、`TUI`、`TuiBase` 的 `start`、输入分发、渲染调度。
3. `packages/tui/src/tui-alt-screen.ts`：只了解全屏模式的边界。
4. `packages/coding-agent/src/modes/interactive/tui-renderer.ts`：了解编码代理如何使用 TUI。
5. `packages/coding-agent/src/modes/interactive/interactive-mode.ts`：回读 Agent 订阅和 UI 状态更新处。
6. `packages/coding-agent/test/interactive-tui.test.ts` 与 `packages/tui/test/` 中相关测试。

**追踪任务**：选择一个 `message_start`、工具执行或窗口大小变化事件，追到对应 UI 状态与渲染请求。

**产出**：输入路径和输出路径各一条：`Terminal → TUI → InteractiveMode` 与 `AgentEvent → InteractiveMode → TUI → Terminal`。

**完成条件**：能说清 `Terminal`、`TUI` 和 `InteractiveMode` 分别不应该承担什么职责。

---

## 07：编码代理的运行时编排

**目标**：连接前六课，理解产品层如何组合模型、会话、设置、认证、工具与 Agent。

**阅读顺序**：

1. `packages/coding-agent/src/core/agent-session.ts`：模型选择、thinking level、会话记录和 Agent 状态的协调。
2. `packages/coding-agent/src/core/model-runtime.ts` 与 `model-registry.ts`：模型发现与运行时可用性的边界。
3. `packages/coding-agent/src/core/settings-manager.ts`：设置来源和默认值。
4. `packages/coding-agent/src/core/auth-storage.ts` 与 `models-store.ts`：文件存储、并发读取和凭据边界。
5. `packages/coding-agent/test/model-runtime-credential-sync.test.ts`、`model-catalog-refresh.test.ts`：用测试确认模型目录和认证同步。

**追踪任务**：选择“切换模型”或“启动时恢复模型”之一，追踪认证检查、状态变化、会话记录、设置持久化和 UI 通知。

**产出**：一张运行时组合图，至少包含 `AgentSession`、`ModelRuntime`、`SettingsManager`、`SessionManager`、`InteractiveMode`。

**完成条件**：能说明为什么产品层需要 `AgentSession`，而不能仅把 `Agent` 暴露给 CLI。

---

## 08：扩展系统与配置资源

**目标**：理解 Pi 的可扩展边界，以及资源加载如何影响运行时行为。

**阅读顺序**：

1. `packages/coding-agent/src/core/extensions/types.ts`：扩展契约和事件类型。
2. `packages/coding-agent/src/core/extensions/`：先定位加载器和运行器，再读一个事件分发路径。
3. `packages/coding-agent/examples/extensions/`：选择一个最小示例和一个带依赖示例。
4. `.pi/extensions/`：把当前仓库扩展当作真实使用者阅读。
5. `packages/coding-agent/test/` 中相邻扩展测试：确认冲突、加载失败或资源优先级规则。

**追踪任务**：选择一个扩展命令或事件，写出它如何从资源发现进入运行时，再影响 InteractiveMode 或 AgentSession。

**产出**：扩展能做什么、不能绕过什么、以及示例代码与核心代码的边界。

**完成条件**：能用一个真实示例解释扩展如何注册并接收事件。

---

## 09：其余工作区的系统边界

**目标**：把核心产品放回完整仓库，而不是错误地把所有包当成 CLI 的内部实现。

**阅读顺序**：

1. 各包的 `package.json` 与 README（如有）：`chord`、`telemetry`、`protocol`、`client`、`server`、`session-backends`、`evals`。
2. 根构建脚本中的顺序和 workspace 定义。
3. 只选一个与主链路实际相连的包，读取它的入口与一个使用方；其他包停留在职责和依赖边界。

**追踪任务**：为每个工作区标注：独立产品/基础库/适配器/评估工具，以及它与核心四包的直接关系。

**产出**：一页工作区关系图，明确哪些包是学习主线的前置知识，哪些可按需要深入。

**完成条件**：能解释为何先学习 `coding-agent → agent → ai → tui` 是缩小认知负担，而不是否认其他包的重要性。

---

## 10：全链路复盘与贡献准备

**目标**：独立解释主链路，并能为一个小改动定位最小影响面和测试证据。

**练习**：

1. 不看笔记，描述“用户输入一条带工具调用的 prompt”从 CLI 到模型再到屏幕的完整路径。
2. 对照源码校正每一步，并给每个步骤补一个路径和符号证据。
3. 任选一个小的已知行为，使用 CodeGraph 的 callers/callees 找到实现、测试和依赖边界；不改代码。
4. 写一份一页架构说明：问题、具体链路、关键分层、两个仍未知的领域。

**产出**：更新 `LEARNING_NOTES.md` 的最终架构说明，以及下一阶段选题：Provider、Session/Harness、TUI、Extensions 或某个独立工作区。

**完成条件**：能回答“改动发生在哪一层、为什么不在相邻层、应先阅读哪些测试”，且每个结论能追溯到源码或测试。

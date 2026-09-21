# 术语表

只收录本课程已经遇到且能用源码证据解释的术语。每项保留最小定义、证据路径和自己的例子。

| 术语 | 最小定义 | 证据 | 自己的例子 / 备注 |
| --- | --- | --- | --- |
| Coding Agent | Pi 面向终端用户的 CLI 产品层，负责配置、会话、扩展和交互模式。 | `README.md`；待在第 1 课细化 | 待学习 |
| Agent | 保存对话状态、发布事件并驱动 LLM 与工具调用的运行时抽象。 | `packages/agent/src/agent.ts` | 待学习 |
| AgentContext | 传给低层 Agent 循环的系统提示词、消息与工具快照。 | `packages/agent/src/types.ts` | 待学习 |
| AgentEvent | Agent 运行期间发出的生命周期与展示事件。 | `packages/agent/src/types.ts` | 待学习 |
| Provider | 对一个模型服务商的模型目录、认证与请求能力的抽象。 | `packages/ai/src/models.ts` | 待学习 |
| Models | 管理 Provider、模型可用性、认证和流式请求的接口。 | `packages/ai/src/models.ts` | 待学习 |
| Session | 可读写的对话记录、分支和值的持久化抽象。 | `packages/agent/src/harness/session/types.ts` | 待学习 |
| Terminal | TUI 所依赖的最小终端 I/O 能力。 | `packages/tui/src/terminal.ts` | 待学习 |
| TUI | 管理组件树、输入、焦点和渲染调度的终端用户界面。 | `packages/tui/src/tui.ts` | 待学习 |

新增术语时，不复制大段源码；只记录能支持后续推理的边界与证据。

# Pi 源码学习 Resources

> 高信任资源清单。讲解中的知识从这里取材，不凭记忆编造；每个条目标注用途。

## Knowledge（知识）

### 仓库内一手材料（最高优先级）

- [packages/coding-agent/docs/how-pi-works.md](../../packages/coding-agent/docs/how-pi-works.md)
  Pi 官方架构自述。用途：全链路总览，与课程主线（CLI→编排→Agent 循环→Provider→TUI）逐课对照验证。
- [packages/coding-agent/docs/cli.md](../../packages/coding-agent/docs/cli.md)、[json.md](../../packages/coding-agent/docs/json.md)、[rpc.md](../../packages/coding-agent/docs/rpc.md)
  三种运行模式（interactive / print+JSON / RPC）的权威行为文档。用途：第 01、07 课解释模式分流。
- [packages/coding-agent/docs/session-format.md](../../packages/coding-agent/docs/session-format.md)、[compaction.md](../../packages/coding-agent/docs/compaction.md)
  会话文件格式与上下文压缩。用途：第 04 课（1.1.0 持久化已并入 `packages/durable`，需与源码交叉验证）。
- [packages/coding-agent/docs/extensions.md](../../packages/coding-agent/docs/extensions.md)、[packages.md](../../packages/coding-agent/docs/packages.md)、[prompt-templates.md](../../packages/coding-agent/docs/prompt-templates.md)、[themes.md](../../packages/coding-agent/docs/themes.md)
  扩展/包/模板/主题系统。用途：第 08 课。
- [packages/coding-agent/docs/sdk.md](../../packages/coding-agent/docs/sdk.md)、[rpc-commands.md](../../packages/coding-agent/docs/rpc-commands.md)
  TypeScript SDK 与 RPC 命令。用途：第 07、09 课，以及"Web 应用复用 Agent 层"的推理。
- [packages/coding-agent/docs/providers.md](../../packages/coding-agent/docs/providers.md)、[models.md](../../packages/coding-agent/docs/models.md)、[mcp.md](../../packages/coding-agent/docs/mcp.md)、[codemode.md](../../packages/coding-agent/docs/codemode.md)
  Provider/模型目录/MCP/codemode 沙箱。用途：第 05 课与 1.1.0 新依赖（pi-mcp、pi-codemode）。
- [packages/agent/README.md](../../packages/agent/README.md)、[packages/ai/README.md](../../packages/ai/README.md)、[packages/tui/README.md](../../packages/tui/README.md)、[packages/durable/README.md](../../packages/durable/README.md)
  四层 + durable 的自述。用途：各课开层的边界确认。
- 各包 `test/` 目录（尤其 `packages/coding-agent/test/suite/` + faux provider、`packages/agent/test/`）
  行为契约的事实来源。用途：每课的"用测试确认规则"环节；禁止用真实 Provider API 或付费 token。
- 各包 `CHANGELOG.md`
  版本演进与行为变化。用途：版本升级后快速定位课程记录失效的范围（如 0.87.1→1.1.0 的 session-backends→durable）。
- 根 [README.md](../../README.md)
  包表（1.1.0 共 7 行）与产品入口四种用法。用途：第 00 课地图。

### 外部材料

- [earendil-works/pi（GitHub）](https://github.com/earendil-works/pi)
  上游仓库本体。用途：issues/PR/发布记录作为行为演变的旁证。
- [pi.dev](https://pi.dev)
  产品官网与安装器。用途：分发渠道背景（install-lock 供应链锁定在根 README 有说明）。

## Wisdom（社区）

- [pi GitHub Issues & Discussions](https://github.com/earendil-works/pi/issues)
  贡献者与维护者活跃于此；CONTRIBUTING.md 定义了贡献门禁（auto-close、lgtm/lgtmi）。用途：真实改动前的方案检验、"wisdom"类问题委托。

## Gaps（缺口）

- `packages/agent` 与 `packages/ai` 除 README 外无独立设计文档 → 这两层的知识必须直接以源码 + 测试为一手材料，文档只做交叉验证。
- 尚未找到 Pi 核心设计者写的架构长文/演讲 → 如用户需要背景 wisdom，后续搜索并补充于此。

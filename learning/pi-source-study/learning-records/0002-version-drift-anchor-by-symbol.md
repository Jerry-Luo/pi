# 版本漂移是常态：以"符号+路径"为锚，不以行号为锚

课程历史上两次因 pi 升级（0.86→0.87、0.87.1→1.1.0）触发全量重置。已证实的漂移：`main` 从 main.ts:566 移到 573；构建脚本从包内移到仓库根 `scripts/`；`setupCli` 从"主 chunk 导入"变为"内联于 cli-runtime.js"；`packages/session-backends/*` 整体消失并入 `packages/durable`；esbuild chunk 名三次全部更名。

**Evidence**：`STUDY_STATE.md` 会话日志与 `LEARNING_NOTES-v0.87.1.md` 归档（行号级事实对 1.1.0 失效）。

**Implications**：每课开始先做"符号重定位"（grep 定义处）再讲解，永不沿用旧行号；恢复会话第一动作是版本核对（仓库 package.json vs `pi --version`）；安装产物只用于入口验证。

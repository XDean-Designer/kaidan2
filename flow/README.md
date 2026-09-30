# 订单流水模块（外置）

从 `card/demo.html` 的 BillingDemo「订单流水」整组 18 节点迁入本包，**替换**原简化版 s8/s9。

## 文件

| 文件 | 说明 |
|------|------|
| `flow-fragment.html` | 流水屏 + Mask（含金额键盘、Toast） |
| `flow.css` | 流水样式 + 宿主桥接 |
| `flow.js` | BillingDemo 流水能力（`__FLOW_STANDALONE__`） |
| `flow-keypad.js` | 金额键盘 |
| `flow-bridge.js` | 侧栏 `data-flow` 与 `?flow=` 深链 |
| `assets/` | 头像 / 支付图标等（已同步到宿主 `../assets/`） |

## 使用

- 侧栏「订单流水」18 项，或 `index.html?flow=flow-list`
- 宿主 `go('s0')` 等会 `exitFlowModule()` 退出流水层
- **宿主必须补齐两个契约**（否则「点了没反应」）：
  1. 宿主 `activate()` 开头调 `exitFlowModule()` —— 流水层是盖在 `#frame` 上的整层，只切 `.active` 不退出等于没切；
  2. 宿主接管 `window.openWorkbench`（流水内「返回 / 客户选择返回 / 挂单列表返回」都调它）= 退出流水层 + 回到进入流水前的宿主页；本模块自己的兜底实现只到 `BillingDemo.openFlowHub()`，宿主没有流水 Hub 屏时是死键。
- 宿主若在启动时重置导航（如 `assets/v2.js` 的 `patchNav()`），**必须跳过 `?flow=flow-*` 深链那次加载**，否则深链刚打开就被顶掉。

## 重建（慎用）

```powershell
node _build-flow.js
node _fix-keypad.js
node _tmp_patch_optional.js
node _tmp_patch_init.js
node _tmp_patch_sync.js
node _patch-index-flow.js   # 仅首次 / 需重挂导航时
```

源以大原型 `demo.html` 为准；本目录为副本，改交互请先改大原型再抽。

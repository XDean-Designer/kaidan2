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

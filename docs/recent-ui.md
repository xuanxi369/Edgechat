# Recent-inspired EdgeChat UI

参考站点：<https://recent.design/>。2026-11-10 实际浏览首页、Interface 分类和组件详情后，将视觉与交互用于聊天应用的日常操作。

| 参考 | EdgeChat 中的实现 |
| --- | --- |
| 首页黑白底色、胶囊筛选、卡片和轻量边框 | 中性纸面色、墨色主按钮、会话卡片、浮动聊天窗口；浅紫色只用于消息和强调 |
| [Liquid Stepper Interaction](https://recent.design/i/lrtfzrm-liquid-stepper-interaction) | 会话及通讯录筛选使用连续滑动的选中胶囊；新建群组的公开／私有选择使用相同移动方式 |
| [Dark Mode Toggle](https://recent.design/i/yifo62r-dark-light-mode-toggle) | 太阳／月亮滑动开关，记忆个人选择并同步浏览器标签页；聊天、登录、注册、设置、弹层和富文本编辑器共同切换 |
| [Ramp Login Screen](https://recent.design/i/ukxeowa-ai-workspace-login-screen) | 双栏登录页面、独立表单与聊天卡片构图；悬停时卡片轻移和旋转，手机使用单栏表单 |

视觉元素由 Vue、CSS 与现有 Lucide 图标实现。没有新增组件、动画或字体依赖，也没有运行时请求参考站的图片或视频。

## 组件与行为

- `SegmentedControl.vue` 是共享筛选器，使用单个移动指示器；支持方向键、Home、End 和即时焦点环，选中状态通过 `aria-pressed` 公布。
- 会话搜索匹配名称、会话说明和私信联系人账号，忽略大小写。Esc 清除搜索。未读筛选包含 @ 提及，读取后自然移除筛选项，当前会话仍保留在聊天区。
- `ThemeToggle.vue` 的开关使用 `aria-checked`；偏好保存在 `edgechat.interface-theme`。初始化在应用挂载之前完成，存储不可用时保留本次会话选择。
- 入场、按压、悬停和滑动共用 `interface.css` 中的三个时间令牌。系统减少动态效果偏好和低特效模式会停用这些新增动效。
- 消息的稳定 key、发送状态、输入法 Enter、附件队列、语音录制、路由权限和服务端接口继续使用现有实现。

## 本地查看

在项目根目录执行 `npm run dev:demo -- --host 127.0.0.1`，访问 <http://127.0.0.1:5174/>。演示使用浏览器内的模拟数据，可以查看完整页面和实际交互；生产环境仍使用原有 API。

浏览器验收截图在 `output/playwright/`。生产与演示构建、项目自动测试和桌面／手机浏览器交互都纳入验收。

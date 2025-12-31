# 时间管理 App (TimeApp)

一个功能完整的时间管理与任务追踪应用，帮助用户提高生产力和时间管理效率。

## ✨ 主要功能

### 1. 仪表盘（Dashboard）
- 📊 今日专注时长统计
- 📝 待做任务概览
- 📅 月历视图，快速查看任务分布
- 💡 智能时间管理建议

### 2. 任务管理（Tasks）
- ✅ 创建、编辑、删除任务
- 🏷️ 任务分类与标签支持
- 📌 任务状态管理（待做、进行中、已完成）
- 💾 本地自动保存

### 3. 计时器（Timer）
- ⏱️ 可配置的计时器（默认 25 分钟番茄钟）
- ▶️ 开始/暂停/重置控制
- 🔔 计时完成时浏览器通知
- 📊 计时会话自动记录到统计数据

### 4. 数据统计（Stats）
- 📈 周/月专注时长柱状图
- 🎯 历史数据可视化
- 📉 趋势分析支持

### 5. 设置（Settings）
- 🎨 主题选择（浅色/深色）
- ⏱️ 自定义默认计时长度
- 💾 偏好设置持久化

### 6. 智能建议
- 🤖 基于历史数据的时间管理建议
- 📋 任务优先级提示
- ⚡ 番茄钟周期优化建议

## 🚀 快速开始

### 环境要求
- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173` 即可查看应用。

### 生产构建

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

### 代码检查

```bash
npm run lint
```

## 📁 项目结构

```
src/
├── components/          # React 组件
│   ├── TimerComponent.tsx      # 计时器组件
│   ├── CalendarView.tsx        # 日历视图
│   └── Recommendations.tsx     # 建议组件
├── pages/              # 页面组件
│   ├── Dashboard.tsx
│   ├── Tasks.tsx
│   ├── Timer.tsx
│   ├── Stats.tsx
│   └── Settings.tsx
├── models/             # 数据模型
│   ├── task.ts
│   └── session.ts
├── services/           # 业务逻辑与服务
│   ├── storage.ts              # 任务持久化
│   ├── sessionStorage.ts       # 计时会话存储
│   ├── settings.ts             # 设置存储
│   ├── notificationService.ts  # 浏览器通知
│   └── recommendationEngine.ts # 建议引擎
├── utils/              # 工具函数
│   └── dateUtils.ts
├── App.tsx             # 主应用组件（包含路由）
├── App.css             # 应用样式
├── main.tsx            # 入口文件
└── index.css           # 全局样式
```

## 💡 核心特性

### 数据持久化
- 使用 `localforage` 进行浏览器本地存储
- 自动保存任务、计时会话和用户设置
- 支持离线使用

### 浏览器通知
- 计时完成时触发系统通知
- 支持自定义通知内容

### 智能推荐
- 分析用户的专注时长数据
- 提供个性化的时间管理建议
- 动态调整建议优先级

### 响应式设计
- 支持桌面和移动设备
- Flexbox 布局
- 自适应导航栏

## 🛠️ 技术栈

| 技术 | 用途 |
|------|------|
| **React 19** | UI 框架 |
| **TypeScript** | 类型检查 |
| **Vite** | 构建工具 |
| **React Router** | 路由管理 |
| **Zustand** | 状态管理（预留） |
| **Chart.js** | 数据可视化 |
| **date-fns** | 日期工具 |
| **uuid** | 唯一 ID 生成 |
| **localforage** | 本地存储 |

## 📖 使用指南

### 创建任务
1. 进入"任务"页面
2. 在输入框中输入任务标题
3. 点击"添加"按钮
4. 任务将自动保存

### 使用计时器
1. 进入"计时器"页面
2. 点击"开始"按钮启动计时
3. 可随时点击"暂停"或"重置"
4. 计时完成时，会显示浏览器通知

### 查看统计
1. 进入"统计"页面
2. 查看周/月专注时长柱状图
3. 日历视图中可点击日期查看该天的详细统计

### 个性化设置
1. 进入"设置"页面
2. 选择主题偏好
3. 设置默认计时长度
4. 设置会自动保存

## 🔮 未来改进计划

- [ ] 云同步功能（保存到服务器）
- [ ] 社交分享功能
- [ ] 更多主题选项
- [ ] 任务优先级和截止日期
- [ ] 高级统计报告导出
- [ ] PWA 支持
- [ ] 深度学习推荐系统

## 📝 许可证

MIT

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**祝你使用愉快！专注每一刻，管理好每一天。** ⏰✨


```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

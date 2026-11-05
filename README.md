# 校园外卖点餐系统

基于 Vue 3 + TypeScript + Vite 的现代化校园外卖点餐平台，包含用户端和管理端两个应用。

## ✨ 功能特性

### 用户端 (Mobile)

- 🏪 **食堂浏览**: 查看校园内所有食堂
- 🍔 **菜品点餐**: 浏览菜品、查看详情、添加购物车
- 🛒 **购物车管理**: 实时更新购物车、修改数量
- 📦 **订单管理**: 下单、查看订单列表、订单详情、取消订单
- 📍 **地址管理**: 添加、编辑、删除收货地址
- 👤 **个人中心**: 编辑个人信息、修改头像和昵称

### 管理端 (PC)

- 📊 **数据仪表板**: 统计数据展示、图表分析
- 🏢 **食堂管理**: CRUD 操作、图片上传、分页查询
- 🗂️ **分类管理**: 菜品分类的完整管理
- 🍽️ **菜品管理**: 菜品 CRUD、图片上传、分页筛选
- 📋 **订单管理**: 查看订单、状态更新、分页筛选
- 👥 **用户管理**: 查看用户列表、编辑用户信息、搜索分页

## 🛠️ 技术栈

### 前端框架

- **Vue 3.5** - Composition API + `<script setup>`
- **TypeScript 6.0** - 类型安全
- **Vite 8** - 快速构建工具
- **Pinia 4** - 状态管理
- **Vue Router 5** - 路由管理

### UI 框架

- **Element Plus 2.9** - 管理端 PC 组件库
- **Vant 4.9** - 用户端移动端组件库
- **unplugin-icons** - 按需图标自动导入

### 开发工具

- **MSW 2.7** - Mock Service Worker，API 模拟
- **ESLint + Oxlint** - 代码检查
- **Prettier** - 代码格式化
- **pnpm workspace** - Monorepo 管理

### 架构特点

- 📦 **Monorepo**: pnpm workspace 管理多包
- 🔄 **数据持久化**: localStorage + MSW 实现前端全栈开发
- 🔗 **数据共享**: 用户端和管理端共享 Mock 数据
- 🎯 **类型安全**: 完整的 TypeScript 类型定义
- 🚀 **按需加载**: 组件和图标自动导入

## 📦 项目结构

```
campus-food-order/
├── apps/                       # 应用目录
│   ├── admin/                  # 管理端 (Element Plus + PC)
│   │   ├── public/            # 静态资源
│   │   └── src/
│   │       ├── api/           # API 接口
│   │       ├── components/    # 公共组件
│   │       ├── layout/        # 布局组件
│   │       ├── mocks/         # MSW Mock 数据
│   │       ├── router/        # 路由配置
│   │       ├── stores/        # Pinia 状态管理
│   │       ├── utils/         # 工具函数
│   │       ├── views/         # 页面组件
│   │       └── main.ts        # 入口文件
│   │
│   └── user/                   # 用户端 (Vant + Mobile)
│       ├── public/            # 静态资源
│       └── src/
│           ├── api/           # API 接口
│           ├── components/    # 公共组件
│           ├── mocks/         # MSW Mock 数据
│           ├── router/        # 路由配置
│           ├── stores/        # Pinia 状态管理
│           ├── utils/         # 工具函数
│           ├── views/         # 页面组件
│           └── main.ts        # 入口文件
│
├── packages/                   # 共享包
│   └── shared/                # 共享代码
│       └── src/
│           ├── constants/     # 常量定义
│           ├── enums/         # 枚举类型
│           ├── mocks/         # 共享 Mock 数据
│           │   └── data/      # Mock 数据源
│           └── types/         # TypeScript 类型定义
│
├── docs/                       # 项目文档
│   ├── WORKFLOW.md            # 开发工作流
│   ├── MSW.md                 # MSW 架构文档
│   ├── TEST_ACCOUNTS.md       # 测试账号
│   └── TROUBLESHOOTING.md     # 故障排查指南
│
├── CLAUDE.md                   # AI 开发规则
├── README.md                   # 项目说明
├── package.json               # 根包配置
├── pnpm-workspace.yaml        # pnpm workspace 配置
└── tsconfig.json              # TypeScript 配置
```

## 🚀 快速开始

### 环境要求

- **Node.js**: >= 24.12.0 或 ^22.18.0
- **pnpm**: >= 9.0.0

### 安装依赖

```bash
# 安装 pnpm (如果还没有)
npm install -g pnpm

# 安装项目依赖
pnpm install
```

### 开发

```bash
# 同时启动用户端和管理端
pnpm dev

# 只启动用户端 (http://localhost:3000)
pnpm dev:user

# 只启动管理端 (http://localhost:3001)
pnpm dev:admin
```

### 访问地址

- **用户端**: http://localhost:3000 (移动端)
- **管理端**: http://localhost:3001 (PC端)

### 测试账号

#### 管理端登录
- 用户名: `admin`
- 密码: `admin123`

#### 用户端
直接访问即可，无需登录

更多测试账号请查看 [测试账号文档](./docs/TEST_ACCOUNTS.md)

## 📝 可用命令

```bash
# 开发
pnpm dev              # 启动所有应用
pnpm dev:user         # 启动用户端
pnpm dev:admin        # 启动管理端

# 构建
pnpm build            # 构建所有应用
pnpm build:user       # 构建用户端
pnpm build:admin      # 构建管理端

# 预览
pnpm preview:user     # 预览用户端构建产物
pnpm preview:admin    # 预览管理端构建产物

# 代码质量
pnpm lint             # 运行代码检查
pnpm format           # 格式化代码
pnpm type-check       # TypeScript 类型检查

# 清理
pnpm clean            # 清理所有 node_modules 和构建产物
```

## 🎯 核心功能说明

### Mock Service Worker (MSW)

本项目使用 MSW 在前端模拟后端 API，实现全栈开发体验：

- ✅ **完整的 RESTful API**: 支持 GET、POST、PUT、DELETE
- ✅ **数据持久化**: 通过 localStorage 持久化数据
- ✅ **跨应用数据共享**: 用户端和管理端共享同一份数据
- ✅ **开发友好**: 无需后端服务，前端独立开发

详细说明请查看 [MSW 架构文档](./docs/MSW.md)

### 数据持久化

所有数据存储在浏览器 localStorage：

```javascript
// 查看数据
console.log(localStorage.getItem('mock_users'))
console.log(localStorage.getItem('mock_orders'))

// 重置数据
localStorage.clear()
location.reload()
```

### Monorepo 架构

使用 pnpm workspace 管理多个包：

- `@campus-food/user` - 用户端应用
- `@campus-food/admin` - 管理端应用
- `@campus-food/shared` - 共享代码和类型

## 📚 项目文档

- [开发工作流](./docs/WORKFLOW.md) - 分支策略、提交规范、开发流程
- [MSW 架构文档](./docs/MSW.md) - Mock 数据架构和开发指南
- [测试账号](./docs/TEST_ACCOUNTS.md) - 测试账号和数据说明
- [故障排查指南](./docs/TROUBLESHOOTING.md) - 常见问题解决方案
- [CLAUDE.md](./CLAUDE.md) - AI 辅助开发规则

## 🔧 开发建议

### IDE 配置

推荐使用 **VS Code** + 以下扩展：

- **Vue (Official)** - Vue 3 语言支持
- **TypeScript Vue Plugin** - TypeScript + Vue 支持
- **ESLint** - 代码检查
- **Prettier** - 代码格式化

### 浏览器扩展

- **Vue.js devtools** - Vue 调试工具
- **Chrome DevTools** - 启用 Custom Object Formatter

### 代码风格

- 使用 **Composition API** + `<script setup>`
- 遵循 **TypeScript 严格模式**
- 使用 **ESLint** 和 **Prettier** 保持代码一致性
- 组件命名使用 **PascalCase**
- 文件命名使用 **kebab-case**

## 🐛 故障排查

遇到问题？查看 [故障排查指南](./docs/TROUBLESHOOTING.md)

常见问题：

- **端口被占用**: 修改 `vite.config.ts` 中的端口号
- **MSW 未启动**: 检查 `public/mockServiceWorker.js` 是否存在
- **类型错误**: 运行 `pnpm type-check` 检查类型
- **数据丢失**: 检查 localStorage 或运行 `localStorage.clear()` 重置

## 📋 开发计划

- [x] 用户端基础功能
  - [x] 食堂浏览
  - [x] 菜品点餐
  - [x] 购物车管理
  - [x] 订单管理
  - [x] 个人中心
- [x] 管理端基础功能
  - [x] 数据仪表板
  - [x] 食堂管理
  - [x] 分类管理
  - [x] 菜品管理
  - [x] 订单管理
  - [x] 用户管理
- [x] 数据持久化
- [x] 图片上传
- [x] 项目文档
- [ ] 单元测试
- [ ] E2E 测试
- [ ] CI/CD 配置
- [ ] 真实后端对接

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交改动 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

## 📄 许可证

MIT License

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Element Plus](https://element-plus.org/)
- [Vant](https://vant-ui.github.io/vant/)
- [MSW](https://mswjs.io/)
- [Pinia](https://pinia.vuejs.org/)

---

**Happy Coding! 🎉**

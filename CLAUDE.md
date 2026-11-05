# CLAUDE.md - AI 开发规则

本文档为 AI 助手提供项目开发指导，帮助理解项目架构、技术栈、开发规范和最佳实践。

## 项目概述

**项目名称**: 校园外卖点餐系统  
**项目类型**: Monorepo (pnpm workspace)  
**技术栈**: Vue 3 + TypeScript + Vite + MSW  
**架构**: 前端全栈 (使用 MSW 模拟后端)

### 核心应用

1. **用户端** (`apps/user`) - 移动端 H5 应用
   - 端口: 3000
   - UI 框架: Vant 4
   - 功能: 浏览食堂、点餐、订单管理、个人中心

2. **管理端** (`apps/admin`) - PC 管理后台
   - 端口: 3001
   - UI 框架: Element Plus 2
   - 功能: 数据统计、食堂/分类/菜品/订单/用户管理

3. **共享包** (`packages/shared`)
   - 类型定义、枚举、常量
   - Mock 数据和工具函数
   - 用户端和管理端共享

## 技术栈详解

### 前端框架

- **Vue 3.5.42**: Composition API + `<script setup>` 语法
- **TypeScript 6.0**: 严格类型检查
- **Vite 8.2**: 开发服务器和构建工具
- **Pinia 4.0**: 状态管理
- **Vue Router 5.3**: 路由管理

### UI 框架

- **Element Plus 2.9** (管理端)
  - 自动导入: `unplugin-vue-components`
  - 图标: `@iconify-json/ep`
- **Vant 4.9** (用户端)
  - 移动端组件库
  - 按需导入

### Mock 方案

- **MSW 2.7**: Mock Service Worker
- **localStorage**: 数据持久化
- **共享数据**: 两端通过 `@campus-food/shared` 共享数据

### 开发工具

- **ESLint 10 + Oxlint**: 代码检查
- **Prettier 3.9**: 代码格式化
- **unplugin-auto-import**: API 自动导入
- **unplugin-icons**: 图标自动导入

## 项目结构

```
campus-food-order/
├── apps/
│   ├── admin/              # 管理端
│   │   ├── public/
│   │   │   └── mockServiceWorker.js
│   │   └── src/
│   │       ├── api/        # API 接口封装
│   │       ├── components/ # 公共组件
│   │       ├── layout/     # 布局组件
│   │       ├── mocks/      # MSW 配置
│   │       │   ├── data/   # 管理端特定数据
│   │       │   └── handlers/ # API Handlers
│   │       ├── router/     # 路由配置
│   │       ├── stores/     # Pinia stores
│   │       ├── utils/      # 工具函数
│   │       ├── views/      # 页面组件
│   │       ├── App.vue
│   │       └── main.ts
│   │
│   └── user/               # 用户端 (结构同上)
│
├── packages/
│   └── shared/
│       └── src/
│           ├── constants/  # 常量
│           ├── enums/      # 枚举
│           ├── mocks/      # 共享 Mock
│           │   └── data/   # Mock 数据源
│           │       ├── storage.ts
│           │       ├── users.ts
│           │       ├── orders.ts
│           │       └── ...
│           └── types/      # 类型定义
│
├── docs/                   # 文档目录
│   ├── WORKFLOW.md
│   ├── MSW.md
│   ├── TEST_ACCOUNTS.md
│   └── TROUBLESHOOTING.md
│
├── CLAUDE.md              # 本文件
└── README.md              # 项目说明
```

## 开发规范

### 命名约定

#### 文件命名

- **组件**: PascalCase (如 `UserForm.vue`)
- **工具/普通文件**: kebab-case (如 `user-utils.ts`)
- **类型文件**: PascalCase (如 `User.ts`)
- **常量文件**: kebab-case (如 `api-constants.ts`)

#### 代码命名

- **组件**: PascalCase (如 `<UserForm />`)
- **变量/函数**: camelCase (如 `getUserList`)
- **常量**: UPPER_SNAKE_CASE (如 `API_BASE_URL`)
- **类型/接口**: PascalCase (如 `User`, `PageRes`)
- **枚举**: PascalCase (如 `OrderStatus`)

### 代码风格

#### Vue 组件

使用 Composition API + `<script setup>`:

```vue
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { User } from '@campus-food/shared'

// Props
const props = defineProps<{
  userId: string
}>()

// Emits
const emit = defineEmits<{
  success: [user: User]
  cancel: []
}>()

// State
const loading = ref(false)
const user = ref<User | null>(null)

// Methods
async function loadUser() {
  loading.value = true
  try {
    const res = await getUserDetail(props.userId)
    user.value = res.data
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  loadUser()
})
</script>

<template>
  <div v-if="loading">加载中...</div>
  <div v-else-if="user">
    {{ user.name }}
  </div>
</template>

<style scoped lang="less">
// 样式
</style>
```

#### TypeScript

- 避免使用 `any`，使用具体类型
- 使用 `interface` 定义对象类型
- 使用 `type` 定义联合类型和工具类型
- 导出类型使用 `export type` 或 `export interface`

```typescript
// ✅ 正确
export interface User {
  id: string
  name: string
  phone: string
}

export type UserRole = 'admin' | 'user'

// ❌ 错误
export interface User {
  data: any // 避免使用 any
}
```

#### API 封装

```typescript
// api/modules/user.ts
import { get, post, put, del } from '@/utils/request'
import type { User, PageRes } from '@campus-food/shared'

/**
 * 获取用户列表
 */
export function getUserList(params?: {
  keyword?: string
  page?: number
  pageSize?: number
}) {
  return get<PageRes<User>>('/admin/users', { params })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id: string) {
  return get<User>(`/admin/users/${id}`)
}

/**
 * 更新用户信息
 */
export function updateUser(id: string, data: Partial<User>) {
  return put<User>(`/admin/users/${id}`, data)
}

/**
 * 删除用户
 */
export function deleteUser(id: string) {
  return del(`/admin/users/${id}`)
}
```

### MSW Handler 开发

#### Handler 结构

```typescript
// mocks/handlers/resource.ts
import { http, HttpResponse } from 'msw'
import type { Res, PageRes } from '@campus-food/shared'
import { resources, saveResources } from '../data'
import { validateAdminToken } from './auth'

export const resourceHandlers = [
  // GET 列表 (带分页)
  http.get('/api/admin/resources', ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page')) || 1
    const pageSize = Number(url.searchParams.get('pageSize')) || 10
    const keyword = url.searchParams.get('keyword') || ''

    // 过滤
    let filtered = resources
    if (keyword) {
      filtered = filtered.filter(r => r.name.includes(keyword))
    }

    // 分页
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const items = filtered.slice(start, end)

    return HttpResponse.json<PageRes<Resource>>({
      code: 200,
      message: 'success',
      data: {
        items,
        total: filtered.length,
      },
    })
  }),

  // GET 详情
  http.get('/api/admin/resources/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const resource = resources.find(r => r.id === params.id)
    if (!resource) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '资源不存在', data: null },
        { status: 404 }
      )
    }

    return HttpResponse.json<Res<Resource>>({
      code: 200,
      message: 'success',
      data: resource,
    })
  }),

  // POST 创建
  http.post('/api/admin/resources', async ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const body = (await request.json()) as Omit<Resource, 'id' | 'createdAt' | 'updatedAt'>

    const newResource: Resource = {
      id: String(Date.now()),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    resources.push(newResource)
    saveResources()

    return HttpResponse.json<Res<Resource>>({
      code: 200,
      message: '创建成功',
      data: newResource,
    })
  }),

  // PUT 更新
  http.put('/api/admin/resources/:id', async ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const index = resources.findIndex(r => r.id === params.id)
    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '资源不存在', data: null },
        { status: 404 }
      )
    }

    const body = (await request.json()) as Partial<Resource>

    resources[index] = {
      ...resources[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    saveResources()

    return HttpResponse.json<Res<Resource>>({
      code: 200,
      message: '更新成功',
      data: resources[index],
    })
  }),

  // DELETE 删除
  http.delete('/api/admin/resources/:id', ({ request, params }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    const index = resources.findIndex(r => r.id === params.id)
    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '资源不存在', data: null },
        { status: 404 }
      )
    }

    resources.splice(index, 1)
    saveResources()

    return HttpResponse.json<Res<null>>({
      code: 200,
      message: '删除成功',
      data: null,
    })
  }),
]
```

#### 数据持久化

```typescript
// packages/shared/src/mocks/data/resources.ts
import { loadFromStorage, saveToStorage } from './storage'
import type { Resource } from '../../types'

const initialResources: Resource[] = [
  {
    id: '1',
    name: '资源1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
]

// 从 localStorage 加载或使用初始数据
export let resources = loadFromStorage('mock_resources', initialResources)

// 保存函数
export function saveResources() {
  saveToStorage('mock_resources', resources)
}
```

### 状态管理 (Pinia)

```typescript
// stores/user.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '@campus-food/shared'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const token = ref<string | null>(null)

  // Getters
  const isLogin = computed(() => !!token.value)

  // Actions
  function setUser(user: User) {
    currentUser.value = user
  }

  function setToken(newToken: string) {
    token.value = newToken
    localStorage.setItem('admin_token', newToken)
  }

  function logout() {
    currentUser.value = null
    token.value = null
    localStorage.removeItem('admin_token')
  }

  // 初始化
  function init() {
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      token.value = savedToken
    }
  }

  return {
    currentUser,
    token,
    isLogin,
    setUser,
    setToken,
    logout,
    init,
  }
})
```

## 开发流程

### 添加新功能

1. **规划功能**: 明确需求和技术方案
2. **创建分支**: `git checkout -b feature/功能名称`
3. **开发实现**:
   - 定义类型 (`packages/shared/src/types`)
   - 创建 API 接口 (`apps/*/src/api`)
   - 创建 Mock Handler (`apps/*/src/mocks/handlers`)
   - 创建页面组件 (`apps/*/src/views`)
   - 添加路由配置 (`apps/*/src/router`)
4. **测试验证**: 功能测试、边界测试
5. **代码检查**: `pnpm lint && pnpm type-check`
6. **提交代码**: 遵循 Conventional Commits
7. **创建 PR**: 等待审查和合并

### 添加新的 API

假设要添加 "评论" 功能：

1. **定义类型** (`packages/shared/src/types/comment.ts`):
```typescript
export interface Comment {
  id: string
  dishId: string
  userId: string
  userName: string
  content: string
  rating: number
  createdAt: string
  updatedAt: string
}
```

2. **创建 Mock 数据** (`packages/shared/src/mocks/data/comments.ts`):
```typescript
import { loadFromStorage, saveToStorage } from './storage'
import type { Comment } from '../../types'

const initialComments: Comment[] = []

export let comments = loadFromStorage('mock_comments', initialComments)

export function saveComments() {
  saveToStorage('mock_comments', comments)
}
```

3. **创建 Handler** (`apps/admin/src/mocks/handlers/comment.ts`):
```typescript
import { http, HttpResponse } from 'msw'
import type { Res, PageRes } from '@campus-food/shared'
import { comments, saveComments } from '@campus-food/shared'

export const commentHandlers = [
  // 实现 CRUD 操作
]
```

4. **注册 Handler** (`apps/admin/src/mocks/handlers/index.ts`):
```typescript
import { commentHandlers } from './comment'

export const handlers = [
  // ...其他 handlers
  ...commentHandlers,
]
```

5. **创建 API** (`apps/admin/src/api/modules/comment.ts`):
```typescript
import { get, post, del } from '@/utils/request'
import type { Comment, PageRes } from '@campus-food/shared'

export function getCommentList(params?: { dishId?: string }) {
  return get<PageRes<Comment>>('/admin/comments', { params })
}

export function deleteComment(id: string) {
  return del(`/admin/comments/${id}`)
}
```

6. **创建页面组件**: 实现 UI 和交互

## 常见任务

### 修复 Bug

1. 复现问题
2. 定位根本原因
3. 修复代码
4. 测试验证
5. 提交: `git commit -m "fix(scope): 描述"`

### 添加组件

1. 确定组件位置 (公共组件 vs 页面组件)
2. 创建组件文件
3. 实现组件逻辑
4. 添加类型定义
5. 在需要的地方使用

### 更新依赖

```bash
# 查看过期的包
pnpm outdated

# 更新特定包
pnpm update package-name

# 更新所有包到最新版本
pnpm update --latest
```

## 最佳实践

### 性能优化

1. **路由懒加载**: 使用动态 import
2. **组件懒加载**: 大型组件异步加载
3. **图片优化**: 使用合适的格式和尺寸
4. **避免不必要的渲染**: 使用 `computed`、`watchEffect`
5. **列表优化**: 使用虚拟滚动处理大列表

### 安全考虑

1. **输入验证**: 前端验证所有用户输入
2. **XSS 防护**: 避免使用 `v-html`，使用文本插值
3. **Token 管理**: 安全存储和传输 token
4. **敏感信息**: 不在前端暴露敏感信息

### 代码质量

1. **类型安全**: 充分利用 TypeScript
2. **错误处理**: 合理处理异常情况
3. **代码复用**: 提取公共逻辑和组件
4. **注释文档**: 为复杂逻辑添加注释
5. **测试覆盖**: 为关键功能编写测试

## 故障排查

### 调试技巧

1. **浏览器控制台**: 查看错误和警告
2. **Vue DevTools**: 查看组件状态和 Pinia store
3. **Network 面板**: 检查 API 请求和响应
4. **Application 面板**: 查看 localStorage 和 Service Worker
5. **Breakpoints**: 使用断点调试代码

### 常见问题

详见 [故障排查指南](./docs/TROUBLESHOOTING.md)

## Git 工作流

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Type**:
- `feat`: 新功能
- `fix`: Bug 修复
- `docs`: 文档更新
- `style`: 代码格式
- `refactor`: 重构
- `perf`: 性能优化
- `test`: 测试
- `chore`: 构建/工具变动

**Scope**: `admin` | `user` | `shared` | `deps`

**示例**:
```bash
git commit -m "feat(admin): 实现评论管理功能"
git commit -m "fix(user): 修复购物车数量更新问题"
git commit -m "docs: 更新 README 和 API 文档"
```

## AI 开发指导

### 代码生成原则

1. **类型优先**: 先定义类型，再实现逻辑
2. **遵循规范**: 严格按照项目代码风格
3. **完整实现**: 包含错误处理和边界情况
4. **注重复用**: 使用已有的工具和组件
5. **持续验证**: 生成后验证代码正确性

### 问题解决流程

1. **理解问题**: 明确用户需求和问题描述
2. **查阅文档**: 检查相关文档和代码
3. **分析原因**: 定位问题根本原因
4. **提供方案**: 给出可行的解决方案
5. **实施验证**: 实现并验证解决方案

### 文档维护

当项目有重大变更时，记得更新：
- README.md - 项目说明
- CLAUDE.md - 本文件
- docs/*.md - 相关文档

## 相关资源

### 官方文档

- [Vue 3 文档](https://vuejs.org/)
- [Vite 文档](https://vitejs.dev/)
- [TypeScript 文档](https://www.typescriptlang.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Vue Router 文档](https://router.vuejs.org/)
- [Element Plus 文档](https://element-plus.org/)
- [Vant 文档](https://vant-ui.github.io/vant/)
- [MSW 文档](https://mswjs.io/)

### 项目文档

- [README.md](./README.md) - 项目概览
- [开发工作流](./docs/WORKFLOW.md) - 开发流程和规范
- [MSW 架构文档](./docs/MSW.md) - Mock 架构详解
- [测试账号](./docs/TEST_ACCOUNTS.md) - 测试账号信息
- [故障排查指南](./docs/TROUBLESHOOTING.md) - 问题解决方案

---

**本文档持续更新中，如有问题或建议，欢迎反馈。**

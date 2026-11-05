# MSW 架构文档

本文档描述了校园外卖点餐系统的 Mock Service Worker (MSW) 架构设计。

## 概述

本项目使用 MSW 在前端模拟后端 API，实现全栈开发而无需真实后端服务。通过 localStorage 实现数据持久化，用户端和管理端共享同一份 Mock 数据。

## 架构设计

### 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Environment                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐              ┌──────────────┐            │
│  │   用户端     │              │   管理端     │            │
│  │ (port 3000)  │              │ (port 3001)  │            │
│  └──────┬───────┘              └──────┬───────┘            │
│         │                              │                     │
│         │  HTTP Request                │  HTTP Request      │
│         ▼                              ▼                     │
│  ┌──────────────────────────────────────────────┐          │
│  │           MSW Service Worker                  │          │
│  │  ┌────────────────────────────────────────┐  │          │
│  │  │         Request Handlers                │  │          │
│  │  │  - authHandlers                         │  │          │
│  │  │  - canteenHandlers                      │  │          │
│  │  │  - categoryHandlers                     │  │          │
│  │  │  - dishHandlers                         │  │          │
│  │  │  - orderHandlers                        │  │          │
│  │  │  - userHandlers                         │  │          │
│  │  │  - statsHandlers                        │  │          │
│  │  └────────────────────────────────────────┘  │          │
│  └──────────────────┬───────────────────────────┘          │
│                     │                                         │
│                     │  Read/Write                            │
│                     ▼                                         │
│  ┌──────────────────────────────────────────────┐          │
│  │         @campus-food/shared                   │          │
│  │  ┌────────────────────────────────────────┐  │          │
│  │  │         Mock Data Storage              │  │          │
│  │  │  - users (localStorage)                │  │          │
│  │  │  - orders (localStorage)               │  │          │
│  │  │  - dishes (localStorage)               │  │          │
│  │  │  - canteens (localStorage)             │  │          │
│  │  │  - categories (localStorage)           │  │          │
│  │  │  - addresses (localStorage)            │  │          │
│  │  │  - carts (localStorage)                │  │          │
│  │  │  - admins (localStorage)               │  │          │
│  │  └────────────────────────────────────────┘  │          │
│  └──────────────────────────────────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### 目录结构

```
campus-food-order/
├── apps/
│   ├── admin/                    # 管理端应用
│   │   ├── public/
│   │   │   └── mockServiceWorker.js  # MSW Worker 脚本
│   │   └── src/
│   │       ├── main.ts          # 启动 MSW
│   │       └── mocks/
│   │           ├── index.ts     # MSW Worker 配置
│   │           ├── data/        # 管理端特定数据
│   │           │   └── index.ts # 导出共享数据
│   │           └── handlers/    # 管理端 API Handlers
│   │               ├── index.ts
│   │               ├── auth.ts
│   │               ├── canteen.ts
│   │               ├── category.ts
│   │               ├── dish.ts
│   │               ├── order.ts
│   │               ├── stats.ts
│   │               └── user.ts
│   │
│   └── user/                     # 用户端应用
│       ├── public/
│       │   └── mockServiceWorker.js  # MSW Worker 脚本
│       └── src/
│           ├── main.ts          # 启动 MSW
│           └── mocks/
│               ├── index.ts     # MSW Worker 配置
│               └── handlers/    # 用户端 API Handlers
│                   ├── index.ts
│                   ├── canteen.ts
│                   ├── dish.ts
│                   ├── order.ts
│                   ├── cart.ts
│                   └── address.ts
│
└── packages/
    └── shared/                   # 共享包
        └── src/
            └── mocks/
                ├── index.ts     # 导出工具函数
                └── data/        # 共享 Mock 数据
                    ├── index.ts
                    ├── storage.ts    # localStorage 工具
                    ├── users.ts      # 用户数据
                    ├── admins.ts     # 管理员数据
                    ├── orders.ts     # 订单数据
                    ├── dishes.ts     # 菜品数据
                    ├── canteens.ts   # 食堂数据
                    ├── categories.ts # 分类数据
                    ├── addresses.ts  # 地址数据
                    └── carts.ts      # 购物车数据
```

## 核心组件

### 1. MSW Worker 配置

**位置**: `apps/*/src/mocks/index.ts`

```typescript
import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

export const worker = setupWorker(...handlers)
```

**启动**: `apps/*/src/main.ts`

```typescript
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
```

### 2. Request Handlers

每个 Handler 负责处理特定资源的 API 请求。

**Handler 结构**:

```typescript
import { http, HttpResponse } from 'msw'
import type { Res } from '@campus-food/shared'
import { dataSource } from '../data'

export const resourceHandlers = [
  // GET 列表
  http.get('/api/resources', ({ request }) => {
    // 1. 验证权限（如需要）
    // 2. 解析查询参数
    // 3. 过滤/分页数据
    // 4. 返回响应
    return HttpResponse.json<Res<Resource[]>>({
      code: 200,
      message: 'success',
      data: resources,
    })
  }),

  // GET 详情
  http.get('/api/resources/:id', ({ params }) => {
    const resource = dataSource.find(r => r.id === params.id)
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
  http.post('/api/resources', async ({ request }) => {
    const body = await request.json()
    const newResource = {
      id: generateId(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    dataSource.push(newResource)
    saveToStorage('resources', dataSource)
    
    return HttpResponse.json<Res<Resource>>({
      code: 200,
      message: '创建成功',
      data: newResource,
    })
  }),

  // PUT 更新
  http.put('/api/resources/:id', async ({ request, params }) => {
    const index = dataSource.findIndex(r => r.id === params.id)
    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '资源不存在', data: null },
        { status: 404 }
      )
    }
    
    const body = await request.json()
    dataSource[index] = {
      ...dataSource[index],
      ...body,
      updatedAt: new Date().toISOString(),
    }
    saveToStorage('resources', dataSource)
    
    return HttpResponse.json<Res<Resource>>({
      code: 200,
      message: '更新成功',
      data: dataSource[index],
    })
  }),

  // DELETE 删除
  http.delete('/api/resources/:id', ({ params }) => {
    const index = dataSource.findIndex(r => r.id === params.id)
    if (index === -1) {
      return HttpResponse.json<Res<null>>(
        { code: 404, message: '资源不存在', data: null },
        { status: 404 }
      )
    }
    
    dataSource.splice(index, 1)
    saveToStorage('resources', dataSource)
    
    return HttpResponse.json<Res<null>>({
      code: 200,
      message: '删除成功',
      data: null,
    })
  }),
]
```

### 3. 数据持久化

**位置**: `packages/shared/src/mocks/data/storage.ts`

```typescript
// 从 localStorage 加载
export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error(`Failed to load ${key}:`, error)
  }
  return defaultValue
}

// 保存到 localStorage
export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Failed to save ${key}:`, error)
  }
}
```

### 4. 数据初始化

**位置**: `packages/shared/src/mocks/data/*.ts`

```typescript
import { loadFromStorage } from './storage'

// 初始化数据
const initialData = [
  // ... 默认数据
]

// 从 localStorage 加载或使用初始数据
export let dataSource = loadFromStorage('storage_key', initialData)

// 保存函数
export function saveData() {
  saveToStorage('storage_key', dataSource)
}
```

## 权限验证

### 管理端权限验证

**位置**: `apps/admin/src/mocks/handlers/auth.ts`

```typescript
export function validateAdminToken(request: Request): string | null {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  // 检查是否为管理员 token
  if (!token.startsWith('admin_token_')) {
    return null
  }

  return token
}
```

**使用示例**:

```typescript
http.get('/api/admin/resource', ({ request }) => {
  const token = validateAdminToken(request)
  if (!token) {
    return HttpResponse.json<Res<null>>(
      { code: 401, message: '未授权访问', data: null },
      { status: 401 }
    )
  }
  // ... 处理请求
})
```

## API 响应格式

所有 API 响应遵循统一格式：

```typescript
interface Res<T> {
  code: number      // 状态码
  message: string   // 消息
  data: T          // 数据
}
```

### 分页响应

```typescript
interface PageRes<T> {
  code: number
  message: string
  data: {
    items: T[]     // 数据列表
    total: number  // 总数
  }
}
```

## 数据共享机制

### localStorage Keys

```typescript
const STORAGE_KEYS = {
  ORDERS: 'mock_orders',
  CANTEENS: 'mock_canteens',
  CATEGORIES: 'mock_categories',
  DISHES: 'mock_dishes',
  USERS: 'mock_users',
  ADDRESSES: 'mock_addresses',
  CARTS: 'mock_carts',
  ADMINS: 'mock_admins',
}
```

### 数据同步流程

1. **初始化**: 应用启动时从 localStorage 加载数据
2. **修改**: Handler 处理请求时修改内存数据
3. **持久化**: 修改后立即调用 `saveToStorage` 保存到 localStorage
4. **共享**: 用户端和管理端读取同一个 localStorage key

## 开发指南

### 添加新的 API Handler

1. **创建 Handler 文件**

```typescript
// apps/admin/src/mocks/handlers/newResource.ts
import { http, HttpResponse } from 'msw'
import type { Res } from '@campus-food/shared'
import { dataSource, saveData } from '../data'
import { validateAdminToken } from './auth'

export const newResourceHandlers = [
  http.get('/api/admin/new-resources', ({ request }) => {
    const token = validateAdminToken(request)
    if (!token) {
      return HttpResponse.json<Res<null>>(
        { code: 401, message: '未授权访问', data: null },
        { status: 401 }
      )
    }

    return HttpResponse.json<Res<Resource[]>>({
      code: 200,
      message: 'success',
      data: dataSource,
    })
  }),
]
```

2. **注册 Handler**

```typescript
// apps/admin/src/mocks/handlers/index.ts
import { newResourceHandlers } from './newResource'

export const handlers = [
  ...authHandlers,
  ...canteenHandlers,
  // ... 其他 handlers
  ...newResourceHandlers,
]
```

3. **创建数据文件**

```typescript
// packages/shared/src/mocks/data/newResources.ts
import { loadFromStorage, saveToStorage } from './storage'

const initialData = [
  // 初始数据
]

export let newResources = loadFromStorage('mock_new_resources', initialData)

export function saveNewResources() {
  saveToStorage('mock_new_resources', newResources)
}
```

### 添加分页支持

```typescript
http.get('/api/resources', ({ request }) => {
  const url = new URL(request.url)
  const page = Number(url.searchParams.get('page')) || 1
  const pageSize = Number(url.searchParams.get('pageSize')) || 10
  const keyword = url.searchParams.get('keyword') || ''

  // 过滤
  let filtered = dataSource
  if (keyword) {
    filtered = filtered.filter(item =>
      item.name.includes(keyword)
    )
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
})
```

### 调试技巧

1. **查看拦截的请求**

```typescript
// 在 main.ts 中启用详细日志
worker.start({
  onUnhandledRequest: 'warn', // 警告未处理的请求
})
```

2. **检查 localStorage 数据**

```javascript
// 在浏览器控制台
console.log(JSON.parse(localStorage.getItem('mock_orders')))
```

3. **重置数据**

```javascript
// 清空所有 Mock 数据
localStorage.clear()
location.reload()
```

## 最佳实践

1. **Handler 命名**: 使用资源名 + Handlers，如 `userHandlers`
2. **数据文件命名**: 使用复数形式，如 `users.ts`, `orders.ts`
3. **ID 生成**: 使用时间戳或 UUID，确保唯一性
4. **错误处理**: 返回合适的 HTTP 状态码和错误消息
5. **权限验证**: 管理端 API 都需要验证 token
6. **数据持久化**: 每次修改数据后立即保存到 localStorage
7. **类型安全**: 使用 TypeScript 类型确保数据结构正确

## 性能优化

1. **延迟加载**: 使用动态 import 加载 MSW
2. **生产环境**: 确保生产环境不加载 MSW
3. **数据量控制**: 避免在 localStorage 存储过大数据
4. **索引优化**: 使用 Map 或 Set 加速查找

## 故障排查

### MSW 未启动

**症状**: API 请求返回 404

**解决**:
1. 检查 `public/mockServiceWorker.js` 是否存在
2. 确认 `main.ts` 中是否正确启动 MSW
3. 查看浏览器控制台是否有错误

### 数据未持久化

**症状**: 刷新页面数据丢失

**解决**:
1. 检查是否调用了 `saveToStorage`
2. 查看 localStorage 是否有数据
3. 确认 storage key 拼写正确

### 跨域问题

**症状**: MSW 拦截失败，请求实际发出

**解决**:
MSW 在同域下工作，确保 API 路径以 `/api` 开头

## 相关文档

- [MSW 官方文档](https://mswjs.io/)
- [测试账号](./TEST_ACCOUNTS.md)
- [开发工作流](./WORKFLOW.md)
- [故障排查指南](./TROUBLESHOOTING.md)

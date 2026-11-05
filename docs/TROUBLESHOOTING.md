# 故障排查指南

本文档提供校园外卖点餐系统常见问题的排查和解决方案。

## 目录

- [安装和启动问题](#安装和启动问题)
- [MSW 相关问题](#msw-相关问题)
- [数据持久化问题](#数据持久化问题)
- [API 请求问题](#api-请求问题)
- [页面渲染问题](#页面渲染问题)
- [组件问题](#组件问题)
- [构建问题](#构建问题)

## 安装和启动问题

### 问题：pnpm install 失败

**症状**:
```
ERR_PNPM_...
```

**可能原因**:
1. Node.js 版本不兼容
2. pnpm 版本过低
3. 网络问题

**解决方案**:

1. **检查 Node.js 版本**
```bash
node -v
# 要求: ^22.18.0 || >=24.12.0
```

如果版本不符合要求，请安装正确版本：
```bash
# 使用 nvm (推荐)
nvm install 24
nvm use 24
```

2. **检查 pnpm 版本**
```bash
pnpm -v
# 要求: >=9.0.0
```

升级 pnpm：
```bash
npm install -g pnpm@latest
```

3. **清理缓存重试**
```bash
pnpm store prune
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

4. **使用国内镜像**
```bash
pnpm config set registry https://registry.npmmirror.com/
pnpm install
```

### 问题：启动失败 - 端口被占用

**症状**:
```
Port 3000 is already in use
Port 3001 is already in use
```

**解决方案**:

1. **查找占用端口的进程**
```bash
# Windows
netstat -ano | findstr :3000
netstat -ano | findstr :3001

# macOS/Linux
lsof -i :3000
lsof -i :3001
```

2. **终止进程**
```bash
# Windows
taskkill /PID <PID> /F

# macOS/Linux
kill -9 <PID>
```

3. **使用不同端口**

修改 `vite.config.ts`:
```typescript
server: {
  port: 3002, // 改成其他端口
  strictPort: false,
}
```

### 问题：TypeScript 类型检查失败

**症状**:
```
error TS2307: Cannot find module '@campus-food/shared'
```

**解决方案**:

1. **重新构建类型**
```bash
pnpm type-check
```

2. **重启 VSCode TypeScript 服务**
- 按 `Ctrl+Shift+P` (macOS: `Cmd+Shift+P`)
- 输入 "TypeScript: Restart TS Server"

3. **清理并重新安装**
```bash
pnpm clean
pnpm install
```

## MSW 相关问题

### 问题：MSW 未启动

**症状**:
- API 请求返回 404
- 控制台无 MSW 相关日志
- 网络面板显示请求未被拦截

**解决方案**:

1. **检查 mockServiceWorker.js**
```bash
# 应该存在于 public 目录
ls apps/admin/public/mockServiceWorker.js
ls apps/user/public/mockServiceWorker.js
```

如果不存在，重新生成：
```bash
cd apps/admin
npx msw init public --save

cd ../user
npx msw init public --save
```

2. **检查 main.ts 启动代码**
```typescript
// 确保有以下代码
if (import.meta.env.DEV) {
  const { worker } = await import('./mocks')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}
```

3. **清除浏览器缓存**
- 按 `Ctrl+Shift+Delete` (macOS: `Cmd+Shift+Delete`)
- 选择"缓存的图片和文件"
- 清除并刷新页面

4. **检查 Service Worker 注册**

在浏览器控制台：
```javascript
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Service Workers:', registrations)
})
```

### 问题：MSW 拦截失败

**症状**:
- 请求发送到真实服务器
- 返回 CORS 错误或连接失败

**解决方案**:

1. **检查 API 路径**

确保请求路径以 `/api` 开头：
```typescript
// ✅ 正确
axios.get('/api/admin/users')

// ❌ 错误
axios.get('http://localhost:8080/users')
```

2. **检查 Handler 路径匹配**
```typescript
// Handler 中的路径要与实际请求匹配
http.get('/api/admin/users', ...) // 匹配 /api/admin/users
```

3. **启用详细日志**
```typescript
worker.start({
  onUnhandledRequest: 'warn', // 会在控制台警告未处理的请求
})
```

### 问题：Handler 未生效

**症状**:
- MSW 启动了但特定 API 返回 404

**解决方案**:

1. **检查 Handler 注册**
```typescript
// handlers/index.ts
export const handlers = [
  ...authHandlers,
  ...userHandlers, // 确保已导出
  // ...
]
```

2. **检查 HTTP 方法**
```typescript
// Handler 定义
http.get('/api/users', ...)

// 请求
axios.get('/api/users') // ✅
axios.post('/api/users') // ❌ 不匹配
```

3. **查看 MSW 日志**

在浏览器控制台查看拦截的请求，确认路径和方法。

## 数据持久化问题

### 问题：数据不持久化

**症状**:
- 刷新页面后数据丢失
- 修改数据后刷新恢复初始状态

**解决方案**:

1. **检查是否调用保存函数**
```typescript
// ❌ 错误 - 只修改了内存数据
users.push(newUser)

// ✅ 正确 - 保存到 localStorage
users.push(newUser)
saveUsers() // 必须调用
```

2. **检查 localStorage**

在浏览器控制台：
```javascript
// 查看数据
console.log(localStorage.getItem('mock_users'))

// 查看所有 keys
Object.keys(localStorage).filter(key => key.startsWith('mock_'))
```

3. **检查存储空间**
```javascript
// 检查 localStorage 是否已满
try {
  localStorage.setItem('test', 'test')
  localStorage.removeItem('test')
  console.log('localStorage 可用')
} catch (e) {
  console.error('localStorage 已满或被禁用')
}
```

### 问题：localStorage 数据损坏

**症状**:
- JSON.parse 错误
- 数据格式不正确

**解决方案**:

1. **重置所有数据**
```javascript
// 在浏览器控制台
localStorage.clear()
location.reload()
```

2. **重置特定数据**
```javascript
localStorage.removeItem('mock_users')
location.reload()
```

### 问题：用户端和管理端数据不同步

**症状**:
- 管理端修改的数据，用户端看不到

**解决方案**:

1. **确认使用同一个 storage key**

检查 `packages/shared/src/mocks/data/storage.ts`:
```typescript
const STORAGE_KEYS = {
  USERS: 'mock_users', // 两端必须相同
}
```

2. **确认数据源来自 shared 包**
```typescript
// ✅ 正确
import { users, saveUsers } from '@campus-food/shared'

// ❌ 错误 - 本地数据，不共享
const users = []
```

3. **刷新另一端页面**

修改数据后，需要刷新另一端页面才能看到更新。

## API 请求问题

### 问题：401 未授权错误

**症状**:
```json
{
  "code": 401,
  "message": "未授权访问"
}
```

**解决方案**:

1. **检查 token**

在浏览器控制台：
```javascript
// 检查 token 是否存在
console.log(localStorage.getItem('admin_token'))
```

2. **重新登录**

清除 token 并重新登录：
```javascript
localStorage.removeItem('admin_token')
```

3. **检查请求头**

确认 axios 拦截器正确设置了 Authorization 头：
```typescript
// utils/request.ts
request.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### 问题：404 未找到

**症状**:
```json
{
  "code": 404,
  "message": "资源不存在"
}
```

**解决方案**:

1. **检查 ID 参数**
```typescript
// 确保 ID 存在且格式正确
const id = '1' // ✅
const id = undefined // ❌
```

2. **检查数据是否存在**

在浏览器控制台：
```javascript
const data = JSON.parse(localStorage.getItem('mock_users'))
console.log(data.find(u => u.id === '1'))
```

3. **重置数据**

如果数据损坏，重置：
```javascript
localStorage.removeItem('mock_users')
location.reload()
```

### 问题：CORS 错误

**症状**:
```
Access to XMLHttpRequest at '...' has been blocked by CORS policy
```

**解决方案**:

这通常表示 MSW 未正确拦截请求。参考 [MSW 拦截失败](#问题msw-拦截失败)。

## 页面渲染问题

### 问题：页面空白

**症状**:
- 页面完全空白
- 控制台有错误

**解决方案**:

1. **检查浏览器控制台**

查看是否有 JavaScript 错误，根据错误信息解决。

2. **检查路由配置**
```typescript
// router/index.ts
const routes = [
  {
    path: '/',
    component: () => import('@/views/Home.vue'), // 确保路径正确
  },
]
```

3. **检查组件导入**
```typescript
// ❌ 错误
import Home from './Home' // 缺少 .vue

// ✅ 正确
import Home from './Home.vue'
```

### 问题：样式丢失

**症状**:
- 页面渲染但没有样式
- 布局错乱

**解决方案**:

1. **检查 CSS 导入**
```typescript
// main.ts
import 'element-plus/dist/index.css' // Element Plus
import 'vant/lib/index.css' // Vant
```

2. **检查 Less 配置**
```typescript
// vite.config.ts
css: {
  preprocessorOptions: {
    less: {
      javascriptEnabled: true,
    },
  },
}
```

3. **清除缓存重启**
```bash
rm -rf node_modules/.vite
pnpm dev
```

### 问题：图片不显示

**症状**:
- 图片 404
- 图片路径错误

**解决方案**:

1. **使用正确的路径**
```typescript
// ✅ 正确 - 使用 public 目录
<img src="/images/avatar.png" />

// ❌ 错误 - 相对路径
<img src="../assets/avatar.png" />
```

2. **检查图片是否存在**
```bash
ls public/images/avatar.png
```

## 组件问题

### 问题：Element Plus 组件未定义

**症状**:
```
[Vue warn]: Failed to resolve component: el-button
```

**解决方案**:

1. **检查自动导入配置**
```typescript
// vite.config.ts
Components({
  resolvers: [
    ElementPlusResolver(),
  ],
})
```

2. **手动导入组件**
```typescript
import { ElButton } from 'element-plus'
```

3. **重启开发服务器**
```bash
# Ctrl+C 停止
pnpm dev
```

### 问题：图标不显示

**症状**:
- 图标位置空白
- 控制台报错 `Failed to resolve component: i-ep:xxx`

**解决方案**:

1. **检查图标集是否安装**
```bash
pnpm add -D @iconify-json/ep
```

2. **检查 Icons 配置**
```typescript
// vite.config.ts
Icons({
  autoInstall: true,
})

IconsResolver({
  enabledCollections: ['ep'],
})
```

3. **使用正确的图标名称**
```vue
<!-- ✅ 正确 -->
<i-ep:edit />

<!-- ❌ 错误 -->
<i-ep-edit />
```

## 构建问题

### 问题：类型检查失败

**症状**:
```
error TS2322: Type 'string' is not assignable to type 'number'
```

**解决方案**:

1. **修复类型错误**

根据错误提示修复代码中的类型问题。

2. **临时跳过类型检查（不推荐）**
```bash
pnpm build-only # 跳过 type-check
```

### 问题：构建产物过大

**症状**:
- dist 目录体积很大
- 打包时间很长

**解决方案**:

1. **检查是否包含了不必要的依赖**

2. **使用代码分割**
```typescript
// 路由懒加载
{
  path: '/dashboard',
  component: () => import('@/views/Dashboard.vue'),
}
```

3. **分析构建产物**
```bash
pnpm add -D rollup-plugin-visualizer
```

### 问题：生产环境 MSW 未关闭

**症状**:
- 生产构建包含 MSW 代码

**解决方案**:

确保只在开发环境启动 MSW：
```typescript
// main.ts
if (import.meta.env.DEV) { // 只在开发环境
  const { worker } = await import('./mocks')
  await worker.start()
}
```

## 其他问题

### 问题：Git 提交失败

**症状**:
- pre-commit hook 失败
- ESLint 错误阻止提交

**解决方案**:

1. **修复 Lint 错误**
```bash
pnpm lint
```

2. **格式化代码**
```bash
pnpm format
```

3. **强制提交（不推荐）**
```bash
git commit --no-verify
```

### 问题：pnpm workspace 依赖问题

**症状**:
```
Cannot find module '@campus-food/shared'
```

**解决方案**:

1. **确认 workspace 配置**
```yaml
# pnpm-workspace.yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

2. **重新安装依赖**
```bash
pnpm install
```

3. **检查 package.json**
```json
{
  "dependencies": {
    "@campus-food/shared": "workspace:*"
  }
}
```

## 获取帮助

如果以上方法都无法解决问题：

1. **查看浏览器控制台**: 详细错误信息通常在这里
2. **查看 Network 面板**: 检查 API 请求和响应
3. **查看 Application 面板**: 检查 localStorage 和 Service Worker
4. **重现问题**: 记录复现步骤，便于排查
5. **搜索相关文档**: Vue、Vite、MSW、Element Plus 官方文档
6. **提 Issue**: 如果是项目本身的 bug，提交 Issue 到仓库

## 相关文档

- [README.md](../README.md) - 项目概览
- [开发工作流](./WORKFLOW.md) - 开发规范
- [MSW 架构文档](./MSW.md) - MSW 使用指南
- [测试账号](./TEST_ACCOUNTS.md) - 测试账号信息

# 开发工作流

本文档描述了校园外卖点餐系统的开发工作流程和规范。

## 分支策略

### 主要分支

- `main` - 主分支，受保护，存放生产就绪代码
- `master` - 当前开发分支
- `feature/*` - 功能分支
- `fix/*` - 修复分支
- `docs/*` - 文档分支

### 分支命名规范

```
feature/用户管理-编辑功能
fix/修复图标导入问题
docs/更新README
```

## 提交规范

### Commit Message 格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>
```

### Type 类型

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整（不影响功能）
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建工具、辅助工具变动

### Scope 范围

- `admin`: 管理端
- `user`: 用户端
- `shared`: 共享包
- `deps`: 依赖更新

### 示例

```bash
feat(admin): 实现用户管理编辑功能

- 新增用户编辑 API (updateUser)
- 实现用户信息更新的 Mock Handler，支持持久化
- 用户管理页面新增编辑按钮和对话框
- 新增 UserForm 组件用于编辑用户信息
```

```bash
fix(admin): 修复图标组件导入问题
```

```bash
chore: 更新 .gitignore 正确忽略 TypeScript 编译产物
```

## 开发流程

### 1. 开发新功能

```bash
# 1. 创建功能分支
git checkout -b feature/功能名称

# 2. 开发并提交代码
git add .
git commit -m "feat(scope): 功能描述"

# 3. 推送到远程
git push -u origin feature/功能名称

# 4. 创建 Pull Request
gh pr create --title "feat: 功能标题" --body "功能描述"
```

### 2. 修复 Bug

```bash
# 1. 创建修复分支
git checkout -b fix/bug描述

# 2. 修复并提交
git add .
git commit -m "fix(scope): 修复描述"

# 3. 推送并创建 PR
git push -u origin fix/bug描述
gh pr create --title "fix: bug标题" --body "修复说明"
```

### 3. 日常开发

```bash
# 启动开发服务器
pnpm dev          # 同时启动用户端和管理端
pnpm dev:user     # 只启动用户端 (http://localhost:3000)
pnpm dev:admin    # 只启动管理端 (http://localhost:3001)

# 代码检查
pnpm lint         # 运行代码检查
pnpm format       # 格式化代码
pnpm type-check   # 类型检查

# 构建
pnpm build        # 构建所有应用
pnpm build:user   # 构建用户端
pnpm build:admin  # 构建管理端
```

## 代码审查

### Pull Request 规范

1. **标题清晰**：使用 Conventional Commits 格式
2. **描述完整**：包含功能说明、测试计划、截图等
3. **代码自查**：提交前自己先审查一遍
4. **单一职责**：一个 PR 只做一件事
5. **测试验证**：确保功能正常、无报错

### PR 模板

```markdown
## 功能说明
简要描述本次 PR 的改动内容

## 改动清单
- [ ] 新增 xxx 功能
- [ ] 修复 xxx 问题
- [ ] 更新 xxx 文档

## 测试计划
- [ ] 功能测试通过
- [ ] 代码检查通过
- [ ] 类型检查通过

## 截图
如有 UI 改动，请提供截图
```

## 发布流程

### 版本号规范

遵循 [Semantic Versioning](https://semver.org/)：

- `MAJOR.MINOR.PATCH`
- 如：`1.0.0`, `1.1.0`, `1.1.1`

### 发布步骤

```bash
# 1. 确保在 main 分支
git checkout main
git pull origin main

# 2. 更新版本号
# 编辑 package.json 中的 version 字段

# 3. 提交版本更新
git add .
git commit -m "chore: release v1.0.0"

# 4. 创建标签
git tag -a v1.0.0 -m "Release v1.0.0"

# 5. 推送
git push origin main --tags

# 6. 构建生产版本
pnpm build

# 7. 部署
# 根据实际部署方案进行部署
```

## 最佳实践

### 代码风格

1. 使用 ESLint 和 Prettier 保持代码一致性
2. 遵循 Vue 3 Composition API 风格指南
3. TypeScript 严格模式，避免使用 `any`
4. 组件命名使用 PascalCase

### Git 使用

1. 提交前先拉取最新代码
2. 频繁提交，保持提交原子性
3. 不要提交 `node_modules`、`dist`、`.env` 等文件
4. 不要提交 TypeScript 编译产物（`.d.ts`, `.js`）
5. 使用有意义的提交信息

### 开发规范

1. **组件开发**：遵循单一职责原则
2. **API 设计**：RESTful 风格，统一响应格式
3. **Mock 数据**：使用 MSW 模拟后端 API
4. **状态管理**：使用 Pinia，按模块划分
5. **路由管理**：懒加载，按功能分组
6. **错误处理**：统一错误处理和提示

### 测试规范

1. 使用测试账号进行功能测试
2. 测试各种边界情况和异常场景
3. 验证响应式布局（移动端适配）
4. 检查浏览器控制台无报错
5. 验证 Mock 数据持久化是否正常

## 故障排查

遇到问题时，请参考 [故障排查指南](./TROUBLESHOOTING.md)。

## 相关文档

- [README.md](../README.md) - 项目概览
- [CLAUDE.md](../CLAUDE.md) - AI 开发规则
- [MSW 架构文档](./MSW.md) - Mock Service Worker 架构
- [测试账号](./TEST_ACCOUNTS.md) - 测试账号信息

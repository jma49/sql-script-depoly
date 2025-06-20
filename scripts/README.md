# 脚本目录 (Scripts Directory)

这个目录包含了 SQL 脚本部署系统的各种工具脚本，按功能和执行频率分类组织。

## 📁 目录结构

```
scripts/
├── one-time/              # 一次性脚本（已执行的初始化和优化脚本）
├── core/                  # 核心功能模块
├── services/              # 服务组件
├── manage-cache.ts        # 缓存管理工具 ⭐ 常用
├── run-sql.ts            # SQL执行工具
├── run-all-scripts.ts    # 批量脚本执行器
├── clear-redis-cache.js  # Redis缓存清理
├── list-user-roles.js    # 用户角色查询
└── types.ts              # 类型定义
```

## 🚀 常用脚本

### 缓存管理 (最常用)

```bash
# 查看缓存健康状态
npm run cache:health

# 查看缓存统计信息
npm run cache:stats

# 查看缓存策略配置
npm run cache:strategies

# 清理所有缓存
npm run cache:clear

# 实时监控缓存性能
npm run cache:monitor
```

### SQL 脚本执行

```bash
# 执行单个脚本
npm run sql:run [script-name]

# 执行所有启用的脚本
npm run sql:run-enabled

# 执行所有定时脚本
npm run sql:run-scheduled

# 执行所有脚本
npm run sql:run-all
```

### 数据库优化 (一次性)

```bash
# 预览要创建的索引
npm run optimize:db:dry-run

# 仅生成报告
npm run optimize:db:report

# 执行索引优化
npm run optimize:db
```

## 📂 子目录说明

### `/one-time/` - 一次性脚本

已执行过的系统初始化和优化脚本，包含完整的执行说明。
详细信息请查看 [one-time/README.md](./one-time/README.md)

### `/core/` - 核心模块

- `sql-executor.ts` - SQL 执行引擎

### `/services/` - 服务组件

- `mongo-service.ts` - MongoDB 服务
- `slack-service.ts` - Slack 通知服务

## 🔧 开发工具

### 用户管理

```bash
# 查看用户角色
node scripts/list-user-roles.js

# 分配管理员角色 (一次性)
node scripts/one-time/assign-admin-role.js
```

### 测试和诊断

```bash
# 测试数据库连接
npm run test:db

# 测试MongoDB连接
npm run test:mongodb

# 测试Slack通知
npm run test:notify
```

## 📋 脚本分类

| 类型            | 描述               | 执行频率   |
| --------------- | ------------------ | ---------- |
| 🔄 **运维工具** | cache 管理、清理等 | 日常使用   |
| ⚡ **执行器**   | SQL 脚本运行       | 按需使用   |
| 🔧 **一次性**   | 初始化、优化       | 仅执行一次 |
| 🛠️ **开发工具** | 测试、诊断         | 开发调试   |

## ⚠️ 重要提醒

1. **环境变量**: 确保 `.env.local` 配置正确
2. **权限检查**: 某些脚本需要管理员权限
3. **备份建议**: 执行重要操作前建议备份数据
4. **日志记录**: 生产环境执行时注意查看日志输出

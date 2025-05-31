# SQL 脚本部署与监控系统

[![Version](https://img.shields.io/badge/version-0.2.0-blue.svg)](./package.json)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black.svg)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.15.0-green.svg)](https://www.mongodb.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-支持-336791.svg)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-缓存支持-red.svg)](https://redis.io/)
[![Clerk](https://img.shields.io/badge/Clerk-认证系统-purple.svg)](https://clerk.com/)

一个基于 Next.js 构建的现代化 SQL 脚本管理与监控系统，提供可视化界面来管理、执行和监控 SQL 检查脚本。系统支持自动化执行、实时通知、详细的历史记录分析、高性能缓存层和**企业级身份认证**。

## ✨ 核心功能

### 📝 脚本管理 (CRUD)

- **可视化管理界面**: 通过现代化 Web UI 创建、查看、编辑和删除 SQL 脚本
- **🆕 智能 SQL 编辑器**: 集成 CodeMirror 6，支持语法高亮、主题切换和**一键代码格式化**
- **🆕 实时代码统计**: 显示行数、字符数等代码度量信息
- **🆕 预览模式**: 支持编辑/预览模式切换，提供更好的代码查看体验
- **多语言元数据**: 支持中英双语的脚本名称、描述和范围说明
- **安全验证**: 自动检测并阻止有害的 DDL/DML 操作，确保只读执行

### 🚀 脚本执行

- **手动执行**: 从仪表盘快速选择并执行存储的脚本
- **批量执行**: 支持执行所有脚本或仅执行启用定时任务的脚本
- **🆕 实时进度监控**: 全屏进度对话框，实时显示每个脚本的执行状态
- **🆕 批量执行管理**: 支持取消、暂停和恢复批量执行任务
- **完整 PostgreSQL 支持**: 专用解析器完美支持 DO 块、函数定义、dollar-quoted 字符串等复杂语法
- **🆕 智能超时保护**: 自动识别复杂查询并设置分级超时机制(普通 30s/复杂 5min)
- **🆕 语法预验证**: 执行前检测 PostgreSQL 语法错误，提升成功率
- **GitHub Actions 集成**: 通过 GitHub Actions 实现自动化定时执行
- **Vercel Cron Jobs**: 支持 Vercel 平台的定时任务配置

### 🔄 Redis 缓存层 (新增)

- **🆕 高性能缓存**: 使用 Redis 作为批量执行状态的缓存层
- **🆕 分布式支持**: 支持多实例部署，解决单机内存限制
- **🆕 原子性操作**: 使用 Lua 脚本确保状态更新的一致性
- **🆕 智能过期**: 自动管理缓存过期时间，避免内存泄漏
- **🆕 健康检查**: 专用 API 监控 Redis 连接状态和性能
- **🆕 降级机制**: Redis 不可用时自动降级到内存存储
- **🆕 缓存统计**: 实时监控缓存使用情况和性能指标

### 📊 监控与分析

- **实时仪表盘**: 显示执行状态统计、成功率和趋势分析
- **🆕 现代化表格设计**: 采用渐变背景、悬停效果和改进的视觉设计
- **🆕 智能分页系统**: 支持页面跳转、搜索过滤和状态筛选
- **详细历史记录**: 支持展开查看执行详情、原始结果数据
- **多维度筛选**: 按状态、时间范围、脚本类型进行筛选
- **导出功能**: 支持将执行结果导出为多种格式
- **状态分类**: 自动识别成功、失败和需要关注的执行结果
- **执行结果详情**: 完整的执行报告，包括数据结果和脚本元数据

### 🔔 通知系统

- **Slack 集成**: 实时发送执行结果到 Slack 频道
- **智能过滤**: 只在失败或需要关注时发送通知，减少噪音
- **状态通知**: 区分成功、失败和需要关注的不同通知类型
- **批量通知**: 汇总报告多个脚本的执行状态

### 🌐 国际化支持

- **🆕 完整双语界面**: 中英文无缝切换，覆盖所有 UI 组件
- **🆕 智能翻译系统**: 包含 Redis 缓存功能在内的完整本地化支持
- **动态语言切换**: 无需刷新页面即可切换界面语言
- **本地化日期时间**: 根据语言设置显示格式化的日期时间

### 🔒 安全特性

- **只读强制**: 严格限制为 SELECT 查询，禁止数据修改操作
- **权限控制**: Cron Job 端点的访问令牌保护
- **SSL 支持**: 支持生产环境的 SSL 数据库连接
- **输入验证**: 全面的用户输入验证和安全检查
- **Redis 安全**: 支持 Redis 密码认证和 SSL 连接

### 🔐 身份认证与访问控制 (v0.2.0 新增)

- **🆕 Clerk 企业级认证**: 集成 Clerk 认证服务，提供现代化的身份管理
- **🆕 Restricted 邀请制**: 仅限管理员邀请用户注册，确保系统安全
- **🆕 邮箱域名限制**: 严格限制仅 @infi.us 邮箱用户可访问系统
- **🆕 多重验证机制**: 中间件级别和页面级别双重认证验证
- **🆕 完整国际化**: 认证页面支持中英文切换，提供本地化体验
- **🆕 自动重定向**: 智能路由保护，未授权访问自动跳转至相应页面
- **🆕 现代化 UI**: 美观的登录/注册界面，响应式设计适配各种设备

### 🎨 用户界面增强 (v0.2.0 新增)

- **🆕 双语化 Header**: 系统标题和状态标识支持中英文切换
- **🆕 统一翻译系统**: 完整的翻译键管理，新增功能自动支持国际化
- **🆕 用户状态显示**: Header 显示当前用户信息和授权状态
- **🆕 主题一致性**: 认证页面与主系统 UI 风格完全统一

## 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web 前端       │    │   API 后端       │    │   执行引擎       │
│  (Next.js UI)   │────│ (Next.js API)   │────│ (Node.js/TS)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   MongoDB        │    │   PostgreSQL    │    │   Redis 缓存     │
│ (脚本+结果存储)  │    │  (目标数据库)   │    │ (状态+会话)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                       │
                                              ┌─────────────────┐
                                              │   通知服务       │
                                              │  (Slack)        │
                                              └─────────────────┘
```

### 主要组件

1. **Web 应用层 (Next.js 15.2.4)**

   - 现代化仪表盘界面
   - 脚本管理页面 (`/manage-scripts`)
   - 数据分析入口 (`/data-analysis`)
   - 执行结果详情页面 (`/view-execution-result/[id]`)
   - **🆕 批量执行进度监控界面**

2. **API 服务层**

   - `/api/scripts/*` - 脚本 CRUD 操作
   - `/api/check-history` - 执行历史查询
   - `/api/run-check` - 手动执行触发
   - `/api/run-scheduled-scripts` - 定时执行 API
   - `/api/run-all-scripts` - 🆕 批量执行 API
   - `/api/batch-execution-status` - 🆕 批量状态 API
   - `/api/health/redis` - 🆕 Redis 健康检查
   - `/api/maintenance/cleanup` - 🆕 缓存清理 API
   - `/api/execution-details/[id]` - 详情查询 API

3. **执行引擎**

   - `scripts/core/sql-executor.ts` - 核心 SQL 执行逻辑
   - `scripts/run-all-scripts.ts` - 批量执行工具
   - `src/lib/script-executor.ts` - API 包装器

4. **数据存储**

   - **MongoDB**: 脚本定义、执行历史、元数据
   - **PostgreSQL**: 目标数据库（只读查询）
   - **🆕 Redis**: 批量执行状态、会话缓存（可选）

5. **缓存层 (新增)**

   - **Redis 客户端**: 统一连接管理和连接池
   - **状态缓存**: 批量执行状态的实时缓存
   - **健康监控**: 缓存性能和连接状态监控

6. **自动化系统**
   - **GitHub Actions**: 定时和手动触发执行
   - **Vercel Cron Jobs**: 云端定时任务

## 📁 项目结构

```
sql_script_depoly/
├── .github/workflows/
│   └── sql-check-cron.yml           # GitHub Actions 工作流
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── api/                     # API 路由
│   │   │   ├── scripts/             # 脚本 CRUD API
│   │   │   ├── check-history/       # 历史记录 API
│   │   │   ├── run-check/           # 手动执行 API
│   │   │   ├── run-scheduled-scripts/ # 定时执行 API
│   │   │   ├── run-all-scripts/     # 🆕 批量执行 API
│   │   │   ├── batch-execution-status/ # 🆕 批量状态 API
│   │   │   ├── health/redis/        # 🆕 Redis健康检查
│   │   │   ├── maintenance/cleanup/ # 🆕 缓存清理API
│   │   │   └── execution-details/   # 详情查询 API
│   │   ├── manage-scripts/          # 脚本管理页面
│   │   ├── data-analysis/           # 数据分析页面
│   │   ├── view-execution-result/   # 结果详情页面
│   │   └── page.tsx                 # 主仪表盘
│   ├── components/
│   │   ├── dashboard/               # 仪表盘组件
│   │   │   ├── CheckHistory.tsx     # 历史记录组件
│   │   │   ├── StatsCards.tsx       # 统计卡片
│   │   │   ├── ManualTrigger.tsx    # 手动执行组件
│   │   │   ├── BatchExecutionProgress.tsx # 🆕 批量执行进度
│   │   │   └── types.ts             # 类型定义
│   │   ├── scripts/                 # 脚本管理组件
│   │   │   ├── ScriptMetadataForm.tsx # 元数据表单
│   │   │   └── CodeMirrorEditor.tsx   # SQL 编辑器
│   │   └── ui/                      # Shadcn/ui 基础组件
│   ├── lib/
│   │   ├── db.ts                    # PostgreSQL 连接
│   │   ├── mongodb.ts               # MongoDB 连接
│   │   ├── redis.ts                 # 🆕 Redis 连接管理
│   │   └── script-executor.ts       # 执行包装器
│   └── services/
│       └── batch-execution-cache.ts # 🆕 批量执行缓存服务
├── scripts/
│   ├── core/
│   │   └── sql-executor.ts          # 核心执行引擎
│   ├── services/
│   │   ├── slack-service.ts         # Slack 通知服务
│   │   └── mongo-service.ts         # MongoDB 服务
│   ├── run-sql.ts                   # 单脚本执行工具
│   ├── run-all-scripts.ts           # 批量执行工具
│   └── types.ts                     # 类型定义
├── package.json                     # 项目配置
├── next.config.js                   # Next.js 配置
└── vercel.json                      # Vercel 部署配置
```

## 🚀 快速开始

### 环境要求

- Node.js >= 18.18.0
- MongoDB 数据库
- PostgreSQL 数据库（目标数据库）
- **🆕 Redis 服务器（可选，用于高性能缓存）**
- npm 或 yarn

### 安装步骤

1. **克隆项目**

   ```bash
   git clone <repository-url>
   cd sql_script_depoly
   ```

2. **安装依赖**

   ```bash
   npm install
   ```

3. **环境配置**

   创建 `.env.local` 文件：

   ```env
   # PostgreSQL 目标数据库
   DATABASE_URL="postgresql://user:password@host:port/database"

   # MongoDB 应用数据库
   MONGODB_URI="mongodb://localhost:27017/sql_script_dashboard"

   # Redis 缓存数据库 (可选)
   REDIS_HOST="localhost"
   REDIS_PORT="6379"
   REDIS_PASSWORD=""
   REDIS_DB="0"

   # Slack 通知 (可选)
   SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

   # Cron Job 安全密钥
   CRON_SECRET="your-secure-random-string"

   # GitHub 仓库信息 (可选)
   NEXT_PUBLIC_GITHUB_REPO="your-org/your-repo"
   ```

4. **启动开发服务器**

   ```bash
   npm run dev
   ```

5. **访问应用**

   打开浏览器访问 `http://localhost:3000`

## 💻 使用指南

### 脚本管理

1. **创建脚本**: 点击"添加新脚本"按钮
2. **🆕 编写 SQL**: 使用增强的代码编辑器，支持语法高亮和格式化
3. **🆕 格式化代码**: 点击工具栏的"格式化"按钮自动整理 SQL 代码
4. **设置元数据**: 填写中英文名称、描述、作者等信息
5. **配置调度**: 可选择启用定时执行并设置 Cron 表达式

### 批量执行监控 (新增)

1. **选择执行模式**: 在手动触发面板选择"批量执行"
2. **选择脚本范围**: 所有脚本 或 仅定时脚本
3. **实时监控**: 全屏进度对话框显示每个脚本的执行状态
4. **状态统计**: 实时查看总计、执行中、等待、成功、关注、失败数量
5. **进度管理**: 支持最小化窗口、取消执行等操作

### Redis 缓存管理 (新增)

1. **健康检查**: 访问 `/api/health/redis` 检查 Redis 状态
2. **缓存清理**: 使用 `/api/maintenance/cleanup` 清理过期数据
3. **降级模式**: Redis 不可用时系统自动使用内存存储
4. **性能监控**: 通过健康检查 API 监控缓存性能

### 执行监控

1. **手动执行**: 在仪表盘选择脚本并点击"运行检查"
2. **查看历史**: 使用改进的历史记录表格查看执行结果
3. **状态筛选**: 使用"全部"、"成功"、"失败"、"需要关注"按钮筛选
4. **详情查看**: 点击"详情"按钮展开查看完整执行信息

### 国际化使用

1. **语言切换**: 点击右上角的语言切换按钮
2. **🆕 完整体验**: 所有界面元素都支持中英文切换
3. **双语输入**: 创建脚本时可同时输入中英文信息

## 🔧 高级配置

### Redis 配置

生产环境 Redis 配置：

```env
# 基础连接
REDIS_HOST="your-redis-host"
REDIS_PORT="6379"
REDIS_PASSWORD="your-redis-password"
REDIS_DB="0"

# 性能调优
REDIS_MAX_RETRIES="3"
REDIS_CONNECT_TIMEOUT="10000"
REDIS_COMMAND_TIMEOUT="5000"
```

### GitHub Actions 自动化

配置文件：`.github/workflows/sql-check-cron.yml`

```yaml
name: SQL Script Cron Job
on:
  schedule:
    - cron: "0 19 * * *" # 每天 UTC 19:00
  workflow_dispatch:
    inputs:
      mode:
        description: "Execution mode"
        required: true
        default: "scheduled"
        type: choice
        options:
          - scheduled
          - all
```

### Vercel 部署配置

`vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/run-scheduled-scripts",
      "schedule": "0 19 * * *"
    }
  ]
}
```

### SSL 数据库连接

生产环境 PostgreSQL 配置：

```env
DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=verify-full&sslrootcert=path/to/ca.pem"
```

或使用证书 URL：

```env
CLIENT_KEY_BLOB_URL="https://storage/client-key.pem"
CLIENT_CERT_BLOB_URL="https://storage/client-cert.pem"
CA_CERT_BLOB_URL="https://storage/ca-cert.pem"
```

## 📊 功能特性详解

### 智能状态管理

系统自动分类执行结果：

- **Success**: 纯成功执行，无需关注
- **Attention Needed**: 执行成功但返回数据，需要人工确认
- **Failure**: 执行失败，需要立即处理

### 高性能批量执行

- 支持并发执行多个脚本
- 实时状态更新和进度追踪
- 智能超时控制和错误处理
- 可中断和恢复的执行流程

### Redis 缓存优势

- **高可用性**: 支持 Redis 集群和主从复制
- **持久化**: 数据持久化到磁盘，防止丢失
- **扩展性**: 支持分布式部署和水平扩展
- **性能**: 亚毫秒级响应时间

### 高性能分页系统

- 支持大量数据的高效分页
- 智能跳转到指定页面
- 过滤和搜索后的动态分页
- 响应式设计，适配各种屏幕尺寸

### 版本信息显示

- 实时显示应用版本号
- 固定位置的版本标识
- 绿色脉动指示器显示系统活跃状态

## 🧪 测试

### 数据库连接测试

```bash
npm run test:db
```

### MongoDB 连接测试

```bash
npm run test:mongodb
```

### Redis 连接测试

```bash
# 通过健康检查API测试
curl http://localhost:3000/api/health/redis
```

### Slack 通知测试

```bash
npm run test:notify
```

### 脚本执行测试

```bash
npm run test:script
```

## 📈 版本历史

### v0.2.0 (当前版本) - 企业级认证系统

- ✅ **Clerk 认证系统集成**
  - 集成 Clerk 企业级认证服务，替换传统用户管理
  - 实现 Restricted 模式，仅支持管理员邀请注册
  - 严格限制 @infi.us 邮箱域名访问，确保系统安全
  - 支持现代化 OAuth、社交登录等多种认证方式
- ✅ **中间件重构与安全增强**
  - 修复中间件认证逻辑，解决 currentUser() 调用问题
  - 实现分层认证架构：中间件基础验证 + 页面级邮箱验证
  - 添加智能路由保护，未授权自动重定向到相应页面
  - 强制动态渲染，避免静态预渲染绕过认证检查
- ✅ **完整的认证页面体系**
  - 创建现代化登录页面 (`/sign-in`) 支持中英文切换
  - 创建现代化注册页面 (`/sign-up`) 支持中英文切换
  - 创建未授权访问页面 (`/unauthorized`) 提供友好的错误提示
  - 统一 UI 风格，响应式设计适配各种设备尺寸
- ✅ **国际化认证体验**
  - 认证相关页面完整支持中英文国际化
  - 动态语言切换，无需刷新页面即可变更界面语言
  - 本地化错误消息和状态提示，提升用户体验
  - 翻译键完整覆盖所有认证流程文本
- ✅ **用户界面现代化**
  - Header 组件支持双语显示 (系统标题、授权状态)
  - 用户信息展示 (姓名、邮箱、头像) 集成 Clerk 组件
  - 新增翻译键管理系统，为新功能提供自动国际化支持
  - 优化 loading 状态和用户反馈体验
- ✅ **环境配置与文档**
  - 创建详细的 Clerk 配置文档 (`docs/CLERK_SETUP.md`)
  - 环境变量配置指南和故障排除手册
  - 从开发到生产环境的完整部署流程
  - 安全最佳实践和配置建议

### v0.1.9

- ✅ **Redis 缓存层架构**
  - 新增 Redis 客户端连接管理 (`src/lib/redis.ts`)
  - 实现批量执行状态缓存服务 (`src/services/batch-execution-cache.ts`)
  - 支持原子性状态更新和智能过期管理
  - 提供降级机制，Redis 不可用时自动使用内存存储

## 🛠️ 开发脚本

```bash
# 开发环境
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run start            # 启动生产服务器
npm run lint             # 代码检查

# SQL 脚本执行
npm run sql:run          # 执行指定脚本
npm run sql:run-all      # 执行所有脚本
npm run sql:run-scheduled # 执行定时脚本

# 测试
npm run test:db          # 测试数据库连接
npm run test:mongodb     # 测试 MongoDB
npm run test:notify      # 测试通知功能
npm run test:script      # 测试脚本执行
```

## 📝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

### 开发规范

- 使用 TypeScript 进行类型安全开发
- 遵循 ESLint 配置的代码规范
- 新增功能需要添加对应的中英文翻译
- 提交前确保 `npm run build` 无错误
- Redis 相关功能需要考虑降级方案

### 翻译贡献

- 翻译文件位于 `src/components/dashboard/types.ts`
- 新增功能需同时添加英文和中文翻译键
- 保持翻译的专业性和用户友好性
- Redis 和缓存相关术语需要统一翻译规范

## 📝 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔮 路线图

### 📋 v0.3.0 计划中 - 高级监控与分析

#### 高级监控

- 性能指标收集和分析
- 告警规则配置和管理
- 集成 Prometheus 和 Grafana

#### API 扩展

- GraphQL API 支持
- Webhook 通知集成
- 第三方系统集成接口

#### 运维增强

- 配置管理中心
- 日志聚合和分析
- 自动化部署和回滚

#### 权限管理增强

- 细粒度权限控制
- 审计日志和操作追踪
- 多租户数据隔离

想要了解更多功能请求或建议，请提交 Issue 或 Pull Request！

---

**感谢使用 SQL 脚本部署与监控系统！** 🚀

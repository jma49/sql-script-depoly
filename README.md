# SQL 脚本部署与监控系统

一个基于 Next.js 构建的系统，用于管理（创建、读取、更新、删除）、执行（手动和定时）和监控 SQL 检查脚本。脚本现在存储在 MongoDB 中，并通过 Web UI 进行管理。系统可以对 PostgreSQL 数据库运行 SQL 查询，保存执行结果，并通过 Slack 发送通知。

## 主要功能

- **脚本管理 (CRUD)**: 通过 Web UI 创建、查看、编辑和删除 SQL 脚本。脚本定义（包括 SQL 内容、元数据等）存储在 MongoDB。
- **SQL 编辑器**: 集成 CodeMirror，在创建/编辑脚本时提供 SQL 语法高亮、自动补全（基础）和主题切换功能。
- **手动脚本执行**: 从 UI 选择存储在 MongoDB 中的脚本并立即触发执行。
- **定时执行**: 通过 Vercel Cron Jobs 实现自动化、可配置的定时脚本执行。
- **结果历史**: 查看过去的执行结果，支持按状态、脚本名称、内容进行搜索和过滤。
- **Slack 通知**: 成功和失败检查的实时提醒。
- **安全限制**: 强制执行的 SQL 脚本为只读 (`SELECT`) 操作，防止数据意外修改。
- **双语支持**: 支持英文和中文界面切换。
- **数据分析入口**: 提供到数据分析页面的占位符链接（具体功能待实现）。

## 系统架构

系统主要由以下部分组成：

1.  **Web 应用 (Next.js)**:
    - **前端 UI**: 使用 React, Tailwind CSS, Shadcn/ui 构建，提供仪表盘、脚本管理页面（创建、查看列表、未来支持编辑/删除）、SQL 编辑器。
    - **后端 API (Next.js API Routes)**:
      - `/api/scripts`: 用于创建新脚本 (POST) 和获取所有脚本列表 (GET)。
      - `/api/scripts/[scriptId]`: 用于获取特定脚本 (GET)、更新脚本 (PUT) 和删除脚本 (DELETE)。
      - `/api/run-check`: 用于手动触发脚本执行。
      - `/api/check-history`: 用于检索执行历史。
      - `/api/run-scheduled-scripts`: (待实现) 由 Vercel Cron Job 调用，用于执行所有计划的脚本。
2.  **核心执行引擎**:
    - `src/lib/script-executor.ts`: 包装器，处理从 API 调用脚本执行的逻辑，包括从 MongoDB 获取脚本内容。
    - `scripts/core/sql-executor.ts`: 包含核心的 `executeSqlScriptFromDb` 函数，负责实际连接 PostgreSQL 并执行 SQL。
3.  **数据存储**:
    - **MongoDB**:
      - `sql_scripts` 集合: 存储用户定义的 SQL 脚本及其元数据。
      - `sql_script_results` 集合: 存储每次脚本执行的历史结果。
    - **PostgreSQL**: 目标数据库，SQL 脚本在此数据库上执行。
4.  **定时调度**:
    - **Vercel Cron Jobs**: 用于配置和触发定时的脚本执行任务，会调用 `/api/run-scheduled-scripts` 端点。
5.  **通知服务**:
    - **Slack Webhook**: 用于发送脚本执行结果的通知。

## 项目结构

```
.
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/
│   │   │   ├── scripts/
│   │   │   │   ├── route.ts               # POST /api/scripts, GET /api/scripts
│   │   │   │   └── [scriptId]/
│   │   │   │       └── route.ts           # GET, PUT, DELETE /api/scripts/[scriptId]
│   │   │   ├── check-history/route.ts   # GET /api/check-history
│   │   │   ├── list-scripts/route.ts    # (已更新) GET /api/list-scripts (从MongoDB获取)
│   │   └── run-check/route.ts       # POST /api/run-check
│   │   ├── scripts/
│   │   │   └── new/
│   │   │       └── page.tsx             # 创建新脚本的前端页面
│   │   ├── data-analysis/
│   │   │   └── page.tsx             # 数据分析占位符页面
│   │   ├── page.tsx                 # 主仪表盘页面
│   │   └── layout.tsx
│   ├── components/
│   │   ├── dashboard/               # 仪表盘UI组件
│   │   ├── scripts/                 # 脚本管理相关UI组件 (如 ScriptMetadataForm, CodeMirrorEditor)
│   │   └── ui/                      # Shadcn/ui 生成的组件
│   └── lib/
│       ├── db.ts                    # PostgreSQL连接逻辑
│       ├── mongodb.ts               # MongoDB连接逻辑
│       └── script-executor.ts       # API调用的脚本执行包装器 (从DB获取脚本)
├── scripts/
│   ├── run-sql.ts               # 命令行手动执行脚本的工具 (从DB获取脚本)
│   └── core/
│       └── sql-executor.ts        # 核心SQL执行逻辑 (executeSqlScriptFromDb)
├── public/                    # 静态资源
├── vercel.json                # (推荐添加) Vercel 配置文件，用于 Cron Jobs
└── .env.local                 # 环境变量
```

## 技术栈

- **框架**: [Next.js](https://nextjs.org/) (App Router)
- **语言**: [TypeScript](https://www.typescriptlang.org/)
- **数据库**:
  - [PostgreSQL](https://www.postgresql.org/) (目标数据库)
  - [MongoDB](https://www.mongodb.com/) (应用数据存储：脚本、结果)
- **UI**: [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Shadcn/ui](https://ui.shadcn.com/)
- **SQL 编辑器**: [@uiw/react-codemirror](https://uiwjs.github.io/react-codemirror/), CodeMirror 6
- **核心脚本执行**: Node.js / ts-node
- **定时任务**: [Vercel Cron Jobs](https://vercel.com/docs/cron-jobs)
- **包管理器**: [npm](https://www.npmjs.com/)
- **通知**: Slack

## 设置与配置

### 环境变量

在项目根目录创建一个 `.env.local` 文件，并根据您的环境配置以下变量：

```ini
# PostgreSQL数据库连接信息
# 用于SQL脚本执行的目标数据库。
# 示例 (本地开发，推荐使用文件证书，确保证书在 'certs/' 目录下):
# DATABASE_URL="postgresql://user:password@host:port/database?sslmode=verify-full&sslrootcert=certs/ca.pem"
# 生产环境请参考下面的 "连接生产环境数据库" 部分。
DATABASE_URL=""

# MongoDB数据库连接信息
# 用于存储脚本定义和执行结果。
# 示例 (本地开发):
# MONGODB_URI="mongodb://localhost:27017/sql_script_dashboard"
# 示例 (MongoDB Atlas):
# MONGODB_URI="mongodb+srv://<username>:<password>@<cluster-url>/sql_script_dashboard?retryWrites=true&w=majority"
MONGODB_URI=""

# Slack Webhook URL (可选)
# 用于发送脚本执行结果通知。
SLACK_WEBHOOK_URL=""

# Vercel Cron Job 安全密钥 (推荐)
# 用于保护 /api/run-scheduled-scripts 端点，确保只有 Vercel Cron 可以调用。
# 设置一个强随机字符串。
CRON_SECRET=""

# GitHub 仓库信息 (用于CheckDetails组件中的GitHub Action链接，如果适用)
# 如果您的执行与GitHub Actions运行相关联，请设置此项以生成正确的链接。
# 否则，可以忽略或移除相关代码。
NEXT_PUBLIC_GITHUB_REPO="your-org/your-repo"
```

**重要**:

- 对于 `DATABASE_URL` 中的证书，如果您在本地开发并使用 `certs/ca.pem`，请确保该文件存在于项目根目录下的 `certs` 文件夹中。
- 请将占位符（如 `user`, `password`, `<username>`, `<cluster-url>` 等）替换为您的实际凭据和信息。
- **切勿将包含敏感凭据的 `.env.local` 文件提交到公共代码仓库。**

### 连接生产环境 PostgreSQL (使用 SSL)

生产环境的 PostgreSQL 数据库通常需要 SSL 加密连接。配置方式与之前类似，主要通过 `DATABASE_URL` 控制。

1.  **获取证书文件或其安全 URL**：
    您需要服务器 CA 证书 (`.ca`)，以及可能的客户端证书 (`.crt`) 和私钥 (`.key`)。

2.  **配置 `DATABASE_URL`**：
    - **通过文件路径** (如果证书文件与应用一起部署)：
      ```
      DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=verify-full&sslrootcert=<path_to_ca_file>&sslcert=<path_to_crt_file>&sslkey=<path_to_key_file>"
      ```
      替换 `<path_to_..._file>` 为实际路径。
    - **通过环境变量下载证书** (推荐用于 Vercel 等平台，`src/lib/db.ts` 中需支持此逻辑)：
      ```
      DATABASE_URL="postgresql://user:pass@host:port/db?sslmode=verify-full"
      CLIENT_KEY_BLOB_URL="https://your-blob-storage/client-key.pem"
      CLIENT_CERT_BLOB_URL="https://your-blob-storage/client-cert.pem"
      CA_CERT_BLOB_URL="https://your-blob-storage/ca-cert.pem"
      ```
      确保 `src/lib/db.ts` 中的连接逻辑能够处理这些环境变量以下载和使用证书。

### 安装与运行

```bash
# 1. 克隆仓库
# git clone ...
# cd sql_script_depoly

# 2. 安装依赖
npm install

# 3. 配置 .env.local 文件 (参照上面的环境变量部分)

# 4. 运行开发服务器 (通常在 http://localhost:3000)
npm run dev

# 5. 构建生产版本
npm run build

# 6. 启动生产服务器
npm run start
```

### 命令行脚本执行

您仍然可以通过命令行手动执行存储在数据库中的特定脚本：

```bash
# 执行指定 ID 的脚本
npm run sql:run <script-id-from-database>
```

例如: `npm run sql:run check-user-activity` (假设 `check-user-activity` 是一个存在于 MongoDB 中的脚本 ID)。
该命令会调用 `scripts/run-sql.ts`。

## SQL 脚本要求 (通过 UI 创建)

SQL 脚本现在通过 Web UI 进行管理和创建。在"创建新脚本"页面 (`/scripts/new`)，您需要提供以下信息：

- **脚本 ID (`scriptId`)**:
  - 必需。脚本的唯一标识符。
  - 格式要求：仅限小写字母、数字和连字符 (`-`)。例如：`check-high-value-orders`。
  - 系统会根据脚本名称自动建议，但您可以修改。一旦保存，ID 通常不应更改，因为它可能被用于调度等。
- **脚本名称 (英文/中文)**:
  - 必需 (至少英文名称)。简短描述性的名称。
- **描述 (英文/中文)**:
  - 可选。对脚本目的、检查逻辑或重要性的更详细说明。
- **范围 (英文/中文)**:
  - 可选。描述脚本操作的数据范围或业务领域。
- **作者**:
  - 必需。脚本创建者的名称或团队名称。
- **SQL 内容**:
  - 必需。实际要对 PostgreSQL 数据库执行的 SQL 查询。
  - **严格要求只读操作**: 脚本的核心功能必须是执行 `SELECT` 查询。
  - **禁止修改数据**: 严禁在脚本中包含任何数据定义语言 (DDL) 如 `CREATE`, `ALTER`, `DROP`，或数据操作语言 (DML) 如 `INSERT`, `UPDATE`, `DELETE` 等命令。系统会尝试阻止此类操作，但脚本本身也应严格遵守此规则。
  - **清晰明确**: 查询应编写清晰，易于理解其目的和预期的输出结果。
  - 使用 CodeMirror 编辑器编写，支持语法高亮。
- **是否启用定时任务 (`isScheduled`)**: (未来功能)
  - 复选框，用于标记此脚本是否应由定时任务执行。
- **Cron 表达式 (`cronSchedule`)**: (未来功能)
  - 如果启用了定时任务，则需要提供一个有效的 Cron 表达式来定义执行计划。

## 添加新的 SQL 脚本 (通过 UI)

1.  导航到应用程序仪表盘。
2.  点击 "[Add New Script]" (或类似) 按钮，这将带您到 `/scripts/new` 页面。
3.  填写表单中的所有必填字段，包括脚本 ID、名称、作者和 SQL 内容。
4.  使用提供的 SQL 编辑器编写或粘贴您的只读 `SELECT` 查询。
5.  点击 "[Save Script]" (或类似) 按钮。
6.  脚本将保存到 MongoDB，并立即可用于手动执行。如果未来实现了调度功能，符合条件的脚本也将按计划执行。

## 关键文件与逻辑说明

- **`src/app/api/scripts/route.ts` & `src/app/api/scripts/[scriptId]/route.ts`**: 后端 API 端点，处理脚本的 CRUD 操作，与 MongoDB 交互。
- **`src/app/scripts/new/page.tsx`**: 前端页面，用于创建新脚本，包含元数据表单和 CodeMirror SQL 编辑器。
- **`src/components/scripts/ScriptMetadataForm.tsx`**: 用于输入脚本元数据的表单组件。
- **`src/components/scripts/CodeMirrorEditor.tsx`**: CodeMirror SQL 编辑器组件。
- **`src/lib/script-executor.ts`**: 处理 API 调用的脚本执行请求，从 MongoDB 获取脚本的 `sqlContent`，然后调用核心执行逻辑。
- **`scripts/core/sql-executor.ts`**: 包含 `executeSqlScriptFromDb` 函数，负责连接 PostgreSQL 并实际执行传入的 SQL 字符串。
- **`scripts/run-sql.ts`**: 命令行工具，用于手动触发存储在 MongoDB 中的特定脚本的执行。
- **`src/lib/mongodb.ts`**: MongoDB 客户端和连接管理。
- **`src/lib/db.ts`**: PostgreSQL 数据库连接管理。

## 部署 (Vercel)

该应用设计为可以轻松部署到 [Vercel](https://vercel.com/)。

### 1. Vercel 项目设置

- 将您的代码仓库连接到 Vercel。
- 在 Vercel 项目设置中配置环境变量 (见上面的 `.env.local` 部分)。确保 `MONGODB_URI`, `DATABASE_URL`, `SLACK_WEBHOOK_URL`, 和 `CRON_SECRET` 都已正确设置。

### 2. 配置 Vercel Cron Jobs

Vercel Cron Jobs 用于定时执行任务。我们将配置一个 Cron Job 来定期调用 `/api/run-scheduled-scripts` 端点 (该端点需要您去实现，用于获取并执行所有标记为计划任务的脚本)。

在您的项目根目录下创建一个 `vercel.json` 文件，内容如下：

```json
{
  "crons": [
    {
      "path": "/api/run-scheduled-scripts",
      "schedule": "0 5 * * *" // 示例：每天 UTC 时间早上 5 点执行
    }
  ]
}
```

- **`path`**: 要调用的 API 端点的路径。您需要确保 `/api/run-scheduled-scripts` 端点：
  1.  在被调用时，首先验证请求头中的 `Authorization` bearer token 是否与您在 Vercel 环境变量中设置的 `CRON_SECRET` 匹配 (例如: `Authorization: Bearer YOUR_CRON_SECRET`)。
  2.  从 MongoDB 查询所有 `isScheduled: true` 且具有有效 `cronSchedule` 的脚本。
  3.  对于每个符合条件的脚本，（如果需要，可以解析其 `cronSchedule` 以确定当前是否应该运行，或者更简单地，只要 Cron Job 触发就执行所有标记的脚本），然后调用 `script-executor.ts` 中的逻辑来执行它们。
- **`schedule`**: Cron 表达式，定义任务的执行频率。上面的示例 (`0 5 * * *`) 表示每天 UTC 时间早上 5 点执行。您可以根据需要调整。查阅 [crontab.guru](https://crontab.guru/) 来帮助生成 Cron 表达式。

**保护 Cron Job 端点**:
在您的 `/api/run-scheduled-scripts/route.ts` 文件中，务必添加安全检查，以确保只有 Vercel Cron Job 可以触发它：

```typescript
// src/app/api/run-scheduled-scripts/route.ts (示例逻辑)
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authToken = (request.headers.get("authorization") || "")
    .split("Bearer ")
    .at(1);

  if (process.env.CRON_SECRET && authToken !== process.env.CRON_SECRET) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // TODO: 在此处实现获取并执行计划脚本的逻辑
  // 1. 连接 MongoDB
  // 2. 查询所有 isScheduled: true 的脚本
  // 3. 遍历脚本并执行 (调用 script-executor 中的函数)
  // 4. 记录结果，可能发送汇总通知

  console.log("Scheduled scripts job triggered at:", new Date().toISOString());
  // 示例响应
  return NextResponse.json({ message: "Scheduled script execution started." });
}
```

### 3. 触发部署

提交 `vercel.json` 文件并推送到您的 Git 仓库，Vercel 将自动部署新配置，包括 Cron Jobs。您可以在 Vercel 项目的 "Cron Jobs" 部分监控其状态。

## 未来工作与待办事项

- **前端调度设置 UI**: 在创建/编辑脚本页面，允许用户通过 UI 设置 `isScheduled` 和 `cronSchedule` 字段。 - 5/14 已实现
- **实现 `/api/run-scheduled-scripts`**: 完成该 API. 端点的逻辑，使其能够正确获取和执行所有计划的脚本。 - 5/14 已实现.
- **数据分析页面**: 实现 `/data-analysis` 页面的具体图表和数据展示功能。 - 5/14 添加新的UI界面和占位符，需要清洗掉测试数据来展示.
- **更完善的错误处理和日志记录**: 在整个应用中增强错误处理和日志记录。
- **测试**: 添加更全面的单元测试和端到端测试。

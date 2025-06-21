# 组件结构说明

本项目采用了清晰的组件分层架构，便于维护和理解。

## 📁 目录结构

```
src/components/
├── common/          # 通用组件
├── layout/          # 布局组件
├── error/           # 错误处理组件
├── business/        # 业务逻辑组件
└── ui/              # 基础UI组件
```

## 🧩 组件分类

### Common 通用组件

- **LanguageProvider.tsx** - 多语言提供者
- **ClientLayoutWrapper.tsx** - 客户端布局包装器

### Layout 布局组件

- **Dashboard.tsx** - 主仪表板组件
- **UserHeader.tsx** - 用户头部导航

### Error 错误处理组件

- **ErrorBoundary.tsx** - React 错误边界
- **CSSErrorHandler.tsx** - CSS 错误处理器
- **GlobalErrorHandlerProvider.tsx** - 全局错误处理提供者

### Business 业务逻辑组件

- **ai/** - AI 相关功能组件
  - AIAssistantPanel.tsx
  - AnalysisResultDialog.tsx
- **dashboard/** - 仪表板业务组件

  - types.ts - 类型定义
  - StatsCards.tsx - 统计卡片
  - ManualTrigger.tsx - 手动触发器
  - CheckHistory.tsx - 检查历史
  - [更多组件...]

- **scripts/** - 脚本管理组件
  - CodeMirrorEditor.tsx - 代码编辑器
  - ScriptMetadataForm.tsx - 脚本元数据表单
  - EditHistoryDialog.tsx - 编辑历史对话框
  - [更多组件...]

### UI 基础 UI 组件

- 基于 shadcn/ui 的可复用 UI 组件
- 表单控件、按钮、对话框等

## 🔗 导入路径

使用以下路径模式导入组件：

```typescript
// 通用组件
import { LanguageProvider } from "@/components/common/LanguageProvider";

// 布局组件
import Dashboard from "@/components/layout/Dashboard";
import UserHeader from "@/components/layout/UserHeader";

// 错误处理组件
import { ErrorBoundary } from "@/components/error/ErrorBoundary";

// 业务组件
import { StatsCards } from "@/components/business/dashboard/StatsCards";
import CodeMirrorEditor from "@/components/business/scripts/CodeMirrorEditor";
import AIAssistantPanel from "@/components/business/ai/AIAssistantPanel";

// UI 组件
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
```

## 🎯 设计原则

### 1. 职责分离

- 每个目录有明确的职责范围
- 避免组件间的紧耦合

### 2. 可维护性

- 类似功能的组件分组管理
- 便于查找和修改

### 3. 可扩展性

- 新功能可以轻松添加到对应分类
- 支持团队协作开发

### 4. 一致性

- 统一的导入路径约定
- 清晰的命名规范

## 📝 添加新组件

### 通用组件

适用于多个页面或功能模块的组件，如提供者、包装器等。

### 布局组件

页面级别的布局和导航组件。

### 错误处理组件

处理应用错误和异常状态的组件。

### 业务组件

特定功能领域的组件：

- `ai/` - AI 和智能分析相关
- `dashboard/` - 仪表板和监控相关
- `scripts/` - 脚本管理相关

### UI 组件

可复用的基础界面组件，应该保持无状态和通用性。

## 🔄 迁移说明

从旧结构迁移时，所有导入路径已自动更新。如果发现任何遗漏的导入，请按照新的路径规范进行调整。

## 🤝 最佳实践

1. **组件放置**：根据组件的主要用途选择合适的目录
2. **依赖管理**：避免跨业务领域的直接依赖
3. **类型定义**：业务相关的类型定义放在对应的业务组件目录中
4. **文档更新**：添加新组件时更新相关文档

---

_此结构设计旨在提高代码的可维护性和团队开发效率。_

# AI 辅助功能使用说明

## 概述

本项目已集成基于 Google Gemini 的 AI 辅助功能，为 SQL 脚本开发和调试提供智能支持。

## 功能特性

### 1. AI 生成 SQL

- **位置**: 脚本编辑器下方的紫色区域
- **功能**: 根据自然语言描述生成相应的 SQL 语句
- **使用方法**:
  1. 在输入框中描述你的需求，例如："查询所有用户的订单信息"
  2. 点击"生成 SQL"按钮或按回车键
  3. AI 将生成的 SQL 自动插入到编辑器中

### 2. AI 解释 SQL

- **位置**: 脚本编辑器下方的绿色区域
- **功能**: 详细解释当前编辑器中的 SQL 语句
- **使用方法**:
  1. 在编辑器中输入或粘贴 SQL 语句
  2. 点击"解释 SQL"按钮
  3. 在弹窗中查看详细的解释结果

### 3. AI 优化建议

- **位置**: 脚本编辑器下方的绿色区域
- **功能**: 分析 SQL 语句并提供性能优化建议
- **使用方法**:
  1. 在编辑器中输入或粘贴 SQL 语句
  2. 点击"优化建议"按钮
  3. 在弹窗中查看优化建议和改进后的 SQL

### 4. AI 错误分析

- **位置**: 执行结果页面的状态卡片中（仅在失败状态下显示）
- **功能**: 分析 SQL 执行错误原因并提供修复建议
- **使用方法**:
  1. 当脚本执行失败时，访问执行结果详情页
  2. 点击状态卡片中的"AI 分析错误"按钮
  3. 在弹窗中查看错误分析和修复建议

## 环境配置

### 1. 获取 Gemini API Key

1. 访问 [Google AI Studio](https://makersuite.google.com/app/apikey)
2. 创建新的 API Key
3. 复制生成的 API Key

### 2. 配置环境变量

在项目根目录的 `.env.local` 文件中添加：

```
GEMINI_API_KEY=your_gemini_api_key_here
```

## 技术实现

### 后端 API 路由

- `/api/ai/generate-sql` - SQL 生成
- `/api/ai/analyze-sql` - SQL 分析（解释和优化）
- `/api/ai/analyze-error` - 错误分析

### 数据库缓存

- 使用 Redis 缓存数据库表结构信息
- 缓存过期时间：1 小时
- 缓存键：`db_schema_cache`

### 前端组件

- `CodeMirrorEditor` - 集成了 AI 生成和分析功能
- 执行结果页面 - 集成了错误分析功能
- 使用 React Markdown 渲染 AI 分析结果

## 注意事项

1. **API 配额**: 免费版 Gemini API 有使用限制，系统已配置重试机制和错误处理
2. **模型选择**: 系统使用 `gemini-1.5-flash` 模型以获得更高的配额限制
3. **数据安全**: AI 分析时会发送数据库结构信息，确保在安全环境中使用
4. **网络依赖**: AI 功能需要网络连接到 Google 服务
5. **响应时间**: AI 分析可能需要几秒钟的响应时间，配额不足时会自动重试

## 故障排除

### 常见问题

1. **API 配额限制**

   - 错误提示: "AI 服务当前繁忙，请稍后重试"
   - 原因: 超过了 Gemini API 免费层配额限制
   - 解决方法: 等待一段时间后重试，系统会自动进行重试

2. **AI 功能无响应**

   - 检查 `GEMINI_API_KEY` 是否正确配置
   - 确认网络连接正常
   - 查看浏览器开发者工具的网络请求

3. **生成的 SQL 不准确**

   - 提供更详细和准确的描述
   - 检查数据库表结构是否已正确缓存
   - 多尝试几次不同的描述方式

4. **错误分析不够详细**
   - 确保错误信息完整
   - 重试分析请求
   - 手动检查数据库连接和权限

### 开发调试

1. 查看服务端日志获取详细错误信息
2. 检查 Redis 缓存状态
3. 验证数据库连接是否正常

## 未来计划

- 支持更多 AI 模型选择
- 添加 SQL 历史记录的智能分析
- 实现自定义 Prompt 模板
- 增加批量 SQL 优化功能

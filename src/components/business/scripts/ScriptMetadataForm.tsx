import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { HashtagInput } from "@/components/ui/hashtag-input";
import { ScheduleSelector } from "@/components/ui/schedule-selector";
import { DashboardTranslationKeys } from "@/components/business/dashboard/types"; // For t function type
import {
  Clock,
  User,
  Hash,
  Globe,
  Calendar,
  Settings,
  Languages,
} from "lucide-react"; // 新增：导入 Clock 图标

// Define the shape of the script metadata
export interface ScriptFormData {
  scriptId: string;
  name: string;
  cnName: string;
  description: string;
  cnDescription: string;
  author: string;
  scope: string;
  cnScope: string;
  hashtags: string[];  // 新增：hashtag数组
  isScheduled: boolean;
  cronSchedule: string;
  // sqlContent will be handled separately by the CodeMirror editor
}

interface ScriptMetadataFormProps {
  formData: ScriptFormData;
  onFormChange: (
    fieldName: keyof ScriptFormData,
    value: string | boolean | string[], // 支持字符串数组
  ) => void;
  t: (key: DashboardTranslationKeys | string) => string; // Allow string for new keys initially
  isEditMode?: boolean; // To disable scriptId field in edit mode
}

export const ScriptMetadataForm: React.FC<ScriptMetadataFormProps> = ({
  formData,
  onFormChange,
  t,
  isEditMode = false,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    onFormChange(e.target.name as keyof ScriptFormData, e.target.value);
  };

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      onFormChange("isScheduled", checked);
    }
  };

  const handleHashtagsChange = (hashtags: string[]) => {
    onFormChange("hashtags", hashtags);
  };

  return (
    <div className="space-y-6">
      {/* 基本信息卡片 */}
      <Card className="group relative overflow-hidden border-2 border-border/20 bg-gradient-to-br from-card via-card to-card/90 shadow-lg hover:shadow-xl transition-all duration-500 hover:border-border/40">
        {/* 装饰性背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-primary/5 opacity-50 group-hover:opacity-70 transition-opacity duration-500" />

        <CardHeader className="relative px-6 py-5 border-b border-border/30 bg-gradient-to-r from-muted/20 to-muted/10">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 ring-2 ring-primary/20 group-hover:ring-primary/30 transition-all duration-300">
              <Settings className="h-6 w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
                {t("scriptMetadataTitle") || "Script Metadata"}
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-700"
                >
                  {isEditMode ? t("editModeLabel") : t("newModeLabel")}
                </Badge>
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                {t("scriptMetadataDesc") || "提供SQL脚本的详细信息和配置"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative p-6 space-y-8">
          {/* 基础标识信息 */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Hash className="h-4 w-4 text-primary" />
              {t("basicIdentityInfo")}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Script ID */}
              <div className="space-y-3">
                <Label
                  htmlFor="scriptId"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                  {t("fieldScriptId") || "Script ID"}
                  <span className="text-destructive">*</span>
                  {isEditMode && (
                    <Badge variant="secondary" className="text-xs">
                      {t("readOnlyField")}
                    </Badge>
                  )}
                </Label>
                <Input
                  id="scriptId"
                  name="scriptId"
                  value={formData.scriptId}
                  onChange={handleChange}
                  placeholder={
                    t("scriptIdPlaceholder") || "e.g., check-user-activity"
                  }
                  required
                  disabled={isEditMode}
                  className={`transition-all duration-200 ${
                    isEditMode
                      ? "bg-muted/50 border-muted cursor-not-allowed"
                      : "focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                  }`}
                />
              </div>

              {/* Author */}
              <div className="space-y-3">
                <Label
                  htmlFor="author"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  {t("fieldScriptAuthor") || "Author"}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="author"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  placeholder="e.g., Jane Doe"
                  className="focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Hashtags */}
            <div className="col-span-full">
              <HashtagInput
                hashtags={formData.hashtags || []}
                onHashtagsChange={handleHashtagsChange}
                label={t("hashtagsLabel") || "标签"}
                placeholder={t("hashtagPlaceholder") || "输入标签..."}
                helperText={t("hashtagsHelp") || "输入多个标签，用逗号分隔"}
                maxTags={8}
                className="w-full"
              />
            </div>
          </div>

          {/* 多语言信息 */}
          <div className="space-y-6 pt-6 border-t border-border/30">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Languages className="h-4 w-4 text-primary" />
              {t("multiLanguageInfo")}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* 英文信息 */}
              <div className="space-y-6 p-4 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg border border-blue-200/60 dark:border-blue-800/60">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="font-semibold text-sm text-blue-700 dark:text-blue-300">
                    {t("englishSection")}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      {t("fieldScriptNameEn") || "Name (EN)"}
                      <span className="text-destructive ml-1">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Check User Activity"
                      required
                      className="focus:ring-2 focus:ring-blue-200 focus:border-blue-400 dark:focus:ring-blue-800 dark:focus:border-blue-600 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="scope" className="text-sm font-medium">
                      {t("fieldScriptScopeEn") || "Scope (EN)"}
                    </Label>
                    <Input
                      id="scope"
                      name="scope"
                      value={formData.scope}
                      onChange={handleChange}
                      placeholder="e.g., User Management, Orders"
                      className="focus:ring-2 focus:ring-blue-200 focus:border-blue-400 dark:focus:ring-blue-800 dark:focus:border-blue-600 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      {t("fieldScriptDescriptionEn") || "Description (EN)"}
                    </Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Briefly describe what this script does."
                      rows={3}
                      className="focus:ring-2 focus:ring-blue-200 focus:border-blue-400 dark:focus:ring-blue-800 dark:focus:border-blue-600 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 中文信息 */}
              <div className="space-y-6 p-4 bg-gradient-to-br from-emerald-50/50 to-teal-50/50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-lg border border-emerald-200/60 dark:border-emerald-800/60">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="font-semibold text-sm text-emerald-700 dark:text-emerald-300">
                    {t("chineseSection")}
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cnName" className="text-sm font-medium">
                      {t("fieldScriptNameCn") || "Name (CN)"}
                    </Label>
                    <Input
                      id="cnName"
                      name="cnName"
                      value={formData.cnName}
                      onChange={handleChange}
                      placeholder="例如, 检查用户活跃度"
                      className="focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 dark:focus:ring-emerald-800 dark:focus:border-emerald-600 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnScope" className="text-sm font-medium">
                      {t("fieldScriptScopeCn") || "Scope (CN)"}
                    </Label>
                    <Input
                      id="cnScope"
                      name="cnScope"
                      value={formData.cnScope}
                      onChange={handleChange}
                      placeholder="例如, 用户管理, 订单"
                      className="focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 dark:focus:ring-emerald-800 dark:focus:border-emerald-600 transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="cnDescription"
                      className="text-sm font-medium"
                    >
                      {t("fieldScriptDescriptionCn") || "Description (CN)"}
                    </Label>
                    <Textarea
                      id="cnDescription"
                      name="cnDescription"
                      value={formData.cnDescription}
                      onChange={handleChange}
                      placeholder="简要描述此脚本的功能。"
                      rows={3}
                      className="focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 dark:focus:ring-emerald-800 dark:focus:border-emerald-600 transition-all duration-200 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 调度配置 */}
          <div className="space-y-6 pt-6 border-t border-border/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                <Calendar className="h-4 w-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {t("scheduleConfig") || "定时任务配置"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  设置脚本的自动执行时间
                </p>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-xl border border-violet-200/60 dark:border-violet-800/60">
              <div className="space-y-6">
                {/* 启用定时任务切换 */}
                <div className="flex items-start gap-4 p-4 rounded-lg bg-background/60 border border-border/40 hover:bg-background/80 transition-all duration-200">
                  <Checkbox
                    id="isScheduled"
                    name="isScheduled"
                    checked={formData.isScheduled}
                    onCheckedChange={handleCheckboxChange}
                    aria-label={t("fieldIsScheduled") || "Enable Schedule"}
                    className="data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600 mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <Label
                      htmlFor="isScheduled"
                      className="font-medium flex items-center gap-2 cursor-pointer text-base"
                    >
                      <Clock className="h-4 w-4 text-violet-600 dark:text-violet-400" />
                      {t("fieldIsScheduled") || "启用定时执行"}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t("scheduleEnabledDesc") || "启用后，脚本将按照指定的时间表自动执行"}
                    </p>
                  </div>
                </div>

                {/* 定时任务配置 */}
                {formData.isScheduled && (
                  <div className="space-y-4 animate-in slide-in-from-top-5 duration-300">
                    <div className="h-px bg-gradient-to-r from-transparent via-violet-200 to-transparent dark:via-violet-800" />
                    <ScheduleSelector
                      value={formData.cronSchedule}
                      onChange={(cronExpression) => onFormChange("cronSchedule", cronExpression)}
                      language="zh"
                      required={formData.isScheduled}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

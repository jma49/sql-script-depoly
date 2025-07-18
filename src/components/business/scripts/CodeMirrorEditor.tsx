import React, { useState, useEffect } from "react";
import ReactCodeMirror, { ReactCodeMirrorProps } from "@uiw/react-codemirror";
import { sql, PostgreSQL, SQLDialect } from "@codemirror/lang-sql";
import { okaidia } from "@uiw/codemirror-theme-okaidia";
import { githubLight } from "@uiw/codemirror-theme-github";
import { dracula } from "@uiw/codemirror-theme-dracula";
import { nord } from "@uiw/codemirror-theme-nord";
import { materialLight, materialDark } from "@uiw/codemirror-theme-material";
import { eclipse } from "@uiw/codemirror-theme-eclipse";
import { tokyoNight } from "@uiw/codemirror-theme-tokyo-night";
import { solarizedLight, solarizedDark } from "@uiw/codemirror-theme-solarized";
import { useTheme } from "next-themes";
// import { format } from 'sql-formatter';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Code, Sparkles, Eye, FileCode } from "lucide-react";
import { toast } from "sonner";
import { DashboardTranslationKeys } from "../dashboard/types";
import EditorThemeSettings from "./EditorThemeSettings";
import AIAssistantPanel from "@/components/business/ai/AIAssistantPanel";
import AnalysisResultDialog from "@/components/business/ai/AnalysisResultDialog";

interface CodeMirrorEditorProps
  extends Omit<
    ReactCodeMirrorProps,
    "value" | "onChange" | "extensions" | "theme"
  > {
  value: string;
  onChange: (value: string) => void;
  minHeight?: string;
  t?: (key: DashboardTranslationKeys | string) => string;
}

// 主题映射表 - 包含所有可用的主题
const THEME_MAP = {
  // 浅色主题
  eclipse: eclipse,
  githubLight: githubLight,
  materialLight: materialLight,
  nord: nord,
  solarizedLight: solarizedLight,

  // 暗色主题
  tokyoNight: tokyoNight,
  okaidia: okaidia,
  dracula: dracula,
  materialDark: materialDark,
  solarizedDark: solarizedDark,
};

const CodeMirrorEditor: React.FC<CodeMirrorEditorProps> = ({
  value,
  onChange,
  minHeight = "300px",
  t = (key) => key.toString(),
  ...rest
}) => {
  const { theme: systemTheme } = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
  const [editorTheme, setEditorTheme] = useState<string>("eclipse");

  // AI功能相关状态
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<'explain' | 'optimize'>('explain');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);

  // 获取当前应用的编辑器主题
  const getCurrentEditorTheme = React.useMemo(() => {
    // 根据主题名称获取主题对象
    const themeObj = THEME_MAP[editorTheme as keyof typeof THEME_MAP];

    if (themeObj) {
      return themeObj;
    }

    // 如果主题不存在，根据系统主题返回默认主题
    return systemTheme === "dark" ? tokyoNight : eclipse;
  }, [editorTheme, systemTheme]);

  // 从localStorage读取编辑器主题设置
  useEffect(() => {
    const savedTheme = localStorage.getItem("editor-theme");

    if (savedTheme && THEME_MAP[savedTheme as keyof typeof THEME_MAP]) {
      setEditorTheme(savedTheme);
    } else {
      // 如果没有保存的主题或主题不存在，使用默认主题
      const defaultTheme = systemTheme === "dark" ? "tokyoNight" : "eclipse";
      setEditorTheme(defaultTheme);
      localStorage.setItem("editor-theme", defaultTheme);
    }
  }, [systemTheme]);

  // 监听主题变更事件
  useEffect(() => {
    const handleThemeChange = (event: CustomEvent) => {
      const newTheme = event.detail.theme;
      if (THEME_MAP[newTheme as keyof typeof THEME_MAP]) {
        setEditorTheme(newTheme);
      }
    };

    window.addEventListener('editorThemeChange', handleThemeChange as EventListener);

    return () => {
      window.removeEventListener('editorThemeChange', handleThemeChange as EventListener);
    };
  }, []);

  // 创建支持PostgreSQL的扩展，包括对dollar-quoted字符串的更好支持
  const postgresExtensions = React.useMemo(() => {
    // 创建自定义PostgreSQL方言，禁用$$的字符串处理以改善DO块语法高亮
    const customPostgres = SQLDialect.define({
      ...PostgreSQL.spec,
      doubleDollarQuotedStrings: false, // 禁用$$字符串处理以改善DO块语法高亮
    });

    const postgresConfig = {
      dialect: customPostgres,
      upperCaseKeywords: false,
      schema: {
        // 添加一些常见的PostgreSQL函数和关键字以改善自动完成
        pg_catalog: [
          "now",
          "current_timestamp",
          "current_date",
          "current_time",
        ],
        functions: [
          "declare",
          "begin",
          "end",
          "loop",
          "if",
          "then",
          "else",
          "elsif",
          "raise",
          "notice",
        ],
      },
    };

    return [sql(postgresConfig)];
  }, []);

  const handleFormat = async () => {
    if (!value.trim()) {
      toast.warning(t("noCodeToFormat") || "没有代码需要格式化");
      return;
    }

    setIsFormatting(true);
    try {
      console.log("开始SQL格式化...");

      // 基础清理
      const cleanedValue = value
        .replace(/\r\n/g, '\n')  // 统一换行符
        .replace(/\t/g, '  ')    // 将tab转换为空格
        .trim();

      let formatted = cleanedValue;

      try {
        // 尝试使用sql-formatter进行专业格式化
        const { format } = await import("sql-formatter");

        formatted = format(cleanedValue, {
          language: "postgresql",
          keywordCase: "upper",
          dataTypeCase: "upper",
          functionCase: "upper",
          identifierCase: "preserve",
          indentStyle: "standard",
          tabWidth: 2,
          useTabs: false,
          logicalOperatorNewline: "before",
          expressionWidth: 60,
          linesBetweenQueries: 1,
          denseOperators: false,
          newlineBeforeSemicolon: false,
        });

        console.log("sql-formatter格式化成功");

      } catch (formatterError) {
        console.warn("sql-formatter失败，使用基础格式化:", formatterError);

        // 基础格式化作为fallback - 修复逻辑
        const lines = cleanedValue.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        // 合并所有行为一个字符串
        let singleLine = lines.join(' ');

        // 压缩多余空格
        singleLine = singleLine.replace(/\s+/g, ' ').trim();

        // 在关键字前添加换行
        const keywords = ['SELECT', 'FROM', 'WHERE', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ORDER BY', 'GROUP BY', 'HAVING', 'WITH', 'UNION', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'ALTER', 'DROP', 'LIMIT'];
        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
          singleLine = singleLine.replace(regex, `\n${keyword}`);
        });

        // 在AND/OR前添加换行并缩进
        singleLine = singleLine.replace(/\b(AND|OR)\b/gi, '\n  $1');

        // 在逗号后添加换行和缩进（仅在SELECT子句中）
        const selectRegex = /(SELECT[^FROM]*)/gi;
        singleLine = singleLine.replace(selectRegex, (match) => {
          return match.replace(/,\s*/g, ',\n  ');
        });

        // 在分号后添加空行
        singleLine = singleLine.replace(/;\s*/g, ';\n\n');

        // 清理格式：移除开头的换行，清理多余空行
        formatted = singleLine
          .split('\n')
          .map(line => line.trim())
          .filter((line, index, array) => {
            // 保留非空行，或者前后都有内容的空行
            return line.length > 0 || (index > 0 && index < array.length - 1 && array[index - 1].length > 0 && array[index + 1].length > 0);
          })
          .join('\n')
          .replace(/\n\s*\n\s*\n+/g, '\n\n') // 最多保留一个空行
          .trim();
      }

      // 应用格式化结果
      onChange(formatted);

      // 成功提示
      toast.success("格式化成功", {
        description: "SQL代码已格式化",
        duration: 3000,
      });

    } catch (error) {
      console.error("格式化过程出错:", error);
      toast.error("格式化失败", {
        description: error instanceof Error ? error.message : "未知错误",
        duration: 5000,
      });
    } finally {
      setIsFormatting(false);
    }
  };

  const getLineCount = (text: string) => text.split("\n").length;
  const getCharCount = (text: string) => text.length;

  // AI生成SQL函数
  const handleGenerateSql = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.warning("请输入SQL生成描述");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI生成SQL失败');
      }

      const data = await response.json();

      if (data.success && data.sql) {
        onChange(data.sql);
        toast.success("AI已成功生成SQL语句", {
          description: "SQL已插入到编辑器中",
          duration: 3000,
        });
      } else {
        throw new Error('AI返回数据格式错误');
      }
    } catch (error) {
      console.error('AI生成SQL错误:', error);
      toast.error("AI生成SQL失败", {
        description: error instanceof Error ? error.message : '未知错误',
        duration: 5000,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // AI分析SQL函数
  const handleAnalyzeSql = async (type: 'explain' | 'optimize') => {
    if (!value.trim()) {
      toast.warning("请先输入SQL语句");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisType(type);
    try {
      const response = await fetch('/api/ai/analyze-sql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sql: value,
          analysisType: type
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI分析SQL失败');
      }

      const data = await response.json();

      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
        setIsAnalysisDialogOpen(true);
        toast.success(type === 'explain' ? "AI解释已生成" : "AI优化建议已生成", {
          description: "点击查看详细分析结果",
          duration: 3000,
        });
      } else {
        throw new Error('AI返回数据格式错误');
      }
    } catch (error) {
      console.error('AI分析SQL错误:', error);
      toast.error("AI分析SQL失败", {
        description: error instanceof Error ? error.message : '未知错误',
        duration: 5000,
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* 编辑器工具栏 */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/40 to-muted/20 rounded-lg border border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 ring-2 ring-primary/20 shadow-sm">
              <FileCode className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">
                {t("sqlEditorTitle")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("sqlEditorDescription")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* 代码统计 */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-background/60 border border-border/40">
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-700"
            >
              {getLineCount(value)} {t("codeStatisticsLines")}
            </Badge>
            <Badge
              variant="outline"
              className="text-xs bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-700"
            >
              {getCharCount(value)} {t("codeStatisticsChars")}
            </Badge>
          </div>

          {/* 预览切换 */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8 px-3 text-xs"
          >
            {showPreview ? (
              <>
                <Code className="h-3.5 w-3.5 mr-1.5" />
                {t("editMode")}
              </>
            ) : (
              <>
                <Eye className="h-3.5 w-3.5 mr-1.5" />
                {t("previewMode")}
              </>
            )}
          </Button>

          {/* 格式化按钮 */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleFormat}
            disabled={isFormatting || !value.trim()}
            className="h-8 px-3 text-xs shadow-sm transition-all duration-200 hover:shadow-md hover:bg-primary/10 hover:border-primary/50 hover:text-primary focus:ring-2 focus:ring-primary/20"
          >
            {isFormatting ? (
              <>
                <div className="animate-spin h-3.5 w-3.5 mr-1.5 border-2 border-current border-t-transparent rounded-full" />
                {t("formatting")}
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                {t("formatCode")}
              </>
            )}
          </Button>

          {/* 主题设置按钮 */}
          <EditorThemeSettings t={t} />
        </div>
      </div>

      {/* 编辑器容器 */}
      <div className="relative overflow-hidden rounded-lg border-2 border-border/40 bg-gradient-to-br from-background via-background to-muted/5 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-border/60">
        {/* 装饰性顶部条 */}
        <div className="h-1 bg-gradient-to-r from-primary/60 via-primary/40 to-primary/60"></div>

        {showPreview ? (
          // 预览模式
          <div className="p-6 bg-gradient-to-br from-muted/10 to-muted/5">
            <div className="flex items-center gap-2 mb-4">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">
                {t("sqlPreviewLabel")}
              </span>
            </div>
            <pre className="whitespace-pre-wrap text-sm font-mono bg-background/80 border border-border/40 rounded-md p-4 max-h-96 overflow-auto">
              {value || (
                <span className="italic text-muted-foreground">
                  {t("noCodeContent")}
                </span>
              )}
            </pre>
          </div>
        ) : (
          // 编辑模式
          <div className="relative">
            <ReactCodeMirror
              value={value}
              onChange={onChange}
              extensions={postgresExtensions}
              theme={getCurrentEditorTheme}
              height="auto"
              minHeight={minHeight}
              basicSetup={{
                lineNumbers: true,
                foldGutter: true,
                highlightActiveLineGutter: true,
                highlightSpecialChars: true,
                history: true,
                drawSelection: true,
                dropCursor: true,
                allowMultipleSelections: true,
                indentOnInput: true,
                syntaxHighlighting: true,
                autocompletion: true,
                bracketMatching: true,
                closeBrackets: true,
                highlightActiveLine: true,
                searchKeymap: true,
              }}
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "var(--editor-font-family, 'Fira Code', monospace)",
                fontSize: "var(--editor-font-size, 14px)",
              }}
              placeholder={t("sqlPlaceholder")}
              {...rest}
            />

            {/* 编辑器状态指示器 */}
            <div className="absolute bottom-2 right-2">
              <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-background/90 backdrop-blur-sm border border-border/40 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-muted-foreground font-mono">
                  {t("editorStatusReady")}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* AI智能助手面板 */}
      <AIAssistantPanel
        value={value}
        onAnalyze={handleAnalyzeSql}
        onGenerate={handleGenerateSql}
        isGenerating={isGenerating}
        isAnalyzing={isAnalyzing}
      />

      {/* AI分析结果弹窗 */}
      <AnalysisResultDialog
        isOpen={isAnalysisDialogOpen}
        onOpenChange={setIsAnalysisDialogOpen}
        result={analysisResult}
        type={analysisType}
      />

    </div>
  );
};

export default CodeMirrorEditor;

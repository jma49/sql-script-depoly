/** @jsxImportSource react */
import React from 'react';
import { Database, List, Loader2, Play, Calendar, User, Book, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DashboardTranslationKeys, ScriptInfo } from './types';
import { formatDate } from './utils';

interface ManualTriggerProps {
  availableScripts: ScriptInfo[];
  selectedScriptId: string;
  selectedScript: ScriptInfo | undefined;
  isTriggering: boolean;
  isFetchingScripts: boolean;
  loading: boolean;
  triggerMessage: string | null;
  triggerMessageType: 'success' | 'error' | null;
  language: string;
  t: (key: DashboardTranslationKeys) => string;
  setSelectedScriptId: (id: string) => void;
  handleTriggerCheck: () => void;
}

export const ManualTrigger: React.FC<ManualTriggerProps> = ({
  availableScripts,
  selectedScriptId,
  selectedScript,
  isTriggering,
  isFetchingScripts,
  loading,
  triggerMessage,
  triggerMessageType,
  language,
  t,
  setSelectedScriptId,
  handleTriggerCheck
}) => {
  // 当选中的脚本变化时的处理
  React.useEffect(() => {
    if (selectedScript) {
      console.log("选中的脚本完整数据:", JSON.stringify(selectedScript, null, 2));
    }
  }, [selectedScript]);
  
  // 确保选中的脚本始终有值
  React.useEffect(() => {
    if (!selectedScriptId && availableScripts.length > 0) {
      console.log("自动选择第一个脚本:", availableScripts[0].scriptId);
      setSelectedScriptId(availableScripts[0].scriptId);
    }
  }, [availableScripts, selectedScriptId, setSelectedScriptId]);
  
  // 获取显示的描述文本（根据语言）
  const getLocalizedField = (field: string | undefined, cnField?: string): string => {
    const defaultField = field ?? '-';
    if (language === 'zh' && cnField) {
      return cnField;
    }
    return defaultField;
  };
  
  const noScriptDesc = t('noScriptDesc') || "No description available for this script.";
  
  // 获取当前显示的描述文本
  const scriptDescription = selectedScript 
    ? getLocalizedField(selectedScript.description, selectedScript.cnDescription) 
    : noScriptDesc;
    
  // 获取当前显示的范围文本
  const scriptScope = selectedScript 
    ? getLocalizedField(selectedScript.scope, selectedScript.cnScope) 
    : '-';
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-all duration-300 h-full flex flex-col bg-card/90 dark:bg-card/90 backdrop-blur-sm">
      <CardHeader className="px-4 py-3 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="icon-container bg-primary/10 rounded-lg">
            <List className="h-5 w-5 text-primary" />
          </div>
          <CardTitle>{t('manualTrigger')}</CardTitle>
        </div>
        <CardDescription className="mt-1">
          {t('selectScriptDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-2 flex-1 flex flex-col">
        {isFetchingScripts ? (
          <div className="flex items-center text-muted-foreground space-x-2">
            <Loader2 className="animate-spin h-5 w-5" />
            <span>{t('loadingScripts')}</span>
          </div>
        ) : availableScripts.length > 0 ? (
          <div className="space-y-3 flex-1 flex flex-col">
            <div className="grid gap-1">
              <Label htmlFor="script-select" className="text-sm font-medium">
                {t('selectScriptLabel')}
              </Label>
              <Select 
                value={selectedScriptId} 
                onValueChange={setSelectedScriptId} 
                disabled={isTriggering || loading}
              >
                <SelectTrigger id="script-select" className="w-full">
                  <SelectValue placeholder={t('selectScriptPlaceholder') || "Select a script"} />
                </SelectTrigger>
                <SelectContent>
                  {availableScripts.map((script) => {
                    let displayName = script.name;
                    if (language === 'zh' && script.cnName) {
                      displayName = script.cnName;
                    }
                    return (
                      <SelectItem key={script.scriptId} value={script.scriptId}>
                        {displayName}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {selectedScript && (
              <div className="bg-card rounded-md text-sm border border-border/30 shadow-sm hover:shadow transition-all duration-300 slide-in-left flex-1 overflow-auto">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1.5 text-primary">
                      <div className="icon-container bg-primary/10 rounded-md p-0.5">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>Description</span>
                    </h4>
                    <div className="pl-5 text-sm text-muted-foreground">
                      {scriptDescription}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1.5 text-primary">
                      <div className="icon-container bg-primary/10 rounded-md p-0.5">
                        <Book className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>Scope</span>
                    </h4>
                    <div className="pl-5 text-sm text-muted-foreground">
                      {scriptScope}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1.5 text-primary">
                      <div className="icon-container bg-primary/10 rounded-md p-0.5">
                        <User className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>Author</span>
                    </h4>
                    <div className="pl-5 text-sm text-muted-foreground">
                      {selectedScript.author || '-'}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-1.5 text-primary">
                      <div className="icon-container bg-primary/10 rounded-md p-0.5">
                        <Calendar className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span>Created</span>
                    </h4>
                    <div className="pl-5 text-sm text-muted-foreground">
                      {selectedScript.createdAt ? formatDate(selectedScript.createdAt.toISOString(), language) : '-'}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-auto pt-1">
              <Button
                onClick={handleTriggerCheck}
                disabled={!selectedScriptId || isTriggering || loading}
                className="w-full shadow-sm hover:shadow transition-all duration-150"
              >
                {isTriggering ? (
                  <>
                    <Loader2 className="animate-spin mr-1.5 h-4 w-4" />
                    {t('runningCheck')}
                  </>
                ) : (
                  <>
                    <Play className="mr-1.5 h-4 w-4" />
                    {t('runCheck')}
                  </>
                )}
              </Button>
            </div>

            {triggerMessage && (
              <Alert variant={triggerMessageType === 'error' ? "destructive" : "default"} className="mt-3 shadow-sm slide-in-right transition-all duration-300">
                <AlertTitle>
                  {triggerMessageType === 'error' ? t('triggerErrorTitle') : t('triggerSuccessTitle')}
                </AlertTitle>
                <AlertDescription>
                  {triggerMessage}
                </AlertDescription>
              </Alert>
            )}
          </div>
        ) : (
          <div className="text-center py-8 px-4 bg-card/50 rounded-lg border border-border/30 shadow-sm h-full flex flex-col justify-center">
            <div className="icon-container bg-muted/30 rounded-lg p-2 mx-auto mb-4">
              <Database className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="font-semibold text-base">{t('noScriptsAvailable')}</p>
            <p className="text-sm text-muted-foreground mt-2">{t('ensureConfigured')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 
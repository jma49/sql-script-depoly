import path from "path";
import { spawn } from "child_process";

// 获取命令行参数
const scriptName = process.argv[2];

if (!scriptName) {
  console.error("请提供脚本名称作为参数");
  process.exit(1);
}

// 构建正确的脚本路径
const mainScriptPath = path.resolve(__dirname, "..", "run_sql.ts");

console.log(`执行脚本: ${mainScriptPath} ${scriptName}`);

// 使用子进程执行正确路径的脚本
const childProcess = spawn("npx", ["ts-node", mainScriptPath, scriptName], {
  stdio: "inherit", // 将输出直接传递到当前进程
  shell: true,
});

// 处理子进程退出
childProcess.on("exit", (code) => {
  process.exit(code || 0);
});

// 处理错误
childProcess.on("error", (error) => {
  console.error(`执行脚本错误: ${error.message}`);
  process.exit(1);
});

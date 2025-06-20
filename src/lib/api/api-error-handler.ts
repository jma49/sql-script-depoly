/**
 * API错误处理工具
 * 提供统一的错误处理和日志记录机制
 *
 * @author AI Assistant
 * @version 1.0.0
 * @since 2024-01-01
 */

import { NextRequest } from "next/server";
import { createErrorResponse, ApiStatusCode } from "./api-response-utils";

/**
 * 错误类型枚举
 */
export enum ErrorType {
  VALIDATION_ERROR = "VALIDATION_ERROR",
  AUTHENTICATION_ERROR = "AUTHENTICATION_ERROR",
  AUTHORIZATION_ERROR = "AUTHORIZATION_ERROR",
  NOT_FOUND_ERROR = "NOT_FOUND_ERROR",
  CONFLICT_ERROR = "CONFLICT_ERROR",
  RATE_LIMIT_ERROR = "RATE_LIMIT_ERROR",
  DATABASE_ERROR = "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR = "EXTERNAL_SERVICE_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

/**
 * 自定义API错误类
 */
export class ApiError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: ApiStatusCode;
  public readonly code?: string;
  public readonly details?: Record<string, unknown>;

  constructor(
    type: ErrorType,
    message: string,
    statusCode: ApiStatusCode,
    code?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = "ApiError";
    this.type = type;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // 确保错误堆栈正确显示
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }

  /**
   * 将错误转换为JSON格式
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
      code: this.code,
      details: this.details,
      stack: this.stack,
    };
  }
}

/**
 * 错误工厂类
 * 提供创建常见错误的便捷方法
 */
export class ErrorFactory {
  /**
   * 创建验证错误
   */
  static validation(
    message: string,
    details?: Record<string, unknown>
  ): ApiError {
    return new ApiError(
      ErrorType.VALIDATION_ERROR,
      message,
      ApiStatusCode.BAD_REQUEST,
      "VALIDATION_FAILED",
      details
    );
  }

  /**
   * 创建认证错误
   */
  static authentication(message: string = "Authentication required"): ApiError {
    return new ApiError(
      ErrorType.AUTHENTICATION_ERROR,
      message,
      ApiStatusCode.UNAUTHORIZED,
      "AUTH_REQUIRED"
    );
  }

  /**
   * 创建授权错误
   */
  static authorization(message: string = "Permission denied"): ApiError {
    return new ApiError(
      ErrorType.AUTHORIZATION_ERROR,
      message,
      ApiStatusCode.FORBIDDEN,
      "PERMISSION_DENIED"
    );
  }

  /**
   * 创建资源未找到错误
   */
  static notFound(resource: string = "Resource"): ApiError {
    return new ApiError(
      ErrorType.NOT_FOUND_ERROR,
      `${resource} not found`,
      ApiStatusCode.NOT_FOUND,
      "RESOURCE_NOT_FOUND"
    );
  }

  /**
   * 创建冲突错误
   */
  static conflict(message: string): ApiError {
    return new ApiError(
      ErrorType.CONFLICT_ERROR,
      message,
      ApiStatusCode.CONFLICT,
      "RESOURCE_CONFLICT"
    );
  }

  /**
   * 创建频率限制错误
   */
  static rateLimit(message: string = "Rate limit exceeded"): ApiError {
    return new ApiError(
      ErrorType.RATE_LIMIT_ERROR,
      message,
      ApiStatusCode.TOO_MANY_REQUESTS,
      "RATE_LIMIT_EXCEEDED"
    );
  }

  /**
   * 创建数据库错误
   */
  static database(
    message: string,
    details?: Record<string, unknown>
  ): ApiError {
    return new ApiError(
      ErrorType.DATABASE_ERROR,
      message,
      ApiStatusCode.INTERNAL_SERVER_ERROR,
      "DATABASE_ERROR",
      details
    );
  }

  /**
   * 创建外部服务错误
   */
  static externalService(service: string, message: string): ApiError {
    return new ApiError(
      ErrorType.EXTERNAL_SERVICE_ERROR,
      `External service error from ${service}: ${message}`,
      ApiStatusCode.BAD_GATEWAY,
      "EXTERNAL_SERVICE_ERROR",
      { service }
    );
  }

  /**
   * 创建未知错误
   */
  static unknown(message: string = "An unknown error occurred"): ApiError {
    return new ApiError(
      ErrorType.UNKNOWN_ERROR,
      message,
      ApiStatusCode.INTERNAL_SERVER_ERROR,
      "UNKNOWN_ERROR"
    );
  }
}

/**
 * 错误日志记录器
 */
export class ErrorLogger {
  /**
   * 记录错误到控制台和外部日志服务
   */
  static log(
    error: Error,
    request?: NextRequest,
    context?: Record<string, unknown>
  ): void {
    const timestamp = new Date().toISOString();
    const errorId = `ERR_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const errorInfo = {
      errorId,
      timestamp,
      environment: process.env.NODE_ENV,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        ...(error instanceof ApiError ? error.toJSON() : {}),
      },
      request: request
        ? {
            method: request.method,
            url: request.url,
            userAgent: request.headers.get("user-agent"),
            ip:
              request.headers.get("x-forwarded-for") ||
              request.headers.get("x-real-ip") ||
              "unknown",
            referer: request.headers.get("referer"),
            // 过滤敏感头信息
            headers: this.filterSensitiveHeaders(request.headers),
          }
        : undefined,
      context,
      performance: this.getPerformanceMetrics(),
    };

    // 控制台日志记录
    if (process.env.NODE_ENV === "development") {
      console.error("[API Error]", JSON.stringify(errorInfo, null, 2));
    } else {
      console.error("[API Error]", JSON.stringify(errorInfo));
    }

    // 发送到外部监控服务
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalLoggingService(errorInfo);
    }

    // 存储到本地错误日志（可选）
    this.storeErrorLocally(errorInfo);
  }

  /**
   * 过滤敏感的请求头信息
   */
  private static filterSensitiveHeaders(
    headers: Headers
  ): Record<string, string> {
    const sensitiveHeaders = [
      "authorization",
      "cookie",
      "x-api-key",
      "x-auth-token",
    ];

    const filteredHeaders: Record<string, string> = {};
    headers.forEach((value, key) => {
      if (!sensitiveHeaders.includes(key.toLowerCase())) {
        filteredHeaders[key] = value;
      } else {
        filteredHeaders[key] = "[REDACTED]";
      }
    });

    return filteredHeaders;
  }

  /**
   * 获取性能指标
   */
  private static getPerformanceMetrics(): Record<string, unknown> {
    try {
      if (typeof performance !== "undefined") {
        const perfMemory = (performance as unknown as Record<string, unknown>)
          .memory as Record<string, number> | undefined;
        return {
          memory: perfMemory
            ? {
                used: perfMemory.usedJSHeapSize,
                total: perfMemory.totalJSHeapSize,
                limit: perfMemory.jsHeapSizeLimit,
              }
            : undefined,
          timing: performance.now(),
        };
      }
    } catch {
      // 忽略性能API错误
    }
    return {};
  }

  /**
   * 发送到外部日志服务
   */
  private static sendToExternalLoggingService(
    errorInfo: Record<string, unknown>
  ): void {
    // 这里可以集成外部监控服务
    // 例如：
    // - Sentry: Sentry.captureException(error, { extra: errorInfo });
    // - LogRocket: LogRocket.captureException(error);
    // - Datadog: DD_LOGS.logger.error(errorInfo.error.message, errorInfo);

    console.warn("[ErrorLogger] 错误已准备发送到监控服务:", errorInfo.errorId);
  }

  /**
   * 本地错误存储（可选）
   */
  private static storeErrorLocally(errorInfo: Record<string, unknown>): void {
    try {
      // 在浏览器环境中存储到 localStorage（仅开发环境）
      if (
        typeof window !== "undefined" &&
        process.env.NODE_ENV === "development"
      ) {
        const errors = JSON.parse(localStorage.getItem("app_errors") || "[]");
        errors.push(errorInfo);

        // 只保留最近100个错误
        if (errors.length > 100) {
          errors.splice(0, errors.length - 100);
        }

        localStorage.setItem("app_errors", JSON.stringify(errors));
      }
    } catch {
      // 忽略存储错误
    }
  }
}

/**
 * API错误处理中间件
 * 提供统一的错误处理装饰器
 */
export function withErrorHandler<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
): (...args: T) => Promise<Response> {
  return async (...args: T): Promise<Response> => {
    try {
      return await handler(...args);
    } catch (error) {
      // 提取请求对象（如果存在）
      const request = args.find((arg) => arg instanceof Request) as
        | NextRequest
        | undefined;

      // 记录错误
      ErrorLogger.log(error as Error, request);

      // 处理已知的API错误
      if (error instanceof ApiError) {
        return createErrorResponse(error.message, error.statusCode);
      }

      // 处理未知错误
      const unknownError = error as Error;
      return createErrorResponse(
        process.env.NODE_ENV === "development"
          ? unknownError.message
          : "Internal server error",
        ApiStatusCode.INTERNAL_SERVER_ERROR
      );
    }
  };
}

/**
 * 异步错误处理装饰器
 * 用于处理Promise中的错误
 */
export function handleAsyncError<T>(
  promise: Promise<T>,
  fallbackValue?: T
): Promise<[T | undefined, Error | undefined]> {
  return promise
    .then<[T, undefined]>((data: T) => [data, undefined])
    .catch<[T | undefined, Error]>((error: Error) => [fallbackValue, error]);
}

/**
 * 错误重试机制
 */
export class RetryHandler {
  /**
   * 重试异步操作
   * @param operation 要重试的操作
   * @param maxRetries 最大重试次数
   * @param delay 重试延迟（毫秒）
   * @param backoffFactor 延迟倍数因子
   */
  static async retry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000,
    backoffFactor: number = 2
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        // 计算延迟时间
        const currentDelay = delay * Math.pow(backoffFactor, attempt);
        await new Promise((resolve) => setTimeout(resolve, currentDelay));

        console.warn(
          `Retry attempt ${attempt + 1}/${maxRetries} failed:`,
          lastError.message
        );
      }
    }

    throw lastError!;
  }
}

/**
 * 向后兼容的错误处理函数
 */

/**
 * 简单的错误处理包装器（向后兼容）
 */
export function catchErrors<T extends unknown[]>(
  handler: (...args: T) => Promise<Response>
): (...args: T) => Promise<Response> {
  return withErrorHandler(handler);
}

/**
 * 创建标准错误响应（向后兼容）
 */
export function createStandardError(
  message: string,
  status: number = 500
): Response {
  return createErrorResponse(message, status as ApiStatusCode);
}

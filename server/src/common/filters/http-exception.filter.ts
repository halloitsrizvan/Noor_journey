import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { Request, Response } from "express";
import { randomUUID } from "crypto";

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const requestId = (request.headers["x-request-id"] as string) || randomUUID();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorCode = "INTERNAL_SERVER_ERROR";
    let message = "An unexpected error occurred.";
    let details: Record<string, any> = {};

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === "string") {
        message = res;
      } else if (typeof res === "object" && res !== null) {
        const obj = res as Record<string, any>;
        errorCode = obj.errorCode || obj.error || HttpStatus[status] || "ERROR";
        message = obj.message || message;
        details = obj.details || (Array.isArray(obj.message) ? { validationErrors: obj.message } : {});
        if (Array.isArray(obj.message)) {
          message = "Validation failed.";
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(`[${requestId}] Unexpected error: ${exception.message}`, exception.stack);
    }

    response.status(status).json({
      error: {
        code: errorCode,
        message,
        details,
        requestId,
      },
    });
  }
}

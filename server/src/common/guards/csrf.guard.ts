import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { Request } from "express";
import { AppConfigService } from "@/config/app-config.service";
import { CryptoService } from "@/common/crypto/crypto.service";

@Injectable()
export class CsrfGuard implements CanActivate {
  constructor(
    private readonly config: AppConfigService,
    private readonly crypto: CryptoService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const method = request.method.toUpperCase();

    // Safe read-only HTTP methods don't need CSRF tokens
    if (["GET", "HEAD", "OPTIONS"].includes(method)) {
      return true;
    }

    const path = request.path;
    // Exempt initial unauthenticated endpoints
    if (
      path.endsWith("/auth/login") ||
      path.endsWith("/auth/register") ||
      path.endsWith("/auth/csrf")
    ) {
      return true;
    }

    // 1. Origin check against allowed origins
    const origin = request.headers.origin || request.headers.referer;
    if (origin) {
      const isAllowed = this.config.frontendOrigins.some((allowed) =>
        origin.startsWith(allowed)
      );
      if (!isAllowed && this.config.isProduction) {
        throw new ForbiddenException({
          errorCode: "ORIGIN_NOT_ALLOWED",
          message: "Request origin not permitted.",
        });
      }
    }

    // 2. Session-bound CSRF token check
    const sessionToken = (request as any).sessionToken;
    if (!sessionToken) {
      // If no session exists, skip CSRF (auth guard will reject if required)
      return true;
    }

    const csrfHeader = (request.headers["x-csrf-token"] as string) || "";
    if (!csrfHeader) {
      throw new ForbiddenException({
        errorCode: "CSRF_TOKEN_MISSING",
        message: "Missing x-csrf-token header for mutating request.",
      });
    }

    const isValid = this.crypto.verifyCsrfToken(
      csrfHeader,
      sessionToken,
      this.config.sessionSecret
    );

    if (!isValid) {
      throw new ForbiddenException({
        errorCode: "CSRF_TOKEN_INVALID",
        message: "Invalid or expired CSRF token.",
      });
    }

    return true;
  }
}

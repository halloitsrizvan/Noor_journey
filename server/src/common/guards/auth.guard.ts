import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { PrismaService } from "@/database/prisma.service";
import { AppConfigService } from "@/config/app-config.service";
import { CryptoService } from "@/common/crypto/crypto.service";
import { ClockService } from "@/common/clock/clock.service";
import { IS_PUBLIC_KEY } from "@/common/decorators/auth.decorators";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
    private readonly config: AppConfigService,
    private readonly crypto: CryptoService,
    private readonly clock: ClockService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const sessionToken = this.extractToken(request);

    if (!sessionToken) {
      throw new UnauthorizedException({
        errorCode: "UNAUTHORIZED",
        message: "Authentication session required.",
      });
    }

    const tokenHash = this.crypto.hashToken(sessionToken);
    const session = await this.prisma.session.findUnique({
      where: { tokenHash },
      include: { account: true },
    });

    if (!session || session.revokedAt) {
      throw new UnauthorizedException({
        errorCode: "SESSION_REVOKED",
        message: "Session has been revoked. Please log in again.",
      });
    }

    if (session.expiresAt <= this.clock.now()) {
      throw new UnauthorizedException({
        errorCode: "SESSION_EXPIRED",
        message: "Session has expired. Please log in again.",
      });
    }

    // Attach to request
    (request as any).user = session.account;
    (request as any).session = session;
    (request as any).sessionToken = sessionToken;

    return true;
  }

  private extractToken(request: Request): string | null {
    // 1. From HttpOnly cookie
    const cookieToken = request.cookies?.[this.config.sessionCookieName];
    if (cookieToken) return cookieToken;

    // 2. From Authorization header: Bearer <token>
    const authHeader = request.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      return authHeader.substring(7).trim();
    }

    return null;
  }
}

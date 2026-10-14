import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from "@nestjs/common";
import { PrismaService } from "@/database/prisma.service";
import { CryptoService } from "@/common/crypto/crypto.service";
import { ClockService } from "@/common/clock/clock.service";
import { AppConfigService } from "@/config/app-config.service";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./dto/auth.dto";
import { Role } from "@prisma/client";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly crypto: CryptoService,
    private readonly clock: ClockService,
    private readonly config: AppConfigService,
  ) {}

  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string) {
    const existing = await this.prisma.account.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (existing) {
      throw new ConflictException({
        errorCode: "EMAIL_ALREADY_EXISTS",
        message: "An account with this email address already exists.",
      });
    }

    const passwordHash = await this.crypto.hashPassword(dto.password);

    // Explicit security rule: public registration ALWAYS creates PARENT role accounts
    const account = await this.prisma.account.create({
      data: {
        email: dto.email.toLowerCase().trim(),
        passwordHash,
        role: Role.PARENT,
      },
    });

    // Create session
    const sessionToken = await this.createSession(account.id, ipAddress, userAgent);
    const csrfToken = this.crypto.generateCsrfToken(sessionToken, this.config.sessionSecret);

    // Audit log
    await this.prisma.auditEvent.create({
      data: {
        accountId: account.id,
        eventType: "AUTH_REGISTER",
        resourceType: "Account",
        resourceId: account.id,
        ipAddress,
      },
    });

    return {
      account: {
        id: account.id,
        email: account.email,
        role: account.role,
        createdAt: account.createdAt,
      },
      sessionToken,
      csrfToken,
    };
  }

  async login(dto: LoginDto, ipAddress?: string, userAgent?: string) {
    const account = await this.prisma.account.findUnique({
      where: { email: dto.email.toLowerCase().trim() },
    });

    if (!account) {
      throw new UnauthorizedException({
        errorCode: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    const passwordValid = await this.crypto.verifyPassword(dto.password, account.passwordHash);
    if (!passwordValid) {
      throw new UnauthorizedException({
        errorCode: "INVALID_CREDENTIALS",
        message: "Invalid email or password.",
      });
    }

    // Create session
    const sessionToken = await this.createSession(account.id, ipAddress, userAgent);
    const csrfToken = this.crypto.generateCsrfToken(sessionToken, this.config.sessionSecret);

    // Audit log
    await this.prisma.auditEvent.create({
      data: {
        accountId: account.id,
        eventType: "AUTH_LOGIN",
        resourceType: "Account",
        resourceId: account.id,
        ipAddress,
      },
    });

    return {
      account: {
        id: account.id,
        email: account.email,
        role: account.role,
        createdAt: account.createdAt,
      },
      sessionToken,
      csrfToken,
    };
  }

  async logout(sessionToken: string) {
    const tokenHash = this.crypto.hashToken(sessionToken);
    await this.prisma.session.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: this.clock.now() },
    });
    return { success: true };
  }

  async logoutAll(accountId: string) {
    await this.prisma.session.updateMany({
      where: { accountId, revokedAt: null },
      data: { revokedAt: this.clock.now() },
    });
    return { success: true };
  }

  async getMe(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        children: {
          select: {
            id: true,
            nickname: true,
            ageBand: true,
            preferredLanguage: true,
            priorStandard: true,
            avatarKey: true,
            weeklyGoal: true,
            timezone: true,
          },
        },
      },
    });

    if (!account) {
      throw new UnauthorizedException({
        errorCode: "ACCOUNT_NOT_FOUND",
        message: "Account not found.",
      });
    }

    return {
      id: account.id,
      email: account.email,
      role: account.role,
      children: account.children,
      createdAt: account.createdAt,
    };
  }

  async reauthenticate(accountId: string, password: string): Promise<boolean> {
    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    if (!account) return false;
    return this.crypto.verifyPassword(password, account.passwordHash);
  }

  async changePassword(accountId: string, dto: ChangePasswordDto, currentSessionToken?: string) {
    const account = await this.prisma.account.findUnique({ where: { id: accountId } });
    if (!account) {
      throw new UnauthorizedException({
        errorCode: "ACCOUNT_NOT_FOUND",
        message: "Account not found.",
      });
    }

    const currentMatches = await this.crypto.verifyPassword(dto.currentPassword, account.passwordHash);
    if (!currentMatches) {
      throw new BadRequestException({
        errorCode: "INVALID_CURRENT_PASSWORD",
        message: "Current password does not match.",
      });
    }

    const newPasswordHash = await this.crypto.hashPassword(dto.newPassword);
    await this.prisma.account.update({
      where: { id: accountId },
      data: { passwordHash: newPasswordHash },
    });

    // Revoke all other sessions for security
    const currentTokenHash = currentSessionToken ? this.crypto.hashToken(currentSessionToken) : "";
    await this.prisma.session.updateMany({
      where: {
        accountId,
        tokenHash: { not: currentTokenHash },
        revokedAt: null,
      },
      data: { revokedAt: this.clock.now() },
    });

    return { success: true, message: "Password updated successfully." };
  }

  getCsrfToken(sessionToken: string): string {
    return this.crypto.generateCsrfToken(sessionToken, this.config.sessionSecret);
  }

  private async createSession(accountId: string, ipAddress?: string, userAgent?: string): Promise<string> {
    const rawToken = this.crypto.generateSessionToken();
    const tokenHash = this.crypto.hashToken(rawToken);
    const expiresAt = new Date(
      this.clock.now().getTime() + this.config.sessionTtlDays * 24 * 60 * 60 * 1000
    );

    await this.prisma.session.create({
      data: {
        accountId,
        tokenHash,
        ipAddress,
        userAgent,
        expiresAt,
      },
    });

    return rawToken;
  }
}

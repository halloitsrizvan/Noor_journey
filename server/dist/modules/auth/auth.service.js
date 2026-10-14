"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const crypto_service_1 = require("../../common/crypto/crypto.service");
const clock_service_1 = require("../../common/clock/clock.service");
const app_config_service_1 = require("../../config/app-config.service");
const client_1 = require("@prisma/client");
let AuthService = class AuthService {
    prisma;
    crypto;
    clock;
    config;
    constructor(prisma, crypto, clock, config) {
        this.prisma = prisma;
        this.crypto = crypto;
        this.clock = clock;
        this.config = config;
    }
    async register(dto, ipAddress, userAgent) {
        const existing = await this.prisma.account.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (existing) {
            throw new common_1.ConflictException({
                errorCode: "EMAIL_ALREADY_EXISTS",
                message: "An account with this email address already exists.",
            });
        }
        const passwordHash = await this.crypto.hashPassword(dto.password);
        const account = await this.prisma.account.create({
            data: {
                email: dto.email.toLowerCase().trim(),
                passwordHash,
                role: client_1.Role.PARENT,
            },
        });
        const sessionToken = await this.createSession(account.id, ipAddress, userAgent);
        const csrfToken = this.crypto.generateCsrfToken(sessionToken, this.config.sessionSecret);
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
    async login(dto, ipAddress, userAgent) {
        const account = await this.prisma.account.findUnique({
            where: { email: dto.email.toLowerCase().trim() },
        });
        if (!account) {
            throw new common_1.UnauthorizedException({
                errorCode: "INVALID_CREDENTIALS",
                message: "Invalid email or password.",
            });
        }
        const passwordValid = await this.crypto.verifyPassword(dto.password, account.passwordHash);
        if (!passwordValid) {
            throw new common_1.UnauthorizedException({
                errorCode: "INVALID_CREDENTIALS",
                message: "Invalid email or password.",
            });
        }
        const sessionToken = await this.createSession(account.id, ipAddress, userAgent);
        const csrfToken = this.crypto.generateCsrfToken(sessionToken, this.config.sessionSecret);
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
    async logout(sessionToken) {
        const tokenHash = this.crypto.hashToken(sessionToken);
        await this.prisma.session.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: this.clock.now() },
        });
        return { success: true };
    }
    async logoutAll(accountId) {
        await this.prisma.session.updateMany({
            where: { accountId, revokedAt: null },
            data: { revokedAt: this.clock.now() },
        });
        return { success: true };
    }
    async getMe(accountId) {
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
            throw new common_1.UnauthorizedException({
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
    async reauthenticate(accountId, password) {
        const account = await this.prisma.account.findUnique({ where: { id: accountId } });
        if (!account)
            return false;
        return this.crypto.verifyPassword(password, account.passwordHash);
    }
    async changePassword(accountId, dto, currentSessionToken) {
        const account = await this.prisma.account.findUnique({ where: { id: accountId } });
        if (!account) {
            throw new common_1.UnauthorizedException({
                errorCode: "ACCOUNT_NOT_FOUND",
                message: "Account not found.",
            });
        }
        const currentMatches = await this.crypto.verifyPassword(dto.currentPassword, account.passwordHash);
        if (!currentMatches) {
            throw new common_1.BadRequestException({
                errorCode: "INVALID_CURRENT_PASSWORD",
                message: "Current password does not match.",
            });
        }
        const newPasswordHash = await this.crypto.hashPassword(dto.newPassword);
        await this.prisma.account.update({
            where: { id: accountId },
            data: { passwordHash: newPasswordHash },
        });
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
    getCsrfToken(sessionToken) {
        return this.crypto.generateCsrfToken(sessionToken, this.config.sessionSecret);
    }
    async createSession(accountId, ipAddress, userAgent) {
        const rawToken = this.crypto.generateSessionToken();
        const tokenHash = this.crypto.hashToken(rawToken);
        const expiresAt = new Date(this.clock.now().getTime() + this.config.sessionTtlDays * 24 * 60 * 60 * 1000);
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        crypto_service_1.CryptoService,
        clock_service_1.ClockService,
        app_config_service_1.AppConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map
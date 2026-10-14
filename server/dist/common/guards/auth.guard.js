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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("../../database/prisma.service");
const app_config_service_1 = require("../../config/app-config.service");
const crypto_service_1 = require("../crypto/crypto.service");
const clock_service_1 = require("../clock/clock.service");
const auth_decorators_1 = require("../decorators/auth.decorators");
let AuthGuard = class AuthGuard {
    reflector;
    prisma;
    config;
    crypto;
    clock;
    constructor(reflector, prisma, config, crypto, clock) {
        this.reflector = reflector;
        this.prisma = prisma;
        this.config = config;
        this.crypto = crypto;
        this.clock = clock;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(auth_decorators_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const sessionToken = this.extractToken(request);
        if (!sessionToken) {
            throw new common_1.UnauthorizedException({
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
            throw new common_1.UnauthorizedException({
                errorCode: "SESSION_REVOKED",
                message: "Session has been revoked. Please log in again.",
            });
        }
        if (session.expiresAt <= this.clock.now()) {
            throw new common_1.UnauthorizedException({
                errorCode: "SESSION_EXPIRED",
                message: "Session has expired. Please log in again.",
            });
        }
        request.user = session.account;
        request.session = session;
        request.sessionToken = sessionToken;
        return true;
    }
    extractToken(request) {
        const cookieToken = request.cookies?.[this.config.sessionCookieName];
        if (cookieToken)
            return cookieToken;
        const authHeader = request.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }
        return null;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        prisma_service_1.PrismaService,
        app_config_service_1.AppConfigService,
        crypto_service_1.CryptoService,
        clock_service_1.ClockService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map
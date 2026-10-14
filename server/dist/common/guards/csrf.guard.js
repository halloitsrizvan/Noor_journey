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
exports.CsrfGuard = void 0;
const common_1 = require("@nestjs/common");
const app_config_service_1 = require("../../config/app-config.service");
const crypto_service_1 = require("../crypto/crypto.service");
let CsrfGuard = class CsrfGuard {
    config;
    crypto;
    constructor(config, crypto) {
        this.config = config;
        this.crypto = crypto;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const method = request.method.toUpperCase();
        if (["GET", "HEAD", "OPTIONS"].includes(method)) {
            return true;
        }
        const path = request.path;
        if (path.endsWith("/auth/login") ||
            path.endsWith("/auth/register") ||
            path.endsWith("/auth/csrf")) {
            return true;
        }
        const origin = request.headers.origin || request.headers.referer;
        if (origin) {
            const isAllowed = this.config.frontendOrigins.some((allowed) => origin.startsWith(allowed));
            if (!isAllowed && this.config.isProduction) {
                throw new common_1.ForbiddenException({
                    errorCode: "ORIGIN_NOT_ALLOWED",
                    message: "Request origin not permitted.",
                });
            }
        }
        const sessionToken = request.sessionToken;
        if (!sessionToken) {
            return true;
        }
        const csrfHeader = request.headers["x-csrf-token"] || "";
        if (!csrfHeader) {
            throw new common_1.ForbiddenException({
                errorCode: "CSRF_TOKEN_MISSING",
                message: "Missing x-csrf-token header for mutating request.",
            });
        }
        const isValid = this.crypto.verifyCsrfToken(csrfHeader, sessionToken, this.config.sessionSecret);
        if (!isValid) {
            throw new common_1.ForbiddenException({
                errorCode: "CSRF_TOKEN_INVALID",
                message: "Invalid or expired CSRF token.",
            });
        }
        return true;
    }
};
exports.CsrfGuard = CsrfGuard;
exports.CsrfGuard = CsrfGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [app_config_service_1.AppConfigService,
        crypto_service_1.CryptoService])
], CsrfGuard);
//# sourceMappingURL=csrf.guard.js.map
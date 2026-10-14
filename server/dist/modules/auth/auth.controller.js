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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const auth_service_1 = require("./auth.service");
const auth_dto_1 = require("./dto/auth.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const app_config_service_1 = require("../../config/app-config.service");
let AuthController = class AuthController {
    authService;
    config;
    constructor(authService, config) {
        this.authService = authService;
        this.config = config;
    }
    async register(dto, req, res) {
        const ip = req.ip || req.headers["x-forwarded-for"];
        const userAgent = req.headers["user-agent"];
        const result = await this.authService.register(dto, ip, userAgent);
        this.setSessionCookie(res, result.sessionToken);
        return {
            account: result.account,
            csrfToken: result.csrfToken,
        };
    }
    async login(dto, req, res) {
        const ip = req.ip || req.headers["x-forwarded-for"];
        const userAgent = req.headers["user-agent"];
        const result = await this.authService.login(dto, ip, userAgent);
        this.setSessionCookie(res, result.sessionToken);
        return {
            account: result.account,
            csrfToken: result.csrfToken,
        };
    }
    async logout(req, res) {
        const token = req.sessionToken;
        if (token) {
            await this.authService.logout(token);
        }
        this.clearSessionCookie(res);
        return { success: true };
    }
    async logoutAll(user, res) {
        await this.authService.logoutAll(user.id);
        this.clearSessionCookie(res);
        return { success: true };
    }
    async getMe(user) {
        return this.authService.getMe(user.id);
    }
    async getCsrf(req) {
        const sessionToken = req.sessionToken;
        const csrfToken = this.authService.getCsrfToken(sessionToken);
        return { csrfToken };
    }
    async reauthenticate(user, dto) {
        const valid = await this.authService.reauthenticate(user.id, dto.password);
        if (!valid) {
            throw new common_1.UnauthorizedException({
                errorCode: "REAUTHENTICATION_FAILED",
                message: "Invalid password.",
            });
        }
        return { verified: true };
    }
    async changePassword(user, dto, req) {
        const token = req.sessionToken;
        return this.authService.changePassword(user.id, dto, token);
    }
    setSessionCookie(res, token) {
        res.cookie(this.config.sessionCookieName, token, {
            httpOnly: true,
            secure: this.config.isProduction,
            sameSite: this.config.isProduction ? "none" : "lax",
            maxAge: this.config.sessionTtlDays * 24 * 60 * 60 * 1000,
            path: "/",
        });
    }
    clearSessionCookie(res) {
        res.clearCookie(this.config.sessionCookieName, {
            httpOnly: true,
            secure: this.config.isProduction,
            sameSite: this.config.isProduction ? "none" : "lax",
            path: "/",
        });
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)("register"),
    (0, swagger_1.ApiOperation)({ summary: "Parent registration" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Account created successfully" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.RegisterDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)("login"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiOperation)({ summary: "Parent login" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Login successful" }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.LoginDto, Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, csrf_guard_1.CsrfGuard),
    (0, common_1.Post)("logout"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Logout current session" }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, csrf_guard_1.CsrfGuard),
    (0, common_1.Post)("logout-all"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Logout of all active sessions" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logoutAll", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)("me"),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get current authenticated account details" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getMe", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)("csrf"),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get fresh session-bound CSRF token" }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getCsrf", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, csrf_guard_1.CsrfGuard),
    (0, common_1.Post)("reauthenticate"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Adult reauthentication for sensitive operations" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ReauthenticateDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "reauthenticate", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, csrf_guard_1.CsrfGuard),
    (0, common_1.Post)("change-password"),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, swagger_1.ApiCookieAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Change account password" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, auth_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "changePassword", null);
exports.AuthController = AuthController = __decorate([
    (0, swagger_1.ApiTags)("Authentication"),
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        app_config_service_1.AppConfigService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map
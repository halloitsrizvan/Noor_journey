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
exports.AppConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let AppConfigService = class AppConfigService {
    config;
    constructor(config) {
        this.config = config;
    }
    get port() {
        return this.config.get("PORT", 4000);
    }
    get nodeEnv() {
        return this.config.get("NODE_ENV", "development");
    }
    get isProduction() {
        return this.nodeEnv === "production";
    }
    get databaseUrl() {
        return this.config.get("DATABASE_URL", "");
    }
    get frontendOrigins() {
        const raw = this.config.get("FRONTEND_ORIGINS", "http://localhost:8080,http://localhost:8081,http://localhost:3000");
        return raw.split(",").map((s) => s.trim()).filter(Boolean);
    }
    get sessionCookieName() {
        return this.config.get("SESSION_COOKIE_NAME", "noor_session");
    }
    get sessionTtlDays() {
        return this.config.get("SESSION_TTL_DAYS", 7);
    }
    get sessionSecret() {
        return this.config.get("SESSION_SECRET", "noor_dev_secret_key_32_chars_long!!");
    }
    get csrfCookieName() {
        return this.config.get("CSRF_COOKIE_NAME", "noor_csrf");
    }
    get appTimezone() {
        return this.config.get("APP_TIMEZONE", "Asia/Kolkata");
    }
    get enableDemoContent() {
        const raw = this.config.get("ENABLE_DEMO_CONTENT", "true");
        return raw === "true" || raw === "1";
    }
};
exports.AppConfigService = AppConfigService;
exports.AppConfigService = AppConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AppConfigService);
//# sourceMappingURL=app-config.service.js.map
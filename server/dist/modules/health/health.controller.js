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
exports.HealthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../../database/prisma.service");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
let HealthController = class HealthController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getLiveness() {
        return {
            status: "ok",
            timestamp: new Date().toISOString(),
        };
    }
    async getReadiness() {
        try {
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Database check timed out")), 2000));
            const dbPromise = this.prisma.$queryRaw `SELECT 1`;
            await Promise.race([dbPromise, timeoutPromise]);
            return {
                status: "ready",
                database: "connected",
                timestamp: new Date().toISOString(),
            };
        }
        catch (err) {
            throw new common_1.ServiceUnavailableException({
                errorCode: "DATABASE_UNAVAILABLE",
                message: "Database connectivity check failed.",
            });
        }
    }
};
exports.HealthController = HealthController;
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)("live"),
    (0, swagger_1.ApiOperation)({ summary: "Liveness probe" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HealthController.prototype, "getLiveness", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)("ready"),
    (0, swagger_1.ApiOperation)({ summary: "Readiness probe with bounded database connectivity check" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HealthController.prototype, "getReadiness", null);
exports.HealthController = HealthController = __decorate([
    (0, swagger_1.ApiTags)("Health"),
    (0, common_1.Controller)("health"),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HealthController);
//# sourceMappingURL=health.controller.js.map
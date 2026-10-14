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
exports.ReflectionsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reflections_service_1 = require("./reflections.service");
const reflections_dto_1 = require("./dto/reflections.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const child_ownership_guard_1 = require("../../common/guards/child-ownership.guard");
let ReflectionsController = class ReflectionsController {
    reflectionsService;
    constructor(reflectionsService) {
        this.reflectionsService = reflectionsService;
    }
    async getReflections(childId) {
        return this.reflectionsService.getReflections(childId);
    }
    async createReflection(childId, dto) {
        return this.reflectionsService.createReflection(childId, dto.missionId, dto.note);
    }
    async deleteReflection(childId, reflectionId) {
        return this.reflectionsService.deleteReflection(childId, reflectionId);
    }
};
exports.ReflectionsController = ReflectionsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get child's family reflections" }),
    __param(0, (0, common_1.Param)("childId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReflectionsController.prototype, "getReflections", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Record a family reflection" }),
    __param(0, (0, common_1.Param)("childId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reflections_dto_1.CreateReflectionDto]),
    __metadata("design:returntype", Promise)
], ReflectionsController.prototype, "createReflection", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Delete a family reflection" }),
    __param(0, (0, common_1.Param)("childId")),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReflectionsController.prototype, "deleteReflection", null);
exports.ReflectionsController = ReflectionsController = __decorate([
    (0, swagger_1.ApiTags)("Family Reflections"),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, common_1.Controller)("children/:childId/reflections"),
    __metadata("design:paramtypes", [reflections_service_1.ReflectionsService])
], ReflectionsController);
//# sourceMappingURL=reflections.controller.js.map
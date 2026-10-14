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
exports.ContentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const content_service_1 = require("./content.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const child_ownership_guard_1 = require("../../common/guards/child-ownership.guard");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
let ContentController = class ContentController {
    contentService;
    constructor(contentService) {
        this.contentService = contentService;
    }
    async getWorlds() {
        return this.contentService.getWorlds();
    }
    async getSubjects() {
        return this.contentService.getSubjects();
    }
    async getChildJourney(childId) {
        return this.contentService.getChildJourney(childId);
    }
    async getChildChapter(childId, chapterId) {
        return this.contentService.getChildChapter(childId, chapterId);
    }
    async getChildMission(childId, missionId) {
        return this.contentService.getChildMission(childId, missionId);
    }
};
exports.ContentController = ContentController;
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)("worlds"),
    (0, swagger_1.ApiOperation)({ summary: "Get all learning worlds" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getWorlds", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)("subjects"),
    (0, swagger_1.ApiOperation)({ summary: "Get curriculum subjects" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getSubjects", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.Get)("children/:childId/journey"),
    (0, swagger_1.ApiOperation)({ summary: "Get child learning journey map and mission progress" }),
    __param(0, (0, common_1.Param)("childId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getChildJourney", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.Get)("children/:childId/chapters/:chapterId"),
    (0, swagger_1.ApiOperation)({ summary: "Get child chapter overview" }),
    __param(0, (0, common_1.Param)("childId")),
    __param(1, (0, common_1.Param)("chapterId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getChildChapter", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.Get)("children/:childId/missions/:missionId"),
    (0, swagger_1.ApiOperation)({ summary: "Get mission content for learning (checkpoint answer keys stripped)" }),
    __param(0, (0, common_1.Param)("childId")),
    __param(1, (0, common_1.Param)("missionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getChildMission", null);
exports.ContentController = ContentController = __decorate([
    (0, swagger_1.ApiTags)("Content & Journey"),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [content_service_1.ContentService])
], ContentController);
//# sourceMappingURL=content.controller.js.map
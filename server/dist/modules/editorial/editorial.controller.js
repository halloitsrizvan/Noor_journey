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
exports.EditorialController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const editorial_service_1 = require("./editorial.service");
const editorial_dto_1 = require("./dto/editorial.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
const client_1 = require("@prisma/client");
let EditorialController = class EditorialController {
    editorialService;
    constructor(editorialService) {
        this.editorialService = editorialService;
    }
    async getOverview() {
        return this.editorialService.getEditorialOverview();
    }
    async createDraft(user, missionId, dto) {
        return this.editorialService.createDraft(user.id, missionId, dto);
    }
    async submitDraft(user, versionId) {
        return this.editorialService.submitDraft(user.id, versionId);
    }
    async reviewContent(user, versionId, dto) {
        return this.editorialService.reviewContent(user.id, versionId, dto);
    }
    async publishVersion(user, versionId, dto) {
        return this.editorialService.publishVersion(user.id, versionId, dto);
    }
    async archiveVersion(versionId) {
        return this.editorialService.archiveVersion(versionId);
    }
    async withdrawVersion(versionId) {
        return this.editorialService.withdrawVersion(versionId);
    }
};
exports.EditorialController = EditorialController;
__decorate([
    (0, auth_decorators_1.Roles)(client_1.Role.ADMIN, client_1.Role.REVIEWER),
    (0, common_1.Get)("overview"),
    (0, swagger_1.ApiOperation)({ summary: "Get editorial & system overview for Admin dashboard" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], EditorialController.prototype, "getOverview", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.Role.AUTHOR, client_1.Role.ADMIN),
    (0, common_1.Post)("missions/:missionId/draft"),
    (0, swagger_1.ApiOperation)({ summary: "Create a mission draft version (Author only)" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("missionId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, editorial_dto_1.CreateDraftDto]),
    __metadata("design:returntype", Promise)
], EditorialController.prototype, "createDraft", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.Role.AUTHOR, client_1.Role.ADMIN),
    (0, common_1.Post)("versions/:versionId/submit"),
    (0, swagger_1.ApiOperation)({ summary: "Submit draft for editorial & religious review" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("versionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], EditorialController.prototype, "submitDraft", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.Role.REVIEWER, client_1.Role.ADMIN),
    (0, common_1.Post)("versions/:versionId/review"),
    (0, swagger_1.ApiOperation)({ summary: "Review submitted content (Reviewer cannot be author)" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("versionId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, editorial_dto_1.ReviewContentDto]),
    __metadata("design:returntype", Promise)
], EditorialController.prototype, "reviewContent", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.Role.ADMIN, client_1.Role.REVIEWER),
    (0, common_1.Post)("versions/:versionId/publish"),
    (0, swagger_1.ApiOperation)({ summary: "Publish reviewed version (Requires mapping and review)" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("versionId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, editorial_dto_1.PublishVersionDto]),
    __metadata("design:returntype", Promise)
], EditorialController.prototype, "publishVersion", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Post)("versions/:versionId/archive"),
    (0, swagger_1.ApiOperation)({ summary: "Archive a mission version" }),
    __param(0, (0, common_1.Param)("versionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EditorialController.prototype, "archiveVersion", null);
__decorate([
    (0, auth_decorators_1.Roles)(client_1.Role.ADMIN),
    (0, common_1.Post)("versions/:versionId/withdraw"),
    (0, swagger_1.ApiOperation)({ summary: "Safety withdrawal of a mission version" }),
    __param(0, (0, common_1.Param)("versionId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EditorialController.prototype, "withdrawVersion", null);
exports.EditorialController = EditorialController = __decorate([
    (0, swagger_1.ApiTags)("Editorial & Curriculum Review"),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, roles_guard_1.RolesGuard, csrf_guard_1.CsrfGuard),
    (0, common_1.Controller)("editorial"),
    __metadata("design:paramtypes", [editorial_service_1.EditorialService])
], EditorialController);
//# sourceMappingURL=editorial.controller.js.map
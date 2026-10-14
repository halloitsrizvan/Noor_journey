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
exports.ChildrenController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const children_service_1 = require("./children.service");
const children_dto_1 = require("./dto/children.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const child_ownership_guard_1 = require("../../common/guards/child-ownership.guard");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
let ChildrenController = class ChildrenController {
    childrenService;
    constructor(childrenService) {
        this.childrenService = childrenService;
    }
    async getChildren(user) {
        return this.childrenService.getChildren(user.id);
    }
    async createChild(user, dto) {
        return this.childrenService.createChild(user.id, dto);
    }
    async getChild(user, id) {
        return this.childrenService.getChild(user.id, id);
    }
    async updateChild(user, id, dto) {
        return this.childrenService.updateChild(user.id, id, dto);
    }
    async deleteChild(user, id) {
        return this.childrenService.deleteChild(user.id, id);
    }
    async updateAvatar(user, childId, dto) {
        return this.childrenService.updateAvatar(user.id, childId, dto.avatarKey);
    }
};
exports.ChildrenController = ChildrenController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "List all children for authenticated parent" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "getChildren", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Create a child profile" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, children_dto_1.CreateChildProfileDto]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "createChild", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(child_ownership_guard_1.ChildOwnershipGuard),
    (0, swagger_1.ApiOperation)({ summary: "Get child profile by ID" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "getChild", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, swagger_1.ApiOperation)({ summary: "Update child profile" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, children_dto_1.UpdateChildProfileDto]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "updateChild", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, swagger_1.ApiOperation)({ summary: "Delete child profile" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "deleteChild", null);
__decorate([
    (0, common_1.Patch)(":childId/avatar"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, swagger_1.ApiOperation)({ summary: "Update child avatar" }),
    __param(0, (0, auth_decorators_1.CurrentUser)()),
    __param(1, (0, common_1.Param)("childId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, children_dto_1.UpdateAvatarDto]),
    __metadata("design:returntype", Promise)
], ChildrenController.prototype, "updateAvatar", null);
exports.ChildrenController = ChildrenController = __decorate([
    (0, swagger_1.ApiTags)("Child Profiles"),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)("children"),
    __metadata("design:paramtypes", [children_service_1.ChildrenService])
], ChildrenController);
//# sourceMappingURL=children.controller.js.map
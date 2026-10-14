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
exports.ParentReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const parent_reports_service_1 = require("./parent-reports.service");
const auth_guard_1 = require("../../common/guards/auth.guard");
const child_ownership_guard_1 = require("../../common/guards/child-ownership.guard");
let ParentReportsController = class ParentReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getChildSummary(childId) {
        return this.reportsService.getChildSummary(childId);
    }
};
exports.ParentReportsController = ParentReportsController;
__decorate([
    (0, common_1.Get)("summary"),
    (0, swagger_1.ApiOperation)({ summary: "Get child learning summary report for parents" }),
    __param(0, (0, common_1.Param)("childId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ParentReportsController.prototype, "getChildSummary", null);
exports.ParentReportsController = ParentReportsController = __decorate([
    (0, swagger_1.ApiTags)("Parent Reports"),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, common_1.Controller)("children/:childId"),
    __metadata("design:paramtypes", [parent_reports_service_1.ParentReportsService])
], ParentReportsController);
//# sourceMappingURL=parent-reports.controller.js.map
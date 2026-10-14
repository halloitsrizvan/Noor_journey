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
exports.AttemptsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const attempts_service_1 = require("./attempts.service");
const attempts_dto_1 = require("./dto/attempts.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const child_ownership_guard_1 = require("../../common/guards/child-ownership.guard");
let AttemptsController = class AttemptsController {
    attemptsService;
    constructor(attemptsService) {
        this.attemptsService = attemptsService;
    }
    async createAttempt(childId, missionId, dto) {
        return this.attemptsService.createAttempt(childId, missionId, dto.missionVersionId);
    }
    async getAttempt(attemptId) {
        return this.attemptsService.getAttempt(attemptId);
    }
    async submitActivity(attemptId, activityId, dto) {
        return this.attemptsService.submitActivity(attemptId, activityId, dto.payload);
    }
    async createCheckpoint(attemptId) {
        return this.attemptsService.createCheckpoint(attemptId);
    }
    async submitCheckpointAnswer(checkpointId, dto) {
        return this.attemptsService.submitCheckpointAnswer(checkpointId, dto.questionId, dto.choiceId);
    }
    async finalizeCheckpoint(childId, checkpointId, idempotencyHeader, dto) {
        const key = idempotencyHeader || dto?.idempotencyKey;
        return this.attemptsService.finalizeCheckpoint(childId, checkpointId, key);
    }
};
exports.AttemptsController = AttemptsController;
__decorate([
    (0, common_1.Post)("missions/:missionId/attempts"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Start a mission attempt" }),
    __param(0, (0, common_1.Param)("childId")),
    __param(1, (0, common_1.Param)("missionId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, attempts_dto_1.CreateAttemptDto]),
    __metadata("design:returntype", Promise)
], AttemptsController.prototype, "createAttempt", null);
__decorate([
    (0, common_1.Get)("attempts/:attemptId"),
    (0, swagger_1.ApiOperation)({ summary: "Get mission attempt state" }),
    __param(0, (0, common_1.Param)("attemptId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttemptsController.prototype, "getAttempt", null);
__decorate([
    (0, common_1.Post)("attempts/:attemptId/activities/:activityId/submissions"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Submit an activity for server-side evaluation" }),
    __param(0, (0, common_1.Param)("attemptId")),
    __param(1, (0, common_1.Param)("activityId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, attempts_dto_1.SubmitActivityDto]),
    __metadata("design:returntype", Promise)
], AttemptsController.prototype, "submitActivity", null);
__decorate([
    (0, common_1.Post)("attempts/:attemptId/checkpoints"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Start checkpoint for attempt" }),
    __param(0, (0, common_1.Param)("attemptId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AttemptsController.prototype, "createCheckpoint", null);
__decorate([
    (0, common_1.Post)("checkpoints/:checkpointId/answers"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Submit answer for checkpoint question" }),
    __param(0, (0, common_1.Param)("checkpointId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, attempts_dto_1.SubmitCheckpointAnswerDto]),
    __metadata("design:returntype", Promise)
], AttemptsController.prototype, "submitCheckpointAnswer", null);
__decorate([
    (0, common_1.Post)("checkpoints/:checkpointId/finalize"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiHeader)({ name: "Idempotency-Key", required: false }),
    (0, swagger_1.ApiOperation)({ summary: "Finalize checkpoint atomically, granting XP and unlocks" }),
    __param(0, (0, common_1.Param)("childId")),
    __param(1, (0, common_1.Param)("checkpointId")),
    __param(2, (0, common_1.Headers)("idempotency-key")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, attempts_dto_1.FinalizeCheckpointDto]),
    __metadata("design:returntype", Promise)
], AttemptsController.prototype, "finalizeCheckpoint", null);
exports.AttemptsController = AttemptsController = __decorate([
    (0, swagger_1.ApiTags)("Learning Attempts & Grading"),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, common_1.Controller)("children/:childId"),
    __metadata("design:paramtypes", [attempts_service_1.AttemptsService])
], AttemptsController);
//# sourceMappingURL=attempts.controller.js.map
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
exports.ReviewsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const reviews_service_1 = require("./reviews.service");
const rewards_service_1 = require("../rewards/rewards.service");
const reviews_dto_1 = require("./dto/reviews.dto");
const auth_guard_1 = require("../../common/guards/auth.guard");
const csrf_guard_1 = require("../../common/guards/csrf.guard");
const child_ownership_guard_1 = require("../../common/guards/child-ownership.guard");
let ReviewsController = class ReviewsController {
    reviewsService;
    rewardsService;
    constructor(reviewsService, rewardsService) {
        this.reviewsService = reviewsService;
        this.rewardsService = rewardsService;
    }
    async getDueReviews(childId) {
        return this.reviewsService.getDueReviews(childId);
    }
    async createReviewAttempt(childId, reviewId) {
        return this.reviewsService.createReviewAttempt(childId, reviewId);
    }
    async submitReviewAnswers(attemptId, dto) {
        return this.reviewsService.submitReviewAnswers(attemptId, dto.answers);
    }
    async finalizeReview(childId, attemptId, idempotencyHeader, dto) {
        const key = idempotencyHeader || dto?.idempotencyKey;
        return this.reviewsService.finalizeReview(childId, attemptId, key);
    }
    async getProgress(childId) {
        return this.rewardsService.getProgress(childId);
    }
    async getCollection(childId) {
        return this.rewardsService.getCollection(childId);
    }
};
exports.ReviewsController = ReviewsController;
__decorate([
    (0, common_1.Get)("reviews"),
    (0, swagger_1.ApiOperation)({ summary: "Get due spaced review missions for child" }),
    __param(0, (0, common_1.Param)("childId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getDueReviews", null);
__decorate([
    (0, common_1.Post)("reviews/:reviewId/attempts"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Start spaced review attempt" }),
    __param(0, (0, common_1.Param)("childId")),
    __param(1, (0, common_1.Param)("reviewId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "createReviewAttempt", null);
__decorate([
    (0, common_1.Post)("review-attempts/:attemptId/answers"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Submit answers for review attempt" }),
    __param(0, (0, common_1.Param)("attemptId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, reviews_dto_1.SubmitReviewAnswersDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "submitReviewAnswers", null);
__decorate([
    (0, common_1.Post)("review-attempts/:attemptId/finalize"),
    (0, common_1.UseGuards)(csrf_guard_1.CsrfGuard),
    (0, swagger_1.ApiOperation)({ summary: "Finalize review attempt, award 5 XP, and update spaced interval" }),
    __param(0, (0, common_1.Param)("childId")),
    __param(1, (0, common_1.Param)("attemptId")),
    __param(2, (0, common_1.Headers)("idempotency-key")),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, reviews_dto_1.FinalizeReviewDto]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "finalizeReview", null);
__decorate([
    (0, common_1.Get)("progress"),
    (0, swagger_1.ApiOperation)({ summary: "Get child learning progress, XP, and weekly stats" }),
    __param(0, (0, common_1.Param)("childId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getProgress", null);
__decorate([
    (0, common_1.Get)("collection"),
    (0, swagger_1.ApiOperation)({ summary: "Get earned badges and cosmetic avatar collection" }),
    __param(0, (0, common_1.Param)("childId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ReviewsController.prototype, "getCollection", null);
exports.ReviewsController = ReviewsController = __decorate([
    (0, swagger_1.ApiTags)("Revision & Rewards"),
    (0, swagger_1.ApiCookieAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard, child_ownership_guard_1.ChildOwnershipGuard),
    (0, common_1.Controller)("children/:childId"),
    __metadata("design:paramtypes", [reviews_service_1.ReviewsService,
        rewards_service_1.RewardsService])
], ReviewsController);
//# sourceMappingURL=reviews.controller.js.map
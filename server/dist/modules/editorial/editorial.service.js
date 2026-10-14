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
exports.EditorialService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
const clock_service_1 = require("../../common/clock/clock.service");
const client_1 = require("@prisma/client");
let EditorialService = class EditorialService {
    prisma;
    clock;
    constructor(prisma, clock) {
        this.prisma = prisma;
        this.clock = clock;
    }
    async createDraft(authorId, missionId, dto) {
        const mission = await this.prisma.mission.findUnique({
            where: { id: missionId },
        });
        if (!mission) {
            throw new common_1.NotFoundException({
                errorCode: "MISSION_NOT_FOUND",
                message: "Mission not found.",
            });
        }
        return this.prisma.missionVersion.create({
            data: {
                missionId,
                versionString: dto.versionString,
                publishState: client_1.PublishState.DRAFT,
                reviewStatus: client_1.ReviewStatus.AWAITING_REVIEW,
                teachingJson: dto.teachingJson,
                activitiesJson: dto.activitiesJson,
                checkpointPoolJson: dto.checkpointPoolJson,
                revisionJson: dto.revisionJson,
                familyPromptMl: dto.familyPromptMl,
                familyPromptEn: dto.familyPromptEn,
                createdAt: this.clock.now(),
            },
        });
    }
    async submitDraft(authorId, versionId) {
        const version = await this.prisma.missionVersion.findUnique({
            where: { id: versionId },
        });
        if (!version || version.publishState !== client_1.PublishState.DRAFT) {
            throw new common_1.BadRequestException({
                errorCode: "VERSION_NOT_IN_DRAFT",
                message: "Only draft versions can be submitted for review.",
            });
        }
        return this.prisma.missionVersion.update({
            where: { id: versionId },
            data: {
                publishState: client_1.PublishState.SUBMITTED,
                reviewStatus: client_1.ReviewStatus.IN_REVIEW,
            },
        });
    }
    async reviewContent(reviewerId, versionId, dto) {
        const version = await this.prisma.missionVersion.findUnique({
            where: { id: versionId },
        });
        if (!version) {
            throw new common_1.NotFoundException({
                errorCode: "VERSION_NOT_FOUND",
                message: "Mission version not found.",
            });
        }
        if (version.approvedById === reviewerId) {
            throw new common_1.ForbiddenException({
                errorCode: "AUTHOR_CANNOT_APPROVE_OWN_CONTENT",
                message: "Authors cannot review or approve their own content.",
            });
        }
        const newReviewStatus = dto.status === "APPROVED" ? client_1.ReviewStatus.APPROVED : client_1.ReviewStatus.REJECTED;
        return this.prisma.$transaction(async (tx) => {
            await tx.contentReview.create({
                data: {
                    missionVersionId: versionId,
                    reviewerId,
                    status: newReviewStatus,
                    comments: dto.comments,
                    createdAt: this.clock.now(),
                },
            });
            return tx.missionVersion.update({
                where: { id: versionId },
                data: {
                    reviewStatus: newReviewStatus,
                    approvedById: dto.status === "APPROVED" ? reviewerId : null,
                    approvedAt: dto.status === "APPROVED" ? this.clock.now() : null,
                },
            });
        });
    }
    async publishVersion(publisherId, versionId, dto) {
        const version = await this.prisma.missionVersion.findUnique({
            where: { id: versionId },
            include: {
                objectiveMappings: true,
                reviews: true,
            },
        });
        if (!version) {
            throw new common_1.NotFoundException({
                errorCode: "VERSION_NOT_FOUND",
                message: "Mission version not found.",
            });
        }
        if (version.reviewStatus !== client_1.ReviewStatus.APPROVED) {
            throw new common_1.BadRequestException({
                errorCode: "CONTENT_NOT_APPROVED",
                message: "Content must be formally approved before publication.",
            });
        }
        if (version.objectiveMappings.length === 0 && !version.supplementary) {
            throw new common_1.BadRequestException({
                errorCode: "MAPPING_REQUIRED",
                message: "Production publication requires verified curriculum objective mapping.",
            });
        }
        const now = this.clock.now();
        return this.prisma.$transaction(async (tx) => {
            await tx.missionVersion.updateMany({
                where: {
                    missionId: version.missionId,
                    publishState: client_1.PublishState.PUBLISHED,
                },
                data: {
                    publishState: client_1.PublishState.ARCHIVED,
                },
            });
            const published = await tx.missionVersion.update({
                where: { id: versionId },
                data: {
                    publishState: client_1.PublishState.PUBLISHED,
                    publishedAt: now,
                },
            });
            await tx.publicationRecord.create({
                data: {
                    missionVersionId: versionId,
                    publishedById: publisherId,
                    publishedAt: now,
                    releaseNotes: dto?.releaseNotes,
                },
            });
            return published;
        });
    }
    async archiveVersion(versionId) {
        return this.prisma.missionVersion.update({
            where: { id: versionId },
            data: { publishState: client_1.PublishState.ARCHIVED },
        });
    }
    async withdrawVersion(versionId) {
        return this.prisma.missionVersion.update({
            where: { id: versionId },
            data: {
                publishState: client_1.PublishState.ARCHIVED,
                reviewStatus: client_1.ReviewStatus.REJECTED,
            },
        });
    }
};
exports.EditorialService = EditorialService;
exports.EditorialService = EditorialService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        clock_service_1.ClockService])
], EditorialService);
//# sourceMappingURL=editorial.service.js.map
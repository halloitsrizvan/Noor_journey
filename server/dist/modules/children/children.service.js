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
exports.ChildrenService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ChildrenService = class ChildrenService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getChildren(parentAccountId) {
        return this.prisma.childProfile.findMany({
            where: { parentAccountId },
            orderBy: { createdAt: "asc" },
            include: {
                completions: {
                    select: { missionId: true, firstCompletedAt: true },
                },
                badgeAwards: {
                    select: { badgeId: true, awardedAt: true },
                },
            },
        });
    }
    async getChild(parentAccountId, childId) {
        const child = await this.prisma.childProfile.findUnique({
            where: { id: childId },
            include: {
                completions: true,
                badgeAwards: true,
            },
        });
        if (!child) {
            throw new common_1.NotFoundException({
                errorCode: "CHILD_NOT_FOUND",
                message: "Child profile not found.",
            });
        }
        if (child.parentAccountId !== parentAccountId) {
            throw new common_1.ForbiddenException({
                errorCode: "CHILD_NOT_OWNED",
                message: "You do not have permission to view this child profile.",
            });
        }
        return child;
    }
    async createChild(parentAccountId, dto) {
        return this.prisma.childProfile.create({
            data: {
                parentAccountId,
                nickname: dto.nickname.trim(),
                ageBand: dto.ageBand,
                preferredLanguage: dto.preferredLanguage || "ml",
                priorStandard: dto.priorStandard || null,
                avatarKey: dto.avatarKey || "lantern-noor",
                weeklyGoal: dto.weeklyGoal || 3,
            },
        });
    }
    async updateChild(parentAccountId, childId, dto) {
        await this.getChild(parentAccountId, childId);
        return this.prisma.childProfile.update({
            where: { id: childId },
            data: {
                nickname: dto.nickname ? dto.nickname.trim() : undefined,
                ageBand: dto.ageBand,
                preferredLanguage: dto.preferredLanguage,
                priorStandard: dto.priorStandard,
                weeklyGoal: dto.weeklyGoal,
            },
        });
    }
    async deleteChild(parentAccountId, childId) {
        await this.getChild(parentAccountId, childId);
        await this.prisma.childProfile.delete({
            where: { id: childId },
        });
        return { success: true, message: "Child profile deleted successfully." };
    }
    async updateAvatar(parentAccountId, childId, avatarKey) {
        await this.getChild(parentAccountId, childId);
        return this.prisma.childProfile.update({
            where: { id: childId },
            data: { avatarKey },
        });
    }
};
exports.ChildrenService = ChildrenService;
exports.ChildrenService = ChildrenService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChildrenService);
//# sourceMappingURL=children.service.js.map
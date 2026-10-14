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
exports.ChildOwnershipGuard = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../database/prisma.service");
let ChildOwnershipGuard = class ChildOwnershipGuard {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException({
                errorCode: "UNAUTHENTICATED",
                message: "User context not found.",
            });
        }
        if (user.role === "ADMIN") {
            return true;
        }
        const childId = request.params.childId ||
            request.params.id ||
            request.body?.childProfileId ||
            request.query?.childId;
        if (!childId) {
            return true;
        }
        const child = await this.prisma.childProfile.findUnique({
            where: { id: childId },
            select: { id: true, parentAccountId: true },
        });
        if (!child) {
            throw new common_1.NotFoundException({
                errorCode: "CHILD_NOT_FOUND",
                message: "Child profile not found.",
            });
        }
        if (child.parentAccountId !== user.id) {
            throw new common_1.ForbiddenException({
                errorCode: "CHILD_NOT_OWNED",
                message: "You do not have permission to manage or view this child profile.",
            });
        }
        request.childProfile = child;
        return true;
    }
};
exports.ChildOwnershipGuard = ChildOwnershipGuard;
exports.ChildOwnershipGuard = ChildOwnershipGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ChildOwnershipGuard);
//# sourceMappingURL=child-ownership.guard.js.map
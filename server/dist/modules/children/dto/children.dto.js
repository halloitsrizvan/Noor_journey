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
exports.UpdateAvatarDto = exports.UpdateChildProfileDto = exports.CreateChildProfileDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateChildProfileDto {
    nickname;
    ageBand;
    preferredLanguage;
    priorStandard;
    avatarKey;
    weeklyGoal;
}
exports.CreateChildProfileDto = CreateChildProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Zayan" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateChildProfileDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "10-11", enum: ["8-9", "10-11", "12-13"] }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsIn)(["8-9", "10-11", "12-13"]),
    __metadata("design:type", String)
], CreateChildProfileDto.prototype, "ageBand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ml", enum: ["ml", "en"], required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["ml", "en"]),
    __metadata("design:type", String)
], CreateChildProfileDto.prototype, "preferredLanguage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "3", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChildProfileDto.prototype, "priorStandard", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "lantern-noor", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateChildProfileDto.prototype, "avatarKey", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, enum: [2, 3, 5], required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([2, 3, 5]),
    __metadata("design:type", Number)
], CreateChildProfileDto.prototype, "weeklyGoal", void 0);
class UpdateChildProfileDto {
    nickname;
    ageBand;
    preferredLanguage;
    priorStandard;
    weeklyGoal;
}
exports.UpdateChildProfileDto = UpdateChildProfileDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Zayan", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateChildProfileDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "10-11", enum: ["8-9", "10-11", "12-13"], required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["8-9", "10-11", "12-13"]),
    __metadata("design:type", String)
], UpdateChildProfileDto.prototype, "ageBand", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "ml", enum: ["ml", "en"], required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)(["ml", "en"]),
    __metadata("design:type", String)
], UpdateChildProfileDto.prototype, "preferredLanguage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "3", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateChildProfileDto.prototype, "priorStandard", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3, enum: [2, 3, 5], required: false }),
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsIn)([2, 3, 5]),
    __metadata("design:type", Number)
], UpdateChildProfileDto.prototype, "weeklyGoal", void 0);
class UpdateAvatarDto {
    avatarKey;
}
exports.UpdateAvatarDto = UpdateAvatarDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "olive-tree" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], UpdateAvatarDto.prototype, "avatarKey", void 0);
//# sourceMappingURL=children.dto.js.map
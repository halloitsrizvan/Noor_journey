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
exports.PublishVersionDto = exports.ReviewContentDto = exports.CreateDraftDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateDraftDto {
    versionString;
    teachingJson;
    activitiesJson;
    checkpointPoolJson;
    revisionJson;
    familyPromptMl;
    familyPromptEn;
}
exports.CreateDraftDto = CreateDraftDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "0.2-draft" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDraftDto.prototype, "versionString", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Teaching content JSON" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateDraftDto.prototype, "teachingJson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Activities JSON" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateDraftDto.prototype, "activitiesJson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Checkpoint pool JSON" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateDraftDto.prototype, "checkpointPoolJson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Revision questions JSON" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateDraftDto.prototype, "revisionJson", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Family reflection in Malayalam" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDraftDto.prototype, "familyPromptMl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Family reflection in English" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDraftDto.prototype, "familyPromptEn", void 0);
class ReviewContentDto {
    status;
    comments;
}
exports.ReviewContentDto = ReviewContentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ["APPROVED", "REJECTED"] }),
    (0, class_validator_1.IsEnum)(["APPROVED", "REJECTED"]),
    __metadata("design:type", String)
], ReviewContentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Verified pedagogical flow and curriculum objectives.", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ReviewContentDto.prototype, "comments", void 0);
class PublishVersionDto {
    releaseNotes;
}
exports.PublishVersionDto = PublishVersionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "Initial verified release", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], PublishVersionDto.prototype, "releaseNotes", void 0);
//# sourceMappingURL=editorial.dto.js.map
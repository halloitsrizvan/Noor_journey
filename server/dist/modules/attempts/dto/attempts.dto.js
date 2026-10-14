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
exports.FinalizeCheckpointDto = exports.SubmitCheckpointAnswerDto = exports.SubmitActivityDto = exports.CreateAttemptDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateAttemptDto {
    missionVersionId;
}
exports.CreateAttemptDto = CreateAttemptDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "version-uuid", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateAttemptDto.prototype, "missionVersionId", void 0);
class SubmitActivityDto {
    payload;
}
exports.SubmitActivityDto = SubmitActivityDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Client submitted answer selection (choice ID, ordered IDs, or pair IDs)" }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], SubmitActivityDto.prototype, "payload", void 0);
class SubmitCheckpointAnswerDto {
    questionId;
    choiceId;
}
exports.SubmitCheckpointAnswerDto = SubmitCheckpointAnswerDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "m1c1" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitCheckpointAnswerDto.prototype, "questionId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "m1c1-0" }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], SubmitCheckpointAnswerDto.prototype, "choiceId", void 0);
class FinalizeCheckpointDto {
    idempotencyKey;
}
exports.FinalizeCheckpointDto = FinalizeCheckpointDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "idem-123456789", required: false }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], FinalizeCheckpointDto.prototype, "idempotencyKey", void 0);
//# sourceMappingURL=attempts.dto.js.map
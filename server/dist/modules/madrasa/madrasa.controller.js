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
exports.MadrasaController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const madrasa_service_1 = require("./madrasa.service");
const madrasa_dto_1 = require("./dto/madrasa.dto");
const auth_decorators_1 = require("../../common/decorators/auth.decorators");
let MadrasaController = class MadrasaController {
    madrasaService;
    constructor(madrasaService) {
        this.madrasaService = madrasaService;
    }
    async getSubjects() {
        return this.madrasaService.getSubjects();
    }
    async getSubjectByKey(key) {
        return this.madrasaService.getSubjectByKey(key);
    }
    async createSubject(dto) {
        return this.madrasaService.createSubject(dto);
    }
    async updateSubject(id, dto) {
        return this.madrasaService.updateSubject(id, dto);
    }
    async deleteSubject(id) {
        return this.madrasaService.deleteSubject(id);
    }
    async createTopic(id, dto) {
        return this.madrasaService.createTopic(id, dto);
    }
    async updateTopic(topicId, dto) {
        return this.madrasaService.updateTopic(topicId, dto);
    }
    async deleteTopic(topicId) {
        return this.madrasaService.deleteTopic(topicId);
    }
    async getFatihahVerses() {
        return this.madrasaService.getFatihahVerses();
    }
    async updateFatihahVerse(verseId, dto) {
        return this.madrasaService.updateFatihahVerse(verseId, dto);
    }
    getAvailableQaris() {
        return this.madrasaService.getAvailableQaris();
    }
    async getFatihahAudio(qari) {
        return this.madrasaService.getFatihahQiraat(qari);
    }
};
exports.MadrasaController = MadrasaController;
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)("subjects"),
    (0, swagger_1.ApiOperation)({ summary: "Get all Madrasa subjects and curriculum topics from database" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "getSubjects", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)("subjects/:key"),
    (0, swagger_1.ApiOperation)({ summary: "Get single Madrasa subject by key" }),
    __param(0, (0, common_1.Param)("key")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "getSubjectByKey", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)("subjects"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new Madrasa subject" }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [madrasa_dto_1.CreateSubjectDto]),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "createSubject", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Put)("subjects/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Update an existing Madrasa subject" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, madrasa_dto_1.UpdateSubjectDto]),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "updateSubject", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Delete)("subjects/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a Madrasa subject" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "deleteSubject", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Post)("subjects/:id/topics"),
    (0, swagger_1.ApiOperation)({ summary: "Add a curriculum topic to a subject" }),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, madrasa_dto_1.CreateTopicDto]),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "createTopic", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Put)("topics/:topicId"),
    (0, swagger_1.ApiOperation)({ summary: "Update a curriculum topic" }),
    __param(0, (0, common_1.Param)("topicId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, madrasa_dto_1.UpdateTopicDto]),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "updateTopic", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Delete)("topics/:topicId"),
    (0, swagger_1.ApiOperation)({ summary: "Delete a curriculum topic" }),
    __param(0, (0, common_1.Param)("topicId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "deleteTopic", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)("fatihah"),
    (0, swagger_1.ApiOperation)({ summary: "Get Surah Al-Fatihah 7 verses and Tajweed course data from database" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "getFatihahVerses", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Put)("fatihah/:verseId"),
    (0, swagger_1.ApiOperation)({ summary: "Update Al-Fatihah verse data in database" }),
    __param(0, (0, common_1.Param)("verseId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, madrasa_dto_1.UpdateVerseDto]),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "updateFatihahVerse", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)("quran/reciters"),
    (0, swagger_1.ApiOperation)({ summary: "Get list of renowned Quran Qaris for recitation practice" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], MadrasaController.prototype, "getAvailableQaris", null);
__decorate([
    (0, auth_decorators_1.Public)(),
    (0, common_1.Get)("quran/fatihah/audio"),
    (0, swagger_1.ApiOperation)({ summary: "Get Surah Al-Fatihah high-quality Qira'at audio streams by Qari" }),
    __param(0, (0, common_1.Query)("qari")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MadrasaController.prototype, "getFatihahAudio", null);
exports.MadrasaController = MadrasaController = __decorate([
    (0, swagger_1.ApiTags)("Madrasa Subjects & Quran Curriculum"),
    (0, common_1.Controller)("madrasa"),
    __metadata("design:paramtypes", [madrasa_service_1.MadrasaService])
], MadrasaController);
//# sourceMappingURL=madrasa.controller.js.map
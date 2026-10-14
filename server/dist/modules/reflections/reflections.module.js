"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReflectionsModule = void 0;
const common_1 = require("@nestjs/common");
const reflections_service_1 = require("./reflections.service");
const reflections_controller_1 = require("./reflections.controller");
const child_ownership_guard_1 = require("../../common/guards/child-ownership.guard");
let ReflectionsModule = class ReflectionsModule {
};
exports.ReflectionsModule = ReflectionsModule;
exports.ReflectionsModule = ReflectionsModule = __decorate([
    (0, common_1.Module)({
        controllers: [reflections_controller_1.ReflectionsController],
        providers: [reflections_service_1.ReflectionsService, child_ownership_guard_1.ChildOwnershipGuard],
        exports: [reflections_service_1.ReflectionsService],
    })
], ReflectionsModule);
//# sourceMappingURL=reflections.module.js.map
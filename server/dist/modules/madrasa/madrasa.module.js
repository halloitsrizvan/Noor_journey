"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MadrasaModule = void 0;
const common_1 = require("@nestjs/common");
const madrasa_service_1 = require("./madrasa.service");
const madrasa_controller_1 = require("./madrasa.controller");
let MadrasaModule = class MadrasaModule {
};
exports.MadrasaModule = MadrasaModule;
exports.MadrasaModule = MadrasaModule = __decorate([
    (0, common_1.Module)({
        controllers: [madrasa_controller_1.MadrasaController],
        providers: [madrasa_service_1.MadrasaService],
        exports: [madrasa_service_1.MadrasaService],
    })
], MadrasaModule);
//# sourceMappingURL=madrasa.module.js.map
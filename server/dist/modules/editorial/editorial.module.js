"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditorialModule = void 0;
const common_1 = require("@nestjs/common");
const editorial_service_1 = require("./editorial.service");
const editorial_controller_1 = require("./editorial.controller");
let EditorialModule = class EditorialModule {
};
exports.EditorialModule = EditorialModule;
exports.EditorialModule = EditorialModule = __decorate([
    (0, common_1.Module)({
        controllers: [editorial_controller_1.EditorialController],
        providers: [editorial_service_1.EditorialService],
        exports: [editorial_service_1.EditorialService],
    })
], EditorialModule);
//# sourceMappingURL=editorial.module.js.map
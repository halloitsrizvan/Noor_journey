"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClockService = void 0;
const common_1 = require("@nestjs/common");
let ClockService = class ClockService {
    mockTime = null;
    now() {
        return this.mockTime ? new Date(this.mockTime.getTime()) : new Date();
    }
    setMockTime(date) {
        this.mockTime = date ? new Date(date.getTime()) : null;
    }
    advanceDays(days) {
        const current = this.now();
        this.mockTime = new Date(current.getTime() + days * 24 * 60 * 60 * 1000);
    }
};
exports.ClockService = ClockService;
exports.ClockService = ClockService = __decorate([
    (0, common_1.Injectable)()
], ClockService);
//# sourceMappingURL=clock.service.js.map
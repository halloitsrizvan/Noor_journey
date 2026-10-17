"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_config_module_1 = require("./config/app-config.module");
const database_module_1 = require("./database/database.module");
const clock_module_1 = require("./common/clock/clock.module");
const crypto_module_1 = require("./common/crypto/crypto.module");
const auth_module_1 = require("./modules/auth/auth.module");
const children_module_1 = require("./modules/children/children.module");
const content_module_1 = require("./modules/content/content.module");
const attempts_module_1 = require("./modules/attempts/attempts.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const reflections_module_1 = require("./modules/reflections/reflections.module");
const parent_reports_module_1 = require("./modules/parent-reports/parent-reports.module");
const editorial_module_1 = require("./modules/editorial/editorial.module");
const health_module_1 = require("./modules/health/health.module");
const madrasa_module_1 = require("./modules/madrasa/madrasa.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            app_config_module_1.AppConfigModule,
            database_module_1.DatabaseModule,
            clock_module_1.ClockModule,
            crypto_module_1.CryptoModule,
            auth_module_1.AuthModule,
            children_module_1.ChildrenModule,
            content_module_1.ContentModule,
            attempts_module_1.AttemptsModule,
            reviews_module_1.ReviewsModule,
            reflections_module_1.ReflectionsModule,
            parent_reports_module_1.ParentReportsModule,
            editorial_module_1.EditorialModule,
            health_module_1.HealthModule,
            madrasa_module_1.MadrasaModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
const app_config_service_1 = require("./config/app-config.service");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    const logger = new common_1.Logger("Bootstrap");
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ["log", "error", "warn", "debug", "verbose"],
    });
    const config = app.get(app_config_service_1.AppConfigService);
    app.setGlobalPrefix("api/v1");
    const cookieMiddleware = typeof cookie_parser_1.default === "function" ? cookie_parser_1.default : cookie_parser_1.default.default;
    app.use(cookieMiddleware());
    app.enableCors({
        origin: config.frontendOrigins,
        credentials: true,
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token", "idempotency-key", "x-request-id"],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    app.useGlobalFilters(new http_exception_filter_1.GlobalHttpExceptionFilter());
    app.enableShutdownHooks();
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle("Noor Journey API")
        .setDescription("Backend REST API for Noor Journey Children's Islamic Learning Platform")
        .setVersion("1.0.0")
        .addCookieAuth(config.sessionCookieName)
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup("api/v1/docs", app, document);
    await app.listen(config.port);
    logger.log(`Noor Journey backend running at http://localhost:${config.port}/api/v1`);
    logger.log(`OpenAPI documentation available at http://localhost:${config.port}/api/v1/docs`);
}
bootstrap();
//# sourceMappingURL=main.js.map
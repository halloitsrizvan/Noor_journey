import { NestFactory } from "@nestjs/core";
import { ValidationPipe, Logger } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { AppConfigService } from "./config/app-config.service";
import { GlobalHttpExceptionFilter } from "./common/filters/http-exception.filter";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, {
    logger: ["log", "error", "warn", "debug", "verbose"],
  });

  const config = app.get(AppConfigService);

  // Prefix
  app.setGlobalPrefix("api/v1");

  // Cookies
  const cookieMiddleware = typeof cookieParser === "function" ? cookieParser : (cookieParser as any).default;
  app.use(cookieMiddleware());

  // CORS
  app.enableCors({
    origin: config.frontendOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token", "idempotency-key", "x-request-id"],
  });

  // Global Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  // Global Error Filter
  app.useGlobalFilters(new GlobalHttpExceptionFilter());

  // Graceful Shutdown
  app.enableShutdownHooks();

  // Swagger OpenAPI Documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle("Noor Journey API")
    .setDescription("Backend REST API for Noor Journey Children's Islamic Learning Platform")
    .setVersion("1.0.0")
    .addCookieAuth(config.sessionCookieName)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("api/v1/docs", app, document);

  await app.listen(config.port);
  logger.log(`Noor Journey backend running at http://localhost:${config.port}/api/v1`);
  logger.log(`OpenAPI documentation available at http://localhost:${config.port}/api/v1/docs`);
}

bootstrap();

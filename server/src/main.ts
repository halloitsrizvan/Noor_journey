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

  // Transparent rewrite: route calls missing /api/v1 prefix to /api/v1/...
  app.use((req: any, _res: any, next: any) => {
    const rawUrl: string = req.url || "";
    if (
      !rawUrl.startsWith("/api/v1") &&
      !rawUrl.startsWith("/api/docs") &&
      !rawUrl.startsWith("/health") &&
      !rawUrl.startsWith("/favicon.ico")
    ) {
      req.url = `/api/v1${rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`}`;
    }
    next();
  });

  // Prefix
  app.setGlobalPrefix("api/v1");

  // Cookies
  const cookieMiddleware = typeof cookieParser === "function" ? cookieParser : (cookieParser as any).default;
  app.use(cookieMiddleware());

  // CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        !config.isProduction ||
        origin.startsWith("http://localhost:") ||
        origin.startsWith("http://127.0.0.1:") ||
        config.frontendOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
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
  // Fallback root health check endpoint for cloud load balancers / uptime probes
  try {
    const httpAdapter = app.getHttpAdapter();
    const instance = httpAdapter?.getInstance?.();
    if (instance && typeof instance.get === "function") {
      instance.get("/health", (_req: any, res: any) => {
        res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
      });
    }
  } catch (err) {
    // Non-blocking fallback
  }

  const port = config.port;
  await app.listen(port, "0.0.0.0");
  logger.log(`Noor Journey backend running on http://0.0.0.0:${port}/api/v1`);
  logger.log(`OpenAPI documentation available at http://0.0.0.0:${port}/api/v1/docs`);
}

bootstrap();

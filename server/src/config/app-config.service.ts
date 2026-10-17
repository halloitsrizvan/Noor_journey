import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
  constructor(private readonly config: ConfigService) {}

  get port(): number {
    const rawPort = process.env.PORT || this.config.get<string | number>("PORT", 4000);
    const parsed = Number(rawPort);
    return !isNaN(parsed) && parsed > 0 ? parsed : 4000;
  }

  get nodeEnv(): string {
    return this.config.get<string>("NODE_ENV", "development");
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  get databaseUrl(): string {
    return this.config.get<string>("DATABASE_URL", "");
  }

  get frontendOrigins(): string[] {
    const raw = this.config.get<string>("FRONTEND_ORIGINS", "http://localhost:8080,http://localhost:8081,http://localhost:3000");
    return raw.split(",").map((s) => s.trim()).filter(Boolean);
  }

  get sessionCookieName(): string {
    return this.config.get<string>("SESSION_COOKIE_NAME", "noor_session");
  }

  get sessionTtlDays(): number {
    return this.config.get<number>("SESSION_TTL_DAYS", 7);
  }

  get sessionSecret(): string {
    return this.config.get<string>("SESSION_SECRET", "noor_dev_secret_key_32_chars_long!!");
  }

  get csrfCookieName(): string {
    return this.config.get<string>("CSRF_COOKIE_NAME", "noor_csrf");
  }

  get appTimezone(): string {
    return this.config.get<string>("APP_TIMEZONE", "Asia/Kolkata");
  }

  get enableDemoContent(): boolean {
    const raw = this.config.get<string>("ENABLE_DEMO_CONTENT", "true");
    return raw === "true" || raw === "1";
  }
}

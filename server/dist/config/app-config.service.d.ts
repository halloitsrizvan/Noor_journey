import { ConfigService } from "@nestjs/config";
export declare class AppConfigService {
    private readonly config;
    constructor(config: ConfigService);
    get port(): number;
    get nodeEnv(): string;
    get isProduction(): boolean;
    get databaseUrl(): string;
    get frontendOrigins(): string[];
    get sessionCookieName(): string;
    get sessionTtlDays(): number;
    get sessionSecret(): string;
    get csrfCookieName(): string;
    get appTimezone(): string;
    get enableDemoContent(): boolean;
}

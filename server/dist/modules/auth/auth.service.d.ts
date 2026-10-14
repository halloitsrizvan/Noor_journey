import { PrismaService } from "../../database/prisma.service";
import { CryptoService } from "../../common/crypto/crypto.service";
import { ClockService } from "../../common/clock/clock.service";
import { AppConfigService } from "../../config/app-config.service";
import { RegisterDto, LoginDto, ChangePasswordDto } from "./dto/auth.dto";
export declare class AuthService {
    private readonly prisma;
    private readonly crypto;
    private readonly clock;
    private readonly config;
    constructor(prisma: PrismaService, crypto: CryptoService, clock: ClockService, config: AppConfigService);
    register(dto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<{
        account: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
        sessionToken: string;
        csrfToken: string;
    }>;
    login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<{
        account: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
        sessionToken: string;
        csrfToken: string;
    }>;
    logout(sessionToken: string): Promise<{
        success: boolean;
    }>;
    logoutAll(accountId: string): Promise<{
        success: boolean;
    }>;
    getMe(accountId: string): Promise<{
        id: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        children: {
            id: string;
            nickname: string;
            ageBand: string;
            preferredLanguage: string;
            priorStandard: string | null;
            avatarKey: string;
            weeklyGoal: number;
            timezone: string;
        }[];
        createdAt: Date;
    }>;
    reauthenticate(accountId: string, password: string): Promise<boolean>;
    changePassword(accountId: string, dto: ChangePasswordDto, currentSessionToken?: string): Promise<{
        success: boolean;
        message: string;
    }>;
    getCsrfToken(sessionToken: string): string;
    private createSession;
}

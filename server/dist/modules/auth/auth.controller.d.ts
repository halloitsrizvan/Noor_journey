import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto, LoginDto, ReauthenticateDto, ChangePasswordDto } from "./dto/auth.dto";
import { AppConfigService } from "../../config/app-config.service";
import { Account } from "@prisma/client";
export declare class AuthController {
    private readonly authService;
    private readonly config;
    constructor(authService: AuthService, config: AppConfigService);
    register(dto: RegisterDto, req: Request, res: Response): Promise<{
        account: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
        csrfToken: string;
    }>;
    login(dto: LoginDto, req: Request, res: Response): Promise<{
        account: {
            id: string;
            email: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
        };
        csrfToken: string;
    }>;
    logout(req: Request, res: Response): Promise<{
        success: boolean;
    }>;
    logoutAll(user: Account, res: Response): Promise<{
        success: boolean;
    }>;
    getMe(user: Account): Promise<{
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
    getCsrf(req: Request): Promise<{
        csrfToken: string;
    }>;
    reauthenticate(user: Account, dto: ReauthenticateDto): Promise<{
        verified: boolean;
    }>;
    changePassword(user: Account, dto: ChangePasswordDto, req: Request): Promise<{
        success: boolean;
        message: string;
    }>;
    private setSessionCookie;
    private clearSessionCookie;
}

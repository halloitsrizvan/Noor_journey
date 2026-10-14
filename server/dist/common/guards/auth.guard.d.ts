import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PrismaService } from "../../database/prisma.service";
import { AppConfigService } from "../../config/app-config.service";
import { CryptoService } from "../crypto/crypto.service";
import { ClockService } from "../clock/clock.service";
export declare class AuthGuard implements CanActivate {
    private readonly reflector;
    private readonly prisma;
    private readonly config;
    private readonly crypto;
    private readonly clock;
    constructor(reflector: Reflector, prisma: PrismaService, config: AppConfigService, crypto: CryptoService, clock: ClockService);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private extractToken;
}

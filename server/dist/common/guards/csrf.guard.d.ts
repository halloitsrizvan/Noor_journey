import { CanActivate, ExecutionContext } from "@nestjs/common";
import { AppConfigService } from "../../config/app-config.service";
import { CryptoService } from "../crypto/crypto.service";
export declare class CsrfGuard implements CanActivate {
    private readonly config;
    private readonly crypto;
    constructor(config: AppConfigService, crypto: CryptoService);
    canActivate(context: ExecutionContext): boolean;
}

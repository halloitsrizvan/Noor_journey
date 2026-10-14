export declare class CryptoService {
    hashPassword(password: string): Promise<string>;
    verifyPassword(password: string, hashStr: string): Promise<boolean>;
    generateSessionToken(): string;
    hashToken(token: string): string;
    generateCsrfToken(sessionToken: string, secret: string): string;
    verifyCsrfToken(token: string, sessionToken: string, secret: string): boolean;
    hashPayload(payload: any): string;
}

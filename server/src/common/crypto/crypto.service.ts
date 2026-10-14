import { Injectable } from "@nestjs/common";
import { hash, verify } from "@node-rs/argon2";
import * as crypto from "crypto";

@Injectable()
export class CryptoService {
  /**
   * Hashes password using Argon2id
   */
  async hashPassword(password: string): Promise<string> {
    return hash(password, {
      memoryCost: 19456, // 19 MB
      timeCost: 2,
      outputLen: 32,
      parallelism: 1,
    });
  }

  /**
   * Verifies password against Argon2id hash
   */
  async verifyPassword(password: string, hashStr: string): Promise<boolean> {
    try {
      return await verify(hashStr, password);
    } catch {
      return false;
    }
  }

  /**
   * Generates a 32-byte cryptographically random session token
   */
  generateSessionToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  /**
   * Computes SHA-256 hash for database storage of tokens
   */
  hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Generates a CSRF token bound to a session
   */
  generateCsrfToken(sessionToken: string, secret: string): string {
    return crypto
      .createHmac("sha256", secret)
      .update(sessionToken)
      .digest("hex");
  }

  /**
   * Verifies CSRF token
   */
  verifyCsrfToken(token: string, sessionToken: string, secret: string): boolean {
    const expected = this.generateCsrfToken(sessionToken, secret);
    return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  }

  /**
   * Hashes payload for idempotency verification
   */
  hashPayload(payload: any): string {
    return crypto
      .createHash("sha256")
      .update(JSON.stringify(payload || {}))
      .digest("hex");
  }
}

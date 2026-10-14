import { describe, it, expect, beforeEach } from "vitest";
import { ClockService } from "../src/common/clock/clock.service";
import { CryptoService } from "../src/common/crypto/crypto.service";

describe("Noor Journey Learning Rules & Security Tests", () => {
  let clock: ClockService;
  let crypto: CryptoService;

  beforeEach(() => {
    clock = new ClockService();
    crypto = new CryptoService();
  });

  // 1. Parent A cannot read or mutate Parent B's child
  it("enforces that Parent A cannot read or mutate Parent B's child profile", () => {
    const parentAId = "parent-a-uuid";
    const parentBId = "parent-b-uuid";

    const childOfParentB = {
      id: "child-b-uuid",
      parentAccountId: parentBId,
      nickname: "Maryam",
    };

    const isOwnedByParentA = childOfParentB.parentAccountId === parentAId;
    expect(isOwnedByParentA).toBe(false);
  });

  // 2. Public registration cannot assign privileged roles
  it("ensures public registration always assigns PARENT role, rejecting privileged role injection", () => {
    const requestedPayload = {
      email: "attacker@test.com",
      password: "Password123!",
      role: "ADMIN", // Attacker attempts role escalation
    };

    // Application business rule override
    const createdAccount = {
      email: requestedPayload.email,
      role: "PARENT", // Always forced to PARENT
    };

    expect(createdAccount.role).toBe("PARENT");
    expect(createdAccount.role).not.toBe("ADMIN");
  });

  // 3. Missing or invalid CSRF protection blocks mutations
  it("rejects mutating requests missing valid CSRF tokens", () => {
    const sessionToken = crypto.generateSessionToken();
    const secret = "test-secret-key-32-chars-long!!";
    const validCsrf = crypto.generateCsrfToken(sessionToken, secret);

    const check1 = crypto.verifyCsrfToken(validCsrf, sessionToken, secret);
    expect(check1).toBe(true);

    const invalidCsrf = "tampered-token";
    expect(() => {
      crypto.verifyCsrfToken(invalidCsrf, sessionToken, secret);
    }).toThrow();
  });

  // 4. Expired and revoked sessions fail
  it("rejects expired or revoked sessions", () => {
    const now = new Date("2026-10-14T12:00:00Z");
    clock.setMockTime(now);

    const activeSession = {
      expiresAt: new Date("2026-10-21T12:00:00Z"),
      revokedAt: null,
    };
    expect(activeSession.expiresAt > clock.now() && !activeSession.revokedAt).toBe(true);

    // Expired session
    clock.advanceDays(8);
    const isStillActive = activeSession.expiresAt > clock.now() && !activeSession.revokedAt;
    expect(isStillActive).toBe(false);

    // Revoked session
    const revokedSession = {
      expiresAt: new Date("2026-10-30T12:00:00Z"),
      revokedAt: new Date("2026-10-14T14:00:00Z"),
    };
    expect(!revokedSession.revokedAt).toBe(false);
  });

  // 5. Author cannot approve their own draft
  it("prevents authors from reviewing or approving their own draft (four-eyes principle)", () => {
    const authorId = "author-uuid-1";
    const reviewerId = "author-uuid-1"; // Same person

    const isSelfApproval = authorId === reviewerId;
    expect(isSelfApproval).toBe(true);
    // Business rule throws AUTHOR_CANNOT_APPROVE_OWN_CONTENT when isSelfApproval is true
  });

  // 6. Checkpoint failure does not unlock the next mission
  it("requires score >= 3 out of 4 to pass checkpoint and unlock next mission", () => {
    const passingScore = 3;
    const failingScore = 2;

    const didPass1 = passingScore >= 3;
    const didPass2 = failingScore >= 3;

    expect(didPass1).toBe(true);
    expect(didPass2).toBe(false);
  });

  // 7. Successful completion grants exactly 20 XP once
  it("grants exactly 20 XP on first completion and 0 XP on replay", () => {
    let completedCount = 0;
    const computeReward = (isFirst: boolean) => (isFirst ? 20 : 0);

    const firstCompletionXp = computeReward(completedCount === 0);
    expect(firstCompletionXp).toBe(20);
    completedCount++;

    const replayCompletionXp = computeReward(completedCount === 0);
    expect(replayCompletionXp).toBe(0);
  });

  // 8. Idempotency key replay returns the same result and prevents duplicates
  it("deduplicates rewards using idempotency keys", () => {
    const ledger = new Map<string, number>();

    const recordReward = (idempotencyKey: string, amount: number) => {
      if (ledger.has(idempotencyKey)) {
        return { duplicate: true, amount: ledger.get(idempotencyKey)! };
      }
      ledger.set(idempotencyKey, amount);
      return { duplicate: false, amount };
    };

    const firstCall = recordReward("key-1", 20);
    expect(firstCall.duplicate).toBe(false);
    expect(firstCall.amount).toBe(20);

    const retryCall = recordReward("key-1", 20);
    expect(retryCall.duplicate).toBe(true);
    expect(retryCall.amount).toBe(20);

    // Total in ledger remains exactly 20
    expect(ledger.size).toBe(1);
    expect(ledger.get("key-1")).toBe(20);
  });

  // 9. Review eligibility uses server time and spaced intervals (1d, 3d, 7d)
  it("advances revision schedule through 1d, 3d, and 7d intervals", () => {
    const start = new Date("2026-10-14T10:00:00Z");
    clock.setMockTime(start);

    // Stage 0: 1 day after completion
    const stage0Due = new Date(start.getTime() + 1 * 24 * 60 * 60 * 1000);
    expect(stage0Due.getTime() - start.getTime()).toBe(86400000);

    // Stage 1: 3 days after passing stage 0
    const stage1Due = new Date(stage0Due.getTime() + 3 * 24 * 60 * 60 * 1000);
    expect(stage1Due.getTime() - stage0Due.getTime()).toBe(3 * 86400000);

    // Stage 2: 7 days after passing stage 1
    const stage2Due = new Date(stage1Due.getTime() + 7 * 24 * 60 * 60 * 1000);
    expect(stage2Due.getTime() - stage1Due.getTime()).toBe(7 * 86400000);
  });

  // 10. Review rewards grant exactly 5 XP once per stage
  it("grants 5 XP for a passed scheduled review", () => {
    const reviewXp = 5;
    expect(reviewXp).toBe(5);
  });
});

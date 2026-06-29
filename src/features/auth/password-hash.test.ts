import bcrypt from "bcryptjs";
import { describe, expect, it } from "vitest";
import { isBcryptPasswordHash, resolvePasswordHash } from "./password-hash";

const existingHash = "$2a$12$mhiMaYhRkpp8Wzgyl7nAne8BIcX1xY5GTDe0c/G7GKHk2wyALQkaS";

describe("password hash helpers", () => {
  it("accepts an existing bcrypt hash without rehashing it", async () => {
    await expect(
      resolvePasswordHash({
        password: "unused-password",
        passwordHash: existingHash,
      }),
    ).resolves.toBe(existingHash);
  });

  it("rejects invalid password hashes before seeding", async () => {
    await expect(
      resolvePasswordHash({
        password: "unused-password",
        passwordHash: "not-a-bcrypt-hash",
      }),
    ).rejects.toThrow("OWNER_PASSWORD_HASH must be a valid bcrypt hash.");
  });

  it("hashes plaintext passwords when no hash is supplied", async () => {
    const hash = await resolvePasswordHash({
      password: "ChangeMe123!",
    });

    expect(isBcryptPasswordHash(hash)).toBe(true);
    await expect(bcrypt.compare("ChangeMe123!", hash)).resolves.toBe(true);
  });
});

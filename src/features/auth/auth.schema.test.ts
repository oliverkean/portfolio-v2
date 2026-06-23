import { describe, expect, it } from "vitest";
import { loginSchema } from "./auth.schema";

describe("loginSchema", () => {
  it("accepts valid owner credentials shape", () => {
    const result = loginSchema.safeParse({
      email: "owner@example.com",
      password: "ChangeMe123!",
    });

    expect(result.success).toBe(true);
  });

  it("rejects malformed emails", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "ChangeMe123!",
    });

    expect(result.success).toBe(false);
  });

  it("rejects short passwords before hitting the database", () => {
    const result = loginSchema.safeParse({
      email: "owner@example.com",
      password: "short",
    });

    expect(result.success).toBe(false);
  });
});

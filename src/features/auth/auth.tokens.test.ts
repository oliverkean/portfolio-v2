import { describe, expect, it } from "vitest";
import { createSessionToken, hashSessionToken } from "./auth.tokens";

describe("auth tokens", () => {
  it("hashes the same token deterministically without storing the raw token", () => {
    const token = "example-session-token";
    const hash = hashSessionToken(token);

    expect(hash).toBe(hashSessionToken(token));
    expect(hash).not.toBe(token);
    expect(hash).toHaveLength(64);
  });

  it("creates high-entropy URL-safe session tokens", () => {
    const first = createSessionToken();
    const second = createSessionToken();

    expect(first).not.toBe(second);
    expect(first).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(first.length).toBeGreaterThanOrEqual(32);
  });
});

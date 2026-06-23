import { describe, expect, it } from "vitest";
import { portfolioSchema } from "./portfolio.schema";
import { starterPortfolio } from "./portfolio.sample";

describe("portfolioSchema", () => {
  it("accepts the starter portfolio", () => {
    const result = portfolioSchema.safeParse(starterPortfolio);

    expect(result.success).toBe(true);
  });

  it("rejects invalid public slugs", () => {
    const result = portfolioSchema.safeParse({
      ...starterPortfolio,
      slug: "Oliver Portfolio!",
    });

    expect(result.success).toBe(false);
  });

  it("requires at least one technology per project", () => {
    const result = portfolioSchema.safeParse({
      ...starterPortfolio,
      projects: [{ ...starterPortfolio.projects[0], stack: [] }],
    });

    expect(result.success).toBe(false);
  });
});

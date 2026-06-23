import { describe, expect, it } from "vitest";
import { starterPortfolio } from "./portfolio.sample";
import { groupSkills, normalizePortfolio, splitStack, sortByOrder } from "./portfolio.utils";

describe("portfolio utils", () => {
  it("splits comma-separated stack values and removes empty entries", () => {
    expect(splitStack("Next.js, TypeScript, , PostgreSQL ")).toEqual(["Next.js", "TypeScript", "PostgreSQL"]);
  });

  it("sorts by sortOrder before title or name", () => {
    const items = [
      { title: "Zulu", sortOrder: 2 },
      { title: "Alpha", sortOrder: 1 },
      { title: "Beta", sortOrder: 1 },
    ];

    expect(sortByOrder(items).map((item) => item.title)).toEqual(["Alpha", "Beta", "Zulu"]);
  });

  it("normalizes nested collection order", () => {
    const portfolio = normalizePortfolio({
      ...starterPortfolio,
      projects: [
        { ...starterPortfolio.projects[1], sortOrder: 1 },
        { ...starterPortfolio.projects[0], sortOrder: 0 },
      ],
    });

    expect(portfolio.projects.map((project) => project.title)).toEqual(["ShipFast", "Pulse Analytics"]);
    expect(portfolio.projects.map((project) => project.sortOrder)).toEqual([0, 1]);
  });

  it("groups skills by category after ordering", () => {
    const groups = groupSkills(starterPortfolio.skills);

    expect([...groups.keys()]).toEqual(["Frontend", "Backend/APIs", "Databases", "Tools"]);
    expect(groups.get("Backend/APIs")?.map((skill) => skill.name)).toEqual([
      "Node.js",
      "Express.js",
      "NestJS",
      "Laravel",
      "REST APIs",
      "Webhooks",
      "API Integration",
    ]);
    expect(groups.get("Tools")?.length).toBeGreaterThan(10);
  });
});

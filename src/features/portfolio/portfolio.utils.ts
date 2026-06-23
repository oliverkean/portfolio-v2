import type { PortfolioInput, SkillInput } from "./portfolio.schema";

export function splitStack(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function sortByOrder<T extends { sortOrder?: number; title?: string; name?: string }>(items: T[]): T[] {
  return [...items].sort((left, right) => {
    const orderDelta = (left.sortOrder ?? 0) - (right.sortOrder ?? 0);

    if (orderDelta !== 0) {
      return orderDelta;
    }

    return (left.title ?? left.name ?? "").localeCompare(right.title ?? right.name ?? "");
  });
}

function sortSkillsByCategoryOrder(skills: SkillInput[]): SkillInput[] {
  const groups = new Map<string, SkillInput[]>();

  for (const skill of skills) {
    const category = skill.category || "Other";
    groups.set(category, [...(groups.get(category) ?? []), skill]);
  }

  return [...groups.values()].flatMap((group) => sortByOrder(group));
}

export function groupSkills(skills: SkillInput[]): Map<string, SkillInput[]> {
  const groups = new Map<string, SkillInput[]>();

  for (const skill of sortSkillsByCategoryOrder(skills)) {
    const category = skill.category || "Other";
    groups.set(category, [...(groups.get(category) ?? []), skill]);
  }

  return groups;
}

export function normalizePortfolio(portfolio: PortfolioInput): PortfolioInput {
  return {
    ...portfolio,
    projects: sortByOrder(portfolio.projects).map((project, index) => ({
      ...project,
      sortOrder: index,
      stack: project.stack.map((item) => item.trim()).filter(Boolean),
    })),
    experiences: sortByOrder(portfolio.experiences).map((experience, index) => ({
      ...experience,
      sortOrder: index,
    })),
    skills: sortSkillsByCategoryOrder(portfolio.skills).map((skill, index) => ({
      ...skill,
      sortOrder: index,
    })),
  };
}

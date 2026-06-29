import { prisma, isDatabaseConfigured } from "@/lib/prisma";
import type { Prisma } from "@/generated/prisma/client";
import { normalizePortfolio } from "../portfolio.utils";
import { portfolioSchema, type PortfolioInput } from "../portfolio.schema";
import { starterPortfolio } from "../portfolio.sample";

let fallbackPortfolio = normalizePortfolio(starterPortfolio);

const portfolioInclude = {
  projects: { orderBy: [{ sortOrder: "asc" as const }, { title: "asc" as const }] },
  experiences: { orderBy: [{ sortOrder: "asc" as const }, { company: "asc" as const }] },
  skills: { orderBy: [{ sortOrder: "asc" as const }, { name: "asc" as const }] },
};

type PortfolioRecord = Prisma.PortfolioGetPayload<{ include: typeof portfolioInclude }>;

function emptyToUndefined(value?: string | null) {
  return value || undefined;
}

function toPortfolioInput(record: PortfolioRecord): PortfolioInput {
  return normalizePortfolio({
    id: record.id,
    slug: record.slug,
    name: record.name,
    title: record.title,
    bio: record.bio,
    location: emptyToUndefined(record.location),
    email: emptyToUndefined(record.email),
    phone: emptyToUndefined(record.phone),
    websiteUrl: emptyToUndefined(record.websiteUrl),
    githubUrl: emptyToUndefined(record.githubUrl),
    linkedinUrl: emptyToUndefined(record.linkedinUrl),
    resumeUrl: emptyToUndefined(record.resumeUrl),
    heroImageUrl: emptyToUndefined(record.heroImageUrl),
    isPublished: record.isPublished,
    projects: record.projects.map((project) => ({
      id: project.id,
      title: project.title,
      summary: project.summary,
      description: emptyToUndefined(project.description),
      role: emptyToUndefined(project.role),
      stack: project.stack,
      liveUrl: emptyToUndefined(project.liveUrl),
      repoUrl: emptyToUndefined(project.repoUrl),
      imageUrl: emptyToUndefined(project.imageUrl),
      featured: project.featured,
      status: project.status,
      sortOrder: project.sortOrder,
    })),
    experiences: record.experiences.map((experience) => ({
      id: experience.id,
      company: experience.company,
      role: experience.role,
      location: emptyToUndefined(experience.location),
      startDate: experience.startDate,
      endDate: emptyToUndefined(experience.endDate),
      description: experience.description,
      sortOrder: experience.sortOrder,
    })),
    skills: record.skills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      level: skill.level,
      sortOrder: skill.sortOrder,
    })),
  });
}

function portfolioFields(portfolio: PortfolioInput) {
  return {
    slug: portfolio.slug,
    name: portfolio.name,
    title: portfolio.title,
    bio: portfolio.bio,
    location: portfolio.location || null,
    email: portfolio.email || null,
    phone: portfolio.phone || null,
    websiteUrl: portfolio.websiteUrl || null,
    githubUrl: portfolio.githubUrl || null,
    linkedinUrl: portfolio.linkedinUrl || null,
    resumeUrl: portfolio.resumeUrl || null,
    heroImageUrl: portfolio.heroImageUrl || null,
    isPublished: portfolio.isPublished,
  };
}

export async function getPortfolioBySlug(slug: string) {
  if (!isDatabaseConfigured()) {
    return fallbackPortfolio.slug === slug ? fallbackPortfolio : null;
  }

  try {
    const record = await prisma.portfolio.findUnique({
      where: { slug },
      include: portfolioInclude,
    });

    return record ? toPortfolioInput(record) : null;
  } catch (error) {
    console.error("Unable to read portfolio from database.", error);
    return fallbackPortfolio.slug === slug ? fallbackPortfolio : null;
  }
}

export async function savePortfolio(currentSlug: string, payload: unknown, ownerId?: string) {
  const parsed = portfolioSchema.parse(payload);
  const portfolio = normalizePortfolio(parsed);

  if (!isDatabaseConfigured()) {
    fallbackPortfolio = portfolio;
    return fallbackPortfolio;
  }

  const record = await prisma.portfolio.upsert({
    where: { slug: currentSlug },
    create: {
      ...portfolioFields(portfolio),
      ownerId,
      projects: {
        create: portfolio.projects.map((project) => ({
          title: project.title,
          summary: project.summary,
          description: project.description || null,
          role: project.role || null,
          stack: project.stack,
          liveUrl: project.liveUrl || null,
          repoUrl: project.repoUrl || null,
          imageUrl: project.imageUrl || null,
          featured: project.featured,
          status: project.status,
          sortOrder: project.sortOrder,
        })),
      },
      experiences: {
        create: portfolio.experiences.map((experience) => ({
          company: experience.company,
          role: experience.role,
          location: experience.location || null,
          startDate: experience.startDate,
          endDate: experience.endDate || null,
          description: experience.description,
          sortOrder: experience.sortOrder,
        })),
      },
      skills: {
        create: portfolio.skills.map((skill) => ({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          sortOrder: skill.sortOrder,
        })),
      },
    },
    update: {
      ...portfolioFields(portfolio),
      ownerId,
      projects: {
        deleteMany: {},
        create: portfolio.projects.map((project) => ({
          title: project.title,
          summary: project.summary,
          description: project.description || null,
          role: project.role || null,
          stack: project.stack,
          liveUrl: project.liveUrl || null,
          repoUrl: project.repoUrl || null,
          imageUrl: project.imageUrl || null,
          featured: project.featured,
          status: project.status,
          sortOrder: project.sortOrder,
        })),
      },
      experiences: {
        deleteMany: {},
        create: portfolio.experiences.map((experience) => ({
          company: experience.company,
          role: experience.role,
          location: experience.location || null,
          startDate: experience.startDate,
          endDate: experience.endDate || null,
          description: experience.description,
          sortOrder: experience.sortOrder,
        })),
      },
      skills: {
        deleteMany: {},
        create: portfolio.skills.map((skill) => ({
          name: skill.name,
          category: skill.category,
          level: skill.level,
          sortOrder: skill.sortOrder,
        })),
      },
    },
    include: portfolioInclude,
  });

  return toPortfolioInput(record);
}

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { resolvePasswordHash } from "../src/features/auth/password-hash";
import { starterPortfolio } from "../src/features/portfolio/portfolio.sample";
import { normalizePortfolio } from "../src/features/portfolio/portfolio.utils";
import type { PortfolioInput } from "../src/features/portfolio/portfolio.schema";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/portfolio?schema=public",
  }),
});

function projectRows(portfolio: PortfolioInput) {
  return portfolio.projects.map((project) => ({
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
  }));
}

function experienceRows(portfolio: PortfolioInput) {
  return portfolio.experiences.map((experience) => ({
    company: experience.company,
    role: experience.role,
    location: experience.location || null,
    startDate: experience.startDate,
    endDate: experience.endDate || null,
    description: experience.description,
    sortOrder: experience.sortOrder,
  }));
}

function skillRows(portfolio: PortfolioInput) {
  return portfolio.skills.map((skill) => ({
    name: skill.name,
    category: skill.category,
    level: skill.level,
    sortOrder: skill.sortOrder,
  }));
}

async function main() {
  const portfolio = normalizePortfolio(starterPortfolio);
  const email = (process.env.OWNER_EMAIL || "owner@example.com").toLowerCase();
  const password = process.env.OWNER_PASSWORD || "ChangeMe123!";
  const passwordHash = await resolvePasswordHash({
    password,
    passwordHash: process.env.OWNER_PASSWORD_HASH,
  });
  const shouldUpdatePassword = Boolean(process.env.OWNER_PASSWORD || process.env.OWNER_PASSWORD_HASH);
  const name = process.env.OWNER_NAME || portfolio.name;
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      passwordHash,
    },
    update: {
      name,
      ...(shouldUpdatePassword ? { passwordHash } : {}),
    },
  });

  await prisma.portfolio.upsert({
    where: { slug: portfolio.slug },
    create: {
      ownerId: user.id,
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
      projects: { create: projectRows(portfolio) },
      experiences: { create: experienceRows(portfolio) },
      skills: { create: skillRows(portfolio) },
    },
    update: {
      ownerId: user.id,
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
      projects: {
        deleteMany: {},
        create: projectRows(portfolio),
      },
      experiences: {
        deleteMany: {},
        create: experienceRows(portfolio),
      },
      skills: {
        deleteMany: {},
        create: skillRows(portfolio),
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

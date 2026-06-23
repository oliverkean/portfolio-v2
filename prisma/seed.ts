import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { starterPortfolio } from "../src/features/portfolio/portfolio.sample";
import { normalizePortfolio } from "../src/features/portfolio/portfolio.utils";

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/portfolio?schema=public",
  }),
});

async function main() {
  const portfolio = normalizePortfolio(starterPortfolio);
  const email = (process.env.OWNER_EMAIL || "owner@example.com").toLowerCase();
  const password = process.env.OWNER_PASSWORD || "ChangeMe123!";
  const name = process.env.OWNER_NAME || portfolio.name;
  const user = await prisma.user.upsert({
    where: { email },
    create: {
      email,
      name,
      passwordHash: await bcrypt.hash(password, 12),
    },
    update: {
      name,
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
      projects: { create: portfolio.projects },
      experiences: { create: portfolio.experiences },
      skills: { create: portfolio.skills },
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

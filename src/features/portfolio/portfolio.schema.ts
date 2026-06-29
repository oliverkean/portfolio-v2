import { z } from "zod";

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => value.startsWith("/") || z.url().safeParse(value).success, "Enter a valid URL.")
  .or(z.literal(""))
  .optional();

export const projectSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(2, "Project title is required."),
  summary: z.string().trim().min(10, "Project summary should be specific."),
  description: z.string().trim().optional(),
  role: z.string().trim().optional(),
  stack: z.array(z.string().trim().min(1)).min(1, "Add at least one technology."),
  liveUrl: optionalUrl,
  repoUrl: optionalUrl,
  imageUrl: optionalUrl,
  featured: z.boolean().default(false),
  status: z.string().trim().min(2).default("Published"),
  sortOrder: z.number().int().min(0).default(0),
});

export const experienceSchema = z.object({
  id: z.string().optional(),
  company: z.string().trim().min(2, "Company is required."),
  role: z.string().trim().min(2, "Role is required."),
  location: z.string().trim().optional(),
  startDate: z.string().trim().min(4, "Start date is required."),
  endDate: z.string().trim().optional(),
  description: z.string().trim().min(10, "Experience description is required."),
  sortOrder: z.number().int().min(0).default(0),
});

export const skillSchema = z.object({
  id: z.string().optional(),
  name: z.string().trim().min(1, "Skill name is required."),
  category: z.string().trim().min(2, "Skill category is required."),
  level: z.number().int().min(1).max(5).default(3),
  sortOrder: z.number().int().min(0).default(0),
});

export const portfolioSchema = z.object({
  id: z.string().optional(),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]+$/, "Slug can only include lowercase letters, numbers, and hyphens."),
  name: z.string().trim().min(2, "Name is required."),
  title: z.string().trim().min(2, "Professional title is required."),
  bio: z.string().trim().min(40, "Bio should explain your value to recruiters."),
  location: z.string().trim().optional(),
  email: z.string().trim().email("Enter a valid email.").or(z.literal("")).optional(),
  phone: z.string().trim().optional(),
  websiteUrl: optionalUrl,
  githubUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  resumeUrl: optionalUrl,
  heroImageUrl: optionalUrl,
  isPublished: z.boolean().default(true),
  projects: z.array(projectSchema).default([]),
  experiences: z.array(experienceSchema).default([]),
  skills: z.array(skillSchema).default([]),
});

export type PortfolioInput = z.infer<typeof portfolioSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ExperienceInput = z.infer<typeof experienceSchema>;
export type SkillInput = z.infer<typeof skillSchema>;

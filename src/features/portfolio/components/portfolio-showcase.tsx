import type { ReactNode } from "react";
import {
  ArrowUpRight,
  Blocks,
  Box,
  Braces,
  Cloud,
  Code2,
  Container,
  Cpu,
  Database,
  Download,
  FileCode2,
  GitBranch,
  Globe2,
  Layers,
  Layout,
  Mail,
  Network,
  Palette,
  Phone,
  Send,
  Server,
  Settings,
  Terminal,
  Workflow,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import type { PortfolioInput, ProjectInput, SkillInput } from "../portfolio.schema";
import { groupSkills } from "../portfolio.utils";
import { ContactForm } from "./contact-form";

const iconProps = { size: 17, strokeWidth: 1.8 };

const skillIconMap: Record<string, ReactNode> = {
  aws: <Cloud {...iconProps} />,
  backend: <Server {...iconProps} />,
  bootstrap: <Layout {...iconProps} />,
  bullmq: <Workflow {...iconProps} />,
  "claude code": <Terminal {...iconProps} />,
  codex: <Terminal {...iconProps} />,
  "deployment/tools": <Cloud {...iconProps} />,
  "ci/cd": <Workflow {...iconProps} />,
  cron: <Settings {...iconProps} />,
  css3: <Palette {...iconProps} />,
  cursor: <Terminal {...iconProps} />,
  docker: <Container {...iconProps} />,
  "express.js": <Server {...iconProps} />,
  "environment variables": <Settings {...iconProps} />,
  frontend: <Layout {...iconProps} />,
  git: <GitBranch {...iconProps} />,
  "git bash": <Terminal {...iconProps} />,
  github: <GitBranch {...iconProps} />,
  "html5": <FileCode2 {...iconProps} />,
  "hubspot crm/api": <Network {...iconProps} />,
  infrastructure: <Cloud {...iconProps} />,
  "integrations/services": <Network {...iconProps} />,
  "api integration": <Network {...iconProps} />,
  javascript: <Braces {...iconProps} />,
  laravel: <Server {...iconProps} />,
  mailgun: <Send {...iconProps} />,
  mapbox: <Globe2 {...iconProps} />,
  mongodb: <Database {...iconProps} />,
  mysql: <Database {...iconProps} />,
  nestjs: <Server {...iconProps} />,
  "next.js": <Blocks {...iconProps} />,
  "node.js": <Server {...iconProps} />,
  nosql: <Database {...iconProps} />,
  "openai api": <Cpu {...iconProps} />,
  "pem keys": <Terminal {...iconProps} />,
  postgresql: <Database {...iconProps} />,
  postman: <Network {...iconProps} />,
  prisma: <Box {...iconProps} />,
  react: <Layers {...iconProps} />,
  redis: <Database {...iconProps} />,
  "rest apis": <Network {...iconProps} />,
  s3: <Cloud {...iconProps} />,
  "shadcn/ui": <Blocks {...iconProps} />,
  sql: <Database {...iconProps} />,
  ssh: <Terminal {...iconProps} />,
  sqlite: <Database {...iconProps} />,
  stripe: <Network {...iconProps} />,
  supabase: <Database {...iconProps} />,
  "supabase postgresql": <Database {...iconProps} />,
  "tailwind css": <Palette {...iconProps} />,
  tools: <Settings {...iconProps} />,
  typescript: <Braces {...iconProps} />,
  vercel: <Cloud {...iconProps} />,
  "visual studio code": <Terminal {...iconProps} />,
  "vue.js": <Layers {...iconProps} />,
  webhooks: <Workflow {...iconProps} />,
  workflow: <Workflow {...iconProps} />,
};

function getSkillIcon(skill: SkillInput) {
  return skillIconMap[skill.name.toLowerCase()] || skillIconMap[skill.category.toLowerCase()] || <Code2 {...iconProps} />;
}

function ProjectStack({ stack }: { stack: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {stack.map((item) => (
        <span
          key={item}
          className="border border-app-border bg-app-field px-2.5 py-1 font-mono text-[11px] uppercase tracking-normal text-app-muted"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ProjectLinks({ project }: { project: ProjectInput }) {
  return (
    <div className="flex flex-wrap gap-4 text-sm font-semibold">
      {project.liveUrl ? (
        <a className="inline-flex items-center gap-1 text-app-text hover:text-app-accent" href={project.liveUrl}>
          Live <ArrowUpRight size={15} />
        </a>
      ) : null}
      {project.repoUrl ? (
        <a className="inline-flex items-center gap-1 text-app-muted hover:text-app-text" href={project.repoUrl}>
          Repo <ArrowUpRight size={15} />
        </a>
      ) : null}
    </div>
  );
}

function FlagshipProject({ project }: { project: ProjectInput }) {
  return (
    <article className="grid min-h-[430px] overflow-hidden border border-app-border bg-app-panel lg:grid-cols-[1fr_240px]">
      <div className="flex flex-col justify-between p-6 sm:p-8">
        <div>
          <div className="flex items-start justify-between gap-6">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-app-muted">Featured build</p>
            {project.featured ? (
              <span className="border border-app-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-normal text-app-muted">
                Featured
              </span>
            ) : null}
          </div>
          <h3 className="mt-8 max-w-xl text-4xl font-semibold tracking-normal text-app-text sm:text-5xl">{project.title}</h3>
          <p className="mt-5 max-w-2xl text-base leading-8 text-app-muted">{project.summary}</p>
          {project.description ? <p className="mt-4 max-w-2xl text-sm leading-7 text-app-muted">{project.description}</p> : null}
        </div>

        <div className="mt-10 space-y-5">
          <ProjectStack stack={project.stack} />
          <ProjectLinks project={project} />
        </div>
      </div>

      <div className="border-t border-app-border bg-app-field p-5 lg:border-l lg:border-t-0">
        <div className="flex h-full flex-col justify-between border border-app-border bg-app-bg p-4">
          <div className="space-y-3 font-mono text-xs text-app-muted">
            <div className="flex items-center gap-2 text-app-text">
              <span className="h-2 w-2 bg-app-accent" />
              project.config.ts
            </div>
            <div className="pl-4 text-app-muted">role: {project.role || "Product engineering"}</div>
            <div className="pl-4 text-app-muted">status: {project.status}</div>
            <div className="pl-4 text-app-muted">stack:</div>
            {project.stack.slice(0, 5).map((item) => (
              <div key={item} className="pl-8 text-app-text">
                - {item}
              </div>
            ))}
          </div>
          <div className="mt-8 grid grid-cols-3 gap-2">
            <span className="h-16 border border-app-border bg-app-panel" />
            <span className="h-16 border border-app-border bg-app-panel" />
            <span className="h-16 bg-app-accent" />
          </div>
        </div>
      </div>
    </article>
  );
}

function ProjectRow({ project, index }: { project: ProjectInput; index: number }) {
  return (
    <article className="grid gap-5 border-b border-app-border py-6 last:border-b-0 md:grid-cols-[72px_1fr_auto] md:items-start">
      <p className="font-mono text-sm text-app-muted">0{index + 1}</p>
      <div>
        <h3 className="text-xl font-semibold text-app-text">{project.title}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-app-muted">{project.summary}</p>
        <div className="mt-4">
          <ProjectStack stack={project.stack.slice(0, 4)} />
        </div>
      </div>
      <ProjectLinks project={project} />
    </article>
  );
}

function SkillTile({ skill }: { skill: SkillInput }) {
  return (
    <li className="flex min-w-0 items-center gap-2 bg-app-field px-3 py-2">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center text-app-accent">
        {getSkillIcon(skill)}
      </span>
      <span className="truncate text-sm font-medium text-app-text">{skill.name}</span>
    </li>
  );
}

function SkillGroup({ category, skills }: { category: string; skills: SkillInput[] }) {
  const categoryIcon = skillIconMap[category.toLowerCase()] || <Cpu {...iconProps} />;

  return (
    <article className="grid gap-4 border-t border-app-border py-5 first:border-t-0 sm:grid-cols-[190px_1fr]">
      <div className="flex items-center gap-3 sm:items-start">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-app-accent text-app-accent-contrast">
          {categoryIcon}
        </span>
        <div>
          <h3 className="text-lg font-semibold text-app-text">{category}</h3>
        </div>
      </div>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <SkillTile key={skill.name} skill={skill} />
        ))}
      </ul>
    </article>
  );
}

export function PortfolioShowcase({ portfolio }: { portfolio: PortfolioInput }) {
  const skillGroups = groupSkills(portfolio.skills);
  const featuredProjects = portfolio.projects.filter((project) => project.featured);
  const projects = featuredProjects.length > 0 ? featuredProjects : portfolio.projects;
  const [flagshipProject, ...supportingProjects] = projects;

  return (
    <main className="min-h-screen bg-app-bg text-app-text">
      <header className="sticky top-0 z-10 border-b border-app-border bg-app-bg/90 backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-end px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
          <div aria-hidden="true" className="hidden md:block" />
          <div className="hidden items-center gap-6 text-sm font-medium text-app-muted md:flex">
            <a href="#projects" className="hover:text-app-text">
              Projects
            </a>
            <a href="#experience" className="hover:text-app-text">
              Experience
            </a>
            <a href="#skills" className="hover:text-app-text">
              Skills
            </a>
            <a href="#contact" className="hover:text-app-text">
              Contact
            </a>
          </div>
          <div className="flex items-center gap-3 md:justify-self-end">
            <ThemeToggle />
            {portfolio.resumeUrl ? (
              <a
                href={portfolio.resumeUrl}
                className="inline-flex h-10 items-center gap-2 bg-app-accent px-4 text-sm font-semibold text-app-accent-contrast"
              >
                <Download size={15} />
                Resume
              </a>
            ) : null}
          </div>
        </nav>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-24">
        <div>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-app-text sm:text-7xl">{portfolio.name}</h1>
          <p className="mt-5 font-mono text-sm uppercase tracking-[0.18em] text-app-muted">{portfolio.title}</p>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-app-muted">{portfolio.bio}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#projects"
              className="inline-flex h-11 items-center justify-center bg-app-accent px-5 text-sm font-semibold text-app-accent-contrast hover:bg-app-accent-strong"
            >
              View projects
            </a>
            {portfolio.email ? (
              <a
                href={`mailto:${portfolio.email}`}
                className="inline-flex h-11 items-center justify-center border border-app-border px-5 text-sm font-semibold text-app-muted hover:border-app-text hover:text-app-text"
              >
                Contact
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <section id="projects" className="border-y border-app-border bg-app-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="mb-8 grid gap-5 md:grid-cols-[240px_1fr]">
            <h2 className="text-3xl font-semibold text-app-text">Featured projects</h2>
            <p className="max-w-2xl text-app-muted">
              Selected work with the product context, implementation details, and links needed to understand the build.
            </p>
          </div>

          {flagshipProject ? <FlagshipProject project={flagshipProject} /> : null}

          {supportingProjects.length > 0 ? (
            <div className="mt-4 border border-app-border bg-app-bg px-5">
              {supportingProjects.map((project, index) => (
                <ProjectRow key={project.title} project={project} index={index + 1} />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <section id="experience" className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-3xl font-semibold text-app-text">Experience</h2>
        <div className="mt-8 space-y-6 border-l border-app-border pl-6">
          {portfolio.experiences.map((experience) => (
            <article key={`${experience.company}-${experience.role}`} className="relative">
              <span className="absolute -left-[31px] top-1 h-3 w-3 bg-app-accent" />
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-app-text">{experience.role}</h3>
                  <p className="text-sm text-app-muted">{experience.company}</p>
                </div>
                <p className="font-mono text-xs text-app-muted">
                  {experience.startDate} - {experience.endDate || "Present"}
                </p>
              </div>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-app-muted">{experience.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="skills" className="border-y border-app-border bg-app-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            <div>
              <h2 className="text-3xl font-semibold text-app-text">Skills</h2>
              <p className="mt-4 text-sm leading-6 text-app-muted">
                Tools I use across product interfaces, APIs, databases, infrastructure, and delivery workflows.
              </p>
            </div>
            <div className="border-y border-app-border">
              {[...skillGroups.entries()].map(([category, skills]) => (
                <SkillGroup key={category} category={category} skills={skills} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 border border-app-border bg-app-panel p-6 lg:grid-cols-[0.75fr_1.25fr] lg:p-8">
          <div>
            <h2 className="text-3xl font-semibold text-app-text">Contact</h2>
            <p className="mt-3 max-w-sm text-app-muted">Have a role, project, or collaboration in mind? Send a message.</p>
            <div className="mt-8 space-y-3 text-sm text-app-muted">
              {portfolio.email ? (
                <a className="flex items-center gap-2 hover:text-app-text" href={`mailto:${portfolio.email}`}>
                  <Mail size={16} />
                  {portfolio.email}
                </a>
              ) : null}
              {portfolio.phone ? (
                <span className="flex items-center gap-2">
                  <Phone size={16} />
                  {portfolio.phone}
                </span>
              ) : null}
              {portfolio.linkedinUrl ? (
                <a className="flex items-center gap-2 hover:text-app-text" href={portfolio.linkedinUrl}>
                  <Network size={16} />
                  LinkedIn
                </a>
              ) : null}
              {portfolio.githubUrl ? (
                <a className="flex items-center gap-2 hover:text-app-text" href={portfolio.githubUrl}>
                  <Code2 size={16} />
                  GitHub
                </a>
              ) : null}
            </div>
          </div>
          <ContactForm email={portfolio.email} name={portfolio.name} />
        </div>
      </section>
    </main>
  );
}

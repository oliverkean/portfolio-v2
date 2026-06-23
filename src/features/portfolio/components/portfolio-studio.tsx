"use client";

import { ChangeEvent, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  CheckCircle2,
  Code2,
  Eye,
  FileUp,
  Loader2,
  Network,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutButton } from "@/features/auth/components/logout-button";
import type { AuthUser } from "@/features/auth/auth.types";
import type { ExperienceInput, PortfolioInput, ProjectInput, SkillInput } from "../portfolio.schema";
import { splitStack } from "../portfolio.utils";

type SaveState = "idle" | "saving" | "saved" | "error";

type TextFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
};

function TextField({ label, value, onChange, placeholder, type = "text" }: TextFieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-10 w-full rounded-lg border border-app-border bg-app-field px-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent focus:ring-2 focus:ring-app-accent/20"
      />
    </label>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 4,
}: TextFieldProps & { rows?: number }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-app-muted">{label}</span>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={rows}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full resize-y rounded-lg border border-app-border bg-app-field px-3 py-2 text-sm leading-6 text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent focus:ring-2 focus:ring-app-accent/20"
      />
    </label>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-app-border bg-app-panel p-5 shadow-[0_18px_70px_rgba(14,10,22,0.12)]">
      <h2 className="text-base font-semibold text-app-text">{title}</h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function UploadControl({
  label,
  accept,
  onUploaded,
}: {
  label: string;
  accept: string;
  onUploaded: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const result = (await response.json()) as { url?: string; error?: string };

    setUploading(false);

    if (!response.ok || !result.url) {
      setError(result.error || "Upload failed.");
      return;
    }

    onUploaded(result.url);
  }

  return (
    <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-app-border bg-app-field px-4 py-3 text-sm transition hover:border-app-accent">
      <span className="inline-flex items-center gap-2 font-semibold text-app-muted">
        {uploading ? <Loader2 className="animate-spin" size={16} /> : <FileUp size={16} />}
        {error || label}
      </span>
      <span className="font-mono text-xs text-app-muted">{uploading ? "Uploading" : "Choose file"}</span>
      <input className="sr-only" type="file" accept={accept} onChange={handleUpload} />
    </label>
  );
}

function StudioPreview({ portfolio }: { portfolio: PortfolioInput }) {
  const featuredProjects = portfolio.projects.filter((project) => project.featured);
  const projects = featuredProjects.length > 0 ? featuredProjects : portfolio.projects.slice(0, 2);

  return (
    <aside className="sticky top-6 rounded-lg border border-app-border bg-app-panel p-5 shadow-[0_24px_90px_rgba(14,10,22,0.18)]">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-app-muted">Live preview</p>
        <Link
          href={`/p/${portfolio.slug}`}
          className="inline-flex items-center gap-1 text-sm font-semibold text-app-accent hover:text-app-accent-strong"
        >
          Open <ArrowUpRight size={15} />
        </Link>
      </div>
      <div className="mt-6 rounded-lg border border-app-border bg-app-field p-5">
        <p className="font-mono text-xs text-app-accent">{portfolio.title}</p>
        <h3 className="mt-3 text-3xl font-semibold text-app-text">{portfolio.name}</h3>
        <p className="mt-3 text-sm leading-6 text-app-muted">{portfolio.bio}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {portfolio.githubUrl ? <Code2 size={17} className="text-app-muted" /> : null}
          {portfolio.linkedinUrl ? <Network size={17} className="text-app-muted" /> : null}
        </div>
      </div>
      <div className="mt-5 space-y-3">
        {projects.map((project) => (
          <div key={project.title} className="rounded-lg border border-app-border bg-app-surface/60 p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="font-semibold text-app-text">{project.title}</p>
              <span className="rounded-md border border-app-success/20 bg-app-success/10 px-2 py-1 text-xs text-app-success">{project.status}</span>
            </div>
            <p className="mt-2 text-sm leading-5 text-app-muted">{project.summary}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function PortfolioStudio({
  initialPortfolio,
  databaseConfigured,
  user,
}: {
  initialPortfolio: PortfolioInput;
  databaseConfigured: boolean;
  user: AuthUser;
}) {
  const [portfolio, setPortfolio] = useState(initialPortfolio);
  const [currentSlug, setCurrentSlug] = useState(initialPortfolio.slug);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");

  const publicUrl = useMemo(() => `/p/${portfolio.slug}`, [portfolio.slug]);

  function updatePortfolio<K extends keyof PortfolioInput>(key: K, value: PortfolioInput[K]) {
    setPortfolio((current) => ({ ...current, [key]: value }));
  }

  function updateProject(index: number, project: ProjectInput) {
    setPortfolio((current) => ({
      ...current,
      projects: current.projects.map((item, itemIndex) => (itemIndex === index ? project : item)),
    }));
  }

  function updateExperience(index: number, experience: ExperienceInput) {
    setPortfolio((current) => ({
      ...current,
      experiences: current.experiences.map((item, itemIndex) => (itemIndex === index ? experience : item)),
    }));
  }

  function updateSkill(index: number, skill: SkillInput) {
    setPortfolio((current) => ({
      ...current,
      skills: current.skills.map((item, itemIndex) => (itemIndex === index ? skill : item)),
    }));
  }

  async function save() {
    setSaveState("saving");
    setSaveError("");

    const response = await fetch(`/api/portfolio/${currentSlug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(portfolio),
    });
    const result = (await response.json()) as { portfolio?: PortfolioInput; error?: string; issues?: { message: string }[] };

    if (!response.ok || !result.portfolio) {
      setSaveState("error");
      setSaveError(result.issues?.[0]?.message || result.error || "Unable to save portfolio.");
      return;
    }

    setPortfolio(result.portfolio);
    setCurrentSlug(result.portfolio.slug);
    setSaveState("saved");
  }

  return (
    <main className="min-h-screen bg-app-bg text-app-text">
      <header className="border-b border-app-border bg-app-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-app-accent">Portfolio Studio</p>
            <h1 className="mt-1 text-2xl font-semibold text-app-text">Manage your recruiter showcase</h1>
            <p className="mt-1 text-sm text-app-muted">Signed in as {user.email}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ThemeToggle />
            <Link
              href={publicUrl}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-app-border bg-app-surface px-4 text-sm font-semibold text-app-muted transition hover:border-app-accent hover:text-app-text"
            >
              <Eye size={16} />
              View public page
            </Link>
            <LogoutButton />
            <button
              type="button"
              onClick={save}
              disabled={saveState === "saving"}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-app-accent px-4 text-sm font-semibold text-app-accent-contrast transition hover:bg-app-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
            >
              {saveState === "saving" ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save changes
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          {!databaseConfigured ? (
            <div className="rounded-lg border border-app-warning/30 bg-app-warning/10 px-4 py-3 text-sm text-app-warning">
              PostgreSQL is not connected yet. You can explore the UI, but persistence is in-memory until
              `DATABASE_URL` is configured and migrations are applied.
            </div>
          ) : null}
          {saveState === "saved" ? (
            <div className="flex items-center gap-2 rounded-lg border border-app-success/30 bg-app-success/10 px-4 py-3 text-sm text-app-success">
              <CheckCircle2 size={16} />
              Portfolio saved.
            </div>
          ) : null}
          {saveState === "error" ? (
            <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{saveError}</div>
          ) : null}

          <Panel title="Profile">
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Name" value={portfolio.name} onChange={(value) => updatePortfolio("name", value)} />
              <TextField label="Slug" value={portfolio.slug} onChange={(value) => updatePortfolio("slug", value)} />
              <TextField label="Title" value={portfolio.title} onChange={(value) => updatePortfolio("title", value)} />
              <TextField label="Location" value={portfolio.location || ""} onChange={(value) => updatePortfolio("location", value)} />
            </div>
            <TextArea label="Bio" value={portfolio.bio} onChange={(value) => updatePortfolio("bio", value)} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Email" value={portfolio.email || ""} onChange={(value) => updatePortfolio("email", value)} />
              <TextField label="Phone" value={portfolio.phone || ""} onChange={(value) => updatePortfolio("phone", value)} />
              <TextField label="Website" value={portfolio.websiteUrl || ""} onChange={(value) => updatePortfolio("websiteUrl", value)} />
              <TextField label="GitHub" value={portfolio.githubUrl || ""} onChange={(value) => updatePortfolio("githubUrl", value)} />
              <TextField label="LinkedIn" value={portfolio.linkedinUrl || ""} onChange={(value) => updatePortfolio("linkedinUrl", value)} />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <UploadControl label="Upload resume PDF" accept="application/pdf" onUploaded={(url) => updatePortfolio("resumeUrl", url)} />
              <UploadControl label="Upload hero image" accept="image/png,image/jpeg,image/webp" onUploaded={(url) => updatePortfolio("heroImageUrl", url)} />
            </div>
          </Panel>

          <Panel title="Projects">
            {portfolio.projects.map((project, index) => (
              <div key={`${project.title}-${index}`} className="rounded-lg border border-app-border bg-app-surface/55 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Title" value={project.title} onChange={(value) => updateProject(index, { ...project, title: value })} />
                  <TextField label="Status" value={project.status} onChange={(value) => updateProject(index, { ...project, status: value })} />
                </div>
                <div className="mt-4 space-y-4">
                  <TextArea label="Summary" value={project.summary} onChange={(value) => updateProject(index, { ...project, summary: value })} rows={3} />
                  <TextField
                    label="Stack"
                    value={project.stack.join(", ")}
                    onChange={(value) => updateProject(index, { ...project, stack: splitStack(value) })}
                    placeholder="Next.js, TypeScript, PostgreSQL"
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <TextField label="Live URL" value={project.liveUrl || ""} onChange={(value) => updateProject(index, { ...project, liveUrl: value })} />
                    <TextField label="Repo URL" value={project.repoUrl || ""} onChange={(value) => updateProject(index, { ...project, repoUrl: value })} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="inline-flex items-center gap-2 text-sm font-semibold text-app-muted">
                      <input
                        type="checkbox"
                        checked={project.featured}
                        onChange={(event) => updateProject(index, { ...project, featured: event.target.checked })}
                        className="h-4 w-4 rounded border-app-border text-app-accent"
                      />
                      Featured project
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setPortfolio((current) => ({
                          ...current,
                          projects: current.projects.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                      className="inline-flex items-center gap-2 text-sm font-semibold text-red-300"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setPortfolio((current) => ({
                  ...current,
                  projects: [
                    ...current.projects,
                    {
                      title: "New Project",
                      summary: "Describe the problem, your contribution, and the outcome.",
                      description: "",
                      role: "",
                      stack: ["Next.js"],
                      liveUrl: "",
                      repoUrl: "",
                      imageUrl: "",
                      featured: false,
                      status: "Draft",
                      sortOrder: current.projects.length,
                    },
                  ],
                }))
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-app-border px-4 text-sm font-semibold text-app-muted transition hover:border-app-accent hover:text-app-text"
            >
              <Plus size={16} />
              Add project
            </button>
          </Panel>

          <Panel title="Experience">
            {portfolio.experiences.map((experience, index) => (
              <div key={`${experience.company}-${index}`} className="rounded-lg border border-app-border bg-app-surface/55 p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Company" value={experience.company} onChange={(value) => updateExperience(index, { ...experience, company: value })} />
                  <TextField label="Role" value={experience.role} onChange={(value) => updateExperience(index, { ...experience, role: value })} />
                  <TextField label="Start" value={experience.startDate} onChange={(value) => updateExperience(index, { ...experience, startDate: value })} />
                  <TextField label="End" value={experience.endDate || ""} onChange={(value) => updateExperience(index, { ...experience, endDate: value })} />
                </div>
                <div className="mt-4">
                  <TextArea
                    label="Description"
                    value={experience.description}
                    onChange={(value) => updateExperience(index, { ...experience, description: value })}
                    rows={3}
                  />
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setPortfolio((current) => ({
                  ...current,
                  experiences: [
                    ...current.experiences,
                    {
                      company: "Company",
                      role: "Role",
                      location: "",
                      startDate: "2024",
                      endDate: "Present",
                      description: "Summarize your work, scope, and business impact.",
                      sortOrder: current.experiences.length,
                    },
                  ],
                }))
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-app-border px-4 text-sm font-semibold text-app-muted transition hover:border-app-accent hover:text-app-text"
            >
              <Plus size={16} />
              Add experience
            </button>
          </Panel>

          <Panel title="Skills">
            <div className="space-y-2">
              {portfolio.skills.map((skill, index) => (
                <div key={`${skill.name}-${index}`} className="grid gap-2 md:grid-cols-[1fr_180px_80px_auto]">
                  <input
                    aria-label="Skill name"
                    value={skill.name}
                    onChange={(event) => updateSkill(index, { ...skill, name: event.target.value })}
                    className="h-10 rounded-lg border border-app-border bg-app-field px-3 text-sm text-app-text outline-none focus:border-app-accent"
                  />
                  <input
                    aria-label="Skill category"
                    value={skill.category}
                    onChange={(event) => updateSkill(index, { ...skill, category: event.target.value })}
                    className="h-10 rounded-lg border border-app-border bg-app-field px-3 text-sm text-app-text outline-none focus:border-app-accent"
                  />
                  <input
                    aria-label="Skill level"
                    type="number"
                    min={1}
                    max={5}
                    value={skill.level}
                    onChange={(event) => updateSkill(index, { ...skill, level: Number(event.target.value) })}
                    className="h-10 rounded-lg border border-app-border bg-app-field px-3 text-sm text-app-text outline-none focus:border-app-accent"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setPortfolio((current) => ({
                        ...current,
                        skills: current.skills.filter((_, itemIndex) => itemIndex !== index),
                      }))
                    }
                    className="inline-flex h-10 items-center justify-center rounded-lg border border-app-border px-3 text-sm font-semibold text-red-300 transition hover:border-red-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() =>
                setPortfolio((current) => ({
                  ...current,
                  skills: [
                    ...current.skills,
                    { name: "New skill", category: "Frontend", level: 3, sortOrder: current.skills.length },
                  ],
                }))
              }
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-app-border px-4 text-sm font-semibold text-app-muted transition hover:border-app-accent hover:text-app-text"
            >
              <Plus size={16} />
              Add skill
            </button>
          </Panel>
        </div>

        <StudioPreview portfolio={portfolio} />
      </div>
    </main>
  );
}

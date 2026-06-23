import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, ExternalLink, LockKeyhole } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="min-h-screen bg-app-bg text-app-text">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-app-border bg-app-panel text-app-accent shadow-[0_18px_60px_rgba(14,10,22,0.18)]">
              <BriefcaseBusiness size={22} />
              </div>
              <ThemeToggle />
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold tracking-normal text-app-text sm:text-6xl">
              Manage your portfolio and publish a recruiter-ready showcase.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-app-muted">
              Keep your profile, projects, experience, skills, resume, and public page in one clean Next.js app backed
              by Prisma and PostgreSQL.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-app-accent px-5 text-sm font-semibold text-app-accent-contrast transition hover:bg-app-accent-strong"
              >
                <LockKeyhole size={17} />
                Sign in
                <ArrowRight size={17} />
              </Link>
              <Link
                href="/p/oliver"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-app-border bg-app-surface px-5 text-sm font-semibold text-app-muted transition hover:border-app-accent hover:text-app-text"
              >
                View public page
                <ExternalLink size={16} />
              </Link>
            </div>
          </div>
          <div className="rounded-lg border border-app-border bg-app-panel p-5 shadow-[0_24px_90px_rgba(14,10,22,0.22)]">
            <div className="rounded-lg border border-app-border bg-app-field p-5">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-app-muted">Project structure</p>
              <div className="mt-4 space-y-3 text-sm text-app-muted">
                <p><span className="font-mono text-app-accent">src/app</span> routes and API handlers</p>
                <p><span className="font-mono text-app-accent">src/features/auth</span> login and sessions</p>
                <p><span className="font-mono text-app-accent">src/features/portfolio</span> domain UI and logic</p>
                <p><span className="font-mono text-app-accent">prisma</span> PostgreSQL schema and seed script</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

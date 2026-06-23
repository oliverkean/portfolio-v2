import { redirect } from "next/navigation";
import { LoginForm } from "@/features/auth/components/login-form";
import { getCurrentUser } from "@/features/auth/server/session";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  const { next } = await searchParams;
  const nextPath = next?.startsWith("/") ? next : "/studio";

  if (user) {
    redirect(nextPath);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-app-bg text-app-text">
      <section className="mx-auto grid min-h-screen max-w-6xl gap-12 px-6 py-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.28em] text-app-accent">Portfolio Studio</p>
          <h1 className="mt-6 max-w-3xl text-5xl font-semibold tracking-normal text-app-text sm:text-6xl">
            A private control room for your public story.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-app-muted">
            Sign in to tune your projects, experience, uploads, and recruiter-facing portfolio with a polished
            dark-mode-first interface.
          </p>
          <div className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
            {["Protected editor", "Public showcase", "Dark mode"].map((item) => (
              <div key={item} className="rounded-lg border border-app-border bg-app-surface/70 px-4 py-3 text-sm font-semibold text-app-muted">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-app-border bg-app-panel p-6 shadow-[0_24px_90px_rgba(14,10,22,0.42)]">
          <div className="mb-8">
            <div className="h-12 w-12 rounded-lg bg-app-accent" />
            <h2 className="mt-6 text-2xl font-semibold text-app-text">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-app-muted">Use the owner credentials from your `.env` file.</p>
          </div>
          <LoginForm nextPath={nextPath} />
        </div>
      </section>
    </main>
  );
}

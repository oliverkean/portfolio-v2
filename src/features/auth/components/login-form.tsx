"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Loader2, Mail } from "lucide-react";

export function LoginForm({ nextPath }: { nextPath: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const result = (await response.json()) as { error?: string };

    setPending(false);

    if (!response.ok) {
      setError(result.error || "Unable to sign in.");
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-app-muted">Email</span>
        <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-app-border bg-app-field px-3 transition focus-within:border-app-accent focus-within:ring-2 focus-within:ring-app-accent/20">
          <Mail size={17} className="text-app-muted" />
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-full w-full bg-transparent text-sm text-app-text outline-none placeholder:text-app-muted"
            placeholder="owner@example.com"
            autoComplete="email"
            required
          />
        </div>
      </label>
      <label className="block">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-app-muted">Password</span>
        <div className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-app-border bg-app-field px-3 transition focus-within:border-app-accent focus-within:ring-2 focus-within:ring-app-accent/20">
          <LockKeyhole size={17} className="text-app-muted" />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-full w-full bg-transparent text-sm text-app-text outline-none placeholder:text-app-muted"
            placeholder="Enter your password"
            autoComplete="current-password"
            required
          />
        </div>
      </label>
      {error ? (
        <div className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200 dark:text-red-200">
          {error}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-app-accent px-5 text-sm font-semibold text-app-accent-contrast transition hover:bg-app-accent-strong disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? <Loader2 className="animate-spin" size={17} /> : <LockKeyhole size={17} />}
        Sign in to studio
      </button>
    </form>
  );
}

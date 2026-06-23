"use client";

import { FormEvent, useState } from "react";
import { Send } from "lucide-react";

export function ContactForm({ email, name }: { email?: string; name: string }) {
  const [status, setStatus] = useState<"idle" | "sent">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email) {
      return;
    }

    const form = new FormData(event.currentTarget);
    const senderName = String(form.get("name") || "");
    const senderEmail = String(form.get("email") || "");
    const message = String(form.get("message") || "");
    const subject = encodeURIComponent(`Portfolio inquiry for ${name}`);
    const body = encodeURIComponent(`Name: ${senderName}\nEmail: ${senderEmail}\n\n${message}`);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setStatus("sent");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-app-text">Name</span>
          <input
            name="name"
            required
            className="mt-2 h-11 w-full border border-app-border bg-app-field px-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent"
            placeholder="Your name"
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-app-text">Email</span>
          <input
            name="email"
            type="email"
            required
            className="mt-2 h-11 w-full border border-app-border bg-app-field px-3 text-sm text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent"
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm font-medium text-app-text">Message</span>
        <textarea
          name="message"
          required
          rows={5}
          className="mt-2 w-full resize-y border border-app-border bg-app-field px-3 py-3 text-sm leading-6 text-app-text outline-none transition placeholder:text-app-muted focus:border-app-accent"
          placeholder="Tell me about the role, project, or opportunity."
        />
      </label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={!email}
          className="inline-flex h-11 items-center justify-center gap-2 bg-app-accent px-5 text-sm font-semibold text-app-accent-contrast transition hover:bg-app-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Send size={16} />
          Send message
        </button>
        {status === "sent" ? <p className="text-sm text-app-muted">Your email app should open with the message ready.</p> : null}
      </div>
    </form>
  );
}

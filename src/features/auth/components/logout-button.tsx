"use client";

import { LogOut } from "lucide-react";

export function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-app-border bg-app-surface px-4 text-sm font-semibold text-app-muted transition hover:border-app-accent hover:text-app-text"
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}

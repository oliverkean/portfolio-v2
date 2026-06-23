"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");
    const nextTheme = isDark ? "light" : "dark";
    window.localStorage.setItem("portfolio-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-app-border bg-app-surface text-app-muted transition hover:border-app-accent hover:text-app-text"
      aria-label="Toggle color theme"
    >
      <Moon size={17} className="block dark:hidden" />
      <Sun size={17} className="hidden dark:block" />
    </button>
  );
}

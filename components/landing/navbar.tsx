"use client";

import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#why", label: "Why iMergix" },
  { href: "#pricing", label: "Pricing" },
];

const appLinks = [
  { href: "/goals", label: "Goals" },
  { href: "/kanban", label: "Tasks" },
  { href: "/invoices", label: "Invoices" },
];

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
      <nav
        aria-label="Main navigation"
        className="glass-card mx-auto flex max-w-5xl items-center justify-between rounded-2xl px-4 py-2.5 shadow-sm md:px-5"
      >
        <a
          href="#"
          className="flex cursor-pointer items-center gap-2 font-bold tracking-tight text-foreground"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent text-sm font-bold text-white">
            iM
          </span>
          <span className="hidden text-base sm:inline">iMergix</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-card-hover hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
          <span className="mx-2 h-4 w-px bg-border" aria-hidden="true" />
          {appLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-card-hover hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href="#cta"
            className="hidden cursor-pointer rounded-xl bg-gradient-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:opacity-90 sm:inline-block"
          >
            Get Early Access
          </a>
        </div>
      </nav>
    </header>
  );
}

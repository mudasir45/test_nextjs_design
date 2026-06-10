import { ThemeToggle } from "@/components/theme-toggle";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#why", label: "Why iMergix" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  return (
    <header className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl">
      <nav
        aria-label="Main navigation"
        className="flex items-center justify-between rounded-2xl border border-border bg-card/80 px-5 py-3 backdrop-blur-md"
      >
        <a
          href="#"
          className="flex cursor-pointer items-center gap-2 text-lg font-bold tracking-tight text-foreground transition-colors duration-200 hover:text-cta"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cta text-sm font-bold text-white">
            iM
          </span>
          iMergix
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="cursor-pointer text-sm font-medium text-secondary transition-colors duration-200 hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <a
            href="#cta"
            className="hidden cursor-pointer rounded-lg bg-cta px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-cta-hover sm:inline-block"
          >
            Get Early Access
          </a>
        </div>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-cta text-xs font-bold text-white">
            iM
          </span>
          <span className="font-semibold text-foreground">iMergix</span>
        </div>

        <p className="text-center text-sm text-muted">
          Built for freelancers, by a freelancer.
        </p>

        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} iMergix. PRD v0.1
        </p>
      </div>
    </footer>
  );
}

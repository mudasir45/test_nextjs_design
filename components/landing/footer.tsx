export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background">
            iM
          </span>
          <span className="font-bold text-foreground">iMergix</span>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Built for freelancers, by a freelancer.
        </p>

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} iMergix
        </p>
      </div>
    </footer>
  );
}

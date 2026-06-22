interface SectionHeaderProps {
  label: string;
  title: React.ReactNode;
  description?: string;
  align?: "center" | "left";
}

export function SectionHeader({
  label,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <div
      className={`mb-14 md:mb-20 ${isCenter ? "mx-auto max-w-3xl text-center" : "max-w-2xl"}`}
    >
      <span className="inline-flex items-center rounded-full border border-border/60 bg-accent-soft/50 px-3 py-1 text-xs font-semibold text-cta">
        {label}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

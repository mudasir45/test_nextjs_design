import {
  FileSpreadsheet,
  FileText,
  LayoutList,
  Receipt,
  StickyNote,
  Users,
} from "lucide-react";

const painPoints = [
  {
    icon: StickyNote,
    tool: "Tasks & notes",
    problem: "Scattered across Notion, sticky notes, or random Google Docs",
  },
  {
    icon: LayoutList,
    tool: "Projects",
    problem: "Trello, Linear, or yet another spreadsheet nobody updates",
  },
  {
    icon: Receipt,
    tool: "Invoices",
    problem: "Manual PDFs, Wave, or a Google Sheet you dread opening",
  },
  {
    icon: FileText,
    tool: "Goals",
    problem: "Another doc you wrote once and never re-opened",
  },
  {
    icon: FileSpreadsheet,
    tool: "Finances",
    problem: "QuickBooks, spreadsheets, or pure guesswork",
  },
  {
    icon: Users,
    tool: "Clients",
    problem: "Contacts app or digging through Gmail every time",
  },
];

export function Problem() {
  return (
    <section className="border-y border-border bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-cta">
            The problem
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Sound familiar?
          </h2>
          <p className="mt-4 text-lg text-secondary">
            Most freelancers run on 4–6 disconnected tools with zero shared
            context. There&apos;s no unified view of &ldquo;am I on
            track?&rdquo; — and motivation suffers because progress is
            invisible.
          </p>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {painPoints.map((item) => (
            <div
              key={item.tool}
              className="rounded-xl border border-border bg-background p-5 transition-colors duration-200 hover:bg-card-hover"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft">
                <item.icon className="h-5 w-5 text-cta" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-foreground">{item.tool}</h3>
              <p className="mt-1 text-sm leading-relaxed text-secondary">
                {item.problem}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

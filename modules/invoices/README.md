# @imergix/invoices

Portable Invoices & Finance module for Next.js — invoice builder, PDF export, expense tracking, client management.

**Full integration guide:** [INTEGRATION.md](./INTEGRATION.md)

## Quick start (sandbox)

```tsx
// app/invoices/page.tsx
'use client';

import {
  InvoicesModule,
  InvoicesProvider,
  DEFAULT_INVOICES,
  DEFAULT_EXPENSES,
  DEFAULT_CLIENTS,
} from '@/modules/invoices';

export default function InvoicesPage() {
  return (
    <InvoicesProvider
      initialInvoices={DEFAULT_INVOICES}
      initialExpenses={DEFAULT_EXPENSES}
      initialClients={DEFAULT_CLIENTS}
    >
      <InvoicesModule />
    </InvoicesProvider>
  );
}
```

## Export to production

```bash
cp -r modules/invoices /path/to/your-app/modules/invoices
```

Import only from `@/modules/invoices` — never from internal `ui/` paths.

## Folder layout

```
modules/invoices/
├── index.ts                 # Public API
├── INTEGRATION.md           # Production guide (API, routes, React Query)
├── README.md
├── InvoicesModule.tsx       # Dashboard (invoices + expenses)
├── InvoiceDetailPage.tsx    # Single invoice view
├── NewInvoicePage.tsx       # Create / edit builder
├── core/
│   ├── types.ts             # Invoice, Expense, Client, settings
│   ├── routes.ts            # Configurable URLs
│   ├── entity-utils.ts      # Expense ↔ project/goal linking
│   ├── pdf-utils.ts         # Client-side PDF download
│   ├── adapters/
│   │   ├── types.ts         # InvoicesStorageAdapter
│   │   ├── local-storage.adapter.ts
│   │   └── api.adapter.example.ts
│   └── hooks/
│       ├── use-invoices.ts
│       ├── use-expenses.ts
│       ├── use-clients.ts
│       └── use-invoices-module-config.ts
├── provider/InvoicesProvider.tsx
├── theme/
│   └── invoices-theme.ts
├── demo/                    # DEFAULT_* — dev/sandbox only
└── ui/
    ├── board/               # List, charts, toolbar
    ├── create/              # Builder, preview, client selector
    ├── detail/              # Detail panel, actions
    ├── expenses/
    ├── settings/
    ├── email/               # Email template preview
    └── pdf/                 # PDF download button
```

## Routes

| Route | Component |
|-------|-----------|
| `/invoices` | `InvoicesModule` |
| `/invoices/new` | `NewInvoicePage` |
| `/invoices/[invoiceId]` | `InvoiceDetailPage` |

Override via `InvoicesProvider routes={{ ... }}` — access with `useInvoicesRoutes()`.

## Optional dependencies

- `html2pdf.js` — required for PDF download (`pnpm add html2pdf.js`)

## Related modules

- `@imergix/goals` — link expenses to goals/milestones via `linkableEntities`
- `@imergix/kanban` — link expenses to tasks/projects

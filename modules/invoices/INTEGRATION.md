# Invoices Module — Integration Guide

Complete guide for moving `@imergix/invoices` from this design sandbox into your production Next.js app (Imergix or any project).

---

## Table of contents

1. [Recommended approach](#1-recommended-approach)
2. [What you are copying](#2-what-you-are-copying)
3. [Module structure](#3-module-structure)
4. [Install & path alias](#4-install--path-alias)
5. [Routes & pages](#5-routes--pages)
6. [Provider & theming](#6-provider--theming)
7. [Persistence: localStorage → live API](#7-persistence-localstorage--live-api)
8. [Schema mapping (your DB ↔ module types)](#8-schema-mapping-your-db--module-types)
9. [Production wiring with React Query](#9-production-wiring-with-react-query)
10. [Expense entity linking (goals, kanban, projects)](#10-expense-entity-linking-goals-kanban-projects)
11. [Callbacks & side effects](#11-callbacks--side-effects)
12. [Custom UI with hooks](#12-custom-ui-with-hooks)
13. [PDF & email](#13-pdf--email)
14. [Checklist before go-live](#14-checklist-before-go-live)
15. [Troubleshooting](#15-troubleshooting)

---

## 1. Recommended approach

| Stage | What to do | When |
|-------|------------|------|
| **Now** | Copy `modules/invoices/` into prod | First integration |
| **Soon** | Wire `InvoicesProvider` + API adapter + React Query | Replace localStorage |
| **Later** | Extract to `packages/invoices` in monorepo | Multiple apps share module |

Copy the folder first — same workflow as `@imergix/goals` and `@imergix/kanban`. No npm publish required on day one.

---

## 2. What you are copying

```bash
cp -r modules/invoices /path/to/imergix/modules/invoices
```

**Public API** — import only from:

```ts
import {
  InvoicesModule,
  InvoiceDetailPage,
  NewInvoicePage,
  InvoicesProvider,
  useInvoices,
  useExpenses,
  useClients,
  createLocalStorageAdapter,
  type InvoicesStorageAdapter,
  type Invoice,
  type Client,
  type WorkspaceSettings,
} from '@/modules/invoices';
```

**Do not** import from `@/modules/invoices/ui/...` in app code.

**Do not use in production:** `DEFAULT_INVOICES`, `DEFAULT_EXPENSES`, `DEFAULT_CLIENTS`. Seed from your API instead.

---

## 3. Module structure

```
modules/invoices/
├── index.ts                         # Public exports
├── InvoicesModule.tsx               # Dashboard (list + expenses)
├── InvoiceDetailPage.tsx            # Detail route component
├── NewInvoicePage.tsx               # Create/edit route component
├── core/
│   ├── types.ts                     # Domain types
│   ├── routes.ts                    # URL helpers
│   ├── entity-utils.ts              # Expense entity linking
│   ├── pdf-utils.ts                 # PDF download
│   ├── invoice-utils.ts             # Calculations, validation, formatting
│   ├── expense-utils.ts
│   ├── finance-utils.ts
│   ├── adapters/
│   │   ├── types.ts                 # InvoicesStorageAdapter
│   │   ├── local-storage.adapter.ts
│   │   └── api.adapter.example.ts   # Copy & adapt for API
│   └── hooks/
│       ├── use-invoices.ts
│       ├── use-expenses.ts
│       ├── use-clients.ts
│       └── use-invoices-module-config.ts
├── provider/InvoicesProvider.tsx
├── theme/
└── ui/                              # Internal — do not import in app
```

### Domain model (summary)

| Type | Purpose |
|------|---------|
| `Invoice` | Client, line items, totals, status, payment/T&C |
| `Client` | Reusable buyer records |
| `Expense` | Amount, category, optional entity link |
| `WorkspaceSettings` | Company logo, bank details, invoice prefix, T&C |
| `LineItem` | Description, qty, unit price, tax, date |

---

## 4. Install & path alias

### Peer dependencies

```bash
pnpm add lucide-react clsx tailwind-merge class-variance-authority html2pdf.js
```

### tsconfig paths

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Tailwind v4 — scan module files

```css
@source "../modules/invoices/**/*.{ts,tsx}";
```

Optional accent tokens:

```css
@import "../modules/invoices/theme/invoices.css";
```

Uses shadcn-style semantic tokens: `background`, `foreground`, `muted`, `border`, `card`, etc.

---

## 5. Routes & pages

### Default routes

| Route | Component |
|-------|-----------|
| `/invoices` | `InvoicesModule` |
| `/invoices/new` | `NewInvoicePage` |
| `/invoices/[invoiceId]` | `InvoiceDetailPage` |

### Production example

```tsx
// app/invoices/page.tsx
'use client';

import { InvoicesModule, InvoicesProvider } from '@/modules/invoices';

export default function InvoicesPage() {
  return (
    <InvoicesProvider initialInvoices={[]} initialExpenses={[]} initialClients={[]}>
      <InvoicesModule />
    </InvoicesProvider>
  );
}
```

```tsx
// app/invoices/[invoiceId]/page.tsx
'use client';

import { use } from 'react';
import { InvoiceDetailPage, InvoicesProvider } from '@/modules/invoices';

export default function InvoiceDetailRoute({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = use(params);
  return (
    <InvoicesProvider initialInvoices={[]} initialExpenses={[]} initialClients={[]}>
      <InvoiceDetailPage invoiceId={invoiceId} />
    </InvoicesProvider>
  );
}
```

```tsx
// app/invoices/new/page.tsx
'use client';

import { NewInvoicePage, InvoicesProvider } from '@/modules/invoices';

export default function NewInvoiceRoute() {
  return (
    <InvoicesProvider initialInvoices={[]} initialExpenses={[]} initialClients={[]}>
      <NewInvoicePage />
    </InvoicesProvider>
  );
}
```

### Custom URL structure

```tsx
<InvoicesProvider
  initialInvoices={invoices}
  routes={{
    index: '/finance/invoices',
    new: '/finance/invoices/new',
    detail: (id) => `/finance/invoices/${id}`,
  }}
>
  <InvoicesModule />
</InvoicesProvider>
```

Access anywhere via `useInvoicesRoutes()`.

---

## 6. Provider & theming

```tsx
<InvoicesProvider
  initialInvoices={invoicesFromApi}
  initialExpenses={expensesFromApi}
  initialClients={clientsFromApi}
  adapter={invoicesAdapter}
  storageKey="imergix-invoices-prod"
  linkableEntities={{
    projects: workspace.projects.map((p) => ({
      id: p.id,
      name: p.name,
      type: 'project',
    })),
    goals: goals.map((g) => ({
      id: g.id,
      name: g.title,
      type: 'goal',
    })),
  }}
  theme={{
    buttonPrimary: 'bg-indigo-600 text-white hover:bg-indigo-700',
    accentText: 'text-indigo-600 dark:text-indigo-400',
    spinner: 'border-border border-t-indigo-500',
  }}
  onInvoiceCreate={async (invoice) => {
    await api.post('/invoices', mapInvoiceToApi(invoice));
  }}
  onInvoiceUpdate={async (id, updates) => {
    await api.patch(`/invoices/${id}`, mapPartialInvoiceToApi(updates));
  }}
  onInvoiceDelete={async (id) => {
    await api.delete(`/invoices/${id}`);
  }}
>
  {children}
</InvoicesProvider>
```

Theme keys: see `theme/invoices-theme.ts`.

---

## 7. Persistence: localStorage → live API

### Adapter interface

```ts
interface InvoicesStorageAdapter {
  loadInvoices(): Invoice[] | null;
  saveInvoices(invoices: Invoice[]): void;
  loadExpenses(): Expense[] | null;
  saveExpenses(expenses: Expense[]): void;
  loadClients(): Client[] | null;
  saveClients(clients: Client[]): void;
  loadFilters(): InvoicesFilterState | null;
  saveFilters(filters: InvoicesFilterState): void;
  loadSettings(): WorkspaceSettings | null;
  saveSettings(settings: WorkspaceSettings): void;
  clearAll(): void;
}
```

Hooks call **synchronous** load/save. For APIs:

1. Keep an **in-memory cache** inside your adapter
2. **Hydrate** when React Query fetches
3. **Persist** on save via your API client (fire-and-forget or debounced)

See `core/adapters/api.adapter.example.ts` — copy to `lib/invoices-api-adapter.ts` and extend.

### localStorage (dev / offline)

```ts
import { createLocalStorageAdapter, DEFAULT_STORAGE_KEY } from '@/modules/invoices';

const adapter = createLocalStorageAdapter('imergix-invoices-v1');
```

---

## 8. Schema mapping (your DB ↔ module types)

### Invoice table → `Invoice`

```ts
function mapApiInvoice(row: ApiInvoice): Invoice {
  return {
    id: row.id,
    number: row.number,
    clientId: row.clientId ?? undefined,
    clientName: row.clientName,
    clientEmail: row.clientEmail,
    clientAddress: row.clientAddress ?? undefined,
    clientPhone: row.clientPhone ?? undefined,
    clientCompany: row.clientCompany ?? undefined,
    clientChamberOfCommerce: row.chamberOfCommerce ?? undefined,
    clientVatNumber: row.vatNumber ?? undefined,
    projectName: row.projectName ?? undefined,
    status: row.status,
    issueDate: row.issueDate,
    dueDate: row.dueDate,
    lineItems: row.lineItems.map(mapApiLineItem),
    notes: row.notes ?? undefined,
    paymentInstructions: row.paymentInstructions ?? undefined,
    termsAndConditions: row.termsAndConditions ?? undefined,
    currency: row.currency,
    subtotal: row.subtotal,
    taxTotal: row.taxTotal,
    total: row.total,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    sentAt: row.sentAt ?? undefined,
    paidAt: row.paidAt ?? undefined,
  };
}
```

### Client table → `Client`

```ts
function mapApiClient(row: ApiClient): Client {
  return {
    id: row.id,
    name: row.name,
    company: row.company ?? undefined,
    email: row.email,
    phone: row.phone ?? undefined,
    address: row.address ?? undefined,
    chamberOfCommerce: row.chamberOfCommerce ?? undefined,
    vatNumber: row.vatNumber ?? undefined,
    status: row.status ?? 'active',
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
```

### Expense table → `Expense`

```ts
function mapApiExpense(row: ApiExpense): Expense {
  return {
    id: row.id,
    amount: row.amount,
    category: row.category,
    entityType: row.entityType ?? undefined,
    entityId: row.entityId ?? undefined,
    entityName: row.entityName ?? undefined,
    date: row.date,
    description: row.description,
    notes: row.notes ?? undefined,
    createdAt: row.createdAt,
  };
}
```

### Workspace settings → `WorkspaceSettings`

Map your org/company profile fields to `WorkspaceSettings` (logo URL, bank details, invoice prefix, default tax rate, T&C).

---

## 9. Production wiring with React Query

```tsx
'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  InvoicesModule,
  InvoicesProvider,
  type Invoice,
  type Client,
  type Expense,
} from '@/modules/invoices';
import { createApiInvoicesAdapter } from '@/lib/invoices-api-adapter';

const adapter = createApiInvoicesAdapter({
  fetchInvoices: () => fetch('/api/invoices').then((r) => r.json()),
  saveInvoices: (invoices) =>
    fetch('/api/invoices/bulk', { method: 'PUT', body: JSON.stringify(invoices) }),
  fetchExpenses: () => fetch('/api/expenses').then((r) => r.json()),
  saveExpenses: (expenses) =>
    fetch('/api/expenses/bulk', { method: 'PUT', body: JSON.stringify(expenses) }),
  fetchClients: () => fetch('/api/clients').then((r) => r.json()),
  saveClients: (clients) =>
    fetch('/api/clients/bulk', { method: 'PUT', body: JSON.stringify(clients) }),
  fetchSettings: () => fetch('/api/workspace/settings').then((r) => r.json()),
  saveSettings: (settings) =>
    fetch('/api/workspace/settings', { method: 'PUT', body: JSON.stringify(settings) }),
});

export function InvoicesPage() {
  const qc = useQueryClient();

  const { data: invoices = [], isLoading: loadingInvoices } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => fetch('/api/invoices').then((r) => r.json() as Promise<Invoice[]>),
  });

  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: () => fetch('/api/expenses').then((r) => r.json() as Promise<Expense[]>),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['clients'],
    queryFn: () => fetch('/api/clients').then((r) => r.json() as Promise<Client[]>),
  });

  if (invoices.length) {
    adapter.hydrate({ invoices, expenses, clients });
  }

  if (loadingInvoices) return <Spinner />;

  return (
    <InvoicesProvider
      initialInvoices={invoices}
      initialExpenses={expenses}
      initialClients={clients}
      adapter={adapter}
      onInvoiceCreate={async (invoice) => {
        await fetch('/api/invoices', { method: 'POST', body: JSON.stringify(invoice) });
        qc.invalidateQueries({ queryKey: ['invoices'] });
      }}
      onInvoiceUpdate={async (id, updates) => {
        await fetch(`/api/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
        qc.invalidateQueries({ queryKey: ['invoices'] });
      }}
    >
      <InvoicesModule />
    </InvoicesProvider>
  );
}
```

**Recommended API design**

| Endpoint | Purpose |
|----------|---------|
| `GET /api/invoices` | List invoices with line items |
| `POST /api/invoices` | Create invoice |
| `PATCH /api/invoices/:id` | Partial update (status, line items) |
| `DELETE /api/invoices/:id` | Delete |
| `GET /api/clients` | Client directory |
| `GET /api/expenses` | Expense log |
| `GET /api/workspace/settings` | Company logo, bank, T&C |
| `PUT /api/workspace/settings` | Update company settings |

Alternatively: optimistic UI with bulk `PUT` endpoints if your adapter saves full arrays.

---

## 10. Expense entity linking (goals, kanban, projects)

Expenses support `entityType`: `project` | `goal` | `milestone` | `task` | `personal` | `general`.

Pass linkable entities via provider:

```tsx
import type { LinkableEntityGroups } from '@/modules/invoices';

const linkableEntities: LinkableEntityGroups = {
  projects: projects.map((p) => ({ id: p.id, name: p.name, type: 'project' })),
  goals: goals.map((g) => ({ id: g.id, name: g.title, type: 'goal' })),
  milestones: goals.flatMap((g) =>
    g.milestones.map((m) => ({
      id: m.id,
      name: m.title,
      type: 'milestone' as const,
      group: g.title,
    })),
  ),
  tasks: kanbanTasks.map((t) => ({
    id: t.id,
    name: t.title,
    type: 'task' as const,
  })),
};

<InvoicesProvider linkableEntities={linkableEntities} ...>
```

Utilities:

```ts
import {
  flattenLinkableEntities,
  groupLinkableEntities,
  resolveEntityName,
} from '@/modules/invoices';
```

If using `@imergix/goals` and `@imergix/kanban`, map their entities in your app layer — the invoices module stays decoupled.

---

## 11. Callbacks & side effects

| Callback | When fired |
|----------|------------|
| `onInvoicesChange(invoices)` | Any invoice write (after adapter save) |
| `onExpensesChange(expenses)` | Any expense write |
| `onClientsChange(clients)` | Any client write |
| `onInvoiceCreate(invoice)` | After create in builder |
| `onInvoiceUpdate(id, updates)` | Status changes, edits |
| `onInvoiceDelete(id)` | Delete from detail or list |
| `onExpenseCreate(expense)` | New expense logged |
| `onExpenseDelete(id)` | Expense removed |
| `onClientCreate(client)` | New client from selector |
| `onClientUpdate(id, updates)` | Client edited |
| `onClientDelete(id)` | Client removed |

Use granular callbacks when your API has individual endpoints instead of bulk save.

---

## 12. Custom UI with hooks

Build your own UI without `InvoicesModule`:

```tsx
import {
  useInvoices,
  useExpenses,
  useClients,
  useInvoicesModuleConfig,
  normalizeInvoice,
  computeFinanceSummary,
} from '@/modules/invoices';

function CustomFinanceApp() {
  const { adapter, storageKey, initialInvoices } = useInvoicesModuleConfig();

  const { filteredInvoices, createInvoice, updateInvoice, settings } = useInvoices({
    storageKey,
    initialInvoices,
    adapter,
  });

  // Render your own dashboard...
}
```

Exported utilities:

- `calculateInvoiceTotals`, `validateInvoiceDraft`, `formatCurrency`
- `computeFinanceSummary`, `computeMonthlyRevenue`
- `normalizeInvoice`, `resolveInvoiceStatus`
- `downloadInvoicePdf` — client-side PDF export

---

## 13. PDF & email

### PDF download

Requires `html2pdf.js` peer dependency. Uses the rendered `#invoice-preview-pdf` DOM node.

```tsx
import { downloadInvoicePdf } from '@/modules/invoices';

await downloadInvoicePdf('invoice-preview-pdf', 'INV-2026-001');
```

Or use `<PdfDownloadButton invoiceNumber="INV-2026-001" />` (internal UI — prefer utility in custom apps).

### Email template

`EmailTemplatePreview` shows the client-facing email layout. Wire `onSend` when your email provider is ready:

```tsx
<EmailTemplatePreview
  draft={draft}
  invoiceNumber={invoice.number}
  settings={settings}
  onSend={async (email) => {
    await fetch('/api/invoices/send', {
      method: 'POST',
      body: JSON.stringify({ invoiceId: invoice.id, to: email }),
    });
  }}
/>
```

---

## 14. Checklist before go-live

- [ ] Copied `modules/invoices/` to production app
- [ ] Tailwind scans module paths (`@source`)
- [ ] Installed `html2pdf.js` for PDF export
- [ ] Removed `DEFAULT_INVOICES`, `DEFAULT_EXPENSES`, `DEFAULT_CLIENTS` from prod routes
- [ ] API adapter hydrates from React Query or SSR props
- [ ] `InvoicesProvider` routes match your app URLs
- [ ] Workspace settings loaded from org profile API
- [ ] Clients synced from CRM / contacts API
- [ ] Expense `linkableEntities` wired from goals/kanban/projects (optional)
- [ ] Callbacks wired for create/update/delete
- [ ] No imports from `@/modules/invoices/ui/*` in app code
- [ ] Logo stored as URL or CDN path (not base64 in prod DB long-term)

---

## 15. Troubleshooting

### PDF download fails or is blank

Ensure `#invoice-preview-pdf` exists in DOM when download runs. Check `html2pdf.js` is installed. Logo images must be CORS-accessible or base64.

### Invoice not found on detail page

Each route creates its own `InvoicesProvider`. Hydrate adapter with the same data source, or lift provider to a shared layout.

### Styles missing

Add `@source "../modules/invoices/**/*.{ts,tsx}"` in Tailwind CSS.

### Duplicate data between tabs

Use a single `storageKey` and shared adapter instance per workspace.

### Type errors after copy

Match Next.js / React / TypeScript versions with sandbox. Ensure `@/*` path alias resolves module root.

---

## Related

- [Goals INTEGRATION.md](../goals/INTEGRATION.md) — goals/milestones for expense linking
- [Kanban INTEGRATION.md](../kanban/INTEGRATION.md) — tasks/projects for expense linking
- [README.md](./README.md) — quick reference & folder map

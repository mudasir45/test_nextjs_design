# Kanban Module — Integration Guide

Complete guide for moving `@imergix/kanban` from this design sandbox into your production Next.js app (Imergix or any project). Based on 2025–2026 patterns: **folder copy first**, optional **pnpm workspace** later.

---

## Table of contents

1. [Recommended approach](#1-recommended-approach)
2. [What you are copying](#2-what-you-are-copying)
3. [Method A — Copy folder (fastest)](#3-method-a--copy-folder-fastest)
4. [Method B — pnpm workspace (scalable)](#4-method-b--pnpm-workspace-scalable)
5. [Host app requirements](#5-host-app-requirements)
6. [Design system & theming](#6-design-system--theming)
7. [Entities (projects, goals, milestones, users)](#7-entities-projects-goals-milestones-users)
8. [Persistence: localStorage → API](#8-persistence-localstorage--api)
9. [Schema mapping (your DB ↔ Kanban types)](#9-schema-mapping-your-db--kanban-types)
10. [Production wiring with React Query](#10-production-wiring-with-react-query)
11. [Callbacks & side effects](#11-callbacks--side-effects)
12. [URL scope sync (optional)](#12-url-scope-sync-optional)
13. [Checklist before go-live](#13-checklist-before-go-live)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Recommended approach

| Stage | What to do | When |
|-------|------------|------|
| **Now** | Copy `modules/kanban/` into prod app | First integration |
| **Soon** | Wire `KanbanProvider` + API adapter | Replace localStorage |
| **Later** | Extract to `packages/kanban` in monorepo | Multiple apps share board |

**Why folder copy first?**

- Zero publish/version overhead
- Same `@/modules/kanban` import path works in both repos
- You can customize in place, then extract to a package when stable

**Why not npm on day one?**

- Internal modules change often during API integration
- Copy + path alias is the standard 2025–2026 workflow before monorepo extraction

---

## 2. What you are copying

Copy the entire folder:

```
modules/kanban/
```

**Do not copy** (left behind in sandbox):

- `components/ui/kanban/` (old location — deleted after migration)
- `lib/kanban-storage.ts` (merged into `core/adapters/`)
- `lib/description-utils.ts` (merged into `core/description-utils.ts`)

**Public API** — only import from:

```ts
import {
  KanbanBoard,
  KanbanProvider,
  createLocalStorageAdapter,
  type KanbanStorageAdapter,
  type Task,
  type Column,
  type KanbanEntities,
} from '@/modules/kanban';
```

Never import from `@/modules/kanban/ui/...` in your app code.

---

## 3. Method A — Copy folder (fastest)

### Step 1 — Copy files

```bash
# From this repo → your Imergix repo
cp -r modules/kanban /path/to/imergix/modules/kanban
```

### Step 2 — Path alias

In `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

If your app uses `@/` → `src/`, either:

- Put module at `src/modules/kanban`, **or**
- Add `"@/modules/*": ["./modules/*"]`

### Step 3 — Install peer dependencies

```bash
pnpm add lucide-react clsx tailwind-merge class-variance-authority @radix-ui/react-avatar
```

(You likely already have these if using shadcn.)

### Step 4 — Tailwind must scan the module

In Tailwind v4, ensure module files are included. If using `@source` in CSS:

```css
@source "../modules/kanban/**/*.{ts,tsx}";
```

Or include `modules/` in your content paths if using a `tailwind.config` pattern.

### Step 5 — Create a page

```tsx
// app/(dashboard)/board/page.tsx
'use client';

import { KanbanBoard, KanbanProvider } from '@/modules/kanban';
import { useWorkspaceEntities } from '@/hooks/use-workspace-entities'; // your hook

export default function BoardPage() {
  const { entities, isLoading } = useWorkspaceEntities();

  if (isLoading) return <div>Loading…</div>;

  return (
    <main className="flex h-[calc(100vh-4rem)] flex-col px-4 py-6">
      <KanbanProvider entities={entities}>
        <KanbanBoard storageKey="imergix-board-v1" />
      </KanbanProvider>
    </main>
  );
}
```

### Step 6 — Verify

```bash
pnpm dev
# Open /board — drag tasks, scope navigator, task modal
pnpm build
```

---

## 4. Method B — pnpm workspace (scalable)

Use when design sandbox and Imergix live in one monorepo.

### Root `pnpm-workspace.yaml`

```yaml
packages:
  - 'apps/*'
  - 'modules/*'
```

### `modules/kanban/package.json` (already included)

```json
{
  "name": "@imergix/kanban",
  "exports": { ".": "./index.ts" },
  "peerDependencies": { "react": "^19", "next": ">=15" }
}
```

### App `package.json`

```json
{
  "dependencies": {
    "@imergix/kanban": "workspace:*"
  }
}
```

### `next.config.ts`

```ts
const nextConfig = {
  transpilePackages: ['@imergix/kanban'],
};
```

Then import:

```ts
import { KanbanBoard } from '@imergix/kanban';
```

---

## 5. Host app requirements

### CSS semantic tokens

The module uses shadcn-style tokens. Your `globals.css` must define at minimum:

```css
:root {
  --background: ...;
  --foreground: ...;
  --primary: ...;
  --primary-foreground: ...;
  --muted: ...;
  --muted-foreground: ...;
  --border: ...;
  --card: ...;
  --ring: ...;
}
```

Kanban buttons and scope UI map to **`primary`**, not a custom `--cta` variable.

### Optional module CSS

```css
@import "@/modules/kanban/theme/kanban.css";
```

### Client components

`KanbanBoard` and `KanbanProvider` are `'use client'`. Your page route must be a client component or wrap them in one.

---

## 6. Design system & theming

### Default (zero config)

Uses your app's `primary` palette automatically.

### Custom theme

```tsx
<KanbanProvider
  entities={entities}
  theme={{
    buttonPrimary: 'bg-violet-600 text-white hover:bg-violet-700',
    scopeActive: 'border-violet-400/40 bg-violet-500/5 ring-2 ring-violet-500/10',
    accentText: 'text-violet-600',
    headerIcon: 'bg-violet-500/10 text-violet-600',
  }}
>
  <KanbanBoard />
</KanbanProvider>
```

All theme keys: see `theme/kanban-theme.ts`.

### Custom assignee avatars

```tsx
<KanbanProvider
  entities={entities}
  resolveAssignee={(assigneeId, entities) => {
    const user = entities.assignees.find((a) => a.id === assigneeId);
    if (!user) return undefined;
    return {
      name: user.label,
      avatar: `/api/users/${assigneeId}/avatar`, // your CDN
    };
  }}
>
  <KanbanBoard />
</KanbanProvider>
```

---

## 7. Entities (projects, goals, milestones, users)

Pass real data via `KanbanProvider`:

```ts
interface KanbanEntities {
  projects: KanbanEntity[];
  assignees: KanbanEntity[];
  goals: KanbanEntity[];
  milestones: KanbanEntity[]; // each must have goalId
}

interface KanbanEntity {
  id: string;
  label: string;
  color?: string;
  subtitle?: string;
  goalId?: string; // milestones only
}
```

Example mapper from your API:

```ts
function toKanbanEntities(workspace: Workspace): KanbanEntities {
  return {
    projects: workspace.projects.map((p) => ({
      id: p.id,
      label: p.name,
      color: p.color,
      subtitle: p.status,
    })),
    assignees: workspace.members.map((m) => ({
      id: m.userId,
      label: m.name,
      subtitle: m.role,
    })),
    goals: workspace.goals.map((g) => ({
      id: g.id,
      label: g.title,
      color: g.color,
    })),
    milestones: workspace.milestones.map((m) => ({
      id: m.id,
      label: m.title,
      goalId: m.goalId,
      subtitle: m.dueDate,
    })),
  };
}
```

**Do not** use `DEFAULT_ENTITIES` from `demo/` in production.

---

## 8. Persistence: localStorage → API

### Interface

```ts
interface KanbanStorageAdapter {
  loadColumns(): Column[] | null;
  saveColumns(columns: Column[]): void;
  loadScope(): BoardScopeState | null;
  saveScope(state: BoardScopeState): void;
  clearBoard(): void;
}
```

### Demo / offline (default)

```tsx
import { createLocalStorageAdapter } from '@/modules/kanban';

const adapter = createLocalStorageAdapter({ storageKey: 'imergix-board-v1' });

<KanbanBoard adapter={adapter} />
```

### API adapter (example skeleton)

```ts
import type { KanbanStorageAdapter, Column, BoardScopeState } from '@/modules/kanban';

export function createApiBoardAdapter(boardId: string): KanbanStorageAdapter {
  return {
    loadColumns() {
      // Prefer React Query — this sync API is for simple cases only
      return null;
    },
    saveColumns(columns: Column[]) {
      void fetch(`/api/boards/${boardId}`, {
        method: 'PUT',
        body: JSON.stringify({ columns }),
      });
    },
    loadScope() {
      return null;
    },
    saveScope(state: BoardScopeState) {
      void fetch(`/api/boards/${boardId}/scope`, {
        method: 'PUT',
        body: JSON.stringify(state),
      });
    },
    clearBoard() {
      void fetch(`/api/boards/${boardId}`, { method: 'DELETE' });
    },
  };
}
```

For production, prefer **server as source of truth** (see §10) instead of save-on-every-keystroke.

---

## 9. Schema mapping (your DB ↔ Kanban types)

Keep Kanban's internal `Task` stable. Map at the boundary.

### Kanban task shape

```ts
interface Task {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assigneeId?: string;
  assignee?: { name: string; avatar: string };
  tags?: string[];
  dueDate?: string;
  entityLink?: { type: 'project' | 'goal' | 'milestone'; id: string };
  activity?: { id: string; text: string; createdAt: string }[];
  createdAt?: string;
  updatedAt?: string;
}
```

### Example: Prisma → Kanban

```ts
function mapDbTask(row: DbTask): Task {
  return {
    id: row.id,
    title: row.title,
    description: row.bodyHtml ?? undefined,
    priority: row.priority as Task['priority'],
    assigneeId: row.ownerId ?? undefined,
    dueDate: row.dueAt?.toISOString(),
    tags: row.tags,
    entityLink: row.milestoneId
      ? { type: 'milestone', id: row.milestoneId }
      : row.goalId
        ? { type: 'goal', id: row.goalId }
        : row.projectId
          ? { type: 'project', id: row.projectId }
          : undefined,
    activity: row.comments.map((c) => ({
      id: c.id,
      text: c.body,
      createdAt: c.createdAt.toISOString(),
    })),
  };
}
```

### Columns

Kanban expects:

```ts
interface Column {
  id: string;
  title: string;
  color?: string;
  tasks: Task[];
}
```

Map your workflow statuses:

```ts
const columns = statuses.map((status) => ({
  id: status.id,
  title: status.name,
  color: status.color,
  tasks: tasks.filter((t) => t.statusId === status.id).map(mapDbTask),
}));
```

---

## 10. Production wiring with React Query

Recommended pattern: **fetch board on server/client, pass data via provider, persist mutations via callbacks**.

```tsx
'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { KanbanBoard, KanbanProvider, type Column } from '@/modules/kanban';

export function ProjectBoard({ boardId }: { boardId: string }) {
  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetch(`/api/boards/${boardId}`).then((r) => r.json()),
  });

  const patchBoard = useMutation({
    mutationFn: (columns: Column[]) =>
      fetch(`/api/boards/${boardId}`, {
        method: 'PATCH',
        body: JSON.stringify({ columns }),
      }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['board', boardId] }),
  });

  if (!data) return null;

  return (
    <KanbanProvider
      entities={data.entities}
      onColumnsChange={(columns) => patchBoard.mutate(columns)}
      onTaskMove={(taskId, from, to) => {
        // Optional granular API instead of full board PATCH
        fetch(`/api/tasks/${taskId}/move`, {
          method: 'POST',
          body: JSON.stringify({ fromColumnId: from, toColumnId: to }),
        });
      }}
    >
      <KanbanBoard
        storageKey={`board-${boardId}`}
        initialColumns={data.columns}
      />
    </KanbanProvider>
  );
}
```

**Tip:** Debounce `onColumnsChange` (300–500ms) if PATCH sends the full board.

---

## 11. Callbacks & side effects

`KanbanProvider` callbacks:

| Callback | When fired |
|----------|------------|
| `onColumnsChange` | Any column/task change after hydration |
| `onScopeChange` | Scope or assignee filter changes |
| `onTaskCreate` | Quick-add creates a task |
| `onTaskUpdate` | Task edited in modal |
| `onTaskDelete` | Task deleted |
| `onTaskMove` | Drag-drop or status change in modal |

Use `onTaskCreate` to replace client `generateId` with server IDs:

```tsx
onTaskCreate={async (task, columnId) => {
  const created = await createTaskApi({ ...task, columnId });
  // Refetch board or optimistically replace temp id
}}
```

---

## 12. URL scope sync (optional)

```tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { KanbanBoard, KanbanProvider, type BoardScopeState } from '@/modules/kanban';

function BoardWithUrlScope() {
  const router = useRouter();
  const params = useSearchParams();

  const handleScopeChange = (state: BoardScopeState) => {
    const q = new URLSearchParams();
    if (state.scope.view === 'project') q.set('project', state.scope.projectId);
    if (state.scope.view === 'goal') {
      q.set('goal', state.scope.goalId);
      if (state.scope.milestoneId) q.set('milestone', state.scope.milestoneId);
    }
    if (state.assigneeId) q.set('assignee', state.assigneeId);
    router.replace(`?${q.toString()}`, { scroll: false });
  };

  return (
    <KanbanProvider entities={entities} onScopeChange={handleScopeChange}>
      <KanbanBoard />
    </KanbanProvider>
  );
}
```

Parse `params` on mount to set initial scope (extend with a small helper in your app).

---

## 13. Checklist before go-live

- [ ] Copied `modules/kanban/` completely
- [ ] Path alias resolves (`@/modules/kanban`)
- [ ] Tailwind scans module files
- [ ] Semantic CSS tokens present (`primary`, `muted`, `border`, …)
- [ ] `DEFAULT_ENTITIES` / `DEFAULT_COLUMNS` not used in prod
- [ ] Real `entities` from API
- [ ] Task IDs from server (not `generateId`) for creates
- [ ] Persistence strategy chosen (API PATCH vs adapter)
- [ ] Assignee avatars from your user service
- [ ] `pnpm build` passes
- [ ] Test: drag-drop, scope navigator, task modal, add task, reset (disabled in prod if needed)

---

## 14. Troubleshooting

### "Cannot use hooks" / duplicate React

Module and app must share one React instance. In monorepos, declare `react` as **peerDependency** in `modules/kanban/package.json` (already done), not as a direct dependency of the module.

### Module not styled / unstyled cards

Tailwind is not scanning `modules/kanban`. Add `@source` or content path.

### `useKanbanContext must be used within KanbanProvider`

Wrap `<KanbanBoard />` in `<KanbanProvider entities={...}>`, or pass `entities` prop directly to `KanbanBoard` (works standalone with demo defaults).

### Types don't match my database

Do not change Kanban types first — add mappers in your app layer (§9).

### Full board PATCH is too heavy

Use granular callbacks (`onTaskMove`, `onTaskUpdate`) and disable debounced full `onColumnsChange`.

---

## Summary

1. **Copy** `modules/kanban/` → your app  
2. **Configure** path alias + Tailwind + CSS tokens  
3. **Wrap** in `KanbanProvider` with real `entities`  
4. **Map** your DB schema at the boundary  
5. **Persist** via callbacks or custom `KanbanStorageAdapter`  
6. **Theme** via `theme` prop or your global `primary` tokens  

When stable, promote to `@imergix/kanban` workspace package with `transpilePackages`.

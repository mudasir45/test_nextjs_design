# Goals Module — Integration Guide

Complete guide for moving `@imergix/goals` from this design sandbox into your production Next.js app (Imergix or any project). Pairs with `@imergix/kanban` for task-type milestones.

---

## Table of contents

1. [Recommended approach](#1-recommended-approach)
2. [What you are copying](#2-what-you-are-copying)
3. [Module structure](#3-module-structure)
4. [Install & path alias](#4-install--path-alias)
5. [Routes & pages](#5-routes--pages)
6. [Provider & theming](#6-provider--theming)
7. [Persistence: localStorage → live API](#7-persistence-localstorage--live-api)
8. [Schema mapping (your DB ↔ Goal types)](#8-schema-mapping-your-db--goal-types)
9. [Production wiring with React Query](#9-production-wiring-with-react-query)
10. [Kanban integration (task milestones)](#10-kanban-integration-task-milestones)
11. [Callbacks & side effects](#11-callbacks--side-effects)
12. [Custom UI with hooks](#12-custom-ui-with-hooks)
13. [Checklist before go-live](#13-checklist-before-go-live)
14. [Troubleshooting](#14-troubleshooting)

---

## 1. Recommended approach

| Stage | What to do | When |
|-------|------------|------|
| **Now** | Copy `modules/goals/` + `modules/kanban/` into prod | First integration |
| **Soon** | Wire `GoalsProvider` + API adapter + React Query | Replace localStorage |
| **Later** | Extract to `packages/goals` in monorepo | Multiple apps share module |

Copy the folder first — same workflow as the Kanban module. No npm publish required on day one.

---

## 2. What you are copying

```bash
cp -r modules/goals /path/to/imergix/modules/goals
cp -r modules/kanban /path/to/imergix/modules/kanban
```

**Public API** — import only from:

```ts
import {
  GoalsModule,
  GoalDetailPage,
  GoalsProvider,
  useGoals,
  useGoalDetail,
  createLocalStorageAdapter,
  type GoalsStorageAdapter,
  type Goal,
  type GoalMilestone,
  type CreateGoalPayload,
  type MilestoneTargetType,
} from '@/modules/goals';
```

**Do not** import from `@/modules/goals/ui/...` in app code. Internal UI lives under `ui/board`, `ui/milestones`, etc.

**Do not use in production:** `demo/default-goals.ts` (`DEFAULT_GOALS`). Seed from your API instead.

---

## 3. Module structure

```
modules/goals/
├── index.ts                    # Public exports
├── GoalsModule.tsx             # Main list (vision board)
├── GoalDetailPage.tsx          # Detail page (reflect + milestones)
├── core/
│   ├── types.ts                # Domain types
│   ├── routes.ts               # URL helpers
│   ├── adapters/
│   │   ├── types.ts            # GoalsStorageAdapter interface
│   │   ├── local-storage.adapter.ts
│   │   └── api.adapter.example.ts   # Copy & adapt for API
│   ├── hooks/
│   │   ├── use-goals.ts        # CRUD + filters
│   │   ├── use-goal-detail.ts  # Single goal actions
│   │   └── use-kanban-bridge.ts # Task ↔ milestone sync
│   ├── progress-utils.ts
│   ├── milestone-utils.ts
│   ├── check-in-utils.ts
│   └── kanban-task-bridge.ts
├── provider/GoalsProvider.tsx
├── theme/
└── ui/
    ├── board/      # Vision board, toolbar, cards
    ├── create/     # Goal creation drawer & flow
    ├── milestones/ # Typed milestones (boolean, number, currency, tasks)
    ├── reflect/    # Daily check-in panel
    ├── shell/      # Drawer overlay
    ├── shared/     # ProgressRing
    └── primitives/
```

### Domain model (summary)

| Type | Purpose |
|------|---------|
| `Goal` | Title, motivation, category, status, milestones, checkIns |
| `GoalMilestone` | Typed target: `boolean` \| `number` \| `currency` \| `tasks` |
| `GoalCheckIn` | Daily reflection (mood, momentum, note) — one per calendar day |
| `MilestoneDraft` | Create/edit payload including `newTaskTitles`, `linkTaskIds` |

Progress is computed from milestones (average of per-milestone completion). Task milestones read completion from Kanban (tasks in **Done** column linked via `entityLink`).

---

## 4. Install & path alias

### Peer dependencies

```bash
pnpm add lucide-react clsx tailwind-merge class-variance-authority
```

(Kanban peer deps apply if using task milestones.)

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
@source "../modules/goals/**/*.{ts,tsx}";
@source "../modules/kanban/**/*.{ts,tsx}";
```

### CSS tokens

Uses shadcn-style semantic tokens: `background`, `foreground`, `muted`, `border`, `card`, `primary`, etc.

---

## 5. Routes & pages

### Default routes

| Route | Component |
|-------|-----------|
| `/goals` | `GoalsModule` |
| `/goals/[goalId]` | `GoalDetailPage` |

### Sandbox example

```tsx
// app/goals/page.tsx
'use client';

import { GoalsModule, GoalsProvider } from '@/modules/goals';

export default function GoalsPage() {
  return (
    <GoalsProvider initialGoals={[]}>
      <GoalsModule />
    </GoalsProvider>
  );
}
```

```tsx
// app/goals/[goalId]/page.tsx
'use client';

import { use } from 'react';
import { GoalDetailPage, GoalsProvider } from '@/modules/goals';

export default function GoalDetailRoute({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = use(params);
  return (
    <GoalsProvider initialGoals={[]}>
      <GoalDetailPage goalId={goalId} />
    </GoalsProvider>
  );
}
```

### Custom URL structure

Override routes on the provider:

```tsx
<GoalsProvider
  initialGoals={goals}
  routes={{
    index: '/workspace/objectives',
    detail: (id) => `/workspace/objectives/${id}`,
    kanbanForGoal: (id) => `/workspace/board?goal=${id}`,
  }}
>
  <GoalsModule />
</GoalsProvider>
```

Access anywhere in the module via `useGoalsRoutes()`.

---

## 6. Provider & theming

```tsx
<GoalsProvider
  initialGoals={goalsFromApi}
  adapter={goalsAdapter}
  storageKey="imergix-goals-prod"
  theme={{
    buttonPrimary: 'bg-teal-600 text-white hover:bg-teal-700',
    accentText: 'text-teal-600 dark:text-teal-400',
    spinner: 'border-border border-t-teal-500',
  }}
  onGoalCreate={async (goal) => {
    await api.post('/goals', mapGoalToApi(goal));
  }}
  onGoalUpdate={async (goalId, updates) => {
    await api.patch(`/goals/${goalId}`, mapPartialGoalToApi(updates));
  }}
  onGoalDelete={async (goalId) => {
    await api.delete(`/goals/${goalId}`);
  }}
  onGoalsChange={(goals) => {
    // Optional: debounced bulk sync
  }}
>
  {children}
</GoalsProvider>
```

Theme keys: see `theme/goals-theme.ts`.

---

## 7. Persistence: localStorage → live API

### Adapter interface

```ts
interface GoalsStorageAdapter {
  loadGoals(): Goal[] | null;
  saveGoals(goals: Goal[]): void;
  loadFilters(): GoalsFilterState | null;
  saveFilters(filters: GoalsFilterState): void;
  clearGoals(): void;
}
```

The hooks (`useGoals`) call **synchronous** load/save. For APIs:

1. Keep an **in-memory cache** inside your adapter
2. **Hydrate** the cache when React Query fetches
3. **Persist** on save via `fetch` / your API client (fire-and-forget or debounced)

See `core/adapters/api.adapter.example.ts` — copy to your app and extend.

### localStorage (dev / offline)

```ts
import { createLocalStorageAdapter, DEFAULT_STORAGE_KEY } from '@/modules/goals';

const adapter = createLocalStorageAdapter('imergix-goals-v1');
```

---

## 8. Schema mapping (your DB ↔ Goal types)

Example REST shapes — adjust to your schema.

### Goal table → `Goal`

```ts
function mapApiGoal(row: ApiGoal): Goal {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    motivation: row.motivation ?? undefined,
    category: row.category,
    status: row.status,
    priority: row.priority,
    color: row.color ?? '#0D9488',
    progressType: 'milestone',
    progressValue: row.progressValue ?? 0,
    keyResults: [],
    milestones: row.milestones.map(mapApiMilestone),
    startDate: row.startedAt,
    targetDate: row.targetAt ?? undefined,
    completedAt: row.completedAt ?? undefined,
    reviewFrequency: row.reviewFrequency ?? undefined,
    tags: row.tags ?? [],
    checkIns: row.checkIns.map(mapApiCheckIn),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
```

### Milestone table → `GoalMilestone`

```ts
function mapApiMilestone(row: ApiMilestone): GoalMilestone {
  return {
    id: row.id,
    title: row.title,
    targetType: row.targetType, // 'boolean' | 'number' | 'currency' | 'tasks'
    dueDate: row.dueDate ?? undefined,
    status: row.status,
    order: row.sortOrder,
    startValue: row.startValue ?? undefined,
    targetValue: row.targetValue ?? undefined,
    currentValue: row.currentValue ?? undefined,
    unit: row.unit ?? undefined,
    taskTarget: row.taskTarget ?? undefined,
    taskCompleted: row.taskCompleted ?? undefined,
    completedAt: row.completedAt ?? undefined,
  };
}
```

### Check-in table → `GoalCheckIn`

```ts
function mapApiCheckIn(row: ApiCheckIn): GoalCheckIn {
  return {
    id: row.id,
    date: row.recordedAt,
    note: row.note,
    progressSnapshot: row.progressSnapshot,
    mood: row.mood ?? undefined,
    momentum: row.momentum ?? undefined,
  };
}
```

### Create payload → API POST

```ts
function mapCreatePayload(payload: CreateGoalPayload) {
  return {
    title: payload.title,
    motivation: payload.motivation,
    category: payload.category,
    priority: payload.priority,
    color: payload.color,
    targetAt: payload.targetDate,
    milestones: payload.milestones?.map((m) => ({
      title: m.title,
      targetType: m.targetType,
      dueDate: m.dueDate,
      startValue: m.startValue,
      targetValue: m.targetValue,
      unit: m.unit,
      // Task drafts: create tasks server-side or via Kanban API
      newTaskTitles: m.newTaskTitles,
      linkTaskIds: m.linkTaskIds,
    })),
  };
}
```

---

## 9. Production wiring with React Query

```tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  GoalsModule,
  GoalsProvider,
  createApiGoalsAdapter,
  type Goal,
} from '@/modules/goals';
import { createApiGoalsAdapter } from '@/lib/goals-api-adapter';

const adapter = createApiGoalsAdapter({
  fetchGoals: () => fetch('/api/goals').then((r) => r.json()),
  saveGoals: (goals) =>
    fetch('/api/goals/bulk', {
      method: 'PUT',
      body: JSON.stringify(goals),
    }),
});

export function GoalsPage() {
  const qc = useQueryClient();

  const { data: goals = [], isLoading } = useQuery({
    queryKey: ['goals'],
    queryFn: () => fetch('/api/goals').then((r) => r.json() as Promise<Goal[]>),
  });

  // Hydrate adapter when data arrives
  if (goals.length && adapter.loadGoals()?.length !== goals.length) {
    adapter.hydrate(goals);
  }

  if (isLoading) return <Spinner />;

  return (
    <GoalsProvider
      initialGoals={goals}
      adapter={adapter}
      onGoalCreate={async (goal) => {
        await fetch('/api/goals', { method: 'POST', body: JSON.stringify(goal) });
        qc.invalidateQueries({ queryKey: ['goals'] });
      }}
      onGoalUpdate={async (id, updates) => {
        await fetch(`/api/goals/${id}`, { method: 'PATCH', body: JSON.stringify(updates) });
        qc.invalidateQueries({ queryKey: ['goals'] });
      }}
    >
      <GoalsModule />
    </GoalsProvider>
  );
}
```

**Recommended API design**

| Endpoint | Purpose |
|----------|---------|
| `GET /api/goals` | List all goals with milestones + recent checkIns |
| `POST /api/goals` | Create goal (+ nested milestones) |
| `PATCH /api/goals/:id` | Partial update |
| `DELETE /api/goals/:id` | Delete |
| `POST /api/goals/:id/check-ins` | Add/update daily reflection |
| `PATCH /api/goals/:id/milestones/:msId` | Update milestone values |

Alternatively: optimistic UI with bulk `PUT /api/goals` if your adapter saves the full array.

---

## 10. Kanban integration (task milestones)

Task-type milestones (`targetType: 'tasks'`) link Kanban tasks via:

```ts
task.entityLink = { type: 'milestone', id: milestoneId };
```

### Requirements

1. Copy **both** `modules/goals` and `modules/kanban`
2. Use the **same** Kanban storage/API in prod
3. Pass live goals into Kanban entities for link pickers:

```ts
import { goalsToKanbanEntities, milestonesToKanbanEntities } from '@/modules/goals';

const entities: KanbanEntities = {
  projects: workspace.projects,
  assignees: workspace.members,
  goals: goalsToKanbanEntities(goals),
  milestones: milestonesToKanbanEntities(goals),
};
```

4. `GoalDetailPage` uses `useKanbanBridge(goals)` — ensure Kanban columns are hydrated from your API before rendering detail pages with task milestones.

### Task completion → milestone progress

- `taskTarget` = count of tasks linked to milestone
- `taskCompleted` = linked tasks in Kanban **Done** column
- Milestone completes when all linked tasks are done

When moving to API-only Kanban, replace `useKanbanBridge` persistence with your Kanban API adapter (see Kanban INTEGRATION.md).

---

## 11. Callbacks & side effects

| Callback | When fired |
|----------|------------|
| `onGoalsChange(goals)` | Any write to goals state (after adapter save) |
| `onGoalCreate(goal)` | After `createGoal` in creation flow |
| `onGoalUpdate(goalId, updates)` | Wire manually in API layer or extend hooks |
| `onGoalDelete(goalId)` | Wire manually on delete |

Use callbacks to sync individual mutations to your API instead of bulk save when you have granular endpoints.

---

## 12. Custom UI with hooks

Build your own UI without `GoalsModule`:

```tsx
import { useGoals, useGoalDetail, normalizeGoal } from '@/modules/goals';

function CustomGoalsApp({ adapter, initialGoals }) {
  const { filteredGoals, createGoal, updateGoal, addCheckIn } = useGoals({
    storageKey: 'goals',
    initialGoals,
    adapter,
  });

  // Render your own list...
}
```

Exported utilities:

- `getEffectiveProgress(goal)` — headline progress %
- `normalizeGoal(goal)` — migrate legacy data
- `isMilestoneComplete(milestone)`
- `formatMilestoneProgressLabel(milestone)`
- `TARGET_TYPE_OPTIONS` — milestone type metadata

---

## 13. Checklist before go-live

- [ ] Copied `modules/goals` (+ `modules/kanban` for tasks)
- [ ] Tailwind scans module paths
- [ ] Removed `DEFAULT_GOALS` from production routes
- [ ] API adapter hydrates from React Query (or SSR props)
- [ ] `GoalsProvider` routes match your app URLs
- [ ] Kanban entities built from live goals
- [ ] Task `entityLink` persisted in your tasks API
- [ ] Check-ins: server enforces one per user per goal per day (optional)
- [ ] Callbacks wired for create/update/delete
- [ ] No imports from `@/modules/goals/ui/*` in app code

---

## 14. Troubleshooting

### Tasks disappear after adding milestone

Kanban bridge state must update when tasks are created during milestone save. Ensure `useKanbanBridge` loads from the same storage/API your Kanban board uses.

### Progress shows 0% with milestones

Run `normalizeGoal` on API responses. Legacy milestones missing `targetType` default to `boolean`.

### “Add tasks” shown after linking tasks

Usually stale Kanban state vs goals state — refresh Kanban columns from API after task mutations.

### Module styles missing

Add `@source` for `modules/goals/**` in Tailwind config/CSS.

### Type errors after copy

Ensure the same Next.js / React / TypeScript versions as sandbox, and both modules use matching `@/*` alias.

---

## Related

- [Kanban INTEGRATION.md](../kanban/INTEGRATION.md) — task board API & entities
- [README.md](./README.md) — quick reference & folder map

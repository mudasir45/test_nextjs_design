# @imergix/goals

Portable Goals module for Next.js — motivation-first UX, typed milestones, daily reflections, Kanban task linking.

**Full integration guide:** [INTEGRATION.md](./INTEGRATION.md)

## Quick start (sandbox)

```tsx
// app/goals/page.tsx
'use client';

import { GoalsModule, GoalsProvider, DEFAULT_GOALS } from '@/modules/goals';

export default function GoalsPage() {
  return (
    <GoalsProvider initialGoals={DEFAULT_GOALS}>
      <GoalsModule />
    </GoalsProvider>
  );
}
```

## Export to production

```bash
cp -r modules/goals /path/to/your-app/modules/goals
cp -r modules/kanban /path/to/your-app/modules/kanban   # required for task-type milestones
```

Import only from `@/modules/goals` — never from internal `ui/` paths.

## Folder layout

```
modules/goals/
├── index.ts                 # Public API
├── INTEGRATION.md           # Production guide (API, Kanban, routes)
├── GoalsModule.tsx          # List / vision board
├── GoalDetailPage.tsx       # Detail + milestones + reflect
├── core/
│   ├── types.ts             # Goal, Milestone, CheckIn, payloads
│   ├── adapters/            # Storage boundary (localStorage → API)
│   ├── hooks/               # useGoals, useGoalDetail, useKanbanBridge
│   ├── progress-utils.ts    # Progress calculation
│   ├── milestone-utils.ts   # Normalization & completion
│   ├── kanban-task-bridge.ts
│   └── routes.ts            # Configurable URLs
├── provider/GoalsProvider.tsx
├── theme/
├── demo/                    # DEFAULT_GOALS — dev only
└── ui/
    ├── board/               # Vision board, toolbar, cards
    ├── create/              # Creation drawer & flow
    ├── milestones/          # Typed milestone system
    ├── reflect/             # Daily check-in
    ├── detail/              # Legacy panels (optional)
    ├── shell/               # Drawer shell
    ├── shared/              # ProgressRing, etc.
    └── primitives/          # Badge, Card
```

## Kanban dependency

Task-type milestones link to `@imergix/kanban` tasks via `entityLink: { type: 'milestone', id }`.
Both modules should share the same Kanban storage adapter / API in production.

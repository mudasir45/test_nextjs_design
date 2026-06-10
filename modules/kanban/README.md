# Kanban Module

Portable Kanban board for Next.js 15+ / 16 apps. Self-contained under `modules/kanban/`.

## Quick start (this repo)

```tsx
import { KanbanBoard, KanbanProvider, DEFAULT_ENTITIES } from '@/modules/kanban';

<KanbanProvider entities={DEFAULT_ENTITIES}>
  <KanbanBoard />
</KanbanProvider>
```

## Documentation

**→ [INTEGRATION.md](./INTEGRATION.md)** — full guide for copying into Imergix or any Next.js project.

## Structure

```
modules/kanban/
├── index.ts              # Public API (import only from here)
├── KanbanBoard.tsx       # Main component
├── provider/             # Context: entities, adapter, theme, callbacks
├── core/                 # Types, hooks, scope logic, adapters
├── ui/                   # Presentational components + shadcn primitives
├── theme/                # Theme tokens + optional CSS
└── demo/                 # Sample data (not for production)
```

## Dependencies

Host app must provide: React 19, Tailwind v4, lucide-react, and semantic CSS tokens (`primary`, `muted`, `border`, etc.).

The module bundles its own `card`, `badge`, and `avatar` primitives.

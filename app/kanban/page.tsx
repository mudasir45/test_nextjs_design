'use client';

import { KanbanBoard, KanbanProvider, DEFAULT_ENTITIES } from '@/modules/kanban';

export default function KanbanPage() {
  return (
    <main className="flex h-[calc(100vh-0px)] flex-col overflow-hidden bg-background px-4 py-6 md:px-8">
      <KanbanProvider entities={DEFAULT_ENTITIES}>
        <KanbanBoard />
      </KanbanProvider>
    </main>
  );
}

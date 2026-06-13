'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { KanbanBoard, KanbanProvider, DEFAULT_ENTITIES } from '@/modules/kanban';
import type { BoardScope } from '@/modules/kanban/core/types';


export default function KanbanPage() {
  return (
    <Suspense
      fallback={
        <main className="flex h-[calc(100vh-0px)] items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
        </main>
      }
    >
      <KanbanPageContent />
    </Suspense>
  );
}

function KanbanPageContent() {
  const searchParams = useSearchParams();
  const scopeParam = searchParams.get('scope');
  const goalId = searchParams.get('goalId');
  const projectId = searchParams.get('projectId');

  const initialScope: BoardScope | null =
    scopeParam === 'goal' && goalId
      ? { view: 'goal', goalId }
      : scopeParam === 'project' && projectId
        ? { view: 'project', projectId }
        : null;

  return (
    <main className="flex h-[calc(100vh-0px)] flex-col overflow-hidden bg-background px-4 py-6 md:px-8">
      <KanbanProvider entities={DEFAULT_ENTITIES}>
        <KanbanBoardWithScope initialScope={initialScope} />
      </KanbanProvider>
    </main>
  );
}

function KanbanBoardWithScope({ initialScope }: { initialScope: BoardScope | null }) {
  if (typeof window !== 'undefined' && initialScope) {
    try {
      localStorage.setItem(
        'imergix-kanban-board-v3-scope',
        JSON.stringify({ scope: initialScope, assigneeId: null }),
      );
    } catch {
      // ignore storage errors
    }
  }

  return (
    <KanbanBoard key={initialScope ? JSON.stringify(initialScope) : 'default'} />
  );
}

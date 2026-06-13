'use client';

import { use } from 'react';
import { GoalsProvider, DEFAULT_GOALS, GoalDetailPage } from '@/modules/goals';

export default function GoalDetailRoute({
  params,
}: {
  params: Promise<{ goalId: string }>;
}) {
  const { goalId } = use(params);

  return (
    <main className="flex h-[calc(100vh-0px)] flex-col overflow-hidden bg-background">
      <GoalsProvider initialGoals={DEFAULT_GOALS}>
        <GoalDetailPage goalId={goalId} />
      </GoalsProvider>
    </main>
  );
}

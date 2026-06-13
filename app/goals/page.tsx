'use client';

import { DEFAULT_GOALS, GoalsModule, GoalsProvider } from '@/modules/goals';

export default function GoalsPage() {
  return (
    <main className="flex h-[calc(100vh-0px)] flex-col overflow-hidden bg-background px-4 py-5 md:px-6 lg:px-8">
      <GoalsProvider initialGoals={DEFAULT_GOALS}>
        <GoalsModule />
      </GoalsProvider>
    </main>
  );
}

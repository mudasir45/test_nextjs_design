'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Diamond,
  FolderKanban,
  LayoutGrid,
  Search,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { cn } from '@/modules/kanban/core/cn';
import {
  countTasks,
  countTasksForGoal,
  countTasksForMilestone,
  countTasksForProject,
  getScopeBreadcrumb,
  getScopeLabel,
  isScopeActive,
} from '@/modules/kanban/core/scope-utils';
import type { BoardScope, BoardScopeState, Column, KanbanEntities } from '@/modules/kanban/core/types';

interface BoardScopeNavigatorProps {
  state: BoardScopeState;
  entities: KanbanEntities;
  columns: Column[];
  visibleCount: number;
  onScopeChange: (scope: BoardScope) => void;
  onAssigneeChange: (assigneeId: string | null) => void;
  onClear: () => void;
}

export function BoardScopeNavigator({
  state,
  entities,
  columns,
  visibleCount,
  onScopeChange,
  onAssigneeChange,
  onClear,
}: BoardScopeNavigatorProps) {
  const [open, setOpen] = useState(false);
  const [assigneeOpen, setAssigneeOpen] = useState(false);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const assigneeRef = useRef<HTMLDivElement>(null);

  const totalCount = countTasks(columns);
  const label = getScopeLabel(state, entities);
  const breadcrumb = getScopeBreadcrumb(state, entities);
  const active = isScopeActive(state);

  const q = query.trim().toLowerCase();
  const filteredProjects = useMemo(
    () => entities.projects.filter((p) => !q || p.label.toLowerCase().includes(q)),
    [entities.projects, q],
  );
  const filteredGoals = useMemo(
    () => entities.goals.filter((g) => !q || g.label.toLowerCase().includes(q)),
    [entities.goals, q],
  );

  useEffect(() => {
    if (!open && !assigneeOpen) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) return;
      if (assigneeRef.current?.contains(e.target as Node)) return;
      setOpen(false);
      setAssigneeOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open, assigneeOpen]);

  const assigneeLabel = state.assigneeId
    ? entities.assignees.find((a) => a.id === state.assigneeId)?.label
    : null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {/* Primary scope trigger */}
      <div ref={ref} className="relative min-w-0 flex-1 sm:flex-none">
        <button
          type="button"
          data-kanban-interactive
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="listbox"
          className={cn(
            'flex w-full min-w-[200px] max-w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-left transition-all duration-200 sm:w-auto sm:min-w-[260px]',
            open
              ? 'border-primary/40 bg-primary/5 ring-2 ring-primary/10'
              : active
                ? 'border-primary/30 bg-primary/5 hover:border-primary/40'
                : 'border-border bg-background hover:bg-muted/40',
          )}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
            {state.scope.view === 'project' ? (
              <FolderKanban className="h-4 w-4" />
            ) : state.scope.view === 'goal' ? (
              <Trophy className="h-4 w-4 text-violet-600 dark:text-violet-400" />
            ) : (
              <LayoutGrid className="h-4 w-4" />
            )}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium text-foreground">{label}</span>
            <span className="block truncate text-[11px] text-muted-foreground">
              {active
                ? `Showing ${visibleCount} of ${totalCount} tasks`
                : `${totalCount} tasks on board`}
            </span>
          </span>
          <ChevronDown
            className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
          />
        </button>

        {open && (
          <div
            data-kanban-interactive
            className="absolute left-0 top-[calc(100%+8px)] z-40 w-[min(100vw-2rem,320px)] overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          >
            <div className="border-b border-border/60 px-3 py-2.5">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Board scope
              </p>
              {breadcrumb.length > 1 && (
                <p className="mt-0.5 truncate text-[10px] text-muted-foreground">
                  {breadcrumb.join(' › ')}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search projects & goals…"
                  className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="max-h-[360px] overflow-y-auto p-1.5 scrollbar-thin">
              <ScopeRow
                icon={LayoutGrid}
                label="All tasks"
                count={totalCount}
                selected={state.scope.view === 'all'}
                onClick={() => {
                  onScopeChange({ view: 'all' });
                  setOpen(false);
                  setQuery('');
                }}
              />

              {filteredProjects.length > 0 && (
                <ScopeSection title="Projects">
                  {filteredProjects.map((p) => (
                    <ScopeRow
                      key={p.id}
                      icon={FolderKanban}
                      label={p.label}
                      subtitle={p.subtitle}
                      accent={p.color}
                      count={countTasksForProject(columns, p.id)}
                      selected={
                        state.scope.view === 'project' && state.scope.projectId === p.id
                      }
                      onClick={() => {
                        onScopeChange({ view: 'project', projectId: p.id });
                        setOpen(false);
                        setQuery('');
                      }}
                    />
                  ))}
                </ScopeSection>
              )}

              {filteredGoals.length > 0 && (
                <ScopeSection title="Goals">
                  {filteredGoals.map((g) => {
                    const isGoalSelected =
                      state.scope.view === 'goal' &&
                      state.scope.goalId === g.id &&
                      !state.scope.milestoneId;
                    const isGoalExpanded =
                      state.scope.view === 'goal' && state.scope.goalId === g.id;

                    return (
                      <div key={g.id}>
                        <ScopeRow
                          icon={Trophy}
                          label={g.label}
                          subtitle={g.subtitle}
                          accent={g.color}
                          count={countTasksForGoal(columns, g.id, entities)}
                          selected={isGoalSelected}
                          onClick={() => {
                            onScopeChange({ view: 'goal', goalId: g.id });
                            setQuery('');
                          }}
                        />
                        {isGoalExpanded &&
                          entities.milestones
                            .filter((m) => m.goalId === g.id)
                            .filter((m) => !q || m.label.toLowerCase().includes(q))
                            .map((m) => (
                              <ScopeRow
                                key={m.id}
                                icon={Diamond}
                                label={m.label}
                                subtitle={m.subtitle}
                                indent
                                count={countTasksForMilestone(columns, m.id)}
                                selected={
                                  state.scope.view === 'goal' &&
                                  state.scope.milestoneId === m.id
                                }
                                onClick={() => {
                                  onScopeChange({
                                    view: 'goal',
                                    goalId: g.id,
                                    milestoneId: m.id,
                                  });
                                  setOpen(false);
                                  setQuery('');
                                }}
                              />
                            ))}
                      </div>
                    );
                  })}
                </ScopeSection>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Secondary assignee filter */}
      <div ref={assigneeRef} className="relative">
        <button
          type="button"
          data-kanban-interactive
          onClick={() => setAssigneeOpen((v) => !v)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-2 text-xs font-medium transition-colors duration-200',
            state.assigneeId
              ? 'border-border bg-muted/50 text-foreground'
              : 'border-border/60 bg-background text-muted-foreground hover:bg-muted/40 hover:text-foreground',
          )}
        >
          <User className="h-3.5 w-3.5" />
          <span className="max-w-[100px] truncate">{assigneeLabel ?? 'Assignee'}</span>
          <ChevronDown className={cn('h-3 w-3 opacity-50', assigneeOpen && 'rotate-180')} />
        </button>

        {assigneeOpen && (
          <div className="absolute right-0 top-[calc(100%+6px)] z-40 min-w-[180px] rounded-xl border border-border bg-card p-1 shadow-lg">
            <ScopeRow
              icon={User}
              label="Everyone"
              selected={!state.assigneeId}
              onClick={() => {
                onAssigneeChange(null);
                setAssigneeOpen(false);
              }}
            />
            {entities.assignees.map((a) => (
              <ScopeRow
                key={a.id}
                icon={User}
                label={a.label}
                subtitle={a.subtitle}
                selected={state.assigneeId === a.id}
                onClick={() => {
                  onAssigneeChange(a.id);
                  setAssigneeOpen(false);
                }}
              />
            ))}
          </div>
        )}
      </div>

      {active && (
        <button
          type="button"
          data-kanban-interactive
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}

function ScopeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-2 first:mt-0">
      <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">
        {title}
      </p>
      {children}
    </div>
  );
}

function ScopeRow({
  icon: Icon,
  label,
  subtitle,
  accent,
  count,
  selected,
  indent,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  subtitle?: string;
  accent?: string;
  count?: number;
  selected?: boolean;
  indent?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left transition-colors duration-150 hover:bg-muted',
        selected && 'bg-primary/10 hover:bg-primary/15',
        indent && 'ml-3 w-[calc(100%-0.75rem)]',
      )}
    >
      <span
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/80 text-muted-foreground"
        style={accent ? { color: accent, backgroundColor: `${accent}18` } : undefined}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-medium text-foreground">{label}</span>
        {subtitle && (
          <span className="block truncate text-[10px] text-muted-foreground">{subtitle}</span>
        )}
      </span>
      {count !== undefined && (
        <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">{count}</span>
      )}
      {selected && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
    </button>
  );
}

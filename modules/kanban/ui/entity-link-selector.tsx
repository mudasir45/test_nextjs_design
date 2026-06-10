'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Check,
  ChevronDown,
  Diamond,
  FolderKanban,
  Link2,
  Trophy,
  Unlink,
} from 'lucide-react';
import { cn } from '@/modules/kanban/core/cn';
import { ENTITY_TYPE_LABELS, getTaskEntityLink, resolveEntityDisplay } from '@/modules/kanban/core/entity-utils';
import type { KanbanEntities, Task, TaskEntityLink, TaskEntityType } from '@/modules/kanban/core/types';

const TYPE_ICONS = {
  project: FolderKanban,
  goal: Trophy,
  milestone: Diamond,
} as const;

interface EntityLinkSelectorProps {
  task: Task;
  entities: KanbanEntities;
  onChange: (link: TaskEntityLink | undefined) => void;
  className?: string;
}

export function EntityLinkSelector({
  task,
  entities,
  onChange,
  className,
}: EntityLinkSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = getTaskEntityLink(task);
  const display = resolveEntityDisplay(entities, current);
  const TypeIcon = current ? TYPE_ICONS[current.type] : Link2;

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  const sections: { type: TaskEntityType; items: KanbanEntities['projects'] }[] = [
    { type: 'project', items: entities.projects },
    { type: 'goal', items: entities.goals },
    { type: 'milestone', items: entities.milestones },
  ];

  return (
    <div ref={ref} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'inline-flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all',
          open
            ? 'border-violet-500/50 bg-violet-500/5 ring-2 ring-violet-500/15'
            : 'border-border/70 bg-muted/20 hover:border-border hover:bg-muted/30',
        )}
      >
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
            current ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400' : 'bg-muted text-muted-foreground',
          )}
        >
          <TypeIcon className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          {display ? (
            <>
              <span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Linked {ENTITY_TYPE_LABELS[current!.type]}
              </span>
              <span className="block truncate text-sm font-medium text-foreground">{display.label}</span>
            </>
          ) : (
            <>
              <span className="block text-sm font-medium text-foreground">Link to entity</span>
              <span className="block text-[11px] text-muted-foreground">
                Project, goal, or milestone
              </span>
            </>
          )}
        </span>
        <ChevronDown
          className={cn('h-4 w-4 shrink-0 text-muted-foreground transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-40 w-full min-w-[280px] overflow-hidden rounded-xl border border-border bg-card shadow-xl">
          <div className="flex items-center justify-between border-b border-border/60 px-3 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              Link task to
            </span>
          </div>

          <div className="max-h-[320px] overflow-y-auto p-1.5 scrollbar-thin">
            <EntityMenuItem
              icon={Unlink}
              label="No link"
              subtitle="Standalone task"
              selected={!current}
              onClick={() => {
                onChange(undefined);
                setOpen(false);
              }}
            />

            {sections.map(({ type, items }) => {
              const Icon = TYPE_ICONS[type];
              if (items.length === 0) return null;
              return (
                <div key={type} className="mt-1">
                  <p className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">
                    {ENTITY_TYPE_LABELS[type]}s
                  </p>
                  {items.map((item) => (
                    <EntityMenuItem
                      key={item.id}
                      icon={Icon}
                      label={item.label}
                      subtitle={item.subtitle}
                      accent={item.color}
                      selected={current?.type === type && current.id === item.id}
                      onClick={() => {
                        onChange({ type, id: item.id });
                        setOpen(false);
                      }}
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function EntityMenuItem({
  icon: Icon,
  label,
  subtitle,
  accent,
  selected,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  subtitle?: string;
  accent?: string;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left transition-colors hover:bg-muted',
        selected && 'bg-violet-500/10 hover:bg-violet-500/15',
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
      {selected && <Check className="h-4 w-4 shrink-0 text-violet-600 dark:text-violet-400" />}
    </button>
  );
}

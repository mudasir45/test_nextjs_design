'use client';

import { useRef } from 'react';
import {
  Calendar,
  Diamond,
  FolderKanban,
  MessageCircle,
  Paperclip,
  Trash2,
  Trophy,
} from 'lucide-react';
import { Card, CardContent } from '@/modules/kanban/ui/primitives/card';
import { Badge } from '@/modules/kanban/ui/primitives/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/modules/kanban/ui/primitives/avatar';
import { cn } from '@/modules/kanban/core/cn';
import { stripDescriptionHtml } from '@/modules/kanban/core/description-utils';
import { ENTITY_TYPE_LABELS, getTaskEntityLink, resolveEntityDisplay } from '@/modules/kanban/core/entity-utils';
import { PRIORITY_STYLES } from '@/modules/kanban/demo/default-columns';
import type { KanbanEntities, Task, TaskEntityType } from '@/modules/kanban/core/types';

const ENTITY_ICONS: Record<TaskEntityType, typeof FolderKanban> = {
  project: FolderKanban,
  goal: Trophy,
  milestone: Diamond,
};

function formatDueDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getCommentCount(task: Task) {
  return task.activity?.length ?? task.comments ?? 0;
}

interface KanbanTaskCardProps {
  task: Task;
  columnId: string;
  entities: KanbanEntities;
  onDragStart: (e: React.DragEvent, task: Task, columnId: string) => void;
  onDelete: (taskId: string) => void;
  onOpen: (task: Task, columnId: string) => void;
}

export function KanbanTaskCard({
  task,
  columnId,
  entities,
  onDragStart,
  onDelete,
  onOpen,
}: KanbanTaskCardProps) {
  const didDrag = useRef(false);
  const entityLink = getTaskEntityLink(task);
  const entityDisplay = resolveEntityDisplay(entities, entityLink);
  const EntityIcon = entityLink ? ENTITY_ICONS[entityLink.type] : null;
  const commentCount = getCommentCount(task);

  return (
    <Card
      data-kanban-task
      className="group relative cursor-pointer border border-border/60 bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-border hover:shadow-md active:scale-[0.99]"
      draggable
      onDragStart={(e) => {
        didDrag.current = true;
        onDragStart(e, task, columnId);
      }}
      onDragEnd={() => {
        setTimeout(() => {
          didDrag.current = false;
        }, 0);
      }}
      onClick={() => {
        if (!didDrag.current) onOpen(task, columnId);
      }}
    >
      <button
        type="button"
        data-kanban-interactive
        aria-label={`Delete ${task.title}`}
        onClick={(e) => {
          e.stopPropagation();
          onDelete(task.id);
        }}
        className="absolute right-2 top-2 z-10 rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      <CardContent className="p-3.5">
        <div className="space-y-2.5">
          {entityLink && entityDisplay && EntityIcon && (
            <span className="inline-flex max-w-full items-center gap-1.5 rounded-md bg-violet-500/8 px-2 py-0.5 text-[10px] font-medium text-muted-foreground ring-1 ring-violet-500/10">
              <EntityIcon className="h-3 w-3 shrink-0 text-violet-600 dark:text-violet-400" />
              <span className="text-violet-600/80 dark:text-violet-400/80">
                {ENTITY_TYPE_LABELS[entityLink.type]}
              </span>
              <span className="truncate text-foreground">{entityDisplay.label}</span>
            </span>
          )}

          <h4 className="pr-6 text-sm font-semibold leading-snug text-foreground">{task.title}</h4>

          {task.description && stripDescriptionHtml(task.description) && (
            <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
              {stripDescriptionHtml(task.description)}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-1.5">
            {task.priority && (
              <Badge
                variant="outline"
                className={cn('text-[10px] font-medium capitalize', PRIORITY_STYLES[task.priority])}
              >
                {task.priority}
              </Badge>
            )}
            {task.tags?.slice(0, 2).map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-[10px] font-normal bg-muted/50 text-muted-foreground border-border/60"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {(task.dueDate || commentCount || task.attachments || task.assignee) && (
            <div className="flex items-center justify-between border-t border-border/50 pt-2.5">
              <div className="flex items-center gap-3 text-muted-foreground">
                {task.dueDate && (
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDueDate(task.dueDate)}
                  </span>
                )}
                {commentCount > 0 && (
                  <span className="flex items-center gap-1 text-[11px]">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {commentCount}
                  </span>
                )}
                {!!task.attachments && (
                  <span className="flex items-center gap-1 text-[11px]">
                    <Paperclip className="h-3.5 w-3.5" />
                    {task.attachments}
                  </span>
                )}
              </div>

              {task.assignee && (
                <Avatar className="h-6 w-6 ring-1 ring-border">
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                  <AvatarFallback className="text-[10px]">
                    {task.assignee.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

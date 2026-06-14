'use client';

import { useState } from 'react';
import {
  Briefcase,
  Building,
  CheckSquare,
  Flag,
  MapPin,
  Target,
  User,
} from 'lucide-react';
import type { ExpenseCategory, ExpenseEntityType } from '@/modules/invoices/core/types';
import { EXPENSE_CATEGORY_LABELS } from '@/modules/invoices/core/expense-utils';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesTheme } from '@/modules/invoices/provider/InvoicesProvider';

interface ExpenseFormProps {
  onSubmit: (payload: {
    amount: number;
    category: ExpenseCategory;
    entityType: ExpenseEntityType;
    entityName: string;
    date: string;
    description: string;
    notes: string;
  }) => void;
}

const CATEGORIES: ExpenseCategory[] = ['equipment', 'software', 'travel', 'marketing', 'other'];

const ENTITY_TYPES: { id: ExpenseEntityType; label: string; icon: React.ElementType }[] = [
  { id: 'general', label: 'General', icon: Building },
  { id: 'project', label: 'Project', icon: Briefcase },
  { id: 'goal', label: 'Goal', icon: Target },
  { id: 'milestone', label: 'Milestone', icon: Flag },
  { id: 'task', label: 'Task', icon: CheckSquare },
  { id: 'personal', label: 'Personal', icon: User },
];

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const today = new Date().toISOString().slice(0, 10);
  const theme = useInvoicesTheme();

  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('software');
  const [entityType, setEntityType] = useState<ExpenseEntityType>('general');
  const [entityName, setEntityName] = useState('');
  const [date, setDate] = useState(today);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description.trim() || Number.isNaN(parsedAmount) || parsedAmount <= 0) return;
    onSubmit({
      amount: parsedAmount,
      category,
      entityType,
      entityName: entityName.trim(),
      date,
      description: description.trim(),
      notes: notes.trim(),
    });
    setAmount('');
    setDescription('');
    setEntityName('');
    setNotes('');
    setDate(today);
    setExpanded(false);
  };

  const needsEntityName = entityType !== 'general' && entityType !== 'personal';
  const entityPlaceholder: Record<ExpenseEntityType, string> = {
    project: 'e.g. Website Redesign',
    goal: 'e.g. Grow Revenue 50%',
    milestone: 'e.g. Phase 2 Launch',
    task: 'e.g. Wireframe Review',
    general: '',
    personal: '',
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border/60 bg-card p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Log Expense</h3>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {expanded ? 'Less fields' : 'More fields'}
        </button>
      </div>

      {/* Entity type selector */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {ENTITY_TYPES.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => { setEntityType(id); setEntityName(''); }}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-150',
              entityType === id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'border border-border/60 bg-muted/30 text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3 w-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Main fields row */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_110px_130px_110px]">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What was this expense for?"
          className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          required
        />
        <input
          type="number"
          min={0}
          step={0.01}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm tabular-nums focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
          className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{EXPENSE_CATEGORY_LABELS[cat]}</option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
          required
        />
      </div>

      {/* Entity name + notes (conditional) */}
      {(needsEntityName || expanded) && (
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {needsEntityName && (
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder={entityPlaceholder[entityType]}
              className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
          )}
          {expanded && (
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
            />
          )}
        </div>
      )}

      <div className="mt-3 flex justify-end">
        <button
          type="submit"
          className={cn(
            'cursor-pointer rounded-xl px-5 py-2 text-sm font-semibold transition-colors duration-200',
            theme.buttonPrimary,
          )}
        >
          Add Expense
        </button>
      </div>
    </form>
  );
}

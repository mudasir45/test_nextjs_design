'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Save,
  Send,
  Settings2,
} from 'lucide-react';
import type { Client, Invoice, InvoiceDraft } from '@/modules/invoices/core/types';
import {
  createEmptyDraft,
  draftToPayload,
  generateInvoiceNumber,
  validateInvoiceDraft,
} from '@/modules/invoices/core/invoice-utils';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesModuleConfig } from '@/modules/invoices/core/hooks/use-invoices-module-config';
import {
  useInvoicesRoutes,
  useInvoicesTheme,
} from '@/modules/invoices/provider/InvoicesProvider';
import { useInvoices } from '@/modules/invoices/core/hooks/use-invoices';
import { useClients } from '@/modules/invoices/core/hooks/use-clients';
import { LineItemsEditor } from './line-items-editor';
import { InvoicePreview } from './invoice-preview';
import { ClientSelector } from './client-selector';
import { CompanySettingsPanel } from '../settings/company-settings-panel';

interface InvoiceBuilderProps {
  editInvoice?: Invoice;
  className?: string;
}

type BuilderSection = 'client' | 'services' | 'notes';

export function InvoiceBuilder({ editInvoice: editInvoiceProp, className }: InvoiceBuilderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const theme = useInvoicesTheme();
  const routes = useInvoicesRoutes();

  const { adapter, storageKey, initialInvoices, initialClients, callbacks } =
    useInvoicesModuleConfig();

  const { invoices, createInvoice, updateInvoice, settings, setSettings, hydrated, getInvoiceById } =
    useInvoices({
      storageKey,
      initialInvoices,
      adapter,
    });

  const { clients, createClient } = useClients({
    initialClients,
    adapter,
    hydrated,
  });

  const editInvoice = useMemo(() => {
    if (editInvoiceProp) return editInvoiceProp;
    if (editId) return getInvoiceById(editId);
    return undefined;
  }, [editInvoiceProp, editId, getInvoiceById]);

  const [draft, setDraft] = useState<InvoiceDraft>(() =>
    editInvoice
      ? {
          clientId: editInvoice.clientId ?? '',
          clientName: editInvoice.clientName,
          clientEmail: editInvoice.clientEmail,
          clientAddress: editInvoice.clientAddress ?? '',
          clientPhone: editInvoice.clientPhone ?? '',
          clientCompany: editInvoice.clientCompany ?? '',
          clientChamberOfCommerce: editInvoice.clientChamberOfCommerce ?? '',
          clientVatNumber: editInvoice.clientVatNumber ?? '',
          projectName: editInvoice.projectName ?? '',
          issueDate: editInvoice.issueDate,
          dueDate: editInvoice.dueDate,
          lineItems: editInvoice.lineItems.map((item) => ({ ...item })),
          notes: editInvoice.notes ?? '',
          paymentInstructions: editInvoice.paymentInstructions ?? settings.paymentInstructions ?? '',
          termsAndConditions: editInvoice.termsAndConditions ?? settings.termsAndConditions ?? '',
          currency: editInvoice.currency,
        }
      : createEmptyDraft(settings),
  );

  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreviewMobile, setShowPreviewMobile] = useState(false);
  const [openSections, setOpenSections] = useState<Set<BuilderSection>>(
    new Set(['client', 'services', 'notes']),
  );

  const toggleSection = (s: BuilderSection) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(s) ? next.delete(s) : next.add(s);
      return next;
    });
  };

  const previewNumber = editInvoice?.number ?? generateInvoiceNumber(invoices, settings);

  const handleSave = useCallback(
    async (sendAfterSave = false) => {
      const validationErrors = validateInvoiceDraft(draft);
      if (validationErrors.length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors([]);
      setSaving(true);
      try {
        const payload = draftToPayload(draft);
        if (editInvoice) {
          updateInvoice(editInvoice.id, { ...payload, status: sendAfterSave ? 'sent' : editInvoice.status });
          callbacks.onInvoiceUpdate?.(editInvoice.id, { ...payload, status: sendAfterSave ? 'sent' : editInvoice.status });
          router.push(routes.detail(editInvoice.id));
        } else {
          const invoice = createInvoice(payload, sendAfterSave ? 'sent' : 'draft');
          callbacks.onInvoiceCreate?.(invoice);
          router.push(routes.detail(invoice.id));
        }
      } finally {
        setSaving(false);
      }
    },
    [draft, editInvoice, createInvoice, updateInvoice, callbacks, router, routes],
  );

  if (!hydrated) {
    return (
      <div className={cn('flex flex-1 items-center justify-center', className)}>
        <div className={cn('h-8 w-8 animate-spin rounded-full border-2', theme.spinner)} />
      </div>
    );
  }

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      {/* ── Top Bar ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push(routes.index)}
            className="inline-flex cursor-pointer items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-1.5">
            <FileText className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-semibold text-foreground">
              {editInvoice ? `Edit ${editInvoice.number}` : 'New Invoice'}
            </span>
            <span className="hidden rounded-full bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground sm:inline">
              {previewNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSettings(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50"
            title="Company settings"
          >
            <Settings2 className="h-4 w-4" />
            <span className="hidden sm:inline">Settings</span>
          </button>
          <button
            type="button"
            onClick={() => setShowPreviewMobile((v) => !v)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-sm font-medium transition-colors hover:bg-muted/50 lg:hidden"
          >
            <Eye className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-border/60 px-3 py-2 text-sm font-semibold transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            <span className="hidden sm:inline">Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className={cn(
              'inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-50',
              theme.buttonPrimary,
            )}
          >
            <Send className="h-4 w-4" />
            <span className="hidden sm:inline">Save &amp; Send</span>
            <span className="sm:hidden">Send</span>
          </button>
        </div>
      </div>

      {/* ── Settings Slide-over ──────────────────────────────────────── */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="flex-1 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          />
          <div className="w-full max-w-md overflow-y-auto bg-background shadow-2xl">
            <CompanySettingsPanel
              settings={settings}
              onSave={(s) => { setSettings(s); setShowSettings(false); }}
              onClose={() => setShowSettings(false)}
            />
          </div>
        </div>
      )}

      {/* ── Split layout ─────────────────────────────────────────────── */}
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Form Panel */}
        <div
          className={cn(
            'flex-1 overflow-y-auto border-b border-border/60 lg:border-b-0 lg:border-r',
            showPreviewMobile ? 'hidden lg:block' : 'block',
          )}
        >
          {errors.length > 0 && (
            <div className="m-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
              <ul className="list-inside list-disc text-sm text-red-600 dark:text-red-400">
                {errors.map((err) => <li key={err}>{err}</li>)}
              </ul>
            </div>
          )}

          {/* Section: Client */}
          <BuilderSection
            title="Client"
            open={openSections.has('client')}
            onToggle={() => toggleSection('client')}
          >
            <ClientSelector
              clients={clients}
              draft={draft}
              onChange={setDraft}
              onCreateClient={createClient}
            />
            {/* Project + Dates in same section */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <LabeledInput
                label="Project (optional)"
                value={draft.projectName}
                onChange={(v) => setDraft({ ...draft, projectName: v })}
                placeholder="Website Redesign"
              />
              <LabeledInput
                label="Issue Date *"
                type="date"
                value={draft.issueDate}
                onChange={(v) => setDraft({ ...draft, issueDate: v })}
              />
              <LabeledInput
                label="Due Date *"
                type="date"
                value={draft.dueDate}
                onChange={(v) => setDraft({ ...draft, dueDate: v })}
              />
            </div>
          </BuilderSection>

          {/* Section: Services / Line Items */}
          <BuilderSection
            title="Services"
            open={openSections.has('services')}
            onToggle={() => toggleSection('services')}
          >
            <LineItemsEditor draft={draft} onChange={setDraft} defaultTaxRate={settings.defaultTaxRate} />
          </BuilderSection>

          {/* Section: Notes & Terms */}
          <BuilderSection
            title="Notes & Terms"
            open={openSections.has('notes')}
            onToggle={() => toggleSection('notes')}
          >
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Notes</label>
                <textarea
                  value={draft.notes}
                  onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  placeholder="Any notes for the client…"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Payment Instructions
                  <span className="ml-1 text-muted-foreground/60">(overrides company default)</span>
                </label>
                <textarea
                  value={draft.paymentInstructions}
                  onChange={(e) => setDraft({ ...draft, paymentInstructions: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  placeholder="Leave empty to use company default…"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Terms &amp; Conditions
                  <span className="ml-1 text-muted-foreground/60">(overrides company default)</span>
                </label>
                <textarea
                  value={draft.termsAndConditions}
                  onChange={(e) => setDraft({ ...draft, termsAndConditions: e.target.value })}
                  rows={3}
                  className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                  placeholder="Leave empty to use company default…"
                />
              </div>
            </div>
          </BuilderSection>
        </div>

        {/* Preview Panel */}
        <div
          className={cn(
            'flex-1 overflow-y-auto bg-muted/20',
            showPreviewMobile ? 'block' : 'hidden lg:block',
          )}
        >
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Live Preview
            </span>
            <button
              type="button"
              onClick={() => setShowPreviewMobile(false)}
              className="cursor-pointer text-xs text-muted-foreground hover:text-foreground lg:hidden"
            >
              Back to form
            </button>
          </div>
          <div className="p-4 md:p-6">
            <InvoicePreview
              draft={{
                ...draft,
                paymentInstructions: draft.paymentInstructions || settings.paymentInstructions,
                termsAndConditions: draft.termsAndConditions || settings.termsAndConditions,
              }}
              invoiceNumber={previewNumber}
              status={editInvoice?.status ?? 'draft'}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Helper sub-components ──────────────────────────────────────────────── */
function BuilderSection({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border/60 last:border-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full cursor-pointer items-center justify-between px-4 py-4 text-left md:px-6"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="px-4 pb-5 md:px-6">{children}</div>}
    </div>
  );
}

function LabeledInput({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
      />
    </div>
  );
}

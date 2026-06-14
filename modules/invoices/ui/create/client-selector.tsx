'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Plus, Search, User } from 'lucide-react';
import type { Client, InvoiceDraft } from '@/modules/invoices/core/types';
import { cn } from '@/modules/invoices/core/cn';

interface ClientSelectorProps {
  clients: Client[];
  draft: InvoiceDraft;
  onChange: (draft: InvoiceDraft) => void;
  onCreateClient?: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => Client;
}

function applyClientToDraft(client: Client, draft: InvoiceDraft): InvoiceDraft {
  return {
    ...draft,
    clientId: client.id,
    clientName: client.name,
    clientEmail: client.email,
    clientPhone: client.phone ?? '',
    clientAddress: client.address ?? '',
    clientCompany: client.company ?? '',
    clientChamberOfCommerce: client.chamberOfCommerce ?? '',
    clientVatNumber: client.vatNumber ?? '',
  };
}

export function ClientSelector({
  clients,
  draft,
  onChange,
  onCreateClient,
}: ClientSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<'search' | 'manual'>('search');
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const filtered = clients.filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  const selectedClient = draft.clientId
    ? clients.find((c) => c.id === draft.clientId)
    : null;

  const handleSelect = (client: Client) => {
    onChange(applyClientToDraft(client, draft));
    setOpen(false);
    setQuery('');
  };

  const handleClear = () => {
    onChange({
      ...draft,
      clientId: '',
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      clientAddress: '',
      clientCompany: '',
      clientChamberOfCommerce: '',
      clientVatNumber: '',
    });
  };

  return (
    <div className="space-y-4">
      {/* Mode toggle */}
      <div className="flex items-center gap-2">
        <div className="flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
          <button
            type="button"
            onClick={() => setMode('search')}
            className={cn(
              'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
              mode === 'search' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Select Client
          </button>
          <button
            type="button"
            onClick={() => setMode('manual')}
            className={cn(
              'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-all duration-150',
              mode === 'manual' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            Custom Details
          </button>
        </div>
      </div>

      {mode === 'search' ? (
        <div ref={ref} className="relative">
          {/* Trigger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            className={cn(
              'flex w-full cursor-pointer items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors',
              open
                ? 'border-indigo-500/40 bg-indigo-500/5 ring-2 ring-indigo-500/10'
                : 'border-border/60 bg-background hover:border-indigo-500/30',
            )}
          >
            {selectedClient ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500/10 text-xs font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedClient.name.slice(0, 1).toUpperCase()}
                </div>
                <div className="text-left">
                  <p className="font-medium text-foreground">{selectedClient.name}</p>
                  {selectedClient.company && (
                    <p className="text-xs text-muted-foreground">{selectedClient.company}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Select a client…</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              {selectedClient && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleClear(); }}
                  className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
              <ChevronDown
                className={cn('h-4 w-4 text-muted-foreground transition-transform duration-150', open && 'rotate-180')}
              />
            </div>
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-border/60 bg-card shadow-lg">
              <div className="border-b border-border/60 p-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search clients…"
                    className="w-full rounded-lg bg-muted/30 py-2 pl-9 pr-3 text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="max-h-60 overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No clients found
                  </p>
                ) : (
                  filtered.map((client) => (
                    <button
                      key={client.id}
                      type="button"
                      onClick={() => handleSelect(client)}
                      className="flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-muted/40"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                        {client.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">{client.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {client.company ? `${client.company} · ` : ''}{client.email}
                        </p>
                      </div>
                      {draft.clientId === client.id && (
                        <Check className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                      )}
                    </button>
                  ))
                )}
              </div>

              {onCreateClient && (
                <div className="border-t border-border/60 p-2">
                  <button
                    type="button"
                    onClick={() => { setOpen(false); setMode('manual'); }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-500/5 dark:text-indigo-400"
                  >
                    <Plus className="h-4 w-4" />
                    Enter client details manually
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Manual mode — editable fields pre-filled from selected client */
        <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Client Name *" value={draft.clientName}
              onChange={(v) => onChange({ ...draft, clientName: v, clientId: '' })} placeholder="Full name" />
            <Field label="Email *" value={draft.clientEmail}
              onChange={(v) => onChange({ ...draft, clientEmail: v })} placeholder="email@company.com" type="email" />
            <Field label="Company" value={draft.clientCompany}
              onChange={(v) => onChange({ ...draft, clientCompany: v })} placeholder="Company B.V." />
            <Field label="Phone" value={draft.clientPhone}
              onChange={(v) => onChange({ ...draft, clientPhone: v })} placeholder="+1 555 000 0000" />
            <div className="sm:col-span-2">
              <Field label="Address" value={draft.clientAddress}
                onChange={(v) => onChange({ ...draft, clientAddress: v })} placeholder="Street, City, Country" />
            </div>
            <Field label="Chamber of Commerce" value={draft.clientChamberOfCommerce}
              onChange={(v) => onChange({ ...draft, clientChamberOfCommerce: v })} placeholder="84835850" />
            <Field label="VAT / Tax Number" value={draft.clientVatNumber}
              onChange={(v) => onChange({ ...draft, clientVatNumber: v })} placeholder="NL123456789B01" />
          </div>
        </div>
      )}
    </div>
  );
}

function Field({
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

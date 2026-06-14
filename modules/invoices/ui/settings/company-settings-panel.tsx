'use client';

import { useRef, useState } from 'react';
import { Building2, CreditCard, FileText, Globe, Image, Phone, Save } from 'lucide-react';
import type { WorkspaceSettings } from '@/modules/invoices/core/types';
import { cn } from '@/modules/invoices/core/cn';
import { useInvoicesTheme } from '@/modules/invoices/provider/InvoicesProvider';

interface CompanySettingsPanelProps {
  settings: WorkspaceSettings;
  onSave: (settings: WorkspaceSettings) => void;
  onClose: () => void;
}

type SettingsTab = 'company' | 'payment' | 'invoice';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'CHF', 'JPY', 'AED', 'PKR'];

export function CompanySettingsPanel({ settings, onSave, onClose }: CompanySettingsPanelProps) {
  const theme = useInvoicesTheme();
  const [draft, setDraft] = useState<WorkspaceSettings>({ ...settings });
  const [tab, setTab] = useState<SettingsTab>('company');
  const [saved, setSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;
      setDraft((d) => ({ ...d, logoUrl: url }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'payment', label: 'Payment', icon: CreditCard },
    { id: 'invoice', label: 'Invoice', icon: FileText },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">Company Settings</h2>
        <button type="button" onClick={onClose} className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
          Close
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border/60 px-5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-medium transition-colors',
              tab === id
                ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                : 'border-transparent text-muted-foreground hover:text-foreground',
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === 'company' && (
          <div className="space-y-5">
            {/* Logo */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">Logo</label>
              <div className="flex items-start gap-4">
                <div
                  className="flex h-20 w-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border/60 bg-muted/20 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5"
                  onClick={() => logoInputRef.current?.click()}
                >
                  {draft.logoUrl ? (
                    <img src={draft.logoUrl} alt="Logo" className="h-full w-full rounded-xl object-contain p-2" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <Image className="h-5 w-5" />
                      <span className="text-xs">Upload</span>
                    </div>
                  )}
                </div>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border/60 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/40"
                  >
                    <Image className="h-3.5 w-3.5" />
                    {draft.logoUrl ? 'Change logo' : 'Upload logo'}
                  </button>
                  {draft.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setDraft((d) => ({ ...d, logoUrl: '' }))}
                      className="block cursor-pointer text-xs text-red-600 hover:underline dark:text-red-400"
                    >
                      Remove
                    </button>
                  )}
                  <p className="text-xs text-muted-foreground">PNG, JPG, SVG · Max 2MB</p>
                </div>
                <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </div>
            </div>

            <FormGrid>
              <Field label="Company Name" value={draft.companyName} onChange={(v) => setDraft((d) => ({ ...d, companyName: v }))} placeholder="iMergix Studio" />
              <Field label="Email" value={draft.companyEmail} onChange={(v) => setDraft((d) => ({ ...d, companyEmail: v }))} placeholder="hello@company.com" type="email" />
              <Field label="Phone" value={draft.companyPhone} onChange={(v) => setDraft((d) => ({ ...d, companyPhone: v }))} placeholder="+1 555 000 0000" />
              <Field label="VAT / Tax Number" value={draft.vatNumber ?? ''} onChange={(v) => setDraft((d) => ({ ...d, vatNumber: v }))} placeholder="NL123456789B01" />
              <div className="sm:col-span-2">
                <Field label="Address" value={draft.companyAddress} onChange={(v) => setDraft((d) => ({ ...d, companyAddress: v }))} placeholder="123 Main St, City, Country" />
              </div>
            </FormGrid>
          </div>
        )}

        {tab === 'payment' && (
          <div className="space-y-4">
            <FormGrid>
              <Field label="Account Title" value={draft.bankAccountTitle ?? ''} onChange={(v) => setDraft((d) => ({ ...d, bankAccountTitle: v }))} placeholder="Your Name / Company" />
              <Field label="Bank Name" value={draft.bankName ?? ''} onChange={(v) => setDraft((d) => ({ ...d, bankName: v }))} placeholder="HBL / Chase / ING" />
              <Field label="Account Number" value={draft.bankAccountNumber ?? ''} onChange={(v) => setDraft((d) => ({ ...d, bankAccountNumber: v }))} placeholder="0470…0499" />
              <Field label="IBAN" value={draft.iban ?? ''} onChange={(v) => setDraft((d) => ({ ...d, iban: v }))} placeholder="PK61HABB0004707902200499" />
            </FormGrid>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Payment Instructions</label>
              <textarea
                value={draft.paymentInstructions}
                onChange={(e) => setDraft((d) => ({ ...d, paymentInstructions: e.target.value }))}
                rows={4}
                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                placeholder="Payment method, reference instructions…"
              />
            </div>
          </div>
        )}

        {tab === 'invoice' && (
          <div className="space-y-4">
            <FormGrid>
              <Field label="Invoice Prefix" value={draft.invoicePrefix} onChange={(v) => setDraft((d) => ({ ...d, invoicePrefix: v }))} placeholder="INV" />
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Currency</label>
                <select
                  value={draft.currency}
                  onChange={(e) => setDraft((d) => ({ ...d, currency: e.target.value }))}
                  className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                >
                  {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">Default Tax Rate (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={0.1}
                  value={draft.defaultTaxRate}
                  onChange={(e) => setDraft((d) => ({ ...d, defaultTaxRate: Number(e.target.value) }))}
                  className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                />
              </div>
            </FormGrid>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Terms & Conditions</label>
              <textarea
                value={draft.termsAndConditions}
                onChange={(e) => setDraft((d) => ({ ...d, termsAndConditions: e.target.value }))}
                rows={5}
                className="w-full rounded-lg border border-border/60 bg-background px-3 py-2 text-sm focus:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                placeholder="Payment terms, late fees, dispute resolution…"
              />
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border/60 p-4">
        <button
          type="button"
          onClick={handleSave}
          className={cn(
            'inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors',
            saved ? 'bg-emerald-500 text-white' : theme.buttonPrimary,
          )}
        >
          <Save className="h-4 w-4" />
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}

function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>;
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

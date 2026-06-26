'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  ChevronDown,
  Copy,
  Edit3,
  ExternalLink,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import type {
  EnvironmentCredential,
  EnvironmentStatus,
  EnvironmentType,
  EnvironmentUrl,
  ProjectEnvironment,
} from '@/modules/projects/core/types';
import { cn } from '@/modules/projects/core/cn';
import {
  ENVIRONMENT_STATUS_META,
  ENVIRONMENT_TYPE_META,
  getEnvironmentStatusMeta,
  getEnvironmentTypeMeta,
} from '@/modules/projects/core/workspace-utils';
import { Badge } from '@/modules/projects/ui/primitives/badge';
import { CredentialRow } from '@/modules/projects/ui/operations/environments/credential-row';
import type { ProjectWorkspaceActions } from '@/modules/projects/core/hooks/use-project-workspace';

interface EnvironmentCardProps {
  environment: ProjectEnvironment;
  defaultExpanded?: boolean;
  actions: Pick<
    ProjectWorkspaceActions,
    | 'addCredential'
    | 'deleteCredential'
    | 'deleteEnvironment'
    | 'updateCredential'
    | 'updateEnvironment'
  >;
}

type DetailsForm = {
  name: string;
  type: EnvironmentType;
  status: EnvironmentStatus;
  note: string;
};

type CredentialForm = {
  label: string;
  value: string;
  role: string;
  username: string;
  note: string;
};

const ENV_TYPES = Object.keys(ENVIRONMENT_TYPE_META) as EnvironmentType[];
const ENV_STATUSES = Object.keys(ENVIRONMENT_STATUS_META) as EnvironmentStatus[];

export function EnvironmentCard({
  environment,
  defaultExpanded = false,
  actions,
}: EnvironmentCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [credSearch, setCredSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [editingDetails, setEditingDetails] = useState(false);
  const [detailsForm, setDetailsForm] = useState<DetailsForm>(() => ({
    name: environment.name,
    type: environment.type,
    status: environment.status,
    note: environment.note ?? '',
  }));
  const [editingUrlIndex, setEditingUrlIndex] = useState<number | null>(null);
  const [urlForm, setUrlForm] = useState<EnvironmentUrl | null>(null);
  const [editingCredentialId, setEditingCredentialId] = useState<string | null>(null);
  const [credentialForm, setCredentialForm] = useState<CredentialForm | null>(null);

  const typeMeta = getEnvironmentTypeMeta(environment.type);
  const statusMeta = getEnvironmentStatusMeta(environment.status);

  const filteredCredentials = useMemo(() => {
    if (!credSearch.trim()) return environment.credentials;
    const q = credSearch.toLowerCase();
    return environment.credentials.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.role?.toLowerCase().includes(q) ||
        c.username?.toLowerCase().includes(q),
    );
  }, [environment.credentials, credSearch]);

  const groupedCredentials = useMemo(() => {
    const groups: Record<string, typeof filteredCredentials> = {};
    for (const cred of filteredCredentials) {
      const key = cred.role ?? 'general';
      if (!groups[key]) groups[key] = [];
      groups[key].push(cred);
    }
    return groups;
  }, [filteredCredentials]);

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      /* ignore */
    }
  };

  const resetDetailsForm = () => {
    setDetailsForm({
      name: environment.name,
      type: environment.type,
      status: environment.status,
      note: environment.note ?? '',
    });
  };

  const startEditingDetails = () => {
    resetDetailsForm();
    setEditingDetails(true);
    setMenuOpen(false);
    setExpanded(true);
  };

  const saveDetails = () => {
    if (!detailsForm.name.trim()) return;
    actions.updateEnvironment(environment.id, {
      name: detailsForm.name.trim(),
      type: detailsForm.type,
      status: detailsForm.status,
      note: detailsForm.note.trim() || undefined,
    });
    setEditingDetails(false);
  };

  const cancelDetails = () => {
    resetDetailsForm();
    setEditingDetails(false);
  };

  const startAddingUrl = () => {
    setEditingUrlIndex(null);
    setUrlForm({ label: '', url: '' });
  };

  const startEditingUrl = (index: number) => {
    setEditingUrlIndex(index);
    setUrlForm(environment.urls[index]);
  };

  const cancelUrlForm = () => {
    setEditingUrlIndex(null);
    setUrlForm(null);
  };

  const saveUrl = () => {
    if (!urlForm?.label.trim() || !urlForm.url.trim()) return;
    const nextUrl = { label: urlForm.label.trim(), url: urlForm.url.trim() };
    const nextUrls =
      editingUrlIndex == null
        ? [...environment.urls, nextUrl]
        : environment.urls.map((u, index) => (index === editingUrlIndex ? nextUrl : u));

    actions.updateEnvironment(environment.id, { urls: nextUrls });
    cancelUrlForm();
  };

  const deleteUrl = (index: number) => {
    actions.updateEnvironment(environment.id, {
      urls: environment.urls.filter((_, urlIndex) => urlIndex !== index),
    });
    if (editingUrlIndex === index) cancelUrlForm();
  };

  const emptyCredentialForm = (): CredentialForm => ({
    label: '',
    value: '',
    role: '',
    username: '',
    note: '',
  });

  const startAddingCredential = () => {
    setEditingCredentialId(null);
    setCredentialForm(emptyCredentialForm());
  };

  const startEditingCredential = (credential: EnvironmentCredential) => {
    setEditingCredentialId(credential.id);
    setCredentialForm({
      label: credential.label,
      value: credential.value,
      role: credential.role ?? '',
      username: credential.username ?? '',
      note: credential.note ?? '',
    });
  };

  const cancelCredentialForm = () => {
    setEditingCredentialId(null);
    setCredentialForm(null);
  };

  const saveCredential = () => {
    if (!credentialForm?.label.trim() || !credentialForm.value.trim()) return;
    const payload = {
      label: credentialForm.label.trim(),
      value: credentialForm.value.trim(),
      role: credentialForm.role.trim() || undefined,
      username: credentialForm.username.trim() || undefined,
      note: credentialForm.note.trim() || undefined,
    };

    if (editingCredentialId) {
      actions.updateCredential(environment.id, editingCredentialId, payload);
    } else {
      actions.addCredential(environment.id, payload);
    }
    cancelCredentialForm();
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-card transition-shadow hover:shadow-sm">
      <div className="flex w-full items-center gap-1 pr-3">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex min-w-0 flex-1 cursor-pointer items-center gap-4 px-5 py-4 text-left"
          aria-expanded={expanded}
        >
          <div className={cn('h-2.5 w-2.5 shrink-0 rounded-full', typeMeta.dotClass)} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{environment.name}</span>
              <Badge className={cn('border-0 text-[10px]', typeMeta.className)}>{typeMeta.label}</Badge>
              <Badge className={cn('border-0 text-[10px]', statusMeta.className)}>
                {statusMeta.label}
              </Badge>
            </div>
            {environment.note && !expanded && (
              <p className="mt-1 truncate text-xs text-muted-foreground">{environment.note}</p>
            )}
            <div className="mt-1 flex gap-3 text-[11px] text-muted-foreground">
              <span>{environment.urls.length} URLs</span>
              <span>{environment.credentials.length} credentials</span>
            </div>
          </div>
        </button>
        <button
          type="button"
          onClick={startEditingDetails}
          className="shrink-0 cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={`Edit ${environment.name}`}
          title="Edit environment"
        >
          <Edit3 className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="shrink-0 cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={expanded ? 'Collapse environment' : 'Expand environment'}
          aria-expanded={expanded}
        >
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
          />
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border/50 px-5 pb-5 pt-4">
          {editingDetails ? (
            <div className="mb-5 space-y-3 rounded-2xl border border-border/60 bg-muted/20 p-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={detailsForm.name}
                  onChange={(e) => setDetailsForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
                  placeholder="Environment name"
                />
                <select
                  value={detailsForm.type}
                  onChange={(e) =>
                    setDetailsForm((prev) => ({
                      ...prev,
                      type: e.target.value as EnvironmentType,
                    }))
                  }
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
                >
                  {ENV_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {ENVIRONMENT_TYPE_META[type].label}
                    </option>
                  ))}
                </select>
              </div>
              <select
                value={detailsForm.status}
                onChange={(e) =>
                  setDetailsForm((prev) => ({
                    ...prev,
                    status: e.target.value as EnvironmentStatus,
                  }))
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none"
              >
                {ENV_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {ENVIRONMENT_STATUS_META[status].label}
                  </option>
                ))}
              </select>
              <textarea
                value={detailsForm.note}
                onChange={(e) => setDetailsForm((prev) => ({ ...prev, note: e.target.value }))}
                rows={3}
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
                placeholder="Optional context for this environment..."
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={cancelDetails}
                  className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveDetails}
                  disabled={!detailsForm.name.trim()}
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
                >
                  <Check className="h-3.5 w-3.5" />
                  Save details
                </button>
              </div>
            </div>
          ) : (
            environment.note && (
              <p className="mb-4 text-sm text-muted-foreground">{environment.note}</p>
            )
          )}

          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                URLs
              </h4>
              <button
                type="button"
                onClick={startAddingUrl}
                className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
              >
                <Plus className="h-3.5 w-3.5" />
                Add URL
              </button>
            </div>
            <div className="space-y-2">
              {environment.urls.length === 0 && !urlForm && (
                <div className="rounded-lg border border-dashed border-border/60 px-3 py-4 text-xs text-muted-foreground">
                  No URLs yet. Add site, CMS, API, preview, or dashboard URLs for this environment.
                </div>
              )}
              {environment.urls.map((u, index) =>
                editingUrlIndex === index && urlForm ? (
                  <UrlForm
                    key={`edit-url-${index}`}
                    value={urlForm}
                    onChange={setUrlForm}
                    onCancel={cancelUrlForm}
                    onSave={saveUrl}
                  />
                ) : (
                  <div
                    key={`${u.label}-${u.url}-${index}`}
                    className="flex flex-wrap items-center gap-2 rounded-lg bg-muted/30 px-3 py-2"
                  >
                    <span className="shrink-0 rounded-md bg-background px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {u.label}
                    </span>
                    <a
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-48 flex-1 truncate text-xs text-violet-600 hover:underline dark:text-violet-400"
                    >
                      {u.url}
                    </a>
                    <button
                      type="button"
                      onClick={() => copyUrl(u.url)}
                      className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Copy URL"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <a
                      href={u.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => startEditingUrl(index)}
                      className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={`Edit ${u.label} URL`}
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteUrl(index)}
                      className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-400"
                      aria-label={`Delete ${u.label} URL`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ),
              )}
              {urlForm && editingUrlIndex == null && (
                <UrlForm
                  value={urlForm}
                  onChange={setUrlForm}
                  onCancel={cancelUrlForm}
                  onSave={saveUrl}
                />
              )}
            </div>
          </div>

          <div>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Credentials
                </h4>
                <button
                  type="button"
                  onClick={startAddingCredential}
                  className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-violet-600 hover:underline dark:text-violet-400"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add credential
                </button>
              </div>
              {environment.credentials.length > 0 && (
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    value={credSearch}
                    onChange={(e) => setCredSearch(e.target.value)}
                    placeholder="Filter credentials..."
                    className="w-44 rounded-lg border border-border bg-background py-1.5 pl-8 pr-3 text-xs outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              )}
            </div>
            <div className="space-y-4">
              {credentialForm && (
                <CredentialFormCard
                  value={credentialForm}
                  mode={editingCredentialId ? 'edit' : 'add'}
                  onChange={setCredentialForm}
                  onCancel={cancelCredentialForm}
                  onSave={saveCredential}
                />
              )}
              {environment.credentials.length === 0 && !credentialForm && (
                <div className="rounded-lg border border-dashed border-border/60 px-3 py-4 text-xs text-muted-foreground">
                  No credentials yet. Add logins, API keys, tokens, or service accounts for this environment.
                </div>
              )}
              {environment.credentials.length > 0 && Object.keys(groupedCredentials).length === 0 && (
                <div className="rounded-lg border border-dashed border-border/60 px-3 py-4 text-xs text-muted-foreground">
                  No credentials match this filter.
                </div>
              )}
              {Object.keys(groupedCredentials).length > 0 &&
                Object.entries(groupedCredentials).map(([role, creds]) => (
                  <div key={role}>
                    {Object.keys(groupedCredentials).length > 1 && (
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                        {role}
                      </p>
                    )}
                    <div className="space-y-2">
                      {creds.map((cred) =>
                        editingCredentialId === cred.id ? null : (
                          <CredentialRow
                            key={cred.id}
                            label={cred.label}
                            value={cred.value}
                            username={cred.username}
                            role={cred.role}
                            note={cred.note}
                            onEdit={() => startEditingCredential(cred)}
                            onDelete={() => actions.deleteCredential(environment.id, cred.id)}
                          />
                        ),
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="relative mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} aria-hidden />
                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-border bg-card py-1 shadow-lg">
                  <button
                    type="button"
                    onClick={() => {
                      startEditingDetails();
                      setMenuOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    Edit details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete the "${environment.name}" environment? Its URLs and credentials will be removed.`,
                        )
                      ) {
                        actions.deleteEnvironment(environment.id);
                      }
                      setMenuOpen(false);
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 dark:text-red-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete environment
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function UrlForm({
  value,
  onChange,
  onCancel,
  onSave,
}: {
  value: EnvironmentUrl;
  onChange: (value: EnvironmentUrl) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-muted/20 p-3">
      <input
        value={value.label}
        onChange={(e) => onChange({ ...value, label: e.target.value })}
        className="w-32 shrink-0 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
        placeholder="Label"
      />
      <input
        value={value.url}
        onChange={(e) => onChange({ ...value, url: e.target.value })}
        className="min-w-56 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
        placeholder="https://..."
      />
      <button
        type="button"
        onClick={onSave}
        disabled={!value.label.trim() || !value.url.trim()}
        className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
      >
        <Check className="h-3.5 w-3.5" />
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="cursor-pointer rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Cancel URL edit"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

function CredentialFormCard({
  value,
  mode,
  onChange,
  onCancel,
  onSave,
}: {
  value: CredentialForm;
  mode: 'add' | 'edit';
  onChange: (value: CredentialForm) => void;
  onCancel: () => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-3 rounded-xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {mode === 'add' ? 'Add credential' : 'Edit credential'}
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Cancel credential edit"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <input
          value={value.label}
          onChange={(e) => onChange({ ...value, label: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
          placeholder="Label"
        />
        <input
          value={value.role}
          onChange={(e) => onChange({ ...value, role: e.target.value })}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
          placeholder="Role (admin, dev, qa)"
        />
      </div>
      <input
        value={value.username}
        onChange={(e) => onChange({ ...value, username: e.target.value })}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
        placeholder="Username (optional)"
      />
      <input
        value={value.value}
        onChange={(e) => onChange({ ...value, value: e.target.value })}
        type="password"
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
        placeholder="Password / API key / token"
      />
      <textarea
        value={value.note}
        onChange={(e) => onChange({ ...value, note: e.target.value })}
        rows={2}
        className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-violet-500/20"
        placeholder="Notes (optional)"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-muted-foreground hover:bg-muted"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={!value.label.trim() || !value.value.trim()}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <Check className="h-3.5 w-3.5" />
          {mode === 'add' ? 'Add credential' : 'Save credential'}
        </button>
      </div>
    </div>
  );
}

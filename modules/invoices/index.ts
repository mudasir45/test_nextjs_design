/**
 * @imergix/invoices — portable Invoices management module for Next.js apps
 *
 * @see INTEGRATION.md for production setup, API wiring, and entity linking.
 * @see README.md for folder structure.
 */

// ── Pages ──────────────────────────────────────────────────────────────────
export { InvoicesModule, default } from './InvoicesModule';
export { InvoiceDetailPage } from './InvoiceDetailPage';
export { NewInvoicePage } from './NewInvoicePage';

// ── Provider ───────────────────────────────────────────────────────────────
export {
  InvoicesProvider,
  useInvoicesContext,
  useInvoicesContextOptional,
  useInvoicesTheme,
  useInvoicesRoutes,
  useLinkableEntities,
} from './provider/InvoicesProvider';
export type { InvoicesProviderProps, InvoicesCallbacks } from './provider/InvoicesProvider';

// ── Hooks ──────────────────────────────────────────────────────────────────
export { useInvoices } from './core/hooks/use-invoices';
export { useExpenses } from './core/hooks/use-expenses';
export { useClients } from './core/hooks/use-clients';
export { useInvoicesModuleConfig } from './core/hooks/use-invoices-module-config';
export type {
  InvoicesModuleConfig,
  InvoicesModuleConfigOverrides,
} from './core/hooks/use-invoices-module-config';

// ── Adapters ───────────────────────────────────────────────────────────────
export {
  createLocalStorageAdapter,
  createDefaultLocalStorageAdapter,
  DEFAULT_STORAGE_KEY,
  generateId,
} from './core/adapters';
export type { InvoicesStorageAdapter, InvoicesStorageAdapterOptions } from './core/adapters/types';

// ── Routes ─────────────────────────────────────────────────────────────────
export { DEFAULT_INVOICES_ROUTES } from './core/routes';
export type { InvoicesRoutes } from './core/routes';

// ── Entity linking ─────────────────────────────────────────────────────────
export {
  flattenLinkableEntities,
  groupLinkableEntities,
  resolveEntityName,
} from './core/entity-utils';
export type { LinkableEntity, LinkableEntityGroups } from './core/entity-utils';

// ── Invoice utils ──────────────────────────────────────────────────────────
export {
  calculateLineSubtotal,
  calculateLineTax,
  calculateLineTotal,
  calculateInvoiceTotals,
  generateInvoiceNumber,
  createEmptyLineItem,
  createEmptyDraft,
  draftToPayload,
  invoiceToDraft,
  normalizeInvoice,
  resolveInvoiceStatus,
  canTransitionStatus,
  formatCurrency,
  formatDate,
  formatDateTime,
  validateInvoiceDraft,
  getInvoiceShareUrl,
  copyInvoiceShareLink,
} from './core/invoice-utils';

// ── Expense & finance utils ────────────────────────────────────────────────
export {
  EXPENSE_CATEGORY_LABELS,
  groupExpensesByMonth,
  formatMonthLabel,
  sumExpenses,
  formatExpenseAmount,
} from './core/expense-utils';

export {
  computeFinanceSummary,
  computeMonthlyRevenue,
  countInvoicesByStatus,
} from './core/finance-utils';

// ── PDF ────────────────────────────────────────────────────────────────────
export { downloadInvoicePdf } from './core/pdf-utils';

// ── Theme ──────────────────────────────────────────────────────────────────
export {
  defaultInvoicesTheme,
  mergeInvoicesTheme,
  INVOICE_STATUS_STYLES,
  EXPENSE_CATEGORY_STYLES,
  FINANCE_CARD_STYLES,
} from './theme/invoices-theme';
export type { InvoicesTheme } from './theme/invoices-theme';

// ── Types ──────────────────────────────────────────────────────────────────
export type {
  Invoice,
  InvoiceStatus,
  Expense,
  ExpenseCategory,
  ExpenseEntityType,
  Client,
  ClientStatus,
  LineItem,
  InvoicesFilterState,
  CreateInvoicePayload,
  UpdateInvoicePayload,
  CreateExpensePayload,
  InvoiceDraft,
  FinanceSummary,
  MonthlyRevenue,
  InvoicesModuleProps,
  WorkspaceSettings,
  InvoiceSortField,
  SortDirection,
  InvoicesViewTab,
} from './core/types';

export { DEFAULT_FILTERS, DEFAULT_WORKSPACE_SETTINGS } from './core/types';

// ── Demo (dev/sandbox only — do not use in production) ─────────────────────
export { DEFAULT_INVOICES, DEFAULT_EXPENSES } from './demo/default-invoices';
export { DEFAULT_CLIENTS } from './demo/default-clients';

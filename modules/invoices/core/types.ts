export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';
export type ExpenseCategory =
  | 'equipment'
  | 'software'
  | 'travel'
  | 'marketing'
  | 'other';
export type ExpenseEntityType =
  | 'project'
  | 'goal'
  | 'milestone'
  | 'task'
  | 'personal'
  | 'general';
export type ClientStatus = 'active' | 'inactive' | 'lead';

export type InvoiceSortField = 'number' | 'clientName' | 'total' | 'dueDate' | 'status';
export type SortDirection = 'asc' | 'desc';
export type InvoicesViewTab = 'invoices' | 'expenses';

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  date?: string;
}

export interface Client {
  id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  address?: string;
  chamberOfCommerce?: string;
  vatNumber?: string;
  notes?: string;
  status: ClientStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientChamberOfCommerce?: string;
  clientVatNumber?: string;
  projectName?: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  notes?: string;
  paymentInstructions?: string;
  termsAndConditions?: string;
  currency: string;
  subtotal: number;
  taxTotal: number;
  total: number;
  createdAt: string;
  updatedAt: string;
  sentAt?: string;
  paidAt?: string;
}

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  entityType?: ExpenseEntityType;
  entityId?: string;
  entityName?: string;
  date: string;
  description: string;
  notes?: string;
  createdAt: string;
}

export interface InvoicesFilterState {
  status: InvoiceStatus | 'all';
  search: string;
  sortField: InvoiceSortField;
  sortDirection: SortDirection;
}

export const DEFAULT_FILTERS: InvoicesFilterState = {
  status: 'all',
  search: '',
  sortField: 'dueDate',
  sortDirection: 'desc',
};

export interface CreateInvoicePayload {
  clientId?: string;
  clientName: string;
  clientEmail: string;
  clientAddress?: string;
  clientPhone?: string;
  clientCompany?: string;
  clientChamberOfCommerce?: string;
  clientVatNumber?: string;
  projectName?: string;
  issueDate: string;
  dueDate: string;
  lineItems: Omit<LineItem, 'id'>[];
  notes?: string;
  paymentInstructions?: string;
  termsAndConditions?: string;
  currency?: string;
}

export interface UpdateInvoicePayload extends Partial<CreateInvoicePayload> {
  status?: InvoiceStatus;
}

export interface CreateExpensePayload {
  amount: number;
  category: ExpenseCategory;
  entityType?: ExpenseEntityType;
  entityId?: string;
  entityName?: string;
  date: string;
  description: string;
  notes?: string;
}

export interface InvoiceDraft {
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  clientPhone: string;
  clientCompany: string;
  clientChamberOfCommerce: string;
  clientVatNumber: string;
  projectName: string;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  notes: string;
  paymentInstructions: string;
  termsAndConditions: string;
  currency: string;
}

export interface FinanceSummary {
  totalInvoiced: number;
  totalReceived: number;
  totalOutstanding: number;
  totalOverdue: number;
}

export interface MonthlyRevenue {
  month: string;
  label: string;
  amount: number;
}

export interface InvoicesModuleProps {
  storageKey?: string;
  initialInvoices?: Invoice[];
  initialExpenses?: Expense[];
  initialClients?: Client[];
  adapter?: import('./adapters/types').InvoicesStorageAdapter;
  onInvoicesChange?: (invoices: Invoice[]) => void;
  onExpensesChange?: (expenses: Expense[]) => void;
  onClientsChange?: (clients: Client[]) => void;
  className?: string;
}

export interface WorkspaceSettings {
  companyName: string;
  companyEmail: string;
  companyAddress: string;
  companyPhone: string;
  logoUrl: string;
  invoicePrefix: string;
  defaultTaxRate: number;
  currency: string;
  vatNumber?: string;
  bankAccountTitle?: string;
  bankName?: string;
  bankAccountNumber?: string;
  iban?: string;
  paymentInstructions: string;
  termsAndConditions: string;
}

export const DEFAULT_WORKSPACE_SETTINGS: WorkspaceSettings = {
  companyName: 'iMergix Studio',
  companyEmail: 'hello@imergix.app',
  companyAddress: '123 Freelancer Lane, Remote City',
  companyPhone: '+1 (555) 000-0000',
  logoUrl: '',
  invoicePrefix: 'INV',
  defaultTaxRate: 0,
  currency: 'USD',
  bankAccountTitle: '',
  bankName: '',
  bankAccountNumber: '',
  iban: '',
  paymentInstructions:
    'Payment Method: Bank Transfer\nPlease include the invoice number in your payment reference.',
  termsAndConditions:
    'Payment is due within 30 days from the issue date.\nIf you have any questions regarding this invoice, please contact us.',
};

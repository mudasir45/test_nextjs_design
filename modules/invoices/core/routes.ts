/** Route helpers — override in InvoicesProvider for your app's URL structure. */
export interface InvoicesRoutes {
  index: string;
  new: string;
  detail: (invoiceId: string) => string;
}

export const DEFAULT_INVOICES_ROUTES: InvoicesRoutes = {
  index: '/invoices',
  new: '/invoices/new',
  detail: (invoiceId) => `/invoices/${invoiceId}`,
};

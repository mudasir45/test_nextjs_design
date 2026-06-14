import type { Expense, Invoice } from '../core/types';

const now = new Date();
const year = now.getFullYear();

function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

function daysFromNow(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

function isoDaysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const DEFAULT_INVOICES: Invoice[] = [
  {
    id: 'inv-001',
    number: `INV-${year}-001`,
    clientName: 'Acme Design Co.',
    clientEmail: 'billing@acmedesign.com',
    clientAddress: '456 Market St, San Francisco, CA 94105',
    projectName: 'Brand Refresh',
    status: 'paid',
    issueDate: daysAgo(45),
    dueDate: daysAgo(15),
    lineItems: [
      {
        id: 'li-001',
        description: 'Brand identity design — logo & guidelines',
        quantity: 1,
        unitPrice: 3500,
        taxRate: 0,
      },
      {
        id: 'li-002',
        description: 'Social media template pack',
        quantity: 1,
        unitPrice: 800,
        taxRate: 0,
      },
    ],
    notes: 'Thank you for your business!',
    currency: 'USD',
    subtotal: 4300,
    taxTotal: 0,
    total: 4300,
    createdAt: isoDaysAgo(45),
    updatedAt: isoDaysAgo(20),
    sentAt: isoDaysAgo(44),
    paidAt: isoDaysAgo(18),
  },
  {
    id: 'inv-002',
    number: `INV-${year}-002`,
    clientName: 'Startup Labs Inc.',
    clientEmail: 'finance@startuplabs.io',
    clientAddress: '789 Innovation Blvd, Austin, TX 78701',
    projectName: 'MVP Development',
    status: 'sent',
    issueDate: daysAgo(10),
    dueDate: daysFromNow(20),
    lineItems: [
      {
        id: 'li-003',
        description: 'Frontend development — Sprint 3',
        quantity: 40,
        unitPrice: 125,
        taxRate: 0,
      },
      {
        id: 'li-004',
        description: 'API integration & testing',
        quantity: 16,
        unitPrice: 125,
        taxRate: 0,
      },
    ],
    currency: 'USD',
    subtotal: 7000,
    taxTotal: 0,
    total: 7000,
    createdAt: isoDaysAgo(10),
    updatedAt: isoDaysAgo(9),
    sentAt: isoDaysAgo(9),
  },
  {
    id: 'inv-003',
    number: `INV-${year}-003`,
    clientName: 'Greenleaf Wellness',
    clientEmail: 'accounts@greenleaf.co',
    clientAddress: '12 Wellness Way, Portland, OR 97201',
    projectName: 'Website Redesign',
    status: 'overdue',
    issueDate: daysAgo(60),
    dueDate: daysAgo(30),
    lineItems: [
      {
        id: 'li-005',
        description: 'Website design & development',
        quantity: 1,
        unitPrice: 5200,
        taxRate: 0,
      },
    ],
    notes: 'Payment due within 30 days of invoice date.',
    currency: 'USD',
    subtotal: 5200,
    taxTotal: 0,
    total: 5200,
    createdAt: isoDaysAgo(60),
    updatedAt: isoDaysAgo(29),
    sentAt: isoDaysAgo(58),
  },
  {
    id: 'inv-004',
    number: `INV-${year}-004`,
    clientName: 'NovaTech Solutions',
    clientEmail: 'ap@novatech.com',
    projectName: 'Consulting Retainer',
    status: 'draft',
    issueDate: daysAgo(2),
    dueDate: daysFromNow(28),
    lineItems: [
      {
        id: 'li-006',
        description: 'Technical consulting — March 2026',
        quantity: 20,
        unitPrice: 150,
        taxRate: 0,
      },
    ],
    currency: 'USD',
    subtotal: 3000,
    taxTotal: 0,
    total: 3000,
    createdAt: isoDaysAgo(2),
    updatedAt: isoDaysAgo(2),
  },
  {
    id: 'inv-005',
    number: `INV-${year}-005`,
    clientName: 'Bright Media Group',
    clientEmail: 'payments@brightmedia.com',
    clientAddress: '200 Creative Ave, New York, NY 10001',
    projectName: 'Content Strategy',
    status: 'paid',
    issueDate: daysAgo(90),
    dueDate: daysAgo(60),
    lineItems: [
      {
        id: 'li-007',
        description: 'Content strategy & editorial calendar',
        quantity: 1,
        unitPrice: 2800,
        taxRate: 0,
      },
      {
        id: 'li-008',
        description: 'Blog post writing (4 articles)',
        quantity: 4,
        unitPrice: 350,
        taxRate: 0,
      },
    ],
    currency: 'USD',
    subtotal: 4200,
    taxTotal: 0,
    total: 4200,
    createdAt: isoDaysAgo(90),
    updatedAt: isoDaysAgo(55),
    sentAt: isoDaysAgo(88),
    paidAt: isoDaysAgo(58),
  },
  {
    id: 'inv-006',
    number: `INV-${year}-006`,
    clientName: 'Pixel Perfect Agency',
    clientEmail: 'hello@pixelperfect.io',
    projectName: 'UI Component Library',
    status: 'sent',
    issueDate: daysAgo(5),
    dueDate: daysFromNow(25),
    lineItems: [
      {
        id: 'li-009',
        description: 'Design system components (Figma)',
        quantity: 1,
        unitPrice: 4500,
        taxRate: 0,
      },
    ],
    currency: 'USD',
    subtotal: 4500,
    taxTotal: 0,
    total: 4500,
    createdAt: isoDaysAgo(5),
    updatedAt: isoDaysAgo(4),
    sentAt: isoDaysAgo(4),
  },
];

export const DEFAULT_EXPENSES: Expense[] = [
  {
    id: 'exp-001',
    amount: 49.99,
    category: 'software',
    date: daysAgo(3),
    description: 'Figma Professional subscription',
    createdAt: isoDaysAgo(3),
  },
  {
    id: 'exp-002',
    amount: 1299,
    category: 'equipment',
    date: daysAgo(15),
    description: 'External monitor — Dell 27"',
    notes: 'Tax deductible equipment purchase',
    createdAt: isoDaysAgo(15),
  },
  {
    id: 'exp-003',
    amount: 85.5,
    category: 'travel',
    date: daysAgo(20),
    description: 'Client meeting — coffee & lunch',
    createdAt: isoDaysAgo(20),
  },
  {
    id: 'exp-004',
    amount: 29,
    category: 'software',
    date: daysAgo(30),
    description: 'Domain renewal — imergix.app',
    createdAt: isoDaysAgo(30),
  },
  {
    id: 'exp-005',
    amount: 250,
    category: 'marketing',
    date: daysAgo(45),
    description: 'LinkedIn ad campaign',
    createdAt: isoDaysAgo(45),
  },
  {
    id: 'exp-006',
    amount: 15.99,
    category: 'other',
    date: daysAgo(7),
    description: 'Office supplies',
    createdAt: isoDaysAgo(7),
  },
];

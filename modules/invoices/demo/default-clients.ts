import type { Client } from '../core/types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export const DEFAULT_CLIENTS: Client[] = [
  {
    id: 'client-001',
    name: 'Thomas van Buuren',
    company: 'BullNice B.V.',
    email: 'thomas@knaex.nl',
    phone: '0634494205',
    address: 'Torenlaan 5B, 1402 AT Bussum, Netherlands',
    chamberOfCommerce: '84835850',
    status: 'active',
    createdAt: daysAgo(90),
    updatedAt: daysAgo(10),
  },
  {
    id: 'client-002',
    name: 'Sarah Kim',
    company: 'Acme Design Co.',
    email: 'billing@acmedesign.com',
    phone: '+1 (415) 555-0100',
    address: '456 Market St, San Francisco, CA 94105',
    status: 'active',
    createdAt: daysAgo(60),
    updatedAt: daysAgo(5),
  },
  {
    id: 'client-003',
    name: 'James Okafor',
    company: 'Startup Labs Inc.',
    email: 'finance@startuplabs.io',
    phone: '+1 (512) 555-0200',
    address: '789 Innovation Blvd, Austin, TX 78701',
    status: 'active',
    createdAt: daysAgo(45),
    updatedAt: daysAgo(2),
  },
  {
    id: 'client-004',
    name: 'Maya Patel',
    company: 'Greenleaf Wellness',
    email: 'accounts@greenleaf.co',
    phone: '+1 (503) 555-0300',
    address: '12 Wellness Way, Portland, OR 97201',
    status: 'active',
    createdAt: daysAgo(120),
    updatedAt: daysAgo(30),
  },
  {
    id: 'client-005',
    name: 'Alex Chen',
    company: 'Pixel Perfect Agency',
    email: 'hello@pixelperfect.io',
    status: 'lead',
    createdAt: daysAgo(15),
    updatedAt: daysAgo(5),
  },
];

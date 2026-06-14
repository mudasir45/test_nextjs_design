'use client';

import { useCallback, useEffect, useState } from 'react';
import { generateId } from '../adapters';
import type { InvoicesStorageAdapter } from '../adapters/types';
import type { Client, ClientStatus } from '../types';

interface UseClientsOptions {
  initialClients: Client[];
  adapter: InvoicesStorageAdapter;
  hydrated: boolean;
  onClientsChange?: (clients: Client[]) => void;
}

export function useClients({
  initialClients,
  adapter,
  hydrated,
  onClientsChange,
}: UseClientsOptions) {
  const [clients, setClients] = useState<Client[]>(() => {
    if (typeof window === 'undefined') return initialClients;
    const stored = adapter.loadClients();
    return stored?.length ? stored : initialClients;
  });

  useEffect(() => {
    if (!hydrated) return;
    adapter.saveClients(clients);
    onClientsChange?.(clients);
  }, [clients, hydrated, adapter, onClientsChange]);

  const createClient = useCallback(
    (payload: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
      const now = new Date().toISOString();
      const client: Client = {
        id: generateId('client'),
        ...payload,
        createdAt: now,
        updatedAt: now,
      };
      setClients((prev) => [client, ...prev]);
      return client;
    },
    [],
  );

  const updateClient = useCallback(
    (clientId: string, updates: Partial<Omit<Client, 'id' | 'createdAt'>>) => {
      setClients((prev) =>
        prev.map((c) =>
          c.id === clientId
            ? { ...c, ...updates, updatedAt: new Date().toISOString() }
            : c,
        ),
      );
    },
    [],
  );

  const deleteClient = useCallback((clientId: string) => {
    setClients((prev) => prev.filter((c) => c.id !== clientId));
  }, []);

  const getClientById = useCallback(
    (clientId: string) => clients.find((c) => c.id === clientId),
    [clients],
  );

  return { clients, createClient, updateClient, deleteClient, getClientById };
}

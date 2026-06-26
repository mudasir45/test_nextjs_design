'use client';

import { useCallback } from 'react';
import { generateId } from '../adapters';
import { wordCount } from '../document-editor-utils';
import type {
  EnvironmentCredential,
  EnvironmentUrl,
  InfrastructureItem,
  Project,
  ProjectDocument,
  ProjectDocumentVersion,
  ProjectEnvironment,
  ProjectFolder,
  ProjectLink,
} from '../types';

type ProjectUpdater = (projectId: string, updates: Partial<Project>) => void;

function touchProject(project: Project, patch: Partial<Project>): Partial<Project> {
  return { ...patch, updatedAt: new Date().toISOString() };
}

function nextVersionNumber(doc: ProjectDocument): number {
  const versions = doc.versions ?? [];
  const highest = versions.reduce((max, v) => Math.max(max, v.version), 0);
  return highest + 1;
}

function snapshotDocument(
  doc: ProjectDocument,
  version: number,
  origin: ProjectDocumentVersion['origin'],
  label?: string,
): ProjectDocumentVersion {
  return {
    id: generateId('ver'),
    version,
    title: doc.title,
    type: doc.type,
    status: doc.status ?? 'draft',
    content: doc.content,
    label,
    origin,
    wordCount: wordCount(doc.content ?? ''),
    createdAt: new Date().toISOString(),
  };
}

export function useProjectWorkspace(
  project: Project | null,
  updateProject: ProjectUpdater,
) {
  const projectId = project?.id;

  const patch = useCallback(
    (updates: Partial<Project>) => {
      if (!projectId) return;
      updateProject(projectId, touchProject(project!, updates));
    },
    [project, projectId, updateProject],
  );

  const addFolder = useCallback(
    (name: string, parentId?: string) => {
      if (!project) return;
      const folder: ProjectFolder = { id: generateId('folder'), name, parentId };
      patch({ folders: [...project.folders, folder] });
      return folder;
    },
    [project, patch],
  );

  const deleteFolder = useCallback(
    (folderId: string) => {
      if (!project) return;
      patch({
        folders: project.folders.filter((f) => f.id !== folderId),
        documents: project.documents.map((d) =>
          d.folderId === folderId ? { ...d, folderId: undefined } : d,
        ),
      });
    },
    [project, patch],
  );

  const addDocument = useCallback(
    (payload: Omit<ProjectDocument, 'id' | 'createdAt' | 'updatedAt' | 'versions' | 'currentVersion'>) => {
      if (!project) return;
      const now = new Date().toISOString();
      const base: ProjectDocument = {
        ...payload,
        id: generateId('doc'),
        status: payload.status ?? 'draft',
        tags: payload.tags ?? [],
        versions: [],
        currentVersion: 1,
        createdAt: now,
        updatedAt: now,
      };
      const initialVersion = snapshotDocument(base, 1, 'manual', 'Created');
      const doc: ProjectDocument = { ...base, versions: [initialVersion] };
      patch({ documents: [doc, ...project.documents] });
      return doc;
    },
    [project, patch],
  );

  const updateDocument = useCallback(
    (docId: string, updates: Partial<ProjectDocument>) => {
      if (!project) return;
      patch({
        documents: project.documents.map((d) =>
          d.id === docId ? { ...d, ...updates, updatedAt: new Date().toISOString() } : d,
        ),
      });
    },
    [project, patch],
  );

  /** Captures the document's current live content as a new, immutable version. */
  const saveDocumentVersion = useCallback(
    (docId: string, label?: string) => {
      if (!project) return;
      let created: ProjectDocumentVersion | undefined;
      patch({
        documents: project.documents.map((d) => {
          if (d.id !== docId) return d;
          const version = nextVersionNumber(d);
          created = snapshotDocument(d, version, 'manual', label?.trim() || undefined);
          return {
            ...d,
            versions: [created, ...(d.versions ?? [])],
            currentVersion: version,
            updatedAt: new Date().toISOString(),
          };
        }),
      });
      return created;
    },
    [project, patch],
  );

  /** Restores a prior version, snapshotting current work first so nothing is lost. */
  const restoreDocumentVersion = useCallback(
    (docId: string, versionId: string) => {
      if (!project) return;
      patch({
        documents: project.documents.map((d) => {
          if (d.id !== docId) return d;
          const versions = d.versions ?? [];
          const target = versions.find((v) => v.id === versionId);
          if (!target) return d;

          const history = [...versions];
          const latest = history[0];
          const currentDirty =
            !latest ||
            latest.content !== d.content ||
            latest.title !== d.title ||
            latest.type !== d.type ||
            latest.status !== (d.status ?? 'draft');

          let nextNum = nextVersionNumber(d);
          if (currentDirty) {
            history.unshift(snapshotDocument(d, nextNum, 'auto', 'Autosaved before restore'));
            nextNum += 1;
          }

          const restoredSnapshot: ProjectDocumentVersion = {
            ...snapshotDocument(
              { ...d, title: target.title, type: target.type, status: target.status, content: target.content },
              nextNum,
              'restore',
              `Restored from v${target.version}`,
            ),
          };
          history.unshift(restoredSnapshot);

          return {
            ...d,
            title: target.title,
            type: target.type,
            status: target.status,
            content: target.content,
            versions: history,
            currentVersion: nextNum,
            updatedAt: new Date().toISOString(),
          };
        }),
      });
    },
    [project, patch],
  );

  const deleteDocument = useCallback(
    (docId: string) => {
      if (!project) return;
      patch({ documents: project.documents.filter((d) => d.id !== docId) });
    },
    [project, patch],
  );

  const addLink = useCallback(
    (payload: Omit<ProjectLink, 'id' | 'createdAt'>) => {
      if (!project) return;
      const link: ProjectLink = {
        ...payload,
        id: generateId('link'),
        createdAt: new Date().toISOString(),
      };
      patch({ links: [link, ...project.links] });
      return link;
    },
    [project, patch],
  );

  const updateLink = useCallback(
    (linkId: string, updates: Partial<ProjectLink>) => {
      if (!project) return;
      patch({
        links: project.links.map((l) => (l.id === linkId ? { ...l, ...updates } : l)),
      });
    },
    [project, patch],
  );

  const deleteLink = useCallback(
    (linkId: string) => {
      if (!project) return;
      patch({ links: project.links.filter((l) => l.id !== linkId) });
    },
    [project, patch],
  );

  const addEnvironment = useCallback(
    (payload: Omit<ProjectEnvironment, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!project) return;
      const now = new Date().toISOString();
      const env: ProjectEnvironment = {
        ...payload,
        id: generateId('env'),
        urls: payload.urls ?? [],
        credentials: (payload.credentials ?? []).map((c) => ({
          ...c,
          id: c.id || generateId('cred'),
          createdAt: c.createdAt || now,
        })),
        createdAt: now,
        updatedAt: now,
      };
      patch({ environments: [...project.environments, env] });
      return env;
    },
    [project, patch],
  );

  const updateEnvironment = useCallback(
    (envId: string, updates: Partial<ProjectEnvironment>) => {
      if (!project) return;
      patch({
        environments: project.environments.map((e) =>
          e.id === envId ? { ...e, ...updates, updatedAt: new Date().toISOString() } : e,
        ),
      });
    },
    [project, patch],
  );

  const deleteEnvironment = useCallback(
    (envId: string) => {
      if (!project) return;
      patch({ environments: project.environments.filter((e) => e.id !== envId) });
    },
    [project, patch],
  );

  const addCredential = useCallback(
    (
      envId: string,
      payload: Omit<EnvironmentCredential, 'id' | 'createdAt'>,
    ) => {
      if (!project) return;
      const cred: EnvironmentCredential = {
        ...payload,
        id: generateId('cred'),
        createdAt: new Date().toISOString(),
      };
      patch({
        environments: project.environments.map((e) =>
          e.id === envId
            ? { ...e, credentials: [...e.credentials, cred], updatedAt: new Date().toISOString() }
            : e,
        ),
      });
      return cred;
    },
    [project, patch],
  );

  const updateCredential = useCallback(
    (
      envId: string,
      credId: string,
      updates: Partial<EnvironmentCredential>,
    ) => {
      if (!project) return;
      patch({
        environments: project.environments.map((e) =>
          e.id === envId
            ? {
                ...e,
                credentials: e.credentials.map((c) =>
                  c.id === credId ? { ...c, ...updates } : c,
                ),
                updatedAt: new Date().toISOString(),
              }
            : e,
        ),
      });
    },
    [project, patch],
  );

  const deleteCredential = useCallback(
    (envId: string, credId: string) => {
      if (!project) return;
      patch({
        environments: project.environments.map((e) =>
          e.id === envId
            ? {
                ...e,
                credentials: e.credentials.filter((c) => c.id !== credId),
                updatedAt: new Date().toISOString(),
              }
            : e,
        ),
      });
    },
    [project, patch],
  );

  const addInfrastructureItem = useCallback(
    (payload: Omit<InfrastructureItem, 'id'>) => {
      if (!project) return;
      const item: InfrastructureItem = {
        ...payload,
        id: generateId('infra'),
        credentials: payload.credentials ?? [],
      };
      patch({ infrastructure: [...project.infrastructure, item] });
      return item;
    },
    [project, patch],
  );

  const updateInfrastructureItem = useCallback(
    (itemId: string, updates: Partial<InfrastructureItem>) => {
      if (!project) return;
      patch({
        infrastructure: project.infrastructure.map((i) =>
          i.id === itemId ? { ...i, ...updates } : i,
        ),
      });
    },
    [project, patch],
  );

  const deleteInfrastructureItem = useCallback(
    (itemId: string) => {
      if (!project) return;
      patch({ infrastructure: project.infrastructure.filter((i) => i.id !== itemId) });
    },
    [project, patch],
  );

  const addInfraCredential = useCallback(
    (
      itemId: string,
      payload: Omit<EnvironmentCredential, 'id' | 'createdAt'>,
    ) => {
      if (!project) return;
      const cred: EnvironmentCredential = {
        ...payload,
        id: generateId('cred'),
        createdAt: new Date().toISOString(),
      };
      patch({
        infrastructure: project.infrastructure.map((i) =>
          i.id === itemId ? { ...i, credentials: [...i.credentials, cred] } : i,
        ),
      });
      return cred;
    },
    [project, patch],
  );

  const deleteInfraCredential = useCallback(
    (itemId: string, credId: string) => {
      if (!project) return;
      patch({
        infrastructure: project.infrastructure.map((i) =>
          i.id === itemId
            ? { ...i, credentials: i.credentials.filter((c) => c.id !== credId) }
            : i,
        ),
      });
    },
    [project, patch],
  );

  return {
    addFolder,
    deleteFolder,
    addDocument,
    updateDocument,
    deleteDocument,
    saveDocumentVersion,
    restoreDocumentVersion,
    addLink,
    updateLink,
    deleteLink,
    addEnvironment,
    updateEnvironment,
    deleteEnvironment,
    addCredential,
    updateCredential,
    deleteCredential,
    addInfrastructureItem,
    updateInfrastructureItem,
    deleteInfrastructureItem,
    addInfraCredential,
    deleteInfraCredential,
  };
}

export type ProjectWorkspaceActions = ReturnType<typeof useProjectWorkspace>;

export type { EnvironmentUrl };

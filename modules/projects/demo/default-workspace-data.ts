import type {
  InfrastructureItem,
  ProjectDocument,
  ProjectEnvironment,
  ProjectFolder,
  ProjectLink,
} from '../core/types';

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export interface ProjectWorkspaceSeed {
  folders: ProjectFolder[];
  documents: ProjectDocument[];
  links: ProjectLink[];
  environments: ProjectEnvironment[];
  infrastructure: InfrastructureItem[];
}

export const WORKSPACE_SEED: Record<string, ProjectWorkspaceSeed> = {
  'proj-brand': {
    folders: [
      { id: 'folder-brand-brief', name: 'Brief & Strategy' },
      { id: 'folder-brand-design', name: 'Design Assets' },
      { id: 'folder-brand-client', name: 'Client Documents' },
    ],
    documents: [
      {
        id: 'doc-brand-prd',
        title: 'Brand Refresh PRD',
        type: 'prd',
        folderId: 'folder-brand-brief',
        content:
          '# Brand Refresh PRD\n\n## Overview\nDefine scope for logo redesign, color system, typography, and brand guidelines delivery.\n\n## Goals\n- Deliver updated visual identity by end of Q2\n- Align stakeholders on color and typography\n- Produce exportable brand asset package\n\n## Out of scope\n- Website development\n- Marketing campaign creative',
        tags: ['scope', 'v1'],
        createdAt: daysAgo(40),
        updatedAt: daysAgo(3),
      },
      {
        id: 'doc-brand-research',
        title: 'Competitive Brand Analysis',
        type: 'research',
        folderId: 'folder-brand-brief',
        content: 'Analysis of 12 competitor brands in the B2B SaaS space.',
        tags: ['research'],
        createdAt: daysAgo(38),
        updatedAt: daysAgo(10),
      },
      {
        id: 'doc-brand-meeting',
        title: 'Kickoff Meeting Notes',
        type: 'meeting_notes',
        folderId: 'folder-brand-client',
        content: 'Stakeholders aligned on timeline, deliverables, and approval workflow.',
        tags: ['kickoff'],
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45),
      },
      {
        id: 'doc-brand-sop',
        title: 'Brand Asset Handoff SOP',
        type: 'sop',
        folderId: 'folder-brand-design',
        content: 'Standard process for exporting and delivering brand assets to client.',
        tags: ['process'],
        createdAt: daysAgo(20),
        updatedAt: daysAgo(5),
      },
    ],
    links: [
      {
        id: 'link-brand-figma',
        title: 'Brand System — Figma',
        url: 'https://figma.com/file/brand-refresh',
        description: 'Master design file with logo, colors, and typography',
        type: 'figma',
        createdAt: daysAgo(30),
      },
      {
        id: 'link-brand-notion',
        title: 'Project Wiki',
        url: 'https://notion.so/bullnice-brand-refresh',
        description: 'Internal project documentation and decisions log',
        type: 'notion',
        createdAt: daysAgo(42),
      },
      {
        id: 'link-brand-github',
        title: 'Brand Assets Repo',
        url: 'https://github.com/studio/bullnice-brand',
        description: 'SVG exports and brand guideline source files',
        type: 'github',
        createdAt: daysAgo(25),
      },
      {
        id: 'link-brand-prod',
        title: 'Live Brand Preview',
        url: 'https://brand-preview.bullnice.com',
        description: 'Staging preview of updated brand on marketing site',
        type: 'production',
        createdAt: daysAgo(7),
      },
    ],
    environments: [
      {
        id: 'env-brand-dev',
        name: 'Design Preview',
        type: 'development',
        status: 'active',
        note: 'Internal preview environment for brand iterations',
        urls: [
          { label: 'Preview Site', url: 'https://dev.brand-preview.bullnice.com' },
          { label: 'CMS Admin', url: 'https://dev.brand-preview.bullnice.com/admin' },
        ],
        credentials: [
          {
            id: 'cred-brand-dev-admin',
            label: 'CMS Admin',
            username: 'admin@studio.dev',
            value: 'dev-admin-pass-2026',
            role: 'admin',
            note: 'Full CMS access',
            createdAt: daysAgo(30),
          },
          {
            id: 'cred-brand-dev-viewer',
            label: 'Preview Access',
            username: 'viewer@studio.dev',
            value: 'viewer-pass-2026',
            role: 'viewer',
            createdAt: daysAgo(30),
          },
        ],
        createdAt: daysAgo(35),
        updatedAt: daysAgo(5),
      },
      {
        id: 'env-brand-staging',
        name: 'Client Review',
        type: 'staging',
        status: 'active',
        note: 'Shared with BullNice for brand approval',
        urls: [
          { label: 'Review Site', url: 'https://staging.brand-preview.bullnice.com' },
        ],
        credentials: [
          {
            id: 'cred-brand-staging-client',
            label: 'Client Portal',
            username: 'client@bullnice.com',
            value: 'client-review-2026',
            role: 'viewer',
            note: 'Shared with client stakeholders',
            createdAt: daysAgo(14),
          },
        ],
        createdAt: daysAgo(20),
        updatedAt: daysAgo(2),
      },
    ],
    infrastructure: [
      {
        id: 'infra-brand-vercel',
        name: 'Vercel Hosting',
        provider: 'Vercel',
        category: 'hosting',
        url: 'https://vercel.com/studio/brand-preview',
        note: 'Preview and staging deployments',
        credentials: [
          {
            id: 'cred-brand-vercel',
            label: 'Deploy Token',
            value: 'vercel_deploy_token_brand_abc123',
            role: 'developer',
            createdAt: daysAgo(35),
          },
        ],
      },
      {
        id: 'infra-brand-cloudinary',
        name: 'Cloudinary CDN',
        provider: 'Cloudinary',
        category: 'cdn',
        url: 'https://cloudinary.com/console',
        credentials: [
          {
            id: 'cred-brand-cloudinary',
            label: 'API Key',
            value: 'cloudinary_api_key_xyz789',
            role: 'api',
            createdAt: daysAgo(30),
          },
        ],
      },
    ],
  },
  'proj-mobile': {
    folders: [
      { id: 'folder-mobile-specs', name: 'Specifications' },
      { id: 'folder-mobile-research', name: 'Research' },
    ],
    documents: [
      {
        id: 'doc-mobile-prd',
        title: 'Mobile App PRD v2',
        type: 'prd',
        folderId: 'folder-mobile-specs',
        content:
          '# Mobile App PRD v2\n\n## Problem\nClients need a single place to onboard, track projects, and receive updates.\n\n## Solution\nCross-platform app with offline-first sync and push notifications.\n\n### Key flows\n1. Client onboarding wizard\n2. Project dashboard\n3. Push notification preferences',
        tags: ['mobile', 'v2'],
        createdAt: daysAgo(28),
        updatedAt: daysAgo(1),
      },
      {
        id: 'doc-mobile-spec',
        title: 'Technical Architecture Spec',
        type: 'spec',
        folderId: 'folder-mobile-specs',
        content: 'React Native + Expo, Supabase backend, offline-first sync strategy.',
        tags: ['architecture'],
        createdAt: daysAgo(25),
        updatedAt: daysAgo(4),
      },
      {
        id: 'doc-mobile-research',
        title: 'User Research — Onboarding',
        type: 'research',
        folderId: 'folder-mobile-research',
        content: '12 user interviews on client onboarding pain points.',
        tags: ['ux', 'research'],
        createdAt: daysAgo(22),
        updatedAt: daysAgo(8),
      },
    ],
    links: [
      {
        id: 'link-mobile-figma',
        title: 'Mobile UI — Figma',
        url: 'https://figma.com/file/mobile-app-ui',
        description: 'All screens and component library',
        type: 'figma',
        createdAt: daysAgo(26),
      },
      {
        id: 'link-mobile-github',
        title: 'Mobile App Repository',
        url: 'https://github.com/studio/mobile-app',
        description: 'React Native monorepo',
        type: 'github',
        createdAt: daysAgo(30),
      },
      {
        id: 'link-mobile-api',
        title: 'API Documentation',
        url: 'https://api-docs.mobile-app.io',
        description: 'OpenAPI spec and endpoint reference',
        type: 'api',
        createdAt: daysAgo(20),
      },
      {
        id: 'link-mobile-prod',
        title: 'App Store Listing',
        url: 'https://apps.apple.com/app/mobile-client',
        description: 'Production App Store page',
        type: 'production',
        createdAt: daysAgo(5),
      },
      {
        id: 'link-mobile-notion',
        title: 'Sprint Board',
        url: 'https://notion.so/mobile-sprint-board',
        type: 'notion',
        createdAt: daysAgo(28),
      },
    ],
    environments: [
      {
        id: 'env-mobile-dev',
        name: 'Development',
        type: 'development',
        status: 'active',
        note: 'Local and cloud dev environment',
        urls: [
          { label: 'API', url: 'https://dev-api.mobile-app.io' },
          { label: 'Admin Panel', url: 'https://dev-admin.mobile-app.io' },
          { label: 'App (Expo)', url: 'exp://dev.mobile-app.io' },
        ],
        credentials: [
          {
            id: 'cred-mobile-dev-db',
            label: 'Dev Database',
            username: 'dev_user',
            value: 'dev_db_pass_mobile_2026',
            role: 'developer',
            note: 'PostgreSQL connection',
            createdAt: daysAgo(28),
          },
          {
            id: 'cred-mobile-dev-api',
            label: 'API Key',
            value: 'dev_api_key_mobile_xyz123',
            role: 'api',
            createdAt: daysAgo(28),
          },
        ],
        createdAt: daysAgo(30),
        updatedAt: daysAgo(1),
      },
      {
        id: 'env-mobile-qa',
        name: 'QA',
        type: 'qa',
        status: 'active',
        urls: [
          { label: 'API', url: 'https://qa-api.mobile-app.io' },
          { label: 'TestFlight', url: 'https://testflight.apple.com/join/mobileqa' },
        ],
        credentials: [
          {
            id: 'cred-mobile-qa',
            label: 'QA Tester Account',
            username: 'qa@test.mobile-app.io',
            value: 'qa_pass_2026',
            role: 'qa',
            createdAt: daysAgo(15),
          },
        ],
        createdAt: daysAgo(20),
        updatedAt: daysAgo(3),
      },
      {
        id: 'env-mobile-prod',
        name: 'Production',
        type: 'production',
        status: 'active',
        note: 'Live production environment — changes require approval',
        urls: [
          { label: 'API', url: 'https://api.mobile-app.io' },
          { label: 'Admin', url: 'https://admin.mobile-app.io' },
          { label: 'Status Page', url: 'https://status.mobile-app.io' },
        ],
        credentials: [
          {
            id: 'cred-mobile-prod-admin',
            label: 'Production Admin',
            username: 'admin@mobile-app.io',
            value: 'prod_admin_secure_2026',
            role: 'admin',
            note: 'Restricted — 2FA required',
            createdAt: daysAgo(10),
          },
          {
            id: 'cred-mobile-prod-api',
            label: 'Production API Key',
            value: 'prod_api_key_secure_abc789',
            role: 'api',
            createdAt: daysAgo(10),
          },
        ],
        createdAt: daysAgo(10),
        updatedAt: daysAgo(1),
      },
    ],
    infrastructure: [
      {
        id: 'infra-mobile-supabase',
        name: 'Supabase',
        provider: 'Supabase',
        category: 'database',
        url: 'https://supabase.com/dashboard/project/mobile-app',
        note: 'PostgreSQL + Auth + Realtime',
        credentials: [
          {
            id: 'cred-mobile-supabase',
            label: 'Service Role Key',
            value: 'supabase_service_role_key_xyz',
            role: 'admin',
            createdAt: daysAgo(30),
          },
        ],
      },
      {
        id: 'infra-mobile-github',
        name: 'GitHub Actions',
        provider: 'GitHub',
        category: 'ci_cd',
        url: 'https://github.com/studio/mobile-app/actions',
        credentials: [],
      },
    ],
  },
  'proj-api': {
    folders: [{ id: 'folder-api-docs', name: 'Documentation' }],
    documents: [
      {
        id: 'doc-api-spec',
        title: 'API Platform Specification',
        type: 'spec',
        folderId: 'folder-api-docs',
        content: 'REST + GraphQL endpoints, auth flows, rate limiting rules.',
        tags: ['api', 'spec'],
        createdAt: daysAgo(55),
        updatedAt: daysAgo(14),
      },
      {
        id: 'doc-api-client',
        title: 'Client Integration Guide',
        type: 'client_doc',
        folderId: 'folder-api-docs',
        content: 'Step-by-step guide for client teams to integrate with the API.',
        tags: ['client'],
        createdAt: daysAgo(50),
        updatedAt: daysAgo(20),
      },
    ],
    links: [
      {
        id: 'link-api-github',
        title: 'API Platform Repo',
        url: 'https://github.com/studio/api-platform',
        type: 'github',
        createdAt: daysAgo(60),
      },
      {
        id: 'link-api-docs',
        title: 'Swagger Docs',
        url: 'https://docs.api-platform.io/swagger',
        description: 'Interactive API documentation',
        type: 'docs',
        createdAt: daysAgo(45),
      },
    ],
    environments: [
      {
        id: 'env-api-dev',
        name: 'Development',
        type: 'development',
        status: 'inactive',
        note: 'Paused while project is on hold',
        urls: [{ label: 'API', url: 'https://dev.api-platform.io' }],
        credentials: [
          {
            id: 'cred-api-dev',
            label: 'Dev API Key',
            value: 'dev_api_platform_key',
            role: 'developer',
            createdAt: daysAgo(60),
          },
        ],
        createdAt: daysAgo(60),
        updatedAt: daysAgo(14),
      },
      {
        id: 'env-api-staging',
        name: 'Staging',
        type: 'staging',
        status: 'maintenance',
        urls: [{ label: 'API', url: 'https://staging.api-platform.io' }],
        credentials: [],
        createdAt: daysAgo(40),
        updatedAt: daysAgo(14),
      },
    ],
    infrastructure: [
      {
        id: 'infra-api-aws',
        name: 'AWS ECS',
        provider: 'AWS',
        category: 'hosting',
        url: 'https://console.aws.amazon.com/ecs',
        note: 'Container orchestration for API services',
        credentials: [
          {
            id: 'cred-api-aws',
            label: 'IAM Access Key',
            value: 'aws_iam_access_key_api',
            role: 'admin',
            createdAt: daysAgo(60),
          },
        ],
      },
    ],
  },
  'proj-marketing': {
    folders: [
      { id: 'folder-mkt-content', name: 'Content' },
      { id: 'folder-mkt-analytics', name: 'Analytics & SEO' },
    ],
    documents: [
      {
        id: 'doc-mkt-prd',
        title: 'Marketing Site PRD',
        type: 'prd',
        folderId: 'folder-mkt-content',
        content: 'Landing pages, pricing, blog, lead capture forms, and CMS workflow.',
        tags: ['marketing', 'v1'],
        createdAt: daysAgo(18),
        updatedAt: daysAgo(2),
      },
      {
        id: 'doc-mkt-seo',
        title: 'SEO Strategy & Keyword Map',
        type: 'research',
        folderId: 'folder-mkt-analytics',
        content: 'Target keywords, competitor analysis, and content calendar for Q2.',
        tags: ['seo', 'research'],
        createdAt: daysAgo(15),
        updatedAt: daysAgo(4),
      },
      {
        id: 'doc-mkt-copy',
        title: 'Homepage Copy — Final Draft',
        type: 'client_doc',
        folderId: 'folder-mkt-content',
        content: 'Approved hero, feature sections, testimonials, and CTA copy.',
        tags: ['copy', 'approved'],
        createdAt: daysAgo(10),
        updatedAt: daysAgo(1),
      },
      {
        id: 'doc-mkt-meeting',
        title: 'Conversion Review Meeting',
        type: 'meeting_notes',
        folderId: 'folder-mkt-analytics',
        content: 'Reviewed heatmaps, form drop-off, and A/B test results with client.',
        tags: ['meeting'],
        createdAt: daysAgo(6),
        updatedAt: daysAgo(6),
      },
    ],
    links: [
      {
        id: 'link-mkt-figma',
        title: 'Marketing Site — Figma',
        url: 'https://figma.com/file/marketing-site',
        description: 'All landing page designs and component library',
        type: 'figma',
        createdAt: daysAgo(16),
      },
      {
        id: 'link-mkt-github',
        title: 'Marketing Site Repo',
        url: 'https://github.com/studio/marketing-site',
        type: 'github',
        createdAt: daysAgo(14),
      },
      {
        id: 'link-mkt-prod',
        title: 'Production Site',
        url: 'https://www.client-marketing.com',
        description: 'Live marketing website',
        type: 'production',
        createdAt: daysAgo(5),
      },
      {
        id: 'link-mkt-notion',
        title: 'Content Calendar',
        url: 'https://notion.so/marketing-content-calendar',
        type: 'notion',
        createdAt: daysAgo(12),
      },
      {
        id: 'link-mkt-analytics',
        title: 'Google Analytics',
        url: 'https://analytics.google.com',
        description: 'Traffic and conversion dashboards',
        type: 'marketing',
        createdAt: daysAgo(8),
      },
    ],
    environments: [
      {
        id: 'env-mkt-staging',
        name: 'Staging',
        type: 'staging',
        status: 'active',
        note: 'Client review environment',
        urls: [
          { label: 'Site', url: 'https://staging.client-marketing.com' },
          { label: 'CMS', url: 'https://staging.client-marketing.com/admin' },
        ],
        credentials: [
          {
            id: 'cred-mkt-cms',
            label: 'CMS Editor',
            username: 'editor@studio.dev',
            value: 'cms_editor_staging_2026',
            role: 'developer',
            createdAt: daysAgo(12),
          },
        ],
        createdAt: daysAgo(14),
        updatedAt: daysAgo(2),
      },
      {
        id: 'env-mkt-prod',
        name: 'Production',
        type: 'production',
        status: 'active',
        urls: [
          { label: 'Site', url: 'https://www.client-marketing.com' },
          { label: 'CDN', url: 'https://cdn.client-marketing.com' },
        ],
        credentials: [
          {
            id: 'cred-mkt-prod',
            label: 'Deploy Token',
            value: 'vercel_prod_marketing_token',
            role: 'admin',
            createdAt: daysAgo(8),
          },
        ],
        createdAt: daysAgo(8),
        updatedAt: daysAgo(1),
      },
    ],
    infrastructure: [
      {
        id: 'infra-mkt-vercel',
        name: 'Vercel',
        provider: 'Vercel',
        category: 'hosting',
        url: 'https://vercel.com/studio/marketing-site',
        credentials: [],
      },
      {
        id: 'infra-mkt-plausible',
        name: 'Plausible Analytics',
        provider: 'Plausible',
        category: 'monitoring',
        url: 'https://plausible.io/client-marketing.com',
        credentials: [
          {
            id: 'cred-mkt-plausible',
            label: 'API Key',
            value: 'plausible_api_key_mkt',
            role: 'api',
            createdAt: daysAgo(10),
          },
        ],
      },
    ],
  },
  'proj-internal': {
    folders: [
      { id: 'folder-int-specs', name: 'Specifications' },
      { id: 'folder-int-process', name: 'Process & SOPs' },
    ],
    documents: [
      {
        id: 'doc-int-prd',
        title: 'Studio Operations PRD',
        type: 'prd',
        folderId: 'folder-int-specs',
        content: 'Project templates, time tracking integration, and client onboarding automation.',
        tags: ['internal', 'v1'],
        createdAt: daysAgo(6),
        updatedAt: daysAgo(2),
      },
      {
        id: 'doc-int-sop-onboard',
        title: 'Client Onboarding SOP',
        type: 'sop',
        folderId: 'folder-int-process',
        content: 'Step-by-step checklist from signed contract to project kickoff.',
        tags: ['sop', 'onboarding'],
        createdAt: daysAgo(5),
        updatedAt: daysAgo(3),
      },
      {
        id: 'doc-int-spec',
        title: 'Technical Architecture',
        type: 'spec',
        folderId: 'folder-int-specs',
        content: 'Module boundaries, shared adapters pattern, and localStorage migration strategy.',
        tags: ['architecture'],
        createdAt: daysAgo(4),
        updatedAt: daysAgo(1),
      },
    ],
    links: [
      {
        id: 'link-int-notion',
        title: 'Studio Wiki',
        url: 'https://notion.so/studio-operations',
        description: 'Internal documentation and playbooks',
        type: 'notion',
        createdAt: daysAgo(7),
      },
      {
        id: 'link-int-github',
        title: 'iMergix Monorepo',
        url: 'https://github.com/studio/imergix',
        type: 'github',
        createdAt: daysAgo(6),
      },
      {
        id: 'link-int-figma',
        title: 'Design System',
        url: 'https://figma.com/file/imergix-design-system',
        type: 'figma',
        createdAt: daysAgo(5),
      },
    ],
    environments: [
      {
        id: 'env-int-dev',
        name: 'Local Dev',
        type: 'development',
        status: 'active',
        note: 'Developer machines and preview deploys',
        urls: [
          { label: 'App', url: 'http://localhost:3000' },
          { label: 'Preview', url: 'https://dev.imergix.local' },
        ],
        credentials: [
          {
            id: 'cred-int-dev',
            label: 'Dev Admin',
            username: 'dev@studio.local',
            value: 'dev_admin_internal',
            role: 'developer',
            createdAt: daysAgo(5),
          },
        ],
        createdAt: daysAgo(6),
        updatedAt: daysAgo(1),
      },
    ],
    infrastructure: [
      {
        id: 'infra-int-github',
        name: 'GitHub',
        provider: 'GitHub',
        category: 'ci_cd',
        url: 'https://github.com/studio/imergix/actions',
        credentials: [],
      },
      {
        id: 'infra-int-sentry',
        name: 'Sentry',
        provider: 'Sentry',
        category: 'monitoring',
        url: 'https://sentry.io/organizations/studio',
        credentials: [
          {
            id: 'cred-int-sentry',
            label: 'DSN',
            value: 'sentry_dsn_internal_xyz',
            role: 'api',
            createdAt: daysAgo(4),
          },
        ],
      },
    ],
  },
};

export function mergeWorkspaceSeed<T extends { id: string }>(
  project: T,
): T & ProjectWorkspaceSeed {
  const seed = WORKSPACE_SEED[project.id];
  if (!seed) {
    return {
      ...project,
      folders: [],
      documents: [],
      links: [],
      environments: [],
      infrastructure: [],
    };
  }
  return { ...project, ...seed };
}

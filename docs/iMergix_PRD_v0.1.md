**IMergix**

Product Requirements Document

v0.1 — Draft | March 2026

|     |     |
| --- | --- |
| **Version** | v0.1 — Draft |
| **Status** | Internal Review |
| **Owner** | Founder / Product Owner |
| **Date** | March 2026 |
| **MVP Target** | Q3 2026 |
| **Primary Stack** | Django DRF · Supabase (DB only) · Next.js 15 · Cloudinary |
| **Target Users** | Solo freelancers, small agencies (1–10), early-stage startups |
| **Pricing** | TBD — Free tier + paid plan (structure to be finalized) |

# 1\. Overview

IMergix is an all-in-one workspace for solo freelancers, small agencies, and early-stage startups. It replaces the fragmented mess of 4–6 disconnected tools most independent workers rely on today — task boards, invoice generators, spreadsheets, goal trackers — with a single platform that feels personal, not corporate.

The product is built first by a freelancer, for a freelancer, then opened to others facing the same consistency and self-motivation problems. It is intentionally opinionated and lightweight, competing on simplicity, UX quality, and price against tools like Plutio, Bonsai, and ClickUp.

# 2\. Problem Statement

## 2.1 The Fragmentation Problem

A typical freelancer today uses 4–6 separate tools with no shared context between them:

- Tasks & notes → Notion, sticky notes, or a random Google Doc
- Projects → Trello, Linear, or a spreadsheet
- Invoices → Manual PDF, Wave, or a Google Sheet
- Goals → Nothing — or another doc nobody re-opens
- Finances → QuickBooks, another spreadsheet, or guesswork
- Clients → Contacts app or Gmail search

None of these tools connect. There is no unified view of 'am I on track?'. Context is lost constantly. Motivation suffers because there is no visible progress story.

## 2.2 What the Market is Missing

- A self-motivation layer — goal tracking tied to real project milestones
- Freelancer-first UX — not an enterprise tool reskinned for small teams
- Integrated invoicing that knows about your projects and clients
- Startup-aware: works for non-technical founders managing both product and operations
- Accessible pricing — most all-in-one tools charge $19–99/month per seat
- Something that actually feels personal, not a white-label SaaS widget

# 3\. Target Users

|     |     |
| --- | --- |
| **Segment 1 — Primary** | Solo freelancers: developers, designers, copywriters, consultants managing 3–15 clients |
| **Segment 2** | Small agencies (2–10 people) with shared projects, team tasks, multiple clients |
| **Segment 3** | Early-stage startups managing internal ops, goals, and client/finance basics |
| **Geography** | Global — English-first; regional language support post-MVP |
| **Technical level** | Intermediate — comfortable with SaaS tools; no setup or dev knowledge required |
| **Not targeted (v1)** | Enterprise teams, freelance marketplaces, client-side portal users |

# 4\. Product Goals

## MVP Goals

- Ship all 5 core modules in a connected, working state
- Onboarding under 5 minutes from signup to first active project
- Build a strong, extensible data model that cleanly adopts v2+ features without re-architecture
- Establish a design system that feels modern, minimal, and personal

## Business Goals

- Public launch with free + paid tier — pricing model to be finalized (see §10)
- 500 active users within 3 months of launch
- Paid plan priced significantly below Plutio ($19/mo) and Bonsai ($25/mo)
- NPS > 40 in the first 100 paying users

# 5\. Scope & Feature Prioritisation

## 5.1 MVP v1.0 — In Scope

|     |     |     |     |
| --- | --- | --- | --- |
| **Feature** | **Description** | **Priority** | **Version** |
| **Auth & Workspace** | Email + OAuth signup, workspace setup, member roles, settings | **P0** | v1.0 |
| **Dashboard** | Unified home: goal %, active tasks, revenue snapshot, quick actions | **P0** | v1.0 |
| **Goals & Milestones** | Yearly/quarterly/monthly goals with milestone tracking and progress view | **P0** | v1.0 |
| **Task Management** | Kanban + list views, priorities, due dates, subtasks, filters, bulk edit | **P0** | v1.0 |
| **Project & Team Mgmt** | Projects linked to clients, team roles, scoped task board, timeline view | **P0** | v1.0 |
| **Client Management** | Client profiles, contact info, project/invoice history, status | **P0** | v1.0 |
| **Invoicing & Finance** | Invoice builder, PDF export, payment status, expense log, finance chart | **P0** | v1.0 |
| **Notifications** | In-app alerts: due dates, overdue invoices, milestone completions | **P1** | v1.0 |
| **Monthly Self-Review** | Lightweight reflection prompt: wins, blockers, focus for next month | **P1** | v1.0 |

## 5.2 Post-MVP v2.0+ — Out of Scope for v1

- Client portal — clients log in to view project status and invoices
- Contract Management — create contracts from templates, send for e-signature via expiring link, link to projects/clients, track status (Draft / Sent / Signed / Expired). Scope is intentionally broader than client contracts: also covers external party agreements (vendor, partnership, NDA) and internal team onboarding contracts (offer letters, NDAs, contractor agreements)
- Slack, GitHub, Linear, Figma integrations
- AI features: smart summaries, invoice auto-fill, goal suggestions, task estimation
- Time tracking with billable hours
- Recurring invoices + Stripe payment gateway
- n8n automation workflows
- Mobile app (iOS / Android)
- Multi-workspace support
- Team chat / internal messaging

# 6\. Feature Details

## 6.1 Goals & Milestones

- Create goals with title, description, type (Personal / Professional), and timeframe (Yearly / Quarterly / Monthly)
- Break goals into milestones with individual due dates and a completion toggle
- Progress bar per goal — auto-calculated from completed vs total milestones
- Goal status: On Track / At Risk / Completed / Abandoned
- Monthly self-review prompt: what went well, blockers, next month's focus
- Dashboard widget: current-month goal completion rate and streak counter

## 6.2 Task Management

- Task fields: title, description, assignee, project link, due date, priority (Low / Medium / High / Urgent), status, tags
- Views: Kanban board with drag-and-drop columns; flat list view; calendar view (v1 stretch)
- Subtasks — one level deep
- Quick-add task via global floating button and keyboard shortcut
- Filters: assignee, project, priority, due date range, tag
- Bulk actions: reassign, change status, update due date

## 6.3 Project & Team Management

- Project fields: name, client link, status (Active / On Hold / Completed / Archived), start/end dates, description, colour/icon
- Each project has a scoped task board — filtered view of the global task list
- Team members invited by email; roles: Owner, Admin, Member, Viewer
- Simplified Gantt/timeline view — horizontal bar per task based on start/end dates
- Project health badge — auto-calculated from overdue task ratio
- Project summary card: total tasks, completed, overdue, team size, linked client

## 6.4 Client Management

- Client fields: name, company, email, phone, billing address, currency preference, notes, status (Active / Inactive / Lead)
- Client detail page: associated projects, invoices, total billed, total outstanding
- Quick-create client as a modal during invoice or project creation — no page navigation
- No client-facing login in v1 — client portal is a confirmed v2 feature

## 6.5 Invoicing & Finance

- Invoice builder: client link, project link, line items (description, qty, unit price, tax %), notes, due date
- Invoice statuses: Draft → Sent → Paid / Overdue
- PDF export — clean, branded invoice layout; downloadable and shareable via link
- Invoice numbering: auto-incrementing with customisable prefix (e.g. INV-2026-001)
- Expense log: amount, category (Equipment / Software / Travel / Marketing / Other), date, notes
- Finance dashboard: total invoiced, received, outstanding, monthly bar chart
- Single workspace currency in v1; multi-currency deferred to v2

## 6.6 Dashboard

- Stat cards: open tasks count, goals completion %, this-month revenue, active projects
- Upcoming deadlines — next 7 days across tasks and invoices
- Recent activity feed — last 10 actions across all modules
- Quick-action strip: New Task, New Invoice, New Project, New Goal
- Personalised greeting with time-of-day + motivational micro-copy

# 7\. Technical Architecture

## 7.1 Finalised Stack

Based on the decision that Django handles all backend logic and Supabase serves as the managed PostgreSQL database only:

|     |     |
| --- | --- |
| **Frontend** | Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui |
| **Backend API** | Django 5 + Django REST Framework — all business logic, permissions, calculations |
| **Database** | Supabase — managed PostgreSQL; Django connects via psycopg2 / DATABASE_URL |
| **Auth** | Django auth + Simple JWT — Supabase Auth not used; keeps auth ownership in one place |
| **File Storage** | Cloudinary — avatars, invoice logos, project cover images, attachments |
| **Background Jobs** | Celery + Redis (Upstash) — email delivery, overdue reminders, scheduled notifications |
| **PDF Generation** | WeasyPrint (server-side Django) — renders styled HTML to PDF; no headless browser needed |
| **Client State** | Zustand (UI state) + TanStack Query (server cache and data fetching) |
| **Email** | Resend — clean API, generous free tier, pairs with React Email templates |
| **Deployment** | Django on Railway or Render; Next.js on Vercel; Supabase cloud; Redis via Upstash |
| **Automation (v2)** | n8n — triggered from Supabase webhooks; deferred to post-MVP |

## 7.2 Stack Rationale

- Django over Supabase Edge Functions: the product has real business logic — invoice tax calculations, goal progress aggregations, role-based permissions, PDF generation. Django handles this cleanly at scale; Edge Functions are best for thin glue code.
- Supabase as DB only: removes vendor lock-in risk while getting a managed, hosted PostgreSQL with a good dashboard. Realtime subscriptions can be enabled post-MVP with minimal effort since the DB is already there.
- Next.js App Router: Server Components reduce client-side JS bundle size; SSR means the dashboard loads fast on first visit.
- WeasyPrint over Puppeteer: server-rendered PDFs look identical across all clients and are cheaper/faster — no headless browser process.
- Resend over SendGrid: purpose-built for transactional email, simpler API, pairs well with React Email.
- Celery + Upstash Redis from day one: overdue invoice reminders and task due-date notifications require async processing; blocking API responses for this is not acceptable.

## 7.3 Database Design Principles

- Multi-tenant by workspace: every primary table has a workspace_id FK — all queries are workspace-scoped at the ORM layer
- Soft deletes: deleted_at timestamp on all main models; nothing is permanently deleted in v1
- Audit fields: created_at, updated_at, created_by on every model
- UUIDs as primary keys for all public-facing resource IDs
- Row-Level Security: enforced at the Django permission layer; Supabase RLS kept as a failsafe only
- v2 schema readiness: Contract and ContractTemplate models are designed now (not built) so v2 can be added without breaking migrations — key FKs to Workspace, Client, Project, and User are reserved

## 7.4 Core Data Model

|     |     |
| --- | --- |
| **Model** | **Key Fields** |
| **Workspace** | id (uuid), name, owner, plan, currency, created_at |
| **User** | id, workspace_id, email, role, avatar_url, created_at |
| **Goal** | id, workspace_id, user_id, title, type, timeframe, start_date, end_date, status |
| **Milestone** | id, goal_id, title, due_date, completed, completed_at |
| **Project** | id, workspace_id, client_id, name, status, start_date, end_date, colour, deleted_at |
| **Task** | id, workspace_id, project_id, assignee_id, title, priority, status, due_date, parent_task_id |
| **Client** | id, workspace_id, name, company, email, billing_address, currency, status |
| **Invoice** | id, workspace_id, client_id, project_id, number, status, issue_date, due_date, currency, total |
| **LineItem** | id, invoice_id, description, quantity, unit_price, tax_rate |
| **Expense** | id, workspace_id, amount, category, date, notes |

# 8\. UX & Design Principles

- Personal, not corporate — should feel built for one person, not a 500-seat enterprise
- Opinionated defaults — sane defaults out of the box; minimal configuration needed to start
- Dark mode from day one — system-preference detection with a manual toggle
- Speed above all — target <150ms perceived latency for all navigation; use optimistic UI updates
- Sidebar navigation — collapsible, module-grouped; breadcrumbs on nested pages
- Mobile-responsive — not mobile-first for MVP but must be fully usable on a tablet
- Colour language — project colours, priority badges, and status chips are consistent across all modules
- Micro-interactions — subtle animations on key state changes (task moved, invoice sent, goal hit)
- Meaningful empty states — every empty list has a helpful illustration and a single primary CTA
- Keyboard shortcuts — power users can navigate and create without touching the mouse

# 9\. Pricing Model

The pricing structure is not yet finalized. The following is a recommended starting point based on competitor benchmarks (Plutio $19/mo, Bonsai $25/mo, ClickUp $7/mo) and the goal of being accessibly priced for freelancers who currently use free tools.

|     |     |     |     |
| --- | --- | --- | --- |
| **Plan** | **Suggested Price** | **Includes** | **Seats** |
| **Free** | **$0 / mo** | 3 projects, 5 clients, 5 invoices/mo, unlimited tasks, all core modules | 1 seat |
| **Pro** | **~$9 / mo** | Unlimited everything, custom invoice branding, PDF export, priority support | Up to 3 seats |
| **Agency** | **~$19 / mo** | Everything in Pro + team analytics, client portal (v2), onboarding call | Up to 10 seats |

Open decision: Should the Free tier show a IMergix watermark on exported invoice PDFs? This is a common conversion lever — worth deciding before launch.

# 10\. Success Metrics

|     |     |
| --- | --- |
| **Activation rate** | % of signups who create ≥1 project and ≥1 task within 24 hours — target 60% |
| **Week-2 retention** | % of users still active 14 days after signup — target 35% |
| **Module breadth** | Average modules used per active user per week — target ≥3 of 5 |
| **Invoice completion** | % of created invoices reaching Sent or Paid status — target 70% |
| **Goal creation rate** | % of users who create at least 1 goal — target 50% |
| **Free → Paid conversion** | % of free users who upgrade within 30 days — target 8–12% |
| **NPS** | Net Promoter Score after first 100 users — target >40 |

# 11\. Risks & Mitigations

|     |     |     |     |
| --- | --- | --- | --- |
| **Feature** | **Description** | **Priority** | **Version** |
| **Scope creep** | MVP grows beyond 5 modules and misses Q3 deadline | **P0** | Strict v1/v2 gate — all new ideas go to v2 backlog by default |
| **Pricing not decided** | Delayed pricing decision slows launch page and billing setup | **P1** | Finalize pricing before Phase 4 (MVP polish) begins |
| **Auth complexity** | Django JWT without Supabase Auth adds session management work | **P1** | Use Simple JWT from day one; document auth flow clearly |
| **Invoice edge cases** | Tax, currency, and locale formatting bugs in invoice builder | **P1** | Lock v1 to single workspace currency; no locale switching in v1 |
| **Low adoption** | Crowded market; users do not switch from familiar free tools | **P0** | Build-in-public strategy; founder personal brand; Product Hunt launch |
| **Celery overhead** | Redis + Celery add infra complexity early in development | **P2** | Use Upstash Redis (serverless, pay-per-use); consider django-q as lighter fallback |

# 12\. Development Roadmap

|     |     |     |     |
| --- | --- | --- | --- |
| **Phase** | **Name** | **Deliverables** | **Timeline** |
| **1** | **Foundation** | Repo, CI/CD, design system, DB schema, Django auth, workspace creation flow | Month 1–2 |
| **2** | **Core Modules** | Goals, Tasks, Projects, Clients — all CRUD complete with working UI | Month 2–4 |
| **3** | **Invoicing** | Invoice builder, PDF export, expense log, finance dashboard | Month 4–5 |
| **4** | **MVP Polish** | Dashboard, notifications, onboarding, empty states, mobile-responsive pass | Month 5–6 |
| **5** | **Launch Prep** | Beta testing, bug fixes, pricing page, billing integration, Product Hunt assets | Month 6 |
| **6** | **v2 Features** | Client portal, Contract Management (client + external party + team onboarding, e-signature), Slack/GitHub integrations, AI features, time tracking, n8n workflows | Month 7+ |

# 13\. Open Questions

- Pricing: finalize Free / Pro / Agency price points and seat limits before Phase 4 begins
- Invoice PDF: show IMergix watermark on free tier exports? (standard conversion lever)
- Onboarding: guided wizard (step-by-step) or open canvas with empty-state prompts?
- Launch strategy: invite-only beta first, or fully public from day one?
- Email provider: Resend recommended — confirm before Phase 1 ends
- Hosting region: any compliance or latency preference? (EU, US, APAC)
- Contract Management (v2): use in-house lightweight e-signature (draw/type in browser) or integrate a third-party provider (DocuSign, HelloSign)? Third-party is legally stronger in certain regions — decide before v2 design begins

IMergix — Built for freelancers, by a freelancer. • PRD v0.1, March 2026
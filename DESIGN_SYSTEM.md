# iMergix Design System — Complete Reference
> Reverse-engineered from source code. Light-mode focus. All values are exact as found in code.
> Coverage: Global tokens + Goals, Invoices, and Kanban modules.

---

## 1. Overview & Design Philosophy

iMergix is a **clean, professional SaaS workspace** for freelancers. The visual personality is **minimal-modern with soft depth** — predominantly neutral zinc/slate greys with strong per-module accent colors (teal for Goals, indigo for Invoices, zinc-primary for Kanban). Surfaces are white/near-white with subtle borders rather than heavy backgrounds. Cards lift on hover with a micro-translate rather than color fills. Corner radii range from `rounded-lg` (16px at base) on standard elements to `rounded-2xl`/`rounded-3xl` on larger containers and bento cards. The system is intentionally understated — personality is delivered via accent color chips and colored progress rings, not loud backgrounds. Motion is restrained: 150–300ms color transitions; only progress rings and drag-drop have longer durations (700ms). Typography uses a single humanist sans-serif (Plus Jakarta Sans) across all weights.

---

## 2. Design Tokens

### 2.1 Color Tokens — Light Mode (`:root`)

| Token | CSS Variable | Hex | Usage |
|-------|-------------|-----|-------|
| Background | `--background` | `#fafafa` | Page-level background (zinc-50) |
| Foreground | `--foreground` | `#09090b` | Primary text (zinc-950) |
| Primary | `--primary` | `#18181b` | Primary button fill, kanban accent (zinc-900) |
| Primary Foreground | `--primary-foreground` | `#fafafa` | Text on primary fill |
| Secondary | `--secondary` | `#f4f4f5` | Secondary surface (zinc-100) |
| Secondary Foreground | `--secondary-foreground` | `#18181b` | Text on secondary surface |
| CTA | `--cta` | `#2563eb` | Landing page CTA button fill (blue-600) |
| CTA Hover | `--cta-hover` | `#1d4ed8` | CTA hover state (blue-700) |
| Muted | `--muted` | `#f4f4f5` | Muted surface (same as secondary, zinc-100) |
| Muted Foreground | `--muted-foreground` | `#71717a` | Secondary/subdued text (zinc-500) |
| Destructive | `--destructive` | `#ef4444` | Error state, delete buttons (red-500) |
| Destructive Foreground | `--destructive-foreground` | `#fafafa` | Text on destructive fill |
| Border | `--border` | `#e4e4e7` | All borders (zinc-200) |
| Ring | `--ring` | `#18181b` | Focus ring color |
| Card | `--card` | `#ffffff` | Card/panel surface |
| Card Foreground | `--card-foreground` | `#09090b` | Text on card |
| Card Hover | `--card-hover` | `#f4f4f5` | Card hover background |
| Accent Soft | `--accent-soft` | `#eff6ff` | Subtle blue glow on hero (blue-50) |

### 2.2 Color Tokens — Dark Mode (`.dark`)

| Token | CSS Variable | Hex |
|-------|-------------|-----|
| Background | `--background` | `#09090b` |
| Foreground | `--foreground` | `#fafafa` |
| Primary | `--primary` | `#fafafa` |
| Primary Foreground | `--primary-foreground` | `#18181b` |
| Secondary | `--secondary` | `#27272a` |
| Secondary Foreground | `--secondary-foreground` | `#fafafa` |
| CTA | `--cta` | `#3b82f6` |
| CTA Hover | `--cta-hover` | `#60a5fa` |
| Muted | `--muted` | `#27272a` |
| Muted Foreground | `--muted-foreground` | `#a1a1aa` |
| Destructive | `--destructive` | `#7f1d1d` |
| Destructive Foreground | `--destructive-foreground` | `#fafafa` |
| Border | `--border` | `#27272a` |
| Ring | `--ring` | `#d4d4d8` |
| Card | `--card` | `#18181b` |
| Card Foreground | `--card-foreground` | `#fafafa` |
| Card Hover | `--card-hover` | `#27272a` |
| Accent Soft | `--accent-soft` | `#1e3a5f` |

### 2.3 Tailwind 4 Theme Bridge

Declared via `@theme inline {}` in `globals.css`. Each `--color-*` maps to the corresponding CSS variable so Tailwind utility classes work:

```css
--color-background: var(--background)
--color-foreground: var(--foreground)
--color-primary: var(--primary)
--color-primary-foreground: var(--primary-foreground)
--color-secondary: var(--secondary)
--color-secondary-foreground: var(--secondary-foreground)
--color-cta: var(--cta)
--color-cta-hover: var(--cta-hover)
--color-muted: var(--muted)
--color-muted-foreground: var(--muted-foreground)
--color-destructive: var(--destructive)
--color-destructive-foreground: var(--destructive-foreground)
--color-border: var(--border)
--color-ring: var(--ring)
--color-card: var(--card)
--color-card-foreground: var(--card-foreground)
--color-card-hover: var(--card-hover)
--color-accent-soft: var(--accent-soft)
--font-sans: var(--font-plus-jakarta)
```

### 2.4 Module Accent Palettes (Hard-coded, not CSS variables)

These are module-specific accent colors baked into Tailwind class strings:

#### Goals Module — Teal
| Color | Tailwind Class | Hex equiv. | Usage |
|-------|---------------|-----------|-------|
| Primary fill | `bg-teal-600` | `#0d9488` | CTA buttons, "Define goal" button |
| Primary hover | `bg-teal-700` | `#0f766e` | Button hover state |
| Accent text | `text-teal-600 dark:text-teal-400` | light:`#0d9488` dark:`#2dd4bf` | Links, percentages, accents |
| Accent surface | `bg-teal-500/10` | rgba(20,184,166,0.10) | Badge backgrounds, icon containers |
| Accent hover | `hover:bg-teal-500/15` | rgba(20,184,166,0.15) | Surface hover |
| Header icon | `bg-teal-500/10 text-teal-600 dark:text-teal-400` | — | Module header icon container |
| Progress ring | `stroke-teal-500` | `#14b8a6` | SVG progress ring fill |
| Progress bar | `bg-teal-500` | `#14b8a6` | Linear progress bar fill |
| Spinner | `border-border border-t-teal-500` | — | Loading spinner accent |

#### Invoices Module — Indigo
| Color | Tailwind Class | Hex equiv. | Usage |
|-------|---------------|-----------|-------|
| Primary fill | `bg-indigo-600` | `#4f46e5` | CTA buttons |
| Primary hover | `bg-indigo-700` | `#4338ca` | Button hover |
| Accent text | `text-indigo-600 dark:text-indigo-400` | light:`#4f46e5` dark:`#818cf8` | Links, accents |
| Accent surface | `bg-indigo-500/10` | rgba(99,102,241,0.10) | Icon containers |
| Header icon | `bg-indigo-500/10 text-indigo-600 dark:text-indigo-400` | — | Module header icon |
| Active tab | `bg-card text-foreground shadow-sm ring-1 ring-indigo-500/20` | — | Selected tab in toolbar |
| CSS variable | `--invoices-accent: #4f46e5` | — | From `invoices.css` |
| Table accent | `--invoices-table-header: #5ba4c7` | `#5ba4c7` | Invoice PDF table header |

#### Kanban Module — Primary (neutral by default)
| Token | Tailwind Class | Usage |
|-------|---------------|-------|
| Button primary | `bg-primary text-primary-foreground hover:bg-primary/90` | Save, Add column |
| Scope active | `border-primary/40 bg-primary/5 ring-2 ring-primary/10` | Scope navigator open |
| Scope active hover | `border-primary/30 bg-primary/5 hover:border-primary/40` | Scope navigator active |
| Accent text | `text-primary` | Checkmarks, selected items |
| Accent surface | `bg-primary/10` | Scope item selected bg |
| Accent surface hover | `hover:bg-primary/15` | — |
| Header icon | `bg-primary/10 text-primary` | Board header icon |
| Spinner | `border-border border-t-primary` | Loading spinner |
| Scope ring | `--kanban-scope-ring: color-mix(in oklab, var(--primary) 20%, transparent)` | CSS variable in kanban.css |

### 2.5 Semantic Status / State Colors (shared pattern)

All status colors follow the **10% opacity surface + colored text** pattern:

#### Goal Status Badges
| Status | Light className |
|--------|----------------|
| Draft | `bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400` |
| Active | `bg-teal-500/10 text-teal-700 dark:text-teal-400` |
| On Hold | `bg-amber-500/10 text-amber-700 dark:text-amber-400` |
| Completed | `bg-emerald-500/10 text-emerald-700 dark:text-emerald-400` |
| Archived | `bg-slate-500/10 text-slate-600 dark:text-slate-400` |

#### Invoice Status Badges
| Status | className |
|--------|----------|
| Draft | `bg-slate-500/10 text-slate-600 dark:text-slate-400` |
| Sent | `bg-blue-500/10 text-blue-700 dark:text-blue-400` |
| Paid | `bg-emerald-500/10 text-emerald-700 dark:text-emerald-400` |
| Overdue | `bg-red-500/10 text-red-700 dark:text-red-400` |

#### Priority Badges (Goals & Kanban)
| Priority | className |
|----------|----------|
| Low | `bg-emerald-500/10 text-emerald-700 dark:text-emerald-400` |
| Medium | `bg-amber-500/10 text-amber-700 dark:text-amber-400` |
| High | `bg-red-500/10 text-red-700 dark:text-red-400` |

Kanban also adds border to priority badges:
- Low: `border-emerald-500/20`
- Medium: `border-amber-500/20`
- High: `border-red-500/20`

#### Finance Summary Cards (Invoices)
| Card | Border | Background | Value text |
|------|--------|-----------|-----------|
| Total Invoiced | `border-indigo-500/20` | `bg-indigo-500/5` | `text-indigo-600 dark:text-indigo-400` |
| Total Received | `border-emerald-500/20` | `bg-emerald-500/5` | `text-emerald-600 dark:text-emerald-400` |
| Outstanding | `border-amber-500/20` | `bg-amber-500/5` | `text-amber-600 dark:text-amber-400` |
| Overdue | `border-red-500/20` | `bg-red-500/5` | `text-red-600 dark:text-red-400` |

#### Expense Category Badges
| Category | className |
|----------|----------|
| Equipment | `bg-violet-500/10 text-violet-700 dark:text-violet-400` |
| Software | `bg-blue-500/10 text-blue-700 dark:text-blue-400` |
| Travel | `bg-amber-500/10 text-amber-700 dark:text-amber-400` |
| Marketing | `bg-pink-500/10 text-pink-700 dark:text-pink-400` |
| Other | `bg-slate-500/10 text-slate-600 dark:text-slate-400` |

### 2.6 Goal Color Picker Palette (8 colors)

Used for goal card accents, progress rings, and tile gradients:

| # | Hex | Color name |
|---|-----|-----------|
| 1 | `#0D9488` | Teal-600 |
| 2 | `#2563EB` | Blue-600 |
| 3 | `#7C3AED` | Violet-600 |
| 4 | `#DB2777` | Pink-600 |
| 5 | `#EA580C` | Orange-600 |
| 6 | `#0891B2` | Cyan-600 |
| 7 | `#16A34A` | Green-600 |
| 8 | `#CA8A04` | Yellow-600 |

### 2.7 Kanban Column Color Palette (9 colors)

| Hex | Approx Tailwind |
|-----|----------------|
| `#6366f1` | indigo-500 |
| `#8b5cf6` | violet-500 |
| `#ec4899` | pink-500 |
| `#f97316` | orange-500 |
| `#eab308` | yellow-500 |
| `#22c55e` | green-500 |
| `#14b8a6` | teal-400 |
| `#3b82f6` | blue-500 |
| `#64748b` | slate-500 |

---

## 3. Typography

### 3.1 Font Family

- **Primary:** `Plus Jakarta Sans` (Google Fonts, `next/font/google`)
- **Weights loaded:** 300, 400, 500, 600, 700
- **CSS variable:** `--font-plus-jakarta`
- **Fallback:** `system-ui, sans-serif`
- **Applied to body:** `font-family: var(--font-plus-jakarta), system-ui, sans-serif`
- **HTML class:** `antialiased` (font-smoothing: antialiased)
- **Loading method:** Next.js `next/font/google` (self-hosted at build time, no external request at runtime)

### 3.2 Type Scale

All values from actual class usage in source:

| Usage | Classes | Computed size | Line height |
|-------|---------|--------------|------------|
| Invoice PDF title | `text-4xl font-black tracking-tight` | 36px | 40px (2.25rem) |
| Hero h1 (lg) | `text-[3.25rem] font-bold leading-tight tracking-tight` | 52px | tight (1.25) |
| Hero h1 (md) | `text-5xl font-bold leading-tight tracking-tight` | 48px | tight |
| Hero h1 (default) | `text-4xl font-bold leading-tight tracking-tight` | 36px | tight |
| Pricing price | `text-4xl font-bold` | 36px | default (1.5) |
| Page header h1 (primary) | `text-2xl font-bold tracking-tight text-foreground` | 24px | 32px |
| Page header h1 (secondary) | `text-2xl font-semibold tracking-tight text-foreground` | 24px | 32px |
| Goal detail h2 | `text-xl font-bold text-foreground` | 20px | 28px |
| Drawer / panel h2 | `text-xl font-semibold tracking-tight text-foreground` | 20px | 28px |
| Kanban board h1 | `text-xl font-semibold text-foreground` | 20px | 28px |
| Modal title | `text-lg font-semibold text-foreground` | 18px | 28px |
| Pricing plan name | `text-lg font-semibold text-foreground` | 18px | 28px |
| Body / card text primary | `text-base font-semibold text-foreground` | 16px | 24px |
| Hero body | `text-lg leading-relaxed text-secondary` | 18px | relaxed (1.625) |
| Section heading (detail panel) | `text-sm font-semibold text-foreground` | 14px | 20px |
| Body text | `text-sm text-muted-foreground` | 14px | 20px |
| Label / nav links | `text-sm font-medium` | 14px | 20px |
| Subtitle / description | `text-sm leading-relaxed text-muted-foreground` | 14px | relaxed |
| Table header | `text-xs font-semibold uppercase tracking-wider text-muted-foreground` | 12px | 16px |
| Section eyebrow | `text-sm font-semibold uppercase tracking-wider text-cta` | 14px | 20px |
| Badge / pill | `text-xs font-semibold` | 12px | 16px |
| Kanban column task count | `text-[10px] font-semibold` | 10px | default |
| Scope section header | `text-[10px] font-semibold uppercase tracking-widest text-muted-foreground` | 10px | — |
| Micro labels / overlines | `text-[10px] font-medium` | 10px | — |
| Meta info (dates, counts) | `text-[11px]` | 11px | — |
| Check-in progress % | `text-xs font-semibold tabular-nums text-teal-600 dark:text-teal-400` | 12px | — |
| Large stat numbers | `text-2xl font-bold tabular-nums` | 24px | — |
| Finance card amounts | `text-2xl font-bold tabular-nums tracking-tight` | 24px | — |
| Goal progress % (tile) | `text-[10px]` in tile, `text-xs font-semibold tabular-nums` in label | varies | — |

**Key typography rules extracted:**
- `tracking-tight` on all headings h1–h3
- `leading-snug` on card titles
- `leading-relaxed` on body/description copy
- `tabular-nums` on all numeric data (amounts, percentages, counts)
- `line-clamp-2` on description previews in cards

---

## 4. Spacing & Layout

### 4.1 Base Spacing

Tailwind v4 default scale: **4px base unit**.
Common spacing tokens used: `0.5` (2px), `1` (4px), `1.5` (6px), `2` (8px), `2.5` (10px), `3` (12px), `3.5` (14px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px), `12` (48px), `14` (56px), `16` (64px), `20` (80px), `24` (96px), `28` (112px), `32` (128px).

### 4.2 Container & Breakpoints

| Context | Max-width | Padding |
|---------|----------|---------|
| Landing page sections | `max-w-6xl` (72rem / 1152px) | `px-6` (24px each side) |
| Navbar | `max-w-6xl mx-auto` | `px-5 py-3` (20px / 12px) |
| Invoice preview document | `max-w-[660px]` | `px-8 py-6` (32px / 24px) |
| Kanban scope dropdown | `w-[min(100vw-2rem,320px)]` | — |
| Goal detail side panel | `max-w-md` (28rem / 448px) | `p-5` (20px) |
| Drawer shell | `sm:w-[min(100%,640px)] md:w-[min(100%,720px)] lg:w-[min(100%,62vw)] lg:max-w-[960px]` | `px-8 py-6` (32px / 24px) |

Standard breakpoints (Tailwind defaults): `sm` = 640px, `md` = 768px, `lg` = 1024px, `xl` = 1280px, `2xl` = 1536px.

### 4.3 Grid Patterns

| Usage | Classes |
|-------|---------|
| Hero | `grid items-center gap-12 lg:grid-cols-2 lg:gap-16` |
| Pricing cards | `grid gap-6 lg:grid-cols-3` |
| Goals stats | `grid grid-cols-2 gap-3 sm:grid-cols-4` |
| Goals bento mosaic (active) | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-[minmax(180px,auto)] gap-4` |
| Goals grid (standard) | `grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4` |
| Finance summary cards | `grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4` |
| Mood selector | `grid grid-cols-4 gap-2` |

### 4.4 Flex Patterns

| Usage | Classes |
|-------|---------|
| Standard toolbar | `flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between` |
| Kanban board (horizontal scroll) | `flex flex-1 gap-4 overflow-x-auto pb-4 pt-1` |
| Page layout (Goals module) | `flex min-h-0 flex-1 flex-col gap-5` |
| Body | `min-h-full flex flex-col` |

### 4.5 Page-Level Padding Conventions

- Module pages: inherit from page wrapper, no explicit padding (module fills available space)
- Hero section: `pt-32 pb-20 md:pt-40 md:pb-28` 
- Landing sections: `py-20 md:py-28`
- Detail panel scroll area: `p-5` (20px), `space-y-6`
- Card content: `p-6 pt-0` (24px top removed)
- Card content (kanban task): `p-3.5` (14px)
- Kanban column inner: `px-2 py-2` (8px/8px)
- Drawer header: `px-8 py-6` (32px/24px)
- Drawer footer: `px-8 py-5` (32px/20px)
- Table cells: `px-4 py-3` (16px/12px)

---

## 5. Component Specifications

### 5.1 Button Variants

#### Primary CTA (Goals) — rounded-full shape
```
inline-flex cursor-pointer items-center gap-2
rounded-full
bg-teal-600 text-white
px-4 py-2
text-sm font-semibold
transition-colors duration-200
hover:bg-teal-700
```
Height: ~36px (py-2 × 2 + text-sm line-height = 8+8+20=36px)

#### Primary CTA (Goals) — empty state, large
```
cursor-pointer
rounded-full
bg-teal-600 text-white
px-8 py-3.5
text-sm font-semibold
shadow-lg shadow-teal-600/20
transition-all
hover:bg-teal-700 hover:shadow-teal-600/30
```

#### Primary CTA (Invoices) — rounded-full
```
inline-flex cursor-pointer items-center gap-2
rounded-full
bg-indigo-600 text-white
px-4 py-2
text-sm font-semibold
transition-colors duration-200
hover:bg-indigo-700
```

#### Primary CTA (Landing)
```
inline-flex cursor-pointer items-center justify-center gap-2
rounded-lg
bg-cta text-white
px-6 py-3
text-base font-semibold
transition-colors duration-200
hover:bg-cta-hover
```
Height: ~48px

#### Navbar CTA (Landing)
```
hidden cursor-pointer
rounded-lg
bg-cta text-white
px-4 py-2
text-sm font-semibold
transition-colors duration-200
hover:bg-cta-hover
sm:inline-block
```

#### Secondary / Outline button (Landing)
```
inline-flex cursor-pointer items-center justify-center
rounded-lg
border border-border
text-foreground
px-6 py-3
text-base font-semibold
transition-colors duration-200
hover:bg-card-hover
```

#### Secondary small button (icon + text)
```
inline-flex cursor-pointer items-center gap-2
rounded-lg
border border-border/60
px-3 py-2
text-sm font-medium
transition-colors
hover:bg-muted/50
```

#### Ghost / text button
```
cursor-pointer
rounded-lg
px-4 py-2
text-sm font-medium
text-muted-foreground
transition-colors
hover:bg-muted hover:text-foreground
```

#### Primary (Kanban) — rounded-lg shape
```
inline-flex items-center gap-1.5
rounded-lg
bg-primary text-primary-foreground
px-3 py-2
text-xs font-medium
transition-colors duration-200
hover:bg-primary/90
```

#### Destructive text button (inline)
```
inline-flex cursor-pointer items-center gap-1.5
rounded-lg
px-3 py-2
text-sm font-medium
text-red-600
transition-colors
hover:bg-red-500/10
```

#### Reset / utility border button (Kanban)
```
inline-flex items-center gap-1.5
rounded-lg
border border-border
px-3 py-2
text-xs font-medium
text-muted-foreground
transition-colors duration-200
hover:bg-muted hover:text-foreground
```

#### Icon-only button (close)
```
cursor-pointer
rounded-full
p-2.5
text-muted-foreground
transition-colors
hover:bg-muted hover:text-foreground
```
Icon: `h-5 w-5` (Drawer close) or `h-4 w-4` (panel close)

#### Icon-only button (panel close, small)
```
cursor-pointer
rounded-md
p-1.5
text-muted-foreground
transition-colors
hover:bg-muted
```

#### Filter pill / clear button
```
inline-flex cursor-pointer items-center gap-1
rounded-full
px-3 py-1
text-xs font-medium
text-muted-foreground
transition-colors
hover:bg-muted hover:text-foreground
```

#### Theme toggle button
```
flex h-9 w-9 cursor-pointer items-center justify-center
rounded-lg
border border-border
text-secondary
transition-colors duration-200
hover:bg-card-hover hover:text-foreground
focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta
```
Icon: `h-4 w-4` (Sun / Moon)

---

### 5.2 Badge Component

**Base classes (CVA base):**
```
inline-flex items-center
rounded-full
border
px-2.5 py-0.5
text-xs font-semibold
transition-colors
focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
```

**Variants:**
- `default`: `border-transparent bg-primary text-primary-foreground hover:bg-primary/80`
- `secondary`: `border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80`
- `destructive`: `border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80`
- `outline`: `text-foreground` (border is visible via the base `border` class with inherited color)

**Status badge (inline, not CVA):**
```
rounded-full px-2.5 py-0.5 text-xs font-semibold [status className]
```
(used in InvoiceRow directly, same visual output as Badge component)

**Task count badge (in KanbanColumn):**
```
Badge variant="secondary"
h-5 min-w-5 justify-center px-1.5 text-[10px] font-semibold
```

---

### 5.3 Card Component

**Base:**
```
rounded-lg border bg-card text-card-foreground shadow-sm
```

**Sub-components:**
- `CardHeader`: `flex flex-col space-y-1.5 p-6`
- `CardTitle`: `text-2xl font-semibold leading-none tracking-tight`
- `CardDescription`: `text-sm text-muted-foreground`
- `CardContent`: `p-6 pt-0`
- `CardFooter`: `flex items-center p-6 pt-0`

**Kanban task card (interactive override):**
```
group relative cursor-pointer
border border-border/60 bg-card shadow-sm
transition-all duration-200
hover:-translate-y-0.5 hover:border-border hover:shadow-md
active:scale-[0.99]
```
CardContent override: `p-3.5`

**Goal card (interactive override):**
```
group relative cursor-pointer overflow-hidden
border border-border/60 bg-card shadow-sm
transition-all duration-200
hover:-translate-y-0.5 hover:border-border hover:shadow-md
```
CardContent override: `p-5 pl-6` (left-offset for color bar)
Color bar: `absolute left-0 top-0 h-full w-1` with `style={{ backgroundColor: goal.color }}`

**Goal tile card (bento mosaic):**
```
group relative flex cursor-pointer flex-col overflow-hidden
rounded-2xl border text-left
transition-all duration-300
```
Sizes:
- default: `min-h-[180px] p-5 border-border/50 hover:border-teal-500/30 hover:shadow-md`
- featured: `min-h-[220px] p-6`
- hero: `min-h-[300px] p-8`
Selected state: `border-teal-500/50 shadow-lg ring-2 ring-teal-500/20`
Background: `linear-gradient(145deg, ${goal.color}12 0%, transparent 55%), var(--card)`

**Stat card (Goals header):**
```
rounded-xl border border-border/60 bg-card p-4
```

**Finance summary card (Invoices):**
```
rounded-2xl border p-5 transition-colors duration-200
[border-{color}-500/20 bg-{color}-500/5]
```
Icon container: `flex h-8 w-8 items-center justify-center rounded-lg bg-background/60`
Value: `mt-2 text-2xl font-bold tabular-nums tracking-tight [text-{color}-600]`

---

### 5.4 Input Fields

**Standard text input:**
```
w-full rounded-lg border border-border bg-card
py-2 pl-9 pr-4 (with leading icon) or px-3 py-2
text-sm text-foreground
placeholder:text-muted-foreground
focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20
```

**Search input (rounded pill, Goals toolbar):**
```
w-full rounded-full border border-border/60 bg-muted/30
py-2 pl-9 pr-4
text-sm
focus:border-teal-500/40 focus:outline-none focus:ring-2 focus:ring-teal-500/10
sm:w-44
```

**Search input (Invoices toolbar):**
Same as Goals but with `focus:border-indigo-500/40 focus:ring-indigo-500/10 sm:w-48`

**Textarea:**
```
w-full resize-none rounded-lg border border-border bg-background
px-3 py-2 rows-3
text-sm text-foreground
placeholder:text-muted-foreground
focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20
```

**Inline editable title (modal):**
```
w-full border-0 bg-transparent
text-2xl font-semibold tracking-tight text-foreground
outline-none
placeholder:text-muted-foreground (implied)
```

**Inline search (kanban scope dropdown):**
```
w-full bg-transparent text-xs outline-none
placeholder:text-muted-foreground
```
Container: `flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5`

**Comment input (kanban modal):**
```
min-w-0 flex-1 bg-transparent text-sm outline-none
placeholder:text-muted-foreground
```
Container: `flex gap-2 rounded-xl border border-border bg-muted/10 p-2`

**Range slider:**
```
h-2 w-full cursor-pointer appearance-none rounded-full bg-muted accent-teal-500
```

---

### 5.5 Segmented Tabs / View Toggles

**Container (rounded-full, Goals/Invoices):**
```
flex rounded-full border border-border/60 bg-muted/30 p-0.5
```

**Container (rounded-lg, Goals header icons):**
```
flex rounded-lg border border-border bg-muted/30 p-0.5
```

**Active tab (text tabs):**
```
cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium
bg-card text-foreground shadow-sm
transition-all duration-200
```

**Inactive tab:**
```
cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium
text-muted-foreground hover:text-foreground
transition-all duration-200
```

**Active tab (Invoices, with ring accent):**
```
bg-card text-foreground shadow-sm ring-1 ring-indigo-500/20
```

**Icon-only toggle button (active):**
```
cursor-pointer rounded-md p-2
bg-card text-foreground shadow-sm
transition-colors duration-200
```

**Icon-only toggle button (inactive):**
```
cursor-pointer rounded-md p-2
text-muted-foreground hover:text-foreground
transition-colors duration-200
```

---

### 5.6 Modal (Centered)

**Backdrop:**
```
fixed inset-0 bg-black/50 backdrop-blur-sm
```

**Modal container:**
```
relative w-full max-w-md
rounded-2xl border border-border bg-card
p-6
shadow-xl
```

**Close button (top-right):**
```
absolute right-4 top-4
cursor-pointer rounded-md p-1
text-muted-foreground
transition-colors
hover:bg-muted hover:text-foreground
```
Icon: `h-4 w-4` (X)

**Form spacing:** `mt-5 space-y-5`

**Mood selector grid:** `grid grid-cols-4 gap-2`

**Mood button (default):**
```
cursor-pointer rounded-lg border p-2 text-center
border-border
transition-all duration-200
hover:border-teal-500/50 hover:scale-[1.02]
```

**Mood button (selected):**
```
border-teal-500 bg-teal-500/10 ring-2 ring-teal-500/20
```

**Action button row:** `flex justify-end gap-2`

---

### 5.7 Drawer Shell (Side Panel — Full)

**Backdrop:**
```
fixed inset-0 z-40 bg-black/40 backdrop-blur-sm
transition-opacity duration-300
```

**Panel:**
```
fixed inset-y-0 right-0 z-50
flex w-full flex-col
border-l border-border/80 bg-card shadow-2xl
animate-in slide-in-from-right duration-300
sm:w-[min(100%,640px)]
md:w-[min(100%,720px)]
lg:w-[min(100%,62vw)] lg:max-w-[960px]
```

**Color accent bar (top):**
```
h-1 shrink-0
style={{ backgroundColor: accentColor }}
```

**Header:**
```
flex shrink-0 items-start justify-between gap-4
border-b border-border/60
px-8 py-6
```
Title: `text-xl font-semibold tracking-tight text-foreground`
Subtitle: `mt-1 text-sm leading-relaxed text-muted-foreground`

**Footer:**
```
shrink-0 border-t border-border/60 bg-muted/20
px-8 py-5
```

---

### 5.8 Goal Detail Side Panel (Compact)

**Backdrop:**
```
fixed inset-0 z-40 bg-black/30 backdrop-blur-sm
```

**Panel:**
```
fixed right-0 top-0 z-50
flex h-full w-full max-w-md flex-col
border-l border-border bg-card shadow-2xl
transition-transform duration-300
```
Open: `translate-x-0` | Closed: `translate-x-full`

**Color accent bar (top):**
```
h-1.5 shrink-0
style={{ backgroundColor: goal.color }}
```

**Header:**
```
flex items-start justify-between gap-3
border-b border-border
p-5
```

**Motivation quote block:**
```
rounded-xl border border-teal-500/20 bg-teal-500/5 p-4
```
Overline: `text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400 mb-1`
Quote: `text-sm italic text-foreground`

**Footer:**
```
flex items-center justify-between
border-t border-border
p-4
```

---

### 5.9 Kanban Task Detail Modal (Centered, animated)

**Backdrop:**
```
fixed inset-0 bg-black/40 backdrop-blur-[4px]
```

**Modal:**
```
relative mb-10 w-full max-w-[580px]
overflow-hidden rounded-2xl
border border-border/60 bg-background
shadow-[0_24px_80px_-12px_rgba(0,0,0,0.35)]
transition-all duration-200 ease-out
max-h-[88vh] overflow-y-auto
```
Entrance animation: `translate-y-3 scale-[0.97] opacity-0` → `translate-y-0 scale-100 opacity-100`

**Header gradient:**
```
px-6 pb-6 pt-5
background: linear-gradient(180deg, ${column.color}10 0%, transparent 100%)
```

**Column label chip:**
```
inline-flex items-center gap-1.5 rounded-full px-2.5 py-1
text-[11px] font-semibold
style={{ backgroundColor: `${column.color}18`, color: column.color }}
```
Dot: `h-1.5 w-1.5 rounded-full`

**Section dividers:** `border-t border-border/50 px-6 py-5`

**Activity item:**
```
flex gap-3 rounded-lg bg-muted/20 px-3 py-2.5
```

---

### 5.10 Invoice List Table

**Wrapper:**
```
overflow-hidden rounded-2xl border border-border/60
```

**Scroll container:** `overflow-x-auto`

**Table:** `w-full min-w-[680px] text-sm`

**Header row:**
```
border-b border-border/60 bg-muted/30
```
Header cell: `px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground`

**Body row:**
```
group border-b border-border/40 transition-colors last:border-0
hover:bg-muted/30
```
Body cell: `px-4 py-3`

**Actions cell:** `opacity-0 transition-opacity group-hover:opacity-100`

**Quick action button:**
```
flex h-7 w-7 cursor-pointer items-center justify-center
rounded-lg transition-colors
```
Default: `bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground`
Success: `bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400`

**Overflow menu:**
```
absolute right-0 top-full z-50 mt-1 w-44
overflow-hidden rounded-xl border border-border/60 bg-card shadow-xl
```
Menu item: `flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition-colors text-foreground hover:bg-muted/50`
Danger item: `text-red-600 hover:bg-red-500/10 dark:text-red-400`
Divider: `my-1 h-px bg-border/60`

---

### 5.11 Invoice PDF Preview Document

Rendered as a standalone white document:

**Container:** `mx-auto w-full max-w-[660px] overflow-hidden rounded-xl bg-white text-zinc-900 shadow-xl`
Font: explicitly `font-family: 'Plus Jakarta Sans', sans-serif`

**Header band:** `flex items-start justify-between gap-4 border-b-4 border-zinc-900 px-8 py-6`

**Title:** `text-4xl font-black tracking-tight text-zinc-900`

**Table header:** `bg-[#5BA4C7] text-white`, cells: `px-3 py-2.5 text-left font-semibold`

**Table rows:** even = `bg-white`, odd = `bg-zinc-50`

**Table cell:** `border-b border-zinc-100 px-3 py-2.5 text-zinc-600`

**Total row:** `rounded-md bg-[#5BA4C7] px-3 py-2` — label: `text-sm font-bold text-white`, value: `text-sm font-black tabular-nums text-white`

**Terms box:** `rounded-lg bg-[#5BA4C7]/10 p-4`

---

### 5.12 Kanban Column

**Container:**
```
flex h-full max-h-[calc(100vh-11rem)] w-[300px] shrink-0 flex-col
rounded-2xl border border-border/60 bg-muted/20 shadow-sm backdrop-blur-sm
transition-shadow hover:shadow-md
```

**Color accent bar (top):**
```
h-1 rounded-t-2xl
style={{ backgroundColor: column.color }}
```

**Column header:**
```
flex items-center justify-between gap-2
px-3 py-3 border-b border-border/40
```
Title: `truncate text-sm font-semibold text-foreground`

**Task list scroll area:** `flex-1 space-y-2 overflow-y-auto px-2 py-2`

**Column footer:**
```
border-t border-border/40 p-2
```
Add task button: `flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground`

**"Add column" ghost column:**
```
flex h-[420px] w-[300px] shrink-0 flex-col items-center justify-center gap-2
rounded-2xl border border-dashed border-border/70 bg-muted/20
text-muted-foreground
transition-all duration-200
hover:border-border hover:bg-muted/40 hover:text-foreground
```

---

### 5.13 Add Task Form (Kanban)

**Container:**
```
rounded-xl border-2 bg-card p-2.5 shadow-md
transition-all duration-200
```
Focused state: `border-violet-500/70 shadow-violet-500/10`
Default state: `border-border`

---

### 5.14 Progress Ring (SVG)

**Sizes:**
| Context | size | strokeWidth |
|---------|------|------------|
| Default | 56px | 4px |
| Goal card (standard) | 52px | 4px (default) |
| Tile default | 48px | 4px |
| Tile featured | 56px | 4px |
| Tile hero | 72px | 5px |
| Detail panel | 48px | — |

**Track circle:** stroke = `currentColor`, className = `text-muted/30`

**Progress circle:** stroke = `color` prop (goal's hex color), strokeLinecap = `round`, className = `transition-all duration-700 ease-out`

**Label:** `absolute text-xs font-semibold tabular-nums text-foreground`

**Default color:** `#0D9488` (teal-600)

---

### 5.15 Loading Spinner

```
h-8 w-8 animate-spin rounded-full border-2
```
Goals: `border-border border-t-teal-500`
Invoices: `border-border border-t-indigo-500`
Kanban: `border-border border-t-primary`

---

### 5.16 Progress Bar (linear)

**Container:**
```
h-1.5 flex-1 overflow-hidden rounded-full bg-muted
```

**Fill:**
```
h-full rounded-full bg-teal-500
transition-all duration-700
style={{ width: `${progress}%` }}
```

**Milestone strip (in tile card):**
```
h-1.5 flex-1 rounded-full transition-colors duration-500
completed: bg-teal-500
pending: bg-muted/80
```
Container: `flex gap-1`

---

### 5.17 Scope Navigator (Kanban)

**Trigger button (closed, no active scope):**
```
flex w-full min-w-[200px] max-w-full items-center gap-2.5
rounded-xl border px-3 py-2
text-left
border-border bg-background hover:bg-muted/40
transition-all duration-200
sm:w-auto sm:min-w-[260px]
```

**Trigger (open):** `border-primary/40 bg-primary/5 ring-2 ring-primary/10`

**Trigger (active, not open):** `border-primary/30 bg-primary/5 hover:border-primary/40`

**Icon container inside trigger:** `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground`

**Dropdown:**
```
absolute left-0 top-[calc(100%+8px)] z-40
w-[min(100vw-2rem,320px)]
overflow-hidden rounded-xl border border-border bg-card shadow-xl
```

**Scope row (default):**
```
flex w-full items-center gap-2 rounded-lg px-2 py-2
text-left
transition-colors duration-150
hover:bg-muted
```

**Scope row (selected):** `bg-primary/10 hover:bg-primary/15`

**Row icon:** `flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted/80 text-muted-foreground`

**Check icon (selected):** `h-3.5 w-3.5 shrink-0 text-primary`

---

### 5.18 Navbar (Landing Page)

**Position:** `fixed top-4 left-4 right-4 z-50 mx-auto max-w-6xl`

**Container:**
```
flex items-center justify-between
rounded-2xl border border-border bg-card/80
px-5 py-3
backdrop-blur-md
```

**Logo icon:** `flex h-8 w-8 items-center justify-center rounded-lg bg-cta text-sm font-bold text-white`

**Logo text:** `text-lg font-bold tracking-tight text-foreground hover:text-cta transition-colors duration-200`

**Nav link:** `text-sm font-medium text-secondary transition-colors duration-200 hover:text-foreground`

**Separator:** `h-4 w-px bg-border` (aria-hidden)

---

### 5.19 Empty States

**Standard:**
```
flex flex-col items-center justify-center
rounded-2xl border border-dashed border-border/60
py-16 text-center
```

**Goals module (gradient):**
```
flex flex-1 flex-col items-center justify-center
rounded-3xl border border-dashed border-border/80
bg-gradient-to-br from-teal-500/[0.04] via-transparent to-violet-500/[0.03]
px-8 py-24 text-center
```
Icon container: `rounded-2xl bg-teal-500/10 p-5 text-teal-600 dark:text-teal-400`
Icon: `h-12 w-12` (Compass)
Heading: `mt-8 text-2xl font-semibold tracking-tight text-foreground`
Body: `mt-3 max-w-md text-sm leading-relaxed text-muted-foreground`

**Kanban "no results" empty:**
```
flex flex-1 items-center justify-center
rounded-2xl border border-dashed border-border/60
py-16 text-center
```

---

### 5.20 Add Goal / Bento Placeholder Tile

```
group flex min-h-[180px] cursor-pointer flex-col items-center justify-center gap-3
rounded-2xl border-2 border-dashed border-border/60
bg-muted/10
transition-all duration-300
hover:border-teal-500/40 hover:bg-teal-500/[0.04]
```
Icon container: `rounded-full bg-muted/60 p-3 transition-colors group-hover:bg-teal-500/15`
Icon: `h-5 w-5 text-muted-foreground transition-colors group-hover:text-teal-600`
Label: `text-sm font-medium text-muted-foreground transition-colors group-hover:text-teal-700 dark:group-hover:text-teal-400`

---

### 5.21 Section Label / Eyebrow

Landing: `text-sm font-semibold uppercase tracking-wider text-cta`
Detail panel (overline): `text-xs font-semibold uppercase tracking-wide text-teal-600 dark:text-teal-400`
Kanban modal description overline: `text-[10px] font-semibold uppercase tracking-widest text-muted-foreground`
Scope section header: `px-2 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80`

---

## 6. Layout Patterns

### 6.1 Landing Page

```
html h-full antialiased
└── body min-h-full flex flex-col
    └── div flex flex-1 flex-col
        ├── Navbar (fixed top-4 left-4 right-4 z-50)
        ├── main
        │   ├── Hero (pt-32 pb-20 md:pt-40 md:pb-28)
        │   │   └── .mx-auto max-w-6xl px-6
        │   │       └── grid lg:grid-cols-2 gap-12
        │   ├── Problem (py-20 md:py-28) [.max-w-6xl px-6]
        │   ├── Features (py-20 md:py-28)
        │   ├── Differentiators (py-20 md:py-28)
        │   ├── Pricing (py-20 md:py-28)
        │   └── CTA
        └── Footer
```

### 6.2 Goals Module

```
div flex min-h-0 flex-1 flex-col gap-5
├── GoalsToolbar
│   └── flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between
│       ├── title + subtitle (left)
│       └── search + tabs + CTA button (right)
└── GoalsVisionBoard (fills remaining space)
    └── GoalsFocusBoard
        └── div min-h-0 flex-1 overflow-y-auto pb-8
            └── grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4
                ├── GoalTileCard × n (hero = lg:col-span-2 lg:row-span-2)
                └── Add goal tile
```

### 6.3 Invoices Module

```
div flex min-h-0 flex-1 flex-col
├── InvoicesToolbar
│   ├── header (h1 + search + New Invoice button)
│   └── tabs (Invoices / Expenses) + status filter
├── FinanceSummaryCards (grid 4-col)
└── InvoiceListTable
    └── overflow-hidden rounded-2xl border
        └── table w-full min-w-[680px]
```

### 6.4 Kanban Module

```
div flex h-full flex-col
├── header (icon + title + Reset + Add column)
├── BoardScopeNavigator (flex-wrap items-center gap-2 mb-4)
└── scroll container (flex flex-1 gap-4 overflow-x-auto pb-4 pt-1)
    ├── KanbanColumn × n (w-[300px] shrink-0)
    └── "Add column" ghost tile (w-[300px] shrink-0)
```

### 6.5 Invoice Detail Page

```
div flex min-h-0 flex-1 flex-col
├── header (border-b border-border/60 px-4 py-4 md:px-6)
│   ├── back button (mb-3)
│   └── h1 + subtitle + action buttons
└── content (flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto p-4 md:p-6 lg:flex-row)
    ├── InvoicePreview (flex-1, max-w-[660px])
    └── InvoiceActivityTimeline (w-full lg:w-72 lg:shrink-0)
```

---

## 7. States & Interactions

### 7.1 Hover States

| Element | Default → Hover |
|---------|----------------|
| Standard cards | `shadow-sm border-border/60` → `-translate-y-0.5 shadow-md border-border` (200ms all) |
| Goal tile cards | `border-border/50` → `border-teal-500/30 shadow-md` (300ms all) |
| Selected tile | `border-teal-500/50 shadow-lg ring-2 ring-teal-500/20` (no hover change) |
| Table rows | transparent → `bg-muted/30` (transition-colors) |
| Ghost "add" tile | `border-border/60 bg-muted/10` → `border-teal-500/40 bg-teal-500/[0.04]` (300ms all) |
| Navigation links | `text-secondary/muted-foreground` → `text-foreground` (200ms) |
| Icon buttons (muted) | `text-muted-foreground` → `bg-muted text-foreground` |
| Teal CTA buttons | `bg-teal-600` → `bg-teal-700` |
| Indigo CTA buttons | `bg-indigo-600` → `bg-indigo-700` |
| cta buttons | `bg-cta` → `bg-cta-hover` |
| Kanban column | `shadow-sm` → `shadow-md` |

### 7.2 Focus States

- **All focusable elements:** `focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2` (from Badge CVA base)
- **Search inputs:** `focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20` (Goals) or `focus:border-indigo-500/40 focus:ring-indigo-500/10` (Invoices)
- **Theme toggle:** `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta`
- **Mood selector:** selected → `ring-2 ring-teal-500/20`

### 7.3 Disabled States

- Buttons: `disabled:cursor-not-allowed disabled:opacity-50`
- Comment send: text-only `text-muted-foreground` when empty, `bg-primary text-white` when active

### 7.4 Active / Pressed States

- Kanban task card: `active:scale-[0.99]`
- Mood buttons: `hover:scale-[1.02]`

### 7.5 Selected States

- Tab (active): `bg-card text-foreground shadow-sm`
- Scope row (selected): `bg-primary/10`
- Goal tile (selected): `ring-2 ring-teal-500/20 border-teal-500/50`
- Status button (active): `[STATUS_STYLES[s].className]`
- Filter pill (active): `bg-teal-500/10 text-teal-700 dark:text-teal-400`

### 7.6 Transition Summary Rules

| Type | Duration | Easing |
|------|---------|--------|
| Colors / backgrounds | `duration-200` | (default: ease) |
| All (cards, complex) | `duration-200` | ease |
| Drawer slide-in | `duration-300` | (Tailwind animate-in) |
| Goal tile card | `duration-300` | ease |
| Progress ring stroke | `duration-700` | `ease-out` |
| Progress bar fill | `duration-700` | ease |
| Milestone pills | `duration-500` | ease |
| Modal entrance (kanban) | `duration-200` | `ease-out` |
| Panel open (goal detail) | `duration-300` | ease |
| Reduce-motion override | `0.01ms !important` | — |

### 7.7 Cursor Rules

Every interactive element must have `cursor-pointer`. Non-interactive containers omit this. The kanban board drag area uses `cursor-grab` / `cursor-grabbing`.

---

## 8. Elevation & Depth

### 8.1 Shadow Scale

| Level | Class | Usage |
|-------|-------|-------|
| 1 | `shadow-sm` | Cards, kanban columns (default) |
| 2 | `shadow-md` | Cards on hover, kanban column hover |
| 3 | `shadow-lg` | Highlighted pricing card, CTA buttons |
| 4 | `shadow-xl` | Modals (check-in), dropdowns (overflow menus, scope navigator) |
| 5 | `shadow-2xl` | Side drawers / panels (goal detail, drawer shell) |
| Custom | `shadow-[0_24px_80px_-12px_rgba(0,0,0,0.35)]` | Kanban task detail modal |
| Colored | `shadow-lg shadow-teal-600/20` / `hover:shadow-teal-600/30` | Goals empty state CTA |

### 8.2 Z-Index Scale

| Value | Usage |
|-------|-------|
| `z-40` | Backdrop overlays, scope dropdown |
| `z-50` | Fixed navbar, drawers, modals, dropdowns |

### 8.3 Backdrop Blur

| Class | Usage |
|-------|-------|
| `backdrop-blur-sm` | Modal/drawer backdrops |
| `backdrop-blur-md` | Navbar (`bg-card/80`) |
| `backdrop-blur-[4px]` | Kanban task modal backdrop |
| `backdrop-blur-sm` | Kanban column (subtle frosted glass) |

---

## 9. Border Radius Scale

| Token | px equiv | Usage |
|-------|---------|-------|
| `rounded-full` | 9999px | Badges, pills, search inputs, status chips, avatar, circular icon buttons |
| `rounded-3xl` | 24px | Goals empty state bento wrapper |
| `rounded-2xl` | 16px | Kanban column, goal tile card, finance card, invoice table wrapper, check-in modal, kanban task modal, scope dropdown, bento placeholder tile |
| `rounded-xl` | 12px | Goals stat card, navbar, scope trigger button, invoice preview, pricing card, overflow menu |
| `rounded-lg` | 8px | Standard card, buttons, inputs, most modal containers, progress ring, add-task form |
| `rounded-md` | 6px | Icon buttons (small), close button, scope row icon |
| `rounded` | 4px | Very small misc elements |

---

## 10. Iconography

**Library:** [Lucide React](https://lucide.dev/) (version ^1.17.0)

**Size conventions:**
| Size | Class | Usage |
|------|-------|-------|
| 20px | `h-5 w-5` | Header/module icons, modal h/w icons |
| 16px | `h-4 w-4` | Standard inline icons, section icons |
| 14px | `h-3.5 w-3.5` | Meta bar icons, quick action icons |
| 12px | `h-3 w-3` | Micro inline icons (milestones, check-ins) |

**Stroke width:** Lucide default (2px). No overrides found.

**Color rules:**
- Default: inherits `text-muted-foreground` (71717a)
- Active/accent: module-specific accent color class
- Destructive: `text-destructive` or `text-red-600`
- On colored background: `text-white`

**Inline SVG icons** (no dependency): Used only in invoice PDF (`PhoneIcon`, `MailIcon`, `PinIcon`) — `h-3 w-3 shrink-0 text-zinc-400`, stroke: 2, viewBox 24×24.

---

## 11. Inconsistencies Found

> These are deviations from the system. Do NOT copy these — flag them when re-implementing.

### I1. `text-secondary` misuse on text elements
**Files:** `components/landing/hero.tsx`, `components/landing/navbar.tsx`, `components/landing/pricing.tsx`
**Problem:** `text-secondary` resolves to `color: #f4f4f5` in light mode (near-white). Used as body copy color (`.text-secondary` on `<p>` elements), this produces near-invisible text on white backgrounds.
**Should be:** `text-muted-foreground` (`#71717a`) for subdued text, or `text-secondary-foreground` (`#18181b`) for secondary-surface text.
**Do not replicate.** Use `text-muted-foreground` for any subdued body copy.

### I2. `text-muted` misuse
**File:** `components/landing/hero.tsx` (line: `text-sm text-muted`)
**Problem:** `--color-muted` = `#f4f4f5` (a background surface color, not a text color). `text-muted` = near-invisible text on white.
**Should be:** `text-muted-foreground`.

### I3. Button shape inconsistency across modules
- Goals CTA: `rounded-full`
- Invoices CTA: `rounded-full`  
- Landing page CTA: `rounded-lg`
- Kanban add column: `rounded-lg`
- Goals header (view toggle): `rounded-md` tabs inside `rounded-lg` container
This is **intentional per-module theming** but creates a non-unified feel cross-app. When re-implementing in a single consistent system, choose one convention (recommend `rounded-lg` for landing-level CTAs, `rounded-full` for in-module toolbar actions).

### I4. Modal corner radius inconsistency
- CheckInModal: `rounded-2xl`
- GoalDetailPanel: `rounded-lg` (side panel uses `rounded-lg` at `border-l`)
- KanbanTaskDetailModal: `rounded-2xl`
Side panels don't typically have their own border-radius (they butt against the edge), so only the modal interior matters — these differ for similar hierarchy levels.

### I5. Header font size inconsistency
- `GoalsToolbar` page heading: `text-2xl font-semibold`
- `GoalsHeader` page heading: `text-2xl font-bold`
- `InvoicesToolbar` page heading: `text-2xl font-semibold`
- `KanbanBoard` heading: `text-xl font-semibold`
Same semantic level, different font-weight and size. Kanban is notably smaller.

### I6. Goal detail panel uses `text-xl font-bold` while drawer shell h2 uses `text-xl font-semibold`
Same visual hierarchy (panel title), different weight. Pick one; recommend `font-semibold`.

### I7. Goal tile card uses `rounded-2xl` while GoalCard uses `rounded-lg` (via Card primitive)
Both are card-level components at the same visual level but have different corner radii. GoalCard is used in grid/list view; GoalTileCard in bento mosaic.

### I8. Overlay opacity inconsistency
- DrawerShell backdrop: `bg-black/40`
- GoalDetailPanel backdrop: `bg-black/30`  
- CheckInModal backdrop: `bg-black/50`
- KanbanTaskModal backdrop: `bg-black/40`
No consistent rule for backdrop density. Consider standardizing to `bg-black/40`.

---

## 12. Migration Checklist

An ordered, actionable list for re-implementing this exact design system on a new project:

### Step 1: Fonts
1. Install Plus Jakarta Sans via Google Fonts or self-host: weights 300, 400, 500, 600, 700
2. Set as default `font-family` on `body`: `'Plus Jakarta Sans', system-ui, sans-serif`
3. Add `antialiased` class to `<html>`

### Step 2: CSS Custom Properties
Set these on `:root` exactly as in `globals.css`:
```css
:root {
  --background: #fafafa;
  --foreground: #09090b;
  --primary: #18181b;
  --primary-foreground: #fafafa;
  --secondary: #f4f4f5;
  --secondary-foreground: #18181b;
  --cta: #2563eb;
  --cta-hover: #1d4ed8;
  --muted: #f4f4f5;
  --muted-foreground: #71717a;
  --destructive: #ef4444;
  --destructive-foreground: #fafafa;
  --border: #e4e4e7;
  --ring: #18181b;
  --card: #ffffff;
  --card-foreground: #09090b;
  --card-hover: #f4f4f5;
  --accent-soft: #eff6ff;
}
.dark { /* ... see Section 2.2 */ }
```

### Step 3: Tailwind Config
3. If using Tailwind: map all CSS variables to Tailwind color tokens via `@theme inline` or `theme.extend.colors`.
4. Ensure `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-muted`, `text-primary`, `bg-primary`, `bg-cta`, `bg-cta-hover` all work as utilities.

### Step 4: Base Styles
5. Set `body { background: var(--background); color: var(--foreground); }`
6. Add `scroll-behavior: smooth` on `html`
7. Add `prefers-reduced-motion` reset block (see `globals.css` lines 71–83)

### Step 5: Dark Mode
8. Implement dark mode via `.dark` class on `<html>` (not `prefers-color-scheme` media query — this app uses localStorage + inline script for SSR)
9. Add the inline script to `<head>` for FOUC prevention:
```html
<script>(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme:dark)').matches))document.documentElement.classList.add('dark')}catch(e){}})()
</script>
```

### Step 6: Core Primitives
10. Build `Badge` component with CVA: `rounded-full border px-2.5 py-0.5 text-xs font-semibold` + 4 variants (see Section 5.2)
11. Build `Card` compound component: `rounded-lg border bg-card shadow-sm` + `CardHeader`, `CardContent`, `CardFooter`, `CardTitle`, `CardDescription` (see Section 5.3)
12. Build button variants (see Section 5.1): at minimum — primary teal (rounded-full), primary indigo (rounded-full), landing CTA (rounded-lg), ghost, destructive-text, icon-only

### Step 7: Status / Badge Color System
13. Implement the semantic status color helper (10% opacity surface + solid text, see Section 2.5) for Goal Status, Invoice Status, Priority — as a lookup object returning className strings

### Step 8: Module Themes
14. For Goals: register teal accent tokens
15. For Invoices: register indigo accent tokens + `#5ba4c7` table header color
16. For Kanban: map to primary neutral tokens

### Step 9: Layout Shell
17. Page wrapper: `min-h-full flex flex-col`
18. Container: `max-w-6xl mx-auto px-6`
19. Module layout: `flex min-h-0 flex-1 flex-col gap-5`

### Step 10: Components — by priority
20. Toolbar pattern: `flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`
21. Segmented tab control: `flex rounded-full border border-border/60 bg-muted/30 p-0.5` (see Section 5.5)
22. Search input with leading icon: `rounded-full border border-border/60 bg-muted/30 py-2 pl-9 pr-4 text-sm` (see Section 5.4)
23. Modal (centered): `rounded-2xl border border-border bg-card p-6 shadow-xl` with `bg-black/40 backdrop-blur-sm` backdrop (see Section 5.6)
24. Side panel / drawer: see Section 5.7
25. Table: see Section 5.10
26. Kanban column: `w-[300px] rounded-2xl border border-border/60 bg-muted/20` (see Section 5.12)
27. Progress ring (SVG): see Section 5.14
28. Progress bar (linear): see Section 5.15
29. Spinner: `h-8 w-8 animate-spin rounded-full border-2 border-border border-t-[accent]` (see Section 5.15)
30. Empty state: see Section 5.19

### Step 11: Motion
31. Apply `transition-colors duration-200` to all interactive color-changing elements
32. Apply `transition-all duration-200` to cards with hover lift (`hover:-translate-y-0.5`)
33. Apply `transition-all duration-300` to goal tile cards
34. Progress ring: `transition-all duration-700 ease-out` on the SVG stroke element

### Step 12: Typography
35. Verify all page-level h1 use `text-2xl font-semibold tracking-tight text-foreground` (or `font-bold`)
36. Section headings: `text-sm font-semibold text-foreground`
37. Body / helper text: `text-sm text-muted-foreground`
38. All numeric data: add `tabular-nums` class
39. Badge text: `text-xs font-semibold`
40. Micro labels: `text-[10px]` or `text-[11px]`

### Step 13: Accessibility
41. All clickable cards and buttons: `cursor-pointer`
42. Board drag area: `cursor-grab` / `cursor-grabbing`
43. `prefers-reduced-motion` media query must disable all transitions/animations
44. ARIA: modals need `role="dialog" aria-modal="true"`, keyboard Escape closes modals/drawers
45. Focus rings: ensure `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta` on interactive elements

---

*Last updated: auto-generated from codebase analysis on 2026-06-17. All values verified against source files.*

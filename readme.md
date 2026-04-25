# Users Dashboard

A production-quality Users Dashboard built with Next.js 14 App Router. Displays, searches, filters, and sorts 208 users from the [dummyjson.com](https://dummyjson.com/users) public API. Built to demonstrate senior-level frontend architecture — not just working code, but deliberate decisions.

**[Live Demo →](https://gabaapps-test-assignment.vercel.app/users)**

![Users Dashboard — grid view](public/screenshots/grid-view.png?v=2)

<details>
<summary>More screenshots</summary>

![User detail drawer](public/screenshots/drawer-open.png?v=2)

![Active filters — Female · Engineering · sorted by Age](public/screenshots/filters-active.png?v=2)

</details>

---

## Features

- **Grid / Table toggle** — responsive card grid (3 col desktop → 1 col mobile) with a compact table view
- **Debounced search** — 300ms debounce, calls `/users/search?q=` server-side, result count shown
- **Multi-filter** — gender (server-side via `/users/filter`) + department (client-side, see [Design Decisions](#design-decisions))
- **Sorting** — 5 fields × asc/desc, synced to URL, column-click in table view
- **Pagination** — page size 10/20/50, full page number navigation, URL-synced
- **User Detail Drawer** — 560px side panel (full-screen on mobile), 4 tabs: Profile, Work, Finance, Crypto
- **Stats Bar** — aggregate stats (total, gender split, top 3 departments, avg age) from all 208 users
- **Deep-linkable URL** — every state (search, filters, sort, page, open drawer) is a shareable URL
- **Prefetch on hover** — user detail cached before drawer opens (sub-100ms perceived open time)
- **Accessible** — keyboard navigation (Tab/Enter/Escape), ARIA roles, focus trap in drawer

---

## Tech Stack

| Technology | Why |
|---|---|
| **Next.js 14 App Router** | Server Components for initial HTML (fast FCP, SEO-ready). Client Components only where interactivity is needed. Route-level code splitting out of the box. Considered Vite + React — chose Next.js because the App Router's Suspense + streaming model fits paginated data well. |
| **TanStack Query v5** | Declarative async state with automatic stale-while-revalidate, background refetch, and prefetch API. Considered SWR — TanStack Query wins on cache key granularity and the ability to share cache across components without prop drilling. |
| **nuqs 1.19** | Type-safe URL query param state that integrates with Next.js App Router. Replaced `useState` + manual URL sync. Enables back/forward navigation between filter states and makes every view bookmarkable with zero extra code. |
| **Zustand** | Only for ephemeral UI state (drawer open/closed). No URL sync needed, no serialization — a 3-line store. Anything shareable lives in nuqs instead. |
| **Zod 3** | Runtime validation of every API response. Types are derived from schemas (`z.infer<typeof UserSchema>`) — the schema is the single source of truth, no manual type duplication. |
| **Radix UI + Tailwind** | Accessible primitives (Dialog, Tabs, Select, Avatar) with zero runtime CSS-in-JS overhead. Styled with Tailwind utility classes via `cn()` helper. |
| **Vitest + MSW** | Fast ESM-native test runner + network-level API mocking. MSW intercepts real `fetch` calls — tests exercise the actual HTTP layer without a running server. |
| **Playwright** | E2E coverage for critical paths: list load, search, filter, drawer open/close, deep links. |

---

## Architecture Overview

### FSD (Feature-Sliced Design)

```
src/
├── app/                    # Next.js routing only — no business logic
├── pages-layer/            # Page-level compositions (UsersPage)
├── widgets/                # Self-contained UI blocks (UserDrawer, StatsBar, UsersTable)
├── features/               # User interactions (search, filter, sort, paginate)
├── entities/user/          # Domain model: API, schemas, query hooks, UI primitives
└── shared/                 # Zero-dependency utils (httpClient, cn, formatters, logger)
```

**Import direction is strictly one-way:** `app → pages-layer → widgets → features → entities → shared`.
No circular dependencies, no same-layer cross-imports.

### Data Flow

```
URL params (nuqs)
      ↓
TanStack Query hook (useUsers)
      ↓
usersApi.getUsers({ search, filter, sort, page })
      ↓
httpClient.get('/users?...')
      ↓
zod.parse(response) → validated User[]
      ↓
Component renders typed data
```

### Hybrid Filter Strategy

The dummyjson API accepts only a single `key=value` filter per request — no compound queries. Solution:

1. **Search** → `/users/search?q=` (server-side, includes sort + pagination)
2. **Gender** → `/users/filter?key=gender&value=male` (server-side)
3. **Department** → client-side filter on a cached full dataset (208 users ≈ 50KB)

The full dataset is fetched once (`GET /users?limit=0`), cached for 10 minutes, and reused for both department filtering and stats computation. Fetching all 208 users is a deliberate trade-off — the API provides no other way to enumerate unique departments or compute aggregate stats.

---

## Getting Started

```bash
# Prerequisites: Node.js 20+, pnpm 9+

git clone https://github.com/pacientk/gabaapps_test_assignment
cd users-dashboard
pnpm install
pnpm dev
# Open http://localhost:3000
```

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check (`tsc --noEmit`) |
| `pnpm lint` | ESLint |
| `pnpm test` | Vitest unit + integration tests |
| `pnpm test:watch` | Vitest in watch mode |
| `pnpm test:e2e` | Playwright E2E tests |
| `pnpm test:all` | typecheck + lint + test |

---

## Design Decisions

**Why App Router over Pages Router?**
Suspense boundaries for granular loading states (skeleton per section, not full-page spinner). Streaming lets the Stats Bar load independently from the main list. Pages Router would require manual loading state coordination.

**Why TanStack Query over SWR?**
Cache key factory pattern (`userKeys.list(params)`) gives fine-grained control over which queries share cache. SWR's key is a string — harder to invalidate subsets. TanStack Query's `prefetchQuery` API is also cleaner for hover-prefetch.

**Why nuqs over Zustand for URL state?**
Zustand state resets on navigation. nuqs syncs to the URL, so back/forward works natively, links are shareable, and state survives refresh. The cost: slightly more verbose hook setup.

**Why hybrid filter strategy?**
The dummyjson API doesn't support compound filters. The alternative — fetching once per filter combination — would cause excessive round trips and cache misses. Fetching all 208 users once and filtering client-side is simpler, faster, and the payload is small.

**Why FSD over atomic design or feature folders?**
FSD enforces import direction at the folder level. In a feature-folders structure it's easy to accidentally create circular dependencies as the codebase grows. FSD makes the right structure the path of least resistance.

---

## Trade-offs & Known Limitations

- **E2E tests cover critical paths only** — full coverage was out of scope
- **Department filter is client-side** — API limitation, acceptable at 208 records, would not scale to millions
- **No dark mode** — out of scope per requirements
- **No Create/Edit/Delete** — dummyjson is a read-only fake API
- **No real-time updates** — WebSockets out of scope
- **Stats computed client-side** — no dedicated API endpoint; full dataset fetch is the only option with this API

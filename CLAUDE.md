# Users Dashboard — Master Context for Claude Code

## Project Summary
A production-quality Users Dashboard built with Next.js 14 App Router + TypeScript.
Data source: https://dummyjson.com/users (208 users total, paginated).
Goal: showcase senior-level frontend engineering — architecture, DX, UX, code quality.

---

## ⚠️ Non-Negotiable Constraints
- TypeScript `strict: true`, zero `any` allowed (use `unknown` + narrowing)
- All comments and commit messages in **English**
- FSD (Feature-Sliced Design) folder structure — mandatory
- Every public function/hook must have JSDoc
- No direct `fetch()` in components — only via TanStack Query hooks
- Every API response validated with **zod** schema at runtime
- No `console.log` left in production code (use logger util)
- `pnpm` only — no npm/yarn

---

## Stack (exact versions)
```
next: 14.2.10
react: 18.3.1
typescript: 5.5.4
@tanstack/react-query: 5.56.2
zustand: 4.5.5
zod: 3.23.8
tailwindcss: 3.4.10
@radix-ui/react-*: latest
lucide-react: 0.441.0
nuqs: 1.19.1          ← URL search params state manager
clsx: 2.1.1
tailwind-merge: 2.5.2
vitest: 2.1.1
@testing-library/react: 16.0.1
@playwright/test: 1.47.2
```

---

## FSD Structure
```
src/
├── app/                          # Next.js App Router (routing only)
│   ├── layout.tsx
│   ├── page.tsx                  # → redirects or renders /users
│   └── users/
│       ├── page.tsx              # Users list page
│       └── [id]/
│           └── page.tsx          # User detail page (for OG/SEO)
│
├── pages-layer/                  # Page-level compositions
│   └── users-page/
│       └── ui/UsersPage.tsx
│
├── widgets/                      # Self-contained UI blocks
│   ├── users-table/
│   │   └── ui/UsersTable.tsx
│   ├── users-filters/
│   │   └── ui/UsersFilters.tsx
│   └── user-drawer/
│       └── ui/UserDrawer.tsx
│
├── features/                     # User interactions
│   ├── search-users/
│   │   ├── model/useSearchUsers.ts
│   │   └── ui/SearchInput.tsx
│   ├── filter-users/
│   │   ├── model/useFilterUsers.ts
│   │   └── ui/FilterPanel.tsx
│   ├── sort-users/
│   │   ├── model/useSortUsers.ts
│   │   └── ui/SortControls.tsx
│   └── paginate-users/
│       ├── model/usePagination.ts
│       └── ui/Pagination.tsx
│
├── entities/
│   └── user/
│       ├── api/usersApi.ts       # All API calls
│       ├── model/
│       │   ├── types.ts          # TypeScript interfaces
│       │   ├── schemas.ts        # Zod schemas
│       │   └── useUsers.ts       # TanStack Query hooks
│       └── ui/
│           ├── UserCard.tsx
│           ├── UserAvatar.tsx
│           └── UserBadge.tsx
│
└── shared/
    ├── api/
    │   └── httpClient.ts         # Base fetch wrapper with error handling
    ├── config/
    │   └── env.ts                # Validated env vars (zod)
    ├── lib/
    │   ├── cn.ts                 # clsx + tailwind-merge
    │   ├── logger.ts             # Thin logger (console wrapper, disabled in prod)
    │   └── formatters.ts        # Date, phone, name formatters
    ├── ui/                       # Primitive UI components (shadcn-style)
    │   ├── Button/
    │   ├── Badge/
    │   ├── Input/
    │   ├── Skeleton/
    │   ├── Avatar/
    │   ├── Drawer/
    │   ├── Select/
    │   └── Tooltip/
    └── types/
        └── api.ts                # Generic ApiResponse<T>, PaginatedResponse<T>
```

---

## Architecture Rules

### API Layer
1. All API calls live in `src/entities/user/api/usersApi.ts`
2. Base HTTP client in `src/shared/api/httpClient.ts` — handles errors uniformly
3. Every response parsed through zod schema before returning
4. API errors throw typed `ApiError` class (code, message, status)

### State Management
- **Server state**: TanStack Query v5 — users list, user detail
- **URL state**: `nuqs` — search query, filters, sort, page (shareable URLs)
- **UI state**: Zustand — drawer open/closed, selected user id

### URL Schema
```
/users?search=john&gender=female&department=Engineering&sortBy=age&order=asc&page=2&userId=5
```

### Query Keys Convention
```typescript
const userKeys = {
  all: ['users'] as const,
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UsersParams) => [...userKeys.lists(), params] as const,
  detail: (id: number) => [...userKeys.all, 'detail', id] as const,
}
```

---

## Implementation Workflow
When implementing any feature:
1. Read the corresponding `specs/` file
2. Check existing types in `src/entities/user/model/types.ts`
3. Update zod schema if needed → TypeScript types derived from schema
4. Implement API function → React Query hook → UI component
5. Write tests (unit for hooks/utils, integration for components)
6. Run: `pnpm typecheck && pnpm lint && pnpm test`
7. Commit with: `feat(scope): description [AC-XXX..AC-XXX]`

---

## Definition of Done (per feature)
- [ ] TypeScript compiles: `pnpm typecheck` → 0 errors
- [ ] Linter clean: `pnpm lint` → 0 warnings
- [ ] Tests pass: `pnpm test` → all green
- [ ] Loading state implemented (skeleton)
- [ ] Error state implemented (with retry)
- [ ] Empty state implemented
- [ ] URL state synced (if applicable)
- [ ] Keyboard accessible (Tab, Enter, Escape)
- [ ] Works on mobile (375px) and desktop (1440px)

---

## Commands Reference
```bash
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm test         # vitest run
pnpm test:watch   # vitest watch
pnpm test:e2e     # playwright test
pnpm test:all     # typecheck + lint + test
```

---

## Commit Convention
```
feat(users-list): add virtualized table with pagination [AC-001..AC-005]
feat(search): debounced search with URL sync [AC-001..AC-004]
fix(filters): reset pagination on filter change
chore: add vitest config
test(user-card): add unit tests for UserCard component
```

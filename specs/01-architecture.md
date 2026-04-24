# 01 — Architecture

## Stack Rationale

### Next.js 14 App Router
- Server Components for initial HTML (SEO, fast FCP)
- Client Components only where interactivity is needed
- Route-level code splitting out of the box

### TanStack Query v5
- Declarative async state — no manual loading/error booleans
- Automatic background refetch, stale-while-revalidate
- Query key factory pattern for cache invalidation
- Prefetching on hover for instant drawer open

### nuqs (URL state)
- `useQueryState` / `useQueryStates` — sync state to URL params
- Replaces Zustand for all shareable state (search, filters, sort, page)
- Works seamlessly with Next.js App Router
- Enables back/forward navigation between filter states

### Zustand
- Only for purely ephemeral UI state (drawer open/closed, selected userId)
- No serialization needed, no URL sync needed

### Zod
- Runtime validation of API responses
- Types are **derived** from schemas: `type User = z.infer<typeof UserSchema>`
- Never define types manually — always derive from zod

### shadcn/ui + Radix UI primitives
- Accessible components by default (ARIA, keyboard)
- Unstyled primitives customized with Tailwind
- No runtime CSS-in-JS overhead

---

## Data Flow

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
Component renders with typed data
```

---

## API Integration Strategy

### Server-side params (used for all operations)
The dummyjson API supports:
- `limit` + `skip` → pagination
- `sortBy` + `order` → sorting (server-side)
- `/users/search?q=` → search
- `/users/filter?key=&value=` → single key/value filter

### Problem: API has no multi-filter support
`/users/filter` accepts only ONE key-value pair at a time.
`/users/search` searches across all text fields.

### Solution: Hybrid approach
1. **Search** → use `/users/search?q=` (server-side, supports limit/skip/sort)
2. **Gender filter** → use `/users/filter?key=gender&value=male` (server-side)
3. **Department filter** → client-side filter from full dataset (208 users)

**Why**: Gender filter via API is clean. Department requires fetching all unique
values anyway (no dedicated endpoint), so we fetch all 208 users once,
cache them, and filter client-side. 208 records = ~50KB, perfectly acceptable.

### Cache Strategy
```typescript
// Short-lived cache for filtered/searched results
staleTime: 1000 * 60 * 2   // 2 minutes

// Long-lived cache for full users list (used for department extraction)
staleTime: 1000 * 60 * 10  // 10 minutes

// User detail — cache for session
staleTime: 1000 * 60 * 30  // 30 minutes
```

---

## Component Architecture

### Server Components (no 'use client')
- `app/users/page.tsx` — renders page shell, Suspense boundary
- `app/users/[id]/page.tsx` — SSR user detail for OG tags

### Client Components ('use client')
- `UsersPage` — orchestrates all state via nuqs hooks
- `UsersTable` — renders user cards grid
- `UsersFilters` — search input + filter dropdowns
- `UserDrawer` — detail drawer with tabs
- `Pagination` — page controls

### Data Fetching Boundary
```tsx
// app/users/page.tsx (Server Component)
export default function Page() {
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersPage />  {/* Client Component */}
    </HydrationBoundary>
  )
}
```

---

## Error Handling Strategy

### API Errors
```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) { super(message) }
}
```

### Component Error States
- Network error → "Failed to load users" + Retry button
- Empty results → "No users match your filters" + Clear filters button
- Single user 404 → "User not found" in drawer

### Zod Validation Errors
- Log to logger.error (not console.log)
- Return `null` for invalid records (don't crash the whole list)
- Show warning badge if partial data

---

## Performance Targets
| Metric | Target |
|--------|--------|
| FCP | < 1.2s |
| LCP | < 2.0s |
| CLS | < 0.1 |
| Search response | < 300ms (debounced) |
| Drawer open | < 100ms (cached) |
| Bundle size (client) | < 150KB gzipped |

---

## Folder Import Rules (FSD)
```
app → pages-layer → widgets → features → entities → shared
```
- Lower layers CANNOT import from higher layers
- Same layer segments CANNOT import from each other
- `shared` has no dependencies on project code

# 02 — Features Specification

---

## F-001: Users List Grid
**Priority**: P0 | **Status**: ✅ implemented (commit `b1ea0c8`)

### Description
Responsive grid of user cards. Default view is card grid (3 cols desktop, 2 tablet, 1 mobile).
Toggle to table view available.

### Acceptance Criteria
- [x] AC-001: Renders 10 users per page by default
- [x] AC-002: Each card displays: avatar image, full name, role badge, job title, department, company name, email, city + country
- [x] AC-003: Skeleton cards (10) shown during initial fetch and page transitions
- [x] AC-004: Error state shows message + "Retry" button that re-triggers query
- [x] AC-005: Empty state shown when filters return 0 results (with illustration + "Clear filters" CTA)
- [x] AC-006: Card is keyboard-focusable and activatable with Enter/Space
- [x] AC-007: Grid/Table view toggle (icon buttons, top-right of list)
- [x] AC-008: Table view shows: avatar, name, age, gender, department, company, email, city

### Card Visual Spec
```
┌─────────────────────────────┐
│  [Avatar 48x48]  John Smith │
│                  [admin]    │
│  Sales Manager              │
│  Engineering · Acme Corp    │
│  john@example.com           │
│  Phoenix, United States     │
└─────────────────────────────┘
```

### Role Badge Colors
- `admin` → red/rose background
- `moderator` → amber/yellow background
- `user` → gray background

---

## F-002: Search
**Priority**: P0 | **Status**: ✅ implemented (commit `4476a85`)

### Description
Real-time search that calls `/users/search?q=` API endpoint.

### Acceptance Criteria
- [x] AC-001: Input debounced 300ms before triggering API call
- [x] AC-002: Minimum 1 character to trigger search (API handles empty as all users)
- [x] AC-003: Search query synced to URL: `?search=john` — shareable/bookmarkable
- [x] AC-004: Clear (×) button visible when input has value, clears input + URL param
- [x] AC-005: Page resets to 1 when search query changes
- [x] AC-006: Loading indicator (spinner in input) during API call
- [x] AC-007: Result count shown: "Showing 12 of 208 users"
- [x] AC-008: Search combines with sort (pass sortBy/order to search endpoint)

### Technical Notes
- API endpoint: `GET /users/search?q={query}&limit={limit}&skip={skip}&sortBy={field}&order={asc|desc}`
- Empty query → fallback to `GET /users` (all users)
- nuqs key: `search` (string, default: '')

---

## F-003: Filtering
**Priority**: P1 | **Status**: ✅ implemented (commit `4476a85`)

### Description
Filter panel with gender and department dropdowns. Filters are additive (AND logic).

### Acceptance Criteria
- [x] AC-001: Gender filter — 3 options: "All genders", "Male", "Female"
- [x] AC-002: Department filter — populated dynamically from full user dataset
- [x] AC-003: Active filters shown as removable chips/badges below filter bar
- [x] AC-004: "Clear all" button resets all filters + URL params + page to 1
- [x] AC-005: Filter state synced to URL: `?gender=female&department=Engineering`
- [x] AC-006: Filters combine with search and sort
- [x] AC-007: Department list sorted alphabetically, deduped
- [x] AC-008: Active filters count shown as badge on "Filters" button (mobile)

### Filter Logic
```
gender = 'female' → API: /users/filter?key=gender&value=female
department = 'Engineering' → client-side filter (post-fetch)
gender + department → API gender filter → client-side department filter
search + filters → API search?q= → client-side department filter
```

### nuqs Keys
- `gender`: `'male' | 'female' | ''` (default: '')
- `department`: `string` (default: '')

---

## F-004: Sorting
**Priority**: P1 | **Status**: ✅ implemented (commit `4476a85`)

### Description
Column/field-based sorting passed to API. Visual indicators in column headers (table view)
and sort dropdown (card view).

### Acceptance Criteria
- [x] AC-001: Sort fields available: firstName, lastName, age, email, company.name
- [x] AC-002: Order: ascending / descending toggle
- [x] AC-003: Sort state synced to URL: `?sortBy=age&order=desc`
- [x] AC-004: Table view: column header click toggles asc/desc, shows arrow icon
- [x] AC-005: Card view: "Sort by" dropdown + asc/desc toggle button
- [x] AC-006: Default sort: none (API default order)
- [x] AC-007: Sort combines with search, filters, and pagination

### Sort Fields Display Names
```typescript
const SORT_FIELDS = [
  { value: 'firstName', label: 'First Name' },
  { value: 'lastName', label: 'Last Name' },
  { value: 'age', label: 'Age' },
  { value: 'email', label: 'Email' },
  { value: 'company.name', label: 'Company' },
] as const
```

### nuqs Keys
- `sortBy`: string (default: '')
- `order`: `'asc' | 'desc'` (default: 'asc')

---

## F-005: Pagination
**Priority**: P0 | **Status**: ✅ implemented (commit `b1ea0c8`)

### Description
Page-based pagination. API supports limit + skip.

### Acceptance Criteria
- [x] AC-001: Default page size: 10 users per page
- [x] AC-002: Page size selector: 10 / 20 / 50 options
- [x] AC-003: Page number synced to URL: `?page=3`
- [x] AC-004: Previous/Next buttons disabled at first/last page
- [x] AC-005: Page number buttons shown: first, prev, [1][2][3]...[N], next, last
- [x] AC-006: Jump to first/last page buttons
- [x] AC-007: "Page X of Y" label shown
- [x] AC-008: Page resets to 1 when search/filter/sort changes

### Pagination Math
```typescript
const skip = (page - 1) * limit
const totalPages = Math.ceil(total / limit)
```

### nuqs Keys
- `page`: number (default: 1, min: 1)
- `limit`: `10 | 20 | 50` (default: 10)

---

## F-006: User Detail Drawer
**Priority**: P1 | **Status**: ✅ implemented (commit `302709c`)

### Description
Right-side drawer (560px wide on desktop, full-screen on mobile) that shows
complete user profile when a card is clicked. Prefetched on card hover.

### Acceptance Criteria
- [x] AC-001: Drawer opens on card click or Enter/Space keypress
- [x] AC-002: Drawer closes on: Escape key, backdrop click, X button
- [x] AC-003: Selected userId synced to URL: `?userId=5` (deep-linkable)
- [x] AC-004: Opening directly via URL (`?userId=5`) fetches and shows user
- [x] AC-005: Prefetch user detail query on card hover (mouseenter, 200ms delay)
- [x] AC-006: Loading skeleton shown while user detail fetches
- [x] AC-007: Focus trapped inside drawer when open (accessibility)
- [x] AC-008: Drawer has 4 tabs: Profile, Work, Finance, Crypto

### Tab Content

#### Profile Tab
- Avatar (large, 80px)
- Full name + username
- Age, gender, blood group
- Birth date (formatted: "May 30, 1996")
- Height (cm) + Weight (kg)
- Eye color + Hair (color, type)
- Email + Phone
- Address (full: street, city, state, country, postal code)
- University

#### Work Tab
- Company name + department + job title
- Work address (full)

#### Finance Tab
- Card type + Card number (masked: `**** **** **** 1815`)
- Card expiry
- Currency + IBAN (masked: first 4 + `****` + last 4)

#### Crypto Tab
- Coin name
- Wallet address (truncated: first 6 + `...` + last 4, copyable)
- Network

### nuqs Keys
- `userId`: number | null (default: null)

---

## F-007: Stats Bar
**Priority**: P2 | **Status**: ✅ implemented (commit `5106527`)

### Description
A stats summary bar at the top of the page. Computed from ALL 208 users
(uses the full-dataset query, not the paginated one).

### Acceptance Criteria
- [x] AC-001: Shows total user count (208)
- [x] AC-002: Shows male/female count and percentage
- [x] AC-003: Shows top 3 departments by user count with count
- [x] AC-004: Shows average age (rounded to 1 decimal)
- [x] AC-005: Skeleton shown while full dataset loads
- [x] AC-006: Stats are computed client-side from cached full dataset

### Stats Computation
```typescript
// Fetch all users once:
GET /users?limit=0  // returns all 208 users

// Derived stats:
totalUsers = users.length
maleCount = users.filter(u => u.gender === 'male').length
femaleCount = users.filter(u => u.gender === 'female').length
avgAge = users.reduce((sum, u) => sum + u.age, 0) / users.length
topDepartments = Object.entries(
  users.reduce((acc, u) => {
    acc[u.company.department] = (acc[u.company.department] || 0) + 1
    return acc
  }, {})
).sort(([,a],[,b]) => b - a).slice(0, 3)
```

---

## F-008: Responsive Layout
**Priority**: P0 | **Status**: 🔄 in-progress

### Breakpoints
- `sm`: 640px — 1 column cards, bottom sheet drawer
- `md`: 768px — 2 column cards
- `lg`: 1024px — 3 column cards, side drawer
- `xl`: 1280px — 3 column cards + wider drawer (560px)

### Mobile-specific behavior
- [x] Drawer → full-screen bottom sheet with drag-to-close (`207ebbd`)
- [x] Pagination → simplified: prev/next + "Page X of Y" (`sm:hidden` / `hidden sm:flex`)
- [x] Stats bar → 2×2 card grid on mobile (intentional deviation from "horizontal scroll")
- [ ] Filter panel → collapsed behind "Filters" button with active-filter badge

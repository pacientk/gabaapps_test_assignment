# 05 — Testing Strategy

## Philosophy
Test behavior, not implementation. Tests should break when UX breaks, not when refactoring internals.

## Test Stack
- **Vitest** — unit + integration tests (fast, ESM-native)
- **@testing-library/react** — component tests (user-centric)
- **@testing-library/user-event** — realistic user interactions
- **msw v2** — API mocking at network level (no fetch mocks)
- **Playwright** — E2E tests (critical paths only)

---

## Test Files Location (co-located)

```
src/
├── entities/user/
│   ├── api/
│   │   ├── usersApi.ts
│   │   └── usersApi.test.ts        ← API function unit tests
│   ├── model/
│   │   ├── schemas.ts
│   │   ├── schemas.test.ts         ← Zod schema tests
│   │   └── useUsers.test.ts        ← Query hook tests
│   └── ui/
│       ├── UserCard.tsx
│       └── UserCard.test.tsx       ← Component tests
├── features/
│   └── search-users/
│       └── ui/
│           ├── SearchInput.tsx
│           └── SearchInput.test.tsx
└── shared/
    └── lib/
        ├── formatters.ts
        └── formatters.test.ts      ← Pure function unit tests

tests/
└── e2e/
    ├── users-list.spec.ts
    ├── search-filter.spec.ts
    └── user-drawer.spec.ts
```

---

## MSW Setup

```typescript
// src/shared/testing/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { mockUsers, mockUser } from './fixtures'

export const handlers = [
  http.get('https://dummyjson.com/users', ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const skip = Number(url.searchParams.get('skip') ?? 0)
    return HttpResponse.json({
      users: mockUsers.slice(skip, skip + limit),
      total: mockUsers.length,
      skip,
      limit,
    })
  }),

  http.get('https://dummyjson.com/users/:id', ({ params }) => {
    const user = mockUsers.find(u => u.id === Number(params.id))
    if (!user) return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    return HttpResponse.json(user)
  }),

  http.get('https://dummyjson.com/users/search', ({ request }) => {
    const q = new URL(request.url).searchParams.get('q') ?? ''
    const filtered = mockUsers.filter(u =>
      `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q.toLowerCase())
    )
    return HttpResponse.json({ users: filtered, total: filtered.length, skip: 0, limit: filtered.length })
  }),
]
```

---

## Test Fixtures

```typescript
// src/shared/testing/mocks/fixtures.ts
// Minimal valid User objects that satisfy the Zod schema
export const mockUser: User = {
  id: 1,
  firstName: 'Emily',
  lastName: 'Johnson',
  maidenName: 'Smith',
  age: 28,
  gender: 'female',
  email: 'emily.johnson@x.dummyjson.com',
  phone: '+81 965-431-3024',
  username: 'emilys',
  birthDate: '1996-5-30',
  image: 'https://dummyjson.com/icon/emilys/128',
  bloodGroup: 'O-',
  height: 193.24,
  weight: 63.16,
  eyeColor: 'Green',
  hair: { color: 'Brown', type: 'Curly' },
  ip: '42.48.100.32',
  address: {
    address: '626 Main Street',
    city: 'Phoenix',
    state: 'Mississippi',
    stateCode: 'MS',
    postalCode: '29112',
    coordinates: { lat: -77.16213, lng: -92.084824 },
    country: 'United States',
  },
  macAddress: '47:fa:41:18:ec:eb',
  university: 'University of Wisconsin--Madison',
  bank: {
    cardExpire: '03/26',
    cardNumber: '9289760655481815',
    cardType: 'Elo',
    currency: 'CNY',
    iban: 'YPUXISOBI7TTHPK2BR3HAIXL',
  },
  company: {
    department: 'Engineering',
    name: 'Dooley, Kozey and Cronin',
    title: 'Sales Manager',
    address: {
      address: '263 Tenth Street',
      city: 'San Francisco',
      state: 'Wisconsin',
      stateCode: 'WI',
      postalCode: '37657',
      coordinates: { lat: 71.814525, lng: -161.150263 },
      country: 'United States',
    },
  },
  ein: '977-175',
  ssn: '900-590-289',
  userAgent: 'Mozilla/5.0',
  crypto: {
    coin: 'Bitcoin',
    wallet: '0xb9fc2fe63b2a6c003f1c324c3bfa53259162181a',
    network: 'Ethereum (ERC20)',
  },
  role: 'admin',
}

export const mockUsers: User[] = Array.from({ length: 30 }, (_, i) => ({
  ...mockUser,
  id: i + 1,
  firstName: `User${i + 1}`,
  lastName: `Test`,
  email: `user${i + 1}@test.com`,
  gender: i % 2 === 0 ? 'female' : 'male',
  company: {
    ...mockUser.company,
    department: ['Engineering', 'Marketing', 'Sales', 'HR'][i % 4],
  },
}))
```

---

## Unit Test Specs

### `schemas.test.ts`
```typescript
describe('UserSchema', () => {
  it('parses valid user object', () => {})
  it('throws on missing required fields', () => {})
  it('throws on invalid gender value', () => {})
  it('throws on invalid role value', () => {})
  it('throws on non-URL image field', () => {})
})
```

### `formatters.test.ts`
```typescript
describe('formatCardNumber', () => {
  it('masks first 12 digits: **** **** **** 1815', () => {})
  it('handles short numbers gracefully', () => {})
})

describe('formatBirthDate', () => {
  it('formats "1996-5-30" as "May 30, 1996"', () => {})
})

describe('formatHeight', () => {
  it('returns "193 cm"', () => {})
})

describe('truncateWallet', () => {
  it('returns "0xb9fc...181a"', () => {})
})
```

### `UserCard.test.tsx`
```typescript
describe('UserCard', () => {
  it('renders user name, email, department', () => {})
  it('renders correct role badge for admin', () => {})
  it('renders correct role badge for moderator', () => {})
  it('calls onClick with userId when clicked', () => {})
  it('calls onClick when Enter key pressed', () => {})
  it('applies selected styles when isSelected=true', () => {})
})
```

### `SearchInput.test.tsx`
```typescript
describe('SearchInput', () => {
  it('renders search icon', () => {})
  it('calls onChange after 300ms debounce', async () => {
    vi.useFakeTimers()
    // type, advance timers, assert
  })
  it('does NOT call onChange before 300ms', async () => {})
  it('shows clear button when value is non-empty', () => {})
  it('calls onChange with empty string when clear clicked', () => {})
  it('shows spinner when isLoading=true', () => {})
})
```

### `useUsers.test.ts`
```typescript
describe('useUsers', () => {
  it('fetches users list with default params', async () => {})
  it('calls search endpoint when search param provided', async () => {})
  it('calls filter endpoint when gender filter set', async () => {})
  it('applies pagination: skip = (page-1) * limit', async () => {})
  it('returns error state when API fails', async () => {})
})
```

---

## E2E Test Specs

### `users-list.spec.ts`
```typescript
test('loads and displays users on initial visit', async ({ page }) => {
  await page.goto('/users')
  await expect(page.getByTestId('user-card')).toHaveCount(10)
})

test('shows skeleton during loading', async ({ page }) => {
  // intercept + delay
  await expect(page.getByTestId('skeleton-card')).toBeVisible()
})

test('paginates to page 2', async ({ page }) => {
  await page.goto('/users')
  await page.getByRole('button', { name: 'Next page' }).click()
  await expect(page).toHaveURL(/page=2/)
})
```

### `search-filter.spec.ts`
```typescript
test('searches users and updates URL', async ({ page }) => {
  await page.goto('/users')
  await page.getByPlaceholder('Search users...').fill('Emily')
  await expect(page).toHaveURL(/search=Emily/)
  await expect(page.getByTestId('result-count')).toContainText('of 208')
})

test('filters by gender', async ({ page }) => {
  await page.getByRole('combobox', { name: 'Gender' }).selectOption('female')
  await expect(page).toHaveURL(/gender=female/)
})

test('clears all filters', async ({ page }) => {
  await page.goto('/users?search=john&gender=male')
  await page.getByRole('button', { name: 'Clear all' }).click()
  await expect(page).toHaveURL('/users')
})
```

### `user-drawer.spec.ts`
```typescript
test('opens drawer on card click', async ({ page }) => {
  await page.goto('/users')
  await page.getByTestId('user-card').first().click()
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page).toHaveURL(/userId=\d+/)
})

test('closes drawer on Escape key', async ({ page }) => {
  await page.goto('/users?userId=1')
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).not.toBeVisible()
})

test('deep link opens drawer directly', async ({ page }) => {
  await page.goto('/users?userId=1')
  await expect(page.getByRole('dialog')).toBeVisible()
  await expect(page.getByText('Emily Johnson')).toBeVisible()
})
```

---

## Coverage Targets
| Layer | Target |
|-------|--------|
| `shared/lib/*` | 100% |
| `entities/user/model/schemas` | 100% |
| `entities/user/api` | 80% |
| `entities/user/ui` | 70% |
| `features/*/ui` | 70% |
| E2E critical paths | 100% |

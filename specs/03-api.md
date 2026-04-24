# 03 — API Contracts & Types

## Base URL
```
https://dummyjson.com
```

---

## Zod Schemas (source of truth — derive all types from these)

```typescript
// src/entities/user/model/schemas.ts

import { z } from 'zod'

// ─── Sub-schemas ────────────────────────────────────────────────────

export const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
})

export const AddressSchema = z.object({
  address: z.string(),
  city: z.string(),
  state: z.string(),
  stateCode: z.string(),
  postalCode: z.string(),
  coordinates: CoordinatesSchema,
  country: z.string(),
})

export const HairSchema = z.object({
  color: z.string(),
  type: z.string(),
})

export const BankSchema = z.object({
  cardExpire: z.string(),
  cardNumber: z.string(),
  cardType: z.string(),
  currency: z.string(),
  iban: z.string(),
})

export const CompanySchema = z.object({
  department: z.string(),
  name: z.string(),
  title: z.string(),
  address: AddressSchema,
})

export const CryptoSchema = z.object({
  coin: z.string(),
  wallet: z.string(),
  network: z.string(),
})

// ─── Main User Schema ────────────────────────────────────────────────

export const UserSchema = z.object({
  id: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  maidenName: z.string(),
  age: z.number().int().positive(),
  gender: z.enum(['male', 'female']),
  email: z.string().email(),
  phone: z.string(),
  username: z.string(),
  birthDate: z.string(),
  image: z.string().url(),
  bloodGroup: z.string(),
  height: z.number().positive(),
  weight: z.number().positive(),
  eyeColor: z.string(),
  hair: HairSchema,
  ip: z.string(),
  address: AddressSchema,
  macAddress: z.string(),
  university: z.string(),
  bank: BankSchema,
  company: CompanySchema,
  ein: z.string(),
  ssn: z.string(),
  userAgent: z.string(),
  crypto: CryptoSchema,
  role: z.enum(['admin', 'moderator', 'user']),
})

// ─── Response Schemas ────────────────────────────────────────────────

export const UsersResponseSchema = z.object({
  users: z.array(UserSchema),
  total: z.number(),
  skip: z.number(),
  limit: z.number(),
})

// ─── Derived Types ───────────────────────────────────────────────────

export type User = z.infer<typeof UserSchema>
export type UsersResponse = z.infer<typeof UsersResponseSchema>
export type Address = z.infer<typeof AddressSchema>
export type Company = z.infer<typeof CompanySchema>
export type Bank = z.infer<typeof BankSchema>
export type Crypto = z.infer<typeof CryptoSchema>
export type UserRole = User['role']
export type UserGender = User['gender']
```

---

## API Functions Contract

```typescript
// src/entities/user/api/usersApi.ts

export type SortableField = 
  | 'firstName' 
  | 'lastName' 
  | 'age' 
  | 'email' 
  | 'company.name'

export type SortOrder = 'asc' | 'desc'

export interface GetUsersParams {
  limit?: number        // default: 10
  skip?: number         // default: 0
  sortBy?: SortableField
  order?: SortOrder
  select?: string       // comma-separated field names
}

export interface SearchUsersParams extends GetUsersParams {
  q: string
}

export interface FilterUsersParams extends GetUsersParams {
  key: string           // e.g. 'gender', 'hair.color'
  value: string         // case-sensitive
}

// Function signatures:
declare function getUsers(params?: GetUsersParams): Promise<UsersResponse>
declare function getUserById(id: number): Promise<User>
declare function searchUsers(params: SearchUsersParams): Promise<UsersResponse>
declare function filterUsers(params: FilterUsersParams): Promise<UsersResponse>
declare function getAllUsers(): Promise<User[]>  // limit=0, for stats + department list
```

---

## HTTP Client Contract

```typescript
// src/shared/api/httpClient.ts

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export interface HttpClient {
  get<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T>
}
```

---

## TanStack Query Hooks Contract

```typescript
// src/entities/user/model/useUsers.ts

export interface UseUsersParams {
  page: number
  limit: number
  search: string
  gender: UserGender | ''
  department: string
  sortBy: SortableField | ''
  order: SortOrder
}

// Primary hook for list page
declare function useUsers(params: UseUsersParams): UseQueryResult<UsersResponse>

// Hook for full dataset (stats, department list)
declare function useAllUsers(): UseQueryResult<User[]>

// Hook for single user (drawer)
declare function useUser(id: number | null): UseQueryResult<User>

// Prefetch function for hover
declare function prefetchUser(queryClient: QueryClient, id: number): void
```

---

## Query Keys Factory

```typescript
// src/entities/user/model/queryKeys.ts

export const userKeys = {
  all: ['users'] as const,
  
  lists: () => [...userKeys.all, 'list'] as const,
  list: (params: UseUsersParams) => [...userKeys.lists(), params] as const,
  
  allUsers: () => [...userKeys.all, 'all'] as const,
  
  details: () => [...userKeys.all, 'detail'] as const,
  detail: (id: number) => [...userKeys.details(), id] as const,
} as const
```

---

## Endpoint Reference Table

| Feature | Method | Endpoint | Params |
|---------|--------|----------|--------|
| All users (paginated) | GET | `/users` | limit, skip, sortBy, order |
| All users (full) | GET | `/users?limit=0` | — |
| Single user | GET | `/users/{id}` | — |
| Search | GET | `/users/search` | q, limit, skip, sortBy, order |
| Filter by gender | GET | `/users/filter` | key=gender, value, limit, skip |
| Filter by hair color | GET | `/users/filter` | key=hair.color, value |

---

## Error Codes

| HTTP Status | Code | Meaning |
|-------------|------|---------|
| 400 | `BAD_REQUEST` | Invalid params |
| 404 | `NOT_FOUND` | User not found |
| 429 | `RATE_LIMITED` | Too many requests |
| 500 | `SERVER_ERROR` | DummyJSON server error |
| 0 | `NETWORK_ERROR` | No internet / fetch failed |
| 0 | `PARSE_ERROR` | Zod validation failed |

---

## Response Caching Strategy

```typescript
// Stale times by query type:
const STALE_TIMES = {
  usersList: 1000 * 60 * 2,    // 2 min — changes with filters
  allUsers: 1000 * 60 * 10,    // 10 min — used for stats/departments
  userDetail: 1000 * 60 * 30,  // 30 min — rarely changes
} as const
```

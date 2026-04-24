import { http, HttpResponse } from 'msw'
import { mockUsers, mockUser } from './fixtures'

/**
 * MSW request handlers covering all dummyjson endpoints used by the app.
 * Order matters: more specific paths (search, filter) are defined before :id.
 */
export const handlers = [
  // Search endpoint
  http.get('https://dummyjson.com/users/search', ({ request }) => {
    const url = new URL(request.url)
    const q = (url.searchParams.get('q') ?? '').toLowerCase()
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const skip = Number(url.searchParams.get('skip') ?? 0)

    const filtered = q
      ? mockUsers.filter((u) =>
          `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q),
        )
      : mockUsers

    return HttpResponse.json({
      users: filtered.slice(skip, skip + limit),
      total: filtered.length,
      skip,
      limit,
    })
  }),

  // Filter endpoint
  http.get('https://dummyjson.com/users/filter', ({ request }) => {
    const url = new URL(request.url)
    const key = url.searchParams.get('key') ?? ''
    const value = url.searchParams.get('value') ?? ''
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const skip = Number(url.searchParams.get('skip') ?? 0)

    const filtered = mockUsers.filter((u) => {
      if (key === 'gender') return u.gender === value
      return true
    })

    if (limit === 0) {
      return HttpResponse.json({ users: filtered, total: filtered.length, skip: 0, limit: 0 })
    }

    return HttpResponse.json({
      users: filtered.slice(skip, skip + limit),
      total: filtered.length,
      skip,
      limit,
    })
  }),

  // Single user endpoint
  http.get('https://dummyjson.com/users/:id', ({ params }) => {
    const id = Number(params['id'])
    const user = mockUsers.find((u) => u.id === id) ?? { ...mockUser, id }
    return HttpResponse.json(user)
  }),

  // Users list endpoint (handles limit=0 for getAllUsers)
  http.get('https://dummyjson.com/users', ({ request }) => {
    const url = new URL(request.url)
    const limit = Number(url.searchParams.get('limit') ?? 10)
    const skip = Number(url.searchParams.get('skip') ?? 0)

    if (limit === 0) {
      return HttpResponse.json({
        users: mockUsers,
        total: mockUsers.length,
        skip: 0,
        limit: 0,
      })
    }

    return HttpResponse.json({
      users: mockUsers.slice(skip, skip + limit),
      total: mockUsers.length,
      skip,
      limit,
    })
  }),
]

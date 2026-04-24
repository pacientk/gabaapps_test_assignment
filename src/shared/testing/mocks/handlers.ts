import { http, HttpResponse } from 'msw'

/** Default MSW request handlers — extend per feature in tests */
export const handlers = [
  http.get('https://dummyjson.com/users', () => {
    return HttpResponse.json({ users: [], total: 0, skip: 0, limit: 10 })
  }),
]

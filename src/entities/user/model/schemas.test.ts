import { describe, it, expect } from 'vitest'
import { UserSchema, UsersResponseSchema } from './schemas'
import { mockUser, mockUsers } from '@/shared/testing/mocks/fixtures'

describe('UserSchema', () => {
  it('parses a fully valid user object', () => {
    const result = UserSchema.safeParse(mockUser)
    expect(result.success).toBe(true)
  })

  it('rejects an object with missing required fields', () => {
    const result = UserSchema.safeParse({ id: 1, firstName: 'Emily' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid gender value', () => {
    const result = UserSchema.safeParse({ ...mockUser, gender: 'other' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid role value', () => {
    const result = UserSchema.safeParse({ ...mockUser, role: 'superadmin' })
    expect(result.success).toBe(false)
  })

  it('rejects a non-URL image field', () => {
    const result = UserSchema.safeParse({ ...mockUser, image: 'not-a-url' })
    expect(result.success).toBe(false)
  })

  it('rejects a negative age', () => {
    const result = UserSchema.safeParse({ ...mockUser, age: -5 })
    expect(result.success).toBe(false)
  })

  it('accepts all valid gender values', () => {
    expect(UserSchema.safeParse({ ...mockUser, gender: 'male' }).success).toBe(true)
    expect(UserSchema.safeParse({ ...mockUser, gender: 'female' }).success).toBe(true)
  })

  it('accepts all valid role values', () => {
    for (const role of ['admin', 'moderator', 'user'] as const) {
      expect(UserSchema.safeParse({ ...mockUser, role }).success).toBe(true)
    }
  })
})

describe('UsersResponseSchema', () => {
  it('parses a valid paginated response', () => {
    const result = UsersResponseSchema.safeParse({
      users: mockUsers.slice(0, 5),
      total: mockUsers.length,
      skip: 0,
      limit: 5,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.users).toHaveLength(5)
      expect(result.data.total).toBe(mockUsers.length)
    }
  })

  it('rejects a response with missing total field', () => {
    const result = UsersResponseSchema.safeParse({
      users: [],
      skip: 0,
      limit: 10,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a response where users contains an invalid user', () => {
    const result = UsersResponseSchema.safeParse({
      users: [{ id: 1 }],
      total: 1,
      skip: 0,
      limit: 10,
    })
    expect(result.success).toBe(false)
  })
})

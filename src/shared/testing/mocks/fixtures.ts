import type { User } from '@/entities/user/model/schemas'

/** Minimal valid User that satisfies the Zod schema. Used as a base for all test fixtures. */
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

const DEPARTMENTS = ['Engineering', 'Marketing', 'Sales', 'HR'] as const

/** 30 varied users derived from mockUser, suitable for pagination/filter/search tests. */
export const mockUsers: User[] = Array.from({ length: 30 }, (_, i) => ({
  ...mockUser,
  id: i + 1,
  firstName: i === 0 ? 'Emily' : `User${i + 1}`,
  lastName: i === 0 ? 'Johnson' : 'Test',
  username: i === 0 ? 'emilys' : `user${i + 1}`,
  email: i === 0 ? mockUser.email : `user${i + 1}@test.com`,
  gender: (i % 2 === 0 ? 'female' : 'male') as 'female' | 'male',
  role: (['admin', 'moderator', 'user'] as const)[i % 3] as 'admin' | 'moderator' | 'user',
  company: {
    ...mockUser.company,
    department: DEPARTMENTS[i % 4] as string,
  },
}))

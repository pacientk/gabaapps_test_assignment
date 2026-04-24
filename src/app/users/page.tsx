import { Suspense } from 'react'
import { UsersPage } from '@/pages-layer/users-page/ui/UsersPage'
import { UserCardSkeleton } from '@/entities/user/ui/UserCardSkeleton'

export const metadata = {
  title: 'Users — Users Dashboard',
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-4 py-4 sm:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <UserCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <UsersPage />
    </Suspense>
  )
}

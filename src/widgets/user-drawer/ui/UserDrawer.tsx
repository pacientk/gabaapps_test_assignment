'use client'

import * as Dialog from '@radix-ui/react-dialog'
import * as Tabs from '@radix-ui/react-tabs'
import { X } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import { formatFullName } from '@/shared/lib/formatters'
import { useUser } from '@/entities/user/model/useUsers'
import { UserAvatar } from '@/entities/user/ui/UserAvatar'
import { UserBadge } from '@/entities/user/ui/UserBadge'
import { DrawerSkeleton } from './DrawerSkeleton'
import { ProfileTab } from './tabs/ProfileTab'
import { WorkTab } from './tabs/WorkTab'
import { FinanceTab } from './tabs/FinanceTab'
import { CryptoTab } from './tabs/CryptoTab'

interface UserDrawerProps {
  userId: number | null
  onClose: () => void
}

const TAB_LIST = [
  { value: 'profile', label: 'Profile' },
  { value: 'work', label: 'Work' },
  { value: 'finance', label: 'Finance' },
  { value: 'crypto', label: 'Crypto' },
] as const

/**
 * Right-side user detail drawer built on Radix Dialog.
 * - 560px wide on desktop, full-screen on mobile
 * - Slide-in/out animation via data-state CSS transitions (forceMount)
 * - Focus is trapped inside while open (Radix default)
 * - Closes on Escape, backdrop click, or X button
 * - URL sync (?userId=) is managed by the parent (UsersPage)
 */
export function UserDrawer({ userId, onClose }: UserDrawerProps) {
  const isOpen = userId !== null
  const { data: user, isLoading, isError } = useUser(userId)

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => { if (!open) onClose() }}>
      <Dialog.Portal>
        {/* Backdrop */}
        <Dialog.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm',
            'animate-in fade-in duration-300',
          )}
        />

        {/* Drawer panel */}
        <Dialog.Content
          aria-label="User details"
          className={cn(
            'fixed right-0 top-0 z-50 flex h-full w-full flex-col bg-white shadow-2xl',
            'sm:max-w-[560px]',
            'animate-in slide-in-from-right duration-300 ease-out',
            'focus:outline-none',
          )}
        >
          {/* Sticky header */}
          <div className="flex shrink-0 items-center justify-between border-b border-gray-100 px-6 py-4">
            <Dialog.Title className="text-base font-semibold text-gray-900">
              User Details
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                aria-label="Close drawer"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto">
            {isLoading && <DrawerSkeleton />}

            {isError && (
              <div className="flex flex-col items-center gap-2 p-12 text-center">
                <p className="font-semibold text-gray-800">Failed to load user</p>
                <p className="text-sm text-gray-500">Please try again.</p>
              </div>
            )}

            {user && (
              <>
                {/* Hero section */}
                <div className="border-b border-gray-100 px-6 py-5">
                  <div className="flex items-center gap-4">
                    <UserAvatar src={user.image} name={formatFullName(user.firstName, user.lastName)} size="lg" />
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatFullName(user.firstName, user.lastName)}
                      </p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        @{user.username}
                      </p>
                      <UserBadge role={user.role} className="mt-1.5" />
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <Tabs.Root defaultValue="profile" className="flex flex-col">
                  <Tabs.List className="flex shrink-0 border-b border-gray-100 px-6">
                    {TAB_LIST.map((tab) => (
                      <Tabs.Trigger
                        key={tab.value}
                        value={tab.value}
                        className={cn(
                          'relative px-4 py-3 text-sm font-medium text-gray-500 transition-colors',
                          'hover:text-gray-800',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500',
                          'data-[state=active]:text-blue-600',
                          'data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-0.5 data-[state=active]:after:w-full data-[state=active]:after:bg-blue-600',
                        )}
                      >
                        {tab.label}
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>

                  <div className="px-6 py-4">
                    <Tabs.Content value="profile">
                      <ProfileTab user={user} />
                    </Tabs.Content>
                    <Tabs.Content value="work">
                      <WorkTab user={user} />
                    </Tabs.Content>
                    <Tabs.Content value="finance">
                      <FinanceTab user={user} />
                    </Tabs.Content>
                    <Tabs.Content value="crypto">
                      <CryptoTab user={user} />
                    </Tabs.Content>
                  </div>
                </Tabs.Root>
              </>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

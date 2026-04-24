import { create } from 'zustand'

interface DrawerState {
  /** Currently selected user ID, null when drawer is closed */
  selectedUserId: number | null
  /** Open the drawer for a specific user */
  openDrawer: (id: number) => void
  /** Close the drawer and clear the selected user */
  closeDrawer: () => void
}

/**
 * Zustand store for user drawer UI state.
 * URL sync (?userId=) is handled in UsersPage alongside this store.
 */
export const useDrawerStore = create<DrawerState>((set) => ({
  selectedUserId: null,
  openDrawer: (id) => set({ selectedUserId: id }),
  closeDrawer: () => set({ selectedUserId: null }),
}))

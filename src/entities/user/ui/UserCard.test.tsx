import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserCard } from './UserCard'
import { mockUser } from '@/shared/testing/mocks/fixtures'

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('UserCard', () => {
  it('renders full name, email, and department', () => {
    render(<UserCard user={mockUser} onClick={vi.fn()} />, { wrapper })

    expect(screen.getByText('Emily Johnson')).toBeInTheDocument()
    expect(screen.getByText(mockUser.email)).toBeInTheDocument()
    expect(screen.getByText(/Engineering/)).toBeInTheDocument()
  })

  it('renders the correct role badge for admin', () => {
    render(<UserCard user={{ ...mockUser, role: 'admin' }} onClick={vi.fn()} />, { wrapper })
    expect(screen.getByText('admin')).toBeInTheDocument()
  })

  it('renders the correct role badge for moderator', () => {
    render(<UserCard user={{ ...mockUser, role: 'moderator' }} onClick={vi.fn()} />, { wrapper })
    expect(screen.getByText('moderator')).toBeInTheDocument()
  })

  it('renders the correct role badge for user', () => {
    render(<UserCard user={{ ...mockUser, role: 'user' }} onClick={vi.fn()} />, { wrapper })
    expect(screen.getByText('user')).toBeInTheDocument()
  })

  it('calls onClick with the user id when clicked', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<UserCard user={mockUser} onClick={onClick} />, { wrapper })

    await user.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
    expect(onClick).toHaveBeenCalledWith(mockUser.id)
  })

  it('calls onClick when Enter key is pressed', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<UserCard user={mockUser} onClick={onClick} />, { wrapper })

    screen.getByRole('button').focus()
    await user.keyboard('{Enter}')
    expect(onClick).toHaveBeenCalledWith(mockUser.id)
  })

  it('calls onClick when Space key is pressed', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    render(<UserCard user={mockUser} onClick={onClick} />, { wrapper })

    screen.getByRole('button').focus()
    await user.keyboard(' ')
    expect(onClick).toHaveBeenCalledWith(mockUser.id)
  })

  it('sets aria-pressed=true when isSelected', () => {
    render(<UserCard user={mockUser} onClick={vi.fn()} isSelected={true} />, { wrapper })
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
  })

  it('sets aria-pressed=false when not selected', () => {
    render(<UserCard user={mockUser} onClick={vi.fn()} isSelected={false} />, { wrapper })
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false')
  })
})

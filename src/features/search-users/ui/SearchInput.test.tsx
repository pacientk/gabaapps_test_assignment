import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SearchInput } from './SearchInput'

describe('SearchInput', () => {
  it('renders the search input with correct aria-label', () => {
    render(<SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} />)
    expect(screen.getByLabelText('Search users')).toBeInTheDocument()
  })

  it('uses the provided placeholder text', () => {
    render(
      <SearchInput
        value=""
        onChange={vi.fn()}
        onClear={vi.fn()}
        placeholder="Find someone…"
      />,
    )
    expect(screen.getByPlaceholderText('Find someone…')).toBeInTheDocument()
  })

  it('calls onChange on each keystroke', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<SearchInput value="" onChange={onChange} onClear={vi.fn()} />)

    await user.type(screen.getByLabelText('Search users'), 'Em')
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenLastCalledWith('m')
  })

  it('shows the clear button when value is non-empty', () => {
    render(<SearchInput value="Emily" onChange={vi.fn()} onClear={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
  })

  it('does not show the clear button when value is empty', () => {
    render(<SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} />)
    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
  })

  it('calls onClear when the clear button is clicked', async () => {
    const onClear = vi.fn()
    const user = userEvent.setup()
    render(<SearchInput value="Emily" onChange={vi.fn()} onClear={onClear} />)

    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(onClear).toHaveBeenCalledOnce()
  })

  it('shows the loading spinner instead of the clear button when isLoading', () => {
    const { container } = render(
      <SearchInput value="Emily" onChange={vi.fn()} onClear={vi.fn()} isLoading={true} />,
    )

    expect(screen.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })

  it('does not show the spinner when not loading', () => {
    const { container } = render(
      <SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} isLoading={false} />,
    )
    expect(container.querySelector('.animate-spin')).not.toBeInTheDocument()
  })
})

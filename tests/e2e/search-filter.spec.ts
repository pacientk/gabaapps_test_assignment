import { test, expect } from '@playwright/test'

test.describe('Search and filters', () => {
  test('searches users and updates URL', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    await page.getByLabel('Search users').fill('Emily')

    // Wait for 300ms debounce to flush to URL
    await expect(page).toHaveURL(/search=Emily/, { timeout: 2000 })
    await expect(page.getByText(/Showing/)).toBeVisible()
  })

  test('does not include search param in URL when input is cleared', async ({ page }) => {
    await page.goto('/users?search=Emily')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    await page.getByLabel('Clear search').click()

    await expect(page).not.toHaveURL(/search=/)
  })

  test('filters by gender and updates URL', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    await page.getByLabel('Filter by gender').selectOption('female')

    await expect(page).toHaveURL(/gender=female/)
    await expect(page.getByTestId('user-card').first()).toBeVisible()
  })

  test('filters by department and updates URL', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    // Wait for departments to load (options are attached to DOM, not necessarily visible)
    await page.waitForSelector('[aria-label="Filter by department"] option:not([value=""])', {
      state: 'attached',
    })

    const select = page.getByLabel('Filter by department')
    const firstDept = await select.locator('option:not([value=""])').first().getAttribute('value')
    await select.selectOption(firstDept!)

    await expect(page).toHaveURL(new RegExp(`department=${encodeURIComponent(firstDept!)}`))
  })

  test('clears all filters via Clear all button', async ({ page }) => {
    await page.goto('/users?gender=male')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    // "Clear all" appears in active filter chips
    await page.getByRole('button', { name: 'Clear all' }).click()

    await expect(page).toHaveURL(/\/users$|\/users\?$/)
    await expect(page).not.toHaveURL(/gender=/)
  })

  test('shows result count text', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByText(/Showing \d+ of \d+ users/)).toBeVisible()
  })

  test('shows empty state when no results found', async ({ page }) => {
    await page.goto('/users')
    await page.getByLabel('Search users').fill('zzznoresultszzzxxx')

    await expect(page.getByText('No users found')).toBeVisible({ timeout: 3000 })
  })
})

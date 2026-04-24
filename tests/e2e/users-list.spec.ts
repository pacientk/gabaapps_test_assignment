import { test, expect } from '@playwright/test'

test.describe('Users list', () => {
  test('loads and displays users on initial visit', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()
    await expect(page.getByTestId('user-card')).toHaveCount(10)
  })

  test('shows skeleton cards while data loads', async ({ page }) => {
    // Intercept and delay the users API to keep skeletons visible
    await page.route('**/dummyjson.com/users**', async (route) => {
      await new Promise((r) => setTimeout(r, 2000))
      await route.continue()
    })

    await page.goto('/users')

    // Skeletons are shown from SSR immediately; assert before they disappear
    await expect(page.getByTestId('skeleton-card').first()).toBeVisible()
  })

  test('paginates to page 2 via Next page button', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    await page.getByRole('button', { name: 'Next page' }).click()

    await expect(page).toHaveURL(/page=2/)
    await expect(page.getByTestId('user-card').first()).toBeVisible()
  })

  test('navigates to first page via First page button', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    // Go to page 2 first so First page button becomes enabled
    await page.getByRole('button', { name: 'Next page' }).click()
    await expect(page).toHaveURL(/page=2/)

    await page.getByRole('button', { name: 'First page' }).click()

    await expect(page).toHaveURL(/\/users$|\/users\?$/)
  })

  test('displays Users page heading', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()
    await expect(page.getByText('Users', { exact: true }).first()).toBeVisible()
  })

  test('switches between grid and table view', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    await page.getByRole('button', { name: 'Table view' }).click()
    await expect(page.getByRole('table')).toBeVisible()

    await page.getByRole('button', { name: 'Grid view' }).click()
    await expect(page.getByTestId('user-card').first()).toBeVisible()
  })
})

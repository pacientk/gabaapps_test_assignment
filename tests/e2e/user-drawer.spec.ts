import { test, expect } from '@playwright/test'

test.describe('User detail drawer', () => {
  test('opens drawer on user card click', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    await page.getByTestId('user-card').first().click()

    // Drawer opens: data-state switches to "open"
    await expect(page.getByRole('dialog')).toHaveAttribute('data-state', 'open')
    await expect(page).toHaveURL(/userId=\d+/)
  })

  test('closes drawer on Escape key', async ({ page }) => {
    await page.goto('/users?userId=1')
    await expect(page.getByRole('dialog')).toHaveAttribute('data-state', 'open')

    await page.keyboard.press('Escape')

    // Without forceMount the dialog is fully unmounted after closing
    await expect(page.getByRole('dialog')).not.toBeAttached()
    await expect(page).not.toHaveURL(/userId=/)
  })

  test('closes drawer on close button click', async ({ page }) => {
    await page.goto('/users?userId=1')
    await expect(page.getByRole('dialog')).toHaveAttribute('data-state', 'open')

    await page.getByRole('button', { name: 'Close drawer' }).click()

    await expect(page.getByRole('dialog')).not.toBeAttached()
    await expect(page).not.toHaveURL(/userId=/)
  })

  test('deep link opens drawer directly', async ({ page }) => {
    await page.goto('/users?userId=1')

    await expect(page.getByRole('dialog')).toHaveAttribute('data-state', 'open')
    // Scope to dialog to avoid ambiguity with same user in the card grid
    await expect(page.getByRole('dialog').getByText('Emily Johnson')).toBeVisible()
  })

  test('drawer shows user details heading', async ({ page }) => {
    await page.goto('/users?userId=1')

    await expect(page.getByRole('dialog')).toHaveAttribute('data-state', 'open')
    await expect(page.getByText('User Details')).toBeVisible()
  })

  test('drawer has Profile, Work, Finance, Crypto tabs', async ({ page }) => {
    await page.goto('/users?userId=1')
    await expect(page.getByRole('dialog')).toHaveAttribute('data-state', 'open')

    for (const tab of ['Profile', 'Work', 'Finance', 'Crypto']) {
      await expect(page.getByRole('tab', { name: tab })).toBeVisible()
    }
  })

  test('URL is cleared when drawer is closed', async ({ page }) => {
    await page.goto('/users')
    await expect(page.getByTestId('user-card').first()).toBeVisible()

    await page.getByTestId('user-card').first().click()
    await expect(page).toHaveURL(/userId=\d+/)

    await page.keyboard.press('Escape')
    await expect(page).not.toHaveURL(/userId=/)
  })
})

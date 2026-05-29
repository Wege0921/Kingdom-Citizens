import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Kingdom|Home/)
    await expect(page.locator('body')).toContainText('Sermons')
  })

  test('sermons page loads', async ({ page }) => {
    await page.goto('/sermons')
    await expect(page).toHaveTitle(/Sermons/)
    await expect(page.locator('body')).toContainText('Sermons')
  })

  test('learn page loads', async ({ page }) => {
    await page.goto('/learn')
    await expect(page).toHaveTitle(/Learning/)
    await expect(page.locator('body')).toContainText('Learning')
  })

  test('about page loads', async ({ page }) => {
    await page.goto('/about')
    await expect(page).toHaveTitle(/About/)
    await expect(page.locator('body')).toContainText('About')
  })

  test('community page loads', async ({ page }) => {
    await page.goto('/community')
    await expect(page).toHaveTitle(/Community/)
    await expect(page.locator('body')).toContainText('Community')
  })

  test('login page loads', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page).toHaveTitle(/Login|Sign in/)
    await expect(page.locator('body')).toContainText('Sign in')
  })

  test('offline page loads', async ({ page }) => {
    await page.goto('/offline')
    await expect(page.locator('body')).toContainText('offline')
  })
})

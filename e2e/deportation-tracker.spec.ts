import { test, expect } from '@playwright/test';

test.describe('Deportation Tracker App', () => {
  test.beforeEach(async ({ page }) => {
    // Mock API response
    await page.route('**/api/deportation-data', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify([
          { date: '2024-01-01', arrests: 100, detainers: 50, imageUrl: 'test1.jpg' },
          { date: '2024-01-02', arrests: 150, detainers: 75, imageUrl: 'test2.jpg' },
        ])
      });
    });
  });

  test('displays all main components correctly', async ({ page }) => {
    await page.goto('/');

    // Check header
    await expect(page.getByRole('heading', { name: 'ICE Deportation Tracker' })).toBeVisible();

    // Check stats
    await expect(page.getByText('Total Arrests')).toBeVisible();
    await expect(page.getByText('Total Detainers')).toBeVisible();
    await expect(page.getByText('250')).toBeVisible(); // Total arrests
    await expect(page.getByText('125')).toBeVisible(); // Total detainers

    // Check chart
    await expect(page.locator('.chart-container')).toBeVisible();

    // Check footer
    await expect(page.getByText(/Data sourced from/)).toBeVisible();
  });

  test('handles error state', async ({ page }) => {
    // Mock failed API response
    await page.route('**/api/deportation-data', route =>
      route.fulfill({ status: 500, body: 'Server error' })
    );

    await page.goto('/');

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByText(/Failed to load deportation data/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Try Again' })).toBeVisible();
  });

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if stats are stacked
    const statsContainer = page.locator('.grid-cols-1');
    await expect(statsContainer).toBeVisible();

    // Check if chart is responsive
    const chart = page.locator('.chart-container');
    await expect(chart).toBeVisible();
  });
}); 
import { test, expect } from "@playwright/test";

test.describe("ICE Deportation Tracker App", () => {
  test("displays the main components on desktop", async ({ page }) => {
    await page.goto("/");

    // Check header
    await expect(
      page.getByRole("heading", { name: "ICE Deportation Tracker" })
    ).toBeVisible();

    // Check loading state
    await expect(page.getByRole("status")).toBeVisible();

    // Wait for data to load
    await page.waitForSelector("text=Total Arrests");

    // Check stats display
    await expect(page.getByText("Total Arrests")).toBeVisible();
    await expect(page.getByText("Total Detainers")).toBeVisible();

    // Check chart
    await expect(page.locator("svg")).toBeVisible();

    // Check footer
    await expect(page.getByText(/Data sourced from/)).toBeVisible();
  });

  test("shows error state when data fails to load", async ({ page }) => {
    // Mock failed API response
    await page.route("**/api/deportation-data", (route) =>
      route.fulfill({ status: 500 })
    );

    await page.goto("/");

    await expect(page.getByRole("alert")).toBeVisible();
    await expect(
      page.getByText(/Failed to load deportation data/)
    ).toBeVisible();
  });

  test("displays correctly on mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // Check responsive layout
    await expect(
      page.getByRole("heading", { name: "ICE Deportation Tracker" })
    ).toBeVisible();

    // Verify stats are stacked on mobile
    const statsContainer = page.locator(".grid-cols-1");
    await expect(statsContainer).toBeVisible();

    // Check chart responsiveness
    const chart = page.locator("svg");
    await expect(chart).toBeVisible();

    // Verify tooltip works on mobile
    await chart.hover();
    await expect(page.locator(".recharts-tooltip-wrapper")).toBeVisible();
  });
});

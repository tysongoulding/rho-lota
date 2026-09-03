import { test, expect } from "@playwright/test";

test.describe("Rho Lota Desktop Application E2E Suite", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://127.0.0.1:5173/");
  });

  test("1. Application Boot & Titlebar Verification", async ({ page }) => {
    // Check titlebar and brand
    await expect(page.locator("header").getByText("Rho Lota")).toBeVisible();

    // Check status bar element
    await expect(page.locator("footer").getByText("rho").first()).toBeVisible();
  });

  test("2. Navigation: Customise Views (Skills, MCPs, Plugins)", async ({ page }) => {
    // Click Customise in Sidebar
    await page.locator("aside").getByRole("button", { name: "Customise" }).click();

    // Verify Customise tabs appear
    await expect(page.getByRole("button", { name: "Skills" })).toBeVisible();
    await expect(page.getByRole("button", { name: "MCPs" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Plugins" })).toBeVisible();

    // Switch to MCPs tab
    await page.getByRole("button", { name: "MCPs" }).click();
    await expect(page.getByText("Model Context Protocol (MCP) Servers")).toBeVisible();

    // Switch to Plugins tab
    await page.getByRole("button", { name: "Plugins" }).click();
    await expect(page.getByText("Installed Plugins & Extension SDKs")).toBeVisible();

    // Switch to Skills tab
    await page.getByRole("button", { name: "Skills" }).click();
    await expect(page.getByText("Installed Skills & Trigger Contracts")).toBeVisible();
  });

  test("3. Navigation: Artifacts Gallery & Visualizers", async ({ page }) => {
    // Click Artifacts in Sidebar
    await page.locator("aside").getByRole("button", { name: "Artifacts" }).click();

    // Verify gallery header and artifact items
    await expect(page.getByText("Artifacts & Project Deliverables")).toBeVisible();
    await expect(page.getByText("system_fsm_architecture.mmd")).toBeVisible();
  });

  test("4. Navigation: Automations Scheduled Tasks", async ({ page }) => {
    // Click Automation in Sidebar
    await page.locator("aside").getByRole("button", { name: "Automation" }).click();

    // Verify automations table
    await expect(page.getByText("Automation & Scheduled Jobs")).toBeVisible();
    await expect(page.getByText("Continuous Cargo Linter & Red-Green Verification")).toBeVisible();
  });

  test("5. Navigation: Settings Hub & Theme Customization (Light/Dark/System)", async ({ page }) => {
    // Click Settings
    await page.locator("aside").getByRole("button", { name: "Settings" }).click();

    // Verify Settings subtabs
    await expect(page.getByRole("button", { name: "Providers & Models" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Theme & Colors" })).toBeVisible();

    // Switch to Theme & Colors
    await page.getByRole("button", { name: "Theme & Colors" }).click();
    await expect(page.getByText("Theme Mode", { exact: true })).toBeVisible();

    // Test Light Mode click & verify html class
    await page.getByRole("button", { name: "Light", exact: true }).click();
    await expect(page.locator("html")).toHaveClass(/light/);

    // Test Dark Mode click & verify html class
    await page.getByRole("button", { name: "Dark", exact: true }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    // Test System Mode click
    await page.getByRole("button", { name: "System", exact: true }).click();

    // Test Dracula preset
    await expect(page.getByText("Dracula")).toBeVisible();
    await page.getByText("Dracula").click();
  });

  test("6. Chat Feed & Prompt Composer", async ({ page }) => {
    // Return to Chat by clicking Logo
    await page.locator("header").getByRole("button", { name: "Rho Lota" }).click();

    // Verify Prompt composer input is visible
    const promptInput = page.locator("textarea");
    await expect(promptInput).toBeVisible();

    // Type a sample message
    await promptInput.fill("Hello from Playwright automated test suite!");
    await expect(promptInput).toHaveValue("Hello from Playwright automated test suite!");
  });
});

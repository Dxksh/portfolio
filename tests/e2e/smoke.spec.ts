import { expect, test } from "@playwright/test";

test("shows identity immediately", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Daksh Singhvi" })).toBeVisible();
  await expect(page.getByText("Open to opportunities · Liverpool, UK")).toBeVisible();
});

test("dock navigates to sections", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Dock" }).getByRole("button", { name: "Projects" }).click();
  await expect(page.locator("#projects")).toBeInViewport();
});

test("theme toggles and persists across reloads", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("terminal chips run commands", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "whoami", exact: true }).click();
  await expect(page.getByText("UK Graduate Visa eligible")).toBeVisible();
});

test("mobile shows the tab bar instead of the dock", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Section tabs" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Dock" })).toBeHidden();
});

test("CV download link points at the PDF", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Download CV" }).first();
  await expect(link).toHaveAttribute("href", "/cv/Daksh-Singhvi-CV.pdf");
});

test("dock navigates to the Photos section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Dock" }).getByRole("button", { name: "Photos" }).click();
  await expect(page.locator("#photos")).toBeInViewport();
});

test("accent picker persists across reloads", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to Ocean accent" }).click();
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-accent", "ocean");
  await page.reload();
  await expect(html).toHaveAttribute("data-accent", "ocean");
});

test("More about me button is hidden while profile.moreAboutMe is empty", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: "More about me →" })).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "More About Daksh" })).toHaveCount(0);
});

test("Experience tabs switch between categories", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.getElementById("experience")?.scrollIntoView());
  await page.getByRole("button", { name: "[--leadership]" }).click();
  await expect(page.locator("#experience").getByText("Padelo")).toBeVisible();
});

import { expect, test } from "@playwright/test";

test("shows identity immediately", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Daksh Singhvi" })).toBeVisible();
  await expect(page.getByText("Software Engineer", { exact: true })).toBeVisible();
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

test("resume window opens from the dock and offers the PDF", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Dock" }).getByRole("button", { name: "Resume" }).click();
  const dialog = page.getByRole("dialog", { name: "Resume" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: "Download CV (PDF)" })).toHaveAttribute(
    "href",
    "/cv/Daksh-Singhvi-CV.pdf"
  );
});

test("dock navigates to the Photos section", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Dock" }).getByRole("button", { name: "Photos" }).click();
  await expect(page.locator("#photos")).toBeInViewport();
});

test("photo lightbox opens and steps between photos", async ({ page }) => {
  await page.goto("/");
  await page.locator("#photos").getByRole("button").first().click();
  const dialog = page.getByRole("dialog", { name: "Photos" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText(/^1 of \d+$/)).toBeVisible();
  await dialog.getByRole("button", { name: "Next photo" }).click();
  await expect(dialog.getByText(/^2 of \d+$/)).toBeVisible();
  await page.keyboard.press("ArrowLeft");
  await expect(dialog.getByText(/^1 of \d+$/)).toBeVisible();
});

test("About modal opens, traps focus, and closes", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "More about me →" }).click();
  const dialog = page.getByRole("dialog", { name: "More About Daksh" });
  await expect(dialog).toBeVisible();

  // Focus trap: from the initial just-opened state, both Tab and Shift+Tab must stay inside the dialog.
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.locator(":focus")).toHaveCount(1);
  await page.keyboard.press("Tab");
  await expect(dialog.locator(":focus")).toHaveCount(1);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("Experience tabs switch between categories", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => document.getElementById("experience")?.scrollIntoView());
  await page.getByRole("button", { name: "[--leadership]" }).click();
  await expect(page.locator("#experience").getByText("Padelo")).toBeVisible();
});

test("photos stay visible after a reload", async ({ page }) => {
  await page.goto("/");
  await page.locator("#photos").scrollIntoViewIfNeeded();
  const firstThumb = page.locator("#photos img").first();
  await expect(firstThumb).toHaveCSS("opacity", "1");
  // Reload with the images now warm in cache — they can finish loading before React
  // attaches its onLoad handler, so a load-event-only fade never fires.
  await page.reload();
  await page.locator("#photos").scrollIntoViewIfNeeded();
  await expect(firstThumb).toHaveCSS("opacity", "1");
});

test("lightbox does not flash or resize when stepping photos", async ({ page }) => {
  await page.goto("/");
  await page.locator("#photos").getByRole("button").first().click();
  const dialog = page.getByRole("dialog", { name: "Photos" });
  const stage = dialog.locator("img").first();
  await expect(stage).toHaveCSS("opacity", "1");
  const before = await dialog.boundingBox();

  await dialog.getByRole("button", { name: "Next photo" }).click();
  await expect(dialog.getByText(/^2 of \d+$/)).toBeVisible();
  // The image must never go transparent mid-step, and the window must not resize.
  await expect(stage).toHaveCSS("opacity", "1");
  const after = await dialog.boundingBox();
  expect(after?.height ?? 0).toBeCloseTo(before?.height ?? 0, 0);
});

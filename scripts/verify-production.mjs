import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ channel: "chrome", headless: true });
try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("http://localhost:3001/?debug=1");
  await page.getByRole("button", { name: "começar retrospectiva" }).waitFor();
  assert.equal(await page.title(), "Jeny Wrapped 2026");
  assert.equal(await page.locator(".debug-panel").count(), 0);
  await page.screenshot({ path: "test-results/production-desktop.png" });
  await page.getByRole("button", { name: "começar retrospectiva" }).click();
  assert.equal(
    await page.locator(".story-stage").getAttribute("data-scene"),
    "scan",
  );
  await page.getByLabel("Pausar retrospectiva", { exact: true }).click();
  await page.waitForTimeout(600);
  assert.equal(
    await page.locator(".story-stage").getAttribute("data-status"),
    "paused",
  );
  assert.deepEqual(errors, []);
  console.log(
    "Production smoke passed: title, cover, navigation, pause, debug exclusion, no browser errors.",
  );
} finally {
  await browser.close();
}

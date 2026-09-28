import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
const config = JSON.parse(
  await readFile(".next/required-server-files.json", "utf8"),
).config;
const basePath = config.basePath || "";
const origin = "http://localhost:3001";
const server = spawn(process.execPath, ["scripts/serve.mjs"], {
  env: { ...process.env, PORT: "3001", BASE_PATH: basePath },
  stdio: ["ignore", "pipe", "pipe"],
  windowsHide: true,
});
let serverError;
server.on("error", (error) => {
  serverError = error;
});
let browser;
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Static server did not start")),
      10000,
    );
    server.stdout.once("data", () => {
      clearTimeout(timeout);
      resolve();
    });
    server.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    server.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Static server exited: ${code}`));
    });
  });
  if (serverError) throw serverError;
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(`${origin}${basePath}/?debug=1`);
  await page.getByRole("button", { name: "começar maluquice" }).waitFor();
  assert.equal(await page.locator(".debug-panel").count(), 0);
  assert.equal(await page.locator(".toolbar-actions button").count(), 2);
  assert.equal(await page.locator(".chapter-name").count(), 0);
  const icon = await page.locator('link[rel="icon"]').getAttribute("href");
  assert.equal(icon, `${basePath}/icon.svg`);
  assert.equal((await page.request.get(`${origin}${icon}`)).status(), 200);
  await page.getByRole("button", { name: "começar maluquice" }).click();
  await page.waitForTimeout(900);
  await page.waitForTimeout(7500);
  assert.equal(
    await page.locator(".story-stage").getAttribute("data-scene"),
    "scan",
  );
  await page.getByLabel("Próxima história", { exact: true }).click();
  assert.equal(
    await page.locator(".story-stage").getAttribute("data-scene"),
    "effect",
  );
  await page.getByLabel("Recomeçar do início", { exact: true }).click();
  assert.equal(
    await page.locator(".story-stage").getAttribute("data-scene"),
    "cover",
  );
  await page.screenshot({ path: "test-results/production-desktop.png" });
  assert.deepEqual(errors, []);
  console.log(
    `Production smoke passed at ${basePath || "/"}: assets, manual navigation, controls, restart, debug exclusion and no page errors.`,
  );
} finally {
  await browser?.close();
  server.kill();
}

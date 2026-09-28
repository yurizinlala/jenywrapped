import { test, expect } from "@playwright/test";
const names = [
  "cover",
  "scan",
  "effect",
  "cinema",
  "updates",
  "nickname",
  "chaos",
  "blackout",
  "pan",
  "music",
  "anjos",
  "secret",
  "azul",
  "trip",
  "firsts",
  "tripstats",
  "alignment",
  "candy",
  "top",
  "year",
  "truth",
  "declaration",
  "letter",
  "share",
];
async function jump(page: import("@playwright/test").Page, index: number) {
  await page
    .locator(".debug-panel")
    .evaluate((el) => ((el as HTMLElement).style.visibility = "visible"));
  await page.getByLabel("Ir para história").selectOption(String(index));
  await page
    .locator(".debug-panel")
    .evaluate((el) => ((el as HTMLElement).style.visibility = "hidden"));
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    names[index],
  );
  await page.waitForTimeout(850);
}
test("manual navigation, no hold-to-pause, simplified controls, replay, PNG", async ({
  page,
}) => {
  const errors: string[] = [];
  await page.route("https://open.spotify.com/**", (route) => route.abort());
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/?debug=1");
  await page.getByRole("button", { name: "começar maluquice" }).click();
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    "scan",
  );
  await page.locator(".story-stage").click({ position: { x: 300, y: 400 } });
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    "effect",
  );
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.keyboard.press("ArrowLeft");
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    "scan",
  );
  await page.keyboard.press("Space");
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    "effect",
  );
  await page.waitForTimeout(850);
  await page.mouse.move(260, 400);
  await page.mouse.down();
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-status",
    "waiting",
  );
  await page.waitForTimeout(700);
  await page.mouse.up();
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    "effect",
  );
  await jump(page, 8);
  await page.waitForTimeout(6000);
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    "pan",
  );
  await page.getByLabel("Próxima história", { exact: true }).click();
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    "music",
    { timeout: 8000 },
  );
  await jump(page, 10);
  await page.waitForTimeout(800);
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-status",
    "waiting",
  );
  await page.getByLabel("Próxima história", { exact: true }).click();
  await expect(page.locator(".song-beat")).toHaveText(
    "essa lembrava você antes mesmo de tocar.",
  );
  await expect(page.locator(".toolbar-actions button")).toHaveCount(2);
  await expect(page.locator(".chapter-name")).toHaveCount(0);
  await expect(page.getByLabel("Abrir músicas", { exact: true })).toHaveCount(
    0,
  );
  await expect(
    page.getByLabel("Pausar retrospectiva", { exact: true }),
  ).toHaveCount(0);
  await jump(page, 23);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "salvar card" }).click();
  const saved = await download;
  expect(saved.suggestedFilename()).toBe("jeny-wrapped-2026.png");
  await saved.saveAs("test-results/share-card.png");
  await page.getByRole("button", { name: "rever", exact: false }).click();
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    "cover",
  );
  expect(errors).toEqual([]);
});
for (const [width, height] of [
  [320, 568],
  [360, 800],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1440, 900],
]) {
  test(`layouts ${width}x${height}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.setViewportSize({ width, height });
    await page.goto("/?debug=1");
    await page.getByLabel("Ir para história").waitFor();
    for (let i = 0; i < names.length; i++) {
      await jump(page, i);
      const overflow = await page.evaluate(() => {
        const article = document.querySelector(".scene:last-child")!;
        const stage = document
          .querySelector(".story-stage")!
          .getBoundingClientRect();
        return [
          ...article.querySelectorAll(
            "h1,.letter-text,.story-track,.track-card,.start-button,.share-actions,.share-card,.report-rows,.year-grid",
          ),
        ].flatMap((el) => {
          const r = el.getBoundingClientRect();
          return r.bottom > stage.bottom - 8 ||
            r.top < stage.top + 40 ||
            r.left < stage.left - 12 ||
            r.right > stage.right + 12
            ? [
                {
                  class: el.className,
                  bounds: { x: r.x, y: r.y, w: r.width, h: r.height },
                },
              ]
            : [];
        });
      });
      expect(overflow, `${names[i]} overflow at ${width}x${height}`).toEqual(
        [],
      );
      if ([0, 6, 12, 13, 16, 22, 23].includes(i)) {
        await page
          .locator(".debug-panel")
          .evaluate((el) => ((el as HTMLElement).style.visibility = "hidden"));
        await page.screenshot({
          path: `test-results/${width}-${names[i]}.png`,
        });
        await page
          .locator(".debug-panel")
          .evaluate((el) => ((el as HTMLElement).style.visibility = "visible"));
      }
    }
  });
}
test("reduced motion and touch swipe", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("/?debug=1");
  await jump(page, 10);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 320, y: 400 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [{ x: 100, y: 400 }],
  });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(page.locator(".song-beat")).toHaveText(
    "essa lembrava você antes mesmo de tocar.",
  );
  await context.close();
});

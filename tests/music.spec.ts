import { test, expect } from "@playwright/test";
const apiScript = `window.onSpotifyIframeApiReady({createController(el, options, callback) {
 const listeners = {}; const marker = document.createElement('div');
 marker.dataset.uri = options.uri; el.replaceWith(marker);
 const update = paused => { marker.dataset.playing = String(!paused); listeners.playback_update?.({data:{isPaused:paused,isBuffering:false}}); };
 callback({play(){update(false)},resume(){update(false)},pause(){update(true)},destroy(){marker.remove()},addListener(event, fn){listeners[event]=fn}});
 setTimeout(()=>listeners.ready?.({data:{}}), 20);
}});`;
const apiURL = "https://open.spotify.com/embed/iframe-api/v1";
test("music respects mute, visibility, scene changes and restart", async ({
  page,
}) => {
  await page.route(apiURL, (r) =>
    r.fulfill({ contentType: "application/javascript", body: apiScript }),
  );
  await page.goto("/?debug=1");
  await expect(page.locator(".story-track")).toHaveCount(0);
  await page.getByLabel("Ir para história").selectOption("10");
  await expect(page.locator(".story-track")).toHaveAttribute(
    "data-audio-status",
    "playing",
  );
  await page.getByLabel("Desativar som", { exact: true }).click();
  await expect(page.locator(".story-track")).toHaveAttribute(
    "data-audio-status",
    "paused",
  );
  await page.getByLabel("Ativar som", { exact: true }).click();
  await expect(page.locator(".story-track")).toHaveAttribute(
    "data-audio-status",
    "playing",
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".story-track")).toHaveAttribute(
    "data-audio-status",
    "paused",
  );
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: false,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".story-track")).toHaveAttribute(
    "data-audio-status",
    "playing",
  );
  await page.getByLabel("Ir para história").selectOption("12");
  await expect(page.locator("[data-uri]")).toHaveCount(1);
  await expect(page.locator(".story-track")).toHaveAttribute(
    "data-audio-status",
    "playing",
  );
  await page.getByLabel("Recomeçar do início", { exact: true }).click();
  await expect(page.locator("[data-uri]")).toHaveCount(0);
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-scene",
    "cover",
  );
});
for (const recovery of ["retry", "next scene", "online"]) {
  test(`Spotify recovers via ${recovery} without uncontrolled embeds`, async ({
    page,
  }) => {
    let attempts = 0;
    await page.route(apiURL, (r) =>
      ++attempts === 1
        ? r.abort()
        : r.fulfill({ contentType: "application/javascript", body: apiScript }),
    );
    await page.goto("/?debug=1");
    await page.getByLabel("Ir para história").selectOption("10");
    await expect(page.locator(".story-track")).toHaveAttribute(
      "data-audio-status",
      "failed",
    );
    await expect(page.locator(".story-track iframe")).toHaveCount(0);
    await expect(page.locator('a[href*="spotify.com"]')).toHaveCount(0);
    if (recovery === "retry") {
      await page.getByLabel("Desativar som", { exact: true }).click();
      await page.getByLabel("Ativar som", { exact: true }).click();
    } else if (recovery === "online")
      await page.evaluate(() => window.dispatchEvent(new Event("online")));
    else await page.getByLabel("Ir para história").selectOption("12");
    await expect(page.locator(".story-track")).toHaveCount(1);
    await expect(page.locator(".story-track")).toHaveAttribute(
      "data-audio-status",
      "playing",
    );
    expect(attempts).toBe(2);
  });
}
test("cover shapes keep moving after entry", async ({ page }) => {
  await page.goto("/");
  const shape = page.locator(".cover-orbit").first();
  await expect(shape).toBeVisible();
  const before = await shape.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(350);
  expect(await shape.evaluate((el) => getComputedStyle(el).transform)).not.toBe(
    before,
  );
});
test("sound cues only play on non-musical pages and obey mute", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = OscillatorNode.prototype.start;
    Object.assign(window, { cueStarts: 0 });
    OscillatorNode.prototype.start = function (...args) {
      (window as unknown as { cueStarts: number }).cueStarts++;
      return original.apply(this, args);
    };
  });
  const starts = () =>
    page.evaluate(() => (window as unknown as { cueStarts: number }).cueStarts);
  await page.route(apiURL, (r) =>
    r.fulfill({ contentType: "application/javascript", body: apiScript }),
  );
  await page.goto("/?debug=1");
  expect(await starts()).toBe(0);
  await page.getByRole("button", { name: "começar retrospectiva" }).click();
  await expect.poll(starts).toBeGreaterThan(0);
  await page.getByLabel("Desativar som", { exact: true }).click();
  const mutedCount = await starts();
  await page.getByLabel("Ir para história").selectOption("3");
  await page.waitForTimeout(400);
  expect(await starts()).toBe(mutedCount);
  await page.getByLabel("Ativar som", { exact: true }).click();
  await expect.poll(starts).toBeGreaterThan(mutedCount);
  const beforeMusic = await starts();
  await page.getByLabel("Ir para história").selectOption("10");
  await expect(page.locator(".story-track")).toHaveAttribute(
    "data-audio-status",
    "playing",
  );
  expect(await starts()).toBe(beforeMusic);
});
test("counter freezes when document is hidden", async ({ page }) => {
  await page.goto("/?debug=1");
  await page.getByLabel("Ir para história").selectOption("2");
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", {
      configurable: true,
      value: true,
    });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.locator(".story-stage")).toHaveClass(/is-paused/);
  const before = await page.locator(".effect-number h1").innerText();
  await page.waitForTimeout(500);
  expect(await page.locator(".effect-number h1").innerText()).toBe(before);
});

test("reduced motion hydrates without mismatched markup", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "começar retrospectiva" }).click();
  await expect(page.locator(".story-stage")).toHaveAttribute(
    "data-status",
    "waiting",
  );
  expect(errors).toEqual([]);
});

test("requested music stays hidden and alignment restarts on the final page", async ({
  page,
}) => {
  await page.route(apiURL, (r) =>
    r.fulfill({ contentType: "application/javascript", body: apiScript }),
  );
  await page.goto("/?debug=1");
  let previous: Awaited<
    ReturnType<ReturnType<typeof page.locator>["elementHandle"]>
  > | null = null;
  for (const [scene, uri] of [
    ["2", "7BqBn9nzAq8spo5e7cZ0dJ"],
    ["5", "7wMAgaPiKzTNxpDWu2BPfk"],
    ["8", "7D9BJEcWwRqvQVqPbj1dbF"],
    ["18", "4d0DpU7Odiv0ztvX2GxJlk"],
    ["16", "741Aeks1h7InLiTSWXMV7c"],
    ["23", "741Aeks1h7InLiTSWXMV7c"],
  ]) {
    await page.getByLabel("Ir para história").selectOption(scene);
    await expect(page.locator(".story-track")).toHaveAttribute(
      "data-audio-status",
      "playing",
    );
    await expect(page.locator("[data-uri]")).toHaveAttribute(
      "data-uri",
      `spotify:track:${uri}`,
    );
    await expect(page.locator(".story-track")).toBeHidden();
    await expect(page.locator('a[href*="spotify.com"]')).toHaveCount(0);
    if (previous)
      expect(await previous.evaluate((el) => el.isConnected)).toBe(false);
    previous = await page.locator("[data-uri]").elementHandle();
  }
});

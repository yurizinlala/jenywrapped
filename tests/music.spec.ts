import { test, expect } from "@playwright/test";

test("music follows scene, mute and pause with official controller contract", async ({
  page,
}) => {
  await page.route("https://open.spotify.com/embed/iframe-api/v1", (route) =>
    route.fulfill({
      contentType: "application/javascript",
      body: `window.onSpotifyIframeApiReady({createController(el, options, callback) {
      const listeners = {}; const marker = document.createElement('div');
      marker.dataset.uri = options.uri; el.replaceWith(marker);
      const update = paused => { marker.dataset.playing = String(!paused); listeners.playback_update?.({data:{isPaused:paused,isBuffering:false}}); };
      callback({play(){update(false)},resume(){update(false)},pause(){update(true)},destroy(){marker.remove()},addListener(event, fn){listeners[event]=fn}});
      setTimeout(()=>listeners.ready?.({data:{}}), 20);
    }});`,
    }),
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
  await page.getByLabel("Ir para história").selectOption("12");
  await expect(page.locator(".story-track")).toHaveCount(1);
  await expect(page.locator("[data-uri]")).toHaveCount(1);
  await expect(page.locator(".story-track")).toHaveAttribute(
    "data-audio-status",
    "playing",
  );
  await page.getByLabel("Ir para história").selectOption("13");
  await expect(page.locator("[data-uri]")).toHaveCount(0);
});

test("Spotify failure leaves a playable official embed", async ({ page }) => {
  await page.route("https://open.spotify.com/embed/iframe-api/v1", (route) =>
    route.abort(),
  );
  await page.goto("/?debug=1");
  await page.getByLabel("Ir para história").selectOption("10");
  await expect(page.locator(".story-track")).toHaveAttribute(
    "data-audio-status",
    "failed",
  );
  await expect(page.locator(".story-track iframe")).toHaveAttribute(
    "src",
    /open.spotify.com\/embed\/track\//,
  );
});

test("cover shapes keep moving after entry", async ({ page }) => {
  await page.goto("/");
  const shape = page.locator(".cover-orbit").first();
  await expect(shape).toBeVisible();
  const before = await shape.evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(350);
  const after = await shape.evaluate((el) => getComputedStyle(el).transform);
  expect(after).not.toBe(before);
});

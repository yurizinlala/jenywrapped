import test from "node:test";
import assert from "node:assert/strict";
import { publicAsset } from "../src/lib/assets.mjs";
test("public media paths work locally and under GitHub Pages", () => {
  for (const src of ["/icon.svg", "/memories/trip.webp", "/audio/song.mp3"]) {
    assert.equal(publicAsset(src, ""), src);
    assert.equal(publicAsset(src, "/jenywrapped"), `/jenywrapped${src}`);
    assert.equal(
      publicAsset(`/jenywrapped${src}`, "/jenywrapped"),
      `/jenywrapped${src}`,
    );
  }
});
test("empty and external paths stay unchanged", () => {
  for (const src of [
    "",
    "https://example.com/photo.webp",
    "//example.com/audio.mp3",
    "data:image/png;base64,abc",
  ])
    assert.equal(publicAsset(src, "/jenywrapped"), src);
});

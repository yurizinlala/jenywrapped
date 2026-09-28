import test from "node:test";
import assert from "node:assert/strict";
import { nextPosition, previousPosition, phase } from "../src/lib/story.mjs";
const scenes = [{}, { beats: ["a", "b", "c"] }, {}];
test("manual beats must finish before leaving a story", () => {
  assert.deepEqual(nextPosition(1, 0, scenes), { index: 1, beat: 1 });
  assert.deepEqual(nextPosition(1, 2, scenes), { index: 2, beat: 0 });
});
test("previous restores last beat and clamps at cover", () => {
  assert.deepEqual(previousPosition(2, 0, scenes), { index: 1, beat: 2 });
  assert.deepEqual(previousPosition(0, 0, scenes), { index: 0, beat: 0 });
});
test("ending does not overflow", () =>
  assert.deepEqual(nextPosition(2, 0, scenes), { index: 2, beat: 0 }));
test("pause overrides timed and manual playback", () => {
  assert.equal(phase(true, true), "paused");
  assert.equal(phase(false, false), "waiting");
  assert.equal(phase(true, false), "playing");
});

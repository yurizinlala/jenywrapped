import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import ts from "typescript";
const source = await readFile(
  new URL("../src/data/jeny.ts", import.meta.url),
  "utf8",
);
const js = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const { scenes, jenyWrapped } = await import(
  "data:text/javascript;base64," + Buffer.from(js).toString("base64")
);
test("every scene references existing music and photos, with unique identifiers", () => {
  assert.equal(new Set(scenes.map((s) => s.id)).size, scenes.length);
  assert.equal(
    new Set(jenyWrapped.songs.map((t) => t.id)).size,
    jenyWrapped.songs.length,
  );
  for (const scene of scenes) {
    if (scene.track)
      assert.ok(
        jenyWrapped.songs.some((t) => t.id === scene.track),
        `Unknown track in ${scene.id}`,
      );
    if (scene.photo)
      assert.ok(
        jenyWrapped.photos[scene.photo],
        `Unknown photo in ${scene.id}`,
      );
    if (scene.beats)
      assert.ok(scene.beats.length > 0, `Empty reading pages in ${scene.id}`);
  }
});

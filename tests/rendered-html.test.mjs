import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("source contains the SignalForge application", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  assert.match(page,/SignalForge/);
  assert.match(page,/Turn a good post into a stronger one/);
  assert.match(page,/api\/evaluations/);
  assert.match(layout,/og\.png/);
  assert.doesNotMatch(page,/codex-preview/);
});

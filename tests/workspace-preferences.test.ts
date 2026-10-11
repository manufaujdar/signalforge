import assert from "node:assert/strict";
import test from "node:test";
import { defaultPreferences, parseWorkspacePreferences, preferencesSnapshot } from "../lib/workspace-preferences.ts";

test("saved workspace defaults keep only supported platform and editorial direction", () => {
  assert.deepEqual(parseWorkspacePreferences('{"platform":"LinkedIn","direction":2,"draft":"synthetic discarded field"}'), { platform: "LinkedIn", direction: 2 });
});

test("missing or malformed preferences retain safe defaults", () => {
  for (const value of [null, "{", "null", "[]", '{"platform":"unknown","direction":0}', '{"platform":"X","direction":"1"}']) {
    assert.deepEqual(parseWorkspacePreferences(value), defaultPreferences);
  }
  assert.equal(preferencesSnapshot(), null, "Unavailable browser storage must not break rendering");
});

import assert from "node:assert/strict";
import test from "node:test";
import { parseEvaluationInput } from "../app/api/evaluations/validation.ts";

test("accepts bounded evaluation input", () => {
  assert.deepEqual(
    parseEvaluationInput({ platform: "X", content: "  useful post  ", score: 82.4, risk: 4.6 }),
    { platform: "X", content: "useful post", score: 82, risk: 5 },
  );
});

test("rejects unknown platforms, non-finite scores, and oversized content", () => {
  assert.equal(parseEvaluationInput({ platform: "TikTok", content: "post", score: 50, risk: 0 }), null);
  assert.equal(parseEvaluationInput({ platform: "X", content: "post", score: Number.NaN, risk: 0 }), null);
  assert.equal(parseEvaluationInput({ platform: "X", content: "x".repeat(20_001), score: 50, risk: 0 }), null);
});

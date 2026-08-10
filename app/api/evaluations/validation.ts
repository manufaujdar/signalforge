export const EVALUATION_PLATFORMS = ["X", "LinkedIn", "Instagram"] as const;

export type EvaluationInput = {
  platform: (typeof EVALUATION_PLATFORMS)[number];
  content: string;
  score: number;
  risk: number;
};

function isFinitePercentage(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100;
}

export function parseEvaluationInput(body: unknown): EvaluationInput | null {
  if (!body || typeof body !== "object") return null;
  const candidate = body as Record<string, unknown>;
  const platform = candidate.platform;
  const content = candidate.content;
  if (
    typeof platform !== "string" ||
    !EVALUATION_PLATFORMS.includes(platform as EvaluationInput["platform"]) ||
    typeof content !== "string"
  ) {
    return null;
  }
  const trimmed = content.trim();
  if (!trimmed || trimmed.length > 20_000) return null;
  if (!isFinitePercentage(candidate.score) || !isFinitePercentage(candidate.risk)) return null;
  return {
    platform: platform as EvaluationInput["platform"],
    content: trimmed,
    score: Math.round(candidate.score),
    risk: Math.round(candidate.risk),
  };
}

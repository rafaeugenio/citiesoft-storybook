/**
 * Poses adaptadas da gramática de expressão do Blobatar (licença MIT).
 * https://github.com/Alain00/blobatar/blob/main/src/expression.ts
 *
 * A silhueta e as âncoras dos olhos são dos vetores Citiesoft. Os valores de
 * pose foram ajustados ao plano frontal mais estreito do VectorBlob.svg.
 */

export type BlobatarExpression =
  | "idle"
  | "happy"
  | "sad"
  | "mad"
  | "surprised"
  | "wink"
  | "sleepy"
  | "smug"
  | "unsure"
  | "scared"
  | "love"
  | "shy"
  | "sick"
  | "thinking";

export type ProductExpression =
  | "neutral"
  | "attentive"
  | "success"
  | "warning"
  | "error"
  | "sleeping";

export type CitieCharacterExpression = BlobatarExpression | ProductExpression;

export type EyePose = {
  x: number;
  y: number;
  scaleX: number;
  scaleY: number;
};

export type ExpressionPose = {
  left: EyePose;
  right: EyePose;
  bodyY: number;
  tremor?: number;
  thinking?: boolean;
  blink?: boolean;
  eyeShape?: "capsule" | "heart" | "smile";
};

// A cápsula original mede 12 × 32; as poses preservam altura maior que largura.
const eye = (
  x = 0,
  y = 0,
  scaleX = 1,
  scaleY = 1,
): EyePose => ({ x, y, scaleX, scaleY });

export const BLOBATAR_POSES: Record<BlobatarExpression, ExpressionPose> = {
  idle: { left: eye(), right: eye(), bodyY: 0, blink: true },
  happy: {
    left: eye(-1.5, -1.5, 1, 1),
    right: eye(1.5, -1.5, 1, 1),
    bodyY: -2.2,
    eyeShape: "smile",
  },
  sad: {
    left: eye(-1.9, 3.6, 0.72, 0.58),
    right: eye(1.9, 3.6, 0.68, 0.54),
    bodyY: 2.6,
  },
  mad: {
    left: eye(-2.3, 0.4, 1.45, 0.76),
    right: eye(2.3, 0.4, 1.45, 0.76),
    bodyY: 0.8,
    tremor: 0.55,
  },
  surprised: {
    left: eye(-0.5, -1.05, 1.34, 1.2),
    right: eye(0.5, -1.05, 1.39, 1.27),
    bodyY: -1.4,
  },
  wink: {
    left: eye(-0.8, -0.6, 1.32, 0.76),
    right: eye(0.8, -0.6, 1, 0.58),
    bodyY: -1.1,
    blink: true,
  },
  sleepy: {
    left: eye(-0.3, 2.4, 1.14, 0.64),
    right: eye(0.3, 2.4, 1.1, 0.62),
    bodyY: 1.2,
  },
  smug: {
    left: eye(-0.5, -0.5, 1.3, 0.72),
    right: eye(0.5, -0.5, 1.36, 0.76),
    bodyY: -1,
  },
  unsure: {
    left: eye(-0.3, -0.2, 0.95, 1.02),
    right: eye(0.3, -0.2, 1.19, 0.68),
    bodyY: 0,
    blink: true,
  },
  scared: {
    left: eye(1.5, -2, 0.9, 1.18),
    right: eye(-1.5, -2, 0.86, 1.22),
    bodyY: -0.6,
    tremor: 0.35,
  },
  love: {
    left: eye(-0.8, -1.3, 1.18, 0.82),
    right: eye(0.8, -1.3, 1.18, 0.82),
    bodyY: -1.4,
    eyeShape: "heart",
  },
  shy: {
    left: eye(0.2, 1.4, 0.62, 0.5),
    right: eye(-0.2, 1.4, 0.57, 0.46),
    bodyY: 0.9,
  },
  sick: {
    left: eye(-0.8, 2.8, 1.18, 0.66),
    right: eye(0.8, 1.3, 1.25, 0.7),
    bodyY: 1.4,
    tremor: 0.18,
  },
  thinking: {
    left: eye(-0.4, 4.2, 1.15, 0.62),
    right: eye(0.4, -4.2, 1.17, 0.68),
    bodyY: -0.4,
    thinking: true,
  },
};

const PRODUCT_ALIASES: Record<ProductExpression, BlobatarExpression> = {
  neutral: "idle",
  attentive: "surprised",
  success: "happy",
  warning: "unsure",
  error: "sad",
  sleeping: "sleepy",
};

export function resolveExpression(expression: CitieCharacterExpression): BlobatarExpression {
  return expression in PRODUCT_ALIASES
    ? PRODUCT_ALIASES[expression as ProductExpression]
    : (expression as BlobatarExpression);
}

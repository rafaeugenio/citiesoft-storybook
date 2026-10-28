import type { BlobatarExpression } from "./citie-character-poses";

type ReactionAccent = {
  x: number;
  y: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  duration: number;
};

type AmbientAccent = {
  x: number;
  y: number;
  rotate: number;
  duration: number;
};

/**
 * Uma reação comunica a emoção em quatro beats: antecipar, exagerar,
 * ultrapassar o repouso e acomodar. Cada sequência termina em identidade,
 * mantendo a forma reconhecível e liberando a interface imediatamente.
 */
export const REACTIONS: Record<BlobatarExpression, ReactionAccent> = {
  idle: { x: 0, y: -3, rotate: 0, scaleX: 0.95, scaleY: 1.09, duration: 0.54 },
  happy: { x: 0, y: -10, rotate: -3, scaleX: 0.87, scaleY: 1.2, duration: 0.67 },
  sad: { x: -1, y: 5, rotate: -5, scaleX: 1.09, scaleY: 0.84, duration: 0.68 },
  mad: { x: 4, y: 1, rotate: 8, scaleX: 1.14, scaleY: 0.82, duration: 0.58 },
  surprised: { x: 0, y: -8, rotate: 0, scaleX: 0.85, scaleY: 1.25, duration: 0.61 },
  wink: { x: 3, y: -4, rotate: 8, scaleX: 0.95, scaleY: 1.1, duration: 0.54 },
  sleepy: { x: -2, y: 5, rotate: -6, scaleX: 1.07, scaleY: 0.88, duration: 0.7 },
  smug: { x: 3, y: -2, rotate: 6, scaleX: 1.04, scaleY: 0.95, duration: 0.55 },
  unsure: { x: -4, y: 1, rotate: -7, scaleX: 1.04, scaleY: 0.94, duration: 0.67 },
  scared: { x: 0, y: -9, rotate: -5, scaleX: 0.86, scaleY: 1.2, duration: 0.65 },
  love: { x: 0, y: -8, rotate: 4, scaleX: 0.9, scaleY: 1.17, duration: 0.68 },
  shy: { x: -3, y: 3, rotate: -5, scaleX: 1.06, scaleY: 0.89, duration: 0.68 },
  sick: { x: -2, y: 4, rotate: -7, scaleX: 1.08, scaleY: 0.85, duration: 0.7 },
  thinking: { x: 2, y: -2, rotate: 7, scaleX: 0.97, scaleY: 1.04, duration: 0.65 },
};

/** A segunda ação é menor que a reação principal e varia com a emoção. */
export const AMBIENT_ACCENTS: Record<BlobatarExpression, AmbientAccent> = {
  idle: { x: 0, y: -1.1, rotate: 0, duration: 3.4 },
  happy: { x: 0, y: -2.5, rotate: 1.2, duration: 2.1 },
  sad: { x: -0.4, y: 1.4, rotate: -1.2, duration: 3.2 },
  mad: { x: 0.7, y: -0.4, rotate: 1.4, duration: 2.2 },
  surprised: { x: 0, y: -1.8, rotate: 0, duration: 2.5 },
  wink: { x: 1.1, y: -1.1, rotate: 2, duration: 2.3 },
  sleepy: { x: -0.5, y: 1.5, rotate: -1.3, duration: 3.4 },
  smug: { x: 1.2, y: -0.6, rotate: 1.7, duration: 2.7 },
  unsure: { x: -1.2, y: 0.5, rotate: -1.8, duration: 2.7 },
  scared: { x: 0.8, y: -1.2, rotate: 1.2, duration: 2.4 },
  love: { x: 0.3, y: -2, rotate: 1.4, duration: 2.7 },
  shy: { x: -0.7, y: 0.8, rotate: -1.1, duration: 3 },
  sick: { x: -0.7, y: 1.2, rotate: -1.4, duration: 3.3 },
  thinking: { x: 0.8, y: -0.6, rotate: 1.8, duration: 2.5 },
};

export function reactionKeyframes(accent: ReactionAccent) {
  return {
    x: [0, -accent.x * 0.3, accent.x, -accent.x * 0.16, 0],
    y: [0, -accent.y * 0.25, accent.y, -accent.y * 0.18, 0],
    rotate: [0, -accent.rotate * 0.3, accent.rotate, -accent.rotate * 0.2, 0],
    scaleX: [
      1,
      1 + (1 - accent.scaleX) * 0.48,
      accent.scaleX,
      1 + (1 - accent.scaleX) * 0.16,
      1,
    ],
    scaleY: [
      1,
      1 + (1 - accent.scaleY) * 0.48,
      accent.scaleY,
      1 + (1 - accent.scaleY) * 0.16,
      1,
    ],
    transition: {
      duration: accent.duration,
      times: [0, 0.16, 0.46, 0.72, 1],
      ease: [0.2, 0, 0.2, 1] as const,
    },
  };
}

"use client";

import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type SVGProps } from "react";
import {
  motion as Motion,
  useAnimationControls,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";

import { cx } from "@/utils/cx";
import {
  BLOBATAR_POSES,
  resolveExpression,
  type CitieCharacterExpression,
  type EyePose,
} from "./citie-character-poses";
import { AMBIENT_ACCENTS, REACTIONS, reactionKeyframes } from "./citie-character-motion";

export type { CitieCharacterExpression } from "./citie-character-poses";
export type CitieCharacterMotion = "none" | "hover" | "always" | "responsive" | "ambient";
export type CitieCharacterSize = "sm" | "md" | "lg" | "xl";

export interface CitieCharacterProps extends Omit<SVGProps<SVGSVGElement>, "color"> {
  /** Estados de produto e as 14 expressões do Blobatar. O estado também deve existir em texto. */
  expression?: CitieCharacterExpression;
  /** `hover` e `always` seguem a intenção dos modos de animação do Blobatar. */
  motion?: CitieCharacterMotion;
  /** Para loops longos, ofereça ao usuário um controle de pausa. */
  paused?: boolean;
  followPointer?: boolean;
  size?: CitieCharacterSize;
  /** Sem rótulo, o personagem é decorativo. */
  label?: string;
}

/** Silhueta fiel a VectorBlob.svg, sem os olhos fundidos do VetorBlob2.svg. */
const BODY_PATH =
  "M128 60C128 65.0682 125.644 69.5861 121.966 72.5176L112.555 81.929C109.808 85.3987 105.648 87.6985 100.947 87.9724C100.634 87.9907 100.318 88 100 88H16C7.16345 88 0 80.8366 0 72V28C0 23.8952 1.54578 20.1514 4.087 17.3189C4.23437 17.1547 4.38509 16.9935 4.53905 16.8355L4.83546 16.5391L16.3087 5.0768C19.2288 1.95274 23.3864 0 28 0H112C120.837 0 128 7.16344 128 16V60ZM120 60C120 62.9611 118.391 65.5465 116 66.9297C114.823 67.6104 113.457 68 112 68H28C23.5817 68 20 64.4183 20 60V16C20 14.5429 20.3896 13.1767 21.0703 12C22.4535 9.60879 25.0389 8 28 8H112C116.418 8 120 11.5817 120 16V60Z";

const SIZE_STYLES: Record<CitieCharacterSize, string> = {
  sm: "w-16",
  md: "w-24",
  lg: "w-32",
  xl: "w-48",
};

const POSE_TRANSITION = { type: "spring" as const, stiffness: 310, damping: 17, mass: 0.55 };
const STILL_TRANSITION = { duration: 0 };

// A face fica no plano frontal x20–120, y8–68. O centro óptico (84,38)
// está à direita e acima do centro do SVG (64,44) por causa da extrusão.
const FACE = { x: 84, y: 38 };

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function Eye({
  side,
  pose,
  thinking,
  heart,
  smile,
  blink,
  pulse,
  active,
  ambient,
  gazeX,
  gazeY,
}: {
  side: "left" | "right";
  pose: EyePose;
  thinking: boolean;
  heart: boolean;
  smile: boolean;
  blink: boolean;
  pulse: number;
  active: boolean;
  ambient: boolean;
  gazeX: ReturnType<typeof useSpring>;
  gazeY: ReturnType<typeof useSpring>;
}) {
  const anchorX = side === "left" ? 70 : 98;
  const depthScaleX = useTransform(gazeX, (x) =>
    1 - Math.max(0, side === "right" ? x : -x) * 0.055,
  );
  const depthScaleY = useTransform(gazeY, (y) => 1 - Math.abs(y) * 0.025);

  return (
    <Motion.g
      data-eye={side}
      initial={false}
      animate={{ x: pose.x, y: pose.y }}
      transition={active ? { ...POSE_TRANSITION, delay: side === "right" ? 0.045 : 0 } : STILL_TRANSITION}
    >
      <Motion.g
        data-part="eye-pose"
        initial={false}
        animate={{ scaleX: pose.scaleX, scaleY: pose.scaleY }}
        transition={active ? { ...POSE_TRANSITION, delay: side === "right" ? 0.045 : 0 } : STILL_TRANSITION}
        style={{ transformOrigin: `${anchorX}px 38px` }}
      >
      <Motion.g
        data-part="perspective"
        style={{ scaleX: depthScaleX, scaleY: depthScaleY, transformOrigin: `${anchorX}px 38px` }}
      >
        <Motion.g
          data-part="thinking-shift"
          initial={false}
          animate={thinking && ambient ? { y: side === "left" ? [0, -8.4, 0] : [0, 8.4, 0] } : { y: 0 }}
          transition={thinking && ambient ? { duration: 1.85, ease: "easeInOut", repeat: Infinity } : STILL_TRANSITION}
        >
          <Motion.g
            data-part="emotion-pulse"
            initial={false}
            animate={ambient && pulse > 1 ? { scaleX: [1, pulse, 1], scaleY: [1, pulse, 1] } : { scaleX: 1, scaleY: 1 }}
            transition={
              ambient && pulse > 1
                ? { duration: 0.58, repeat: Infinity, repeatDelay: 1.9, delay: side === "right" ? 0.09 : 0, ease: [0.2, 0, 0.2, 1] }
                : STILL_TRANSITION
            }
            style={{ transformOrigin: `${anchorX}px 38px` }}
          >
            <Motion.g
              data-part="blink"
              initial={false}
              animate={
                blink && ambient
                  ? { scaleY: [1, 1, 0.82, 1, 1], opacity: [1, 1, 0.15, 1, 1] }
                  : { scaleY: 1, opacity: 1 }
              }
              transition={
                blink && ambient
                  ? { duration: 5.2, ease: "linear", repeat: Infinity, times: [0, 0.84, 0.87, 0.9, 1] }
                  : STILL_TRANSITION
              }
              style={{ transformOrigin: `${anchorX}px 38px` }}
            >
            {smile ? (
              <path
                d={
                  side === "left"
                    ? "M61 41C63.5 34.5 67 32 70 32C73 32 76.5 34.5 79 41"
                    : "M89 41C91.5 34.5 95 32 98 32C101 32 104.5 34.5 107 41"
                }
                fill="none"
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
              />
            ) : heart ? (
              <path
                d={
                  side === "left"
                    ? "M70 49C67 46 61 42 61 36C61 32 63.5 29.5 67 29.5C69 29.5 70 30.5 70 32C70 30.5 71 29.5 73 29.5C76.5 29.5 79 32 79 36C79 42 73 46 70 49Z"
                    : "M98 49C95 46 89 42 89 36C89 32 91.5 29.5 95 29.5C97 29.5 98 30.5 98 32C98 30.5 99 29.5 101 29.5C104.5 29.5 107 32 107 36C107 42 101 46 98 49Z"
                }
                fill="currentColor"
              />
            ) : (
              <rect
                x={anchorX - 6}
                y="22"
                width="12"
                height="32"
                rx="5"
                fill="currentColor"
              />
            )}
            </Motion.g>
          </Motion.g>
        </Motion.g>
      </Motion.g>
      </Motion.g>
    </Motion.g>
  );
}

export function CitieCharacter({
  expression = "neutral",
  motion: motionMode = "hover",
  paused = false,
  followPointer = true,
  size = "lg",
  label,
  className,
  onPointerEnter,
  onPointerMove,
  onPointerLeave,
  ...props
}: CitieCharacterProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const [hovered, setHovered] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const gazeXTarget = useMotionValue(0);
  const gazeYTarget = useMotionValue(0);
  const gazeX = useSpring(gazeXTarget, { stiffness: 300, damping: 30, mass: 0.42 });
  const gazeY = useSpring(gazeYTarget, { stiffness: 300, damping: 30, mass: 0.42 });
  const bodyXTarget = useMotionValue(0);
  const bodyYTarget = useMotionValue(0);
  const bodyRotateTarget = useMotionValue(0);
  const bodyX = useSpring(bodyXTarget, { stiffness: 125, damping: 13, mass: 0.75 });
  const bodyY = useSpring(bodyYTarget, { stiffness: 125, damping: 13, mass: 0.75 });
  const bodyRotate = useSpring(bodyRotateTarget, { stiffness: 115, damping: 14, mass: 0.75 });
  const bodyScaleX = useTransform(bodyX, (x) => 1 + Math.abs(x) * 0.0035);
  const bodyScaleY = useTransform(bodyY, (y) => 1 - Math.abs(y) * 0.003);
  const reactionControls = useAnimationControls();

  const active = motionMode !== "none" && !paused && !reducedMotion;
  const ambient = active && (motionMode === "always" || motionMode === "ambient" || hovered);
  const canonical = resolveExpression(expression);
  const pose = BLOBATAR_POSES[canonical];
  const ambientAccent = AMBIENT_ACCENTS[canonical];
  const saccades = ambient && !hovered && canonical !== "sleepy";
  const canBlink = canonical !== "sleepy" && canonical !== "happy";
  const eyePulse = canonical === "happy" || canonical === "love" ? 1.13 :
    canonical === "surprised" || canonical === "scared" ? 1.08 : 1;
  const breathStrength = canonical === "sleepy" || canonical === "sad" ? 0.032 : 0.022;

  useEffect(() => {
    if (!active) {
      reactionControls.stop();
      reactionControls.set({ x: 0, y: 0, rotate: 0, scaleX: 1, scaleY: 1 });
      return;
    }

    void reactionControls.start(reactionKeyframes(REACTIONS[canonical]));
    return () => reactionControls.stop();
  }, [active, canonical, expression, reactionControls]);

  useEffect(() => {
    const resetPointer = () => {
      gazeXTarget.set(0);
      gazeYTarget.set(0);
      bodyXTarget.set(0);
      bodyYTarget.set(0);
      bodyRotateTarget.set(0);
    };

    if (!active || !followPointer) {
      resetPointer();
      gazeX.jump(0);
      gazeY.jump(0);
      bodyX.jump(0);
      bodyY.jump(0);
      bodyRotate.jump(0);
      return;
    }

    const trackPointer = (clientX: number, clientY: number) => {
      const bounds = svgRef.current?.getBoundingClientRect();
      if (!bounds?.width || !bounds.height) return;

      // O alvo é o centro óptico da face, mas a escala da resposta é o viewport.
      // Assim o personagem continua seguindo o cursor longe do próprio SVG.
      const faceX = bounds.left + (FACE.x / 128) * bounds.width;
      const faceY = bounds.top + (FACE.y / 88) * bounds.height;
      const horizontal = clamp((clientX - faceX) / (window.innerWidth * 0.43), -1, 1);
      const vertical = clamp((clientY - faceY) / (window.innerHeight * 0.43), -1, 1);
      const sleepyStrength = canonical === "sleepy" ? 0.35 : 1;

      gazeXTarget.set(canonical === "sleepy" ? 0 : horizontal * 4.4);
      gazeYTarget.set(canonical === "sleepy" ? 0 : vertical * 3.1);
      bodyXTarget.set(horizontal * 10.5 * sleepyStrength);
      bodyYTarget.set(vertical * 6.5 * sleepyStrength);
      bodyRotateTarget.set((horizontal * 5 - vertical * 1.2) * sleepyStrength);
    };

    const onWindowPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "touch") trackPointer(event.clientX, event.clientY);
    };
    const onParentPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const frameBounds = window.frameElement?.getBoundingClientRect();
      if (frameBounds) trackPointer(event.clientX - frameBounds.left, event.clientY - frameBounds.top);
    };
    const onVisibilityChange = () => {
      if (document.hidden) resetPointer();
    };

    window.addEventListener("pointermove", onWindowPointerMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);

    // Storybook usa iframe: a prévia e os controles devem formar uma tela só.
    // Em embeds de outra origem, o listener local continua funcionando sozinho.
    let parentWindow: Window | undefined;
    try {
      if (window.parent !== window && window.frameElement) {
        parentWindow = window.parent;
        parentWindow.addEventListener("pointermove", onParentPointerMove, { passive: true });
      }
    } catch {
      parentWindow = undefined;
    }
    return () => {
      window.removeEventListener("pointermove", onWindowPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      parentWindow?.removeEventListener("pointermove", onParentPointerMove);
    };
  }, [active, followPointer, canonical, gazeXTarget, gazeYTarget, bodyXTarget, bodyYTarget, bodyRotateTarget, gazeX, gazeY, bodyX, bodyY, bodyRotate]);

  function handlePointerEnter(event: ReactPointerEvent<SVGSVGElement>) {
    setHovered(true);
    onPointerEnter?.(event);
  }

  function handlePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    onPointerMove?.(event);
  }

  function handlePointerLeave(event: ReactPointerEvent<SVGSVGElement>) {
    setHovered(false);
    onPointerLeave?.(event);
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 128 88"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      data-expression={expression}
      data-motion={motionMode}
      className={cx("h-auto shrink-0 overflow-visible text-text-brand", SIZE_STYLES[size], className)}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      {...props}
    >
      {label ? <title>{label}</title> : null}

      <Motion.g
        data-part="pointer-body"
        style={{ x: bodyX, y: bodyY, rotate: bodyRotate, scaleX: bodyScaleX, scaleY: bodyScaleY, transformOrigin: "64px 44px" }}
      >
      <Motion.g
        data-part="bob"
        initial={false}
        animate={
          ambient
            ? { x: [0, ambientAccent.x, 0], y: [0, ambientAccent.y, 0], rotate: [0, ambientAccent.rotate, 0] }
            : { x: 0, y: 0, rotate: 0 }
        }
        transition={ambient ? { duration: ambientAccent.duration, ease: "easeInOut", repeat: Infinity } : STILL_TRANSITION}
        style={{ transformOrigin: "64px 44px" }}
      >
        <Motion.g
          data-part="breath"
          initial={false}
          animate={ambient ? { scaleX: [1, 1 + breathStrength, 1], scaleY: [1, 1 - breathStrength * 0.82, 1] } : { scaleX: 1, scaleY: 1 }}
          transition={ambient ? { duration: 2.8, ease: "easeInOut", repeat: Infinity } : STILL_TRANSITION}
          style={{ transformOrigin: "64px 44px" }}
        >
          <Motion.g
            data-part="exaggeration"
            initial={false}
            animate={reactionControls}
            style={{ transformOrigin: "64px 44px" }}
          >
            <Motion.g
              data-part="reaction"
              initial={false}
              animate={
                ambient && pose.tremor
                  ? { x: [0, 0, pose.tremor * 2, -pose.tremor * 2, pose.tremor, 0, 0] }
                  : { x: 0 }
              }
              transition={
                ambient && pose.tremor
                  ? { duration: 2.2, ease: "linear", repeat: Infinity, times: [0, 0.54, 0.6, 0.66, 0.72, 0.78, 1] }
                  : STILL_TRANSITION
              }
            >
            <Motion.g
              data-part="body-pose"
              initial={false}
              animate={{ y: pose.bodyY }}
              transition={active ? POSE_TRANSITION : STILL_TRANSITION}
            >
              <path d={BODY_PATH} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />

              <Motion.g
                data-part="saccades"
                initial={false}
                animate={
                  saccades
                    ? {
                        x: [0, 0, -1.8, -1.8, 1.8, 1.8, 0, 0, 1.4, 1.4, -1.2, -1.2],
                        y: [0, 0, -1.2, -1.2, 0, 0, 1.2, 1.2, -1, -1, 0, 0],
                      }
                    : { x: 0, y: 0 }
                }
                transition={
                  saccades
                    ? {
                        duration: 5.6,
                        ease: "linear",
                        repeat: Infinity,
                        times: [0, 0.16, 0.18, 0.32, 0.34, 0.48, 0.5, 0.64, 0.66, 0.8, 0.82, 1],
                      }
                    : STILL_TRANSITION
                }
              >
                <Motion.g data-part="gaze" style={{ x: gazeX, y: gazeY }}>
                  <Eye
                    side="left"
                    pose={pose.left}
                    thinking={Boolean(pose.thinking)}
                    heart={pose.eyeShape === "heart"}
                    smile={pose.eyeShape === "smile"}
                    blink={canBlink && pose.blink !== false}
                    pulse={eyePulse}
                    active={active}
                    ambient={ambient}
                    gazeX={gazeX}
                    gazeY={gazeY}
                  />
                  <Eye
                    side="right"
                    pose={pose.right}
                    thinking={Boolean(pose.thinking)}
                    heart={pose.eyeShape === "heart"}
                    smile={pose.eyeShape === "smile"}
                    blink={canBlink && pose.blink !== false && canonical !== "wink"}
                    pulse={eyePulse}
                    active={active}
                    ambient={ambient}
                    gazeX={gazeX}
                    gazeY={gazeY}
                  />
                </Motion.g>
              </Motion.g>
            </Motion.g>
            </Motion.g>
          </Motion.g>
        </Motion.g>
      </Motion.g>
      </Motion.g>
    </svg>
  );
}

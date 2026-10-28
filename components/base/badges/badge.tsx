import type { HTMLAttributes, Ref } from "react";
import { cx, sortCx } from "@/utils/cx";

/**
 * Referência de layout: dashboard 1 sidebar counters (nodes 3731:2964,
 * 3731:2982).
 *
 * Small numeric counter pill (nav item counts, unread totals).
 *   - 12/16 semibold, tracking 0 (Figma uses font/size/xs + font/leading/4)
 *   - px 4, py 1, radius/sm (4px)
 *   - primary → white fill with brand text (sits on the selected nav item, which is always the accent gradient)
 *   - neutral → bg color/neutral/200, text/secondary
 */

type BadgeColor = "primary" | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  ref?: Ref<HTMLSpanElement>;
}

const styles = sortCx({
  base: "inline-flex items-center justify-center rounded-sm px-1 py-px text-caption-1-semibold tracking-normal whitespace-nowrap",
  color: {
    primary: "bg-white text-accent-600",
    neutral: "bg-badge-neutral-background text-text-secondary",
  },
});

export function Badge({ color = "neutral", className, ref, ...props }: BadgeProps) {
  return (
    <span
      ref={ref}
      className={cx(styles.base, styles.color[color], className)}
      {...props}
    />
  );
}

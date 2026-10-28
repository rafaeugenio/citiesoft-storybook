"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";
import { useCallback, useEffect, useId, useMemo, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { RiArrowDownSLine } from "@remixicon/react";
import { motion } from "motion/react";
import {
  GuideBridge,
  LogRow,
  WorkingRow,
  SOFT_EASE,
  ShimmerText,
  UNIT_ANIMATE,
  UNIT_INITIAL,
  UNIT_TRANSITION,
  useLogMotion,
  useRevealMask,
  useRevealTicker,
} from "@/components/application/agent-log/agent-log";
import {
  SOCIAL_PROVIDERS,
  type SocialProvider,
} from "@/components/base/social-button/social-providers";
import { cx } from "@/utils/cx";

/**
 * Web Search — what the agent looked at, as it looks.
 *
 * The research counterpart to Task List: where that one logs work the agent
 * did, this one logs where it went. Each step is a query it ran or a page it
 * opened, and a step can carry the sources it surfaced, listed underneath with
 * their real marks so the reader recognises a Reddit thread or an X post
 * without reading the domain.
 *
 * Streaming, reveal and the curved guide all come from Agent Log, so this and
 * Task List move as one and can sit in the same thread without looking like two
 * different products.
 *
 * The trail is a sequence, so the steps are a flat list; a step that found
 * something branches once more to show its sources, and the guide carries that
 * second level the same way it carries the first.
 */

/* ----------------------------------------------------------------- types */

/** Any brand the design system already draws — 24 of them, real artwork. */
export type WebSearchBrand = SocialProvider;

export interface WebSearchSource {
  title: string;
  /** Shown on the right, e.g. `www.pcgamer.com`. */
  domain: string;
  href?: string;
  /** Draws that site's real mark in its own colour. */
  brand?: WebSearchBrand;
  /**
   * A glyph for anything outside the 24 brand marks — Tailwind, a docs site, a
   * customer's own product. Supplied ready-made and sized by the caller, so it
   * is not limited to what the design system happens to draw. Takes precedence
   * over `brand`.
   */
  icon?: ReactNode;
}

export interface WebSearchStep {
  /** The line, e.g. `Searched X for` or `Ran 3 searches`. */
  label: string;
  /** Query fragment set in mono after the label, as the agent sent it. */
  query?: string;
  /** Leading glyph. `brand` draws a real site mark; `icon` takes anything else. */
  brand?: WebSearchBrand;
  icon?: ComponentType<{ className?: string }>;
  /** Right-aligned tally, e.g. `7 posts` or `5 results`. */
  meta?: string;
  /**
   * Milliseconds this step holds before the next one arrives, for work that
   * plainly took longer than a tick. Falls back to `stepInterval`. A step
   * shimmers for as long as it is the newest, so a longer dwell is what makes
   * a search read as a search rather than as a list being printed.
   */
  dwell?: number;
  /** What the step turned up. Branches into a Sources row beneath it. */
  sources?: WebSearchSource[];
  /**
   * Marks this step as the head of the trail. Only the first step can be one.
   * It takes no branch of its own and everything after it nests beneath, so the
   * guide descends from its glyph and the opening line reads as the title the
   * search hangs off. A heading does not carry `sources`.
   */
  heading?: boolean;
}

export interface WebSearchProps {
  steps: WebSearchStep[];
  /** Pauses and resumes. Change the element `key` to replay from the top. */
  run?: boolean;
  /** Milliseconds between reveals. Default 850. */
  stepInterval?: number;
  /** Milliseconds before the first reveal. Default 320. */
  startDelay?: number;
  /** Drive the reveal from real events; disables the internal timer. */
  revealed?: number;
  /**
   * The indicator that sits at the tail of the trail while the search is still
   * running, so the log always ends on the thing being worked on rather than on
   * the last thing finished. Pass a label to change it, or `false` to drop it.
   */
  working?: string | false;
  /** Fires once, after the last step lands. */
  onComplete?: () => void;
  className?: string;
}

/* ------------------------------------------------------------- internals */

/**
 * Marks whose brand colour is black or near-black. Painted in their own colour
 * they vanish on a dark surface, so they take the text colour instead and
 * invert with the theme, which is what their own guidelines ask for anyway.
 */
const MONOCHROME_BRANDS = new Set<WebSearchBrand>(["x", "github", "apple", "notion"]);

function BrandMark({ brand, className }: { brand: WebSearchBrand; className?: string }) {
  const meta = SOCIAL_PROVIDERS[brand];
  return (
    <svg
      aria-hidden
      viewBox={meta.viewBox}
      className={cx("shrink-0", className)}
      style={MONOCHROME_BRANDS.has(brand) ? undefined : { color: meta.brand }}
    >
      <path d={meta.path} fill="currentColor" />
    </svg>
  );
}

/** The step's leading glyph: a site's own mark, or a supplied icon. */
function StepGlyph({ step }: { step: WebSearchStep }) {
  if (step.brand) {
    // A brand mark is solid to the edge of its box while an outline icon is
    // mostly air, so at a matching box size the logo reads noticeably heavier.
    // Drawing it smaller inside the same 16px slot evens the two out and keeps
    // every row's glyph on one axis.
    return (
      <span
        aria-hidden
        className="mt-0.5 flex size-4 shrink-0 items-center justify-center"
      >
        <BrandMark brand={step.brand} className="size-[13px] text-text-primary" />
      </span>
    );
  }
  const Icon = step.icon;
  if (!Icon) return <span aria-hidden className="mt-0.5 size-4 shrink-0" />;
  return <Icon className="mt-0.5 size-4 shrink-0 text-foreground-icon-secondary" />;
}

/* From the underside of the step's 16px glyph down to the top of the nested
 * list. Measured, not guessed: run it from the glyph's centre instead and the
 * stroke draws straight through the icon. */
const SOURCES_BRIDGE = 5;

/* Nested indent. A 1px trunk sitting at the glyph's exact centre straddles the
 * boundary and reads a pixel right of it, so it comes back one to land on the
 * glyph's own axis. */
const SOURCES_INDENT = 7;

/* How many marks the collapsed stack shows before the rest become a count. */
const STACK_LIMIT = 6;

/* Milliseconds between one link opening and the next. */
const ROW_STAGGER = 100;
const ROW_LEAD = 100;
/* Retracting used to run at 60ms, which bunched all five returns into one
 * overlapping flight and let the stack's width outrun the marks filling it.
 * Matching the opening cadence keeps each arrival its own moment. */
const ROW_CLOSE = 100;

/* Seconds the text waits before fading in. Just enough that a title never
 * beats its mark out of the stack, after which the two travel together and
 * settle on the same frame — the mark's spring is still easing into place while
 * the title finishes. */
const TEXT_DELAY = 0.05;
const TEXT_FADE = 0.16;

const FLIGHT_TRANSITION = { type: "spring" as const, stiffness: 420, damping: 36 };

/* The stack's width is told about a mark the instant it is reassigned, while
 * the mark itself still has the whole flight ahead of it. On the same spring
 * with no lag the width therefore leads, and closing read as the chevron
 * reaching the far right while marks were still on their way home. A beat of
 * lag puts it behind them instead, which is the side to err on. */
const STACK_LAG = 0.07;

/**
 * One source's mark. Collapsed it sits in the stack; expanded it sits beside
 * its link — and because both render the same `layoutId`, it is the same
 * element in both places, so a mark flies from the stack to its row rather
 * than one copy crossfading into another.
 *
 * Nothing here is scheduled. A mark moves at the moment its row opens, so the
 * whole sequence is driven by one counter rather than by delays that would
 * have to be kept in step with it.
 */
function SourceMark({
  source,
  layoutId,
  z,
}: {
  source: WebSearchSource;
  layoutId?: string;
  z: number;
}) {
  return (
    <motion.span
      layoutId={layoutId}
      transition={FLIGHT_TRANSITION}
      style={{ zIndex: z }}
      className="relative flex size-5 shrink-0 items-center justify-center rounded-full border border-border-button-default bg-background-primary-default"
    >
      {source.icon ? (
        <span aria-hidden className="flex size-3 items-center justify-center">
          {source.icon}
        </span>
      ) : source.brand ? (
        <BrandMark brand={source.brand} className="size-3 text-text-primary" />
      ) : (
        <span aria-hidden className="size-2 rounded-full bg-background-quaternary-default" />
      )}
    </motion.span>
  );
}

function SourceLinkRow({
  source,
  visible,
  layoutId,
  z,
  reduce,
}: {
  source: WebSearchSource;
  visible: boolean;
  layoutId?: string;
  z: number;
  reduce: boolean;
}) {
  const Row = source.href ? "a" : "div";
  return (
    <motion.li
      initial={false}
      animate={{ height: visible ? "auto" : 0 }}
      transition={{ duration: reduce ? 0 : 0.28, ease: SOFT_EASE }}
      className="overflow-hidden"
    >
      <Row
        {...(source.href ? { href: source.href, target: "_blank", rel: "noreferrer" } : {})}
        className={cx(
          "flex items-center gap-2 rounded-md px-1 py-1",
          source.href &&
            "cursor-pointer transition-colors duration-150 ease hover:bg-background-secondary-default",
        )}
      >
        {visible ? (
          <SourceMark source={source} layoutId={layoutId} z={z} />
        ) : (
          <span aria-hidden className="size-5 shrink-0" />
        )}
        <motion.span
          initial={false}
          animate={{ opacity: visible ? 1 : 0 }}
          transition={{ duration: TEXT_FADE, delay: visible && !reduce ? TEXT_DELAY : 0 }}
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          <span className="min-w-0 flex-1 truncate text-body-regular text-text-secondary">
            {source.title}
          </span>
          <span className="hidden shrink-0 text-caption-1-regular text-text-secondary sm:block">
            {source.domain}
          </span>
        </motion.span>
      </Row>
    </motion.li>
  );
}

/**
 * The sources a step found: marks first, the links themselves behind a chevron.
 *
 * Collapsed is the state that matters — mid-run a reader wants to know where
 * the agent looked, not to read five titles. Expanded stays deliberately quiet:
 * no card, no borders, just rows.
 *
 * One counter runs the whole thing. `shown` opens rows from the bottom up, so
 * the mark that leaves the stack first is its rightmost, and each next link
 * lands above the one before it. Because every row animates its own height,
 * the panel grows a row at a time instead of jumping to its full size and
 * leaving marks to arrive into empty space — which is the thing that made this
 * feel unfinished. The titles wait out the flight so a line never sits there
 * without its mark.
 */
function SourcesRow({
  sources,
  reduce,
}: {
  sources: WebSearchSource[];
  reduce: boolean;
}) {
  const localize = useTemplateCopy();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(0);
  const uid = useId();

  const total = sources.length;

  // Opening walks up the list, closing walks back down. Both go one row per
  // tick, so the panel and the stack are always describing the same moment.
  useEffect(() => {
    if (open && shown >= total) return;
    if (!open && shown === 0) return;
    const delay = open ? (shown === 0 ? ROW_LEAD : ROW_STAGGER) : ROW_CLOSE;
    const id = window.setTimeout(
      () => setShown((n) => (open ? n + 1 : n - 1)),
      reduce ? 0 : delay,
    );
    return () => window.clearTimeout(id);
  }, [open, shown, total, reduce]);

  const stacked = sources.slice(0, STACK_LIMIT);
  const overflow = total - stacked.length;
  // Rows open from the bottom, so the last source is the first to leave.
  const rowVisible = (index: number) => shown > total - 1 - index;
  // Marks past the stack have nowhere to fly from, so they simply appear.
  const flightId = (index: number) =>
    reduce || index >= STACK_LIMIT ? undefined : `${uid}-source-${index}`;

  // A 20px mark plus 14px for every one behind it, from those still in the
  // stack. Zero once they have all gone, so the chevron closes right up.
  const stillStacked = stacked.filter((_, index) => !rowVisible(index)).length;
  const stackWidth = stillStacked > 0 ? stillStacked * 14 + 6 : 0;

  return localize((
    <LogRow first={false} last reduce={reduce}>
      <div className="py-1">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="group flex cursor-pointer items-center rounded-md text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
        >
          <span className="text-body-regular text-text-secondary">Sources</span>
          {/* Width is animated as marks come and go rather than held or dropped.
              Held, the chevron would sit beside an empty gap once the stack had
              emptied; dropped, it would snap inward the instant the first mark
              took off.

              It runs on the flight's own spring, not a duration. A mark and the
              width it occupies are one movement, and a tuned duration only ever
              approximates a spring: on the way out that read as the chevron
              reaching the far right while marks were still flying home. Sharing
              the transition, the chevron and the stack arrive together in both
              directions by construction. */}
          <motion.span
            className="ms-2 flex items-center"
            initial={false}
            animate={{ width: stackWidth }}
            transition={
              reduce ? { duration: 0 } : { ...FLIGHT_TRANSITION, delay: STACK_LAG }
            }
          >
            <span className="flex items-center -space-x-1.5">
              {stacked.map((source, index) =>
                rowVisible(index) ? null : (
                  <SourceMark
                    key={`${source.domain}-${index}`}
                    source={source}
                    layoutId={flightId(index)}
                    z={stacked.length - index}
                  />
                ),
              )}
            </span>
            {overflow > 0 && shown === 0 ? (
              <span className="ms-2 text-body-regular text-text-secondary tabular-nums">
                +{overflow}
              </span>
            ) : null}
          </motion.span>
          <RiArrowDownSLine
            aria-hidden
            className={cx(
              "ms-1 size-4 shrink-0 text-foreground-icon-quaternary transition-transform duration-300 ease group-hover:text-foreground-icon-secondary",
              open ? "rotate-180" : "rotate-0",
            )}
          />
        </button>

        <ul className="flex flex-col">
          {sources.map((source, index) => (
            <SourceLinkRow
              key={`${source.domain}-${index}`}
              source={source}
              visible={rowVisible(index)}
              layoutId={flightId(index)}
              z={total - index}
              reduce={reduce}
            />
          ))}
        </ul>
      </div>
    </LogRow>
  ));
}

/** The line itself: glyph, label, an optional query, an optional tally. */
function StepContent({ step, active }: { step: WebSearchStep; active: boolean }) {
  return (
    <div className="flex items-start gap-2">
      <StepGlyph step={step} />
      <p className="min-w-0 flex-1 text-body-regular text-text-secondary">
        {active ? <ShimmerText>{step.label}</ShimmerText> : step.label}
        {step.query ? (
          <span className="ms-1.5 font-mono text-caption-1-regular text-text-secondary">
            {step.query}
          </span>
        ) : null}
      </p>
      {step.meta ? (
        <span className="shrink-0 pt-px text-body-regular text-text-secondary tabular-nums">
          {step.meta}
        </span>
      ) : null}
    </div>
  );
}

function StepRow({
  step,
  active,
  first,
  last,
  showSources,
  reduce,
}: {
  step: WebSearchStep;
  active: boolean;
  first: boolean;
  last: boolean;
  showSources: boolean;
  reduce: boolean;
}) {
  return (
    /* A step leads with a glyph, and a glyph's ink starts inside its box, so the
       stub-to-content gap reads wider here than on the text rows the default
       padding was set for. Two pixels back closes that up. */
    <LogRow first={first} last={last} reduce={reduce} className="ps-[14px]">
      <div className="py-1">
        <StepContent step={step} active={active} />
        {step.sources?.length && showSources ? (
          /* The bridge carries the trunk up to this row's glyph, so the sources
             descend from the step that found them rather than starting in
             mid-air beneath it. */
          <div className="relative mt-0.5">
            <GuideBridge
              height={SOURCES_BRIDGE}
              offset={SOURCES_INDENT}
              reduce={reduce}
            />
            <ul className="flex flex-col" style={{ marginInlineStart: SOURCES_INDENT }}>
              <SourcesRow sources={step.sources} reduce={reduce} />
            </ul>
          </div>
        ) : null}
      </div>
    </LogRow>
  );
}

/**
 * The root of the trail. It carries no branch of its own — the guide descends
 * *from* its glyph into everything below, which is what makes the opening line
 * read as a title rather than as a leaf hanging off a line that starts in
 * mid-air above it.
 */
function HeadingRow({
  step,
  active,
  reduce,
}: {
  step: WebSearchStep;
  active: boolean;
  reduce: boolean;
}) {
  const mask = useRevealMask(reduce);
  return (
    <motion.div
      initial={reduce ? false : UNIT_INITIAL}
      animate={UNIT_ANIMATE}
      transition={UNIT_TRANSITION}
      {...mask}
      className="overflow-hidden"
    >
      <div className="py-1">
        <StepContent step={step} active={active} />
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------ component */

/* Where the nested trail's trunk sits, measured from the component's left edge.
 * The heading's glyph runs 0-16, so its centre is 8; a 1px line at 7 lands on
 * that axis rather than straddling the boundary a pixel right of it. */
const HEAD_INDENT = 7;

/* From the underside of the heading's glyph to the top of the trail below it. */
const HEAD_BRIDGE = 6;

/* A step and its sources are two rows, so they are two units: the sources land
 * a beat after the step that found them rather than with it. */
const SOURCES_BEAT = 900;

interface Unit {
  step: number;
  kind: "step" | "sources";
}

export function WebSearch({
  steps,
  run = true,
  stepInterval = 850,
  startDelay = 320,
  revealed: controlledRevealed,
  working = "Working",
  onComplete,
  className,
}: WebSearchProps) {
  const reduce = useLogMotion();

  // Every row is a unit, so a step that found sources contributes two and the
  // log can pause between them.
  const units = useMemo<Unit[]>(
    () =>
      steps.flatMap((step, index) =>
        step.sources?.length && !step.heading
          ? [
              { step: index, kind: "step" as const },
              { step: index, kind: "sources" as const },
            ]
          : [{ step: index, kind: "step" as const }],
      ),
    [steps],
  );
  /* One tick past the last row. The final step would otherwise stop shimmering
   * on the same frame it appears, and the log would call itself finished while
   * the agent is still reading what it just found. That extra tick is the last
   * step's own dwell, so it holds, shimmers, and keeps the indicator until the
   * work it describes would plausibly be done.
   *
   * Only when uncontrolled: a caller driving `revealed` from real events knows
   * when the agent is actually finished and would otherwise be stuck shimmering
   * with no row left to advance to. */
  const isControlled = controlledRevealed !== undefined;
  const total = units.length + (isControlled ? 0 : 1);

  // How long to sit on the unit before this one. A step with sources holds only
  // the short beat before they arrive; the step's own dwell runs after them.
  const delayFor = useCallback(
    (index: number) => {
      if (index === 0) return startDelay;
      const previous = units[index - 1];
      if (!previous) return stepInterval;
      const step = steps[previous.step];
      if (previous.kind === "step" && step.sources?.length && !step.heading) {
        return SOURCES_BEAT;
      }
      return step.dwell ?? stepInterval;
    },
    [units, steps, startDelay, stepInterval],
  );

  const revealed = useRevealTicker({
    total,
    run,
    startDelay,
    stepInterval,
    revealed: controlledRevealed,
    delayFor,
    onComplete,
  });

  const unitOf = (stepIndex: number, kind: Unit["kind"]) =>
    units.findIndex((u) => u.step === stepIndex && u.kind === kind);

  // A leading heading is the root the trail hangs from, so it is drawn without
  // a branch of its own and everything after it nests underneath.
  const head = steps[0]?.heading ? steps[0] : null;
  const trail = head ? steps.slice(1) : steps;
  const offset = head ? 1 : 0;

  const shownSteps = trail.filter((_, i) => revealed > unitOf(i + offset, "step"));
  const lastShownIndex = shownSteps.length - 1;
  const busy = working !== false && revealed > 0 && revealed < total;

  const list = (
    <ul aria-live="polite" className="flex flex-col">
      {trail.map((step, index) => {
        const stepIndex = index + offset;
        const unit = unitOf(stepIndex, "step");
        if (revealed <= unit) return null;
        const sourcesUnit = unitOf(stepIndex, "sources");
        return (
          <StepRow
            key={`${step.label}-${stepIndex}`}
            step={step}
            // Still the newest thing in the log, sources pending included.
            active={!reduce && index === lastShownIndex && revealed < total}
            first={index === 0}
            last={index === lastShownIndex}
            showSources={sourcesUnit === -1 ? false : revealed > sourcesUnit}
            reduce={reduce}
          />
        );
      })}
    </ul>
  );



  /* The indicator sits outside the trail, on the heading's own left edge. It
     is not something the search found, so nesting it under the trail would
     file it as one more result; level with the title, it reads as the log
     still running. Without a heading there is nothing to align to, so it falls
     back to the step glyphs' edge. */
  const indicator = busy ? (
    <WorkingRow
      label={working}
      reduce={reduce}
      className={head ? undefined : "ps-[14px]"}
    />
  ) : null;

  if (!head) {
    return (
      <div className={cx("w-full", className)}>
        {list}
        {indicator}
      </div>
    );
  }

  return (
    <div className={cx("flex w-full flex-col", className)}>
      {revealed > 0 ? (
        <HeadingRow step={head} active={!reduce && revealed === 1 && total > 1} reduce={reduce} />
      ) : null}
      {revealed > 1 ? (
        <div className="relative">
          <GuideBridge height={HEAD_BRIDGE} offset={HEAD_INDENT} reduce={reduce} />
          <div style={{ marginInlineStart: HEAD_INDENT }}>{list}</div>
        </div>
      ) : null}
      {indicator}
    </div>
  );
}

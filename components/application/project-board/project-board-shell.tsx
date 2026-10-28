"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";
import { useDirection } from "@/components/foundations/direction/direction";
import { useState } from "react";
import { motion } from "motion/react";

import { DashboardSidebar } from "@/components/application/dashboard/dashboard-sidebar";
import { cx } from "@/utils/cx";
import { ProjectBoard } from "./project-board";

/**
 * Referência de layout: kanbanboard (node 4472:12159, 1440×900).
 *
 * The layout follows the Figma frame: 12px floating sidebar
 * inset, content at x=296, 24px header inset, 10px header-to-board gap, and
 * five 273px columns, expanding equally to fill spare space above 1440px.
 * The board scrolls horizontally when they do not fit, with scrollable gutters
 * extending to both edges of the main area; navigation
 * moves into the shared mobile drawer below the sidebar breakpoint.
 */
export function ProjectBoardShell({ contained = false }: { contained?: boolean } = {}) {
  const localize = useTemplateCopy();
  const direction = useDirection();
  const [mobileOpen, setMobileOpen] = useState(false);

  return localize((
    <div
      className={cx(
        "relative flex w-full overflow-hidden bg-background-full",
        contained ? "h-[var(--template-preview-height)]" : "h-dvh",
      )}
    >

      <div
        className={cx(
          "sticky top-3 z-10 hidden shrink-0 ps-3 lg:block",
          contained ? "h-[calc(var(--template-preview-height)-24px)]" : "h-[calc(100dvh-24px)]",
        )}
      >
        <DashboardSidebar selected="project-board" />
      </div>

      <div
        className={cx(
          "start-0 z-10 flex w-[272px] py-3 ps-[6px] lg:hidden",
          contained ? "absolute top-0 h-[var(--template-preview-height)]" : "fixed inset-y-0",
        )}
        aria-hidden={!mobileOpen}
      >
        <motion.div
          initial={false}
          animate={{ scale: mobileOpen ? 1 : 0.94, opacity: mobileOpen ? 1 : 0 }}
          transition={{ duration: 0.325, ease: [0.42, 0, 0.58, 1] }}
          className={cx(
            "h-full w-[260px] origin-left rtl:origin-right will-change-transform",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <DashboardSidebar
            mobile
            flat
            selected="project-board"
            onClose={() => setMobileOpen(false)}
          />
        </motion.div>
      </div>

      <motion.main
        initial={false}
        animate={{ x: mobileOpen ? (direction === "rtl" ? -272 : 272) : 0, borderRadius: mobileOpen ? 32 : 0 }}
        transition={{ duration: 0.325, ease: [0.42, 0, 0.58, 1] }}
        className="relative z-20 flex min-h-0 min-w-0 flex-1 overflow-hidden bg-background-full p-3 will-change-transform sm:px-6 sm:pt-6 sm:pb-[22px] lg:z-0 lg:!transform-none lg:!rounded-none lg:pe-7"
      >
        <motion.button
          type="button"
          aria-label="Close navigation"
          tabIndex={mobileOpen ? 0 : -1}
          onClick={() => setMobileOpen(false)}
          initial={false}
          animate={{ opacity: mobileOpen ? 1 : 0 }}
          transition={{ duration: 0.325, ease: [0.42, 0, 0.58, 1] }}
          className={cx(
            "absolute inset-0 z-50 cursor-pointer rounded-[inherit] bg-black/10 dark:bg-white/5 lg:hidden",
            mobileOpen ? "pointer-events-auto" : "pointer-events-none",
          )}
        />
        <ProjectBoard onMenuClick={() => setMobileOpen(true)} />
      </motion.main>
    </div>
  ));
}

"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import { useDirection } from "@/components/foundations/direction/direction";
import { useState } from "react";
import { motion } from "motion/react";
import { AreaChartCard } from "@/components/application/charts/area-chart-card";
import { BarListCard } from "@/components/application/charts/bar-list-card";
import { ComboChartCard } from "@/components/application/charts/combo-chart-card";
import { FunnelChartCard } from "@/components/application/charts/funnel-chart-card";
import { RadialChartCard } from "@/components/application/charts/radial-chart-card";
import { DashboardSidebar } from "@/components/application/dashboard/dashboard-sidebar";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import { CampaignsTable } from "@/components/application/marketing/campaigns-table";
import {
  compactNumber,
  currency,
  FUNNEL_RANGES,
  MARKETING_STATS,
  ROAS_LINE,
  SPEND_BAR,
  SPEND_RANGES,
  SPEND_ROAS_RANGES,
  TRAFFIC_TABS,
  VISITOR_RANGES,
  VISITOR_SERIES,
} from "@/components/application/marketing/marketing-data";
import { MarketingHeader } from "@/components/application/marketing/marketing-header";
import { cx } from "@/utils/cx";

/**
 * Marketing analytics template — same floating sidebar / mobile-drawer shell
 * as `DashboardShell` and `MedicalShell`. KPI stat cards, then a 3-up row
 * (acquisition funnel, spend-by-channel half gauge, traffic sources bar
 * list), a 2-up row (ad spend vs. ROAS combo, visitors-by-channel area),
 * and the campaigns data table.
 */
export function MarketingShell({ contained = false }: { contained?: boolean } = {}) {
  const localize = useTemplateCopy();
  const direction = useDirection();
  const [mobileOpen, setMobileOpen] = useState(false);

  return localize((
    <div
      className={cx(
        "relative flex w-full bg-background-full max-lg:overflow-hidden",
        contained && "overflow-hidden",
        contained
          ? "h-[var(--template-preview-height)]"
          : "h-dvh lg:h-auto lg:min-h-screen",
      )}
    >
      {/* Desktop sidebar (in-flow) */}
      <div
        className={cx(
          "sticky top-3 z-10 hidden shrink-0 py-0 ps-3 lg:block",
          contained
            ? "h-[calc(var(--template-preview-height)-24px)]"
            : "h-[calc(100vh-24px)]",
        )}
      >
        <DashboardSidebar selected="marketing" />
      </div>

      {/* Mobile sidebar remains beneath the marketing dashboard content. */}
      <div
        className={cx(
          "start-0 z-10 flex w-[272px] py-3 ps-[6px] lg:hidden",
          contained
            ? "absolute top-0 h-[var(--template-preview-height)]"
            : "fixed inset-y-0",
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
            selected="marketing"
            onClose={() => setMobileOpen(false)}
          />
        </motion.div>
      </div>

      <motion.main
        initial={false}
        animate={{ x: mobileOpen ? (direction === "rtl" ? -272 : 272) : 0, borderRadius: mobileOpen ? 32 : 0 }}
        transition={{ duration: 0.325, ease: [0.42, 0, 0.58, 1] }}
        className={cx(
          "relative z-20 flex min-w-0 flex-1 justify-center overflow-x-hidden overflow-y-auto bg-background-full p-3 will-change-transform sm:pt-6 lg:z-0 lg:!transform-none lg:!rounded-none",
          // Contained, the frame around this is a fixed window: the main
          // column keeps its own scrollbar so the rail beside it stays put,
          // instead of the whole shell scrolling and dragging the rail off
          // the top. Standalone, the page scrolls as it should.
          !contained && "lg:overflow-visible",
        )}
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
        <div className="flex w-full max-w-[1300px] flex-col gap-2.5">
          <MarketingHeader onMenuClick={() => setMobileOpen(true)} />
          <div className="flex w-full flex-col gap-4">
            {/* One per row on phones — every other block below starts at a
                single column too, and a 2-up KPI grid at 390px crushes the
                values. Back to the shared 2-up from sm, 4-up from lg. */}
            <StatCards stats={MARKETING_STATS} className="max-sm:grid-cols-1" />
            {/* 3-up chart row: at md (tablet) the cards flow 2-per-row with
                the bar list stretched across the empty cell; xl is 3 across. */}
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <FunnelChartCard
                title="Acquisition funnel"
                ranges={FUNNEL_RANGES}
                defaultRange="30d"
                format={compactNumber}
              />
              <RadialChartCard
                variant="stacked"
                title="Spend by channel"
                ranges={SPEND_RANGES}
                defaultRange="30d"
                format={currency}
              />
              <BarListCard
                tabs={TRAFFIC_TABS}
                metricLabel="Sessions"
                className="md:col-span-2 xl:col-span-1"
              />
            </div>
            {/* 2-up row: both cards carry stat tiles, so they grow together. */}
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2">
              <ComboChartCard
                title="Ad spend"
                bar={SPEND_BAR}
                line={ROAS_LINE}
                ranges={SPEND_ROAS_RANGES}
                tiles
              />
              <AreaChartCard
                title="Visitors"
                series={VISITOR_SERIES}
                ranges={VISITOR_RANGES}
                tiles
              />
            </div>
            <CampaignsTable />
          </div>
        </div>
      </motion.main>
    </div>
  ));
}

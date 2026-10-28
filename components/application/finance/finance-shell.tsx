"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import { useDirection } from "@/components/foundations/direction/direction";
import { useState } from "react";
import { motion } from "motion/react";
import { HeatmapChartCard } from "@/components/application/charts/heatmap-chart-card";
import { RadialChartCard } from "@/components/application/charts/radial-chart-card";
import { SankeyChartCard } from "@/components/application/charts/sankey-chart-card";
import { ScatterChartCard } from "@/components/application/charts/scatter-chart-card";
import { DashboardSidebar } from "@/components/application/dashboard/dashboard-sidebar";
import { StatCards } from "@/components/application/dashboard/stat-cards";
import {
  CASH_FLOW_RANGES,
  currency,
  FINANCE_STATS,
  percent,
  PORTFOLIO_RANGES,
  SPENDING_HEAT_RANGES,
  SPENDING_RANGES,
} from "@/components/application/finance/finance-data";
import { FinanceHeader } from "@/components/application/finance/finance-header";
import { TransactionsTable } from "@/components/application/finance/transactions-table";
import { cx } from "@/utils/cx";

/**
 * Finance template — same floating sidebar / mobile-drawer shell as
 * `DashboardShell` and `MedicalShell`. KPI stat cards, a full-width
 * cash-flow sankey, a 3-up row (spending rings, portfolio bubbles, daily
 * spending heatmap), and the transactions data table.
 */
export function FinanceShell({ contained = false }: { contained?: boolean } = {}) {
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
        <DashboardSidebar selected="finance" />
      </div>

      {/* Mobile sidebar remains beneath the finance dashboard content. */}
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
            selected="finance"
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
          <FinanceHeader onMenuClick={() => setMobileOpen(true)} />
          <div className="flex w-full flex-col gap-4">
            <StatCards stats={FINANCE_STATS} />
            {/* Hero card: where the money comes from and where it goes. */}
            <SankeyChartCard
              title="Cash flow"
              ranges={CASH_FLOW_RANGES}
              format={currency}
              axisLabels={["Income", "Spending"]}
            />
            {/* 3-up chart row: at md (tablet) the cards flow 2-per-row with
                the heatmap stretched across the empty cell; xl is 3 across. */}
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              <RadialChartCard
                title="Spending by category"
                ranges={SPENDING_RANGES}
                format={currency}
              />
              <ScatterChartCard
                title="Portfolio"
                ranges={PORTFOLIO_RANGES}
                axisLabels={["Risk score", "Return"]}
                format={percent}
              />
              <HeatmapChartCard
                title="Daily spending"
                ranges={SPENDING_HEAT_RANGES}
                format={currency}
                columnLabelEvery={2}
                className="md:col-span-2 xl:col-span-1"
              />
            </div>
            <TransactionsTable />
          </div>
        </div>
      </motion.main>
    </div>
  ));
}

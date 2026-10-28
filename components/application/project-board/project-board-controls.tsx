"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import { useState } from "react";
import { RiCheckLine, RiEqualizerLine, RiSideBarLine, RiSortDesc } from "@remixicon/react";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Dropdown, DropdownItem, DropdownPopover, DropdownTrigger } from "@/components/base/dropdown/dropdown";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import type { TicketPriority } from "./project-board-data";

export type BoardSort = "manual" | "priority" | "title";
const TRIGGER = "relative flex size-9 shrink-0 items-center justify-center rounded-2lg border border-border-button-default bg-background-primary-default text-foreground-icon-primary shadow-xs transition-colors hover:border-border-button-hover hover:bg-background-primary-hover";
const MENU = "w-[220px] rounded-[14px] p-1";
const ROW = "rounded-2lg px-2 py-1.5 text-body-medium";

/** Private toolbar for the Project Board template. */
export function ProjectBoardControls({ sort, onSort, priority, onPriority, project, onProject, showDone, onShowDone, fillColumns, onFillColumns }: {
  sort: BoardSort;
  onSort: (sort: BoardSort) => void;
  priority: TicketPriority | "all";
  onPriority: (priority: TicketPriority | "all") => void;
  project: string;
  onProject: (project: string) => void;
  showDone: boolean;
  onShowDone: (show: boolean) => void;
  fillColumns: boolean;
  onFillColumns: (fill: boolean) => void;
}) {
  const localize = useTemplateCopy();
  const [sortOpen, setSortOpen] = useState(false);
  const filtered = priority !== "all" || project !== "all";
  return localize(<div className="flex items-center gap-2" role="group" aria-label="Board controls">
    <Dropdown isOpen={sortOpen} onOpenChange={setSortOpen}>
      <TooltipTrigger delay={200}>
        <DropdownTrigger aria-label="Sort tickets" className={TRIGGER}>
          <RiSortDesc className="size-5" aria-hidden />
          {sort !== "manual" && <span aria-hidden className="absolute -top-0.5 -end-0.5 size-2 rounded-full bg-accent-500 ring-2 ring-background-full" />}
        </DropdownTrigger>
        <Tooltip placement="bottom">Sort</Tooltip>
      </TooltipTrigger>
      <DropdownPopover aria-label="Sort tickets" placement="bottom end" className={MENU}>
        {([{ id: "manual", label: "Manual order" }, { id: "priority", label: "Priority" }, { id: "title", label: "Title" }] as const).map(option =>
          <DropdownItem key={option.id} selected={sort === option.id} className={ROW} onSelect={() => { onSort(option.id); setSortOpen(false); }}>
            <span className="flex-1">{option.label}</span>{sort === option.id && <RiCheckLine className="size-4" aria-hidden />}
          </DropdownItem>)}
      </DropdownPopover>
    </Dropdown>
    <Dropdown>
      <TooltipTrigger delay={200}>
        <DropdownTrigger aria-label="Filter tickets" className={TRIGGER}>
          <RiEqualizerLine className="size-5" aria-hidden />
          {filtered && <span aria-hidden className="absolute -top-0.5 -end-0.5 size-2 rounded-full bg-accent-500 ring-2 ring-background-full" />}
        </DropdownTrigger>
        <Tooltip placement="bottom">Filter</Tooltip>
      </TooltipTrigger>
      <DropdownPopover aria-label="Filter tickets" placement="bottom end" className={MENU}>
        <p className="px-2 pt-2 pb-1 text-body-2-medium text-text-tertiary">Priority</p>
        {(["all", "Low", "Medium", "High", "Urgent"] as const).map(value =>
          <DropdownItem key={value} selected={priority === value} className={ROW} onSelect={() => onPriority(value)}>
            <span className="flex-1">{value === "all" ? "All priorities" : value}</span>{priority === value && <RiCheckLine className="size-4" aria-hidden />}
          </DropdownItem>)}
        <p className="px-2 pt-2 pb-1 text-body-2-medium text-text-tertiary">Project</p>
        {["all", "TFD", "SIGEP", "Citiesoft"].map(value =>
          <DropdownItem key={value} selected={project === value} className={ROW} onSelect={() => onProject(value)}>
            <span className="flex-1">{value === "all" ? "All projects" : value}</span>{project === value && <RiCheckLine className="size-4" aria-hidden />}
          </DropdownItem>)}
        {filtered && <DropdownItem className={ROW} onSelect={() => { onPriority("all"); onProject("all"); }}>Clear filters</DropdownItem>}
      </DropdownPopover>
    </Dropdown>
    <Dropdown>
      <TooltipTrigger delay={200}>
        <DropdownTrigger aria-label="Display options" className={TRIGGER}><RiSideBarLine className="size-5" aria-hidden /></DropdownTrigger>
        <Tooltip placement="bottom">Display</Tooltip>
      </TooltipTrigger>
      <DropdownPopover aria-label="Display options" placement="bottom end" className={MENU}>
        <Checkbox isSelected={showDone} onChange={onShowDone} className={ROW}>Show done column</Checkbox>
        <Checkbox isSelected={fillColumns} onChange={onFillColumns} className={ROW}>Fill wide screens</Checkbox>
      </DropdownPopover>
    </Dropdown>
  </div>);
}

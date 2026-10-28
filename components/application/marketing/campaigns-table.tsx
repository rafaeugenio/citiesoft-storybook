"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import { useMemo, useState, type ComponentType } from "react";
import {
  RiArchiveLine,
  RiDeleteBin6Line,
  RiDownload2Line,
  RiEditLine,
  RiFileCopyLine,
  RiGlobalLine,
  RiGoogleFill,
  RiLinkedinBoxFill,
  RiMailLine,
  RiMetaFill,
  RiMore2Fill,
  RiSearchLine,
  RiTwitterXFill,
} from "@remixicon/react";
import { Focusable } from "react-aria-components";
import { Chip } from "@/components/base/badges/chip";
import { StatusDot } from "@/components/base/badges/status-dot";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { InputBase } from "@/components/base/input/input";
import { Pagination } from "@/components/base/pagination/pagination";
import { Select, SelectItem } from "@/components/base/select/select";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { ChevronSortDown } from "@/components/foundations/icons/chevrons";
import { cx } from "@/utils/cx";

/**
 * Campaigns table for the marketing template — the customers-table recipe
 * (toolbar with working filters + search, sortable headers, selection,
 * pagination) with campaign columns: channel icon tile + name, delivery
 * select, objective chip, date, spend chip, and row actions.
 *
 * The dataset is generated deterministically (stable across renders, so no
 * hydration mismatch).
 */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

type Channel = { label: string; icon: IconComponent };

const CHANNELS: Channel[] = [
  { label: "Google Ads", icon: RiGoogleFill },
  { label: "Meta", icon: RiMetaFill },
  { label: "X Ads", icon: RiTwitterXFill },
  { label: "LinkedIn", icon: RiLinkedinBoxFill },
  { label: "Email", icon: RiMailLine },
  { label: "Referral", icon: RiGlobalLine },
];

type ObjectiveColor = "lime" | "cyan" | "blue" | "yellow" | "purple";
type Objective = { label: string; color: ObjectiveColor };

const OBJECTIVES: Objective[] = [
  { label: "Conversions", color: "lime" },
  { label: "Traffic", color: "cyan" },
  { label: "Awareness", color: "blue" },
  { label: "Leads", color: "yellow" },
  { label: "Retargeting", color: "purple" },
];

const SPEND_BUCKETS: { id: string; label: string; test: (n: number) => boolean }[] = [
  { id: "all", label: "All spend", test: () => true },
  { id: "under-1k", label: "Under $1,000", test: (n) => n < 1000 },
  { id: "1k-5k", label: "$1,000 – $5,000", test: (n) => n >= 1000 && n <= 5000 },
  { id: "5k-20k", label: "$5,000 – $20,000", test: (n) => n > 5000 && n <= 20_000 },
  { id: "over-20k", label: "Over $20,000", test: (n) => n > 20_000 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const BASE_NAMES = [
  "Spring launch",
  "Brand search",
  "Cart retargeting",
  "Competitor keywords",
  "Founder story video",
  "Newsletter promo",
  "Lookalike broad",
  "Launch week",
  "Free tier push",
  "Docs remarketing",
  "Holiday gift guide",
  "Webinar signups",
  "Case study promo",
  "Feature announcement",
  "Year in review",
  "Partner co-marketing",
];

const REGIONS = ["US", "EU", "UK", "APAC", "Global"];

type Campaign = {
  id: number;
  name: string;
  channel: Channel;
  delivery: "active" | "paused" | "draft";
  objective: Objective;
  spend: number;
  updated: string;
  selected?: boolean;
};

/** mulberry32 — tiny deterministic PRNG so the demo data is stable. */
function makeRng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function formatSpend(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

const CAMPAIGNS: Campaign[] = (() => {
  const rng = makeRng(7);
  const pick = <T,>(arr: T[]) => arr[Math.floor(rng() * arr.length)];

  // Every base name crossed with a handful of regions, shuffled by the PRNG,
  // so names repeat the way real ad accounts do without ever colliding.
  const names: string[] = [];
  for (const base of BASE_NAMES) {
    for (const region of REGIONS) names.push(`${base} · ${region}`);
  }
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [names[i], names[j]] = [names[j], names[i]];
  }

  return names.map((name, i) => {
    const delivery: Campaign["delivery"] = rng() < 0.55 ? "active" : rng() < 0.6 ? "paused" : "draft";
    const spend = delivery === "draft" ? 0 : 180 + Math.floor(rng() * 47_800);
    const month = pick(MONTHS);
    const day = 1 + Math.floor(rng() * 28);
    return {
      id: i,
      name,
      channel: pick(CHANNELS),
      delivery,
      objective: pick(OBJECTIVES),
      spend,
      updated: `${month} ${String(day).padStart(2, "0")}, 2026`,
      selected: i === 1 || i === 3,
    };
  });
})();

const PER_PAGE = 10;

function DeliverySelect({ defaultValue, name }: { defaultValue: Campaign["delivery"]; name: string }) {
  const localize = useTemplateCopy();
  return localize((
    <Select
      aria-label={`Delivery status for ${name}`}
      defaultSelectedKey={defaultValue}
      className="w-[124px]"
    >
      <SelectItem id="active" textValue="Active">
        <StatusDot color="green" />
        Active
      </SelectItem>
      <SelectItem id="paused" textValue="Paused">
        <StatusDot color="yellow" />
        Paused
      </SelectItem>
      <SelectItem id="draft" textValue="Draft">
        <StatusDot color="indigo" />
        Draft
      </SelectItem>
    </Select>
  ));
}

type SortKey = "name" | "updated" | "spend";
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

function SortableHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey?: SortKey;
  sort?: SortState;
  onSort?: (key: SortKey) => void;
}) {
  const localize = useTemplateCopy();
  const active = !!sortKey && sort?.key === sortKey;
  const content = (
    <>
      <span
        className={cx(
          "text-body-medium whitespace-nowrap",
          active ? "text-text-primary" : "text-text-tertiary",
        )}
      >
        {label}
      </span>
      <span className="flex size-6 shrink-0 items-center justify-center">
        {sortKey && (
          <ChevronSortDown
            className={cx(
              "size-6 transition-[transform,color] duration-150 ease",
              active ? "text-text-secondary" : "text-text-tertiary",
              active && sort?.dir === "asc" && "rotate-180",
            )}
          />
        )}
      </span>
    </>
  );

  if (!sortKey) {
    return localize(<div className="flex items-center gap-0.5">{content}</div>);
  }

  return localize((
    <button
      type="button"
      aria-label={`Sort by ${label}`}
      onClick={() => onSort?.(sortKey)}
      className="flex cursor-pointer items-center gap-0.5 outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-border-focus-ring rounded-sm"
    >
      {content}
    </button>
  ));
}

/** Icon-only row action with a tooltip label — `IconButton` (a plain
 *  `<button>`) is wrapped in `Focusable` so react-aria's `TooltipTrigger`
 *  can attach hover/focus behavior, same pattern as the customers table. */
function RowActionButton({
  icon,
  label,
}: {
  icon: typeof RiEditLine;
  label: string;
}) {
  const localize = useTemplateCopy();
  return localize((
    <TooltipTrigger delay={200}>
      <Focusable>
        <IconButton icon={icon} size="small" aria-label={label} />
      </Focusable>
      <Tooltip size="md">{label}</Tooltip>
    </TooltipTrigger>
  ));
}

const MORE_MENU_ACTIONS = [
  { icon: RiFileCopyLine, label: "Duplicate campaign" },
  { icon: RiDownload2Line, label: "Export report" },
  { icon: RiArchiveLine, label: "Archive campaign" },
] as const;

/** The "⋮" action: tooltip on hover, contextual dropdown menu on click. The
 *  trigger is styled to match `IconButton`'s small secondary recipe (nesting
 *  the real IconButton inside DropdownTrigger would nest <button>s). */
function RowMoreMenu({ name }: { name: string }) {
  const localize = useTemplateCopy();
  const [isOpen, setIsOpen] = useState(false);
  return localize((
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger delay={200}>
        <DropdownTrigger
          aria-label={`More actions for ${name}`}
          className={cx(
            "relative inline-flex size-8 shrink-0 items-center justify-center rounded-2lg",
            "border border-border-button-default bg-background-primary-default text-foreground-icon-primary shadow-xs",
            "transition-[background-color,border-color,box-shadow,color] duration-150 ease",
            "hover:border-border-button-hover hover:bg-background-primary-hover",
            isOpen && "border-border-button-active bg-background-primary-active",
          )}
        >
          <RiMore2Fill className="size-4 shrink-0" aria-hidden />
        </DropdownTrigger>
        <Tooltip size="md">More actions</Tooltip>
      </TooltipTrigger>
      <DropdownPopover aria-label={`More actions for ${name}`} placement="bottom end" className="w-[220px] p-2">
        <DropdownGroup>
          {MORE_MENU_ACTIONS.map(({ icon: Icon, label }) => (
            <DropdownItem key={label} onSelect={() => setIsOpen(false)} className="px-2 py-1.5">
              <Icon className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
              <span className="truncate text-body-medium whitespace-nowrap text-text-primary">{label}</span>
            </DropdownItem>
          ))}
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  ));
}

function CampaignRow({
  campaign,
  isSelected,
  onToggle,
  showBorder = true,
}: {
  campaign: Campaign;
  isSelected: boolean;
  onToggle: (id: number, selected: boolean) => void;
  showBorder?: boolean;
}) {
  const localize = useTemplateCopy();
  const ChannelIcon = campaign.channel.icon;
  return localize((
    <div className={cx("flex w-full items-center", showBorder && "border-b border-separator-border")}>
      <div className="flex min-w-0 flex-[1.4] items-center gap-2 py-2.5">
        <Checkbox
          isSelected={isSelected}
          onChange={(selected) => onToggle(campaign.id, selected)}
          aria-label={`Select ${campaign.name}`}
        />
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default"
            title={campaign.channel.label}
          >
            <ChannelIcon className="size-4 shrink-0 text-foreground-icon-primary" aria-hidden />
          </span>
          <span className="truncate text-body-medium text-text-primary">{campaign.name}</span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <DeliverySelect defaultValue={campaign.delivery} name={campaign.name} />
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <Chip variant="bold" color={campaign.objective.color}>
          {campaign.objective.label}
        </Chip>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <span className="text-body-medium whitespace-nowrap text-text-primary">
          {campaign.updated}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        {campaign.spend > 0 ? (
          <Chip variant="subtle" color="gray">
            {formatSpend(campaign.spend)}
          </Chip>
        ) : (
          <span className="text-body-medium text-text-tertiary">$0</span>
        )}
      </div>
      <div className="flex w-[140px] shrink-0 items-center justify-end gap-2.5 px-3 py-2.5">
        <RowActionButton icon={RiDeleteBin6Line} label="Delete" />
        <RowActionButton icon={RiEditLine} label="Edit" />
        <RowMoreMenu name={campaign.name} />
      </div>
    </div>
  ));
}

export function CampaignsTable() {
  const localize = useTemplateCopy();
  const [page, setPage] = useState(1);
  const [channelFilter, setChannelFilter] = useState("all");
  const [objectiveFilter, setObjectiveFilter] = useState("all");
  const [spendFilter, setSpendFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(CAMPAIGNS.filter((c) => c.selected).map((c) => c.id)),
  );

  const onSort = (key: SortKey) => {
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, dir: "asc" };
      if (prev.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const toggleRow = (id: number, isSelected: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (isSelected) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  const filtered = useMemo(() => {
    const bucket = SPEND_BUCKETS.find((b) => b.id === spendFilter) ?? SPEND_BUCKETS[0];
    const q = query.trim().toLowerCase();
    return CAMPAIGNS.filter(
      (c) =>
        bucket.test(c.spend) &&
        (channelFilter === "all" || c.channel.label === channelFilter) &&
        (objectiveFilter === "all" || c.objective.label === objectiveFilter) &&
        (q === "" || (c.name.toLowerCase().includes(q) || localize(c.name).toLowerCase().includes(q))),
    );
  }, [channelFilter, objectiveFilter, spendFilter, query, localize]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const arr = [...filtered];
    const { key, dir } = sort;
    arr.sort((a, b) => {
      let cmp = 0;
      if (key === "name") cmp = a.name.localeCompare(b.name);
      else if (key === "spend") cmp = a.spend - b.spend;
      else cmp = Date.parse(a.updated) - Date.parse(b.updated);
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const rows = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const selectedOnPage = rows.filter((c) => selected.has(c.id)).length;
  const allOnPageSelected = rows.length > 0 && selectedOnPage === rows.length;
  const someOnPageSelected = selectedOnPage > 0 && !allOnPageSelected;

  const toggleAllOnPage = (isSelected: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const c of rows) {
        if (isSelected) next.add(c.id);
        else next.delete(c.id);
      }
      return next;
    });
  };

  const resetPage = () => setPage(1);

  const hasPagination = totalPages > 1;

  return localize((
    <section
      className={cx(
        "flex w-full flex-col rounded-2xl border border-border-table pt-2",
        hasPagination ? "pb-3" : "pb-0",
      )}
    >
      {/* Toolbar */}
      <div className="flex w-full flex-col items-start gap-3 px-3 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col justify-center">
          <p className="text-body-medium whitespace-nowrap text-text-tertiary">Total Results</p>
          <p className="text-body-medium whitespace-nowrap text-text-primary">
            {filtered.length.toLocaleString()} campaigns
          </p>
        </div>
        <div className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0">
          <Select
            aria-label="Filter by channel"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={channelFilter}
            onSelectionChange={(k) => {
              setChannelFilter(String(k));
              resetPage();
            }}
          >
            <SelectItem id="all" textValue="All channels">
              All channels
            </SelectItem>
            {CHANNELS.map((c) => (
              <SelectItem key={c.label} id={c.label} textValue={c.label}>
                {c.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Filter by objective"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={objectiveFilter}
            onSelectionChange={(k) => {
              setObjectiveFilter(String(k));
              resetPage();
            }}
          >
            <SelectItem id="all" textValue="All objectives">
              All objectives
            </SelectItem>
            {OBJECTIVES.map((o) => (
              <SelectItem key={o.label} id={o.label} textValue={o.label}>
                {o.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Filter by spend"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={spendFilter}
            onSelectionChange={(k) => {
              setSpendFilter(String(k));
              resetPage();
            }}
          >
            {SPEND_BUCKETS.map((b) => (
              <SelectItem key={b.id} id={b.id} textValue={b.label}>
                {b.label}
              </SelectItem>
            ))}
          </Select>
          <InputBase
            aria-label="Search campaigns"
            placeholder="Search"
            leadingIcon={RiSearchLine}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            fieldClassName="min-w-[153px] flex-1 rounded-full bg-background-secondary-default sm:w-[153px] sm:min-w-0 sm:flex-none"
            className="text-body-medium"
          />
        </div>
      </div>

      {/* Table grid: headers + rows share a min width and scroll horizontally together */}
      <div className="mt-2 w-full overflow-x-auto">
        <div className="flex min-w-[900px] flex-col">
          {/* Column headers */}
          <div className="flex w-full items-center border-y border-separator-border bg-background-secondary-default ps-3">
            <div className="flex min-w-0 flex-[1.4] items-center gap-2 py-2.5">
              <Checkbox
                isSelected={allOnPageSelected}
                isIndeterminate={someOnPageSelected}
                onChange={toggleAllOnPage}
                aria-label="Select all campaigns on this page"
              />
              <SortableHeader label="Campaign" sortKey="name" sort={sort} onSort={onSort} />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Delivery" />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Objective" />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Last updated" sortKey="updated" sort={sort} onSort={onSort} />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Spend" sortKey="spend" sort={sort} onSort={onSort} />
            </div>
            <div className="flex w-[140px] shrink-0 items-center px-3 py-2.5">
              <span className="text-body-medium whitespace-nowrap text-text-tertiary">Actions</span>
            </div>
          </div>

          {/* Rows */}
          <div className="flex w-full flex-col ps-3">
            {rows.length > 0 ? (
              rows.map((campaign, index) => (
                <CampaignRow
                  key={campaign.id}
                  campaign={campaign}
                  isSelected={selected.has(campaign.id)}
                  onToggle={toggleRow}
                  showBorder={hasPagination || index < rows.length - 1}
                />
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-10 pe-3">
                <span className="text-body-medium text-text-tertiary">
                  No campaigns match your filters.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pagination footer — only when the results actually paginate */}
      {hasPagination && (
        <div className="px-3 pt-3">
          <Pagination page={currentPage} totalPages={totalPages} onChange={setPage} />
        </div>
      )}
    </section>
  ));
}

"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import { useMemo, useState, type ComponentType } from "react";
import {
  RiArchiveLine,
  RiAttachmentLine,
  RiCarLine,
  RiDeleteBin6Line,
  RiDownload2Line,
  RiEditLine,
  RiFileCopyLine,
  RiFlightTakeoffLine,
  RiHandCoinLine,
  RiHeartPulseLine,
  RiHome4Line,
  RiLightbulbLine,
  RiMore2Fill,
  RiRepeatLine,
  RiRestaurantLine,
  RiSearchLine,
  RiShoppingBag3Line,
  RiStockLine,
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
 * Transactions table for the finance template — the customers-table recipe
 * (toolbar with working filters + search, sortable headers, selection,
 * pagination) with ledger columns: category icon tile + payee, account
 * select, category chip, date, and a signed amount chip (income lime,
 * spending gray).
 *
 * The dataset is generated deterministically (stable across renders, so no
 * hydration mismatch).
 */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

type CategoryColor = "lime" | "rose" | "yellow" | "cyan" | "blue" | "purple" | "neutral";

type Category = {
  label: string;
  color: CategoryColor;
  icon: IconComponent;
};

const CATEGORIES: Record<string, Category> = {
  housing: { label: "Housing", color: "blue", icon: RiHome4Line },
  groceries: { label: "Groceries", color: "lime", icon: RiShoppingBag3Line },
  transport: { label: "Transport", color: "cyan", icon: RiCarLine },
  dining: { label: "Dining", color: "yellow", icon: RiRestaurantLine },
  subscriptions: { label: "Subscriptions", color: "purple", icon: RiRepeatLine },
  utilities: { label: "Utilities", color: "neutral", icon: RiLightbulbLine },
  travel: { label: "Travel", color: "cyan", icon: RiFlightTakeoffLine },
  health: { label: "Health", color: "rose", icon: RiHeartPulseLine },
  income: { label: "Income", color: "lime", icon: RiHandCoinLine },
  investing: { label: "Investing", color: "blue", icon: RiStockLine },
};

/** Payees with their category and a typical amount band ([min, max], negative
 *  bands are spending). The generator picks from these so every row's payee,
 *  category, and amount agree with each other. */
const PAYEES: { name: string; category: keyof typeof CATEGORIES; band: [number, number] }[] = [
  { name: "Maple Street rent", category: "housing", band: [-2650, -2650] },
  { name: "Whole Foods Market", category: "groceries", band: [-180, -40] },
  { name: "Corner grocer", category: "groceries", band: [-60, -12] },
  { name: "Shell", category: "transport", band: [-90, -35] },
  { name: "Uber", category: "transport", band: [-42, -9] },
  { name: "Metro card top-up", category: "transport", band: [-40, -20] },
  { name: "Netflix", category: "subscriptions", band: [-18, -18] },
  { name: "Spotify", category: "subscriptions", band: [-12, -12] },
  { name: "iCloud storage", category: "subscriptions", band: [-3, -3] },
  { name: "Gym membership", category: "health", band: [-49, -49] },
  { name: "City pharmacy", category: "health", band: [-64, -8] },
  { name: "Electric utility", category: "utilities", band: [-140, -70] },
  { name: "Water and waste", category: "utilities", band: [-55, -30] },
  { name: "Osteria Bianca", category: "dining", band: [-120, -28] },
  { name: "Blue Bottle Coffee", category: "dining", band: [-14, -5] },
  { name: "Ramen bar", category: "dining", band: [-38, -16] },
  { name: "Delta Airlines", category: "travel", band: [-620, -180] },
  { name: "Airbnb", category: "travel", band: [-480, -150] },
  { name: "Acme Corp payroll", category: "income", band: [6200, 6200] },
  { name: "Studio K invoice", category: "income", band: [2600, 800] },
  { name: "Dividend payout", category: "income", band: [740, 120] },
  { name: "Vanguard transfer", category: "investing", band: [-1500, -400] },
];

const ACCOUNTS = ["Checking", "Savings", "Credit card"] as const;
type Account = (typeof ACCOUNTS)[number];

const AMOUNT_BUCKETS: { id: string; label: string; test: (n: number) => boolean }[] = [
  { id: "all", label: "All amounts", test: () => true },
  { id: "income", label: "Income only", test: (n) => n > 0 },
  { id: "under-50", label: "Under $50", test: (n) => n < 0 && n > -50 },
  { id: "50-500", label: "$50 – $500", test: (n) => n <= -50 && n > -500 },
  { id: "over-500", label: "Over $500", test: (n) => n <= -500 },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

type Transaction = {
  id: number;
  payee: string;
  category: Category;
  account: Account;
  amount: number;
  date: string;
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

function formatAmount(n: number) {
  const abs = Math.abs(n).toLocaleString("en-US");
  return n > 0 ? `+$${abs}` : `-$${abs}`;
}

const TRANSACTIONS: Transaction[] = (() => {
  const rng = makeRng(19);
  const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rng() * arr.length)];
  const total = 140;

  return Array.from({ length: total }, (_, i) => {
    const payee = pick(PAYEES);
    const [a, b] = payee.band;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    const amount = lo === hi ? lo : lo + Math.floor(rng() * (hi - lo));
    const account: Account =
      payee.category === "income"
        ? rng() > 0.3
          ? "Checking"
          : "Savings"
        : amount < -500
          ? "Checking"
          : pick(ACCOUNTS);
    const month = pick(MONTHS);
    const day = 1 + Math.floor(rng() * 28);
    return {
      id: i,
      payee: payee.name,
      category: CATEGORIES[payee.category],
      account,
      amount,
      date: `${month} ${String(day).padStart(2, "0")}, 2026`,
      selected: i === 2 || i === 4,
    };
  });
})();

const PER_PAGE = 10;

function AccountSelect({ defaultValue, payee }: { defaultValue: Account; payee: string }) {
  const localize = useTemplateCopy();
  return localize((
    <Select
      aria-label={`Account for ${payee}`}
      defaultSelectedKey={defaultValue}
      className="w-[136px]"
    >
      <SelectItem id="Checking" textValue="Checking">
        <StatusDot color="green" />
        Checking
      </SelectItem>
      <SelectItem id="Savings" textValue="Savings">
        <StatusDot color="indigo" />
        Savings
      </SelectItem>
      <SelectItem id="Credit card" textValue="Credit card">
        <StatusDot color="yellow" />
        Credit card
      </SelectItem>
    </Select>
  ));
}

type SortKey = "payee" | "date" | "amount";
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
  { icon: RiAttachmentLine, label: "Attach receipt" },
  { icon: RiFileCopyLine, label: "Duplicate transaction" },
  { icon: RiDownload2Line, label: "Export statement" },
  { icon: RiArchiveLine, label: "Archive transaction" },
] as const;

/** The "⋮" action: tooltip on hover, contextual dropdown menu on click. The
 *  trigger is styled to match `IconButton`'s small secondary recipe (nesting
 *  the real IconButton inside DropdownTrigger would nest <button>s). */
function RowMoreMenu({ payee }: { payee: string }) {
  const localize = useTemplateCopy();
  const [isOpen, setIsOpen] = useState(false);
  return localize((
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <TooltipTrigger delay={200}>
        <DropdownTrigger
          aria-label={`More actions for ${payee}`}
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
      <DropdownPopover aria-label={`More actions for ${payee}`} placement="bottom end" className="w-[220px] p-2">
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

function TransactionRow({
  transaction,
  isSelected,
  onToggle,
  showBorder = true,
}: {
  transaction: Transaction;
  isSelected: boolean;
  onToggle: (id: number, selected: boolean) => void;
  showBorder?: boolean;
}) {
  const localize = useTemplateCopy();
  const CategoryIcon = transaction.category.icon;
  return localize((
    <div className={cx("flex w-full items-center", showBorder && "border-b border-separator-border")}>
      <div className="flex min-w-0 flex-[1.4] items-center gap-2 py-2.5">
        <Checkbox
          isSelected={isSelected}
          onChange={(selected) => onToggle(transaction.id, selected)}
          aria-label={`Select ${transaction.payee}`}
        />
        <div className="flex min-w-0 items-center gap-2">
          <span
            className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background-tertiary-default"
            title={transaction.category.label}
          >
            <CategoryIcon className="size-4 shrink-0 text-foreground-icon-primary" aria-hidden />
          </span>
          <span className="truncate text-body-medium text-text-primary">{transaction.payee}</span>
        </div>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <AccountSelect defaultValue={transaction.account} payee={transaction.payee} />
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <Chip variant="bold" color={transaction.category.color}>
          {transaction.category.label}
        </Chip>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <span className="text-body-medium whitespace-nowrap text-text-primary">
          {transaction.date}
        </span>
      </div>
      <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
        <Chip variant="subtle" color={transaction.amount > 0 ? "lime" : "gray"}>
          {formatAmount(transaction.amount)}
        </Chip>
      </div>
      <div className="flex w-[140px] shrink-0 items-center justify-end gap-2.5 px-3 py-2.5">
        <RowActionButton icon={RiDeleteBin6Line} label="Delete" />
        <RowActionButton icon={RiEditLine} label="Edit" />
        <RowMoreMenu payee={transaction.payee} />
      </div>
    </div>
  ));
}

export function TransactionsTable() {
  const localize = useTemplateCopy();
  const [page, setPage] = useState(1);
  const [accountFilter, setAccountFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [amountFilter, setAmountFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortState>(null);
  const [selected, setSelected] = useState<Set<number>>(
    () => new Set(TRANSACTIONS.filter((t) => t.selected).map((t) => t.id)),
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
    const bucket = AMOUNT_BUCKETS.find((b) => b.id === amountFilter) ?? AMOUNT_BUCKETS[0];
    const q = query.trim().toLowerCase();
    return TRANSACTIONS.filter(
      (t) =>
        bucket.test(t.amount) &&
        (accountFilter === "all" || t.account === accountFilter) &&
        (categoryFilter === "all" || t.category.label === categoryFilter) &&
        (q === "" || (t.payee.toLowerCase().includes(q) || localize(t.payee).toLowerCase().includes(q))),
    );
  }, [accountFilter, categoryFilter, amountFilter, query, localize]);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    const arr = [...filtered];
    const { key, dir } = sort;
    arr.sort((a, b) => {
      let cmp = 0;
      if (key === "payee") cmp = a.payee.localeCompare(b.payee);
      else if (key === "amount") cmp = a.amount - b.amount;
      else cmp = Date.parse(a.date) - Date.parse(b.date);
      return dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const rows = sorted.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE);

  const selectedOnPage = rows.filter((t) => selected.has(t.id)).length;
  const allOnPageSelected = rows.length > 0 && selectedOnPage === rows.length;
  const someOnPageSelected = selectedOnPage > 0 && !allOnPageSelected;

  const toggleAllOnPage = (isSelected: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const t of rows) {
        if (isSelected) next.add(t.id);
        else next.delete(t.id);
      }
      return next;
    });
  };

  const resetPage = () => setPage(1);

  const hasPagination = totalPages > 1;

  const categoryOptions = Object.values(CATEGORIES);

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
            {filtered.length.toLocaleString()} transactions
          </p>
        </div>
        <div className="-mx-3 flex w-[calc(100%+1.5rem)] items-center gap-2.5 overflow-x-auto px-3 sm:mx-0 sm:w-auto sm:flex-wrap sm:justify-end sm:overflow-visible sm:px-0">
          <Select
            aria-label="Filter by account"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={accountFilter}
            onSelectionChange={(k) => {
              setAccountFilter(String(k));
              resetPage();
            }}
          >
            <SelectItem id="all" textValue="All accounts">
              All accounts
            </SelectItem>
            {ACCOUNTS.map((a) => (
              <SelectItem key={a} id={a} textValue={a}>
                {a}
              </SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Filter by category"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={categoryFilter}
            onSelectionChange={(k) => {
              setCategoryFilter(String(k));
              resetPage();
            }}
          >
            <SelectItem id="all" textValue="All categories">
              All categories
            </SelectItem>
            {categoryOptions.map((c) => (
              <SelectItem key={c.label} id={c.label} textValue={c.label}>
                {c.label}
              </SelectItem>
            ))}
          </Select>
          <Select
            aria-label="Filter by amount"
            className="shrink-0"
            popoverClassName="min-w-40"
            selectedKey={amountFilter}
            onSelectionChange={(k) => {
              setAmountFilter(String(k));
              resetPage();
            }}
          >
            {AMOUNT_BUCKETS.map((b) => (
              <SelectItem key={b.id} id={b.id} textValue={b.label}>
                {b.label}
              </SelectItem>
            ))}
          </Select>
          <InputBase
            aria-label="Search transactions"
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
                aria-label="Select all transactions on this page"
              />
              <SortableHeader label="Transaction" sortKey="payee" sort={sort} onSort={onSort} />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Account" />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Category" />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Date" sortKey="date" sort={sort} onSort={onSort} />
            </div>
            <div className="flex min-w-0 flex-1 items-center px-3 py-2.5">
              <SortableHeader label="Amount" sortKey="amount" sort={sort} onSort={onSort} />
            </div>
            <div className="flex w-[140px] shrink-0 items-center px-3 py-2.5">
              <span className="text-body-medium whitespace-nowrap text-text-tertiary">Actions</span>
            </div>
          </div>

          {/* Rows */}
          <div className="flex w-full flex-col ps-3">
            {rows.length > 0 ? (
              rows.map((transaction, index) => (
                <TransactionRow
                  key={transaction.id}
                  transaction={transaction}
                  isSelected={selected.has(transaction.id)}
                  onToggle={toggleRow}
                  showBorder={hasPagination || index < rows.length - 1}
                />
              ))
            ) : (
              <div className="flex w-full items-center justify-center py-10 pe-3">
                <span className="text-body-medium text-text-tertiary">
                  No transactions match your filters.
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

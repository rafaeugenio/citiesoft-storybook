"use client";

import { useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { RiFilter3Line, RiInboxLine, RiMore2Fill } from "@remixicon/react";
import { Focusable } from "react-aria-components";
import type { SortDescriptor } from "react-aria-components";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { Pagination } from "@/components/base/pagination/pagination";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "@/components/base/segmented-control/segmented-control";
import { Select, SelectItem } from "@/components/base/select/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@/components/base/table/table";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { ChevronSortDown } from "@/components/foundations/icons/chevrons";
import { EmptyState } from "@/components/application/estados/empty-state";
import { ErrorState } from "@/components/application/estados/error-state";
import { SkeletonBar } from "@/components/application/estados/table-skeleton";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type DataListingState = "pronto" | "carregando" | "vazio" | "vazio-filtro" | "erro";
export type DataListingDensity = "compacta" | "confortavel";

export interface DataListingColumn<T> {
  id: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  align?: "start" | "center" | "end";
  /** Classes de largura da coluna, por exemplo `w-[160px]`. */
  width?: string;
  sortable?: boolean;
  /** Coluna do identificador: vira link para o detalhe (`getRowHref`) e cabeçalho da linha. */
  isIdentifier?: boolean;
}

export interface DataListingRowAction<T> {
  id: string;
  label: string;
  icon?: IconComponent;
  tone?: "neutral" | "danger";
  onAction: (row: T) => void;
  isDisabled?: (row: T) => boolean;
}

export interface DataListingSort {
  column: string;
  direction: "ascending" | "descending";
}

export interface DataListingProps<T> {
  /** Linhas da página atual. Busca, filtro, ordenação e fatiamento são do consumidor. */
  data: T[];
  columns: DataListingColumn<T>[];
  getRowId: (row: T) => string;
  /** Nome da linha para rótulos de checkbox e ações (por exemplo, o protocolo). */
  getRowLabel?: (row: T) => string;
  getRowHref?: (row: T) => string;

  /** Nome da tabela. O total de registros é acrescentado ao nome acessível. */
  label: string;
  entity?: { singular: string; plural: string };
  state?: DataListingState;
  density?: DataListingDensity;
  onDensityChange?: (density: DataListingDensity) => void;

  /** Coluna de seleção. Presente só quando há ação em massa. */
  selectable?: boolean;
  selectedKeys?: ReadonlySet<string>;
  onSelectedKeysChange?: (keys: Set<string>) => void;

  sort?: DataListingSort | null;
  onSortChange?: (sort: DataListingSort) => void;

  /** Até 2 ações aparecem em ícones; a partir de 3 vão para o menu de três pontos. */
  rowActions?: DataListingRowAction<T>[];
  actionsHeader?: string;

  /** Total de registros do conjunto filtrado (todas as páginas). */
  total: number;
  page: number;
  pageSize: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;

  /* Estados */
  emptyTitle?: ReactNode;
  emptyDescription?: ReactNode;
  /** Ação do estado vazio (por exemplo, o botão "Nova ..."). */
  emptyAction?: ReactNode;
  onClearFilters?: () => void;
  onRetry?: () => void;
  errorTitle?: ReactNode;
  errorDescription?: ReactNode;
  /** Quantidade de linhas do esqueleto. */
  skeletonRows?: number;

  /** Largura mínima da tabela antes da rolagem horizontal. */
  minTableWidth?: string;
  className?: string;
}

const alignClass = { start: "text-start", center: "text-center", end: "text-end" } as const;
const SKELETON_WIDTHS = ["w-24", "w-40", "w-32", "w-20", "w-28", "w-36"];

function RowActionCell<T>({
  row,
  rowLabel,
  actions,
}: {
  row: T;
  rowLabel: string;
  actions: DataListingRowAction<T>[];
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (actions.length <= 2) {
    return (
      <div className="flex items-center justify-end gap-2">
        {actions.map((action) => (
          <TooltipTrigger key={action.id} delay={200}>
            <Focusable>
              <IconButton
                icon={action.icon ?? RiMore2Fill}
                size="small"
                aria-label={`${action.label} ${rowLabel}`}
                disabled={action.isDisabled?.(row)}
                className={action.tone === "danger" ? "text-text-error-primary" : undefined}
                onClick={() => action.onAction(row)}
              />
            </Focusable>
            <Tooltip size="md">{action.label}</Tooltip>
          </TooltipTrigger>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-end">
      <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
        <DropdownTrigger
          aria-label={`Mais ações de ${rowLabel}`}
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
        <DropdownPopover aria-label={`Ações de ${rowLabel}`} placement="bottom end" className="w-[220px] p-2">
          <DropdownGroup>
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <DropdownItem
                  key={action.id}
                  className="px-2 py-1.5"
                  onSelect={() => {
                    setIsOpen(false);
                    if (!action.isDisabled?.(row)) action.onAction(row);
                  }}
                >
                  {Icon ? (
                    <Icon
                      className={cx(
                        "size-[18px] shrink-0",
                        action.tone === "danger" ? "text-text-error-primary" : "text-foreground-icon-secondary",
                      )}
                      aria-hidden
                    />
                  ) : null}
                  <span
                    className={cx(
                      "truncate text-body-medium whitespace-nowrap",
                      action.tone === "danger" ? "text-text-error-primary" : "text-text-primary",
                    )}
                  >
                    {action.label}
                  </span>
                </DropdownItem>
              );
            })}
          </DropdownGroup>
        </DropdownPopover>
      </Dropdown>
    </div>
  );
}

/**
 * Listagem completa: tabela com colunas por configuração, seleção, ordenação
 * (`aria-sort`), ações de linha, paginação com intervalo e itens por página,
 * densidade e os estados carregando, vazio, vazio por filtro e erro.
 *
 * A ordem das colunas segue o template: seleção, identificador, campos
 * descritivos, numéricos e de data, status, ações (fixa à direita, sem
 * ordenação). O componente apenas exibe a página recebida em `data`.
 */
export function DataListing<T>({
  data,
  columns,
  getRowId,
  getRowLabel,
  getRowHref,
  label,
  entity = { singular: "registro", plural: "registros" },
  state = "pronto",
  density = "confortavel",
  onDensityChange,
  selectable = false,
  selectedKeys,
  onSelectedKeysChange,
  sort = null,
  onSortChange,
  rowActions,
  actionsHeader = "Ações",
  total,
  page,
  pageSize,
  pageSizeOptions = [10, 25, 50],
  onPageChange,
  onPageSizeChange,
  emptyTitle,
  emptyDescription,
  emptyAction,
  onClearFilters,
  onRetry,
  errorTitle,
  errorDescription,
  skeletonRows = 6,
  minTableWidth = "min-w-[880px]",
  className,
}: DataListingProps<T>) {
  const selected = selectedKeys ?? new Set<string>();
  const hasActions = Boolean(rowActions && rowActions.length > 0);
  const isReady = state === "pronto";
  const rows = isReady ? data : [];
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  const noun = total === 1 ? entity.singular : entity.plural;
  const columnCount = columns.length + (selectable ? 1 : 0) + (hasActions ? 1 : 0);

  const pageIds = rows.map(getRowId);
  const selectedOnPage = pageIds.filter((id) => selected.has(id)).length;
  const allOnPage = pageIds.length > 0 && selectedOnPage === pageIds.length;

  const toggleRow = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    onSelectedKeysChange?.(next);
  };
  /* O checkbox do cabeçalho seleciona apenas a página atual. */
  const togglePage = (on: boolean) => {
    const next = new Set(selected);
    for (const id of pageIds) {
      if (on) next.add(id);
      else next.delete(id);
    }
    onSelectedKeysChange?.(next);
  };

  const sortDescriptor: SortDescriptor | undefined = sort
    ? { column: sort.column, direction: sort.direction }
    : undefined;

  const renderEmpty = () => {
    if (state === "carregando") return null;
    if (state === "erro") {
      return (
        <ErrorState
          title={errorTitle}
          description={errorDescription}
          onRetry={onRetry}
          size="md"
        />
      );
    }
    if (state === "vazio-filtro") {
      return (
        <EmptyState
          icon={RiFilter3Line}
          title="Nenhum resultado para os filtros aplicados"
          description="Ajustar ou remover filtros amplia a busca."
          action={
            onClearFilters ? (
              <Button variant="secondary" size="small" onClick={onClearFilters}>
                Limpar filtros
              </Button>
            ) : undefined
          }
        />
      );
    }
    return (
      <EmptyState
        icon={RiInboxLine}
        title={emptyTitle ?? `Nenhum ${entity.singular} cadastrado`}
        description={emptyDescription ?? `Os ${entity.plural} criados aparecem aqui.`}
        action={emptyAction}
      />
    );
  };

  const showFooter = state !== "carregando" && (state === "pronto" || state === "erro");

  return (
    <section
      className={cx(
        "flex w-full flex-col rounded-2xl border border-border-table",
        className,
      )}
    >
      <Table
        aria-label={`${label}: ${total} ${noun}`}
        size={density === "compacta" ? "sm" : "md"}
        selectionMode="none"
        className={minTableWidth}
        sortDescriptor={sortDescriptor}
        onSortChange={(descriptor) =>
          onSortChange?.({
            column: String(descriptor.column),
            direction: descriptor.direction ?? "ascending",
          })
        }
      >
        <TableHeader>
          {selectable ? (
            <TableColumn id="__selecao" className="w-12">
              <Checkbox
                slot={null}
                aria-label="Selecionar todas as linhas da página"
                isSelected={allOnPage}
                isIndeterminate={selectedOnPage > 0 && !allOnPage}
                isDisabled={rows.length === 0}
                onChange={(on) => togglePage(on)}
              />
            </TableColumn>
          ) : null}
          {columns.map((column) => (
            <TableColumn
              key={column.id}
              id={column.id}
              isRowHeader={column.isIdentifier}
              allowsSorting={column.sortable}
              className={cx(column.width, alignClass[column.align ?? "start"])}
            >
              {({ sortDirection }) => (
                <span
                  className={cx(
                    "inline-flex items-center gap-0.5",
                    column.align === "end" && "flex-row-reverse",
                  )}
                >
                  {column.header}
                  {column.sortable ? (
                    <ChevronSortDown
                      className={cx(
                        "size-6 shrink-0 transition-[transform,color] duration-150",
                        sortDirection === "ascending" && "rotate-180",
                        sortDirection ? "text-text-secondary" : "text-text-tertiary",
                      )}
                    />
                  ) : null}
                </span>
              )}
            </TableColumn>
          ))}
          {hasActions ? (
            <TableColumn id="__acoes" className="sticky end-0 w-[132px] text-end">
              {actionsHeader}
            </TableColumn>
          ) : null}
        </TableHeader>

        <TableBody renderEmptyState={state === "carregando" ? undefined : renderEmpty}>
          {state === "carregando"
            ? Array.from({ length: skeletonRows }, (_, index) => (
                <TableRow key={`esqueleto-${index}`} id={`esqueleto-${index}`}>
                  {Array.from({ length: columnCount }, (_, col) => (
                    <TableCell key={col}>
                      {col === (selectable ? 1 : 0) ? <span className="sr-only">Carregando registro {index + 1}</span> : null}
                      <SkeletonBar
                        className={
                          selectable && col === 0 ? "size-4" : SKELETON_WIDTHS[(index + col) % SKELETON_WIDTHS.length]
                        }
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : rows.map((row) => {
                const id = getRowId(row);
                const rowLabel = getRowLabel?.(row) ?? id;
                const isSelected = selected.has(id);
                return (
                  <TableRow
                    key={id}
                    id={id}
                    className={cx(
                      isSelected ? "bg-background-secondary-default" : "bg-background-primary-default",
                    )}
                  >
                    {selectable ? (
                      <TableCell>
                        <Checkbox
                          slot={null}
                          aria-label={`Selecionar ${rowLabel}`}
                          isSelected={isSelected}
                          onChange={(on) => toggleRow(id, on)}
                        />
                      </TableCell>
                    ) : null}
                    {columns.map((column) => {
                      const content = column.cell(row);
                      const href = column.isIdentifier ? getRowHref?.(row) : undefined;
                      return (
                        <TableCell key={column.id} className={cx(column.width, alignClass[column.align ?? "start"])}>
                          {href ? (
                            <a
                              href={href}
                              className="rounded-sm text-body-medium text-text-brand underline-offset-2 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                            >
                              {content}
                            </a>
                          ) : (
                            content
                          )}
                        </TableCell>
                      );
                    })}
                    {hasActions ? (
                      <TableCell className="sticky end-0 bg-inherit">
                        <RowActionCell row={row} rowLabel={rowLabel} actions={rowActions!} />
                      </TableCell>
                    ) : null}
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>

      <p role="status" aria-live="polite" className="sr-only">
        {state === "carregando" ? `Carregando ${entity.plural}` : ""}
      </p>

      {showFooter ? (
        <div className="flex flex-col gap-3 border-t border-separator-border px-3 py-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-body-2-regular text-text-secondary">
            {total === 0
              ? `Nenhum ${entity.singular}`
              : `Exibindo ${from} a ${to} de ${total} ${noun}`}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            {onPageSizeChange ? (
              <div className="flex items-center gap-2">
                <span className="text-body-2-regular text-text-secondary">Itens por página</span>
                <Select
                  size="sm"
                  aria-label="Itens por página"
                  className="w-[84px]"
                  popoverClassName="min-w-24"
                  selectedKey={String(pageSize)}
                  onSelectionChange={(key) => onPageSizeChange(Number(key))}
                >
                  {pageSizeOptions.map((option) => (
                    <SelectItem key={option} id={String(option)} textValue={String(option)}>
                      {option}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            ) : null}
            {onDensityChange ? (
              <SegmentedControl
                aria-label="Densidade da tabela"
                selectedKeys={new Set([density])}
                onSelectionChange={(keys) => {
                  const next = [...keys][0];
                  if (next) onDensityChange(next as DataListingDensity);
                }}
              >
                <SegmentedControlItem id="confortavel">Confortável</SegmentedControlItem>
                <SegmentedControlItem id="compacta">Compacta</SegmentedControlItem>
              </SegmentedControl>
            ) : null}
            {totalPages > 1 && onPageChange ? (
              <Pagination
                className="w-auto min-w-[260px] flex-1"
                page={page}
                totalPages={totalPages}
                onChange={onPageChange}
                previousLabel="Anterior"
                nextLabel="Próxima"
                aria-label="Paginação"
              />
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}

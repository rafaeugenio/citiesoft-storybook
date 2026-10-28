"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { RiArrowDownSLine, RiCheckLine, RiCloseLine, RiSearchLine } from "@remixicon/react";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { InputBase } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { cx } from "@/utils/cx";
import { FilterConditions } from "./filter-conditions";
import {
  countActiveFilters,
  defaultOperators,
  emptyFilterBarValue,
} from "./filter-types";
import type {
  FilterBarField,
  FilterBarFilter,
  FilterBarOperator,
  FilterBarValue,
} from "./filter-types";

export { countActiveFilters, defaultOperators, emptyFilterBarValue } from "./filter-types";
export type {
  FilterBarField,
  FilterBarFilter,
  FilterBarOperator,
  FilterBarValue,
  FilterCondition,
  FilterOption,
} from "./filter-types";

export interface FilterBarProps {
  value?: FilterBarValue;
  defaultValue?: FilterBarValue;
  /** Chamado a cada mudança. A busca só emite após a espera (`searchDelay`). */
  onChange?: (value: FilterBarValue) => void;
  /** Filtros por lista, simples ou múltiplos. */
  filters?: FilterBarFilter[];
  /** Campos do filtro por condições. Sem campos, o botão não aparece. */
  conditionFields?: FilterBarField[];
  conditionOperators?: FilterBarOperator[];
  searchPlaceholder?: string;
  searchLabel?: string;
  /** Espera em milissegundos antes de emitir a busca. Padrão 300. */
  searchDelay?: number;
  /** Quantidade de resultados, anunciada em região educada. */
  resultCount?: number;
  /** Substantivo do resultado. Padrão registro/registros. */
  resultNoun?: { singular: string; plural: string };
  clearLabel?: string;
  /** Conteúdo à direita da linha (por exemplo, ordenação ou exportar). */
  trailing?: ReactNode;
  className?: string;
}

const ALL_KEY = "__todos__";

const triggerClass = cx(
  "inline-flex h-8 cursor-pointer items-center gap-1 rounded-2lg px-[7px] py-1 text-body-2-medium whitespace-nowrap",
  "border border-border-button-default bg-background-primary-default text-text-primary shadow-xs",
  "transition-[background-color,border-color] duration-200 ease",
  "hover:border-border-button-hover hover:bg-background-primary-hover",
);

function MultiFilter({
  filter,
  selected,
  onChange,
}: {
  filter: FilterBarFilter;
  selected: string[];
  onChange: (next: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = (value: string) =>
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);

  return (
    <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
      <DropdownTrigger className={triggerClass} aria-label={filter.label}>
        <span>{filter.label}</span>
        {selected.length > 0 ? (
          <span className="rounded-sm bg-accent-400 px-1 py-px text-caption-1-semibold text-white">
            {selected.length}
          </span>
        ) : null}
        <RiArrowDownSLine
          className={cx("size-4 shrink-0 text-text-secondary transition-transform duration-200", isOpen && "rotate-180")}
          aria-hidden
        />
      </DropdownTrigger>
      <DropdownPopover aria-label={`Opções de ${filter.label}`} className="w-[240px] p-2">
        <DropdownGroup>
          {filter.options.map((option) => {
            const isOn = selected.includes(option.value);
            return (
              <DropdownItem
                key={option.value}
                selected={isOn}
                onSelect={() => toggle(option.value)}
                className="px-2 py-1.5"
              >
                <span className="flex-1 truncate text-body-medium">{option.label}</span>
                {isOn ? <RiCheckLine className="size-4 shrink-0 text-text-brand" aria-hidden /> : null}
              </DropdownItem>
            );
          })}
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  );
}

/**
 * Barra de busca e filtros de uma listagem. Busca com espera de 300ms, filtros
 * por lista (simples e múltiplos), filtro por condições em popover, chips de
 * filtros ativos removíveis e "Limpar filtros". Anuncia a quantidade de
 * resultados em região polida.
 */
export function FilterBar({
  value: controlled,
  defaultValue = emptyFilterBarValue,
  onChange,
  filters = [],
  conditionFields,
  conditionOperators = defaultOperators,
  searchPlaceholder = "Buscar",
  searchLabel = "Buscar",
  searchDelay = 300,
  resultCount,
  resultNoun = { singular: "registro", plural: "registros" },
  clearLabel = "Limpar filtros",
  trailing,
  className,
}: FilterBarProps) {
  const [internal, setInternal] = useState<FilterBarValue>(defaultValue);
  const value = controlled ?? internal;
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  });

  const emit = (next: FilterBarValue) => {
    valueRef.current = next;
    if (controlled === undefined) setInternal(next);
    onChange?.(next);
  };

  /* Busca com espera: o campo atualiza na hora, o valor emitido espera. */
  const [searchText, setSearchText] = useState(value.search);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastEmitted = useRef(value.search);

  useEffect(() => {
    if (value.search !== lastEmitted.current) {
      lastEmitted.current = value.search;
      setSearchText(value.search);
    }
  }, [value.search]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const onSearchInput = (text: string) => {
    setSearchText(text);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      lastEmitted.current = text;
      emit({ ...valueRef.current, search: text });
    }, searchDelay);
  };

  const setSelection = (id: string, next: string[]) => {
    const selections = { ...value.selections };
    if (next.length === 0) delete selections[id];
    else selections[id] = next;
    emit({ ...value, selections });
  };

  const clearSearch = () => {
    if (timer.current) clearTimeout(timer.current);
    lastEmitted.current = "";
    setSearchText("");
    emit({ ...valueRef.current, search: "" });
  };

  const clearAll = () => {
    if (timer.current) clearTimeout(timer.current);
    lastEmitted.current = "";
    setSearchText("");
    emit({ search: "", selections: {}, conditions: [] });
  };

  const active = countActiveFilters({ ...value, search: searchText.trim() ? searchText : value.search });

  /* Chips dos filtros ativos. */
  const chips: { key: string; text: string; remove: () => void }[] = [];
  if (value.search.trim()) {
    chips.push({
      key: "busca",
      text: `Busca: ${value.search.trim()}`,
      remove: () => clearSearch(),
    });
  }
  for (const filter of filters) {
    const selected = value.selections[filter.id] ?? [];
    if (selected.length === 0) continue;
    const names = selected.map((v) => filter.options.find((o) => o.value === v)?.label ?? v);
    chips.push({
      key: `filtro-${filter.id}`,
      text: `${filter.label}: ${names.join(", ")}`,
      remove: () => setSelection(filter.id, []),
    });
  }
  for (const condition of value.conditions) {
    const field = conditionFields?.find((f) => f.id === condition.fieldId);
    const operator = conditionOperators.find((o) => o.id === condition.operatorId);
    const shown = field?.options?.find((o) => o.value === condition.value)?.label ?? condition.value;
    chips.push({
      key: condition.id,
      text: `${field?.label ?? condition.fieldId} ${operator?.label ?? ""} ${shown}`,
      remove: () =>
        emit({
          ...value,
          conditions: value.conditions.filter((c) => c.id !== condition.id),
        }),
    });
  }

  const announcement =
    resultCount === undefined
      ? ""
      : `${resultCount} ${resultCount === 1 ? resultNoun.singular : resultNoun.plural} ${resultCount === 1 ? "encontrado" : "encontrados"}`;

  return (
    <div className={cx("flex w-full flex-col gap-3", className)}>
      <div className="flex w-full flex-wrap items-center gap-2">
        <div role="search" className="w-full sm:w-[280px]">
          <InputBase
            aria-label={searchLabel}
            placeholder={searchPlaceholder}
            leadingIcon={RiSearchLine}
            value={searchText}
            onChange={(e) => onSearchInput(e.target.value)}
            fieldClassName="rounded-full bg-background-secondary-default"
            className="text-body-medium"
          />
        </div>

        {filters.map((filter) => {
          const selected = value.selections[filter.id] ?? [];
          if (filter.multiple) {
            return (
              <MultiFilter
                key={filter.id}
                filter={filter}
                selected={selected}
                onChange={(next) => setSelection(filter.id, next)}
              />
            );
          }
          return (
            <Select
              key={filter.id}
              size="sm"
              aria-label={filter.label}
              placeholder={filter.label}
              className="shrink-0"
              popoverClassName="min-w-48"
              selectedKey={selected[0] ?? null}
              onSelectionChange={(key) =>
                setSelection(filter.id, key === null || key === ALL_KEY ? [] : [String(key)])
              }
              renderValue={({ isPlaceholder, selectedText }) =>
                isPlaceholder ? filter.label : `${filter.label}: ${selectedText}`
              }
            >
              <SelectItem id={ALL_KEY} textValue={filter.allLabel ?? "Todos"}>
                {filter.allLabel ?? "Todos"}
              </SelectItem>
              {filter.options.map((option) => (
                <SelectItem key={option.value} id={option.value} textValue={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </Select>
          );
        })}

        {conditionFields && conditionFields.length > 0 ? (
          <FilterConditions
            fields={conditionFields}
            operators={conditionOperators}
            conditions={value.conditions}
            onApply={(conditions) => emit({ ...valueRef.current, conditions })}
          />
        ) : null}

        {active > 0 ? (
          <Button variant="ghost" size="small" onClick={clearAll}>
            {clearLabel}
          </Button>
        ) : null}

        {trailing ? <div className="ms-auto flex items-center gap-2">{trailing}</div> : null}
      </div>

      {chips.length > 0 ? (
        <ul aria-label="Filtros ativos" className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <li key={chip.key}>
              <Chip variant="caption" color="soft" className="gap-1 ps-2 pe-1">
                <span>{chip.text}</span>
                <button
                  type="button"
                  aria-label={`Remover filtro ${chip.text}`}
                  onClick={chip.remove}
                  className="inline-flex size-4 cursor-pointer items-center justify-center rounded-sm text-foreground-icon-secondary outline-none hover:bg-background-tertiary-default hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring"
                >
                  <RiCloseLine className="size-3.5" aria-hidden />
                </button>
              </Chip>
            </li>
          ))}
        </ul>
      ) : null}

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>
    </div>
  );
}

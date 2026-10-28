"use client";

import { useEffect, useRef, useState } from "react";
import { RiAddLine, RiCloseLine, RiFilter3Line } from "@remixicon/react";
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
} from "react-aria-components";
import { Button, buttonStyles } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { InputBase } from "@/components/base/input/input";
import { Select, SelectItem } from "@/components/base/select/select";
import { MENU_POPOVER_SURFACE } from "@/components/base/dropdown/menu-styles";
import { cx } from "@/utils/cx";
import { useTriggerToggle } from "@/utils/use-dismiss-on-outside-press";
import type { FilterBarField, FilterBarOperator, FilterCondition } from "./filter-types";

export interface FilterConditionsProps {
  fields: FilterBarField[];
  operators: FilterBarOperator[];
  /** Condições aplicadas. */
  conditions: FilterCondition[];
  onApply: (conditions: FilterCondition[]) => void;
  /** Rótulo do botão que abre o popover. */
  label?: string;
  className?: string;
}

let sequence = 0;
const nextId = () => `condicao-${++sequence}`;

/**
 * Filtro por condições em popover: linhas "Onde [campo] [operador] [valor]",
 * "Adicionar condição", "Redefinir" e "Aplicar". As edições ficam em rascunho
 * até "Aplicar".
 */
export function FilterConditions({
  fields,
  operators,
  conditions,
  onApply,
  label = "Filtros avançados",
  className,
}: FilterConditionsProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState<FilterCondition[]>([]);
  const allowOpenChange = useTriggerToggle(isOpen, triggerRef);

  const blank = (): FilterCondition => ({
    id: nextId(),
    fieldId: fields[0]?.id ?? "",
    operatorId: operators[0]?.id ?? "",
    value: "",
  });

  const open = () => {
    setDraft(conditions.length > 0 ? conditions.map((c) => ({ ...c })) : [blank()]);
    setIsOpen(true);
  };

  // O Select aninhado abre em outro portal: cliques nele não fecham este popover.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Element | null;
      if (!target) return;
      if (triggerRef.current?.contains(target) || popoverRef.current?.contains(target)) return;
      if (target.closest("[data-trigger]")) return;
      setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isOpen]);

  const update = (id: string, patch: Partial<FilterCondition>) =>
    setDraft((rows) => rows.map((row) => (row.id === id ? { ...row, ...patch } : row)));

  const apply = () => {
    onApply(draft.filter((row) => row.value.trim() !== ""));
    setIsOpen(false);
  };

  return (
    <AriaDialogTrigger
      isOpen={isOpen}
      onOpenChange={(next) => {
        if (!allowOpenChange(next)) return;
        if (next) open();
        else setIsOpen(false);
      }}
    >
      <AriaButton
        ref={triggerRef}
        className={cx(
          buttonStyles.base,
          buttonStyles.size.small,
          buttonStyles.variant.secondary,
          "gap-1",
          className,
        )}
      >
        <RiFilter3Line className={buttonStyles.icon.small} aria-hidden />
        <span className={buttonStyles.label.small}>{label}</span>
        {conditions.length > 0 ? (
          <span className="rounded-sm bg-accent-400 px-1 py-px text-caption-1-semibold text-white">
            {conditions.length}
          </span>
        ) : null}
      </AriaButton>
      <AriaPopover
        ref={popoverRef}
        isNonModal
        placement="bottom start"
        offset={4}
        className={cx(MENU_POPOVER_SURFACE, "w-[min(640px,calc(100vw-32px))] p-3")}
      >
        <AriaDialog aria-label="Filtrar por condições" className="flex flex-col gap-3 outline-none">
          <p className="text-headline-semibold text-text-primary">Filtrar por condições</p>

          <ul className="flex flex-col gap-2">
            {draft.map((row, index) => {
              const field = fields.find((f) => f.id === row.fieldId);
              const position = index + 1;
              return (
                <li key={row.id} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                  <span className="w-10 shrink-0 text-body-2-medium text-text-secondary">
                    {index === 0 ? "Onde" : "E"}
                  </span>
                  <Select
                    size="sm"
                    aria-label={`Campo da condição ${position}`}
                    className="min-w-[120px] flex-1"
                    selectedKey={row.fieldId}
                    onSelectionChange={(key) => update(row.id, { fieldId: String(key), value: "" })}
                  >
                    {fields.map((f) => (
                      <SelectItem key={f.id} id={f.id} textValue={f.label}>
                        {f.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <Select
                    size="sm"
                    aria-label={`Operador da condição ${position}`}
                    className="w-[110px] shrink-0"
                    selectedKey={row.operatorId}
                    onSelectionChange={(key) => update(row.id, { operatorId: String(key) })}
                  >
                    {operators.map((o) => (
                      <SelectItem key={o.id} id={o.id} textValue={o.label}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </Select>
                  {field?.options ? (
                    <Select
                      size="sm"
                      aria-label={`Valor da condição ${position}`}
                      placeholder="Selecionar"
                      className="min-w-[140px] flex-1"
                      selectedKey={row.value || null}
                      onSelectionChange={(key) => update(row.id, { value: String(key) })}
                    >
                      {field.options.map((o) => (
                        <SelectItem key={o.value} id={o.value} textValue={o.label}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </Select>
                  ) : (
                    <InputBase
                      size="small"
                      aria-label={`Valor da condição ${position}`}
                      placeholder="Valor"
                      value={row.value}
                      onChange={(e) => update(row.id, { value: e.target.value })}
                      fieldClassName="min-w-[140px] flex-1"
                      className="text-body-2-medium"
                    />
                  )}
                  <IconButton
                    icon={RiCloseLine}
                    size="small"
                    aria-label={`Remover condição ${position}`}
                    onClick={() => setDraft((rows) => rows.filter((r) => r.id !== row.id))}
                  />
                </li>
              );
            })}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-separator-border pt-3">
            <Button
              variant="ghost"
              size="small"
              leadingIcon={RiAddLine}
              onClick={() => setDraft((rows) => [...rows, blank()])}
            >
              Adicionar condição
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="small" onClick={() => setDraft([blank()])}>
                Redefinir
              </Button>
              <Button size="small" onClick={apply}>
                Aplicar
              </Button>
            </div>
          </div>
        </AriaDialog>
      </AriaPopover>
    </AriaDialogTrigger>
  );
}

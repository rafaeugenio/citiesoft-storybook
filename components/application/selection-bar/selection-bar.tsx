"use client";

import type { ComponentType } from "react";
import { RiCloseLine } from "@remixicon/react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface SelectionBarAction {
  id: string;
  label: string;
  icon?: IconComponent;
  /** `danger` para ações destrutivas. Padrão `neutral`. */
  tone?: "neutral" | "danger";
  onPress: () => void;
  isDisabled?: boolean;
}

export interface SelectionBarProps {
  /** Quantidade de itens selecionados. Com 0 a barra some. */
  count: number;
  actions: SelectionBarAction[];
  onClear: () => void;
  /** `viewport`: fixa na parte de baixo da janela. `container`: sticky dentro do contêiner rolável. */
  position?: "viewport" | "container";
  /** Texto do contador. Padrão: "3 selecionados" / "1 selecionado". */
  countLabel?: (count: number) => string;
  clearLabel?: string;
  /** Nome da região, lido por leitores de tela. */
  regionLabel?: string;
  className?: string;
}

const defaultCountLabel = (n: number) => `${n} ${n === 1 ? "selecionado" : "selecionados"}`;

/**
 * Barra flutuante de seleção em massa: pílula com contador, ações e botão de
 * limpar. Substitui a barra de filtros enquanto há seleção. A contagem é
 * anunciada em região polida.
 */
export function SelectionBar({
  count,
  actions,
  onClear,
  position = "viewport",
  countLabel = defaultCountLabel,
  clearLabel = "Limpar seleção",
  regionLabel = "Ações em massa",
  className,
}: SelectionBarProps) {
  const reduce = useReducedMotion();

  return (
    <div
      className={cx(
        "pointer-events-none inset-x-0 bottom-4 z-30 flex justify-center px-4",
        position === "viewport" ? "fixed" : "sticky",
        className,
      )}
    >
      <AnimatePresence>
        {count > 0 ? (
          <motion.div
            key="barra"
            role="region"
            aria-label={regionLabel}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: reduce ? 0 : 0.16, ease: "easeOut" }}
            className={cx(
              "pointer-events-auto flex max-w-full flex-wrap items-center gap-x-2 gap-y-2 p-2",
              "rounded-3xl border border-border-button-default bg-background-primary-default shadow-dropdown",
            )}
          >
            <p
              role="status"
              aria-live="polite"
              className="px-2 text-body-medium whitespace-nowrap text-text-primary"
            >
              {countLabel(count)}
            </p>
            <span aria-hidden className="hidden h-5 w-px bg-separator-border sm:block" />
            <div className="flex flex-wrap items-center gap-2">
              {actions.map((action) => (
                <Button
                  key={action.id}
                  size="small"
                  variant={action.tone === "danger" ? "danger" : "secondary"}
                  leadingIcon={action.icon}
                  disabled={action.isDisabled}
                  onClick={action.onPress}
                >
                  {action.label}
                </Button>
              ))}
            </div>
            <Button
              variant="ghost"
              size="small"
              iconOnly
              leadingIcon={RiCloseLine}
              aria-label={clearLabel}
              onClick={onClear}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

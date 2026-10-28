"use client";

import type { ComponentType, ReactNode } from "react";
import { RiInboxLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type EstadoTamanho = "sm" | "md" | "lg";
export type EstadoTom = "neutro" | "erro";

export interface EmptyStateProps {
  /** Ícone (referência de componente Remix). Padrão: caixa de entrada vazia. */
  icon?: IconComponent;
  title: ReactNode;
  description?: ReactNode;
  /** Ação principal (por exemplo, um `Button`). */
  action?: ReactNode;
  /** Ação secundária, ao lado da principal. */
  secondaryAction?: ReactNode;
  size?: EstadoTamanho;
  tone?: EstadoTom;
  /** Elemento do título. Padrão `p`, para não quebrar a hierarquia de títulos da página. */
  titleAs?: "p" | "h2" | "h3" | "h4";
  className?: string;
}

const sizes = {
  sm: { wrap: "gap-3 px-4 py-8", disc: "size-10", icon: "size-5", title: "text-body-medium", text: "text-body-2-regular", max: "max-w-[320px]" },
  md: { wrap: "gap-4 px-6 py-12", disc: "size-12", icon: "size-6", title: "text-headline-semibold", text: "text-body-regular", max: "max-w-[400px]" },
  lg: { wrap: "gap-5 px-6 py-16", disc: "size-16", icon: "size-8", title: "text-title-3-semibold", text: "text-body-regular", max: "max-w-[480px]" },
} as const;

/**
 * Estado vazio centrado: ícone leve, frase que explica a ausência e uma ação.
 * Serve para "sem registros" (com ação de criar) e "sem resultado de filtro"
 * (com ação de limpar filtros).
 */
export function EmptyState({
  icon: Icon = RiInboxLine,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  tone = "neutro",
  titleAs: Title = "p",
  className,
}: EmptyStateProps) {
  const s = sizes[size];
  return (
    <div className={cx("flex w-full flex-col items-center justify-center text-center", s.wrap, className)}>
      <span
        aria-hidden
        className={cx(
          "inline-flex shrink-0 items-center justify-center rounded-full",
          s.disc,
          tone === "erro"
            ? "bg-background-tertiary-error text-foreground-icon-error"
            : "bg-background-tertiary-default text-foreground-icon-tertiary",
        )}
      >
        <Icon className={s.icon} aria-hidden />
      </span>
      <div className={cx("flex flex-col items-center gap-1", s.max)}>
        <Title className={cx(s.title, "text-text-primary")}>{title}</Title>
        {description ? <p className={cx(s.text, "text-text-secondary")}>{description}</p> : null}
      </div>
      {action || secondaryAction ? (
        <div className="flex flex-wrap items-center justify-center gap-2">
          {action}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}

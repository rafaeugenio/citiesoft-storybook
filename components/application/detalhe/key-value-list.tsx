import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface KeyValueItem {
  key?: string;
  label: string;
  /** Valor exibido. Vazio mostra `emptyText`. */
  value?: ReactNode;
  /** Colunas ocupadas (1 a 3). Útil para textos longos. */
  span?: 1 | 2 | 3;
}

export interface KeyValueListProps {
  items: KeyValueItem[];
  columns?: 1 | 2 | 3;
  /** Texto para valor vazio. */
  emptyText?: string;
  /** `rows` coloca rótulo e valor lado a lado com divisórias (padrão de cartão). */
  layout?: "stacked" | "rows";
  className?: string;
}

const COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
} as const;

const SPAN = {
  1: "",
  2: "sm:col-span-2",
  3: "sm:col-span-2 lg:col-span-3",
} as const;

/** Lista de pares rótulo e valor, de 1 a 3 colunas. */
export function KeyValueList({
  items,
  columns = 2,
  emptyText = "Não informado",
  layout = "stacked",
  className,
}: KeyValueListProps) {
  if (layout === "rows") {
    return (
      <dl className={cx("flex flex-col divide-y divide-separator-border", className)}>
        {items.map((item) => (
          <div key={item.key ?? item.label} className="flex flex-col gap-0.5 py-3 first:pt-0 last:pb-0 sm:flex-row sm:gap-4">
            <dt className="text-body-regular text-text-secondary sm:w-1/3 sm:shrink-0">{item.label}</dt>
            <dd className="min-w-0 text-body-medium break-words text-text-primary">
              {item.value ?? <span className="text-text-tertiary">{emptyText}</span>}
            </dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <dl className={cx("grid gap-x-6 gap-y-4", COLUMNS[columns], className)}>
      {items.map((item) => (
        <div key={item.key ?? item.label} className={cx("flex min-w-0 flex-col gap-0.5", SPAN[item.span ?? 1])}>
          <dt className="text-caption-1-medium text-text-secondary">{item.label}</dt>
          <dd className="text-body-medium break-words text-text-primary">
            {item.value ?? <span className="text-text-tertiary">{emptyText}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}

import type { ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface FormGridProps {
  /** Colunas a partir de `md`. No celular a grade é sempre de 1 coluna. */
  columns?: 1 | 2 | 3;
  children: ReactNode;
  className?: string;
}

const COLUMNS = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
} as const;

/** Grade responsiva de campos, de 1 a 3 colunas. */
export function FormGrid({ columns = 2, children, className }: FormGridProps) {
  return <div className={cx("grid gap-x-4 gap-y-5", COLUMNS[columns], className)}>{children}</div>;
}

export interface FormFieldProps {
  /** Quantas colunas o campo ocupa. `full` ocupa a linha inteira. */
  span?: 1 | 2 | 3 | "full";
  children: ReactNode;
  className?: string;
}

const SPAN = {
  1: "",
  2: "md:col-span-2",
  3: "md:col-span-2 lg:col-span-3",
  full: "col-span-full",
} as const;

/** Envoltório de campo que controla a largura dentro de `FormGrid`. */
export function FormField({ span = 1, children, className }: FormFieldProps) {
  return <div className={cx("flex min-w-0 flex-col", SPAN[span], className)}>{children}</div>;
}

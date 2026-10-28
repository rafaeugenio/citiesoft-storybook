"use client";

import { cx } from "@/utils/cx";

/** Barra de carregamento. Pulsa, exceto com `prefers-reduced-motion`. */
export function SkeletonBar({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cx(
        "block h-3 rounded-md bg-background-tertiary-default motion-safe:animate-pulse",
        className,
      )}
    />
  );
}

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  /** Reserva uma coluna estreita para o checkbox de seleção. */
  showSelection?: boolean;
  /** Texto lido por leitores de tela. */
  label?: string;
  density?: "compact" | "comfortable";
  className?: string;
}

const WIDTHS = ["w-24", "w-40", "w-32", "w-20", "w-28", "w-36"];

/**
 * Linhas de carregamento no formato de uma tabela, para o primeiro acesso.
 * Cabeçalho e filtros da tela permanecem visíveis, sem indicador global.
 */
export function TableSkeleton({
  rows = 6,
  columns = 5,
  showSelection = false,
  label = "Carregando registros",
  density = "comfortable",
  className,
}: TableSkeletonProps) {
  return (
    <div role="status" aria-label={label} className={cx("flex w-full flex-col", className)}>
      {Array.from({ length: rows }, (_, row) => (
        <div
          key={row}
          aria-hidden
          className={cx(
            "flex items-center gap-4 px-3",
            density === "compact" ? "h-10" : "h-14",
            row < rows - 1 && "border-b border-separator-border",
          )}
        >
          {showSelection ? <SkeletonBar className="size-4 shrink-0" /> : null}
          {Array.from({ length: columns }, (_, col) => (
            <div key={col} className="flex flex-1 items-center">
              <SkeletonBar className={WIDTHS[(row + col) % WIDTHS.length]} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

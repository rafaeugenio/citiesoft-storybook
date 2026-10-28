import type { ReactNode } from "react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

/**
 * DrawerActions: rodapé padrão do Drawer (e útil em Dialog).
 * Ação destrutiva opcional fica à esquerda; secundária e primária à direita.
 */
export interface DrawerActionsProps {
  primaryLabel?: string;
  onPrimary?: () => void;
  /** Rótulo do botão primário enquanto `isLoading`. */
  loadingLabel?: string;
  secondaryLabel?: string;
  onSecondary?: () => void;
  destructiveLabel?: string;
  onDestructive?: () => void;
  /** Tom do botão primário. */
  primaryTone?: "primary" | "danger";
  isLoading?: boolean;
  isPrimaryDisabled?: boolean;
  /** Se verdadeiro, o primário envia o formulário de id `form`. */
  form?: string;
  /** Conteúdo extra à esquerda (ex.: aviso de alterações não salvas). */
  leading?: ReactNode;
  className?: string;
}

export function DrawerActions({
  primaryLabel = "Salvar",
  onPrimary,
  loadingLabel = "Salvando…",
  secondaryLabel = "Cancelar",
  onSecondary,
  destructiveLabel,
  onDestructive,
  primaryTone = "primary",
  isLoading = false,
  isPrimaryDisabled = false,
  form,
  leading,
  className,
}: DrawerActionsProps) {
  return (
    <div className={cx("flex flex-wrap items-center justify-between gap-3", className)} aria-busy={isLoading || undefined}>
      <div className="flex min-w-0 items-center gap-3">
        {destructiveLabel && (
          <Button type="button" variant="danger" onClick={onDestructive} disabled={isLoading}>
            {destructiveLabel}
          </Button>
        )}
        {leading}
      </div>
      <div className="ms-auto flex items-center gap-2">
        {secondaryLabel && (
          <Button type="button" variant="secondary" onClick={onSecondary} disabled={isLoading}>
            {secondaryLabel}
          </Button>
        )}
        <Button
          type={form ? "submit" : "button"}
          form={form}
          variant={primaryTone}
          onClick={onPrimary}
          disabled={isLoading || isPrimaryDisabled}
        >
          {isLoading ? loadingLabel : primaryLabel}
        </Button>
      </div>
    </div>
  );
}

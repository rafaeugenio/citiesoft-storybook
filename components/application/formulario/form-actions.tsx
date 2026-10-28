import type { ReactNode } from "react";
import { RiLoader4Line } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

export interface FormActionsProps {
  primaryLabel?: string;
  /** Rótulo durante o envio. Padrão: "Salvando…". */
  loadingLabel?: string;
  cancelLabel?: string;
  /** Ação secundária (ex.: "Salvar rascunho"), entre Cancelar e Salvar. */
  secondaryLabel?: string;
  onSecondary?: () => void;
  onCancel?: () => void;
  /** Quando definido, o botão primário é `type="button"`; senão envia o formulário. */
  onPrimary?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  /** Oculta o botão Cancelar. */
  hideCancel?: boolean;
  /** Informação à esquerda do grupo de ações (ex.: "Alterações não salvas"). */
  info?: ReactNode;
  /** Fixa a barra no rodapé da área rolável. Padrão: verdadeiro. */
  sticky?: boolean;
  className?: string;
}

/** Barra de ações do formulário: Cancelar à esquerda, Salvar à direita. */
export function FormActions({
  primaryLabel = "Salvar",
  loadingLabel = "Salvando",
  cancelLabel = "Cancelar",
  secondaryLabel,
  onSecondary,
  onCancel,
  onPrimary,
  isLoading = false,
  isDisabled = false,
  hideCancel = false,
  info,
  sticky = true,
  className,
}: FormActionsProps) {
  return (
    <div
      className={cx(
        "flex flex-wrap items-center justify-between gap-3 border-t border-separator-border bg-background-full px-4 py-3 sm:px-6",
        sticky && "sticky bottom-0 z-10",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-3">
        {hideCancel ? null : (
          <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
        )}
        {info ? <span className="text-body-regular text-text-secondary">{info}</span> : null}
      </div>
      <div className="flex items-center gap-2">
        {secondaryLabel ? (
          <Button variant="ghost" onClick={onSecondary} disabled={isLoading || isDisabled}>
            {secondaryLabel}
          </Button>
        ) : null}
        <Button
          type={onPrimary ? "button" : "submit"}
          onClick={onPrimary}
          aria-disabled={isLoading || isDisabled || undefined}
          aria-busy={isLoading || undefined}
          disabled={isDisabled && !isLoading}
          leadingIcon={isLoading ? RiLoader4Line : undefined}
        >
          {isLoading ? `${loadingLabel}…` : primaryLabel}
        </Button>
      </div>
    </div>
  );
}

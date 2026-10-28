"use client";

import type { ReactNode } from "react";
import { RiAlertLine, RiQuestionLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { Dialog, type DialogSize } from "./dialog";

/**
 * ConfirmDialog: confirmação, inclusive destrutiva com o número exato de
 * registros afetados. Com `affectedCount`, o título padrão vira
 * "Excluir 3 registros?" (singular quando 1).
 */
export interface ConfirmDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => void;
  onCancel?: () => void;
  tone?: "neutral" | "danger";
  /** Substitui o título gerado. */
  title?: string;
  description?: ReactNode;
  /** Quantidade exata de registros afetados. */
  affectedCount?: number;
  /** Verbo do título gerado e do botão de confirmação padrão. */
  verb?: string;
  entitySingular?: string;
  entityPlural?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Rótulo do botão de confirmação durante `isLoading`. */
  loadingLabel?: string;
  isLoading?: boolean;
  size?: DialogSize;
  children?: ReactNode;
}

export function ConfirmDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  onCancel,
  tone = "neutral",
  title,
  description,
  affectedCount,
  verb,
  entitySingular = "registro",
  entityPlural = "registros",
  confirmLabel,
  cancelLabel = "Cancelar",
  loadingLabel,
  isLoading = false,
  size = "sm",
  children,
}: ConfirmDialogProps) {
  const danger = tone === "danger";
  const action = verb ?? (danger ? "Excluir" : "Confirmar");
  const generated =
    affectedCount === undefined
      ? `${action}?`
      : `${action} ${affectedCount} ${affectedCount === 1 ? entitySingular : entityPlural}?`;
  const finalTitle = title ?? generated;
  const close = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => (open ? onOpenChange(true) : !isLoading && close())}
      isDismissable={!isLoading}
      role={danger ? "alertdialog" : "dialog"}
      title={finalTitle}
      description={description}
      icon={danger ? RiAlertLine : RiQuestionLine}
      size={size}
      hideCloseButton
      footer={
        <div className="flex items-center justify-end gap-2" aria-busy={isLoading || undefined}>
          <Button type="button" variant="secondary" onClick={close} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant={danger ? "danger" : "primary"}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? (loadingLabel ?? "Aguarde…") : (confirmLabel ?? action)}
          </Button>
        </div>
      }
    >
      {children}
    </Dialog>
  );
}

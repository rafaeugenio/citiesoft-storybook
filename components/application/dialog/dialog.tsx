"use client";

import type { ComponentType, ReactNode } from "react";
import { Dialog as AriaDialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { RiCloseLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Dialog: modal central. Cabeçalho e rodapé fixos, corpo rolável.
 * Fecha com Esc, clique fora e botão de fechar; o foco volta ao gatilho.
 */

export type DialogSize = "sm" | "md" | "lg";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface DialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description?: ReactNode;
  icon?: IconComponent;
  size?: DialogSize;
  footer?: ReactNode;
  isDismissable?: boolean;
  /** `alertdialog` para confirmações que exigem resposta explícita. */
  role?: "dialog" | "alertdialog";
  closeLabel?: string;
  /** Oculta o botão de fechar do cabeçalho. */
  hideCloseButton?: boolean;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}

const SIZE: Record<DialogSize, string> = {
  sm: "w-[400px]",
  md: "w-[520px]",
  lg: "w-[720px]",
};

export function Dialog({
  isOpen,
  onOpenChange,
  title,
  description,
  icon: Icon,
  size = "md",
  footer,
  isDismissable = true,
  role = "dialog",
  closeLabel = "Fechar",
  hideCloseButton = false,
  className,
  bodyClassName,
  children,
}: DialogProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
      className={cx(
        "fixed inset-0 z-100 flex items-center justify-center bg-black/40 p-4",
        "transition-opacity duration-200 ease-out motion-reduce:transition-none",
        "data-[entering]:opacity-0 data-[exiting]:opacity-0",
      )}
    >
      <Modal
        className={cx(
          "flex max-h-full max-w-full flex-col overflow-hidden rounded-3xl border border-border-button-default",
          "bg-background-primary-default shadow-xl outline-none",
          "transition duration-200 ease-out motion-reduce:transition-none",
          "data-[entering]:scale-95 data-[entering]:opacity-0 data-[exiting]:scale-95 data-[exiting]:opacity-0",
          SIZE[size],
          className,
        )}
      >
        <AriaDialog role={role} aria-label={title} className="flex min-h-0 flex-1 flex-col outline-none">
          {({ close }) => (
            <>
              <header className="flex shrink-0 items-start gap-3 px-6 pb-2 pt-6">
                {Icon && (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background-tertiary-default text-foreground-icon-secondary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <Heading slot="title" className="text-title-3-semibold text-text-primary">
                    {title}
                  </Heading>
                  {description && <p className="text-body-regular text-text-secondary">{description}</p>}
                </div>
                {!hideCloseButton && (
                  <button
                    type="button"
                    aria-label={closeLabel}
                    onClick={close}
                    className={cx(
                      "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full",
                      "bg-background-tertiary-default text-foreground-icon-secondary",
                      "transition-colors duration-150 hover:bg-background-tertiary-hover",
                      "outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    )}
                  >
                    <RiCloseLine className="size-4" aria-hidden />
                  </button>
                )}
              </header>
              {children && (
                <div className={cx("min-h-0 flex-1 overflow-y-auto px-6 py-3", bodyClassName)}>{children}</div>
              )}
              {footer && <footer className="shrink-0 px-6 pb-6 pt-4">{footer}</footer>}
            </>
          )}
        </AriaDialog>
      </Modal>
    </ModalOverlay>
  );
}

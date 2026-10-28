"use client";

import type { ComponentType, ReactNode } from "react";
import { Dialog, Heading, Modal, ModalOverlay } from "react-aria-components";
import { RiCloseLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * Drawer: painel lateral para cadastro, edição e detalhe.
 *
 * Cabeçalho e rodapé ficam fixos, só o corpo rola. Fecha com Esc, clique fora
 * e botão de fechar; o foco volta ao gatilho. A animação é curta e some com
 * `prefers-reduced-motion`.
 */

export type DrawerSize = "sm" | "md" | "lg" | "xl";
export type DrawerSide = "end" | "start";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface DrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  description?: ReactNode;
  icon?: IconComponent;
  size?: DrawerSize;
  side?: DrawerSide;
  /** Rodapé fixo, normalmente `DrawerActions`. */
  footer?: ReactNode;
  /** Se falso, Esc e clique fora não fecham (ex.: durante o salvamento). */
  isDismissable?: boolean;
  /** Rótulo acessível do botão de fechar. */
  closeLabel?: string;
  className?: string;
  /** Classes do corpo rolável. */
  bodyClassName?: string;
  children: ReactNode;
}

const SIZE: Record<DrawerSize, string> = {
  sm: "w-96",
  md: "w-[480px]",
  lg: "w-[640px]",
  xl: "w-[800px]",
};

const SIDE: Record<DrawerSide, string> = {
  end: [
    "end-0 border-s",
    "data-[entering]:translate-x-full data-[exiting]:translate-x-full",
    "rtl:data-[entering]:-translate-x-full rtl:data-[exiting]:-translate-x-full",
  ].join(" "),
  start: [
    "start-0 border-e",
    "data-[entering]:-translate-x-full data-[exiting]:-translate-x-full",
    "rtl:data-[entering]:translate-x-full rtl:data-[exiting]:translate-x-full",
  ].join(" "),
};

export function Drawer({
  isOpen,
  onOpenChange,
  title,
  description,
  icon: Icon,
  size = "md",
  side = "end",
  footer,
  isDismissable = true,
  closeLabel = "Fechar",
  className,
  bodyClassName,
  children,
}: DrawerProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
      className={cx(
        "fixed inset-0 z-100 bg-black/40",
        "transition-opacity duration-200 ease-out motion-reduce:transition-none",
        "data-[entering]:opacity-0 data-[exiting]:opacity-0",
      )}
    >
      <Modal
        className={cx(
          "fixed inset-y-0 flex max-w-full flex-col bg-background-primary-default shadow-xl outline-none",
          "border-border-button-default",
          "transition-transform duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none",
          SIZE[size],
          SIDE[side],
          className,
        )}
      >
        <Dialog aria-label={title} className="flex min-h-0 flex-1 flex-col outline-none">
          {({ close }) => (
            <>
              <header className="flex shrink-0 items-start gap-3 border-b border-separator-border px-6 py-4">
                {Icon && (
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-background-tertiary-default text-foreground-icon-secondary">
                    <Icon className="size-5" aria-hidden />
                  </span>
                )}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Heading slot="title" className="truncate text-title-3-semibold text-text-primary">
                    {title}
                  </Heading>
                  {description && <p className="text-body-regular text-text-secondary">{description}</p>}
                </div>
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
              </header>
              <div
                // tabIndex permite rolar o corpo pelo teclado quando não há campo focável
                tabIndex={0}
                className={cx(
                  "min-h-0 flex-1 overflow-y-auto px-6 py-5 outline-none",
                  "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring",
                  bodyClassName,
                )}
              >
                {children}
              </div>
              {footer && (
                <footer className="shrink-0 border-t border-separator-border bg-background-primary-default px-6 py-4">
                  {footer}
                </footer>
              )}
            </>
          )}
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

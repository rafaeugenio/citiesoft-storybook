"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { BrandLogo } from "@/components/application/app-frame/brand-logo";
import { cx } from "@/utils/cx";

export type AuthLayout = "card" | "dividido";

export interface AuthMolduraProps {
  layout?: AuthLayout;
  /** Altura fixa de janela (previews). */
  contained?: boolean;
  title: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  /** Foca o primeiro campo ao montar (regra dos templates de autenticação). */
  autoFocus?: boolean;
}

/**
 * Moldura das telas de autenticação, no mesmo molde visual do LoginSimples:
 * cartão de até 400px ou layout dividido com painel de marca.
 */
export function AuthMoldura({
  layout = "card",
  contained = false,
  title,
  description,
  children,
  footer,
  autoFocus = true,
}: AuthMolduraProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!autoFocus) return;
    const alvo = ref.current?.querySelector<HTMLElement>("input:not([disabled]):not([type=hidden])");
    alvo?.focus({ preventScroll: true });
  }, [autoFocus]);

  const conteudo = (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        <BrandLogo className="self-start" />
        <div className="flex flex-col gap-1.5">
          <h1 className="text-title-2-medium text-text-primary">{title}</h1>
          {description ? <p className="text-body-regular text-text-secondary">{description}</p> : null}
        </div>
      </div>
      {children}
    </div>
  );

  const rodape = footer ? (
    <div className="text-center text-caption-1-regular text-text-tertiary">{footer}</div>
  ) : null;

  const altura = contained ? "h-[var(--template-preview-height,640px)] min-h-0 overflow-y-auto" : "min-h-dvh";

  if (layout === "dividido") {
    return (
      <div ref={ref} className={cx("grid w-full bg-background-full lg:grid-cols-2", altura)}>
        <div className="relative hidden flex-col justify-between bg-accent-800 p-10 text-white lg:flex">
          <BrandLogo tone="on-dark" />
          <div className="flex max-w-md flex-col gap-3">
            <p className="text-title-1-medium">Gestão pública com menos burocracia.</p>
            <p className="text-body-regular text-white/80">
              Solicitações, regulação e acompanhamento no mesmo lugar, com histórico de cada etapa.
            </p>
          </div>
          <p className="text-caption-1-regular text-white/70">Citiesoft</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-6 p-6 sm:p-10">
          <div className="w-full max-w-[400px]">{conteudo}</div>
          {rodape}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={cx("flex w-full flex-col items-center justify-center gap-4 bg-background-full p-4", altura)}>
      <div className="w-full max-w-[400px] rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-xs sm:p-8">
        {conteudo}
      </div>
      {rodape}
    </div>
  );
}

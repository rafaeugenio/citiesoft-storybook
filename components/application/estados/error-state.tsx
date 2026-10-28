"use client";

import type { ComponentType, ReactNode } from "react";
import { RiErrorWarningLine, RiRefreshLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { EmptyState } from "./empty-state";
import type { EstadoTamanho } from "./empty-state";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface ErrorStateProps {
  icon?: IconComponent;
  title?: ReactNode;
  description?: ReactNode;
  /** Quando informado, exibe o botão de nova tentativa. */
  onRetry?: () => void;
  retryLabel?: string;
  /** Ação extra (por exemplo, "Falar com o suporte"). */
  secondaryAction?: ReactNode;
  size?: EstadoTamanho;
  titleAs?: "p" | "h2" | "h3" | "h4";
  className?: string;
}

/** Estado de erro de carregamento: ícone de alerta, mensagem de falha e "Tentar novamente". */
export function ErrorState({
  icon = RiErrorWarningLine,
  title = "Não foi possível carregar os dados",
  description = "Houve uma falha na conexão com o servidor. Os dados não foram alterados.",
  onRetry,
  retryLabel = "Tentar novamente",
  secondaryAction,
  size = "md",
  titleAs,
  className,
}: ErrorStateProps) {
  return (
    <div role="alert" className="w-full">
      <EmptyState
        tone="erro"
        icon={icon}
        title={title}
        description={description}
        size={size}
        titleAs={titleAs}
        className={className}
        action={
          onRetry ? (
            <Button variant="secondary" size="small" leadingIcon={RiRefreshLine} onClick={onRetry}>
              {retryLabel}
            </Button>
          ) : undefined
        }
        secondaryAction={secondaryAction}
      />
    </div>
  );
}

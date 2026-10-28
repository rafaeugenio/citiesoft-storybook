"use client";

import { RiCheckboxCircleLine, RiCloseLine } from "@remixicon/react";
import { IconButton } from "@/components/base/buttons/icon-button";

export interface AvisoStatusProps {
  mensagem: string;
  onDispensar: () => void;
}

/** Confirmação curta de uma ação, anunciada em região polida. */
export function AvisoStatus({ mensagem, onDispensar }: AvisoStatusProps) {
  return (
    <div
      role="status"
      className="flex items-center gap-2 rounded-2xl border border-border-button-default bg-background-primary-default px-4 py-2.5"
    >
      <RiCheckboxCircleLine className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
      <p className="flex-1 text-body-medium text-text-primary">{mensagem}</p>
      <IconButton icon={RiCloseLine} size="small" aria-label="Dispensar aviso" onClick={onDispensar} />
    </div>
  );
}

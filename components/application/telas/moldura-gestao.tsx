"use client";

import type { ReactNode } from "react";
import { AppFrame } from "@/components/application/app-frame/app-frame";
import type { AppFrameCrumb } from "@/components/application/app-frame/app-frame";
import { MENU_USUARIO_GESTAO, NAV_GESTAO, USUARIO_GESTAO } from "./dados/navegacao-gestao";

export interface MolduraGestaoProps {
  /** Chave do item de navegação selecionado. */
  selecionado: string;
  trilha: AppFrameCrumb[];
  contained?: boolean;
  children: ReactNode;
}

/** Moldura do sistema TFD: `AppFrame` com a navegação, o usuário e o conteúdo centralizado. */
export function MolduraGestao({ selecionado, trilha, contained = false, children }: MolduraGestaoProps) {
  return (
    <AppFrame
      navGroups={NAV_GESTAO}
      selected={selecionado}
      user={USUARIO_GESTAO}
      userMenuItems={MENU_USUARIO_GESTAO}
      breadcrumb={trilha}
      notificationCount={3}
      contained={contained}
    >
      <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-4 p-1 sm:p-2">{children}</div>
    </AppFrame>
  );
}

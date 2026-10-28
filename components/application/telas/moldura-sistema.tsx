"use client";

import type { ReactNode } from "react";
import { AppFrame, type AppFrameCrumb } from "@/components/application/app-frame/app-frame";
import { GRUPOS_NAVEGACAO, MENU_USUARIO, USUARIO_EXEMPLO } from "./dados/comum";

export interface MolduraSistemaProps {
  contained?: boolean;
  selected?: string;
  breadcrumb?: AppFrameCrumb[];
  children: ReactNode;
}

/** AppFrame com a navegação, o usuário e o menu padrão das telas TFD. */
export function MolduraSistema({ contained = false, selected = "solicitacoes", breadcrumb, children }: MolduraSistemaProps) {
  return (
    <AppFrame
      navGroups={GRUPOS_NAVEGACAO}
      selected={selected}
      user={USUARIO_EXEMPLO}
      userMenuItems={MENU_USUARIO}
      breadcrumb={breadcrumb}
      notificationCount={3}
      contained={contained}
    >
      {children}
    </AppFrame>
  );
}

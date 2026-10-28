import {
  RiCalendarScheduleLine,
  RiDashboardLine,
  RiDatabase2Line,
  RiFileList3Line,
  RiLogoutBoxRLine,
  RiSettings3Line,
  RiShieldUserLine,
  RiUserHeartLine,
  RiUserLine,
} from "@remixicon/react";
import type {
  AppFrameNavGroup,
  AppFrameUser,
  AppFrameUserMenuItem,
} from "@/components/application/app-frame/app-frame";

/** Navegação do TFD usada pelas telas de listagem, tabelas auxiliares, configurações e usuários. */
export const NAV_GESTAO: AppFrameNavGroup[] = [
  {
    label: "Operação",
    items: [
      { key: "painel", label: "Painel", icon: RiDashboardLine },
      { key: "solicitacoes", label: "Solicitações", icon: RiFileList3Line, badge: 12 },
      { key: "agenda", label: "Agenda de viagens", icon: RiCalendarScheduleLine },
      { key: "pacientes", label: "Pacientes", icon: RiUserHeartLine },
    ],
  },
  {
    label: "Sistema",
    items: [
      { key: "usuarios", label: "Usuários e permissões", icon: RiShieldUserLine },
      { key: "tabelas", label: "Tabelas auxiliares", icon: RiDatabase2Line },
      { key: "configuracoes", label: "Configurações", icon: RiSettings3Line },
    ],
  },
];

export const USUARIO_GESTAO: AppFrameUser = {
  name: "Marina Albuquerque",
  role: "Regulação, Secretaria de Saúde",
  initials: "MA",
};

export const MENU_USUARIO_GESTAO: AppFrameUserMenuItem[] = [
  { key: "perfil", label: "Meu perfil", icon: RiUserLine },
  { key: "configuracoes", label: "Configurações", icon: RiSettings3Line },
  { key: "sair", label: "Sair", icon: RiLogoutBoxRLine },
];

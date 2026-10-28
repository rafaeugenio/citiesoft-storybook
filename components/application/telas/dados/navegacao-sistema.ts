import {
  RiBankLine,
  RiBuilding2Line,
  RiDashboardLine,
  RiFileList3Line,
  RiHospitalLine,
  RiLogoutBoxRLine,
  RiNotification3Line,
  RiRouteLine,
  RiSettings4Line,
  RiTeamLine,
  RiUserLine,
} from "@remixicon/react";
import type {
  AppFrameNavGroup,
  AppFrameUser,
  AppFrameUserMenuItem,
} from "@/components/application/app-frame/app-frame";

/** Navegação e usuário compartilhados pelas telas de exemplo do TFD. */
export const GRUPOS_NAVEGACAO_TFD: AppFrameNavGroup[] = [
  {
    items: [
      { key: "painel", label: "Painel", icon: RiDashboardLine, href: "#painel" },
      { key: "solicitacoes", label: "Solicitações TFD", icon: RiFileList3Line, href: "#solicitacoes", badge: 12 },
      { key: "viagens", label: "Viagens", icon: RiRouteLine, href: "#viagens" },
      { key: "notificacoes", label: "Notificações", icon: RiNotification3Line, href: "#notificacoes" },
    ],
  },
  {
    label: "Cadastros",
    items: [
      { key: "pacientes", label: "Pacientes", icon: RiTeamLine, href: "#pacientes" },
      { key: "unidades", label: "Unidades de saúde", icon: RiHospitalLine, href: "#unidades" },
      { key: "municipios", label: "Municípios", icon: RiBuilding2Line, href: "#municipios" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { key: "ajuda-custo", label: "Ajuda de custo", icon: RiBankLine, href: "#ajuda" },
      { key: "config", label: "Configurações", icon: RiSettings4Line, href: "#config" },
    ],
  },
];

export const USUARIO_TFD: AppFrameUser = {
  name: "Mariana Souza",
  role: "Analista regional",
  initials: "MS",
};

export const MENU_USUARIO_TFD: AppFrameUserMenuItem[] = [
  { key: "perfil", label: "Meu perfil", icon: RiUserLine },
  { key: "sair", label: "Sair", icon: RiLogoutBoxRLine },
];

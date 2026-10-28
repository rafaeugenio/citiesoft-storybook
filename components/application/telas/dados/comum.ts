import {
  RiBankLine,
  RiBuilding2Line,
  RiDashboardLine,
  RiFileList3Line,
  RiHospitalLine,
  RiLogoutBoxRLine,
  RiRouteLine,
  RiSettings4Line,
  RiTeamLine,
  RiUserLine,
} from "@remixicon/react";
import type { AppFrameNavGroup, AppFrameUser, AppFrameUserMenuItem } from "@/components/application/app-frame/app-frame";

/** Navegação do sistema TFD usada nas telas com moldura. */
export const GRUPOS_NAVEGACAO: AppFrameNavGroup[] = [
  {
    items: [
      { key: "painel", label: "Painel", icon: RiDashboardLine, href: "#painel" },
      { key: "solicitacoes", label: "Solicitações TFD", icon: RiFileList3Line, href: "#solicitacoes", badge: 12 },
      { key: "viagens", label: "Viagens", icon: RiRouteLine, href: "#viagens" },
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

export const USUARIO_EXEMPLO: AppFrameUser = { name: "Mariana Souza", role: "Analista regional", initials: "MS" };

export const MENU_USUARIO: AppFrameUserMenuItem[] = [
  { key: "perfil", label: "Meu perfil", icon: RiUserLine },
  { key: "sair", label: "Sair", icon: RiLogoutBoxRLine },
];

export const MUNICIPIOS = ["Açailândia", "Balsas", "Barreirinhas", "Caxias", "Codó", "Imperatriz", "Santa Inês", "São Luís"] as const;

export const ESPECIALIDADES = ["Cardiologia", "Neurologia", "Oncologia", "Ortopedia", "Oftalmologia", "Nefrologia"] as const;

export const UNIDADES_DESTINO = [
  "Hospital Regional de Imperatriz",
  "Hospital Universitário, São Luís",
  "Hospital do Câncer, São Luís",
  "Centro de Especialidades de Caxias",
] as const;

export const TIPOS_TRANSPORTE = ["Ambulância", "Veículo comum", "Transporte aéreo"] as const;

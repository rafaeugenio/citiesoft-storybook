import {
  RiAddCircleLine,
  RiCalendarLine,
  RiFileWarningLine,
  RiMessage3Line,
  RiRouteLine,
  RiSearchLine,
  RiStethoscopeLine,
  RiTimeLine,
} from "@remixicon/react";
import type { DockBarItem } from "@/components/application/dock-bar/dock-bar";

export const ATALHOS_DOCK: DockBarItem[] = [
  { id: "nova", label: "Nova solicitação", icon: RiAddCircleLine },
  { id: "buscar", label: "Buscar paciente", icon: RiSearchLine },
  { id: "agenda", label: "Agenda", icon: RiCalendarLine },
  { id: "mensagens", label: "Mensagens", icon: RiMessage3Line },
];

/** Rótulos curtos para telas estreitas, onde os rótulos completos não cabem na pílula. */
export const ROTULOS_CURTOS: Record<string, string> = {
  nova: "Nova",
  buscar: "Buscar",
  agenda: "Agenda",
  mensagens: "Mensagens",
};

export interface Pendencia {
  id: string;
  rotulo: string;
  quantidade: number;
  detalhe: string;
  acao: string;
  icone: typeof RiTimeLine;
}

/** Pendências do dia da analista regional. Fictício. */
export const PENDENCIAS: Pendencia[] = [
  { id: "docs", rotulo: "Documentos para conferir", quantidade: 8, detalhe: "3 com prazo até hoje", acao: "Abrir fila de documentos", icone: RiFileWarningLine },
  { id: "consultas", rotulo: "Consultas de hoje", quantidade: 5, detalhe: "2 ainda sem transporte", acao: "Ver consultas de hoje", icone: RiStethoscopeLine },
  { id: "viagens", rotulo: "Viagens a confirmar", quantidade: 3, detalhe: "Saídas de amanhã cedo", acao: "Confirmar viagens", icone: RiRouteLine },
  { id: "retornos", rotulo: "Retornos pendentes", quantidade: 2, detalhe: "Aguardando resposta do paciente", acao: "Ver retornos", icone: RiTimeLine },
];

export type SituacaoRecente = "Em análise" | "Aguardando documentos" | "Aprovada" | "Agendada";

export interface SolicitacaoRecente {
  id: string;
  paciente: string;
  iniciais: string;
  protocolo: string;
  especialidade: string;
  destino: string;
  situacao: SituacaoRecente;
  quando: string;
}

export const RECENTES: SolicitacaoRecente[] = [
  { id: "r1", paciente: "Maria Aparecida Lima", iniciais: "ML", protocolo: "TFD-2026-004812", especialidade: "Cardiologia", destino: "São Luís", situacao: "Em análise", quando: "há 12 min" },
  { id: "r2", paciente: "José Raimundo Pereira", iniciais: "JP", protocolo: "TFD-2026-004819", especialidade: "Oncologia", destino: "Teresina", situacao: "Aguardando documentos", quando: "há 40 min" },
  { id: "r3", paciente: "Francisca Almeida Souza", iniciais: "FS", protocolo: "TFD-2026-004826", especialidade: "Oftalmologia", destino: "São Luís", situacao: "Agendada", quando: "há 1 h" },
  { id: "r4", paciente: "Antônio Carlos Ribeiro", iniciais: "AR", protocolo: "TFD-2026-004833", especialidade: "Ortopedia", destino: "Fortaleza", situacao: "Aprovada", quando: "há 2 h" },
  { id: "r5", paciente: "Luzia Helena Barros", iniciais: "LB", protocolo: "TFD-2026-004840", especialidade: "Neurologia", destino: "São Luís", situacao: "Em análise", quando: "há 3 h" },
  { id: "r6", paciente: "Raimundo Nonato Cruz", iniciais: "RC", protocolo: "TFD-2026-004847", especialidade: "Cardiologia", destino: "Teresina", situacao: "Aprovada", quando: "ontem" },
];

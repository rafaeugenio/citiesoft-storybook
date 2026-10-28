import {
  RiCheckboxCircleLine,
  RiFileList3Line,
  RiKey2Line,
  RiLoginCircleLine,
  RiServerLine,
  RiToolsLine,
} from "@remixicon/react";

export type CategoriaNotificacao = "atividade" | "seguranca" | "sistema";
export type GrupoNotificacao = "Hoje" | "Esta semana";

export const ROTULO_CATEGORIA: Record<CategoriaNotificacao, string> = {
  atividade: "Atividade",
  seguranca: "Segurança",
  sistema: "Sistema",
};

export interface Notificacao {
  id: string;
  categoria: CategoriaNotificacao;
  grupo: GrupoNotificacao;
  titulo: string;
  descricao: string;
  tempo: string;
  lida: boolean;
  icone: typeof RiFileList3Line;
  tom: "information" | "success" | "error" | "neutral";
}

export const NOTIFICACOES: Notificacao[] = [
  { id: "n1", categoria: "atividade", grupo: "Hoje", titulo: "Solicitação TFD-2026-004812 aprovada", descricao: "A regulação aprovou a consulta de Cardiologia em São Luís. A viagem pode ser agendada.", tempo: "há 8 min", lida: false, icone: RiCheckboxCircleLine, tom: "success" },
  { id: "n2", categoria: "atividade", grupo: "Hoje", titulo: "Documento anexado à solicitação TFD-2026-004819", descricao: "O laudo médico foi anexado e aguarda conferência.", tempo: "há 35 min", lida: false, icone: RiFileList3Line, tom: "information" },
  { id: "n3", categoria: "seguranca", grupo: "Hoje", titulo: "Novo acesso à conta", descricao: "Acesso a partir de um navegador em São Luís, MA, às 08h12. Se não foi o próprio usuário, a senha deve ser alterada.", tempo: "há 2 h", lida: false, icone: RiLoginCircleLine, tom: "error" },
  { id: "n4", categoria: "sistema", grupo: "Hoje", titulo: "Manutenção programada", descricao: "O sistema fica indisponível das 22h às 6h de 22/10/2026 para atualização.", tempo: "há 3 h", lida: true, icone: RiToolsLine, tom: "neutral" },
  { id: "n5", categoria: "atividade", grupo: "Esta semana", titulo: "Solicitação TFD-2026-004826 negada", descricao: "O motivo informado foi falta de encaminhamento da atenção básica.", tempo: "segunda-feira", lida: false, icone: RiFileList3Line, tom: "error" },
  { id: "n6", categoria: "seguranca", grupo: "Esta semana", titulo: "Senha alterada", descricao: "A senha da conta foi alterada com sucesso.", tempo: "domingo", lida: true, icone: RiKey2Line, tom: "success" },
  { id: "n7", categoria: "sistema", grupo: "Esta semana", titulo: "Resumo semanal disponível", descricao: "O resumo de solicitações da semana anterior está pronto para consulta.", tempo: "domingo", lida: true, icone: RiServerLine, tom: "information" },
  { id: "n8", categoria: "atividade", grupo: "Esta semana", titulo: "Viagem confirmada para 23/10/2026", descricao: "Saída às 5h30 da rodoviária de Barra do Corda, com destino a São Luís.", tempo: "sábado", lida: true, icone: RiCheckboxCircleLine, tom: "success" },
];

export type Frequencia = "imediata" | "diaria" | "semanal";

export const ROTULO_FREQUENCIA: Record<Frequencia, string> = {
  imediata: "Imediata",
  diaria: "Resumo diário",
  semanal: "Resumo semanal",
};

export interface EventoPreferencia {
  id: string;
  rotulo: string;
  email: boolean;
  sistema: boolean;
  frequencia: Frequencia;
  /** Eventos críticos só podem ser imediatos. */
  frequenciaFixa?: boolean;
  /** Segurança: o canal e-mail não pode ser desativado. */
  emailObrigatorio?: boolean;
}

export interface GrupoPreferencia {
  categoria: CategoriaNotificacao;
  eventos: EventoPreferencia[];
}

export const PREFERENCIAS: GrupoPreferencia[] = [
  {
    categoria: "atividade",
    eventos: [
      { id: "nova-solicitacao", rotulo: "Nova solicitação recebida", email: true, sistema: true, frequencia: "imediata" },
      { id: "decisao", rotulo: "Solicitação aprovada ou negada", email: true, sistema: true, frequencia: "imediata" },
      { id: "documento", rotulo: "Documento anexado", email: false, sistema: true, frequencia: "diaria" },
    ],
  },
  {
    categoria: "seguranca",
    eventos: [
      { id: "novo-acesso", rotulo: "Novo acesso à conta", email: true, sistema: true, frequencia: "imediata", frequenciaFixa: true, emailObrigatorio: true },
      { id: "senha", rotulo: "Alteração de senha", email: true, sistema: true, frequencia: "imediata", frequenciaFixa: true, emailObrigatorio: true },
    ],
  },
  {
    categoria: "sistema",
    eventos: [
      { id: "manutencao", rotulo: "Manutenção programada", email: true, sistema: true, frequencia: "imediata" },
      { id: "resumo", rotulo: "Resumo semanal de solicitações", email: true, sistema: false, frequencia: "semanal" },
    ],
  },
];

/** Dados fictícios do hub de configurações da conta. */

export interface PerfilUsuario {
  nome: string;
  email: string;
  cargo: string;
  telefone: string;
}

export const PERFIL_INICIAL: PerfilUsuario = {
  nome: "Marina Albuquerque",
  email: "marina.albuquerque@saude.exemplo.gov.br",
  cargo: "Analista de regulação",
  telefone: "(98) 99999-0000",
};

export interface SessaoAtiva {
  id: string;
  dispositivo: string;
  local: string;
  ultimaAtividade: string;
  atual?: boolean;
}

export const SESSOES_INICIAIS: SessaoAtiva[] = [
  { id: "s1", dispositivo: "Chrome em Windows", local: "São Luís, MA", ultimaAtividade: "Agora", atual: true },
  { id: "s2", dispositivo: "Safari em iPhone", local: "São Luís, MA", ultimaAtividade: "Hoje, 08:12" },
  { id: "s3", dispositivo: "Firefox em Linux", local: "Imperatriz, MA", ultimaAtividade: "19/10/2026, 17:40" },
];

export interface EventoNotificacao {
  id: string;
  rotulo: string;
  descricao: string;
}

export type CanalNotificacao = "email" | "sms" | "sistema";

export const CANAIS: { id: CanalNotificacao; rotulo: string }[] = [
  { id: "email", rotulo: "E-mail" },
  { id: "sms", rotulo: "SMS" },
  { id: "sistema", rotulo: "No sistema" },
];

export const EVENTOS_NOTIFICACAO: EventoNotificacao[] = [
  { id: "nova", rotulo: "Nova solicitação", descricao: "Um município abre uma solicitação para a sua fila." },
  { id: "documento", rotulo: "Documento pendente", descricao: "Um documento obrigatório está há mais de 5 dias sem envio." },
  { id: "situacao", rotulo: "Mudança de situação", descricao: "Uma solicitação acompanhada muda de situação." },
  { id: "agenda", rotulo: "Viagem agendada", descricao: "Uma consulta recebe data, transporte e unidade de destino." },
];

export const NOTIFICACOES_INICIAIS: Record<string, CanalNotificacao[]> = {
  nova: ["email", "sistema"],
  documento: ["sistema"],
  situacao: ["email", "sistema"],
  agenda: ["email", "sms", "sistema"],
};

export const IDIOMAS = ["Português (Brasil)", "Español", "English"];
export const FUSOS = [
  "Brasília (UTC−03:00)",
  "Manaus (UTC−04:00)",
  "Rio Branco (UTC−05:00)",
  "Fernando de Noronha (UTC−02:00)",
];
export const FORMATOS_DATA = ["21/10/2026 (dia, mês e ano)", "2026-10-21 (ano, mês e dia)"];

/** Usuários, convites, papéis e permissões fictícios do TFD. */

export interface Papel {
  id: string;
  nome: string;
  /** Papéis do sistema não são editáveis nem excluíveis, só duplicáveis. */
  sistema: boolean;
}

export const PAPEIS_INICIAIS: Papel[] = [
  { id: "solicitante", nome: "Solicitante", sistema: true },
  { id: "analista", nome: "Analista", sistema: true },
  { id: "regulador", nome: "Regulador", sistema: true },
  { id: "gestor", nome: "Gestor", sistema: true },
  { id: "administrador", nome: "Administrador", sistema: true },
];

export type SituacaoUsuario = "Ativo" | "Desativado";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  /** ISO `AAAA-MM-DD`. */
  entrada: string;
  papel: string;
  situacao: SituacaoUsuario;
  /** Usuário da sessão atual: não pode se desativar nem se remover. */
  atual?: boolean;
}

export const USUARIOS_INICIAIS: Usuario[] = [
  { id: "u1", nome: "Marina Albuquerque", email: "marina.albuquerque@saude.exemplo.gov.br", entrada: "2024-03-11", papel: "administrador", situacao: "Ativo", atual: true },
  { id: "u2", nome: "Carlos Eduardo Sampaio", email: "carlos.sampaio@saude.exemplo.gov.br", entrada: "2024-05-20", papel: "gestor", situacao: "Ativo" },
  { id: "u3", nome: "Luzia Nogueira", email: "luzia.nogueira@saude.exemplo.gov.br", entrada: "2024-08-02", papel: "regulador", situacao: "Ativo" },
  { id: "u4", nome: "Raimundo Carvalho", email: "raimundo.carvalho@saude.exemplo.gov.br", entrada: "2025-01-14", papel: "regulador", situacao: "Ativo" },
  { id: "u5", nome: "Francisca Pereira", email: "francisca.pereira@barradocorda.exemplo.gov.br", entrada: "2025-02-03", papel: "solicitante", situacao: "Ativo" },
  { id: "u6", nome: "José Ribamar Matos", email: "jose.matos@codo.exemplo.gov.br", entrada: "2025-02-19", papel: "solicitante", situacao: "Ativo" },
  { id: "u7", nome: "Ana Beatriz Lima", email: "ana.lima@pinheiro.exemplo.gov.br", entrada: "2025-04-08", papel: "solicitante", situacao: "Ativo" },
  { id: "u8", nome: "Paulo Roberto Coelho", email: "paulo.coelho@saude.exemplo.gov.br", entrada: "2025-06-23", papel: "analista", situacao: "Ativo" },
  { id: "u9", nome: "Rita de Cássia Ferreira", email: "rita.ferreira@saude.exemplo.gov.br", entrada: "2025-07-30", papel: "analista", situacao: "Ativo" },
  { id: "u10", nome: "Edvaldo Moura", email: "edvaldo.moura@balsas.exemplo.gov.br", entrada: "2025-09-12", papel: "solicitante", situacao: "Desativado" },
  { id: "u11", nome: "Terezinha Rocha", email: "terezinha.rocha@imperatriz.exemplo.gov.br", entrada: "2026-01-27", papel: "solicitante", situacao: "Ativo" },
  { id: "u12", nome: "Marcos Vinícius Teixeira", email: "marcos.teixeira@saude.exemplo.gov.br", entrada: "2026-03-09", papel: "analista", situacao: "Ativo" },
  { id: "u13", nome: "Sebastiana Barros", email: "sebastiana.barros@caxias.exemplo.gov.br", entrada: "2026-05-18", papel: "solicitante", situacao: "Ativo" },
  { id: "u14", nome: "Gilberto Viana", email: "gilberto.viana@saude.exemplo.gov.br", entrada: "2026-08-04", papel: "gestor", situacao: "Desativado" },
];

export type SituacaoConvite = "Pendente" | "Expirado";

export interface Convite {
  id: string;
  email: string;
  papel: string;
  /** ISO `AAAA-MM-DD`. */
  convidadoEm: string;
  situacao: SituacaoConvite;
}

export const CONVITES_INICIAIS: Convite[] = [
  { id: "c1", email: "joana.castro@pinheiro.exemplo.gov.br", papel: "solicitante", convidadoEm: "2026-10-19", situacao: "Pendente" },
  { id: "c2", email: "antonio.pinheiro@saude.exemplo.gov.br", papel: "regulador", convidadoEm: "2026-10-15", situacao: "Pendente" },
  { id: "c3", email: "maria.graca@codo.exemplo.gov.br", papel: "solicitante", convidadoEm: "2026-10-02", situacao: "Pendente" },
  { id: "c4", email: "lucas.sampaio@saude.exemplo.gov.br", papel: "analista", convidadoEm: "2026-09-10", situacao: "Expirado" },
];

export interface Permissao {
  id: string;
  rotulo: string;
  descricao: string;
  /** Revogar uma permissão crítica de um papel com usuários ativos exige confirmação. */
  critica?: boolean;
}

export interface ModuloPermissoes {
  id: string;
  nome: string;
  permissoes: Permissao[];
}

export const MODULOS: ModuloPermissoes[] = [
  {
    id: "solicitacoes",
    nome: "Solicitações",
    permissoes: [
      { id: "sol.ver", rotulo: "Visualizar solicitações", descricao: "Abre a listagem e o detalhe." },
      { id: "sol.criar", rotulo: "Criar solicitação", descricao: "Registra um novo pedido de TFD." },
      { id: "sol.editar", rotulo: "Editar solicitação", descricao: "Altera dados antes da aprovação." },
      { id: "sol.encaminhar", rotulo: "Encaminhar ao regulador", descricao: "Envia a solicitação para decisão." },
      { id: "sol.cancelar", rotulo: "Cancelar solicitação", descricao: "Remove o pedido da fila.", critica: true },
    ],
  },
  {
    id: "pacientes",
    nome: "Pacientes",
    permissoes: [
      { id: "pac.ver", rotulo: "Visualizar pacientes", descricao: "Consulta cadastro e histórico." },
      { id: "pac.cadastrar", rotulo: "Cadastrar paciente", descricao: "Inclui novos pacientes." },
      { id: "pac.exportar", rotulo: "Exportar dados de pacientes", descricao: "Gera arquivos com dados pessoais.", critica: true },
    ],
  },
  {
    id: "agenda",
    nome: "Agenda de viagens",
    permissoes: [
      { id: "age.ver", rotulo: "Visualizar agenda", descricao: "Consulta datas, veículos e unidades." },
      { id: "age.agendar", rotulo: "Agendar e reagendar", descricao: "Define ou altera a viagem." },
    ],
  },
  {
    id: "sistema",
    nome: "Sistema",
    permissoes: [
      { id: "sis.usuarios", rotulo: "Gerir usuários e papéis", descricao: "Convida, desativa e altera papéis.", critica: true },
      { id: "sis.tabelas", rotulo: "Gerir tabelas auxiliares", descricao: "Edita municípios, unidades e motivos." },
      { id: "sis.config", rotulo: "Alterar configurações do sistema", descricao: "Muda parâmetros globais.", critica: true },
    ],
  },
];

const TODAS = MODULOS.flatMap((m) => m.permissoes.map((p) => p.id));

export const CONCESSOES_INICIAIS: Record<string, string[]> = {
  solicitante: ["sol.ver", "sol.criar", "sol.editar", "pac.ver", "pac.cadastrar", "age.ver"],
  analista: ["sol.ver", "sol.editar", "sol.encaminhar", "pac.ver", "pac.cadastrar", "age.ver"],
  regulador: ["sol.ver", "sol.encaminhar", "sol.cancelar", "pac.ver", "age.ver", "age.agendar"],
  gestor: TODAS.filter((id) => id !== "sis.config" && id !== "sis.usuarios"),
  administrador: TODAS,
};

export function formatarDataBR(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

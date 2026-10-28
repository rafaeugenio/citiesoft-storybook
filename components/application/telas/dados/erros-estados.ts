import {
  RiErrorWarningLine,
  RiLockLine,
  RiSignpostLine,
  RiToolsLine,
} from "@remixicon/react";

export type VarianteErro = "404" | "403" | "500" | "manutencao";
export type VarianteErrosEstados = VarianteErro | "vazio" | "confirmacao";

export interface DefinicaoDeErro {
  codigo: string;
  /** Título da página, lido por leitores de tela. */
  titulo: string;
  explicacao: string;
  orientacao: string;
  icone: typeof RiLockLine;
  cta: string;
  /** Botão secundário de contato, só nas falhas do sistema. */
  suporte?: boolean;
}

/** Textos das páginas de erro, no padrão de `tela-erro.md`. */
export const ERROS: Record<VarianteErro, DefinicaoDeErro> = {
  "404": {
    codigo: "404",
    titulo: "Página não encontrada",
    explicacao: "Esta página não existe ou foi movida.",
    orientacao: "Conferir o endereço digitado ou voltar para a página inicial ajuda a retomar o trabalho.",
    icone: RiSignpostLine,
    cta: "Voltar para o início",
  },
  "403": {
    codigo: "403",
    titulo: "Acesso não permitido",
    explicacao: "O perfil atual não tem permissão para acessar esta página.",
    orientacao: "Se o acesso for necessário, o administrador do sistema pode liberar a permissão.",
    icone: RiLockLine,
    cta: "Voltar para o início",
  },
  "500": {
    codigo: "500",
    titulo: "Erro no sistema",
    explicacao: "Algo deu errado do nosso lado.",
    orientacao: "O problema já foi registrado. Tentar novamente em alguns instantes costuma resolver.",
    icone: RiErrorWarningLine,
    cta: "Tentar novamente",
    suporte: true,
  },
  manutencao: {
    codigo: "503",
    titulo: "Sistema em manutenção",
    explicacao: "O sistema está em manutenção para atualização de recursos.",
    orientacao: "O acesso volta a funcionar até as 6h de 22/10/2026.",
    icone: RiToolsLine,
    cta: "Verificar novamente",
  },
};

export interface SolicitacaoExclusao {
  id: string;
  protocolo: string;
  paciente: string;
  cpf: string;
  especialidade: string;
  situacao: string;
}

/** Solicitações fictícias da listagem que serve de pano de fundo à confirmação. */
export const SOLICITACOES_EXCLUSAO: SolicitacaoExclusao[] = [
  { id: "s1", protocolo: "TFD-2026-004812", paciente: "Maria Aparecida Lima", cpf: "123.***.***-45", especialidade: "Cardiologia", situacao: "Em análise" },
  { id: "s2", protocolo: "TFD-2026-004819", paciente: "José Raimundo Pereira", cpf: "384.***.***-07", especialidade: "Oncologia", situacao: "Aguardando documentos" },
  { id: "s3", protocolo: "TFD-2026-004826", paciente: "Francisca Almeida Souza", cpf: "507.***.***-31", especialidade: "Oftalmologia", situacao: "Agendada" },
  { id: "s4", protocolo: "TFD-2026-004833", paciente: "Antônio Carlos Ribeiro", cpf: "296.***.***-58", especialidade: "Ortopedia", situacao: "Aprovada" },
];

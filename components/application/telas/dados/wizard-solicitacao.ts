export interface ValoresSolicitacao {
  /* Paciente */
  nome: string;
  cpf: string;
  cns: string;
  nascimento: string;
  telefone: string;
  /* Atendimento */
  especialidade: string;
  unidade: string;
  destino: string;
  consulta: string;
  carater: "eletivo" | "urgencia";
  justificativa: string;
  /* Trajeto */
  origem: string;
  transporte: string;
  acompanhante: boolean;
  nomeAcompanhante: string;
  ida: string;
  volta: string;
  hospedagem: boolean;
}

export const SOLICITACAO_VAZIA: ValoresSolicitacao = {
  nome: "",
  cpf: "",
  cns: "",
  nascimento: "",
  telefone: "",
  especialidade: "",
  unidade: "",
  destino: "",
  consulta: "",
  carater: "eletivo",
  justificativa: "",
  origem: "",
  transporte: "",
  acompanhante: false,
  nomeAcompanhante: "",
  ida: "",
  volta: "",
  hospedagem: false,
};

/** Dados fictícios. O CPF e o cartão passam na validação de dígito verificador. */
export const SOLICITACAO_PREENCHIDA: ValoresSolicitacao = {
  nome: "Joana Pereira Alves",
  cpf: "111.444.777-35",
  cns: "170 1234 5678 0008",
  nascimento: "14/03/1968",
  telefone: "(99) 98877-6655",
  especialidade: "Cardiologia",
  unidade: "Hospital Regional de Imperatriz",
  destino: "Imperatriz",
  consulta: "18/11/2026",
  carater: "eletivo",
  justificativa: "Avaliação cardiológica de seguimento, sem oferta do serviço no município de origem.",
  origem: "Açailândia",
  transporte: "Ambulância",
  acompanhante: true,
  nomeAcompanhante: "Carlos Alves",
  ida: "17/11/2026",
  volta: "19/11/2026",
  hospedagem: false,
};

export interface TipoDocumento {
  id: string;
  rotulo: string;
  obrigatorio: boolean;
}

export const TIPOS_DOCUMENTO: TipoDocumento[] = [
  { id: "laudo", rotulo: "Laudo médico", obrigatorio: true },
  { id: "encaminhamento", rotulo: "Encaminhamento", obrigatorio: true },
  { id: "identificacao", rotulo: "Documento com foto", obrigatorio: true },
  { id: "residencia", rotulo: "Comprovante de residência", obrigatorio: false },
];

export interface DocumentoAnexado {
  tipoId: string;
  arquivo: string;
  tamanho: string;
}

export const DOCUMENTOS_EXEMPLO: DocumentoAnexado[] = [
  { tipoId: "laudo", arquivo: "laudo-cardiologia.pdf", tamanho: "412 KB" },
  { tipoId: "encaminhamento", arquivo: "encaminhamento-ubs.pdf", tamanho: "188 KB" },
  { tipoId: "identificacao", arquivo: "documento-frente-verso.jpg", tamanho: "1,2 MB" },
];

export const PROTOCOLO_EXEMPLO = "TFD-2026-004931";

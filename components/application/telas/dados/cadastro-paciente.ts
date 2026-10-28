export interface ValoresPaciente {
  nome: string;
  nomeSocial: string;
  cpf: string;
  cns: string;
  nascimento: string;
  sexo: string;
  mae: string;
  telefone: string;
  email: string;
  cep: string;
  logradouro: string;
  numero: string;
  bairro: string;
  municipio: string;
  observacoes: string;
  acompanhante: boolean;
  mobilidade: boolean;
}

export const PACIENTE_VAZIO: ValoresPaciente = {
  nome: "",
  nomeSocial: "",
  cpf: "",
  cns: "",
  nascimento: "",
  sexo: "",
  mae: "",
  telefone: "",
  email: "",
  cep: "",
  logradouro: "",
  numero: "",
  bairro: "",
  municipio: "",
  observacoes: "",
  acompanhante: false,
  mobilidade: false,
};

/** Dados fictícios. O CPF e o cartão passam na validação de dígito verificador. */
export const PACIENTE_PREENCHIDO: ValoresPaciente = {
  nome: "Joana Pereira Alves",
  nomeSocial: "",
  cpf: "111.444.777-35",
  cns: "170 1234 5678 0008",
  nascimento: "14/03/1968",
  sexo: "Feminino",
  mae: "Antônia Pereira Alves",
  telefone: "(99) 98877-6655",
  email: "joana.alves@exemplo.com.br",
  cep: "65930-000",
  logradouro: "Rua das Palmeiras",
  numero: "120",
  bairro: "Centro",
  municipio: "Açailândia",
  observacoes: "Paciente em acompanhamento cardiológico, sem oferta do serviço no município.",
  acompanhante: true,
  mobilidade: false,
};

export const OPCOES_SEXO = ["Feminino", "Masculino", "Intersexo", "Não informado"] as const;

export const AUDITORIA_EXEMPLO = { criadoPor: "Mariana Souza", criadoEm: "21/10/2026 às 10:42" } as const;

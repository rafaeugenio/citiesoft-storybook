/**
 * Tabelas auxiliares do TFD. Cada tabela declara os próprios campos: trocar de
 * tabela troca as colunas da listagem e os campos do formulário de edição.
 */

export type TipoCampo = "texto" | "texto-longo" | "selecao";

export interface CampoAuxiliar {
  id: string;
  rotulo: string;
  tipo: TipoCampo;
  obrigatorio?: boolean;
  opcoes?: string[];
  /** Exibe o campo como coluna da listagem. Nome e código sempre aparecem. */
  naTabela?: boolean;
  placeholder?: string;
  /** Classes de largura da coluna. */
  largura?: string;
}

export interface RegistroAuxiliar {
  id: string;
  ativo: boolean;
  /** Valores por `CampoAuxiliar.id`. */
  valores: Record<string, string>;
}

export interface TabelaAuxiliar {
  id: string;
  titulo: string;
  singular: string;
  plural: string;
  resumo: string;
  campos: CampoAuxiliar[];
  registros: RegistroAuxiliar[];
}

const nome = (placeholder: string): CampoAuxiliar => ({
  id: "nome",
  rotulo: "Nome",
  tipo: "texto",
  obrigatorio: true,
  naTabela: true,
  placeholder,
  largura: "w-[240px]",
});

const codigo = (rotulo: string, placeholder: string): CampoAuxiliar => ({
  id: "codigo",
  rotulo,
  tipo: "texto",
  obrigatorio: true,
  naTabela: true,
  placeholder,
  largura: "w-[130px]",
});

const descricao = (placeholder: string): CampoAuxiliar => ({
  id: "descricao",
  rotulo: "Descrição",
  tipo: "texto-longo",
  naTabela: true,
  placeholder,
});

function registros(
  prefixo: string,
  linhas: { ativo?: boolean; valores: Record<string, string> }[],
): RegistroAuxiliar[] {
  return linhas.map((linha, i) => ({
    id: `${prefixo}-${i + 1}`,
    ativo: linha.ativo ?? true,
    valores: linha.valores,
  }));
}

export const TABELAS_AUXILIARES: TabelaAuxiliar[] = [
  {
    id: "municipios",
    titulo: "Municípios",
    singular: "município",
    plural: "municípios",
    resumo: "Municípios de origem e de destino usados nas solicitações.",
    campos: [
      nome("Nome do município"),
      codigo("Código IBGE", "0000000"),
      { id: "uf", rotulo: "UF", tipo: "selecao", obrigatorio: true, naTabela: true, opcoes: ["MA", "PI", "CE", "PA"], largura: "w-[80px]" },
      descricao("Observação sobre o município"),
    ],
    registros: registros("mun", [
      { valores: { nome: "Barra do Corda", codigo: "2101608", uf: "MA", descricao: "Polo regional do centro maranhense." } },
      { valores: { nome: "Codó", codigo: "2103307", uf: "MA", descricao: "Origem frequente de pacientes de oncologia." } },
      { valores: { nome: "Pinheiro", codigo: "2108603", uf: "MA", descricao: "Baixada maranhense." } },
      { valores: { nome: "Balsas", codigo: "2101400", uf: "MA", descricao: "Sul do estado." } },
      { valores: { nome: "Imperatriz", codigo: "2105302", uf: "MA", descricao: "Polo de saúde do oeste maranhense." } },
      { valores: { nome: "Caxias", codigo: "2102002", uf: "MA", descricao: "Leste maranhense, divisa com o Piauí." } },
      { valores: { nome: "São Luís", codigo: "2111300", uf: "MA", descricao: "Capital e principal destino de TFD." } },
      { valores: { nome: "Teresina", codigo: "2211001", uf: "PI", descricao: "Destino interestadual." } },
      { ativo: false, valores: { nome: "Fortaleza", codigo: "2304400", uf: "CE", descricao: "Destino interestadual, uso restrito a casos aéreos." } },
    ]),
  },
  {
    id: "unidades",
    titulo: "Unidades de saúde",
    singular: "unidade de saúde",
    plural: "unidades de saúde",
    resumo: "Unidades que recebem os pacientes encaminhados.",
    campos: [
      nome("Nome da unidade"),
      codigo("CNES", "0000000"),
      { id: "municipio", rotulo: "Município", tipo: "selecao", obrigatorio: true, naTabela: true, opcoes: ["São Luís", "Teresina", "Fortaleza", "Imperatriz"], largura: "w-[140px]" },
      descricao("Serviços e observações da unidade"),
    ],
    registros: registros("uni", [
      { valores: { nome: "Hospital Universitário Presidente Dutra", codigo: "2726394", municipio: "São Luís", descricao: "Referência em cardiologia e neurologia." } },
      { valores: { nome: "Hospital Aldenora Bello", codigo: "2457970", municipio: "São Luís", descricao: "Referência em oncologia." } },
      { valores: { nome: "Hospital Getúlio Vargas", codigo: "2323869", municipio: "Teresina", descricao: "Atendimento de alta complexidade." } },
      { valores: { nome: "Hospital Geral de Fortaleza", codigo: "2561492", municipio: "Fortaleza", descricao: "Cirurgias e oftalmologia." } },
      { ativo: false, valores: { nome: "Clínica Santa Luzia", codigo: "6012345", municipio: "Imperatriz", descricao: "Convênio encerrado em setembro de 2026." } },
    ]),
  },
  {
    id: "especialidades",
    titulo: "Especialidades",
    singular: "especialidade",
    plural: "especialidades",
    resumo: "Especialidades médicas que podem ser solicitadas.",
    campos: [
      nome("Nome da especialidade"),
      codigo("Código CBO", "000000"),
      descricao("O que a especialidade cobre"),
    ],
    registros: registros("esp", [
      { valores: { nome: "Cardiologia", codigo: "225120", descricao: "Doenças do coração e do sistema circulatório." } },
      { valores: { nome: "Oncologia", codigo: "225121", descricao: "Diagnóstico e tratamento de neoplasias." } },
      { valores: { nome: "Oftalmologia", codigo: "225265", descricao: "Doenças dos olhos e da visão." } },
      { valores: { nome: "Ortopedia", codigo: "225270", descricao: "Sistema musculoesquelético." } },
      { valores: { nome: "Neurologia", codigo: "225112", descricao: "Sistema nervoso central e periférico." } },
      { ativo: false, valores: { nome: "Hematologia", codigo: "225135", descricao: "Aguardando contrato com a unidade de destino." } },
    ]),
  },
  {
    id: "transportes",
    titulo: "Tipos de transporte",
    singular: "tipo de transporte",
    plural: "tipos de transporte",
    resumo: "Modalidades de deslocamento custeadas ou autorizadas.",
    campos: [
      nome("Nome do transporte"),
      codigo("Código", "TRP-00"),
      { id: "acompanhante", rotulo: "Acompanhante", tipo: "selecao", naTabela: true, opcoes: ["Permitido", "Obrigatório", "Não permitido"], largura: "w-[150px]" },
      descricao("Regras de uso"),
    ],
    registros: registros("trp", [
      { valores: { nome: "Terrestre", codigo: "TRP-01", acompanhante: "Permitido", descricao: "Ônibus ou veículo da secretaria de saúde." } },
      { valores: { nome: "Aéreo", codigo: "TRP-02", acompanhante: "Permitido", descricao: "Autorizado com laudo e parecer do regulador." } },
      { valores: { nome: "Meio próprio", codigo: "TRP-03", acompanhante: "Permitido", descricao: "Paciente se desloca por conta própria, com ajuda de custo." } },
      { valores: { nome: "Ambulância", codigo: "TRP-04", acompanhante: "Obrigatório", descricao: "Pacientes acamados ou em tratamento intensivo." } },
    ]),
  },
  {
    id: "negativas",
    titulo: "Motivos de negativa",
    singular: "motivo de negativa",
    plural: "motivos de negativa",
    resumo: "Justificativas padronizadas para solicitações negadas.",
    campos: [
      nome("Resumo do motivo"),
      codigo("Código", "NEG-00"),
      descricao("Texto exibido ao solicitante"),
    ],
    registros: registros("neg", [
      { valores: { nome: "Serviço disponível no município", codigo: "NEG-01", descricao: "O atendimento solicitado é ofertado no município de origem." } },
      { valores: { nome: "Documentação incompleta", codigo: "NEG-02", descricao: "Documentos obrigatórios não entregues no prazo." } },
      { valores: { nome: "Sem indicação clínica", codigo: "NEG-03", descricao: "O laudo não justifica o deslocamento." } },
      { valores: { nome: "Duplicidade", codigo: "NEG-04", descricao: "Já existe solicitação aberta para o mesmo atendimento." } },
    ]),
  },
  {
    id: "documentos",
    titulo: "Tipos de documento",
    singular: "tipo de documento",
    plural: "tipos de documento",
    resumo: "Documentos exigidos ou aceitos na solicitação.",
    campos: [
      nome("Nome do documento"),
      codigo("Código", "DOC-00"),
      { id: "exigencia", rotulo: "Exigência", tipo: "selecao", obrigatorio: true, naTabela: true, opcoes: ["Obrigatório", "Opcional"], largura: "w-[130px]" },
      descricao("Orientação de envio"),
    ],
    registros: registros("doc", [
      { valores: { nome: "Encaminhamento médico", codigo: "DOC-01", exigencia: "Obrigatório", descricao: "Emitido por médico da rede pública, com CID." } },
      { valores: { nome: "Laudo do especialista", codigo: "DOC-02", exigencia: "Obrigatório", descricao: "Emitido nos últimos 90 dias." } },
      { valores: { nome: "Documento de identificação", codigo: "DOC-03", exigencia: "Obrigatório", descricao: "RG ou CNH, frente e verso." } },
      { valores: { nome: "Comprovante de residência", codigo: "DOC-04", exigencia: "Obrigatório", descricao: "Conta de consumo dos últimos 3 meses." } },
      { valores: { nome: "Exames anteriores", codigo: "DOC-05", exigencia: "Opcional", descricao: "Apoio à análise do regulador." } },
    ]),
  },
];

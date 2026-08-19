/**
 * Dados fictícios da solicitação de TFD (Tratamento Fora do Domicílio), usados
 * pela página `Páginas/Processos/Nova solicitação de TFD`.
 *
 * Tudo determinístico: nenhuma data ou identificador é gerado em tempo de
 * execução, senão o snapshot visual muda a cada rodada.
 */

export interface OpcaoDeLista {
  value: string;
  label: string;
}

/** Data de referência do fluxo: 15/03/2026. Fixa para o calendário não variar. */
export const HOJE = new Date(2026, 2, 15);

export const SECRETARIAS: OpcaoDeLista[] = [
  { value: 'ses', label: 'Secretaria de Estado da Saúde' },
  { value: 'sema', label: 'Secretaria de Meio Ambiente' },
  { value: 'seduc', label: 'Secretaria de Educação' },
];

export const MUNICIPIOS_DE_ORIGEM: OpcaoDeLista[] = [
  { value: 'imperatriz', label: 'Imperatriz (MA)' },
  { value: 'caxias', label: 'Caxias (MA)' },
  { value: 'balsas', label: 'Balsas (MA)' },
];

export const MUNICIPIOS_DE_DESTINO: OpcaoDeLista[] = [
  { value: 'sao-luis', label: 'São Luís (MA)' },
  { value: 'teresina', label: 'Teresina (PI)' },
  { value: 'fortaleza', label: 'Fortaleza (CE)' },
  { value: 'sao-paulo', label: 'São Paulo (SP)' },
];

export const ESPECIALIDADES: OpcaoDeLista[] = [
  { value: 'cardiologia', label: 'Cardiologia' },
  { value: 'oncologia', label: 'Oncologia' },
  { value: 'neurologia', label: 'Neurologia' },
  { value: 'oftalmologia', label: 'Oftalmologia' },
];

export const TIPOS_DE_TRANSPORTE: OpcaoDeLista[] = [
  { value: 'terrestre', label: 'Terrestre (van da Secretaria)' },
  { value: 'aereo', label: 'Aéreo' },
  { value: 'proprio', label: 'Meio próprio com ressarcimento' },
];

export const TIPOS_DE_ACOMPANHAMENTO: OpcaoDeLista[] = [
  { value: 'sem', label: 'Sem acompanhante' },
  { value: 'com', label: 'Com acompanhante indicado no laudo' },
];

export interface DadosDaSolicitacao {
  /* Etapa 1 · Identificação */
  paciente: string;
  cpf: string;
  cartaoSus: string;
  municipioOrigem: string;
  secretaria: string;
  /* Etapa 2 · Deslocamento */
  municipioDestino: string;
  unidade: string;
  especialidade: string;
  transporte: string;
  dataDaViagem?: Date;
  /* Etapa 3 · Documentos */
  numeroDoLaudo: string;
  medicoSolicitante: string;
  crm: string;
  acompanhamento: string;
  dataDoLaudo?: Date;
}

export const SOLICITACAO_VAZIA: DadosDaSolicitacao = {
  paciente: '',
  cpf: '',
  cartaoSus: '',
  municipioOrigem: '',
  secretaria: '',
  municipioDestino: '',
  unidade: '',
  especialidade: '',
  transporte: '',
  dataDaViagem: undefined,
  numeroDoLaudo: '',
  medicoSolicitante: '',
  crm: '',
  acompanhamento: '',
  dataDoLaudo: undefined,
};

/** Primeira etapa já concluída, segunda etapa em preenchimento. */
export const IDENTIFICACAO_PREENCHIDA: DadosDaSolicitacao = {
  ...SOLICITACAO_VAZIA,
  paciente: 'Maria de Fátima Souza',
  cpf: '045.812.330-91',
  cartaoSus: '708 4048 1220 3317',
  municipioOrigem: 'imperatriz',
  secretaria: 'ses',
  municipioDestino: 'sao-luis',
  unidade: 'Hospital Universitário Presidente Dutra',
};

/** Todas as etapas preenchidas, pronta para o resumo final. */
export const SOLICITACAO_COMPLETA: DadosDaSolicitacao = {
  ...IDENTIFICACAO_PREENCHIDA,
  especialidade: 'cardiologia',
  transporte: 'terrestre',
  dataDaViagem: new Date(2026, 3, 8),
  numeroDoLaudo: '2025/0481',
  medicoSolicitante: 'Dr. Carlos Andrade',
  crm: 'CRM-MA 18442',
  acompanhamento: 'com',
  dataDoLaudo: new Date(2026, 2, 2),
};

/**
 * Conteúdo longo: nome extenso e unidade de saúde com nome completo, para
 * verificar quebra de linha no resumo e nos campos.
 */
export const SOLICITACAO_COM_TEXTO_LONGO: DadosDaSolicitacao = {
  ...SOLICITACAO_COMPLETA,
  paciente: 'Maria de Fátima Souza do Nascimento Albuquerque Rodrigues',
  unidade:
    'Hospital Universitário da Universidade Federal do Maranhão · Unidade Presidente Dutra · Ambulatório de Cardiologia Intervencionista',
};

export interface DefinicaoDeEtapa {
  id: string;
  rotulo: string;
  sublabel: string;
}

export const ETAPAS_DA_SOLICITACAO: DefinicaoDeEtapa[] = [
  { id: 'identificacao', rotulo: 'Identificação', sublabel: 'Paciente e origem' },
  { id: 'deslocamento', rotulo: 'Deslocamento', sublabel: 'Destino e transporte' },
  { id: 'documentos', rotulo: 'Documentos', sublabel: 'Laudo e acompanhante' },
  { id: 'revisao', rotulo: 'Revisão', sublabel: 'Conferência final' },
];

/** Traduz o valor guardado para o rótulo exibido no resumo. */
export function rotuloDaOpcao(opcoes: OpcaoDeLista[], valor: string) {
  return opcoes.find((opcao) => opcao.value === valor)?.label ?? 'Não informado';
}

export function formatarDataCurta(data?: Date) {
  if (!data) return 'Não informada';
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

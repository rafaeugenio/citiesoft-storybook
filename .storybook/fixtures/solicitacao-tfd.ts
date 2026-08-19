/**
 * Abertura de processo de TFD, usada pela página
 * `Páginas/Processos/Novo processo de TFD`.
 *
 * As listas de referência (municípios, unidades, especialidades, secretarias,
 * transporte, acompanhamento) vêm todas de `dominio-tfd.ts`, então o wizard
 * oferece exatamente o vocabulário que a listagem filtra e o painel mede.
 *
 * Tudo determinístico: nenhuma data ou identificador é gerado em tempo de
 * execução, senão o snapshot visual muda a cada rodada.
 */

import {
  ESPECIALIDADES,
  HOJE,
  MUNICIPIOS_DE_DESTINO,
  MUNICIPIOS_DE_ORIGEM,
  PROCESSO_EM_DESTAQUE,
  SECRETARIAS_DE_SAUDE,
  TIPOS_DE_ACOMPANHAMENTO,
  TIPOS_DE_TRANSPORTE,
  UNIDADES_DE_DESTINO,
  formatarCartaoSus,
  formatarCPF,
  formatarDataCurta,
  mascararCPF,
  rotuloDoMunicipio,
} from './dominio-tfd';

export { HOJE, TIPOS_DE_ACOMPANHAMENTO, TIPOS_DE_TRANSPORTE, formatarDataCurta, mascararCPF };

export interface OpcaoDeLista {
  value: string;
  label: string;
}

/** Encaminhamento de TFD sai da saúde: nenhuma outra pasta aparece aqui. */
export const SECRETARIAS: OpcaoDeLista[] = SECRETARIAS_DE_SAUDE.map((secretaria) => ({
  value: secretaria.id,
  label: secretaria.nome,
}));

export const MUNICIPIOS_ORIGEM: OpcaoDeLista[] = MUNICIPIOS_DE_ORIGEM.map((municipio) => ({
  value: municipio.id,
  label: rotuloDoMunicipio(municipio.id),
}));

export const MUNICIPIOS_DESTINO: OpcaoDeLista[] = MUNICIPIOS_DE_DESTINO.map((municipio) => ({
  value: municipio.id,
  label: rotuloDoMunicipio(municipio.id),
}));

export const ESPECIALIDADES_DO_ATENDIMENTO: OpcaoDeLista[] = ESPECIALIDADES.map(
  (especialidade) => ({ value: especialidade.id, label: especialidade.nome }),
);

/** Unidades habilitadas a receber o paciente, na ordem do município. */
export const UNIDADES_DESTINO: OpcaoDeLista[] = UNIDADES_DE_DESTINO.map((unidade) => ({
  value: unidade.id,
  label: unidade.nome,
}));

export interface DadosDoProcesso {
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

export const PROCESSO_VAZIO: DadosDoProcesso = {
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

/**
 * Primeira etapa concluída, segunda em preenchimento. A paciente é a mesma do
 * processo 2026/0481, com o mesmo CPF e o mesmo cartão do SUS do registro:
 * é a segunda viagem dela, aberta pela unidade de origem.
 */
export const IDENTIFICACAO_PREENCHIDA: DadosDoProcesso = {
  ...PROCESSO_VAZIO,
  paciente: PROCESSO_EM_DESTAQUE.paciente,
  cpf: formatarCPF(PROCESSO_EM_DESTAQUE.cpf),
  cartaoSus: formatarCartaoSus(PROCESSO_EM_DESTAQUE.cartaoSus),
  municipioOrigem: PROCESSO_EM_DESTAQUE.municipioOrigemId,
  secretaria: 'sms-imperatriz',
  municipioDestino: PROCESSO_EM_DESTAQUE.municipioDestinoId,
  unidade: PROCESSO_EM_DESTAQUE.unidadeDestinoId,
};

/** Todas as etapas preenchidas, pronta para o resumo final. */
export const PROCESSO_COMPLETO: DadosDoProcesso = {
  ...IDENTIFICACAO_PREENCHIDA,
  especialidade: PROCESSO_EM_DESTAQUE.especialidadeId,
  transporte: 'terrestre',
  dataDaViagem: new Date(2026, 7, 12),
  numeroDoLaudo: 'LM 2026/13148',
  medicoSolicitante: 'Dr. Carlos Andrade Belfort',
  crm: 'CRM-MA 18442',
  acompanhamento: 'com',
  dataDoLaudo: new Date(2026, 6, 10),
};

/**
 * Conteúdo longo: nome extenso e unidade de saúde com nome completo, para
 * verificar quebra de linha no resumo e nos campos.
 */
export const PROCESSO_COM_TEXTO_LONGO: DadosDoProcesso = {
  ...PROCESSO_COMPLETO,
  paciente: 'Maria de Fátima Souza do Nascimento Albuquerque Rodrigues',
  medicoSolicitante: 'Dr. Carlos Andrade Belfort de Vasconcelos Sobrinho',
};

export interface DefinicaoDeEtapa {
  id: string;
  rotulo: string;
  sublabel: string;
}

export const ETAPAS_DO_PROCESSO: DefinicaoDeEtapa[] = [
  { id: 'identificacao', rotulo: 'Identificação', sublabel: 'Paciente e origem' },
  { id: 'deslocamento', rotulo: 'Deslocamento', sublabel: 'Destino e transporte' },
  { id: 'documentos', rotulo: 'Documentos', sublabel: 'Laudo e acompanhante' },
  { id: 'revisao', rotulo: 'Revisão', sublabel: 'Conferência final' },
];

/** Protocolo atribuído quando a unidade envia o processo à regulação. */
export const PROTOCOLO_GERADO = '2026/0505';

/** Traduz o valor guardado para o rótulo exibido no resumo. */
export function rotuloDaOpcao(opcoes: OpcaoDeLista[], valor: string) {
  return opcoes.find((opcao) => opcao.value === valor)?.label ?? 'Não informado';
}

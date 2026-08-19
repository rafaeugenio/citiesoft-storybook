/**
 * Detalhe do processo de TFD 2026/0481.
 *
 * Todos os campos abaixo são projeções do registro único de `dominio-tfd.ts`.
 * Nada é redigitado, então o destino, a unidade de origem, o valor das diárias
 * e a data da viagem que o detalhe mostra são exatamente os que a listagem
 * mostra na linha do mesmo protocolo.
 */

import type { EstadoDoEvento } from '../../src';
import {
  AJUDA_POR_DIARIA,
  CRM_DO_MEDICO,
  PROCESSO_EM_DESTAQUE,
  VALOR_DA_DIARIA,
  atorDoEvento,
  especialidade,
  formatarData,
  formatarMoeda,
  mascararCPF,
  mascararCartaoSus,
  mascararTelefone,
  medico,
  rotuloDaCompetencia,
  rotuloDaUnidade,
  rotuloDoMunicipio,
  trechoDoProcesso,
  type SituacaoDoProcesso,
  unidade,
  valorDaAjudaDeCusto,
  valorDasDiarias,
} from './dominio-tfd';

export interface CampoDoProcesso {
  rotulo: string;
  valor: string;
  /** Campo imutável depois da criação, exibido somente leitura (padrão CRUD). */
  somenteLeitura?: boolean;
}

export interface MudancaRegistrada {
  /** Nome de UI do campo, nunca a chave interna. */
  campo: string;
  /** Valor em texto humano ("R$ 1.240,50", "Aprovado"), nunca o ID interno. */
  de: string | null;
  para: string | null;
}

export interface EventoDoProcesso {
  id: string;
  titulo: string;
  /** ISO 8601 fixo. */
  data: string;
  ator: string;
  estado: EstadoDoEvento;
  realce?: 'critico' | 'sistema';
  resumo?: string;
  mudancas?: MudancaRegistrada[];
}

export interface ComentarioDoProcesso {
  id: string;
  autor: string;
  papel: string;
  data: string;
  texto: string;
}

export interface RelacionadoDoProcesso {
  id: string;
  titulo: string;
  descricao: string;
  estado: SituacaoDoProcesso;
}

const REGISTRO = PROCESSO_EM_DESTAQUE;
const MEDICO = medico(REGISTRO.medicoId);

export const PROCESSO = {
  numero: REGISTRO.protocolo,
  paciente: REGISTRO.paciente,
  estado: REGISTRO.situacao,
  tipo: 'Tratamento Fora do Domicílio',
  trecho: trechoDoProcesso(REGISTRO),
  atualizadoEm: `${formatarData(REGISTRO.atualizadoEm.slice(0, 10))} às ${REGISTRO.atualizadoEm.slice(11, 16)}`,
  competencia: rotuloDaCompetencia(REGISTRO.competencia),
};

/** Nome longo de verdade, para a story de conteúdo extenso. */
export const PACIENTE_NOME_LONGO =
  'Maria de Fátima Souza dos Santos Albuquerque Nascimento Filha';

export const DADOS_DO_PACIENTE: CampoDoProcesso[] = [
  { rotulo: 'Paciente', valor: REGISTRO.paciente },
  { rotulo: 'CPF', valor: mascararCPF(REGISTRO.cpf), somenteLeitura: true },
  { rotulo: 'Cartão SUS', valor: mascararCartaoSus(REGISTRO.cartaoSus), somenteLeitura: true },
  { rotulo: 'Data de nascimento', valor: REGISTRO.nascimento },
  { rotulo: 'Município de origem', valor: rotuloDoMunicipio(REGISTRO.municipioOrigemId) },
  { rotulo: 'Telefone de contato', valor: mascararTelefone(REGISTRO.telefone) },
];

export const DADOS_DO_DESLOCAMENTO: CampoDoProcesso[] = [
  { rotulo: 'Número do processo', valor: REGISTRO.protocolo, somenteLeitura: true },
  { rotulo: 'Especialidade', valor: especialidade(REGISTRO.especialidadeId).nome },
  { rotulo: 'Unidade de origem', valor: rotuloDaUnidade(REGISTRO.unidadeOrigemId) },
  { rotulo: 'Unidade de destino', valor: rotuloDaUnidade(REGISTRO.unidadeDestinoId) },
  { rotulo: 'Médico solicitante', valor: `${MEDICO.nome} · ${CRM_DO_MEDICO[REGISTRO.medicoId]}` },
  { rotulo: 'Laudo médico', valor: REGISTRO.numeroDoLaudo, somenteLeitura: true },
  { rotulo: 'Data prevista de saída', valor: formatarData(REGISTRO.dataViagem) },
  {
    rotulo: 'Acompanhante',
    valor: REGISTRO.acompanhante ? `Sim, ${REGISTRO.acompanhante}` : 'Não',
  },
];

export const DADOS_FINANCEIROS: CampoDoProcesso[] = [
  { rotulo: 'Diárias solicitadas', valor: `${REGISTRO.diarias} diárias` },
  { rotulo: 'Valor da diária', valor: formatarMoeda(VALOR_DA_DIARIA), somenteLeitura: true },
  { rotulo: 'Valor total de diárias', valor: formatarMoeda(valorDasDiarias(REGISTRO)) },
  { rotulo: 'Ajuda de custo do acompanhante', valor: formatarMoeda(valorDaAjudaDeCusto(REGISTRO)) },
  { rotulo: 'Fonte de recurso', valor: 'Fundo Estadual de Saúde' },
  { rotulo: 'Competência', valor: rotuloDaCompetencia(REGISTRO.competencia) },
];

/** Quantidade anterior à correção registrada na trilha de auditoria. */
const DIARIAS_ANTERIORES = REGISTRO.diarias - 1;

export const HISTORICO_DO_PROCESSO: EventoDoProcesso[] = [
  {
    id: 'ev-6',
    titulo: 'Valor de diárias corrigido',
    data: REGISTRO.atualizadoEm,
    ator: atorDoEvento('srv-coord'),
    estado: 'atual',
    resumo: 'Correção após conferência da tabela de diárias vigente.',
    mudancas: [
      {
        campo: 'Diárias solicitadas',
        de: `${DIARIAS_ANTERIORES} diárias`,
        para: `${REGISTRO.diarias} diárias`,
      },
      {
        campo: 'Valor total de diárias',
        de: formatarMoeda(Number((DIARIAS_ANTERIORES * VALOR_DA_DIARIA).toFixed(2))),
        para: formatarMoeda(valorDasDiarias(REGISTRO)),
      },
      {
        campo: 'Ajuda de custo do acompanhante',
        de: formatarMoeda(Number((DIARIAS_ANTERIORES * AJUDA_POR_DIARIA).toFixed(2))),
        para: formatarMoeda(valorDaAjudaDeCusto(REGISTRO)),
      },
    ],
  },
  {
    id: 'ev-5',
    titulo: 'Parecer médico emitido',
    data: '2026-07-10T09:48:00',
    ator: `${MEDICO.nome} · ${CRM_DO_MEDICO[REGISTRO.medicoId]}`,
    estado: 'concluido',
    resumo: 'Parecer favorável ao deslocamento, com indicação de acompanhante.',
    mudancas: [{ campo: 'Acompanhante', de: 'Não', para: 'Sim' }],
  },
  {
    id: 'ev-4',
    titulo: 'Processo encaminhado à regulação',
    data: '2026-07-09T11:05:00',
    ator: 'Sistema Citiesoft',
    estado: 'concluido',
    realce: 'sistema',
    mudancas: [{ campo: 'Situação', de: 'Enviado', para: 'Em Análise' }],
  },
  {
    id: 'ev-3',
    titulo: 'Documentação anexada',
    data: '2026-07-08T16:45:00',
    ator: atorDoEvento('srv-unidade'),
    estado: 'concluido',
    resumo: 'Laudo médico, comprovante de residência e cartão SUS da paciente.',
  },
  {
    id: 'ev-2',
    titulo: 'Processo enviado para análise',
    data: '2026-07-07T08:22:00',
    ator: atorDoEvento('srv-unidade'),
    estado: 'concluido',
    mudancas: [{ campo: 'Situação', de: 'Rascunho', para: 'Enviado' }],
  },
  {
    id: 'ev-1',
    titulo: 'Processo aberto pela unidade de origem',
    data: '2026-07-06T08:05:00',
    ator: atorDoEvento('srv-unidade'),
    estado: 'concluido',
    resumo: 'Abertura a partir do atendimento presencial da paciente na unidade.',
    mudancas: [
      { campo: 'Município de origem', de: null, para: rotuloDoMunicipio(REGISTRO.municipioOrigemId) },
      { campo: 'Especialidade', de: null, para: especialidade(REGISTRO.especialidadeId).nome },
    ],
  },
];

/** Histórico extenso: meses de tramitação, para a story de conteúdo longo. */
export const HISTORICO_EXTENSO: EventoDoProcesso[] = [
  ...HISTORICO_DO_PROCESSO,
  ...Array.from({ length: 18 }, (_, indice) => {
    const dia = String(28 - indice).padStart(2, '0');
    return {
      id: `ev-antigo-${indice}`,
      titulo:
        indice % 3 === 0
          ? 'Situação do processo atualizada'
          : indice % 3 === 1
            ? 'Anexo revisado pela regulação'
            : 'Notificação enviada à paciente',
      data: `2026-06-${dia}T10:${String(10 + indice).padStart(2, '0')}:00`,
      ator: indice % 2 === 0 ? 'Sistema Citiesoft' : atorDoEvento('srv-regulacao'),
      estado: 'concluido' as EstadoDoEvento,
      realce: indice % 2 === 0 ? ('sistema' as const) : undefined,
      mudancas:
        indice % 3 === 0
          ? [{ campo: 'Situação', de: 'Enviado', para: 'Em Análise' }]
          : undefined,
    };
  }),
];

export const HISTORICO_CANCELADO: EventoDoProcesso[] = [
  {
    id: 'ev-cancel',
    titulo: 'Processo cancelado a pedido da paciente',
    data: '2026-07-15T10:12:00',
    ator: atorDoEvento('srv-coord'),
    estado: 'cancelado',
    realce: 'critico',
    resumo: 'A paciente informou que o procedimento foi realizado na rede estadual.',
    mudancas: [{ campo: 'Situação', de: 'Em Análise', para: 'Cancelado' }],
  },
  ...HISTORICO_DO_PROCESSO.slice(1),
];

/** Trilha depois do arquivamento: o histórico permanece inteiro. */
export const HISTORICO_ARQUIVADO: EventoDoProcesso[] = [
  {
    id: 'ev-arquivo',
    titulo: 'Processo arquivado',
    data: '2026-07-15T11:40:00',
    ator: atorDoEvento('srv-coord'),
    estado: 'informacional',
    resumo: 'Arquivamento com preservação integral dos anexos, do histórico e dos lançamentos.',
    mudancas: [{ campo: 'Situação', de: 'Cancelado', para: 'Cancelado' }],
  },
  ...HISTORICO_CANCELADO,
];

export const COMENTARIOS: ComentarioDoProcesso[] = [
  {
    id: 'c-2',
    autor: 'Laryssa Mendes Aguiar',
    papel: 'Coordenação de TFD',
    data: '14/07/2026 às 14:40',
    texto:
      'Valor ajustado conforme a tabela vigente. Regulação, favor confirmar a reserva de passagem antes de aprovar.',
  },
  {
    id: 'c-1',
    autor: MEDICO.nome,
    papel: MEDICO.vinculo ?? 'Corpo clínico',
    data: '10/07/2026 às 09:55',
    texto:
      'Paciente com indicação de acompanhante em razão da limitação de mobilidade descrita no laudo.',
  },
];

export const RELACIONADOS: RelacionadoDoProcesso[] = [
  {
    id: 'r-3',
    titulo: 'Lançamento de diárias LD 2026/03318',
    descricao: `${REGISTRO.diarias} diárias · ${formatarMoeda(valorDasDiarias(REGISTRO))} · competência ${rotuloDaCompetencia(REGISTRO.competencia).toLowerCase()}`,
    estado: 'Aguardando Assinatura',
  },
  {
    id: 'r-2',
    titulo: 'Processo 2025/1123',
    descricao: `Deslocamento anterior da mesma paciente, ${especialidade(REGISTRO.especialidadeId).nome.toLowerCase()}`,
    estado: 'Aprovado',
  },
  {
    id: 'r-1',
    titulo: 'Ajuda de custo AC 2026/00882',
    descricao: `${formatarMoeda(valorDaAjudaDeCusto(REGISTRO))} · acompanhante ${REGISTRO.acompanhante ?? 'não indicado'}`,
    estado: 'Aprovado',
  },
];

/** Unidade de origem por extenso, usada na faixa de aviso do detalhe. */
export const UNIDADE_DE_ORIGEM = unidade(REGISTRO.unidadeOrigemId).nome;

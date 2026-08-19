import type { EstadoDeFluxo, EstadoDoEvento } from '../../src';

/**
 * Processo de TFD 2025/0481, dado fictício e determinístico (sem `Math.random`
 * nem `new Date()` sem argumento). Serve às páginas do template de detalhe.
 */

export interface CampoDoProcesso {
  rotulo: string;
  valor: string;
  /** Campo imutável depois da criação, exibido somente leitura (padrão CRUD). */
  somenteLeitura?: boolean;
}

export interface MudancaRegistrada {
  /** Nome de UI do campo, nunca a chave interna. */
  campo: string;
  /** Valor em texto humano ("R$ 3.200,00", "Aprovado"), nunca o ID interno. */
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
  estado: EstadoDeFluxo;
}

export const PROCESSO = {
  numero: '2025/0481',
  paciente: 'Maria de Fátima Souza',
  estado: 'Em Análise' as EstadoDeFluxo,
  tipo: 'Tratamento Fora do Domicílio',
  trecho: 'São Luís (MA) → São Paulo (SP)',
  atualizadoEm: '18/03/2025 às 14:32',
};

/** Nome longo de verdade, para a story de conteúdo extenso. */
export const PACIENTE_NOME_LONGO =
  'Maria de Fátima Souza dos Santos Albuquerque Nascimento Filha';

export const DADOS_DO_PACIENTE: CampoDoProcesso[] = [
  { rotulo: 'Paciente', valor: 'Maria de Fátima Souza' },
  { rotulo: 'CPF', valor: '***.456.789-**', somenteLeitura: true },
  { rotulo: 'Cartão SUS', valor: '706 0012 3456 7890' },
  { rotulo: 'Data de nascimento', valor: '12/09/1968' },
  { rotulo: 'Município de origem', valor: 'Barreirinhas (MA)' },
  { rotulo: 'Telefone de contato', valor: '(98) 98•••-••12' },
];

export const DADOS_DO_DESLOCAMENTO: CampoDoProcesso[] = [
  { rotulo: 'Número do processo', valor: '2025/0481', somenteLeitura: true },
  { rotulo: 'Especialidade', valor: 'Cardiologia intervencionista' },
  { rotulo: 'Unidade de destino', valor: 'Instituto do Coração, São Paulo (SP)' },
  { rotulo: 'Médico solicitante', valor: 'Dr. Carlos Andrade' },
  { rotulo: 'Data prevista de saída', valor: '02/04/2025' },
  { rotulo: 'Acompanhante', valor: 'Sim, José Ribeiro Souza (filho)' },
];

export const DADOS_FINANCEIROS: CampoDoProcesso[] = [
  { rotulo: 'Diárias solicitadas', valor: '8 diárias' },
  { rotulo: 'Valor total de diárias', valor: 'R$ 3.200,00' },
  { rotulo: 'Ajuda de custo', valor: 'R$ 480,00' },
  { rotulo: 'Fonte de recurso', valor: 'Fundo Estadual de Saúde' },
  { rotulo: 'Competência', valor: 'Abril de 2025' },
];

export const HISTORICO_DO_PROCESSO: EventoDoProcesso[] = [
  {
    id: 'ev-6',
    titulo: 'Valor de diárias corrigido',
    data: '2025-03-18T14:32:00',
    ator: 'Laryssa Mendes (Coordenação de TFD)',
    estado: 'atual',
    resumo: 'Correção após conferência da tabela de diárias vigente.',
    mudancas: [
      { campo: 'Valor total de diárias', de: 'R$ 2.800,00', para: 'R$ 3.200,00' },
      { campo: 'Diárias solicitadas', de: '7 diárias', para: '8 diárias' },
    ],
  },
  {
    id: 'ev-5',
    titulo: 'Parecer médico emitido',
    data: '2025-03-17T09:48:00',
    ator: 'Dr. Carlos Andrade',
    estado: 'concluido',
    resumo: 'Parecer favorável ao deslocamento, com indicação de acompanhante.',
    mudancas: [{ campo: 'Acompanhante', de: 'Não', para: 'Sim' }],
  },
  {
    id: 'ev-4',
    titulo: 'Processo encaminhado à regulação',
    data: '2025-03-15T11:05:00',
    ator: 'Sistema Citiesoft',
    estado: 'concluido',
    realce: 'sistema',
    mudancas: [{ campo: 'Situação', de: 'Enviado', para: 'Em Análise' }],
  },
  {
    id: 'ev-3',
    titulo: 'Documentação anexada',
    data: '2025-03-14T16:45:00',
    ator: 'Maria de Fátima Souza',
    estado: 'concluido',
    resumo: 'Laudo médico, comprovante de residência e cartão SUS.',
  },
  {
    id: 'ev-2',
    titulo: 'Solicitação enviada para análise',
    data: '2025-03-13T08:22:00',
    ator: 'Maria de Fátima Souza',
    estado: 'concluido',
    mudancas: [{ campo: 'Situação', de: 'Rascunho', para: 'Enviado' }],
  },
  {
    id: 'ev-1',
    titulo: 'Solicitação criada',
    data: '2025-03-12T08:05:00',
    ator: 'Maria de Fátima Souza',
    estado: 'concluido',
    mudancas: [
      { campo: 'Município de origem', de: null, para: 'Barreirinhas (MA)' },
      { campo: 'Especialidade', de: null, para: 'Cardiologia intervencionista' },
    ],
  },
];

/** Histórico extenso: um ano de tramitação, para a story de conteúdo longo. */
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
            : 'Notificação enviada ao paciente',
      data: `2025-02-${dia}T10:${String(10 + indice).padStart(2, '0')}:00`,
      ator: indice % 2 === 0 ? 'Sistema Citiesoft' : 'Laryssa Mendes (Coordenação de TFD)',
      estado: 'concluido' as EstadoDoEvento,
      realce: indice % 2 === 0 ? ('sistema' as const) : undefined,
      mudancas:
        indice % 3 === 0
          ? [{ campo: 'Situação', de: 'Pendente', para: 'Em Análise' }]
          : undefined,
    };
  }),
];

export const HISTORICO_CANCELADO: EventoDoProcesso[] = [
  {
    id: 'ev-cancel',
    titulo: 'Processo cancelado a pedido do paciente',
    data: '2025-03-20T10:12:00',
    ator: 'Laryssa Mendes (Coordenação de TFD)',
    estado: 'cancelado',
    realce: 'critico',
    resumo: 'Paciente informou que o procedimento foi realizado na rede estadual.',
    mudancas: [{ campo: 'Situação', de: 'Em Análise', para: 'Cancelado' }],
  },
  ...HISTORICO_DO_PROCESSO.slice(1),
];

export const COMENTARIOS: ComentarioDoProcesso[] = [
  {
    id: 'c-2',
    autor: 'Laryssa Mendes',
    papel: 'Coordenação de TFD',
    data: '18/03/2025 às 14:40',
    texto:
      'Valor ajustado conforme a tabela vigente. Regulação, favor confirmar a reserva de passagem antes de aprovar.',
  },
  {
    id: 'c-1',
    autor: 'Dr. Carlos Andrade',
    papel: 'Cardiologia, Hospital Universitário',
    data: '17/03/2025 às 09:55',
    texto:
      'Paciente com indicação de acompanhante em razão da limitação de mobilidade descrita no laudo.',
  },
];

export const RELACIONADOS: RelacionadoDoProcesso[] = [
  {
    id: 'r-3',
    titulo: 'Lançamento de diárias 2025/0481-1',
    descricao: '8 diárias · R$ 3.200,00 · competência abril de 2025',
    estado: 'Aguardando Assinatura',
  },
  {
    id: 'r-2',
    titulo: 'Processo 2024/1123',
    descricao: 'Deslocamento anterior da mesma paciente, cardiologia',
    estado: 'Homologado',
  },
  {
    id: 'r-1',
    titulo: 'Ajuda de custo 2025/0088',
    descricao: 'R$ 480,00 · acompanhante José Ribeiro Souza',
    estado: 'Aprovado',
  },
];

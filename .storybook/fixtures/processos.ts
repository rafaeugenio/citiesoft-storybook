/**
 * Dados fictícios de solicitações de TFD (Tratamento Fora do Domicílio),
 * usados pela página `Páginas/Processos/Consulta de processos`.
 *
 * Tudo aqui é determinístico: nenhuma chamada a `Math.random()` nem a
 * `new Date()` sem argumento, porque a página é comparada por snapshot visual.
 * Nenhum dado é real: nomes, CPFs e protocolos são fictícios.
 */

import type { EstadoDeFluxo } from '../../src';

export interface SolicitacaoTFD {
  /** Identificador do registro, no formato ano/sequencial. */
  protocolo: string;
  paciente: string;
  /** Só os 4 últimos dígitos aparecem na listagem, via `mascararCPF`. */
  cpf: string;
  /** Município de destino do tratamento. */
  destino: string;
  /** Unidade de saúde responsável pelo encaminhamento. */
  unidade: string;
  /** Soma das diárias solicitadas, em reais. */
  valorDiarias: number;
  /** Data da viagem no formato ISO, para ordenação estável. */
  dataViagem: string;
  situacao: EstadoDeFluxo;
}

export const SOLICITACOES: SolicitacaoTFD[] = [
  {
    protocolo: '2025/0481',
    paciente: 'Maria de Fátima Souza',
    cpf: '12345678901',
    destino: 'São Luís',
    unidade: 'Hospital Regional de Imperatriz',
    valorDiarias: 1240.5,
    dataViagem: '2025-03-12',
    situacao: 'Em Análise',
  },
  {
    protocolo: '2025/0482',
    paciente: 'João Batista Ferreira',
    cpf: '23456789012',
    destino: 'Teresina',
    unidade: 'Unidade Mista de Balsas',
    valorDiarias: 890,
    dataViagem: '2025-03-14',
    situacao: 'Aprovado',
  },
  {
    protocolo: '2025/0483',
    paciente: 'Antônia Ribeiro Lima',
    cpf: '34567890123',
    destino: 'Fortaleza',
    unidade: 'Hospital Municipal de Caxias',
    valorDiarias: 2130.75,
    dataViagem: '2025-03-18',
    situacao: 'Enviado',
  },
  {
    protocolo: '2025/0484',
    paciente: 'Raimundo Nonato da Silva',
    cpf: '45678901234',
    destino: 'São Luís',
    unidade: 'Policlínica de Codó',
    valorDiarias: 640,
    dataViagem: '2025-03-19',
    situacao: 'Devolvido',
  },
  {
    protocolo: '2025/0485',
    paciente: 'Francisca Marques Andrade',
    cpf: '56789012345',
    destino: 'Belém',
    unidade: 'Hospital Regional de Açailândia',
    valorDiarias: 1785.9,
    dataViagem: '2025-03-21',
    situacao: 'Aprovado',
  },
  {
    protocolo: '2025/0486',
    paciente: 'José Carlos Mendes',
    cpf: '67890123456',
    destino: 'Teresina',
    unidade: 'Unidade Mista de Bacabal',
    valorDiarias: 720.4,
    dataViagem: '2025-03-24',
    situacao: 'Rascunho',
  },
  {
    protocolo: '2025/0487',
    paciente: 'Luzia Pereira dos Santos',
    cpf: '78901234567',
    destino: 'São Luís',
    unidade: 'Hospital Municipal de Timon',
    valorDiarias: 1060,
    dataViagem: '2025-03-25',
    situacao: 'Em Análise',
  },
  {
    protocolo: '2025/0488',
    paciente: 'Sebastião Alves Rocha',
    cpf: '89012345678',
    destino: 'Fortaleza',
    unidade: 'Policlínica de Chapadinha',
    valorDiarias: 2440.3,
    dataViagem: '2025-03-27',
    situacao: 'Cancelado',
  },
  {
    protocolo: '2025/0489',
    paciente: 'Terezinha Costa Barbosa',
    cpf: '90123456789',
    destino: 'Belém',
    unidade: 'Hospital Regional de Pinheiro',
    valorDiarias: 1330.15,
    dataViagem: '2025-03-28',
    situacao: 'Aprovado',
  },
  {
    protocolo: '2025/0490',
    paciente: 'Manoel Gomes de Oliveira',
    cpf: '01234567890',
    destino: 'São Luís',
    unidade: 'Unidade Mista de Barra do Corda',
    valorDiarias: 505.6,
    dataViagem: '2025-04-02',
    situacao: 'Enviado',
  },
  {
    protocolo: '2025/0491',
    paciente: 'Rita de Cássia Nascimento',
    cpf: '11223344556',
    destino: 'Teresina',
    unidade: 'Hospital Municipal de Santa Inês',
    valorDiarias: 980.25,
    dataViagem: '2025-04-03',
    situacao: 'Em Análise',
  },
  {
    protocolo: '2025/0492',
    paciente: 'Domingos Sávio Teixeira',
    cpf: '22334455667',
    destino: 'Fortaleza',
    unidade: 'Policlínica de Coroatá',
    valorDiarias: 1620,
    dataViagem: '2025-04-07',
    situacao: 'Devolvido',
  },
  {
    protocolo: '2025/0493',
    paciente: 'Josefa Maria Cardoso',
    cpf: '33445566778',
    destino: 'São Luís',
    unidade: 'Hospital Regional de Presidente Dutra',
    valorDiarias: 415.8,
    dataViagem: '2025-04-08',
    situacao: 'Aprovado',
  },
  {
    protocolo: '2025/0494',
    paciente: 'Antônio Vieira de Castro',
    cpf: '44556677889',
    destino: 'Belém',
    unidade: 'Unidade Mista de Zé Doca',
    valorDiarias: 2050.45,
    dataViagem: '2025-04-10',
    situacao: 'Enviado',
  },
  {
    protocolo: '2025/0495',
    paciente: 'Marina Lopes Figueiredo',
    cpf: '55667788990',
    destino: 'Teresina',
    unidade: 'Hospital Municipal de Grajaú',
    valorDiarias: 760.7,
    dataViagem: '2025-04-11',
    situacao: 'Em Análise',
  },
  {
    protocolo: '2025/0496',
    paciente: 'Benedito Carvalho Pinto',
    cpf: '66778899001',
    destino: 'São Luís',
    unidade: 'Policlínica de Viana',
    valorDiarias: 1195.35,
    dataViagem: '2025-04-14',
    situacao: 'Aprovado',
  },
  {
    protocolo: '2025/0497',
    paciente: 'Cleide Fernandes Moreira',
    cpf: '77889900112',
    destino: 'Fortaleza',
    unidade: 'Hospital Regional de Itapecuru-Mirim',
    valorDiarias: 2310.9,
    dataViagem: '2025-04-15',
    situacao: 'Rascunho',
  },
  {
    protocolo: '2025/0498',
    paciente: 'Geraldo Martins Bezerra',
    cpf: '88990011223',
    destino: 'Belém',
    unidade: 'Unidade Mista de São João dos Patos',
    valorDiarias: 545,
    dataViagem: '2025-04-16',
    situacao: 'Cancelado',
  },
  {
    protocolo: '2025/0499',
    paciente: 'Vanda Lúcia Cavalcante',
    cpf: '99001122334',
    destino: 'São Luís',
    unidade: 'Hospital Municipal de Rosário',
    valorDiarias: 1425.6,
    dataViagem: '2025-04-17',
    situacao: 'Enviado',
  },
  {
    protocolo: '2025/0500',
    paciente: 'Pedro Henrique Aguiar',
    cpf: '10112233445',
    destino: 'Teresina',
    unidade: 'Policlínica de Buriticupu',
    valorDiarias: 875.2,
    dataViagem: '2025-04-22',
    situacao: 'Em Análise',
  },
  {
    protocolo: '2025/0501',
    paciente: 'Ana Cláudia Moura',
    cpf: '20223344556',
    destino: 'Fortaleza',
    unidade: 'Hospital Regional de Santa Luzia',
    valorDiarias: 1990.05,
    dataViagem: '2025-04-23',
    situacao: 'Aprovado',
  },
  {
    protocolo: '2025/0502',
    paciente: 'Everaldo Sousa Braga',
    cpf: '30334455667',
    destino: 'São Luís',
    unidade: 'Unidade Mista de Tutóia',
    valorDiarias: 660.85,
    dataViagem: '2025-04-24',
    situacao: 'Devolvido',
  },
  {
    protocolo: '2025/0503',
    paciente: 'Sandra Regina Duarte',
    cpf: '40445566778',
    destino: 'Belém',
    unidade: 'Hospital Municipal de Carolina',
    valorDiarias: 1510.4,
    dataViagem: '2025-04-28',
    situacao: 'Enviado',
  },
  {
    protocolo: '2025/0504',
    paciente: 'Wellington Farias Nunes',
    cpf: '50556677889',
    destino: 'Teresina',
    unidade: 'Policlínica de Pedreiras',
    valorDiarias: 1082.7,
    dataViagem: '2025-04-30',
    situacao: 'Em Análise',
  },
];

/**
 * Registros com texto longo, para checar quebra de linha, truncamento e
 * alinhamento da coluna de ações sem quebrar o layout da tabela.
 */
export const SOLICITACOES_LONGAS: SolicitacaoTFD[] = [
  {
    protocolo: '2025/0505-A/SUBSTITUTIVO-II',
    paciente: 'Maria das Graças Nascimento Albuquerque de Vasconcelos Filha',
    cpf: '60667788990',
    destino: 'São José de Ribamar do Alto Sertão Maranhense',
    unidade:
      'Hospital Regional Materno Infantil de Imperatriz, Unidade de Alta Complexidade em Oncologia',
    valorDiarias: 18742.99,
    dataViagem: '2025-05-04',
    situacao: 'Aguardando Assinatura',
  },
  {
    protocolo: '2025/0506',
    paciente: 'Francisco de Assis do Nascimento Sobrinho Júnior',
    cpf: '70778899001',
    destino: 'Presidente Juscelino',
    unidade: 'Centro Especializado de Reabilitação Física e Auditiva de São Luís',
    valorDiarias: 9310.5,
    dataViagem: '2025-05-06',
    situacao: 'Suspenso',
  },
  ...SOLICITACOES.slice(0, 6),
];

/** Municípios de destino disponíveis no filtro contextual. */
export const DESTINOS = ['Belém', 'Fortaleza', 'São Luís', 'Teresina'] as const;

/** Situações disponíveis no filtro contextual, na ordem do fluxo. */
export const SITUACOES: EstadoDeFluxo[] = [
  'Rascunho',
  'Enviado',
  'Em Análise',
  'Aprovado',
  'Devolvido',
  'Cancelado',
];

/** Competências (mês de referência) disponíveis no filtro contextual. */
export const COMPETENCIAS = [
  { value: '2025-03', label: 'Março de 2025' },
  { value: '2025-04', label: 'Abril de 2025' },
  { value: '2025-05', label: 'Maio de 2025' },
];

/** `2025-03-12` vira `12/03/2025` sem passar por `Date`, que muda com o fuso. */
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export interface FiltrosDaConsulta {
  termo: string;
  situacao: string;
  destino: string;
  competencia: string;
}

export const FILTROS_VAZIOS: FiltrosDaConsulta = {
  termo: '',
  situacao: '',
  destino: '',
  competencia: '',
};

/** Busca por protocolo ou nome do paciente, a partir de 3 caracteres. */
export function filtrar(
  solicitacoes: SolicitacaoTFD[],
  { termo, situacao, destino, competencia }: FiltrosDaConsulta,
): SolicitacaoTFD[] {
  const buscavel = termo.trim().toLowerCase();

  return solicitacoes.filter((solicitacao) => {
    if (buscavel.length >= 3) {
      const alvo = `${solicitacao.protocolo} ${solicitacao.paciente}`.toLowerCase();
      if (!alvo.includes(buscavel)) return false;
    }
    if (situacao && solicitacao.situacao !== situacao) return false;
    if (destino && solicitacao.destino !== destino) return false;
    if (competencia && !solicitacao.dataViagem.startsWith(competencia)) return false;
    return true;
  });
}

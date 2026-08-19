/**
 * Linhas da listagem `Páginas/Processos/Consulta de processos`.
 *
 * Nada aqui é dado novo: cada linha é uma projeção do registro único de
 * `dominio-tfd.ts`. Abrir o protocolo na listagem leva ao mesmo processo que o
 * detalhe exibe, com o mesmo destino, a mesma unidade de origem, o mesmo valor
 * e a mesma data, porque os dois leem a mesma fonte.
 */

import {
  COMPETENCIAS as COMPETENCIAS_DO_DOMINIO,
  MUNICIPIOS_DE_DESTINO,
  PROCESSOS,
  ROTULOS_DE_SITUACAO,
  type ProcessoDeTFD,
  type SituacaoDoProcesso,
  formatarData,
  formatarMoeda,
  mascararCPF,
  rotuloDoMunicipio,
  unidade,
  valorDasDiarias,
} from './dominio-tfd';

export { formatarData, formatarMoeda, mascararCPF };

export interface LinhaDoProcesso {
  /** Identificador do registro, no formato ano/sequencial. */
  protocolo: string;
  paciente: string;
  /** Guardado por inteiro na fonte, exibido sempre por `mascararCPF`. */
  cpf: string;
  /** Município de destino do tratamento, com a sigla da unidade federativa. */
  destino: string;
  /** Unidade de saúde responsável pelo encaminhamento. */
  unidadeDeOrigem: string;
  /** Soma das diárias, calculada a partir da quantidade e da tabela vigente. */
  valorDiarias: number;
  /** Data da viagem no formato ISO, para ordenação estável. */
  dataViagem: string;
  /** Mês de referência da despesa, no formato `AAAA-MM`. */
  competencia: string;
  situacao: SituacaoDoProcesso;
}

export function comoLinha(processo: ProcessoDeTFD): LinhaDoProcesso {
  return {
    protocolo: processo.protocolo,
    paciente: processo.paciente,
    cpf: processo.cpf,
    destino: rotuloDoMunicipio(processo.municipioDestinoId),
    unidadeDeOrigem: unidade(processo.unidadeOrigemId).nome,
    valorDiarias: valorDasDiarias(processo),
    dataViagem: processo.dataViagem,
    competencia: processo.competencia,
    situacao: processo.situacao,
  };
}

/** Fila de regulação do servidor autenticado: 24 processos do registro. */
export const PROCESSOS_DA_FILA: LinhaDoProcesso[] = PROCESSOS.map(comoLinha);

/**
 * Registros com texto longo, para checar quebra de linha, truncamento e
 * alinhamento da coluna de ações sem quebrar o layout da tabela. São variações
 * de registros reais do catálogo, com sufixo de protocolo administrativo.
 */
export const PROCESSOS_LONGOS: LinhaDoProcesso[] = [
  {
    ...comoLinha(PROCESSOS[0]),
    protocolo: '2026/0481-A/SUBSTITUTIVO-II',
    paciente: 'Maria de Fátima Souza dos Santos Albuquerque Nascimento Filha',
    unidadeDeOrigem:
      'Hospital Regional Materno Infantil de Imperatriz, Unidade de Alta Complexidade em Oncologia',
    valorDiarias: 18742.99,
    situacao: 'Aguardando Assinatura',
  },
  {
    ...comoLinha(PROCESSOS[2]),
    protocolo: '2026/0483-B/APENSADO',
    paciente: 'Antônia Ribeiro Lima do Nascimento Sobrinha Júnior',
    unidadeDeOrigem: 'Centro Especializado de Reabilitação Física e Auditiva de Caxias',
    valorDiarias: 9310.5,
    situacao: 'Devolvido',
  },
  ...PROCESSOS.slice(0, 6).map(comoLinha),
];

/** Municípios de destino disponíveis no filtro contextual. */
export const DESTINOS = MUNICIPIOS_DE_DESTINO.map((item) => rotuloDoMunicipio(item.id));

/** Situações disponíveis no filtro contextual, na ordem do fluxo. */
export const SITUACOES = ROTULOS_DE_SITUACAO;

/** Competências (mês de referência) presentes nos registros. */
export const COMPETENCIAS = COMPETENCIAS_DO_DOMINIO;

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
  linhas: LinhaDoProcesso[],
  { termo, situacao, destino, competencia }: FiltrosDaConsulta,
): LinhaDoProcesso[] {
  const buscavel = termo.trim().toLowerCase();

  return linhas.filter((linha) => {
    if (buscavel.length >= 3) {
      const alvo = `${linha.protocolo} ${linha.paciente}`.toLowerCase();
      if (!alvo.includes(buscavel)) return false;
    }
    if (situacao && linha.situacao !== situacao) return false;
    if (destino && linha.destino !== destino) return false;
    if (competencia && linha.competencia !== competencia) return false;
    return true;
  });
}

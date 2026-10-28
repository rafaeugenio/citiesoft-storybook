/**
 * Solicitações de TFD fictícias para as stories dos blocos de listagem
 * (PageHeader, FilterBar, DataListing, SelectionBar). Determinístico: sem
 * `Math.random()` e sem data corrente. Nenhum dado é real; CPFs mascarados.
 */

export type StatusSolicitacao =
  | 'Em análise'
  | 'Aguardando documentos'
  | 'Aprovada'
  | 'Agendada'
  | 'Concluída'
  | 'Negada';

export interface SolicitacaoListagem {
  id: string;
  protocolo: string;
  paciente: string;
  cpf: string;
  origem: string;
  destino: string;
  especialidade: string;
  transporte: string;
  /** ISO `AAAA-MM-DD`. */
  dataConsulta: string;
  status: StatusSolicitacao;
}

export const STATUS_SOLICITACAO: StatusSolicitacao[] = [
  'Em análise',
  'Aguardando documentos',
  'Aprovada',
  'Agendada',
  'Concluída',
  'Negada',
];

export const ESPECIALIDADES_LISTAGEM = ['Cardiologia', 'Oncologia', 'Oftalmologia', 'Ortopedia', 'Neurologia'];
export const ORIGENS_LISTAGEM = ['Barra do Corda', 'Codó', 'Pinheiro', 'Balsas', 'Imperatriz', 'Caxias'];
export const DESTINOS_LISTAGEM = ['São Luís', 'Teresina', 'Fortaleza'];
export const TRANSPORTES_LISTAGEM = ['Terrestre', 'Aéreo', 'Meio próprio'];

const NOMES = [
  'Ana Beatriz', 'Carlos Eduardo', 'Maria das Graças', 'José Ribamar', 'Francisca', 'Antônio Carlos',
  'Luzia', 'Raimundo', 'Joana d’Arc', 'Paulo Roberto', 'Rita de Cássia', 'Marcos Vinícius',
  'Sebastiana', 'Edvaldo', 'Terezinha', 'Gilberto',
];
const SOBRENOMES = [
  'Albuquerque', 'Sampaio', 'Nogueira', 'Carvalho', 'Pereira', 'Matos', 'Lima', 'Coelho',
  'Ferreira', 'Moura', 'Rocha', 'Teixeira', 'Barros', 'Viana', 'Castro', 'Pinheiro',
];

function rng(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function gerar(): SolicitacaoListagem[] {
  const r = rng(2026);
  const pick = <T,>(lista: T[]) => lista[Math.floor(r() * lista.length)];
  return Array.from({ length: 48 }, (_, i) => {
    const dia = 1 + Math.floor(r() * 28);
    const mes = 10 + Math.floor(r() * 3);
    const meio = String(Math.floor(r() * 900) + 100);
    const fim = String(Math.floor(r() * 90) + 10);
    return {
      id: `sol-${i + 1}`,
      protocolo: `TFD-2026-${String(4812 + i * 7).padStart(6, '0')}`,
      paciente: `${pick(NOMES)} ${pick(SOBRENOMES)}`,
      cpf: `${meio}.***.***-${fim}`,
      origem: pick(ORIGENS_LISTAGEM),
      destino: pick(DESTINOS_LISTAGEM),
      especialidade: pick(ESPECIALIDADES_LISTAGEM),
      transporte: pick(TRANSPORTES_LISTAGEM),
      dataConsulta: `2026-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`,
      status: pick(STATUS_SOLICITACAO),
    };
  });
}

export const SOLICITACOES_LISTAGEM: SolicitacaoListagem[] = gerar();

export function formatarDataBR(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

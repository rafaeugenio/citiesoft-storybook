/**
 * Solicitações de TFD fictícias para a tela de listagem. Determinístico (sem
 * `Math.random()` nem data corrente). Nomes inventados e CPF sempre mascarado.
 */

export type StatusSolicitacao =
  | "Em análise"
  | "Aguardando documentos"
  | "Aprovada"
  | "Agendada"
  | "Concluída"
  | "Negada";

export type SituacaoDocumento = "Entregue" | "Em conferência" | "Pendente";

export interface DocumentoSolicitacao {
  nome: string;
  situacao: SituacaoDocumento;
}

export interface SolicitacaoTFD {
  id: string;
  protocolo: string;
  paciente: string;
  cpf: string;
  nascimento: string;
  telefone: string;
  origem: string;
  destino: string;
  unidadeDestino: string;
  especialidade: string;
  transporte: string;
  acompanhante: boolean;
  /** ISO `AAAA-MM-DD`. */
  dataSolicitacao: string;
  /** ISO `AAAA-MM-DD`. */
  dataConsulta: string;
  status: StatusSolicitacao;
  documentos: DocumentoSolicitacao[];
  observacao: string;
}

export const STATUS_SOLICITACAO: StatusSolicitacao[] = [
  "Em análise",
  "Aguardando documentos",
  "Aprovada",
  "Agendada",
  "Concluída",
  "Negada",
];

export const COR_STATUS: Record<StatusSolicitacao, "cyan" | "yellow" | "lime" | "blue" | "gray" | "rose"> = {
  "Em análise": "cyan",
  "Aguardando documentos": "yellow",
  Aprovada: "lime",
  Agendada: "blue",
  Concluída: "gray",
  Negada: "rose",
};

export const COR_DOCUMENTO: Record<SituacaoDocumento, "lime" | "yellow" | "rose"> = {
  Entregue: "lime",
  "Em conferência": "yellow",
  Pendente: "rose",
};

export const ESPECIALIDADES = ["Cardiologia", "Oncologia", "Oftalmologia", "Ortopedia", "Neurologia"];
export const ORIGENS = ["Barra do Corda", "Codó", "Pinheiro", "Balsas", "Imperatriz", "Caxias"];
export const DESTINOS = ["São Luís", "Teresina", "Fortaleza"];
export const TRANSPORTES = ["Terrestre", "Aéreo", "Meio próprio"];

const UNIDADES_DESTINO: Record<string, string> = {
  "São Luís": "Hospital Universitário Presidente Dutra",
  Teresina: "Hospital Getúlio Vargas",
  Fortaleza: "Hospital Geral de Fortaleza",
};

const NOMES = [
  "Ana Beatriz", "Carlos Eduardo", "Maria das Graças", "José Ribamar", "Francisca", "Antônio Carlos",
  "Luzia", "Raimundo", "Joana", "Paulo Roberto", "Rita de Cássia", "Marcos Vinícius",
  "Sebastiana", "Edvaldo", "Terezinha", "Gilberto",
];
const SOBRENOMES = [
  "Albuquerque", "Sampaio", "Nogueira", "Carvalho", "Pereira", "Matos", "Lima", "Coelho",
  "Ferreira", "Moura", "Rocha", "Teixeira", "Barros", "Viana", "Castro", "Pinheiro",
];
const DOCUMENTOS_BASE = [
  "Encaminhamento médico",
  "Laudo do especialista",
  "Documento de identificação",
  "Comprovante de residência",
  "Cartão SUS",
];
const SITUACOES_DOC: SituacaoDocumento[] = ["Entregue", "Entregue", "Entregue", "Em conferência", "Pendente"];
const OBSERVACOES = [
  "Paciente com mobilidade reduzida. Necessita de assento adaptado no deslocamento.",
  "Retorno de acompanhamento. Exames anteriores anexados ao encaminhamento.",
  "Consulta de primeira vez. Aguardando confirmação de vaga na unidade de destino.",
  "Paciente em tratamento contínuo. Priorizar data próxima do último retorno.",
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

function iso(mes: number, dia: number) {
  return `2026-${String(mes).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function gerar(): SolicitacaoTFD[] {
  const r = rng(4812);
  const pick = <T,>(lista: T[]) => lista[Math.floor(r() * lista.length)];
  return Array.from({ length: 42 }, (_, i) => {
    const destino = pick(DESTINOS);
    const status = pick(STATUS_SOLICITACAO);
    const meio = String(Math.floor(r() * 900) + 100);
    const fim = String(Math.floor(r() * 90) + 10);
    const doc = (situacoes: SituacaoDocumento[]) =>
      DOCUMENTOS_BASE.map((nome, k) => ({ nome, situacao: situacoes[k] }));
    const documentos =
      status === "Aguardando documentos"
        ? doc(SITUACOES_DOC)
        : status === "Em análise"
          ? doc(["Entregue", "Entregue", "Entregue", "Entregue", "Em conferência"])
          : doc(["Entregue", "Entregue", "Entregue", "Entregue", "Entregue"]);
    return {
      id: `sol-${i + 1}`,
      protocolo: `TFD-2026-${String(4812 + i * 7).padStart(6, "0")}`,
      paciente: `${pick(NOMES)} ${pick(SOBRENOMES)}`,
      cpf: `${meio}.***.***-${fim}`,
      nascimento: iso(1 + Math.floor(r() * 12), 1 + Math.floor(r() * 28)).replace("2026", String(1948 + Math.floor(r() * 55))),
      telefone: `(99) 9${Math.floor(r() * 9000) + 1000}-****`,
      origem: pick(ORIGENS),
      destino,
      unidadeDestino: UNIDADES_DESTINO[destino],
      especialidade: pick(ESPECIALIDADES),
      transporte: pick(TRANSPORTES),
      acompanhante: r() > 0.55,
      dataSolicitacao: iso(9 + Math.floor(r() * 2), 1 + Math.floor(r() * 28)),
      dataConsulta: iso(10 + Math.floor(r() * 3), 1 + Math.floor(r() * 28)),
      status,
      documentos,
      observacao: pick(OBSERVACOES),
    };
  });
}

export const SOLICITACOES: SolicitacaoTFD[] = gerar();

export function formatarDataBR(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

/**
 * Fonte única de domínio do catálogo de páginas.
 *
 * Todas as páginas de `.storybook/pages/` derivam daqui: processos, pessoas,
 * municípios, unidades, especialidades, secretarias, situações, valores e
 * agregados do painel. Nenhuma página monta dado próprio, e nenhum total
 * exibido é digitado à mão: todo agregado é calculado sobre os registros
 * declarados neste arquivo.
 *
 * Regras que este módulo garante por construção:
 *
 * 1. O mesmo processo tem a mesma identidade em qualquer tela. A listagem, o
 *    detalhe, o painel e o acompanhamento do cidadão leem o mesmo registro.
 * 2. Os totais do painel são reduções sobre `MOVIMENTO_DIARIO`, então a soma
 *    de qualquer eixo bate com o indicador correspondente em todos os períodos.
 * 3. Um único glossário de situação, com o mesmo rótulo e o mesmo gênero em
 *    filtro, badge, gráfico e linha do tempo.
 * 4. Uma única regra de mascaramento de dado pessoal, aplicada em toda tela,
 *    de modo que cruzar duas telas não reconstitua o número.
 * 5. Uma única data de referência para o catálogo inteiro.
 *
 * Tudo é determinístico: nenhuma chamada a `Math.random()` e nenhuma data
 * corrente. A variação diária do painel vem de um gerador congruencial com
 * semente fixa, para o snapshot visual não oscilar entre execuções.
 *
 * Nenhum dado é real. Nomes, CPFs, cartões do SUS, matrículas, protocolos e
 * telefones são fictícios, e os CPFs foram escolhidos de modo a falhar na
 * checagem do dígito verificador.
 */

import { mascararCPF } from '../../src';
import type { EstadoDeFluxo, Serie } from '../../src';

/* ------------------------------------------------------------------ */
/* 1 · Tempo                                                           */
/* ------------------------------------------------------------------ */

/**
 * Data de referência única do catálogo: quarta-feira, 15 de julho de 2026.
 * Toda tela que precisa de "hoje" usa esta data, para que o painel do mês
 * cubra os processos que a listagem exibe e o calendário não varie.
 */
export const HOJE = new Date(2026, 6, 15);

/** A mesma data em ISO, para comparação de string sem passar por fuso. */
export const HOJE_ISO = '2026-07-15';

/** `2026-07-21` vira `21/07/2026` sem passar por `Date`, que muda com o fuso. */
export function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split('-');
  return `${dia}/${mes}/${ano}`;
}

export function formatarDataCurta(data?: Date): string {
  if (!data) return 'Não informada';
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function formatarMoeda(valor: number): string {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/** Valor arredondado ao real, para indicador gerencial. */
export function formatarMoedaCheia(valor: number): string {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

export function formatarInteiro(valor: number): string {
  return valor.toLocaleString('pt-BR');
}

const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

/** `2026-07` vira `Julho de 2026`, com a inicial maiúscula. */
export function rotuloDaCompetencia(competencia: string): string {
  const [ano, mes] = competencia.split('-');
  const nome = MESES[Number(mes) - 1];
  return `${nome[0].toUpperCase()}${nome.slice(1)} de ${ano}`;
}

/* ------------------------------------------------------------------ */
/* 2 · Mascaramento de dado pessoal                                    */
/* ------------------------------------------------------------------ */

/**
 * Regra única de mascaramento de CPF do catálogo.
 *
 * O recorte é sempre o mesmo, em qualquer tela e para qualquer perfil:
 * ficam visíveis apenas o nono dígito e os dois verificadores, no formato
 * válido de CPF (`***.***.**9-01`). Como o recorte não muda de tela para
 * tela, cruzar a listagem com o detalhe não revela nenhum dígito novo.
 *
 * O valor completo não é exibido em nenhuma página deste catálogo. Ele só
 * volta ao campo de edição do próprio registro, no cadastro de servidor,
 * onde a gravação exige o número inteiro.
 */
/*
 * A implementação vive no design system e é reexportada aqui, em vez de
 * duplicada. As duas cópias já divergiram uma vez: a do catálogo expunha os
 * quatro dígitos finais e a daqui expunha três, então a mesma pessoa aparecia
 * com máscaras diferentes conforme a tela. Regra de mascaramento é regra única.
 */
export { mascararCPF };

/** CPF completo, formatado. Usado apenas em campo de edição do registro. */
export function formatarCPF(cpf: string): string {
  const digitos = cpf.replace(/\D/g, '');
  if (digitos.length !== 11) return cpf;
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`;
}

/**
 * Telefone mascarado com o mesmo caractere do CPF e o mesmo critério: o DDD
 * fica visível, porque é dado de região e não de pessoa, e do número restam
 * apenas os dois últimos dígitos, o suficiente para o servidor conferir com o
 * cadastro sem que a tela exponha a linha inteira.
 */
export function mascararTelefone(telefone: string): string {
  const digitos = telefone.replace(/\D/g, '');
  if (digitos.length < 10) return telefone;
  const ddd = digitos.slice(0, 2);
  const corpo = digitos.slice(2);
  const prefixo = '*'.repeat(corpo.length - 4);
  return `(${ddd}) ${prefixo}-**${digitos.slice(-2)}`;
}

/** Telefone completo, formatado. Usado apenas em campo de edição do registro. */
export function formatarTelefone(telefone: string): string {
  const d = telefone.replace(/\D/g, '');
  if (d.length < 10) return telefone;
  return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
}

/** Cartão SUS mascarado: só o último bloco de quatro dígitos permanece. */
export function mascararCartaoSus(cartao: string): string {
  const digitos = cartao.replace(/\D/g, '');
  if (digitos.length !== 15) return cartao;
  return `*** **** **** ${digitos.slice(-4)}`;
}

/** Cartão SUS completo, em blocos de 3-4-4-4. */
export function formatarCartaoSus(cartao: string): string {
  const d = cartao.replace(/\D/g, '');
  if (d.length !== 15) return cartao;
  return `${d.slice(0, 3)} ${d.slice(3, 7)} ${d.slice(7, 11)} ${d.slice(11)}`;
}

/* ------------------------------------------------------------------ */
/* 3 · Glossário de situação                                           */
/* ------------------------------------------------------------------ */

/**
 * Situações do processo de TFD, na ordem do fluxo. É o único vocabulário de
 * situação do catálogo: filtro da listagem, badge da tabela, fatia da rosca do
 * painel, linha do tempo do detalhe e acompanhamento do cidadão leem daqui.
 *
 * Todos os rótulos são masculinos, concordando com o objeto do domínio
 * ("processo"), e todos existem no glossário do `StatusIndicator`.
 */
export type SituacaoDoProcesso = Extract<
  EstadoDeFluxo,
  | 'Rascunho'
  | 'Enviado'
  | 'Em Análise'
  | 'Aguardando Assinatura'
  | 'Aprovado'
  | 'Devolvido'
  | 'Cancelado'
>;

export interface DefinicaoDeSituacao {
  id: SituacaoDoProcesso;
  /** O que a situação significa para quem opera a regulação. */
  definicao: string;
  /** A mesma situação dita ao cidadão, em linguagem de benefício. */
  paraOCidadao: string;
  /** A situação entra na fila de trabalho da regulação. */
  naRegulacao: boolean;
}

export const SITUACOES: DefinicaoDeSituacao[] = [
  {
    id: 'Rascunho',
    definicao: 'Preenchimento iniciado pela unidade de origem e ainda não enviado à regulação.',
    paraOCidadao: 'Seu pedido está sendo preenchido pela unidade de saúde.',
    naRegulacao: false,
  },
  {
    id: 'Enviado',
    definicao: 'Recebido pela regulação e aguardando distribuição para análise.',
    paraOCidadao: 'Seu pedido chegou à regulação estadual.',
    naRegulacao: true,
  },
  {
    id: 'Em Análise',
    definicao: 'Em avaliação técnica pela regulação ambulatorial.',
    paraOCidadao: 'Seu pedido está sendo avaliado pela equipe médica.',
    naRegulacao: true,
  },
  {
    id: 'Aguardando Assinatura',
    definicao: 'Parecer concluído, pendente de assinatura da coordenação de TFD.',
    paraOCidadao: 'Sua autorização está com a coordenação para assinatura.',
    naRegulacao: true,
  },
  {
    id: 'Aprovado',
    definicao: 'Deslocamento autorizado, com diárias e passagens liberadas.',
    paraOCidadao: 'Sua viagem foi autorizada. A unidade vai combinar o transporte com você.',
    naRegulacao: false,
  },
  {
    id: 'Devolvido',
    definicao: 'Devolvido à unidade de origem para complementar documentação.',
    paraOCidadao: 'Falta um documento. A unidade de saúde vai entrar em contato com você.',
    naRegulacao: true,
  },
  {
    id: 'Cancelado',
    definicao: 'Encerrado sem deslocamento, a pedido do paciente ou por perda de objeto.',
    paraOCidadao: 'Seu pedido foi encerrado sem viagem.',
    naRegulacao: false,
  },
];

/** Só os rótulos, na ordem do fluxo. Alimenta o filtro da listagem. */
export const ROTULOS_DE_SITUACAO: SituacaoDoProcesso[] = SITUACOES.map((situacao) => situacao.id);

export function definicaoDaSituacao(id: SituacaoDoProcesso): DefinicaoDeSituacao {
  return SITUACOES.find((situacao) => situacao.id === id) ?? SITUACOES[0];
}

/** Situações que o painel mede: as que chegam à regulação e o desfecho delas. */
export const SITUACOES_MEDIDAS: SituacaoDoProcesso[] = [
  'Aprovado',
  'Em Análise',
  'Aguardando Assinatura',
  'Devolvido',
  'Cancelado',
];

/* ------------------------------------------------------------------ */
/* 4 · Geografia e rede de saúde do Maranhão                           */
/* ------------------------------------------------------------------ */

export interface Municipio {
  id: string;
  nome: string;
  uf: string;
  /** Origem envia paciente; destino recebe tratamento; polo faz as duas coisas. */
  papel: 'origem' | 'destino' | 'polo';
}

export const MUNICIPIOS: Municipio[] = [
  { id: 'sao-luis', nome: 'São Luís', uf: 'MA', papel: 'destino' },
  { id: 'imperatriz', nome: 'Imperatriz', uf: 'MA', papel: 'polo' },
  { id: 'teresina', nome: 'Teresina', uf: 'PI', papel: 'destino' },
  { id: 'fortaleza', nome: 'Fortaleza', uf: 'CE', papel: 'destino' },
  { id: 'sao-paulo', nome: 'São Paulo', uf: 'SP', papel: 'destino' },
  { id: 'acailandia', nome: 'Açailândia', uf: 'MA', papel: 'origem' },
  { id: 'bacabal', nome: 'Bacabal', uf: 'MA', papel: 'origem' },
  { id: 'balsas', nome: 'Balsas', uf: 'MA', papel: 'origem' },
  { id: 'barra-do-corda', nome: 'Barra do Corda', uf: 'MA', papel: 'origem' },
  { id: 'barreirinhas', nome: 'Barreirinhas', uf: 'MA', papel: 'origem' },
  { id: 'buriticupu', nome: 'Buriticupu', uf: 'MA', papel: 'origem' },
  { id: 'carolina', nome: 'Carolina', uf: 'MA', papel: 'origem' },
  { id: 'caxias', nome: 'Caxias', uf: 'MA', papel: 'origem' },
  { id: 'chapadinha', nome: 'Chapadinha', uf: 'MA', papel: 'origem' },
  { id: 'codo', nome: 'Codó', uf: 'MA', papel: 'origem' },
  { id: 'coroata', nome: 'Coroatá', uf: 'MA', papel: 'origem' },
  { id: 'grajau', nome: 'Grajaú', uf: 'MA', papel: 'origem' },
  { id: 'itapecuru-mirim', nome: 'Itapecuru-Mirim', uf: 'MA', papel: 'origem' },
  { id: 'pedreiras', nome: 'Pedreiras', uf: 'MA', papel: 'origem' },
  { id: 'pinheiro', nome: 'Pinheiro', uf: 'MA', papel: 'origem' },
  { id: 'presidente-dutra', nome: 'Presidente Dutra', uf: 'MA', papel: 'origem' },
  { id: 'rosario', nome: 'Rosário', uf: 'MA', papel: 'origem' },
  { id: 'santa-ines', nome: 'Santa Inês', uf: 'MA', papel: 'origem' },
  { id: 'santa-luzia', nome: 'Santa Luzia', uf: 'MA', papel: 'origem' },
  { id: 'sao-joao-dos-patos', nome: 'São João dos Patos', uf: 'MA', papel: 'origem' },
  { id: 'timon', nome: 'Timon', uf: 'MA', papel: 'origem' },
  { id: 'tutoia', nome: 'Tutóia', uf: 'MA', papel: 'origem' },
  { id: 'viana', nome: 'Viana', uf: 'MA', papel: 'origem' },
  { id: 'ze-doca', nome: 'Zé Doca', uf: 'MA', papel: 'origem' },
];

export function municipio(id: string): Municipio {
  const encontrado = MUNICIPIOS.find((item) => item.id === id);
  if (!encontrado) throw new Error(`Município fora do catálogo: ${id}`);
  return encontrado;
}

/** Nome com a sigla da unidade federativa: `Imperatriz (MA)`. */
export function rotuloDoMunicipio(id: string): string {
  const item = municipio(id);
  return `${item.nome} (${item.uf})`;
}

/** Municípios que podem figurar como origem do encaminhamento. */
export const MUNICIPIOS_DE_ORIGEM = MUNICIPIOS.filter(
  (item) => item.papel === 'origem' || item.papel === 'polo',
);

/** Municípios que recebem o tratamento, na ordem de volume do painel. */
export const MUNICIPIOS_DE_DESTINO = MUNICIPIOS.filter(
  (item) => item.papel === 'destino' || item.papel === 'polo',
);

export interface UnidadeDeSaude {
  id: string;
  nome: string;
  municipioId: string;
  /** Encaminha o paciente ou recebe o tratamento. */
  papel: 'origem' | 'destino';
}

export const UNIDADES: UnidadeDeSaude[] = [
  { id: 'hr-imperatriz', nome: 'Hospital Regional de Imperatriz', municipioId: 'imperatriz', papel: 'origem' },
  { id: 'um-balsas', nome: 'Unidade Mista de Balsas', municipioId: 'balsas', papel: 'origem' },
  { id: 'hm-caxias', nome: 'Hospital Municipal de Caxias', municipioId: 'caxias', papel: 'origem' },
  { id: 'pol-codo', nome: 'Policlínica de Codó', municipioId: 'codo', papel: 'origem' },
  { id: 'hr-acailandia', nome: 'Hospital Regional de Açailândia', municipioId: 'acailandia', papel: 'origem' },
  { id: 'um-bacabal', nome: 'Unidade Mista de Bacabal', municipioId: 'bacabal', papel: 'origem' },
  { id: 'hm-timon', nome: 'Hospital Municipal de Timon', municipioId: 'timon', papel: 'origem' },
  { id: 'pol-chapadinha', nome: 'Policlínica de Chapadinha', municipioId: 'chapadinha', papel: 'origem' },
  { id: 'hr-pinheiro', nome: 'Hospital Regional de Pinheiro', municipioId: 'pinheiro', papel: 'origem' },
  { id: 'um-barra-do-corda', nome: 'Unidade Mista de Barra do Corda', municipioId: 'barra-do-corda', papel: 'origem' },
  { id: 'hm-santa-ines', nome: 'Hospital Municipal de Santa Inês', municipioId: 'santa-ines', papel: 'origem' },
  { id: 'pol-coroata', nome: 'Policlínica de Coroatá', municipioId: 'coroata', papel: 'origem' },
  { id: 'hr-presidente-dutra', nome: 'Hospital Regional de Presidente Dutra', municipioId: 'presidente-dutra', papel: 'origem' },
  { id: 'um-ze-doca', nome: 'Unidade Mista de Zé Doca', municipioId: 'ze-doca', papel: 'origem' },
  { id: 'hm-grajau', nome: 'Hospital Municipal de Grajaú', municipioId: 'grajau', papel: 'origem' },
  { id: 'pol-viana', nome: 'Policlínica de Viana', municipioId: 'viana', papel: 'origem' },
  { id: 'hr-itapecuru', nome: 'Hospital Regional de Itapecuru-Mirim', municipioId: 'itapecuru-mirim', papel: 'origem' },
  { id: 'um-sao-joao-dos-patos', nome: 'Unidade Mista de São João dos Patos', municipioId: 'sao-joao-dos-patos', papel: 'origem' },
  { id: 'hm-rosario', nome: 'Hospital Municipal de Rosário', municipioId: 'rosario', papel: 'origem' },
  { id: 'pol-buriticupu', nome: 'Policlínica de Buriticupu', municipioId: 'buriticupu', papel: 'origem' },
  { id: 'hr-santa-luzia', nome: 'Hospital Regional de Santa Luzia', municipioId: 'santa-luzia', papel: 'origem' },
  { id: 'um-tutoia', nome: 'Unidade Mista de Tutóia', municipioId: 'tutoia', papel: 'origem' },
  { id: 'hm-carolina', nome: 'Hospital Municipal de Carolina', municipioId: 'carolina', papel: 'origem' },
  { id: 'pol-pedreiras', nome: 'Policlínica de Pedreiras', municipioId: 'pedreiras', papel: 'origem' },
  { id: 'um-barreirinhas', nome: 'Unidade Mista de Barreirinhas', municipioId: 'barreirinhas', papel: 'origem' },
  { id: 'hu-presidente-dutra', nome: 'Hospital Universitário Presidente Dutra', municipioId: 'sao-luis', papel: 'destino' },
  { id: 'hospital-do-cancer', nome: 'Hospital do Câncer Aldenora Bello', municipioId: 'sao-luis', papel: 'destino' },
  { id: 'cer-sao-luis', nome: 'Centro Especializado de Reabilitação de São Luís', municipioId: 'sao-luis', papel: 'destino' },
  { id: 'hospital-macrorregional', nome: 'Hospital Macrorregional de Imperatriz', municipioId: 'imperatriz', papel: 'destino' },
  { id: 'hospital-sao-marcos', nome: 'Hospital São Marcos', municipioId: 'teresina', papel: 'destino' },
  { id: 'hospital-do-coracao-ce', nome: 'Hospital do Coração de Messejana', municipioId: 'fortaleza', papel: 'destino' },
  { id: 'instituto-do-coracao', nome: 'Instituto do Coração', municipioId: 'sao-paulo', papel: 'destino' },
];

export function unidade(id: string): UnidadeDeSaude {
  const encontrada = UNIDADES.find((item) => item.id === id);
  if (!encontrada) throw new Error(`Unidade fora do catálogo: ${id}`);
  return encontrada;
}

/** Nome da unidade com o município, como aparece no detalhe do processo. */
export function rotuloDaUnidade(id: string): string {
  const item = unidade(id);
  return `${item.nome}, ${rotuloDoMunicipio(item.municipioId)}`;
}

export const UNIDADES_DE_DESTINO = UNIDADES.filter((item) => item.papel === 'destino');

/* ------------------------------------------------------------------ */
/* 5 · Especialidades, secretarias e transporte                        */
/* ------------------------------------------------------------------ */

export interface Especialidade {
  id: string;
  nome: string;
}

/** Lista única. O painel mede estas e só estas, e o wizard oferece as mesmas. */
export const ESPECIALIDADES: Especialidade[] = [
  { id: 'cardiologia', nome: 'Cardiologia' },
  { id: 'oncologia', nome: 'Oncologia' },
  { id: 'oftalmologia', nome: 'Oftalmologia' },
  { id: 'ortopedia', nome: 'Ortopedia' },
  { id: 'neurologia', nome: 'Neurologia' },
];

export function especialidade(id: string): Especialidade {
  const encontrada = ESPECIALIDADES.find((item) => item.id === id);
  if (!encontrada) throw new Error(`Especialidade fora do catálogo: ${id}`);
  return encontrada;
}

export interface Secretaria {
  id: string;
  /** Nomenclatura oficial por extenso, igual em toda tela. */
  nome: string;
  sigla: string;
  /** Só as da saúde encaminham paciente de TFD. */
  dominio: 'saude' | 'administracao' | 'educacao';
}

export const SECRETARIAS: Secretaria[] = [
  {
    id: 'ses',
    nome: 'Secretaria de Estado da Saúde',
    sigla: 'SES-MA',
    dominio: 'saude',
  },
  {
    id: 'sms-imperatriz',
    nome: 'Secretaria Municipal de Saúde de Imperatriz',
    sigla: 'SMS Imperatriz',
    dominio: 'saude',
  },
  {
    id: 'sms-caxias',
    nome: 'Secretaria Municipal de Saúde de Caxias',
    sigla: 'SMS Caxias',
    dominio: 'saude',
  },
  {
    id: 'seduc',
    nome: 'Secretaria de Estado da Educação',
    sigla: 'SEDUC-MA',
    dominio: 'educacao',
  },
  {
    id: 'sead',
    nome: 'Secretaria de Estado da Administração',
    sigla: 'SEAD-MA',
    dominio: 'administracao',
  },
];

/** Encaminhamento de TFD sai da saúde, então o wizard só oferece estas. */
export const SECRETARIAS_DE_SAUDE = SECRETARIAS.filter((item) => item.dominio === 'saude');

export const TIPOS_DE_TRANSPORTE = [
  { value: 'terrestre', label: 'Terrestre, van da Secretaria' },
  { value: 'aereo', label: 'Aéreo' },
  { value: 'proprio', label: 'Meio próprio com ressarcimento' },
];

export const TIPOS_DE_ACOMPANHAMENTO = [
  { value: 'sem', label: 'Sem acompanhante' },
  { value: 'com', label: 'Com acompanhante indicado no laudo' },
];

/* ------------------------------------------------------------------ */
/* 6 · Faixas de numeração                                             */
/* ------------------------------------------------------------------ */

/**
 * Cada objeto do domínio tem a própria faixa, visivelmente diferente das
 * outras, para que nenhum número identifique dois objetos ao mesmo tempo.
 *
 * | Objeto                 | Formato               | Exemplo                     |
 * | ---------------------- | --------------------- | --------------------------- |
 * | Processo de TFD        | `AAAA/NNNN`           | `2026/0481`                 |
 * | Laudo médico           | `LM AAAA/NNNNN`       | `LM 2026/12874`             |
 * | Lançamento de diárias  | `LD AAAA/NNNNN`       | `LD 2026/03318`             |
 * | Ajuda de custo         | `AC AAAA/NNNNN`       | `AC 2026/00882`             |
 * | Portaria de nomeação   | `Portaria N.NNN/AAAA` | `Portaria 1.204/2026`       |
 * | Matrícula de servidor  | 8 dígitos             | `20736514`                  |
 */
export const FORMATO_DO_PROTOCOLO = 'AAAA/NNNN';

/* ------------------------------------------------------------------ */
/* 7 · Pessoas                                                         */
/* ------------------------------------------------------------------ */

export interface Pessoa {
  id: string;
  nome: string;
  /** Papel único: ninguém é paciente e servidor ao mesmo tempo no catálogo. */
  papel: 'paciente' | 'servidor' | 'medico' | 'acompanhante';
  /** Onde a pessoa atua, quando é servidor ou médico. */
  vinculo?: string;
}

export const MEDICOS: Pessoa[] = [
  { id: 'med-cardio', nome: 'Dr. Carlos Andrade Belfort', papel: 'medico', vinculo: 'Cardiologia, Hospital Regional de Imperatriz' },
  { id: 'med-onco', nome: 'Dra. Helena Portela Vaz', papel: 'medico', vinculo: 'Oncologia clínica, Hospital do Câncer Aldenora Bello' },
  { id: 'med-oftalmo', nome: 'Dr. Sérgio Aranha Melo', papel: 'medico', vinculo: 'Oftalmologia, Policlínica de Codó' },
  { id: 'med-orto', nome: 'Dra. Beatriz Coelho Nina', papel: 'medico', vinculo: 'Ortopedia, Hospital Municipal de Caxias' },
  { id: 'med-neuro', nome: 'Dr. Otávio Sanches Bogéa', papel: 'medico', vinculo: 'Neurologia, Hospital Universitário Presidente Dutra' },
];

export const CRM_DO_MEDICO: Record<string, string> = {
  'med-cardio': 'CRM-MA 18442',
  'med-onco': 'CRM-MA 21075',
  'med-oftalmo': 'CRM-MA 16903',
  'med-orto': 'CRM-MA 23514',
  'med-neuro': 'CRM-MA 19860',
};

export function medico(id: string): Pessoa {
  const encontrado = MEDICOS.find((item) => item.id === id);
  if (!encontrado) throw new Error(`Médico fora do catálogo: ${id}`);
  return encontrado;
}

/**
 * Servidores do catálogo. Cada um tem um papel só: quem regula não assina
 * laudo, e quem cuida da folha de pessoal não tramita processo clínico.
 */
export const SERVIDORES: Pessoa[] = [
  { id: 'srv-coord', nome: 'Laryssa Mendes Aguiar', papel: 'servidor', vinculo: 'Coordenação de TFD' },
  { id: 'srv-regulacao', nome: 'Wagner Sousa Passos', papel: 'servidor', vinculo: 'Núcleo de Regulação Ambulatorial' },
  { id: 'srv-unidade', nome: 'Cleuza Batista Ramos', papel: 'servidor', vinculo: 'Hospital Regional de Imperatriz' },
  { id: 'srv-rh', nome: 'Nágila Prazeres Coelho', papel: 'servidor', vinculo: 'Gerência de Recursos Humanos' },
  { id: 'srv-cadastrada', nome: 'Rosileide Aparecida Mota', papel: 'servidor', vinculo: 'Coordenação de TFD' },
];

export function servidor(id: string): Pessoa {
  const encontrado = SERVIDORES.find((item) => item.id === id);
  if (!encontrado) throw new Error(`Servidor fora do catálogo: ${id}`);
  return encontrado;
}

/** Assinatura de ator na linha do tempo: nome mais a área de atuação. */
export function atorDoEvento(id: string): string {
  const pessoa = [...SERVIDORES, ...MEDICOS].find((item) => item.id === id);
  if (!pessoa) throw new Error(`Pessoa fora do catálogo: ${id}`);
  return pessoa.vinculo ? `${pessoa.nome} (${pessoa.vinculo.split(',')[0]})` : pessoa.nome;
}

/* ------------------------------------------------------------------ */
/* 8 · Processos de TFD                                                */
/* ------------------------------------------------------------------ */

/** Valor da diária vigente na tabela estadual de TFD, em reais. */
export const VALOR_DA_DIARIA = 206.75;

/** Ajuda de custo por diária concedida ao acompanhante, em reais. */
export const AJUDA_POR_DIARIA = 80;

export interface ProcessoDeTFD {
  /** Faixa `AAAA/NNNN`. Identifica o processo em toda tela. */
  protocolo: string;
  paciente: string;
  /** Fictício e sem dígito verificador válido. Nunca exibido por inteiro. */
  cpf: string;
  cartaoSus: string;
  nascimento: string;
  telefone: string;
  municipioOrigemId: string;
  unidadeOrigemId: string;
  municipioDestinoId: string;
  unidadeDestinoId: string;
  especialidadeId: string;
  medicoId: string;
  /** Faixa `LM AAAA/NNNNN`, distinta do protocolo do processo. */
  numeroDoLaudo: string;
  dataDoLaudo: string;
  diarias: number;
  dataViagem: string;
  /** Mês de referência da despesa, no formato `AAAA-MM`. */
  competencia: string;
  acompanhante?: string;
  situacao: SituacaoDoProcesso;
  atualizadoEm: string;
  /** Motivo de o processo estar na fila de atenção do painel. */
  prazo?: string;
}

/** Soma das diárias do processo, sempre calculada, nunca digitada. */
export function valorDasDiarias(processo: ProcessoDeTFD): number {
  return Number((processo.diarias * VALOR_DA_DIARIA).toFixed(2));
}

/** Ajuda de custo do acompanhante, zero quando o paciente viaja sozinho. */
export function valorDaAjudaDeCusto(processo: ProcessoDeTFD): number {
  return processo.acompanhante ? Number((processo.diarias * AJUDA_POR_DIARIA).toFixed(2)) : 0;
}

/** Trecho do deslocamento, na ordem origem para destino. */
export function trechoDoProcesso(processo: ProcessoDeTFD): string {
  return `${rotuloDoMunicipio(processo.municipioOrigemId)} para ${rotuloDoMunicipio(
    processo.municipioDestinoId,
  )}`;
}

/**
 * Registro dos processos do catálogo. É a fila de regulação distribuída para o
 * servidor autenticado, e não o total do estado: o painel mede o estado
 * inteiro, a partir de `MOVIMENTO_DIARIO`.
 */
export const PROCESSOS: ProcessoDeTFD[] = [
  {
    protocolo: '2026/0481',
    paciente: 'Maria de Fátima Souza',
    cpf: '12345678901',
    cartaoSus: '898001234570016',
    nascimento: '12/09/1968',
    telefone: '98987650412',
    municipioOrigemId: 'imperatriz',
    unidadeOrigemId: 'hr-imperatriz',
    municipioDestinoId: 'sao-luis',
    unidadeDestinoId: 'hu-presidente-dutra',
    especialidadeId: 'cardiologia',
    medicoId: 'med-cardio',
    numeroDoLaudo: 'LM 2026/12874',
    dataDoLaudo: '2026-07-02',
    diarias: 6,
    dataViagem: '2026-07-21',
    competencia: '2026-07',
    acompanhante: 'José Ribeiro Souza (filho)',
    situacao: 'Em Análise',
    atualizadoEm: '2026-07-14T14:32:00',
    prazo: 'Parecer da regulação vence em 1 dia',
  },
  {
    protocolo: '2026/0482',
    paciente: 'João Batista Ferreira',
    cpf: '23456789012',
    cartaoSus: '702304118820045',
    nascimento: '04/02/1957',
    telefone: '99981340228',
    municipioOrigemId: 'balsas',
    unidadeOrigemId: 'um-balsas',
    municipioDestinoId: 'teresina',
    unidadeDestinoId: 'hospital-sao-marcos',
    especialidadeId: 'ortopedia',
    medicoId: 'med-orto',
    numeroDoLaudo: 'LM 2026/12903',
    dataDoLaudo: '2026-07-03',
    diarias: 4,
    dataViagem: '2026-07-22',
    competencia: '2026-07',
    situacao: 'Aprovado',
    atualizadoEm: '2026-07-13T10:18:00',
  },
  {
    protocolo: '2026/0483',
    paciente: 'Antônia Ribeiro Lima',
    cpf: '34567890123',
    cartaoSus: '708440102260078',
    nascimento: '27/11/1972',
    telefone: '99982770315',
    municipioOrigemId: 'caxias',
    unidadeOrigemId: 'hm-caxias',
    municipioDestinoId: 'fortaleza',
    unidadeDestinoId: 'hospital-do-coracao-ce',
    especialidadeId: 'cardiologia',
    medicoId: 'med-cardio',
    numeroDoLaudo: 'LM 2026/12918',
    dataDoLaudo: '2026-07-03',
    diarias: 10,
    dataViagem: '2026-07-23',
    competencia: '2026-07',
    acompanhante: 'Marlene Ribeiro Lima (irmã)',
    situacao: 'Enviado',
    atualizadoEm: '2026-07-12T16:02:00',
  },
  {
    protocolo: '2026/0484',
    paciente: 'Raimundo Nonato da Silva',
    cpf: '45678901234',
    cartaoSus: '700602339410102',
    nascimento: '15/06/1949',
    telefone: '99983460719',
    municipioOrigemId: 'codo',
    unidadeOrigemId: 'pol-codo',
    municipioDestinoId: 'sao-luis',
    unidadeDestinoId: 'cer-sao-luis',
    especialidadeId: 'oftalmologia',
    medicoId: 'med-oftalmo',
    numeroDoLaudo: 'LM 2026/12930',
    dataDoLaudo: '2026-07-04',
    diarias: 3,
    dataViagem: '2026-07-24',
    competencia: '2026-07',
    situacao: 'Devolvido',
    atualizadoEm: '2026-07-12T09:40:00',
    prazo: 'Documentação devolvida há 3 dias',
  },
  {
    protocolo: '2026/0485',
    paciente: 'Francisca Marques Andrade',
    cpf: '56789012345',
    cartaoSus: '706118004450231',
    nascimento: '30/03/1965',
    telefone: '98984120607',
    municipioOrigemId: 'acailandia',
    unidadeOrigemId: 'hr-acailandia',
    municipioDestinoId: 'imperatriz',
    unidadeDestinoId: 'hospital-macrorregional',
    especialidadeId: 'oncologia',
    medicoId: 'med-onco',
    numeroDoLaudo: 'LM 2026/12947',
    dataDoLaudo: '2026-07-05',
    diarias: 9,
    dataViagem: '2026-07-27',
    competencia: '2026-07',
    acompanhante: 'Damião Marques Andrade (filho)',
    situacao: 'Aprovado',
    atualizadoEm: '2026-07-11T14:55:00',
  },
  {
    protocolo: '2026/0486',
    paciente: 'José Carlos Mendes',
    cpf: '67890123456',
    cartaoSus: '709205551130384',
    nascimento: '08/08/1980',
    telefone: '99985030842',
    municipioOrigemId: 'bacabal',
    unidadeOrigemId: 'um-bacabal',
    municipioDestinoId: 'teresina',
    unidadeDestinoId: 'hospital-sao-marcos',
    especialidadeId: 'neurologia',
    medicoId: 'med-neuro',
    numeroDoLaudo: 'LM 2026/12958',
    dataDoLaudo: '2026-07-06',
    diarias: 3,
    dataViagem: '2026-07-28',
    competencia: '2026-07',
    situacao: 'Rascunho',
    atualizadoEm: '2026-07-14T08:11:00',
  },
  {
    protocolo: '2026/0487',
    paciente: 'Luzia Pereira dos Santos',
    cpf: '78901234567',
    cartaoSus: '704733208860415',
    nascimento: '19/01/1961',
    telefone: '99986240933',
    municipioOrigemId: 'timon',
    unidadeOrigemId: 'hm-timon',
    municipioDestinoId: 'sao-luis',
    unidadeDestinoId: 'hu-presidente-dutra',
    especialidadeId: 'cardiologia',
    medicoId: 'med-cardio',
    numeroDoLaudo: 'LM 2026/12966',
    dataDoLaudo: '2026-07-06',
    diarias: 5,
    dataViagem: '2026-07-29',
    competencia: '2026-07',
    situacao: 'Em Análise',
    atualizadoEm: '2026-07-14T11:27:00',
  },
  {
    protocolo: '2026/0488',
    paciente: 'Sebastião Alves Rocha',
    cpf: '89012345678',
    cartaoSus: '701840977720526',
    nascimento: '02/05/1953',
    telefone: '98987351044',
    municipioOrigemId: 'chapadinha',
    unidadeOrigemId: 'pol-chapadinha',
    municipioDestinoId: 'fortaleza',
    unidadeDestinoId: 'hospital-do-coracao-ce',
    especialidadeId: 'oncologia',
    medicoId: 'med-onco',
    numeroDoLaudo: 'LM 2026/12975',
    dataDoLaudo: '2026-07-07',
    diarias: 12,
    dataViagem: '2026-07-30',
    competencia: '2026-07',
    acompanhante: 'Vera Alves Rocha (esposa)',
    situacao: 'Cancelado',
    atualizadoEm: '2026-07-10T17:05:00',
  },
  {
    protocolo: '2026/0489',
    paciente: 'Terezinha Costa Barbosa',
    cpf: '90123456789',
    cartaoSus: '705366442290637',
    nascimento: '23/10/1958',
    telefone: '99988460155',
    municipioOrigemId: 'pinheiro',
    unidadeOrigemId: 'hr-pinheiro',
    municipioDestinoId: 'sao-luis',
    unidadeDestinoId: 'hospital-do-cancer',
    especialidadeId: 'oncologia',
    medicoId: 'med-onco',
    numeroDoLaudo: 'LM 2026/12984',
    dataDoLaudo: '2026-07-07',
    diarias: 7,
    dataViagem: '2026-07-31',
    competencia: '2026-07',
    situacao: 'Aprovado',
    atualizadoEm: '2026-07-10T13:22:00',
  },
  {
    protocolo: '2026/0490',
    paciente: 'Manoel Gomes de Oliveira',
    cpf: '01234567890',
    cartaoSus: '703977115560748',
    nascimento: '11/12/1946',
    telefone: '99989570266',
    municipioOrigemId: 'barra-do-corda',
    unidadeOrigemId: 'um-barra-do-corda',
    municipioDestinoId: 'sao-luis',
    unidadeDestinoId: 'cer-sao-luis',
    especialidadeId: 'oftalmologia',
    medicoId: 'med-oftalmo',
    numeroDoLaudo: 'LM 2026/12991',
    dataDoLaudo: '2026-07-08',
    diarias: 2,
    dataViagem: '2026-08-03',
    competencia: '2026-08',
    situacao: 'Enviado',
    atualizadoEm: '2026-07-09T15:48:00',
  },
  {
    protocolo: '2026/0491',
    paciente: 'Rita de Cássia Nascimento',
    cpf: '11223344556',
    cartaoSus: '707588663380859',
    nascimento: '05/07/1976',
    telefone: '98980680377',
    municipioOrigemId: 'santa-ines',
    unidadeOrigemId: 'hm-santa-ines',
    municipioDestinoId: 'teresina',
    unidadeDestinoId: 'hospital-sao-marcos',
    especialidadeId: 'ortopedia',
    medicoId: 'med-orto',
    numeroDoLaudo: 'LM 2026/13008',
    dataDoLaudo: '2026-07-08',
    diarias: 5,
    dataViagem: '2026-08-04',
    competencia: '2026-08',
    situacao: 'Em Análise',
    atualizadoEm: '2026-07-14T09:03:00',
  },
  {
    protocolo: '2026/0492',
    paciente: 'Domingos Sávio Teixeira',
    cpf: '22334455667',
    cartaoSus: '700199774470960',
    nascimento: '17/04/1969',
    telefone: '99981790488',
    municipioOrigemId: 'coroata',
    unidadeOrigemId: 'pol-coroata',
    municipioDestinoId: 'fortaleza',
    unidadeDestinoId: 'hospital-do-coracao-ce',
    especialidadeId: 'cardiologia',
    medicoId: 'med-cardio',
    numeroDoLaudo: 'LM 2026/13016',
    dataDoLaudo: '2026-07-09',
    diarias: 8,
    dataViagem: '2026-08-05',
    competencia: '2026-08',
    acompanhante: 'Cleonice Sávio Teixeira (esposa)',
    situacao: 'Devolvido',
    atualizadoEm: '2026-07-13T08:36:00',
    prazo: 'Documentação devolvida há 2 dias',
  },
  {
    protocolo: '2026/0493',
    paciente: 'Josefa Maria Cardoso',
    cpf: '33445566778',
    cartaoSus: '708600885581071',
    nascimento: '29/09/1963',
    telefone: '99982800599',
    municipioOrigemId: 'presidente-dutra',
    unidadeOrigemId: 'hr-presidente-dutra',
    municipioDestinoId: 'sao-luis',
    unidadeDestinoId: 'hu-presidente-dutra',
    especialidadeId: 'neurologia',
    medicoId: 'med-neuro',
    numeroDoLaudo: 'LM 2026/13024',
    dataDoLaudo: '2026-07-09',
    diarias: 2,
    dataViagem: '2026-08-06',
    competencia: '2026-08',
    situacao: 'Aprovado',
    atualizadoEm: '2026-07-12T11:14:00',
  },
  {
    protocolo: '2026/0494',
    paciente: 'Antônio Vieira de Castro',
    cpf: '44556677889',
    cartaoSus: '702711996690182',
    nascimento: '13/03/1951',
    telefone: '98983910600',
    municipioOrigemId: 'ze-doca',
    unidadeOrigemId: 'um-ze-doca',
    municipioDestinoId: 'imperatriz',
    unidadeDestinoId: 'hospital-macrorregional',
    especialidadeId: 'ortopedia',
    medicoId: 'med-orto',
    numeroDoLaudo: 'LM 2026/13033',
    dataDoLaudo: '2026-07-10',
    diarias: 10,
    dataViagem: '2026-08-07',
    competencia: '2026-08',
    situacao: 'Enviado',
    atualizadoEm: '2026-07-11T09:57:00',
  },
  {
    protocolo: '2026/0495',
    paciente: 'Marina Lopes Figueiredo',
    cpf: '55667788990',
    cartaoSus: '704822007710293',
    nascimento: '21/08/1974',
    telefone: '99984020711',
    municipioOrigemId: 'grajau',
    unidadeOrigemId: 'hm-grajau',
    municipioDestinoId: 'teresina',
    unidadeDestinoId: 'hospital-sao-marcos',
    especialidadeId: 'oftalmologia',
    medicoId: 'med-oftalmo',
    numeroDoLaudo: 'LM 2026/13041',
    dataDoLaudo: '2026-07-10',
    diarias: 4,
    dataViagem: '2026-08-10',
    competencia: '2026-08',
    situacao: 'Em Análise',
    atualizadoEm: '2026-07-14T15:41:00',
  },
  {
    protocolo: '2026/0496',
    paciente: 'Benedito Carvalho Pinto',
    cpf: '66778899001',
    cartaoSus: '706933118820304',
    nascimento: '06/01/1955',
    telefone: '99985130822',
    municipioOrigemId: 'viana',
    unidadeOrigemId: 'pol-viana',
    municipioDestinoId: 'sao-luis',
    unidadeDestinoId: 'hospital-do-cancer',
    especialidadeId: 'oncologia',
    medicoId: 'med-onco',
    numeroDoLaudo: 'LM 2026/13059',
    dataDoLaudo: '2026-07-11',
    diarias: 6,
    dataViagem: '2026-08-11',
    competencia: '2026-08',
    situacao: 'Aprovado',
    atualizadoEm: '2026-07-13T14:09:00',
  },
  {
    protocolo: '2026/0497',
    paciente: 'Cleide Fernandes Moreira',
    cpf: '77889900112',
    cartaoSus: '701044229930415',
    nascimento: '14/05/1970',
    telefone: '98986240933',
    municipioOrigemId: 'itapecuru-mirim',
    unidadeOrigemId: 'hr-itapecuru',
    municipioDestinoId: 'fortaleza',
    unidadeDestinoId: 'hospital-do-coracao-ce',
    especialidadeId: 'cardiologia',
    medicoId: 'med-cardio',
    numeroDoLaudo: 'LM 2026/13067',
    dataDoLaudo: '2026-07-11',
    diarias: 11,
    dataViagem: '2026-08-12',
    competencia: '2026-08',
    acompanhante: 'Silas Fernandes Moreira (irmão)',
    situacao: 'Rascunho',
    atualizadoEm: '2026-07-14T10:52:00',
  },
  {
    protocolo: '2026/0498',
    paciente: 'Geraldo Martins Bezerra',
    cpf: '88990011223',
    cartaoSus: '703155330040526',
    nascimento: '25/02/1948',
    telefone: '99987351044',
    municipioOrigemId: 'sao-joao-dos-patos',
    unidadeOrigemId: 'um-sao-joao-dos-patos',
    municipioDestinoId: 'imperatriz',
    unidadeDestinoId: 'hospital-macrorregional',
    especialidadeId: 'neurologia',
    medicoId: 'med-neuro',
    numeroDoLaudo: 'LM 2026/13075',
    dataDoLaudo: '2026-07-12',
    diarias: 3,
    dataViagem: '2026-08-13',
    competencia: '2026-08',
    situacao: 'Cancelado',
    atualizadoEm: '2026-07-12T16:33:00',
  },
  {
    protocolo: '2026/0499',
    paciente: 'Vanda Lúcia Cavalcante',
    cpf: '99001122334',
    cartaoSus: '705266441150637',
    nascimento: '09/06/1967',
    telefone: '98988460155',
    municipioOrigemId: 'rosario',
    unidadeOrigemId: 'hm-rosario',
    municipioDestinoId: 'sao-luis',
    unidadeDestinoId: 'hu-presidente-dutra',
    especialidadeId: 'ortopedia',
    medicoId: 'med-orto',
    numeroDoLaudo: 'LM 2026/13084',
    dataDoLaudo: '2026-07-12',
    diarias: 7,
    dataViagem: '2026-08-14',
    competencia: '2026-08',
    situacao: 'Aguardando Assinatura',
    atualizadoEm: '2026-07-14T16:20:00',
    prazo: 'Autorização aguarda assinatura da coordenação',
  },
  {
    protocolo: '2026/0500',
    paciente: 'Pedro Henrique Aguiar',
    cpf: '10112233445',
    cartaoSus: '707377552260748',
    nascimento: '31/07/1984',
    telefone: '99989570266',
    municipioOrigemId: 'buriticupu',
    unidadeOrigemId: 'pol-buriticupu',
    municipioDestinoId: 'teresina',
    unidadeDestinoId: 'hospital-sao-marcos',
    especialidadeId: 'oftalmologia',
    medicoId: 'med-oftalmo',
    numeroDoLaudo: 'LM 2026/13092',
    dataDoLaudo: '2026-07-13',
    diarias: 4,
    dataViagem: '2026-08-17',
    competencia: '2026-08',
    situacao: 'Em Análise',
    atualizadoEm: '2026-07-14T13:38:00',
  },
  {
    protocolo: '2026/0501',
    paciente: 'Ana Cláudia Moura',
    cpf: '20223344556',
    cartaoSus: '709488663370859',
    nascimento: '18/11/1979',
    telefone: '98980680377',
    municipioOrigemId: 'santa-luzia',
    unidadeOrigemId: 'hr-santa-luzia',
    municipioDestinoId: 'sao-paulo',
    unidadeDestinoId: 'instituto-do-coracao',
    especialidadeId: 'cardiologia',
    medicoId: 'med-cardio',
    numeroDoLaudo: 'LM 2026/13106',
    dataDoLaudo: '2026-07-13',
    diarias: 9,
    dataViagem: '2026-08-18',
    competencia: '2026-08',
    acompanhante: 'Rubens Moura Fontes (marido)',
    situacao: 'Aprovado',
    atualizadoEm: '2026-07-13T17:12:00',
  },
  {
    protocolo: '2026/0502',
    paciente: 'Everaldo Sousa Braga',
    cpf: '30334455667',
    cartaoSus: '700599774480960',
    nascimento: '26/09/1962',
    telefone: '99981790488',
    municipioOrigemId: 'tutoia',
    unidadeOrigemId: 'um-tutoia',
    municipioDestinoId: 'sao-luis',
    unidadeDestinoId: 'cer-sao-luis',
    especialidadeId: 'neurologia',
    medicoId: 'med-neuro',
    numeroDoLaudo: 'LM 2026/13114',
    dataDoLaudo: '2026-07-14',
    diarias: 3,
    dataViagem: '2026-08-19',
    competencia: '2026-08',
    situacao: 'Devolvido',
    atualizadoEm: '2026-07-14T08:47:00',
  },
  {
    protocolo: '2026/0503',
    paciente: 'Sandra Regina Duarte',
    cpf: '40445566778',
    cartaoSus: '702600886671071',
    nascimento: '07/03/1971',
    telefone: '99982800599',
    municipioOrigemId: 'carolina',
    unidadeOrigemId: 'hm-carolina',
    municipioDestinoId: 'imperatriz',
    unidadeDestinoId: 'hospital-macrorregional',
    especialidadeId: 'oncologia',
    medicoId: 'med-onco',
    numeroDoLaudo: 'LM 2026/13123',
    dataDoLaudo: '2026-07-14',
    diarias: 8,
    dataViagem: '2026-08-20',
    competencia: '2026-08',
    situacao: 'Aguardando Assinatura',
    atualizadoEm: '2026-07-15T09:05:00',
    prazo: 'Passagem a emitir até quinta-feira',
  },
  {
    protocolo: '2026/0504',
    paciente: 'Wellington Farias Nunes',
    cpf: '50556677889',
    cartaoSus: '704711997780182',
    nascimento: '12/12/1988',
    telefone: '98983910600',
    municipioOrigemId: 'pedreiras',
    unidadeOrigemId: 'pol-pedreiras',
    municipioDestinoId: 'teresina',
    unidadeDestinoId: 'hospital-sao-marcos',
    especialidadeId: 'ortopedia',
    medicoId: 'med-orto',
    numeroDoLaudo: 'LM 2026/13131',
    dataDoLaudo: '2026-07-15',
    diarias: 5,
    dataViagem: '2026-08-21',
    competencia: '2026-08',
    situacao: 'Em Análise',
    atualizadoEm: '2026-07-15T11:49:00',
  },
];

export function processo(protocolo: string): ProcessoDeTFD {
  const encontrado = PROCESSOS.find((item) => item.protocolo === protocolo);
  if (!encontrado) throw new Error(`Processo fora do catálogo: ${protocolo}`);
  return encontrado;
}

/** Processo em destaque do catálogo, aberto pelo detalhe e pelo cidadão. */
export const PROCESSO_EM_DESTAQUE = processo('2026/0481');

/** Competências presentes no registro, para o filtro da listagem. */
export const COMPETENCIAS = Array.from(
  new Set(PROCESSOS.map((item) => item.competencia)),
)
  .sort()
  .map((competencia) => ({ value: competencia, label: rotuloDaCompetencia(competencia) }));

/* ------------------------------------------------------------------ */
/* 9 · Movimento diário e agregados do painel                          */
/* ------------------------------------------------------------------ */

/**
 * O painel mede o estado inteiro, e mede sobre registro. Cada dia útil do
 * período tem um lançamento com a quantidade recebida, a partição por
 * situação, a partição das autorizações por destino e por especialidade, e o
 * empenho por situação do lançamento.
 *
 * Como todo indicador da tela é uma redução sobre esta lista, dois números da
 * mesma grandeza não podem divergir: o KPI de recebidos é a soma das fatias da
 * rosca, o de viagens autorizadas é a soma das barras por município e a soma
 * das faixas por especialidade, e o de ajuda de custo é a soma das faixas de
 * empenho. A conferência deixa de ser manual e passa a ser estrutural.
 */
export interface MovimentoDoDia {
  data: string;
  recebidos: number;
  porSituacao: Record<SituacaoDoProcesso, number>;
  porDestino: Record<string, number>;
  porEspecialidade: Record<string, number>;
  empenho: Record<string, number>;
}

/** Gerador congruencial com semente fixa: varia sem deixar de ser reprodutível. */
function sequencia(semente: number) {
  let estado = semente >>> 0;
  return () => {
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}

/**
 * Reparte `total` segundo `pesos` devolvendo inteiros que somam exatamente
 * `total`, pelo método dos maiores restos. É o que garante que a partição
 * nunca perca nem invente uma unidade.
 */
function repartir(total: number, pesos: number[]): number[] {
  const somaDosPesos = pesos.reduce((soma, peso) => soma + peso, 0);
  if (total === 0 || somaDosPesos === 0) return pesos.map(() => 0);

  const brutos = pesos.map((peso) => (total * peso) / somaDosPesos);
  const partes = brutos.map((valor) => Math.floor(valor));
  let resto = total - partes.reduce((soma, parte) => soma + parte, 0);

  const porFracao = brutos
    .map((valor, indice) => ({ indice, fracao: valor - Math.floor(valor) }))
    .sort((a, b) => b.fracao - a.fracao || a.indice - b.indice);

  for (let passo = 0; resto > 0; passo += 1, resto -= 1) {
    partes[porFracao[passo % porFracao.length].indice] += 1;
  }
  return partes;
}

function diasEntre(inicioISO: string, fimISO: string): string[] {
  const dias: string[] = [];
  const corrente = new Date(`${inicioISO}T00:00:00Z`);
  const fim = new Date(`${fimISO}T00:00:00Z`);
  while (corrente.getTime() <= fim.getTime()) {
    dias.push(corrente.toISOString().slice(0, 10));
    corrente.setUTCDate(corrente.getUTCDate() + 1);
  }
  return dias;
}

const PRIMEIRO_DIA = '2026-02-01';
const ULTIMO_DIA = '2026-07-31';

const PESOS_DE_SITUACAO: Record<SituacaoDoProcesso, number> = {
  Rascunho: 0,
  Enviado: 0,
  Aprovado: 62,
  'Em Análise': 17,
  'Aguardando Assinatura': 9,
  Devolvido: 8,
  Cancelado: 4,
};

const PESOS_DE_DESTINO: Record<string, number> = {
  'sao-luis': 39,
  imperatriz: 22,
  teresina: 15,
  fortaleza: 13,
  'sao-paulo': 11,
};

const PESOS_DE_ESPECIALIDADE: Record<string, number> = {
  cardiologia: 30,
  oncologia: 24,
  oftalmologia: 19,
  ortopedia: 16,
  neurologia: 11,
};

/** Situação do lançamento orçamentário da ajuda de custo. */
export const SITUACOES_DE_EMPENHO = ['Pago', 'Empenhado', 'Em conferência'];
const PESOS_DE_EMPENHO = [55, 30, 15];

/** Custo médio de ajuda de custo por viagem autorizada, em reais. */
const CUSTO_MEDIO_POR_VIAGEM = 840;

function construirMovimento(): MovimentoDoDia[] {
  const sorteio = sequencia(20260715);

  return diasEntre(PRIMEIRO_DIA, ULTIMO_DIA).map((data, indice) => {
    const diaDaSemana = new Date(`${data}T00:00:00Z`).getUTCDay();
    const fimDeSemana = diaDaSemana === 0 || diaDaSemana === 6;

    // Volume cresce devagar ao longo do semestre, e cai no fim de semana.
    const base = fimDeSemana ? 5 : 19 + indice * 0.035;
    const recebidos = Math.max(1, Math.round(base * (0.82 + sorteio() * 0.36)));

    const situacoes = SITUACOES_MEDIDAS;
    const partesDeSituacao = repartir(
      recebidos,
      situacoes.map((id) => PESOS_DE_SITUACAO[id] * (0.8 + sorteio() * 0.4)),
    );
    const porSituacao = {
      Rascunho: 0,
      Enviado: 0,
      'Em Análise': 0,
      'Aguardando Assinatura': 0,
      Aprovado: 0,
      Devolvido: 0,
      Cancelado: 0,
    } as Record<SituacaoDoProcesso, number>;
    situacoes.forEach((id, posicao) => {
      porSituacao[id] = partesDeSituacao[posicao];
    });

    const autorizados = porSituacao.Aprovado;

    const destinos = MUNICIPIOS_DE_DESTINO.map((item) => item.id);
    const partesDeDestino = repartir(
      autorizados,
      destinos.map((id) => PESOS_DE_DESTINO[id] * (0.8 + sorteio() * 0.4)),
    );
    const porDestino: Record<string, number> = {};
    destinos.forEach((id, posicao) => {
      porDestino[id] = partesDeDestino[posicao];
    });

    const especialidades = ESPECIALIDADES.map((item) => item.id);
    const partesDeEspecialidade = repartir(
      autorizados,
      especialidades.map((id) => PESOS_DE_ESPECIALIDADE[id] * (0.8 + sorteio() * 0.4)),
    );
    const porEspecialidade: Record<string, number> = {};
    especialidades.forEach((id, posicao) => {
      porEspecialidade[id] = partesDeEspecialidade[posicao];
    });

    const empenhoDoDia = Math.round(autorizados * CUSTO_MEDIO_POR_VIAGEM * (0.85 + sorteio() * 0.3));
    const partesDeEmpenho = repartir(
      empenhoDoDia,
      PESOS_DE_EMPENHO.map((peso) => peso * (0.75 + sorteio() * 0.5)),
    );
    const empenho: Record<string, number> = {};
    SITUACOES_DE_EMPENHO.forEach((rotulo, posicao) => {
      empenho[rotulo] = partesDeEmpenho[posicao];
    });

    return { data, recebidos, porSituacao, porDestino, porEspecialidade, empenho };
  });
}

export const MOVIMENTO_DIARIO: MovimentoDoDia[] = construirMovimento();

export type PeriodoId = 'semana' | 'mes' | 'trimestre';

export interface DefinicaoDePeriodo {
  id: PeriodoId;
  label: string;
  /** Intervalo por extenso, anunciado quando o filtro muda. */
  intervalo: string;
  comparadoA: string;
  inicio: string;
  fim: string;
  /** Mesmo tamanho de janela, imediatamente antes, para a variação. */
  inicioAnterior: string;
  fimAnterior: string;
  /** Granularidade do gráfico de fluxo e do sparkline. */
  granularidade: 'dia' | 'semana' | 'mes';
}

export const PERIODOS: DefinicaoDePeriodo[] = [
  {
    id: 'semana',
    label: 'Semana',
    intervalo: '13 a 19 de julho de 2026',
    comparadoA: 'semana anterior',
    inicio: '2026-07-13',
    fim: '2026-07-19',
    inicioAnterior: '2026-07-06',
    fimAnterior: '2026-07-12',
    granularidade: 'dia',
  },
  {
    id: 'mes',
    label: 'Mês',
    intervalo: 'Julho de 2026',
    comparadoA: 'junho de 2026',
    inicio: '2026-07-01',
    fim: '2026-07-31',
    inicioAnterior: '2026-06-01',
    fimAnterior: '2026-06-30',
    granularidade: 'semana',
  },
  {
    id: 'trimestre',
    label: 'Trimestre',
    intervalo: 'Maio a julho de 2026',
    comparadoA: 'trimestre anterior',
    inicio: '2026-05-01',
    fim: '2026-07-31',
    inicioAnterior: '2026-02-01',
    fimAnterior: '2026-04-30',
    granularidade: 'mes',
  },
];

export function definicaoDoPeriodo(id: PeriodoId): DefinicaoDePeriodo {
  return PERIODOS.find((item) => item.id === id) ?? PERIODOS[1];
}

function movimentoEntre(inicio: string, fim: string): MovimentoDoDia[] {
  return MOVIMENTO_DIARIO.filter((dia) => dia.data >= inicio && dia.data <= fim);
}

function somar(dias: MovimentoDoDia[], leitura: (dia: MovimentoDoDia) => number): number {
  return dias.reduce((total, dia) => total + leitura(dia), 0);
}

function somarMapa(
  dias: MovimentoDoDia[],
  leitura: (dia: MovimentoDoDia) => Record<string, number>,
  chaves: string[],
): number[] {
  return chaves.map((chave) => somar(dias, (dia) => leitura(dia)[chave] ?? 0));
}

/** Agrupa os dias em blocos de acordo com a granularidade do período. */
function agrupar(
  dias: MovimentoDoDia[],
  granularidade: DefinicaoDePeriodo['granularidade'],
): { rotulo: string; dias: MovimentoDoDia[] }[] {
  if (granularidade === 'dia') {
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return dias.map((dia) => ({
      rotulo: nomes[new Date(`${dia.data}T00:00:00Z`).getUTCDay()],
      dias: [dia],
    }));
  }

  if (granularidade === 'mes') {
    const blocos = new Map<string, MovimentoDoDia[]>();
    dias.forEach((dia) => {
      const chave = dia.data.slice(0, 7);
      blocos.set(chave, [...(blocos.get(chave) ?? []), dia]);
    });
    return [...blocos.entries()].map(([chave, doBloco]) => {
      const nome = MESES[Number(chave.slice(5)) - 1];
      return { rotulo: `${nome[0].toUpperCase()}${nome.slice(1)}`, dias: doBloco };
    });
  }

  const blocos: MovimentoDoDia[][] = [];
  dias.forEach((dia, indice) => {
    const bloco = Math.floor(indice / 7);
    blocos[bloco] = [...(blocos[bloco] ?? []), dia];
  });
  return blocos.map((doBloco, indice) => ({ rotulo: `Semana ${indice + 1}`, dias: doBloco }));
}

export interface AgregadoDoPainel {
  intervalo: string;
  comparadoA: string;
  recebidos: number;
  emAnalise: number;
  autorizados: number;
  empenhado: number;
  /** Variação percentual sobre a janela anterior, já calculada. */
  variacao: Record<'recebidos' | 'emAnalise' | 'autorizados' | 'empenhado', number>;
  tendencia: Record<'recebidos' | 'emAnalise' | 'autorizados' | 'empenhado', number[]>;
  fluxo: { categorias: string[]; series: Serie[] };
  porSituacao: { rotulo: string; valor: number }[];
  porDestino: { categorias: string[]; series: Serie[] };
  porEspecialidade: { rotulo: string; valor: number }[];
  empenhoPorSituacao: { rotulo: string; valor: number }[];
}

function variacao(atual: number, anterior: number): number {
  if (anterior === 0) return 0;
  return Number((((atual - anterior) / anterior) * 100).toFixed(1));
}

/**
 * Monta o painel inteiro de um período a partir do movimento diário. Nenhum
 * número desta função é digitado: todos são somas sobre os mesmos registros.
 */
export function agregarPainel(id: PeriodoId): AgregadoDoPainel {
  const periodo = definicaoDoPeriodo(id);
  const dias = movimentoEntre(periodo.inicio, periodo.fim);
  const anteriores = movimentoEntre(periodo.inicioAnterior, periodo.fimAnterior);

  const recebidos = somar(dias, (dia) => dia.recebidos);
  const emAnalise = somar(dias, (dia) => dia.porSituacao['Em Análise']);
  const autorizados = somar(dias, (dia) => dia.porSituacao.Aprovado);
  const empenhado = somar(dias, (dia) =>
    SITUACOES_DE_EMPENHO.reduce((total, rotulo) => total + dia.empenho[rotulo], 0),
  );

  const blocos = agrupar(dias, periodo.granularidade);
  const porBloco = (leitura: (dia: MovimentoDoDia) => number) =>
    blocos.map((bloco) => somar(bloco.dias, leitura));

  const destinos = MUNICIPIOS_DE_DESTINO.map((item) => item.id);
  const especialidades = ESPECIALIDADES.map((item) => item.id);

  return {
    intervalo: periodo.intervalo,
    comparadoA: periodo.comparadoA,
    recebidos,
    emAnalise,
    autorizados,
    empenhado,
    variacao: {
      recebidos: variacao(recebidos, somar(anteriores, (dia) => dia.recebidos)),
      emAnalise: variacao(emAnalise, somar(anteriores, (dia) => dia.porSituacao['Em Análise'])),
      autorizados: variacao(autorizados, somar(anteriores, (dia) => dia.porSituacao.Aprovado)),
      empenhado: variacao(
        empenhado,
        somar(anteriores, (dia) =>
          SITUACOES_DE_EMPENHO.reduce((total, rotulo) => total + dia.empenho[rotulo], 0),
        ),
      ),
    },
    tendencia: {
      recebidos: porBloco((dia) => dia.recebidos),
      emAnalise: porBloco((dia) => dia.porSituacao['Em Análise']),
      autorizados: porBloco((dia) => dia.porSituacao.Aprovado),
      empenhado: porBloco((dia) =>
        SITUACOES_DE_EMPENHO.reduce((total, rotulo) => total + dia.empenho[rotulo], 0),
      ),
    },
    fluxo: {
      categorias: blocos.map((bloco) => bloco.rotulo),
      series: [
        { rotulo: 'Recebidos', valores: porBloco((dia) => dia.recebidos) },
        { rotulo: 'Autorizados', valores: porBloco((dia) => dia.porSituacao.Aprovado) },
      ],
    },
    porSituacao: SITUACOES_MEDIDAS.map((rotulo) => ({
      rotulo,
      valor: somar(dias, (dia) => dia.porSituacao[rotulo]),
    })),
    porDestino: {
      categorias: destinos.map((destino) => rotuloDoMunicipio(destino)),
      series: [
        {
          rotulo: 'Viagens autorizadas',
          valores: somarMapa(dias, (dia) => dia.porDestino, destinos),
        },
      ],
    },
    porEspecialidade: especialidades.map((id, posicao) => ({
      rotulo: especialidade(id).nome,
      valor: somarMapa(dias, (dia) => dia.porEspecialidade, especialidades)[posicao],
    })),
    empenhoPorSituacao: SITUACOES_DE_EMPENHO.map((rotulo) => ({
      rotulo,
      valor: somar(dias, (dia) => dia.empenho[rotulo]),
    })),
  };
}

/** Processos que o painel mostra na fila de atenção, lidos do registro. */
export const PROCESSOS_COM_PRAZO = PROCESSOS.filter((item) => Boolean(item.prazo));

/**
 * Dados fictícios do cadastro de servidor.
 *
 * Determinístico de ponta a ponta: nenhuma data ou identificador é gerado em
 * tempo de execução, para o snapshot visual não oscilar entre execuções.
 * Nenhum dado pessoal real: os nomes e as matrículas são os do catálogo.
 */

import type { SelectOption } from '../../src';

/** Data de referência do catálogo: 18 de agosto de 2026. */
export const HOJE = new Date(2026, 7, 18);

export const SECRETARIAS: SelectOption[] = [
  { value: 'ses', label: 'Secretaria de Estado da Saúde' },
  { value: 'seduc', label: 'Secretaria de Estado da Educação' },
  { value: 'sead', label: 'Secretaria de Estado da Administração' },
  { value: 'semad', label: 'Secretaria Municipal de Administração' },
];

export const LOTACOES: SelectOption[] = [
  { value: 'tfd', label: 'Coordenação de TFD' },
  { value: 'regulacao', label: 'Núcleo de Regulação Ambulatorial' },
  { value: 'rh', label: 'Gerência de Recursos Humanos' },
  { value: 'almoxarifado', label: 'Almoxarifado Central' },
];

export const CARGOS: SelectOption[] = [
  { value: 'assistente', label: 'Assistente administrativo' },
  { value: 'analista', label: 'Analista de gestão pública' },
  { value: 'enfermeiro', label: 'Enfermeiro' },
  { value: 'medico', label: 'Médico regulador' },
];

export const SITUACOES: SelectOption[] = [
  { value: 'ativo', label: 'Ativo' },
  { value: 'cedido', label: 'Cedido' },
  { value: 'licenca', label: 'Em licença' },
];

export const UFS: SelectOption[] = [
  { value: 'ma', label: 'MA' },
  { value: 'pi', label: 'PI' },
  { value: 'rj', label: 'RJ' },
  { value: 'to', label: 'TO' },
];

export const REGIMES = [
  { value: 'efetivo', label: 'Efetivo' },
  { value: 'comissionado', label: 'Comissionado' },
  { value: 'temporario', label: 'Contrato temporário' },
];

export interface ValoresDoServidor {
  nome: string;
  matricula: string;
  cpf: string;
  secretaria: string;
  lotacao: string;
  cargo: string;
  situacao: string;
  regime: string;
  email: string;
  telefone: string;
  cep: string;
  logradouro: string;
  numero: string;
  uf: string;
  observacoes: string;
}

export const SERVIDOR_VAZIO: ValoresDoServidor = {
  nome: '',
  matricula: '',
  cpf: '',
  secretaria: '',
  lotacao: '',
  cargo: '',
  situacao: '',
  regime: '',
  email: '',
  telefone: '',
  cep: '',
  logradouro: '',
  numero: '',
  uf: '',
  observacoes: '',
};

/** Registro já existente, usado no estado de edição. CPF mascarado. */
export const SERVIDOR_EXISTENTE: ValoresDoServidor = {
  nome: 'Maria de Fátima Souza',
  matricula: '00481297',
  cpf: '***.481.297-**',
  secretaria: 'ses',
  lotacao: 'tfd',
  cargo: 'analista',
  situacao: 'ativo',
  regime: 'efetivo',
  email: 'maria.souza@ses.ma.gov.br',
  telefone: '(98) 3212-0481',
  cep: '65020-070',
  logradouro: 'Avenida dos Holandeses',
  numero: '481',
  uf: 'ma',
  observacoes: 'Servidora designada para a Coordenação de TFD pela Portaria 2025/0481.',
};

/** Conteúdo longo: nome extenso, lotação com nome comprido, observação grande. */
export const SERVIDOR_CONTEUDO_LONGO: ValoresDoServidor = {
  ...SERVIDOR_EXISTENTE,
  nome: 'Maria de Fátima Souza Albuquerque Nascimento de Carvalho Filha',
  logradouro:
    'Avenida Presidente Juscelino Kubitschek de Oliveira, Conjunto Habitacional Vinhais Velho',
  observacoes:
    'Servidora designada para a Coordenação de TFD pela Portaria 2025/0481, publicada no Diário Oficial de 12 de agosto de 2026, com acúmulo temporário da função de apoio ao Núcleo de Regulação Ambulatorial enquanto durar a licença da titular, conforme despacho da Gerência de Recursos Humanos registrado no processo 2025/0481.',
};

export const AUDITORIA_DO_SERVIDOR = {
  criadoPor: 'Laryssa Ferreira',
  criadoEm: '12/08/2026 às 14:32',
  alteradoPor: 'Dr. Carlos Andrade',
  alteradoEm: '15/08/2026 às 09:07',
};

export const TRILHA_DO_CADASTRO = [
  { rotulo: 'Pessoas', href: '#pessoas' },
  { rotulo: 'Servidores', href: '#servidores' },
  { rotulo: 'Novo servidor' },
];

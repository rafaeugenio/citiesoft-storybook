import { useMemo, useState } from 'react';
import {
  RiAddLine,
  RiDeleteBin6Line,
  RiDownload2Line,
  RiEditLine,
  RiEyeLine,
  RiSendPlaneLine,
} from '@remixicon/react';
import { Chip } from '@/components/base/badges/chip';
import { Button } from '@/components/base/buttons/button';
import { DataListing } from '@/components/application/data-listing/data-listing';
import type {
  DataListingColumn,
  DataListingDensity,
  DataListingRowAction,
  DataListingSort,
  DataListingState,
} from '@/components/application/data-listing/data-listing';
import { FilterBar, emptyFilterBarValue } from '@/components/application/filter-bar/filter-bar';
import type {
  FilterBarField,
  FilterBarFilter,
  FilterBarValue,
} from '@/components/application/filter-bar/filter-bar';
import { PageHeader } from '@/components/application/page-header/page-header';
import { SelectionBar } from '@/components/application/selection-bar/selection-bar';
import {
  DESTINOS_LISTAGEM,
  ESPECIALIDADES_LISTAGEM,
  ORIGENS_LISTAGEM,
  SOLICITACOES_LISTAGEM,
  STATUS_SOLICITACAO,
  formatarDataBR,
} from '../../.storybook/fixtures/listagem-solicitacoes';
import type { SolicitacaoListagem, StatusSolicitacao } from '../../.storybook/fixtures/listagem-solicitacoes';

/* Apoio das stories de listagem: dados locais e composição de ponta a ponta. */

const COR_STATUS: Record<StatusSolicitacao, 'cyan' | 'yellow' | 'lime' | 'blue' | 'gray' | 'rose'> = {
  'Em análise': 'cyan',
  'Aguardando documentos': 'yellow',
  Aprovada: 'lime',
  Agendada: 'blue',
  Concluída: 'gray',
  Negada: 'rose',
};

export const COLUNAS_SOLICITACAO: DataListingColumn<SolicitacaoListagem>[] = [
  { id: 'protocolo', header: 'Protocolo', isIdentifier: true, sortable: true, cell: (r) => r.protocolo, width: 'w-[170px]' },
  {
    id: 'paciente',
    header: 'Paciente',
    sortable: true,
    width: 'w-[220px]',
    cell: (r) => (
      <div className="flex min-w-0 flex-col">
        <span className="truncate text-body-medium text-text-primary">{r.paciente}</span>
        <span className="text-caption-1-regular text-text-secondary">CPF {r.cpf}</span>
      </div>
    ),
  },
  { id: 'especialidade', header: 'Especialidade', sortable: true, cell: (r) => r.especialidade, width: 'w-[150px]' },
  { id: 'trajeto', header: 'Trajeto', cell: (r) => `${r.origem} para ${r.destino}`, width: 'w-[210px]' },
  {
    id: 'dataConsulta',
    header: 'Consulta',
    sortable: true,
    cell: (r) => formatarDataBR(r.dataConsulta),
    width: 'w-[120px]',
  },
  {
    id: 'status',
    header: 'Situação',
    cell: (r) => (
      <Chip variant="caption" color={COR_STATUS[r.status]}>
        {r.status}
      </Chip>
    ),
    width: 'w-[190px]',
  },
];

export function acoesDaLinha(quantidade: 2 | 3): DataListingRowAction<SolicitacaoListagem>[] {
  const todas: DataListingRowAction<SolicitacaoListagem>[] = [
    { id: 'ver', label: 'Ver detalhes', icon: RiEyeLine, onAction: () => {} },
    { id: 'editar', label: 'Editar', icon: RiEditLine, onAction: () => {} },
    { id: 'cancelar', label: 'Cancelar solicitação', icon: RiDeleteBin6Line, tone: 'danger', onAction: () => {} },
  ];
  return todas.slice(0, quantidade);
}

export const FILTROS_SOLICITACAO: FilterBarFilter[] = [
  {
    id: 'status',
    label: 'Situação',
    options: STATUS_SOLICITACAO.map((s) => ({ value: s, label: s })),
  },
  {
    id: 'especialidade',
    label: 'Especialidade',
    multiple: true,
    options: ESPECIALIDADES_LISTAGEM.map((s) => ({ value: s, label: s })),
  },
  {
    id: 'destino',
    label: 'Destino',
    multiple: true,
    options: DESTINOS_LISTAGEM.map((s) => ({ value: s, label: s })),
  },
];

export const CAMPOS_CONDICAO: FilterBarField[] = [
  { id: 'paciente', label: 'Paciente' },
  { id: 'origem', label: 'Origem', options: ORIGENS_LISTAGEM.map((s) => ({ value: s, label: s })) },
  { id: 'especialidade', label: 'Especialidade', options: ESPECIALIDADES_LISTAGEM.map((s) => ({ value: s, label: s })) },
  { id: 'status', label: 'Situação', options: STATUS_SOLICITACAO.map((s) => ({ value: s, label: s })) },
];

export const ENTIDADE = { singular: 'solicitação', plural: 'solicitações' };

export function filtrarSolicitacoes(dados: SolicitacaoListagem[], v: FilterBarValue): SolicitacaoListagem[] {
  const busca = v.search.trim().toLowerCase();
  return dados.filter((linha) => {
    if (busca && !`${linha.paciente} ${linha.protocolo}`.toLowerCase().includes(busca)) return false;
    for (const [id, valores] of Object.entries(v.selections)) {
      if (valores.length === 0) continue;
      const atual = String(linha[id as keyof SolicitacaoListagem]);
      if (!valores.includes(atual)) return false;
    }
    for (const c of v.conditions) {
      const atual = String(linha[c.fieldId as keyof SolicitacaoListagem] ?? '').toLowerCase();
      const alvo = c.value.toLowerCase();
      if (c.operatorId === 'igual' && atual !== alvo) return false;
      if (c.operatorId === 'diferente' && atual === alvo) return false;
      if (c.operatorId === 'contem' && !atual.includes(alvo)) return false;
    }
    return true;
  });
}

export function ordenarSolicitacoes(dados: SolicitacaoListagem[], sort: DataListingSort | null): SolicitacaoListagem[] {
  if (!sort) return dados;
  const chave = sort.column as keyof SolicitacaoListagem;
  const fator = sort.direction === 'ascending' ? 1 : -1;
  return [...dados].sort((a, b) => String(a[chave]).localeCompare(String(b[chave]), 'pt-BR') * fator);
}

export interface ListagemTFDProps {
  /** Força um estado, para documentar carregando, vazio e erro. */
  forcarEstado?: DataListingState;
  selecionavel?: boolean;
  densidadeInicial?: DataListingDensity;
  acoesPorLinha?: 2 | 3;
  porPagina?: number;
  comCondicoes?: boolean;
  posicaoSelecao?: 'viewport' | 'container';
  buscaInicial?: string;
}

/** Tela de listagem completa com dados locais: cabeçalho, filtros, tabela e barra de seleção. */
export function ListagemTFD({
  forcarEstado,
  selecionavel = true,
  densidadeInicial = 'confortavel',
  acoesPorLinha = 3,
  porPagina = 10,
  comCondicoes = true,
  posicaoSelecao = 'viewport',
  buscaInicial = '',
}: ListagemTFDProps) {
  const [dados, setDados] = useState(SOLICITACOES_LISTAGEM);
  const [filtro, setFiltro] = useState<FilterBarValue>({ ...emptyFilterBarValue, search: buscaInicial });
  const [sort, setSort] = useState<DataListingSort | null>({ column: 'protocolo', direction: 'ascending' });
  const [pagina, setPagina] = useState(1);
  const [tamanho, setTamanho] = useState(porPagina);
  const [densidade, setDensidade] = useState(densidadeInicial);
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());
  const [tentativas, setTentativas] = useState(0);

  const filtrados = useMemo(() => ordenarSolicitacoes(filtrarSolicitacoes(dados, filtro), sort), [dados, filtro, sort]);
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / tamanho));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const fatia = filtrados.slice((paginaAtual - 1) * tamanho, paginaAtual * tamanho);
  const filtrando = filtro.search.trim() !== '' || filtro.conditions.length > 0 || Object.keys(filtro.selections).length > 0;

  let estado: DataListingState = 'pronto';
  if (forcarEstado && !(forcarEstado === 'erro' && tentativas > 0)) estado = forcarEstado;
  else if (dados.length === 0) estado = 'vazio';
  else if (filtrados.length === 0 && filtrando) estado = 'vazio-filtro';

  const aplicar = (proximo: FilterBarValue) => {
    setFiltro(proximo);
    setPagina(1);
  };

  return (
    <div className="flex w-full flex-col gap-4 bg-background-full p-3 sm:p-4">
      <PageHeader
        breadcrumbs={[
          { label: 'Início', href: '#' },
          { label: 'Regulação', href: '#' },
          { label: 'Solicitações de TFD' },
        ]}
        title="Solicitações de TFD"
        description="Pedidos de tratamento fora do domicílio dos pacientes do município."
        meta={[
          { label: 'Atualizado em', value: '21/10/2026' },
          { label: 'Total', value: `${dados.length} solicitações` },
        ]}
        primaryAction={{ label: 'Nova solicitação', icon: RiAddLine, onClick: () => {} }}
        secondaryActions={[{ label: 'Exportar', icon: RiDownload2Line, onClick: () => {} }]}
      />
      <FilterBar
        value={filtro}
        onChange={aplicar}
        filters={FILTROS_SOLICITACAO}
        conditionFields={comCondicoes ? CAMPOS_CONDICAO : undefined}
        searchPlaceholder="Buscar por paciente ou protocolo"
        searchLabel="Buscar solicitações"
        resultCount={filtrados.length}
        resultNoun={ENTIDADE}
      />
      <DataListing
        label="Solicitações de TFD"
        entity={ENTIDADE}
        data={fatia}
        columns={COLUNAS_SOLICITACAO}
        getRowId={(r) => r.id}
        getRowLabel={(r) => r.protocolo}
        getRowHref={(r) => `#/solicitacoes/${r.id}`}
        state={estado}
        density={densidade}
        onDensityChange={setDensidade}
        selectable={selecionavel}
        selectedKeys={selecionados}
        onSelectedKeysChange={setSelecionados}
        sort={sort}
        onSortChange={setSort}
        rowActions={acoesDaLinha(acoesPorLinha)}
        total={filtrados.length}
        page={paginaAtual}
        pageSize={tamanho}
        onPageChange={setPagina}
        onPageSizeChange={(n) => {
          setTamanho(n);
          setPagina(1);
        }}
        onClearFilters={() => aplicar(emptyFilterBarValue)}
        onRetry={() => setTentativas((n) => n + 1)}
        emptyAction={
          <Button size="small" leadingIcon={RiAddLine}>
            Nova solicitação
          </Button>
        }
      />
      <SelectionBar
        count={selecionados.size}
        position={posicaoSelecao}
        onClear={() => setSelecionados(new Set())}
        actions={[
          { id: 'exportar', label: 'Exportar', icon: RiDownload2Line, onPress: () => {} },
          { id: 'encaminhar', label: 'Encaminhar', icon: RiSendPlaneLine, onPress: () => {} },
          {
            id: 'cancelar',
            label: 'Cancelar solicitações',
            icon: RiDeleteBin6Line,
            tone: 'danger',
            onPress: () => {
              setDados((atual) => atual.filter((r) => !selecionados.has(r.id)));
              setSelecionados(new Set());
            },
          },
        ]}
      />
    </div>
  );
}

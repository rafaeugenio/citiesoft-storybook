import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FilterBar, ordenarFiltros, type FiltroAtivo } from './Filters';
import { Search } from '../Search/Search';
import { Select } from '../Select/Select';

const FILTROS: FiltroAtivo[] = [
  { id: 'busca', rotulo: 'Busca', valor: 'João Silva', dimensao: 'busca' },
  { id: 'periodo', rotulo: 'Período', valor: 'Março de 2025', dimensao: 'data' },
  { id: 'secretaria', rotulo: 'Secretaria', valor: 'Saúde', dimensao: 'select' },
];

const CONTROLES = (
  <>
    <Search label="Buscar servidores" placeholder="Nome, CPF ou matrícula" size="md" />
    <Select
      label="Secretaria"
      placeholder="Secretaria"
      options={[
        { value: 'saude', label: 'Saúde' },
        { value: 'educacao', label: 'Educação' },
      ]}
    />
  </>
);

const meta = {
  title: 'Dados/Filtros',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Barra de filtros de listagem. Spec: `03-components/filters.md` v2.0.0. Cada filtro é um chip nomeado: o chip genérico "3 filtros ativos" é proibido.',
      },
    },
  },
  args: {
    controles: CONTROLES,
    filtros: FILTROS,
    resultado: { total: 312, substantivo: ['servidor', 'servidores'] },
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComFiltrosAtivos: Story = {
  name: 'Estado · com filtros ativos',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('group', { name: 'Filtros da listagem' })).toBeVisible();
    await expect(canvas.getByText('312 servidores encontrados')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Limpar tudo' })).toBeVisible();

    // Cada filtro é um chip nomeado, com remoção individual.
    await expect(
      canvas.getByRole('button', { name: 'Remover filtro Secretaria: Saúde' }),
    ).toBeVisible();
  },
};

export const OrdemDosChips: Story = {
  name: 'Regra · chips agrupados por tipo',
  parameters: {
    docs: {
      description: {
        story:
          'A ordem de leitura é sempre select, depois data, depois busca, independentemente da ordem em que o usuário aplicou os filtros.',
      },
    },
  },
  play: async () => {
    const ordenados = ordenarFiltros(FILTROS).map((filtro) => filtro.id);
    await expect(ordenados).toEqual(['secretaria', 'periodo', 'busca']);
  },
};

export const SemFiltro: Story = {
  name: 'Estado · sem filtro',
  args: { filtros: [] },
  parameters: {
    docs: {
      description: {
        story: 'Sem filtro ativo a linha de chips some por inteiro, sem reservar espaço.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.citie-filtros__chips')).toBeNull();
  },
};

export const RemocaoIndividual: Story = {
  name: 'Estado · remover um filtro',
  render: function Remocao(args) {
    const [filtros, setFiltros] = useState(FILTROS);
    return (
      <FilterBar
        {...args}
        filtros={filtros}
        onRemover={(id) => setFiltros((atual) => atual.filter((f) => f.id !== id))}
        onLimparTudo={() => setFiltros([])}
      />
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Remover filtro Período: Março de 2025' }));
    await expect(canvas.queryByText('Março de 2025')).toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: 'Limpar tudo' }));
    await expect(canvasElement.querySelector('.citie-filtros__chips')).toBeNull();
  },
};

export const Compacta: Story = {
  name: 'Variante · compacta',
  args: { densidade: 'compacta' },
};

export const ResultadoUnico: Story = {
  name: 'Conteúdo · plural correto',
  args: { resultado: { total: 1, substantivo: ['servidor', 'servidores'] } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('1 servidor encontrado')).toBeVisible();
  },
};

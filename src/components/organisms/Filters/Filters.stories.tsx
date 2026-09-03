import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BotaoDeFiltro, FilterBar, ordenarFiltros, type FiltroAtivo } from './Filters';
import { Button } from '../../atoms/Button/Button';
import { Search } from '../../molecules/Search/Search';
import { Select } from '../../molecules/Select/Select';

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
  title: 'Organismos/Busca/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Barra de filtros de listagem. Spec: `03-components/filters.md` v2.0.0. Cada filtro é um chip nomeado: o chip genérico "3 filtros ativos" é proibido.',
          '',
          '**Quando usar:** listagem que o servidor recorta por mais de uma dimensão ao mesmo tempo',
          '(secretaria, período, situação) e precisa enxergar quais recortes estão valendo antes de',
          'exportar, imprimir ou tomar decisão sobre o resultado.',
          '',
          '**Quando não usar:** listagem com um único critério de busca por texto, onde a barra inteira',
          'vira moldura vazia em volta de um campo (use o `Search` sozinho); alternância entre visões',
          'fechadas e mutuamente exclusivas do mesmo dado, como "Em análise · Deferidos · Indeferidos",',
          'em que o chip removível sugere combinação que não existe (use `Tabs` ou `SelectButton`);',
          'listagem curta que cabe inteira na tela, onde filtrar custa mais atenção do que ler tudo;',
          'e formulário de parâmetros de relatório, que tem botão de gerar e precisa de validação antes',
          'de rodar (use `Drawer` com os campos e um `Button` de emissão). A contagem de resultados vive',
          'em região `aria-live="polite"`: sem ela, quem usa leitor de tela remove um chip e não recebe',
          'nenhum retorno de que a listagem mudou.',
        ].join('\n'),
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

export const BarraDoKit: Story = {
  name: 'Composição · barra de dimensões do kit',
  args: {
    controles: (
      <>
        <Search label="Filtrar solicitações" placeholder="Filtrar solicitações" size="md" />
        <BotaoDeFiltro rotulo="Situação" contador={2} />
        <BotaoDeFiltro rotulo="Prioridade" />
        <Button variant="text" size="small">
          Redefinir
        </Button>
      </>
    ),
    filtros: [
      { id: 'situacao-analise', rotulo: 'Situação', valor: 'Em análise', dimensao: 'select' },
      { id: 'situacao-devolvido', rotulo: 'Situação', valor: 'Devolvido', dimensao: 'select' },
    ],
    resultado: { total: 27, substantivo: ['solicitação', 'solicitações'] },
  },
  parameters: {
    docs: {
      description: {
        story: [
          'A barra da captura de tarefas do kit: campo de filtro à esquerda, um botão outline',
          'por dimensão com chevron de 16 e contador em badge quando há valor aplicado, e',
          '"Redefinir" em ghost. Os filtros ativos aparecem como badge de contorno com fechar,',
          'em 24 de altura (o alvo mínimo de remoção), texto 12 SemiBold em `text-primary`.',
          'A listagem do Sismental usa a outra forma da mesma barra, busca mais select, que é',
          'a story de cima.',
        ].join('\n'),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const situacao = canvas.getByRole('button', { name: 'Situação' });
    await expect(situacao).toHaveAttribute('aria-expanded', 'false');
    await expect(situacao.getBoundingClientRect().height).toBe(32);
    await expect(within(situacao).getByText('2')).toBeVisible();

    // Chip de filtro ativo: badge de contorno de 24 com raio 10 e alvo de 24 no fechar.
    const chip = canvasElement.querySelector('.citie-filtro-chip') as HTMLElement;
    await expect(chip.getBoundingClientRect().height).toBe(24);
    await expect(getComputedStyle(chip).borderRadius).toBe('10px');
    const remover = canvas.getByRole('button', { name: 'Remover filtro Situação: Em análise' });
    await expect(remover.getBoundingClientRect().height).toBe(24);
    await expect(remover.getBoundingClientRect().width).toBe(24);
  },
};

export const ResultadoUnico: Story = {
  name: 'Conteúdo · plural correto',
  args: { resultado: { total: 1, substantivo: ['servidor', 'servidores'] } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('1 servidor encontrado')).toBeVisible();
  },
};

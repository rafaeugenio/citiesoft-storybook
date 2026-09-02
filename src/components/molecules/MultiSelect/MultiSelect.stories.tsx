import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { MultiSelect } from './MultiSelect';

const BENEFICIOS = [
  { value: 'saude', label: 'Plano de saúde' },
  { value: 'transporte', label: 'Vale transporte' },
  { value: 'alimentacao', label: 'Vale alimentação' },
  { value: 'creche', label: 'Auxílio creche' },
  { value: 'educacao', label: 'Auxílio educação' },
];

const meta = {
  title: 'Moléculas/Campos/MultiSelect',
  component: MultiSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Escolha múltipla em lista fechada. Origem: Figma CitieOne, página ❖ MultiSelect (State: Idle | Open | Selected, Mode: Basic | Chips, Size, Invalid, Disabled, Filled, float label). A regra do DS manda o modo Basic resumir por contagem e o modo Chips mostrar cada item. Equivalente PrimeNG: `p-multiselect`.',
          '',
          '**Quando usar:** o campo aceita vários valores de uma lista fechada de tamanho médio ou grande (benefícios do colaborador, especialidades atendidas por uma unidade, competências incluídas num relatório) e o painel fechado protege a altura do formulário.',
          '',
          '**Quando não usar:**',
          '',
          '- **Até cinco opções que cabem na tela.** Marcar três caixas visíveis é mais rápido e mais claro que abrir, marcar e fechar um painel. Use `Átomos/Escolha/Checkbox` em grupo, com o rótulo do conjunto acima.',
          '- **A escolha é exclusiva.** Um campo múltiplo em cima de dado que aceita um valor só produz registro com dois municípios de destino no mesmo encaminhamento. Use `Moléculas/Campos/Select`, ou `Moléculas/Campos/SelectButton` para poucas opções.',
          '- **A seleção precisa ficar conferível junto com o resultado.** Com o painel fechado, o modo `basic` mostra apenas "3 selecionados" e obriga reabrir para conferir quais. Em tela de conferência, prefira `Moléculas/Campos/Listbox` com `multiplo`, que mantém a lista e as marcas sempre visíveis. Dentro do próprio MultiSelect, o modo `chips` é o mínimo aceitável quando o servidor precisa reler o que marcou antes de salvar.',
          '- **As opções são hierárquicas.** A lista plana esconde a relação entre secretaria e setor. Use `Moléculas/Campos/TreeSelect` no modo `checkbox`, que marca ramo e descendentes com estado parcial.',
          '- **O catálogo é grande e a pessoa já sabe o que procura.** Rolar centenas de linhas dentro do painel é lento mesmo com o filtro. Use `Moléculas/Campos/AutoComplete` com `multiple`.',
          '- **O objetivo é filtrar uma listagem já exibida.** Filtro de tela pertence à barra de filtros (`Organismos/Busca/FilterBar`), onde o resultado responde na mesma altura da tela.',
          '',
          'Duas observações de implementação que pesam na escolha: o painel deste componente fecha pelo próprio gatilho, sem Escape nem clique fora, e a navegação por teclado chega à lista inteira em vez de percorrer opção por opção. Em tela de uso frequente e teclado intenso, o `Listbox` entrega navegação por setas, Home e End.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Benefícios do colaborador', opcoes: BENEFICIOS, placeholder: 'Selecione os benefícios' },
} satisfies Meta<typeof MultiSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  name: 'State · idle',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: /Selecione os benefícios/ });

    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(gatilho).toHaveAttribute('aria-haspopup', 'listbox');
  },
};

export const Aberto: Story = {
  name: 'State · open',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Selecione os benefícios/ }));

    const lista = canvas.getByRole('listbox', { name: 'Benefícios do colaborador' });
    await expect(lista).toHaveAttribute('aria-multiselectable', 'true');
    await expect(canvas.getAllByRole('option')).toHaveLength(5);
  },
};

export const ModoBasic: Story = {
  name: 'Mode · basic (contagem)',
  args: { defaultValue: ['saude', 'transporte', 'creche'] },
  parameters: {
    docs: {
      description: {
        story:
          'Resume por contagem, porque concatenar rótulos longos no campo prejudica a leitura em tabela densa.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('3 selecionados')).toBeVisible();
  },
};

export const ModoChips: Story = {
  name: 'Mode · chips',
  args: { modo: 'chips', defaultValue: ['saude', 'transporte'] },
  parameters: {
    docs: {
      description: {
        story: 'Mostra cada item escolhido, para quando conferir a seleção importa mais que o espaço.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Plano de saúde')).toBeVisible();
    await expect(canvas.getByText('Vale transporte')).toBeVisible();
  },
};

export const Selecionar: Story = {
  name: 'State · selected',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Selecione os benefícios/ }));
    await userEvent.click(canvas.getByRole('option', { name: /Plano de saúde/ }));

    await expect(canvas.getByRole('option', { name: /Plano de saúde/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByText('1 selecionado')).toBeVisible();
  },
};

export const ComFiltro: Story = {
  name: 'Comportamento · filtro no painel',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: /Selecione os benefícios/ }));
    await userEvent.type(
      canvas.getByRole('searchbox', { name: 'Filtrar benefícios do colaborador' }),
      'vale',
    );

    await expect(canvas.getAllByRole('option')).toHaveLength(2);
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: { error: 'Escolha ao menos um benefício para o colaborador.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: /Selecione os benefícios/ });
    await expect(gatilho).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, defaultValue: ['saude'] },
};

export const Filled: Story = {
  name: 'Variante · filled',
  args: { filled: true },
};

export const Tamanhos: Story = {
  name: 'Size · 32 / 36 / 40px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <MultiSelect {...args} size="small" label="Small" />
      <MultiSelect {...args} size="normal" label="Normal" />
      <MultiSelect {...args} size="large" label="Large" />
    </div>
  ),
};

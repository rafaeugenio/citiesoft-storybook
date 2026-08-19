import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Chip } from './Badge';

const meta = {
  title: 'Átomos/Marcadores/Chip',
  component: Chip,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Elemento interativo que representa uma entidade (pessoa, filtro, seleção) e pode ser removido ou alternado pelo usuário. Aparece em filtros de tabela, campos de destinatários e seleção múltipla. Spec: `03-components/badges-tags.md` v2.0.0. Equivalente PrimeNG: `p-chip`.\n\n**Quando usar este e não os irmãos:** Chip é o único marcador **interativo** — o usuário remove pelo "×" (ou por Delete/Backspace com o chip em foco, WCAG 2.5.7) ou alterna a seleção. Se o rótulo é atributo fixo do registro e o usuário não pode mexer nele, use `Tag`. Se comunica a etapa de um fluxo de trabalho, use `StatusIndicator`. Se é contagem de pendências sobreposta a um ícone, use `Badge`.\n\nO botão de remoção tem nome acessível "Remover [rótulo]" e área de clique mínima de 24×24px mesmo com ícone de 12px. O mapa canônico de severidades compartilhado pelos marcadores está documentado em Átomos/Marcadores/Tag.\n\n**Quando não usar:** em coluna de tabela, para mostrar categoria ou especialidade do registro. O chip removível recebe foco e responde a Delete e Backspace, então uma listagem de 50 linhas ganha 50 paradas extras de tabulação e um Backspace disparado fora do campo apaga o vínculo do processo sem confirmação; use `Tag`. Como campo de escolha entre poucas opções fixas: o chip selecionável não anuncia que é um grupo nem informa quantas opções existem, e quem preenche a tela de forma esporádica não descobre que aquilo é clicável; use `SelectButton` ou `RadioGroup`. Para escolher itens de uma lista longa (acima de oito opções, os chips quebram em várias linhas e empurram o resto do formulário para baixo a cada seleção): use `MultiSelect`, que resume a escolha em uma linha. Para etapa de fluxo use `StatusIndicator` e para contagem sobreposta a um ícone use `Badge`.',
      },
    },
  },
  args: { label: 'Afastamento' },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChipRemovivel: Story = {
  name: 'Chip · removível',
  render: () => <Chip label="Afastamento" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const remover = canvas.getByRole('button', { name: 'Remover Afastamento' });

    await expect(remover).toBeVisible();
    // Área de clique mínima de 24x24 mesmo com o ícone de 12px.
    const caixa = remover.getBoundingClientRect();
    await expect(caixa.width).toBeGreaterThanOrEqual(24);
    await expect(caixa.height).toBeGreaterThanOrEqual(24);
  },
};

export const ChipSelecionavel: Story = {
  name: 'Chip · selecionável',
  render: () => <Chip label="Somente urgentes" variant="selectable" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button', { name: 'Somente urgentes' });

    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
  },
};

export const ChipsDeFiltroAplicado: Story = {
  name: 'Chip · filtros aplicados',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Chip label="São Luís" />
      <Chip label="Em Análise" />
      <Chip label="Cardiologia" />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Moléculas/Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Rótulo curto ancorado a um gatilho, para explicar um ícone, uma sigla ou uma coluna abreviada. Spec: `03-components/overlays-tooltip-popover.md` v2.0.0. Biblioteca Figma CitieOne: `07-figma-library/tooltip.md`. Equivalente PrimeNG: diretiva `pTooltip`.\n\n**Quando usar este e não o Popover.** O Tooltip carrega texto curto de até 2 linhas, nunca recebe foco e não pode ter conteúdo interativo dentro. Assim que a necessidade incluir um link, um botão ou um campo, o componente correto passa a ser o [Popover](?path=/docs/moléculas-overlay-popover--docs).',
      },
    },
  },
  args: { conteudo: 'Município de origem: São Luís do Maranhão', children: <button>Gatilho</button> },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PorTeclado: Story = {
  name: 'Tooltip · abre por foco de teclado',
  parameters: {
    docs: {
      description: {
        story:
          'Por teclado abre no foco, sem atraso. O tooltip nunca recebe foco e fica associado ao gatilho para o leitor de tela.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 48 }}>
      <Tooltip {...args}>
        <Button variant="text" aria-label="Município de origem">
          SLZ
        </Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Município de origem' });

    await userEvent.tab();
    await expect(gatilho).toHaveFocus();

    const dica = await canvas.findByRole('tooltip');
    await expect(dica).toHaveTextContent('Município de origem: São Luís do Maranhão');
    // A associação explícita liga o gatilho ao texto.
    await expect(gatilho).toHaveAttribute('aria-describedby', dica.id);
  },
};

export const AtrasoNoHover: Story = {
  name: 'Tooltip · atraso de 400ms no hover',
  parameters: {
    docs: {
      description: {
        story:
          'O atraso evita que a dica pisque durante a varredura rápida de uma tabela. Ao sair do alvo, some na hora.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 48 }}>
      <Tooltip {...args} atraso={120}>
        <Button variant="secondary">Passe o cursor</Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Passe o cursor' });

    await userEvent.hover(gatilho);
    await waitFor(() => expect(canvas.getByRole('tooltip')).toBeVisible());

    await userEvent.unhover(gatilho);
    await waitFor(() => expect(canvas.queryByRole('tooltip')).toBeNull());
  },
};

export const Tamanhos: Story = {
  name: 'Tooltip · tamanhos',
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 64 }}>
      <Tooltip conteudo="Sigla da coluna" size="sm">
        <Button variant="text">sm</Button>
      </Tooltip>
      <Tooltip conteudo="Descrição padrão para a maioria dos casos" size="md">
        <Button variant="text">md</Button>
      </Tooltip>
      <Tooltip conteudo="Descrição técnica um pouco mais longa, ainda dentro de duas linhas" size="lg">
        <Button variant="text">lg</Button>
      </Tooltip>
    </div>
  ),
};

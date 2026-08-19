import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Popover, Tooltip } from './Tooltip';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';

const meta = {
  title: 'Overlay/Tooltip e Popover',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Tooltip e Popover. Spec: `03-components/overlays-tooltip-popover.md` v2.0.0. Se o conteúdo passa de 2 linhas ou precisa de link ou botão dentro, o componente correto é o Popover.',
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

export const PopoverDeFiltro: Story = {
  name: 'Popover · filtros ancorados',
  parameters: {
    docs: {
      description: {
        story:
          'Quando o conteúdo precisa de campo ou botão dentro, a spec manda migrar do Tooltip para o Popover.',
      },
    },
  },
  render: function PopoverDeFiltro() {
    const [aberto, setAberto] = useState(false);
    return (
      <div style={{ padding: 24, minHeight: 320 }}>
        <Popover
          label="Filtros da listagem"
          aberto={aberto}
          onClose={() => setAberto(false)}
          gatilho={
            <Button variant="secondary" onClick={() => setAberto(!aberto)}>
              Filtrar
            </Button>
          }
        >
          <div style={{ display: 'grid', gap: 12 }}>
            <Select
              label="Situação"
              placeholder="Qualquer situação"
              options={[
                { value: 'analise', label: 'Em Análise' },
                { value: 'aprovado', label: 'Aprovado' },
              ]}
            />
            <Button size="small" onClick={() => setAberto(false)}>
              Aplicar
            </Button>
          </div>
        </Popover>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Filtrar' }));
    const painel = canvas.getByRole('dialog', { name: 'Filtros da listagem' });
    await expect(painel).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Aplicar' }));
    await expect(canvas.queryByRole('dialog')).toBeNull();
  },
};

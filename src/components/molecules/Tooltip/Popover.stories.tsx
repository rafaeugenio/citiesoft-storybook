import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Popover } from './Tooltip';
import { Button } from '../../atoms/Button/Button';
import { Select } from '../../molecules/Select/Select';

const meta = {
  title: 'Moléculas/Overlay/Popover',
  component: Popover,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Painel ancorado a um gatilho, com conteúdo interativo dentro. Spec: `03-components/overlays-tooltip-popover.md` v2.0.0. Biblioteca Figma CitieOne: `07-figma-library/popover.md`. Equivalente PrimeNG: `p-popover`.\n\n**Quando usar este e não o Tooltip.** O [Tooltip](?path=/docs/moléculas-overlay-tooltip--docs) carrega rótulo curto de até 2 linhas, nunca recebe foco e não pode ter conteúdo interativo dentro. Assim que a necessidade incluir um link, um botão ou um campo, o componente correto passa a ser o Popover, que abre como `dialog` nomeado, recebe foco e fecha no Esc.',
      },
    },
  },
  args: {
    label: 'Filtros da listagem',
    aberto: false,
    onClose: () => {},
    gatilho: <Button variant="secondary">Filtrar</Button>,
    children: null,
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

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

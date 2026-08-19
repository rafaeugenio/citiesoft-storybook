import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { SkeletonRegion } from '../../atoms/Skeleton/Skeleton';
import { SkeletonParagrafo } from './SkeletonParagrafo';

const meta = {
  title: 'Moléculas/Feedback/SkeletonParagrafo',
  component: SkeletonParagrafo,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Bloco de texto em carregamento. Spec: `03-components/skeleton-loading.md` v2.0.0.',
          'Biblioteca Figma: `07-figma-library/skeleton.md`. Equivalente PrimeNG: `p-skeleton`.',
          '',
          'Replica a forma do parágrafo que vai chegar, para eliminar salto de layout, e nunca exibe',
          'texto de carregamento dentro dos blocos. A última linha usa largura reduzida (60 a 70%)',
          'para verossimilhança.',
          '',
          'Sempre embrulhe a composição em `SkeletonRegion` com um rótulo específico do módulo',
          '("Carregando parecer técnico"), nunca genérico: é ele que carrega `role="status"` e',
          '`aria-busy`.',
          '',
          '**Quando usar esta e não o bloco:** a composição resolve contagem, ritmo e proporção de um',
          'padrão já conhecido. Para um vão isolado ou um esqueleto sob medida de uma tela sem padrão',
          'pronto, use `Átomos/Feedback/Skeleton`. Para os outros padrões prontos, veja',
          '`Moléculas/Feedback/SkeletonLista` e `Moléculas/Feedback/SkeletonFormulario`.',
        ].join('\n'),
      },
    },
  },
  args: {
    linhas: 4,
  },
} satisfies Meta<typeof SkeletonParagrafo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paragrafo: Story = {
  name: 'Composição · parágrafo',
  parameters: {
    docs: {
      description: {
        story: 'A última linha usa largura reduzida para verossimilhança.',
      },
    },
  },
  render: (args) => (
    <SkeletonRegion label="Carregando parecer técnico">
      <div style={{ maxWidth: 480 }}>
        <SkeletonParagrafo {...args} />
      </div>
    </SkeletonRegion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regiao = canvas.getByRole('status', { name: 'Carregando parecer técnico' });

    await expect(regiao).toHaveAttribute('aria-busy', 'true');
    // Nenhum bloco de skeleton é focável ou interativo.
    await expect(canvasElement.querySelectorAll('button, a, input')).toHaveLength(0);
  },
};

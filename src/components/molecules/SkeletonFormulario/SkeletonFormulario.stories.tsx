import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { SkeletonRegion } from '../../atoms/Skeleton/Skeleton';
import { SkeletonFormulario } from './SkeletonFormulario';

const meta = {
  title: 'Moléculas/Feedback/SkeletonFormulario',
  component: SkeletonFormulario,
  tags: ['autodocs', 'molecule', 'a11y'],
  parameters: {
    docs: {
      description: {
        component: [
          'Formulário em carregamento. Spec: `03-components/skeleton-loading.md` v2.0.0.',
          'Biblioteca Figma: `07-figma-library/skeleton.md`. Equivalente PrimeNG: `p-skeleton`.',
          '',
          'Repete a dupla rótulo + campo, replicando a forma do formulário que vai chegar para',
          'eliminar salto de layout. Nunca exibe texto de carregamento dentro dos blocos.',
          '',
          'Sempre embrulhe a composição em `SkeletonRegion` com um rótulo específico do módulo',
          '("Carregando cadastro do colaborador"), nunca genérico: é ele que carrega `role="status"`',
          'e `aria-busy`.',
          '',
          '**Quando usar esta e não o bloco:** a composição resolve contagem, ritmo e proporção de um',
          'padrão já conhecido. Para um vão isolado ou um esqueleto sob medida de uma tela sem padrão',
          'pronto, use `Átomos/Feedback/Skeleton`. Para os outros padrões prontos, veja',
          '`Moléculas/Feedback/SkeletonParagrafo` e `Moléculas/Feedback/SkeletonLista`.',
        ].join('\n'),
      },
    },
  },
  args: {
    campos: 3,
  },
} satisfies Meta<typeof SkeletonFormulario>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Formulario: Story = {
  name: 'Composição · formulário',
  render: (args) => (
    <SkeletonRegion label="Carregando cadastro do colaborador">
      <div style={{ maxWidth: 360 }}>
        <SkeletonFormulario {...args} />
      </div>
    </SkeletonRegion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regiao = canvas.getByRole('status', { name: 'Carregando cadastro do colaborador' });
    await expect(regiao).toHaveAttribute('aria-busy', 'true');

    const campos = canvasElement.querySelectorAll<HTMLElement>('.citie-skeleton-formulario__campo');
    await expect(campos).toHaveLength(3);
    // A caixa do campo replica a altura real do controle (40px em densidade
    // normal), senão o formulário salta quando o dado chega.
    const caixa = campos[0].querySelector<HTMLElement>('.citie-skeleton--campo');
    await expect(caixa?.getBoundingClientRect().height).toBe(40);
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { SkeletonRegion } from '../../atoms/Skeleton/Skeleton';
import { SkeletonLista } from './SkeletonLista';

const meta = {
  title: 'Moléculas/Feedback/SkeletonLista',
  component: SkeletonLista,
  tags: ['autodocs', 'molecule', 'a11y'],
  parameters: {
    docs: {
      description: {
        component: [
          'Lista em carregamento. Spec: `03-components/skeleton-loading.md` v2.0.0.',
          'Biblioteca Figma: `07-figma-library/skeleton.md`. Equivalente PrimeNG: `p-skeleton`.',
          '',
          'Repete a dupla avatar + linhas de cada registro, replicando a forma da lista que vai',
          'chegar para eliminar salto de layout. Nunca exibe texto de carregamento dentro dos blocos.',
          '',
          'Sempre embrulhe a composição em `SkeletonRegion` com um rótulo específico do módulo',
          '("Carregando lista de processos"), nunca genérico: é ele que carrega `role="status"` e',
          '`aria-busy`.',
          '',
          '**Quando usar esta e não o bloco:** a composição resolve contagem, ritmo e proporção de um',
          'padrão já conhecido. Para um vão isolado ou um esqueleto sob medida de uma tela sem padrão',
          'pronto, use `Átomos/Feedback/Skeleton`. Para os outros padrões prontos, veja',
          '`Moléculas/Feedback/SkeletonParagrafo` e `Moléculas/Feedback/SkeletonFormulario`.',
        ].join('\n'),
      },
    },
  },
  args: {
    itens: 4,
  },
} satisfies Meta<typeof SkeletonLista>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lista: Story = {
  name: 'Composição · lista',
  render: (args) => (
    <SkeletonRegion label="Carregando lista de processos">
      <SkeletonLista {...args} />
    </SkeletonRegion>
  ),
};

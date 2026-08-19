import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Skeleton,
  SkeletonFormulario,
  SkeletonLista,
  SkeletonParagrafo,
  SkeletonRegion,
} from './Skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Skeleton de carregamento. Spec: `03-components/skeleton-loading.md` v2.0.0. Replica a forma do conteúdo real para eliminar salto de layout, e nunca exibe texto de carregamento dentro do bloco.',
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

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
  render: () => (
    <SkeletonRegion label="Carregando parecer técnico">
      <div style={{ maxWidth: 480 }}>
        <SkeletonParagrafo linhas={4} />
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

export const Lista: Story = {
  name: 'Composição · lista',
  render: () => (
    <SkeletonRegion label="Carregando lista de processos">
      <SkeletonLista itens={4} />
    </SkeletonRegion>
  ),
};

export const Formulario: Story = {
  name: 'Composição · formulário',
  render: () => (
    <SkeletonRegion label="Carregando cadastro do colaborador">
      <div style={{ maxWidth: 360 }}>
        <SkeletonFormulario campos={3} />
      </div>
    </SkeletonRegion>
  ),
};

export const Formas: Story = {
  name: 'Formas · radius por tipo de bloco',
  parameters: {
    docs: {
      description: {
        story:
          'Linha de texto usa radius.sm, campo e botão usam radius.md, card usa radius.xl e avatar usa radius.full.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      <Skeleton forma="titulo" />
      <Skeleton forma="linha" />
      <Skeleton forma="campo" />
      <Skeleton forma="circulo" width="42px" height="42px" />
      <Skeleton forma="card" />
    </div>
  ),
};

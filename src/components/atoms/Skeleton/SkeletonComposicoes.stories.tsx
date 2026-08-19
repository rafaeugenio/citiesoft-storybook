import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  SkeletonFormulario,
  SkeletonLista,
  SkeletonParagrafo,
  SkeletonRegion,
} from './Skeleton';

const meta = {
  title: 'Moléculas/Feedback/Composições de Skeleton',
  component: SkeletonParagrafo,
  subcomponents: { SkeletonLista, SkeletonFormulario },
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Padrões de tela montados a partir do bloco de skeleton: `SkeletonParagrafo`,',
          '`SkeletonLista` e `SkeletonFormulario`. Spec: `03-components/skeleton-loading.md` v2.0.0.',
          'Biblioteca Figma: `07-figma-library/skeleton.md`. Equivalente PrimeNG: `p-skeleton`.',
          '',
          'Cada composição replica a forma do conteúdo real que vai chegar, para eliminar salto de',
          'layout, e nunca exibe texto de carregamento dentro dos blocos. No parágrafo, a última linha',
          'usa largura reduzida (60 a 70%) para verossimilhança. A lista repete a dupla avatar + linhas',
          'de cada registro; o formulário repete a dupla rótulo + campo.',
          '',
          'Sempre embrulhe a composição em `SkeletonRegion` com um rótulo específico do módulo',
          '("Carregando lista de processos"), nunca genérico: é ele que carrega `role="status"` e',
          '`aria-busy`.',
          '',
          '**Quando usar estas e não o bloco:** as composições resolvem contagem, ritmo e proporção',
          'de um padrão já conhecido. Para um vão isolado ou um esqueleto sob medida de uma tela sem',
          'padrão pronto, use `Átomos/Feedback/Skeleton`.',
        ].join('\n'),
      },
    },
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

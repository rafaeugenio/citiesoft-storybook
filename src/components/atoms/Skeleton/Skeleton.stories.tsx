import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Átomos/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs', 'atom', 'a11y'],
  parameters: {
    docs: {
      description: {
        component: [
          'Bloco de carregamento e a região que o embrulha. Spec: `03-components/skeleton-loading.md`',
          'v2.0.0. Biblioteca Figma: `07-figma-library/skeleton.md`. Equivalente PrimeNG: `p-skeleton`.',
          '',
          'O bloco replica a forma do conteúdo real para eliminar salto de layout, e nunca exibe texto',
          'de carregamento dentro dele. `SkeletonRegion` é o container de estado ocupado: marca a área',
          'com `role="status"` e `aria-busy`, dando um nome acessível ao que está sendo carregado.',
          'Nenhum bloco é focável ou interativo.',
          '',
          '**Quando usar este e não as composições:** o bloco é a peça crua, para montar um esqueleto',
          'sob medida de uma tela que ainda não tem padrão pronto, ou para preencher um único vão',
          '(um título, um avatar, um card). Quando o padrão já existe — parágrafo de texto, lista de',
          'registros, formulário — use as composições `Moléculas/Feedback/SkeletonParagrafo`, `SkeletonLista` e `SkeletonFormulario`, que já resolve',
          'contagem de linhas, ritmo e a largura reduzida da última linha.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

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

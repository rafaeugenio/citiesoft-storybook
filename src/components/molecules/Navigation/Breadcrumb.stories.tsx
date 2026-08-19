import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Breadcrumb } from './Navigation';

const meta = {
  title: 'Moléculas/Navegação/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Trilha de navegação que responde "onde estou dentro da hierarquia" (ex.: Pessoas > Servidores > Ficha Individual > Benefícios). Spec: `03-components/breadcrumb-stepper.md` v2.0.0. Equivalente PrimeNG: `p-breadcrumb`.',
          '',
          '**Quando usar**: hierarquia com 3 ou mais níveis; módulos onde o usuário navega entre listas e detalhes; telas de detalhe alcançáveis por múltiplos pontos de entrada.',
          '',
          '**Quando não usar**: página de nível único ou dashboard (seria redundante com o item ativo do menu lateral); dentro de modais e drawers, onde o contexto já é implícito pelo elemento que os abriu.',
          '',
          '**Breadcrumb ou Stepper?** Breadcrumb quando a navegação é hierárquica e o usuário pode chegar à mesma tela de detalhe por caminhos diferentes. Se o percurso é um processo linear em etapas com dependência entre elas, o componente é o Stepper.',
          '',
          'É molécula: resolve uma tarefa única, orientar o usuário na hierarquia, sem estado de aplicação nem regra de permissão.',
        ].join('\n'),
      },
    },
  },
  args: {
    niveis: [
      { rotulo: 'Início', href: '#inicio' },
      { rotulo: 'Processos', href: '#processos' },
      { rotulo: '2025/0481' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Trilha: Story = {
  name: 'Breadcrumb · padrão',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('navigation', { name: 'Trilha de navegação' })).toBeVisible();
    // O item atual é página corrente, nunca link.
    const atual = canvas.getByText('2025/0481');
    await expect(atual).toHaveAttribute('aria-current', 'page');
    await expect(canvas.queryByRole('link', { name: '2025/0481' })).toBeNull();
  },
};

export const TrilhaColapsada: Story = {
  name: 'Breadcrumb · colapsada',
  args: {
    niveis: [
      { rotulo: 'Início', href: '#inicio' },
      { rotulo: 'Pessoas', href: '#pessoas' },
      { rotulo: 'Servidores', href: '#servidores' },
      { rotulo: 'Maria de Fátima Souza', href: '#maria' },
      { rotulo: 'Benefícios' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Acima de 4 níveis os do meio colapsam. A raiz do módulo nunca é omitida, mesmo em trilha longa.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Início' })).toBeVisible();
    await expect(canvas.getByText('Benefícios')).toHaveAttribute('aria-current', 'page');
  },
};

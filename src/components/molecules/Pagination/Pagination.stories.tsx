import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Pagination, janelaDePaginas } from './Pagination';

const meta = {
  title: 'Moléculas/Navegação/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Paginação de tabelas e listas. Spec: `03-components/pagination.md` v2.0.0. Equivalente PrimeNG: `p-paginator`.',
      },
    },
  },
  args: {
    label: 'Paginação de solicitações',
    totalRegistros: 1183,
    itensPorPagina: 25,
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Completa: Story = {
  name: 'Variante · completa',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O total nunca é omitido em tabela operacional, com ponto de milhar pt-BR.
    await expect(canvas.getByText('Mostrando 1 a 25 de 1.183 registros')).toBeVisible();
    await expect(canvas.getByRole('navigation', { name: 'Paginação de solicitações' })).toBeVisible();

    // Na página 1, anterior e primeira ficam desabilitadas.
    await expect(canvas.getByRole('button', { name: 'Página anterior' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Primeira página' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Página 1' })).toHaveAttribute(
      'aria-current',
      'page',
    );
  },
};

export const Navegacao: Story = {
  name: 'Estado · trocar de página',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Próxima página' }));
    await expect(canvas.getByText('Mostrando 26 a 50 de 1.183 registros')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Página 2' })).toHaveAttribute(
      'aria-current',
      'page',
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Última página' }));
    await expect(canvas.getByText('Mostrando 1.176 a 1.183 de 1.183 registros')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Próxima página' })).toBeDisabled();
  },
};

export const JanelaDePaginas: Story = {
  name: 'Regra · janela de páginas',
  parameters: {
    docs: {
      description: {
        story:
          'Acima de 7 páginas mostra sempre a 1, a última e ±1 da ativa. As reticências nunca colapsam a primeira nem a última, e nunca aparecem duas seguidas.',
      },
    },
  },
  play: async () => {
    await expect(janelaDePaginas(1, 5)).toEqual([1, 2, 3, 4, 5]);
    await expect(janelaDePaginas(1, 48)).toEqual([1, 2, '…', 48]);
    await expect(janelaDePaginas(24, 48)).toEqual([1, '…', 23, 24, 25, '…', 48]);
    await expect(janelaDePaginas(48, 48)).toEqual([1, '…', 47, 48]);
  },
};

export const Compacta: Story = {
  name: 'Variante · compacta',
  args: { variant: 'compacta', totalRegistros: 96 },
};

export const Minima: Story = {
  name: 'Variante · mínima',
  args: { variant: 'minima', totalRegistros: 1183 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Pág. 1 de 48')).toBeVisible();
  },
};

export const Simples: Story = {
  name: 'Variante · simples (total desconhecido)',
  args: { variant: 'simples', totalRegistros: 200 },
};

export const Ampliada: Story = {
  name: 'A11y · alvo de toque 44px',
  args: { ampliado: true, totalRegistros: 96 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Próxima página' });
    await expect(botao.getBoundingClientRect().height).toBe(44);
  },
};

export const SemRegistros: Story = {
  name: 'Estado · vazio',
  args: { totalRegistros: 0 },
  parameters: {
    docs: {
      description: {
        story: 'Com zero registros o paginador some por inteiro e a tabela exibe o empty state.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.citie-pagination')).toBeNull();
  },
};

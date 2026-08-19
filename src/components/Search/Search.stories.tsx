import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { MINIMO_DE_CARACTERES, Search } from './Search';

const meta = {
  title: 'Dados/Search',
  component: Search,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Busca de listagem e busca global. Spec: `03-components/search.md` v2.0.0. Regra dura: o placeholder informa o escopo, e "sem resultado" nunca se confunde com "vazio estrutural".',
      },
    },
  },
  args: {
    label: 'Buscar servidores',
    placeholder: 'Buscar por nome, CPF ou matrícula',
  },
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('searchbox', { name: 'Buscar servidores' });

    await expect(campo).toHaveAttribute('placeholder', 'Buscar por nome, CPF ou matrícula');
    // O botão de limpar só existe quando há valor.
    await expect(canvas.queryByRole('button', { name: 'Limpar busca' })).toBeNull();
  },
};

export const Digitando: Story = {
  name: 'Estado · digitando',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('searchbox');

    await userEvent.type(campo, 'silva');
    const limpar = canvas.getByRole('button', { name: 'Limpar busca' });

    // Alvo de toque de 44x44 mesmo com o ícone menor.
    await expect(limpar.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    await expect(limpar.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);

    await userEvent.click(limpar);
    await expect(campo).toHaveValue('');
  },
};

export const MinimoDeCaracteres: Story = {
  name: 'Regra · mínimo de 3 caracteres',
  parameters: {
    docs: {
      description: {
        story:
          'A dica aparece antes de bloquear, protegendo a base sem deixar o usuário no escuro.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('searchbox'), 'si');
    await expect(
      canvas.getByText(`Digite ao menos ${MINIMO_DE_CARACTERES} caracteres para buscar`),
    ).toBeVisible();
  },
};

export const ComSugestoes: Story = {
  name: 'Variante · autocomplete',
  args: {
    sugestoes: [
      'Maria de Fátima Souza',
      'João Silva',
      'Ana Beatriz Lima',
      'Carlos Andrade Silva',
      'Luiza Martins',
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Painel de até 8 itens, com o trecho correspondente destacado por fundo de marca, nunca só por negrito.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('searchbox'), 'silva');
    const painel = canvas.getByRole('list', { name: 'Sugestões de busca' });

    await expect(within(painel).getAllByRole('listitem')).toHaveLength(2);
    await expect(canvasElement.querySelectorAll('mark').length).toBeGreaterThan(0);
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: { carregando: true, valorInicial: 'silva' },
  parameters: {
    docs: {
      description: {
        story: 'O spinner substitui o ícone de busca, nunca os dois ao mesmo tempo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('status', { name: 'Buscando' })).toBeVisible();
    // O campo segue editável durante a busca.
    await expect(canvas.getByRole('searchbox')).toBeEnabled();
  },
};

export const ComResultados: Story = {
  name: 'Estado · com resultados',
  args: { valorInicial: 'silva', resultado: { total: 47, substantivo: ['servidor', 'servidores'] } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('47 servidores encontrados')).toBeVisible();
  },
};

export const ResultadoUnico: Story = {
  name: 'Conteúdo · plural correto',
  args: { valorInicial: 'silva', resultado: { total: 1, substantivo: ['servidor', 'servidores'] } },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('1 servidor encontrado')).toBeVisible();
  },
};

export const SemResultado: Story = {
  name: 'Estado · sem resultado',
  args: { valorInicial: 'xyz', resultado: { total: 0, substantivo: ['servidor', 'servidores'] } },
  parameters: {
    docs: {
      description: {
        story:
          'A mensagem cita o termo buscado e orienta a próxima ação. Nunca "Sem resultados" nem "0 itens".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(
        'Nenhum resultado para "xyz". Verifique a grafia ou tente um termo mais amplo.',
      ),
    ).toBeVisible();
  },
};

export const Erro: Story = {
  name: 'Estado · erro',
  args: { valorInicial: 'si', error: 'Não foi possível buscar. Digite pelo menos 3 caracteres.' },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('searchbox')).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};

export const Tamanhos: Story = {
  name: 'Tamanhos · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Search {...args} size="sm" label="Busca inline em tabela densa" />
      <Search {...args} size="md" label="Busca acima da tabela" />
      <Search {...args} size="lg" label="Busca global do header" />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, AvatarGroup, corDoNome, iniciaisDoNome } from './Avatar';
import { Badge } from '../Badge/Badge';

const meta = {
  title: 'Dados/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avatar e AvatarGroup. Spec: `03-components/avatar.md` v2.0.0. Fallback em cadeia: imagem, iniciais, ícone genérico. A cor das iniciais é determinística por hash do nome, então o mesmo servidor aparece igual em qualquer tela.',
      },
    },
  },
  args: { nome: 'Maria de Fátima Souza' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Iniciais: Story = {
  name: 'Fallback · iniciais',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Duas letras, do primeiro e do último nome, ignorando preposições.
    await expect(canvas.getByText('MS')).toBeVisible();
    await expect(iniciaisDoNome('Maria de Fátima Souza')).toBe('MS');
    await expect(canvas.getByRole('img', { name: 'Maria de Fátima Souza' })).toBeVisible();
  },
};

export const CorDeterministica: Story = {
  name: 'Fallback · cor determinística',
  parameters: {
    docs: {
      description: {
        story:
          'A severidade é derivada do hash do nome, então duas renderizações do mesmo servidor sempre coincidem.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 12 }}>
      {['Maria de Fátima Souza', 'João Silva', 'Carlos Andrade', 'Ana Beatriz Lima'].map((nome) => (
        <Avatar key={nome} nome={nome} size="large" />
      ))}
    </div>
  ),
  play: async () => {
    await expect(corDoNome('João Silva')).toBe(corDoNome('João Silva'));
  },
};

export const IconeGenerico: Story = {
  name: 'Fallback · ícone genérico',
  args: { nome: '', descricao: 'Órgão sem responsável designado', size: 'large' },
  parameters: {
    docs: {
      description: {
        story:
          'Último elo da cadeia, quando a entidade não tem nome definido. Sem nome próprio o avatar precisa da descrição da entidade, senão fica sem nome acessível.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('img', { name: 'Órgão sem responsável designado' }),
    ).toBeVisible();
  },
};

export const Tamanhos: Story = {
  name: 'Tamanhos · 28 / 42 / 56px',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Avatar {...args} size="normal" />
      <Avatar {...args} size="large" />
      <Avatar {...args} size="x-large" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const avatares = [...canvasElement.querySelectorAll('.citie-avatar')];
    const larguras = avatares.map((elemento) => elemento.getBoundingClientRect().width);
    await expect(larguras).toEqual([28, 42, 56]);
  },
};

export const Quadrado: Story = {
  name: 'Forma · quadrado para entidade',
  args: { nome: 'Secretaria de Saúde', shape: 'square', size: 'large' },
  parameters: {
    docs: {
      description: {
        story: 'Quadrado arredondado fica reservado a órgãos, departamentos e integrações.',
      },
    },
  },
};

export const Interativo: Story = {
  name: 'Estado · interativo',
  args: { size: 'large', onClick: () => {} },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O nome acessível descreve a ação, não só a pessoa.
    await expect(
      canvas.getByRole('button', { name: 'Ver perfil de Maria de Fátima Souza' }),
    ).toBeVisible();
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: { loading: true, size: 'large' },
};

export const ComBadgeDeStatus: Story = {
  name: 'Composição · badge de status',
  parameters: {
    docs: {
      description: {
        story:
          'O badge de status é composição com o Badge na variante dot, nunca propriedade nativa do Avatar. Não usar em grupo com mais de 3 itens.',
      },
    },
  },
  render: (args) => (
    <Avatar {...args} size="x-large" badge={<Badge dot severity="success" />} />
  ),
};

export const Grupo: Story = {
  name: 'AvatarGroup · com excedente',
  render: () => (
    <AvatarGroup
      size="large"
      pessoas={[
        { nome: 'Maria de Fátima Souza' },
        { nome: 'João Silva' },
        { nome: 'Carlos Andrade' },
        { nome: 'Ana Beatriz Lima' },
        { nome: 'Pedro Henrique Costa' },
        { nome: 'Luiza Martins' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'e mais 2 responsáveis' })).toBeVisible();
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { EmptyState } from './EmptyState';
import { Chip } from '../../atoms/Badge/Badge';

const meta = {
  title: 'Moléculas/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Estado vazio. Spec: `03-components/empty-state.md` v2.0.0. Regra central: primeiro uso e busca sem resultado nunca compartilham conteúdo, porque a causa é diferente.',
      },
    },
  },
  args: {
    titulo: 'Nenhum lançamento registrado ainda',
    descricao: 'Registre o primeiro lançamento de diária para acompanhar a prestação de contas.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimeiroUso: Story = {
  name: 'Situação · primeiro uso',
  args: { acaoPrimaria: { rotulo: 'Registrar lançamento' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Registrar lançamento' });
    // No tamanho lg em página completa, o botão primário recebe foco.
    await expect(botao).toHaveFocus();
  },
};

export const BuscaSemResultado: Story = {
  name: 'Situação · busca sem resultado',
  args: {
    situacao: 'busca-sem-resultado',
    titulo: 'Nenhum resultado para os filtros aplicados',
    descricao: 'Ajuste o período ou a competência para ampliar a busca.',
    acaoPrimaria: { rotulo: 'Limpar filtros' },
    filtrosAplicados: (
      <>
        <Chip label="Março/2025" variant="read-only" size="sm" />
        <Chip label="São Luís" variant="read-only" size="sm" />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Os filtros aplicados aparecem como chips acima do ícone para reforçar a causa. Nunca culpar o usuário no texto.',
      },
    },
  },
};

export const Erro: Story = {
  name: 'Situação · erro',
  args: {
    situacao: 'erro',
    titulo: 'Não foi possível carregar os lançamentos',
    descricao: 'Verifique sua conexão e tente novamente.',
    acaoPrimaria: { rotulo: 'Tentar novamente' },
    acaoSecundaria: { rotulo: 'Contatar suporte' },
    codigoErro: 'Código do erro: SIGEP-504',
  },
  parameters: {
    docs: {
      description: {
        story:
          '"Tentar novamente" está sempre presente. O código técnico fica discreto abaixo da descrição, nunca em destaque.',
      },
    },
  },
};

export const SemPermissao: Story = {
  name: 'Situação · sem permissão',
  args: {
    situacao: 'permissao',
    descricao:
      'Seu perfil não permite registrar lançamentos. Procure o gestor da sua unidade para solicitar acesso.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Mesmo título do primeiro uso, com o botão de criação omitido.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Sem permissão não oferece ação de criar.
    await expect(canvasElement.querySelector('.citie-empty__acoes')).toBeNull();
  },
};

export const Medio: Story = {
  name: 'Tamanho · md (painel lateral)',
  args: { size: 'md', acaoPrimaria: { rotulo: 'Registrar lançamento' } },
};

export const Pequeno: Story = {
  name: 'Tamanho · sm (widget)',
  args: { size: 'sm', titulo: 'Nenhum benefício vencendo', descricao: 'Nada exige ação nos próximos 30 dias.' },
};

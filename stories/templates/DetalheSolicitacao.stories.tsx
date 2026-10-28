import type { Meta, StoryObj } from '@storybook/react-vite';
import { DetalheSolicitacaoTela, type DetalheSolicitacaoTelaProps } from '@/components/application/telas/detalhe-solicitacao';

const meta = {
  title: 'Templates/Sistemas/Detalhe de solicitação',
  component: DetalheSolicitacaoTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "DetailHeader com situação, Editar sempre visível e menu de ações com exclusão confirmada. Abas de Dados, Documentos e Histórico, este do mais recente ao mais antigo." } },
  },
  argTypes: {
    contained: { control: 'boolean' },
    estado: { control: 'inline-radio', options: ['carregado', 'carregando', 'erro'] },
    situacao: { control: 'select', options: ['Em análise', 'Aguardando documentos', 'Aprovada', 'Agendada', 'Concluída', 'Negada'] },
    initialTab: { control: 'inline-radio', options: ['dados', 'documentos', 'historico'] },
  },
} satisfies Meta<DetalheSolicitacaoTelaProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div
        className="relative h-[720px] overflow-hidden"
        style={{ ['--template-preview-height' as string]: '720px' }}
      >
        <Story />
      </div>
    ),
  ],
};

/** Viewport de celular. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

/** Aba de documentos. */
export const Documentos: Story = {
  args: { initialTab: 'documentos' },
};

/** Aba de histórico com a linha do tempo. */
export const Historico: Story = {
  args: { initialTab: 'historico' },
};

/** Situação aprovada. */
export const Aprovada: Story = {
  args: { situacao: 'Aprovada' },
};

/** Situação negada. */
export const Negada: Story = {
  args: { situacao: 'Negada' },
};

/** Esqueleto no cabeçalho e no corpo. */
export const Carregando: Story = {
  args: { estado: 'carregando' },
};

/** Falha de carregamento com nova tentativa. */
export const ErroAoCarregar: Story = {
  args: { estado: 'erro' },
};

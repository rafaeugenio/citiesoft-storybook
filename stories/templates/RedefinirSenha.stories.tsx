import type { Meta, StoryObj } from '@storybook/react-vite';
import { RedefinirSenhaTela, type RedefinirSenhaTelaProps } from '@/components/application/telas/redefinir-senha';

const meta = {
  title: 'Templates/Sistemas/Redefinir senha',
  component: RedefinirSenhaTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "Nova senha com confirmação, indicador de força e requisitos visíveis. O botão só libera com todos os requisitos atendidos e a confirmação igual." } },
  },
  argTypes: {
    contained: { control: 'boolean' },
    layout: { control: 'inline-radio', options: ['card', 'dividido'] },
    initialState: { control: 'inline-radio', options: ['formulario', 'expirado', 'sucesso'] },
  },
} satisfies Meta<RedefinirSenhaTelaProps>;

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

/** Layout dividido, espelhando o login. */
export const Dividido: Story = {
  args: { layout: 'dividido' },
};

/** Requisitos parcialmente atendidos. */
export const SenhaFraca: Story = {
  args: { initialPassword: 'citie2026' },
};

/** Senha forte e confirmação divergente, com erro associado ao campo. */
export const ConfirmacaoDiferente: Story = {
  args: { initialPassword: 'Citiesoft@2026', initialConfirmation: 'Citiesoft@2025' },
};

/** Todos os requisitos atendidos e confirmação igual: botão liberado. */
export const Pronta: Story = {
  args: { initialPassword: 'Citiesoft@2026', initialConfirmation: 'Citiesoft@2026' },
};

/** Redefinição em andamento. */
export const Salvando: Story = {
  args: { initialPassword: 'Citiesoft@2026', initialConfirmation: 'Citiesoft@2026', initialLoading: true },
};

/** Falha técnica ao salvar. */
export const FalhaTecnica: Story = {
  args: { initialPassword: 'Citiesoft@2026', initialConfirmation: 'Citiesoft@2026', initialError: true },
};

/** Link vencido: mensagem e novo envio. */
export const LinkExpirado: Story = {
  args: { initialState: 'expirado' },
};

/** Senha alterada: segue para o login, sem autenticar. */
export const Sucesso: Story = {
  args: { initialState: 'sucesso' },
};

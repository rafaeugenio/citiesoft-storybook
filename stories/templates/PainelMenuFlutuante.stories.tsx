import type { Meta, StoryObj } from '@storybook/react-vite';
import { PainelMenuFlutuanteTela } from '@/components/application/telas/painel-menu-flutuante';

const meta = {
  title: 'Templates/Sistemas/Painel com menu flutuante',
  component: PainelMenuFlutuanteTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Tela de trabalho com o DockBar embaixo: atalhos Nova solicitação, Buscar paciente, Agenda e Mensagens, mais um "Mais" que abre o ActionMenu para cima. O conteúdo reserva espaço no fim para o dock não cobrir a última linha. No desktop o dock se centraliza sobre o conteúdo e pode ser recolhido; no celular a barra lateral vira gaveta e o dock fica ao alcance do polegar.',
      },
    },
  },
} satisfies Meta<typeof PainelMenuFlutuanteTela>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa: o dock fica ancorado no contêiner. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div className="relative h-[720px] overflow-hidden" style={{ ['--template-preview-height' as string]: '720px' }}>
        <Story />
      </div>
    ),
  ],
};

/** Viewport de celular: gaveta de navegação no topo e dock embaixo. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

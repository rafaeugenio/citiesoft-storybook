import type { Meta, StoryObj } from '@storybook/react-vite';
import { PainelTfdTela } from '@/components/application/telas/painel-tfd';

const meta = {
  title: 'Templates/Sistemas/Painel TFD',
  component: PainelTfdTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Painel de acompanhamento do TFD: filtro global de período, indicadores, gráficos por mês, situação e especialidade e solicitações recentes. Todos os números saem da mesma matriz mensal, então fecham entre si em qualquer período. Segue o template tela-dashboard do Design System.',
      },
    },
  },
  argTypes: {
    periodoInicial: { control: 'inline-radio', options: ['trimestre', 'semestre', 'ano'] },
    estado: { control: 'inline-radio', options: ['pronto', 'carregando', 'sem-dados'] },
  },
} satisfies Meta<typeof PainelTfdTela>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div className="relative h-[760px] overflow-hidden" style={{ ['--template-preview-height' as string]: '760px' }}>
        <Story />
      </div>
    ),
  ],
};

/** Viewport de celular: a barra lateral vira gaveta e os blocos empilham. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

/** Esqueleto nos indicadores e gráficos, com o filtro de período já ativo. */
export const Carregando: Story = { args: { estado: 'carregando' } };

/** Período sem solicitações: estado vazio com sugestão de ampliar o período. */
export const SemDados: Story = { args: { estado: 'sem-dados' } };

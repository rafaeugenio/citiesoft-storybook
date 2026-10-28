import type { Meta, StoryObj } from '@storybook/react-vite';
import { WizardSolicitacaoTela, type WizardSolicitacaoTelaProps } from '@/components/application/telas/wizard-solicitacao';

const meta = {
  title: 'Templates/Sistemas/Wizard de nova solicitação',
  component: WizardSolicitacaoTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "Cinco etapas com Stepper: paciente, atendimento, trajeto, documentos e revisão. Cada etapa valida os próprios campos antes de liberar o avanço." } },
  },
  argTypes: {
    contained: { control: 'boolean' },
    initialStep: { control: { type: 'number', min: 0, max: 4 } },
  },
} satisfies Meta<WizardSolicitacaoTelaProps>;

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

/** Segunda etapa, com os dados anteriores preservados. */
export const Atendimento: Story = {
  args: { initialStep: 1 },
};

/** Terceira etapa: transporte, datas e acompanhante. */
export const Trajeto: Story = {
  args: { initialStep: 2 },
};

/** Quarta etapa: anexos com FileUpload. */
export const Documentos: Story = {
  args: { initialStep: 3 },
};

/** Revisão final com atalho de edição por etapa. */
export const Revisao: Story = {
  args: { initialStep: 4, prefilled: true },
};

/** Primeira etapa com erros de validação visíveis. */
export const ComErros: Story = {
  args: { initialShowErrors: true },
};

/** Envio final em andamento. */
export const Enviando: Story = {
  args: { initialStep: 4, prefilled: true, initialSubmitting: true },
};

/** Confirmação final com o protocolo. */
export const Concluido: Story = {
  args: { initialDone: true },
};

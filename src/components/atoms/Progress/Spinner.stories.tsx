import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Spinner } from './Progress';

const meta = {
  title: 'Átomos/Feedback/Spinner',
  component: Spinner,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Indicador de ação pontual em andamento, indeterminado por natureza. Spec: `03-components/progress-indicators.md` v2.0.0. Regra dura: o nome acessível descreve a operação em curso, nunca "Carregando" solto — em seção e em overlay a mensagem é obrigatória; só dentro de botão o contexto visual dispensa texto.\n\n**Quando usar este e não a ProgressBar:** o spinner serve quando não há progresso algum a comunicar — a espera fica entre 500ms e 3 segundos e o sistema não conhece percentual nem etapa (submissão de formulário, autenticação, validação assíncrona de CPF ou CEP, consulta a sistema externo de duração imprevisível). Assim que existe progresso mensurável ou etapa nomeada acima de 3 segundos, o componente certo é a `ProgressBar`. Abaixo de 500ms não se usa indicador nenhum, e carregamento estrutural de lista, tabela ou formulário pede Skeleton. Nunca empilhar dois spinners na mesma tela: para painéis carregando em paralelo, Skeleton por painel.',
      },
    },
  },
  args: {
    label: 'Carregando a lista de processos',
  },
} satisfies Meta<typeof Spinner>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SpinnerTamanhos: Story = {
  name: 'Spinner · tamanhos',
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner label="Carregando a lista de processos" size="sm" />
      <Spinner label="Carregando o cadastro do servidor" size="md" />
      <Spinner label="Carregando o relatório de diárias" size="lg" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O nome descreve a operação, nunca "Carregando" solto.
    await expect(canvas.getByRole('status', { name: 'Carregando a lista de processos' })).toBeVisible();
  },
};

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
          'Indicador de ação pontual em andamento, indeterminado por natureza. Spec: `03-components/progress-indicators.md` v2.0.0. Regra dura: o nome acessível descreve a operação em curso, nunca "Carregando" solto — em seção e em overlay a mensagem é obrigatória; só dentro de botão o contexto visual dispensa texto.\n\n**Quando usar este e não a ProgressBar:** o spinner serve quando não há progresso algum a comunicar — a espera fica entre 500ms e 3 segundos e o sistema não conhece percentual nem etapa (submissão de formulário, autenticação, validação assíncrona de CPF ou CEP, consulta a sistema externo de duração imprevisível). Assim que existe progresso mensurável ou etapa nomeada acima de 3 segundos, o componente certo é a `ProgressBar`. Abaixo de 500ms não se usa indicador nenhum, e carregamento estrutural de lista, tabela ou formulário pede Skeleton. Nunca empilhar dois spinners na mesma tela: para painéis carregando em paralelo, Skeleton por painel.\n\n**Quando não usar:** abaixo de 500ms, porque o giro aparece e some antes de significar alguma coisa e a tela passa a impressão de piscar sem motivo. Para o carregamento estrutural de uma listagem, tabela ou formulário: o spinner solto no meio da área deixa o servidor sem saber quantas linhas virão e a tela salta quando o conteúdo entra; use `Composições de Skeleton`. Para operação acima de 3 segundos com percentual ou etapa conhecidos: o giro perpétuo não distingue "quase pronto" de "travado" e o servidor recarrega a página no meio da gravação, o que é justamente onde se perde lançamento; use `ProgressBar`. Quando a espera precisa impedir que a pessoa continue mexendo em campos que estão sendo gravados, o spinner sozinho não bloqueia nada: use `BlockUI` sobre a área. E spinner em seção ou overlay sem mensagem que nomeie a operação fica proibido: "Carregando" solto não diz o que esperar e não atende a exigência de acessibilidade (e-MAG, WCAG 2.2 AA).',
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

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Stepper } from './Navigation';

const meta = {
  title: 'Moléculas/Navegação/Stepper',
  component: Stepper,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Indicador de etapas que responde "em qual etapa deste fluxo estou e quanto falta" (ex.: solicitação de TFD, prestação de contas, lançamento de adiantamento). Spec: `03-components/breadcrumb-stepper.md` v2.0.0. Equivalente PrimeNG: `p-stepper`.',
          '',
          '**Quando usar**: formulário com mais de 7 campos ou com etapas semanticamente distintas; fluxo com dependência entre etapas; processo com estado persistente que o usuário pode retomar; fluxo que exige revisão e confirmação antes do envio final. Nunca ultrapasse 7 etapas em um único Stepper.',
          '',
          '**Quando não usar**: fluxo de 2 telas simples (duas páginas com botão "Próximo" bastam); etapas de ordem irrelevante que cabem em um formulário curto único; decisão binária de aprovação (é um Dialog de confirmação).',
          '',
          '**Stepper ou Tabs?** O Stepper serve a fluxo com etapas dependentes, em que a etapa seguinte só faz sentido depois da anterior. Navegação entre seções de conteúdo de mesmo nível, sem formulário e sem dependência, é Tabs, nunca Stepper.',
          '',
          '**Stepper ou Breadcrumb?** Stepper é orientação temporal dentro de um processo; Breadcrumb é orientação espacial dentro da hierarquia de telas.',
          '',
          'É molécula: resolve uma tarefa única, situar o usuário no progresso de um fluxo, sem chrome de aplicação nem regra de permissão.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Etapas da solicitação',
    etapas: [
      { id: '1', rotulo: 'Identificação', sublabel: 'Dados do servidor', estado: 'concluida' },
      { id: '2', rotulo: 'Deslocamento', sublabel: 'Destino e período', estado: 'concluida' },
      { id: '3', rotulo: 'Documentos', sublabel: 'Laudo e comprovantes', estado: 'atual' },
      { id: '4', rotulo: 'Revisão', sublabel: 'Conferência final', estado: 'pendente' },
    ],
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Passos: Story = {
  name: 'Stepper · horizontal linear',
  render: () => (
    <Stepper
      label="Etapas da solicitação"
      etapas={[
        { id: '1', rotulo: 'Identificação', sublabel: 'Dados do servidor', estado: 'concluida' },
        { id: '2', rotulo: 'Deslocamento', sublabel: 'Destino e período', estado: 'concluida' },
        { id: '3', rotulo: 'Documentos', sublabel: 'Laudo e comprovantes', estado: 'atual' },
        { id: '4', rotulo: 'Revisão', sublabel: 'Conferência final', estado: 'pendente' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('list', { name: 'Etapas da solicitação' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Documentos/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
    // No modo linear, a etapa futura não é alcançável.
    await expect(canvas.getByRole('button', { name: /Revisão/ })).toBeDisabled();
    // O estado vai por texto, não só por cor.
    await expect(canvas.getAllByText('(concluída)')).toHaveLength(2);
  },
};

export const PassosComErro: Story = {
  name: 'Stepper · etapa com erro',
  render: () => (
    <Stepper
      label="Etapas da solicitação"
      linear={false}
      etapas={[
        { id: '1', rotulo: 'Identificação', estado: 'concluida' },
        { id: '2', rotulo: 'Deslocamento', estado: 'erro' },
        { id: '3', rotulo: 'Documentos', estado: 'atual' },
      ]}
    />
  ),
};

export const PassosVerticais: Story = {
  name: 'Stepper · vertical compacto',
  render: () => (
    <Stepper
      label="Etapas da solicitação"
      orientacao="vertical"
      compacto
      etapas={[
        { id: '1', rotulo: 'Identificação', sublabel: 'Oculto no compacto', estado: 'concluida' },
        { id: '2', rotulo: 'Documentos', sublabel: 'Oculto no compacto', estado: 'atual' },
        { id: '3', rotulo: 'Revisão', estado: 'pendente' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    // O sublabel some no modo compacto.
    await expect(within(canvasElement).queryByText('Oculto no compacto')).toBeNull();
  },
};

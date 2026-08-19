import { useState, type ComponentProps } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, Card, Input, Select } from '../../../src';
import { Wizard, WizardCampos, WizardItem, WizardItens, WizardResumo } from './Wizard';

const ETAPAS = [
  { id: 'a', rotulo: 'Primeira etapa', sublabel: 'Grupo coeso de campos', estado: 'atual' as const },
  { id: 'b', rotulo: 'Segunda etapa', sublabel: 'Uma decisão', estado: 'pendente' as const },
  { id: 'c', rotulo: 'Terceira etapa', sublabel: 'Anexos', estado: 'pendente' as const },
  { id: 'd', rotulo: 'Revisão', sublabel: 'Conferência final', estado: 'pendente' as const },
];

/** Viewports do projeto, usadas nas histórias de responsividade. */
const VIEWPORTS = {
  desktopLargo: { name: '1920 · desktop largo', styles: { width: '1920px', height: '1080px' } },
  desktop: { name: '1366 · desktop padrão', styles: { width: '1366px', height: '768px' } },
  tablet: { name: '768 · tablet', styles: { width: '768px', height: '1024px' } },
  celular: { name: '375 · celular', styles: { width: '375px', height: '812px' } },
};

const meta = {
  title: 'Templates/Wizard/Fluxo em etapas',
  component: Wizard,
  tags: ['template', 'a11y'],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: VIEWPORTS },
    docs: {
      description: {
        component: [
          'Estrutura de tela para tarefa longa demais para um formulário único, quebrada em etapas validáveis isoladamente. Anatomia extraída de `design-system/09-templates/tela-wizard.md` v1.0.0.',
          '',
          '**Regiões, na ordem fixa da spec**: 1. indicador de progresso no topo; 2. corpo da etapa atual, com uma decisão ou um grupo coeso de campos; 3. navegação fixa com "Voltar" e "Avançar" no rodapé; 4. resumo final revisando todas as decisões antes da confirmação.',
          '',
          '**Duas variantes de indicador**: `barra` para fluxo longo e estritamente linear (a `ProgressBar` carrega o "etapa N de M"); `stepper` para fluxo de configuração com ramificação ou etapas opcionais, em coluna vertical numerada.',
          '',
          '**Regra que o template garante**: etapa futura não vaza informação. O corpo só renderiza a etapa atual, e o template apaga o `sublabel` das etapas pendentes, de modo que a etapa futura aparece apenas como rótulo colapsado no stepper.',
          '',
          '**Acessibilidade**: um `main` por tela, `h1` do fluxo e `h2` da etapa sem salto de nível; o Stepper expõe o estado de cada etapa por texto além da cor e marca a atual com `aria-current="step"`; a cada troca de etapa o foco vai para o início do corpo novo, senão quem usa teclado fica preso no rodapé.',
          '',
          '**Componentes do sistema usados**: `ProgressBar`, `Stepper`, `Button`, `Input`, `Select`, `DatePicker`, `Card`, `Message`, `Toast`/`ToastStack`, `ConfirmDialog`.',
        ].join('\n'),
      },
    },
  },
  args: {
    titulo: 'Fluxo em quatro etapas',
    descricao: 'O template não conhece o domínio: título, campos e resumo chegam por props e slots.',
    etapas: ETAPAS,
    etapaAtualId: 'a',
    rotuloIndicador: 'Etapas do fluxo',
    etapaTitulo: 'Primeira etapa',
    etapaDescricao: 'Uma decisão ou um grupo coeso de campos por tela.',
    rotuloAvancar: 'Avançar',
  },
} satisfies Meta<typeof Wizard>;

export default meta;
type Story = StoryObj<typeof meta>;

const camposDeExemplo = (
  <WizardCampos>
    <Input label="Campo de texto" required helper="Regra de preenchimento do campo." />
    <Select
      label="Campo de escolha"
      required
      options={[
        { value: '1', label: 'Primeira opção' },
        { value: '2', label: 'Segunda opção' },
      ]}
      placeholder="Selecione uma opção"
    />
  </WizardCampos>
);

export const IndicadorEmBarra: Story = {
  name: 'Indicador em barra · fluxo linear',
  args: { indicador: 'barra' },
  render: (args) => <Wizard {...args}>{camposDeExemplo}</Wizard>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O indicador reflete a etapa atual: barra e corpo nunca dessincronizam.
    await expect(canvas.getByRole('progressbar', { name: 'Etapas do fluxo' })).toBeVisible();
    await expect(canvas.getByText(/etapa 1 de 4/)).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 1 })).toHaveTextContent('Fluxo em quatro etapas');
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Primeira etapa');
    // Primeira etapa: não há para onde voltar.
    await expect(canvas.getByRole('button', { name: 'Voltar' })).toBeDisabled();
  },
};

export const IndicadorEmStepper: Story = {
  name: 'Indicador em stepper vertical · fluxo com ramificação',
  args: {
    indicador: 'stepper',
    etapaAtualId: 'b',
    etapaTitulo: 'Segunda etapa',
    etapas: [
      { ...ETAPAS[0], estado: 'concluida' },
      { ...ETAPAS[1], estado: 'atual' },
      ETAPAS[2],
      ETAPAS[3],
    ],
  },
  render: (args) => <Wizard {...args}>{camposDeExemplo}</Wizard>,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: /Segunda etapa/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
    // Etapa futura aparece só como rótulo colapsado: o sublabel não vaza.
    await expect(canvas.queryByText('Anexos')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: /Terceira etapa/ })).toBeDisabled();
  },
};

export const EtapaComBloqueio: Story = {
  name: 'Etapa com bloqueio · avanço desabilitado',
  args: {
    indicador: 'stepper',
    avancarDesabilitado: true,
    aviso: (
      <Card titulo="Slot de aviso">
        A página preenche este slot com um Message de erro quando a validação da etapa falha.
      </Card>
    ),
  },
  render: (args) => <Wizard {...args}>{camposDeExemplo}</Wizard>,
};

export const ResumoFinal: Story = {
  name: 'Resumo final · revisão antes da confirmação',
  args: {
    indicador: 'barra',
    etapaAtualId: 'd',
    etapaTitulo: 'Revisão',
    etapaDescricao: 'Confira as decisões das etapas anteriores antes de confirmar.',
    rotuloAvancar: 'Confirmar',
    etapas: [
      { ...ETAPAS[0], estado: 'concluida' },
      { ...ETAPAS[1], estado: 'concluida' },
      { ...ETAPAS[2], estado: 'concluida' },
      { ...ETAPAS[3], estado: 'atual' },
    ],
  },
  render: (args) => (
    <Wizard
      {...args}
      resumo={
        <WizardResumo>
          <Card
            titulo="Primeira etapa"
            rodape={<Button variant="text">Editar primeira etapa</Button>}
          >
            <WizardItens>
              <WizardItem rotulo="Campo de texto" valor="Valor decidido na etapa" />
              <WizardItem rotulo="Campo de escolha" valor="Primeira opção" />
            </WizardItens>
          </Card>
          <Card
            titulo="Segunda etapa"
            rodape={<Button variant="text">Editar segunda etapa</Button>}
          >
            <WizardItens>
              <WizardItem rotulo="Decisão" valor="Segunda opção" />
            </WizardItens>
          </Card>
        </WizardResumo>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText(/etapa 4 de 4/)).toBeVisible();
    // Cada bloco do resumo devolve o usuário à etapa correspondente.
    await expect(canvas.getByRole('button', { name: 'Editar primeira etapa' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Confirmar' })).toBeEnabled();
  },
};

export const NavegacaoDevolveOFoco: Story = {
  name: 'Troca de etapa · foco vai para o corpo novo',
  args: { indicador: 'stepper' },
  render: (args) => <WizardNavegavel {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Avançar' }));

    const corpo = canvas.getByRole('group', { name: 'Segunda etapa' });
    await waitFor(() => expect(corpo).toHaveFocus());
    await expect(canvas.getByRole('button', { name: 'Voltar' })).toBeEnabled();
  },
};

/** Casca navegável mínima: só troca a etapa, sem regra de domínio. */
function WizardNavegavel(args: ComponentProps<typeof Wizard>) {
  const [indice, setIndice] = useState(0);

  const etapas = ETAPAS.map((etapa, posicao) => ({
    ...etapa,
    estado:
      posicao < indice ? ('concluida' as const)
      : posicao === indice ? ('atual' as const)
      : ('pendente' as const),
  }));

  return (
    <Wizard
      {...args}
      etapas={etapas}
      etapaAtualId={etapas[indice].id}
      etapaTitulo={etapas[indice].rotulo}
      onVoltar={() => setIndice((atual) => Math.max(atual - 1, 0))}
      onAvancar={() => setIndice((atual) => Math.min(atual + 1, etapas.length - 1))}
    >
      {camposDeExemplo}
    </Wizard>
  );
}

/* ---------- Responsividade ---------- */

export const Em1920: Story = {
  name: 'Responsivo · 1920',
  args: { indicador: 'stepper' },
  globals: { viewport: { value: 'desktopLargo' } },
  render: (args) => <Wizard {...args}>{camposDeExemplo}</Wizard>,
};

export const Em1366: Story = {
  name: 'Responsivo · 1366',
  args: { indicador: 'stepper' },
  globals: { viewport: { value: 'desktop' } },
  render: (args) => <Wizard {...args}>{camposDeExemplo}</Wizard>,
};

export const Em768: Story = {
  name: 'Responsivo · 768',
  args: { indicador: 'stepper' },
  globals: { viewport: { value: 'tablet' } },
  render: (args) => <Wizard {...args}>{camposDeExemplo}</Wizard>,
};

export const Em375: Story = {
  name: 'Responsivo · 375',
  args: { indicador: 'barra' },
  globals: { viewport: { value: 'celular' } },
  render: (args) => <Wizard {...args}>{camposDeExemplo}</Wizard>,
};

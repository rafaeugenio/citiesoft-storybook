import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiSearchLine, RiGlobalLine, RiBookOpenLine } from '@remixicon/react';
import { WebSearch, type WebSearchStep } from '@/components/application/web-search/web-search';
import { Button } from '@/components/base/buttons/button';

const meta = {
  title: 'Blocos/WebSearch',
  component: WebSearch,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    run: { control: 'boolean' },
    stepInterval: { control: { type: 'number', min: 100, step: 100 } },
    startDelay: { control: { type: 'number', min: 0, step: 100 } },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof WebSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

const passos: WebSearchStep[] = [
  {
    label: 'Pesquisou',
    query: 'prazo de prestação de contas convênios municipais 2026',
    icon: RiSearchLine,
    meta: '3 resultados',
    dwell: 1400,
    sources: [
      { title: 'Prazos de prestação de contas para municípios', domain: 'www.gov.br', icon: <RiGlobalLine className="size-3" /> },
      { title: 'Guia prático de convênios', domain: 'www.tce.exemplo.gov.br' },
      { title: 'Perguntas frequentes sobre repasses', domain: 'portal.exemplo.org.br', brand: 'google' },
    ],
  },
  {
    label: 'Buscou no X por',
    query: 'prestação de contas convênio',
    brand: 'x',
    meta: '7 publicações',
    sources: [
      { title: 'Thread sobre novas regras de repasse', domain: 'x.com', brand: 'x' },
      { title: 'Comentários de gestores municipais', domain: 'x.com', brand: 'x' },
    ],
  },
  {
    label: 'Abriu o repositório da documentação',
    brand: 'github',
    meta: '1 página',
    sources: [{ title: 'Exemplos de relatório de execução', domain: 'github.com', brand: 'github' }],
  },
  { label: 'Leu a norma completa', icon: RiBookOpenLine },
];

export const Padrao: Story = {
  args: { steps: passos },
};

export const ComTitulo: Story = {
  args: {
    steps: [
      { label: 'Pesquisa sobre prestação de contas', icon: RiSearchLine, heading: true },
      ...passos.map((p) => ({ ...p })),
    ],
  },
};

export const SemFontes: Story = {
  args: {
    steps: [
      { label: 'Pesquisou', query: 'horário de funcionamento do protocolo', icon: RiSearchLine },
      { label: 'Abriu a página oficial', icon: RiGlobalLine },
      { label: 'Extraiu os horários de atendimento', icon: RiBookOpenLine },
    ],
  },
};

export const IndicadorPersonalizado: Story = {
  args: { steps: passos, working: 'Pesquisando' },
};

export const SemIndicador: Story = {
  args: { steps: passos, working: false },
};

export const IniciaPorBotao: Story = {
  render: function Render(args) {
    const [rodando, setRodando] = useState(false);
    const [rodada, setRodada] = useState(0);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Button size="small" onClick={() => setRodando((v) => !v)}>
            {rodando ? 'Pausar' : 'Iniciar'}
          </Button>
          <Button
            size="small"
            variant="secondary"
            onClick={() => {
              setRodando(false);
              setRodada((n) => n + 1);
            }}
          >
            Reiniciar
          </Button>
        </div>
        <WebSearch key={rodada} {...args} run={rodando} />
      </div>
    );
  },
  args: { steps: passos },
};

export const ProgressoControlado: Story = {
  render: function Render(args) {
    const [revelado, setRevelado] = useState(2);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="small" variant="secondary" onClick={() => setRevelado((n) => Math.max(0, n - 1))}>
            Voltar
          </Button>
          <Button size="small" onClick={() => setRevelado((n) => n + 1)}>
            Avançar
          </Button>
          <span className="text-body-regular text-text-secondary">Unidades reveladas: {revelado}</span>
        </div>
        <WebSearch {...args} revealed={revelado} />
      </div>
    );
  },
  args: { steps: passos },
};

export const ComCallbackAoConcluir: Story = {
  render: function Render(args) {
    const [concluido, setConcluido] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <WebSearch {...args} onComplete={() => setConcluido(true)} />
        {concluido ? <p className="text-body-medium text-text-primary">Pesquisa concluída.</p> : null}
      </div>
    );
  },
  args: { steps: passos, stepInterval: 400 },
};

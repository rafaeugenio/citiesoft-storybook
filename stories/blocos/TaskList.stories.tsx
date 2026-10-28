import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiFileSearchLine, RiCodeLine, RiCheckboxCircleLine } from '@remixicon/react';
import { TaskList, type TaskListTask } from '@/components/application/task-list/task-list';
import { Button } from '@/components/base/buttons/button';

const meta = {
  title: 'Blocos/TaskList',
  component: TaskList,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    collapseOnComplete: { control: 'inline-radio', options: [false, true, 'all'] },
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
} satisfies Meta<typeof TaskList>;

export default meta;
type Story = StoryObj<typeof meta>;

const tarefas: TaskListTask[] = [
  {
    title: 'Localizou os arquivos do projeto',
    runningTitle: 'Localizando os arquivos do projeto',
    icon: RiFileSearchLine,
    steps: [
      { label: 'Varreu 52 arquivos' },
      {
        label: 'Abriu',
        chips: [{ label: 'relatorio-mensal.xlsx' }, { label: 'contratos-2026.pdf' }],
      },
    ],
  },
  {
    title: 'Revisou as regras de negócio',
    runningTitle: 'Revisando as regras de negócio',
    icon: RiCodeLine,
    steps: [
      { label: 'Comparou os critérios de aceite com a listagem' },
      { label: 'Conferiu o cálculo de', chips: [{ label: 'saldo-devedor.ts' }] },
      { label: 'Encontrou 2 divergências' },
    ],
  },
  {
    title: 'Gerou o resumo final',
    runningTitle: 'Gerando o resumo final',
    icon: RiCheckboxCircleLine,
    steps: [{ label: 'Montou o documento com os achados' }],
  },
];

export const Padrao: Story = {
  args: { tasks: tarefas },
  render: (args) => <TaskList key={String(args.collapseOnComplete)} {...args} />,
};

export const RecolheAoConcluir: Story = {
  args: { tasks: tarefas, collapseOnComplete: true, stepInterval: 500 },
};

export const RecolheTudoNoFim: Story = {
  args: { tasks: tarefas, collapseOnComplete: 'all', stepInterval: 500 },
};

export const IndicadorPersonalizado: Story = {
  args: { tasks: tarefas, working: 'Analisando' },
};

export const SemIndicador: Story = {
  args: { tasks: tarefas, working: false },
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
        <TaskList key={rodada} {...args} run={rodando} />
      </div>
    );
  },
  args: { tasks: tarefas },
};

export const ProgressoControlado: Story = {
  render: function Render(args) {
    const total = tarefas.reduce((soma, t) => soma + 1 + t.steps.length, 0);
    const [revelado, setRevelado] = useState(3);
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Button size="small" variant="secondary" onClick={() => setRevelado((n) => Math.max(0, n - 1))}>
            Voltar
          </Button>
          <Button size="small" onClick={() => setRevelado((n) => Math.min(total, n + 1))}>
            Avançar
          </Button>
          <span className="text-body-regular text-text-secondary">
            {revelado} de {total}
          </span>
        </div>
        <TaskList {...args} revealed={revelado} />
      </div>
    );
  },
  args: { tasks: tarefas },
};

export const ComCallbackAoConcluir: Story = {
  render: function Render(args) {
    const [concluido, setConcluido] = useState(false);
    return (
      <div className="flex flex-col gap-4">
        <TaskList {...args} onComplete={() => setConcluido(true)} />
        {concluido ? (
          <p className="text-body-medium text-text-primary">Execução concluída.</p>
        ) : null}
      </div>
    );
  },
  args: { tasks: tarefas, stepInterval: 400 },
};

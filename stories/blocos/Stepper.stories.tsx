import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button } from '@/components/base/buttons/button';
import { Stepper, type StepperStep } from '@/components/application/stepper/stepper';

const etapas: StepperStep[] = [
  { key: 'paciente', label: 'Paciente', description: 'Identificação e contato' },
  { key: 'atendimento', label: 'Atendimento', description: 'Especialidade e unidade de destino' },
  { key: 'transporte', label: 'Transporte', description: 'Tipo e acompanhante', optional: true },
  { key: 'documentos', label: 'Documentos', description: 'Laudo e encaminhamento' },
  { key: 'revisao', label: 'Revisão', description: 'Conferir e enviar' },
];

const meta = {
  title: 'Blocos/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  args: { steps: etapas, current: 1, onStepClick: fn(), 'aria-label': 'Etapas da nova solicitação' },
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    clickable: { control: 'inline-radio', options: [false, 'completed', 'all'] },
    current: { control: { type: 'number', min: 0, max: 4 } },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {};

export const Vertical: Story = { args: { orientation: 'vertical' } };

export const ConcluidasClicaveis: Story = { args: { current: 3, clickable: 'completed' } };

export const TodasClicaveis: Story = { args: { current: 2, clickable: 'all' } };

export const ComErro: Story = {
  args: {
    current: 2,
    clickable: 'completed',
    steps: etapas.map((e) =>
      e.key === 'atendimento' ? { ...e, status: 'error' as const, errorMessage: 'Informe a unidade de destino.' } : e,
    ),
  },
};

export const VerticalComErro: Story = { args: { ...ComErro.args, orientation: 'vertical' } };

export const EtapaDesabilitada: Story = {
  args: {
    current: 1,
    clickable: 'all',
    steps: etapas.map((e) => (e.key === 'revisao' ? { ...e, isDisabled: true } : e)),
  },
};

export const Interativo: Story = {
  render: function Render(args) {
    const [atual, setAtual] = useState(0);
    return (
      <div className="flex flex-col gap-6">
        <Stepper {...args} current={atual} clickable="completed" onStepClick={(i) => setAtual(i)} />
        <div className="flex gap-2">
          <Button variant="secondary" disabled={atual === 0} onClick={() => setAtual((a) => a - 1)}>
            Voltar
          </Button>
          <Button disabled={atual === etapas.length - 1} onClick={() => setAtual((a) => a + 1)}>
            Avançar
          </Button>
        </div>
      </div>
    );
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  args: { current: 2 },
};

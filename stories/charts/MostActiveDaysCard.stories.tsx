import { useState, type ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { MostActiveDaysCard } from '@/components/application/medical/most-active-days-card';
import type { SelectedDay } from '@/components/application/medical/medical-data';

type MostActiveDaysCardProps = NonNullable<Parameters<typeof MostActiveDaysCard>[0]>;

const meta = {
  title: 'Charts/MostActiveDaysCard',
  component: MostActiveDaysCard as ComponentType<MostActiveDaysCardProps>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Calendário anual contínuo com anéis de atividade por dia. A rolagem percorre os meses de janeiro a dezembro e o seletor no topo acompanha o mês visível. Dias futuros aparecem apenas com as trilhas vazias.',
      },
    },
  },
} satisfies Meta<MostActiveDaysCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão',
  render: (args) => (
    <div className="w-[560px]">
      <MostActiveDaysCard {...args} />
    </div>
  ),
};

export const DiaSelecionado: Story = {
  name: 'Com dia selecionado',
  args: { selectedDay: { month: 5, day: 18 } },
  render: (args) => (
    <div className="w-[560px]">
      <MostActiveDaysCard {...args} />
    </div>
  ),
};

export const Interativo: Story = {
  name: 'Interativo (seleção controlada)',
  render: function Render() {
    const [dia, setDia] = useState<SelectedDay | null>({ month: 6, day: 10 });
    return (
      <div className="flex w-[560px] flex-col gap-3">
        <MostActiveDaysCard selectedDay={dia} onSelectDay={setDia} />
        <p className="text-body-medium text-text-secondary">
          {dia ? `Dia selecionado: ${dia.day}/${dia.month + 1}` : 'Nenhum dia selecionado'}
        </p>
      </div>
    );
  },
};

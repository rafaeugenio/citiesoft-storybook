import { useState, type ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ActivityRingsCard } from '@/components/application/medical/activity-rings-card';
import { MONTHS } from '@/components/application/medical/medical-data';

type ActivityRingsProps = NonNullable<Parameters<typeof ActivityRingsCard>[0]>;

const meta = {
  title: 'Charts/ActivityRingsCard',
  component: ActivityRingsCard as ComponentType<ActivityRingsProps>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Três anéis concêntricos de meta (Move, Exercise e Running) no estilo Apple Watch. Passar o mouse num anel realça o seu bloco de valor. Com `selectedDay`, anéis e valores passam a refletir o dia escolhido. Nenhum anel fecha 100%.',
      },
    },
  },
  argTypes: {
    selectedDay: { control: 'object' },
    className: { control: false },
  },
} satisfies Meta<ActivityRingsProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão (sem dia selecionado)',
  render: function Render(args) {
    return (
      <div className="w-[560px]">
        <ActivityRingsCard {...args} />
      </div>
    );
  },
};

export const DiaSelecionado: Story = {
  name: 'Dia selecionado',
  args: { selectedDay: { month: 2, day: 14 } },
  render: function Render(args) {
    return (
      <div className="w-[560px]">
        <ActivityRingsCard {...args} />
      </div>
    );
  },
};

export const SeletorDeDias: Story = {
  name: 'Alternando entre dias',
  render: function Render(args) {
    const dias = [
      { month: 0, day: 5 },
      { month: 3, day: 18 },
      { month: 8, day: 27 },
    ];
    const [indice, setIndice] = useState<number | null>(null);
    return (
      <div className="flex w-[560px] flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-lg border border-border-button-default px-3 py-1.5 text-body-regular text-text-primary"
            onClick={() => setIndice(null)}
          >
            Sem seleção
          </button>
          {dias.map((d, i) => (
            <button
              key={`${d.month}-${d.day}`}
              type="button"
              className="rounded-lg border border-border-button-default px-3 py-1.5 text-body-regular text-text-primary"
              onClick={() => setIndice(i)}
            >
              {d.day}/{d.month + 1} ({MONTHS[d.month]})
            </button>
          ))}
        </div>
        <ActivityRingsCard {...args} selectedDay={indice === null ? null : dias[indice]} />
      </div>
    );
  },
};

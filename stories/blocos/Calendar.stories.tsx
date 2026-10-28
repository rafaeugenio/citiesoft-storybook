import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { useState, type FC } from 'react';
import { CalendarDate } from '@internationalized/date';
import { CalendarShell } from '@/components/application/calendar/calendar-shell';
import { CalendarHeader } from '@/components/application/calendar/calendar-header';
import { CalendarMonthGrid } from '@/components/application/calendar/calendar-month-grid';
import { CALENDAR_SHOWCASE_MONTH } from '@/components/application/calendar/calendar-data';

const meta = {
  title: 'Blocos/Calendar',
  component: CalendarShell as FC<{ contained?: boolean }>,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: { contained: { control: 'boolean' } },
  decorators: [
    (Story) => (
      <div
        className="h-[760px] w-full"
        style={{ ['--template-preview-height' as string]: '760px' }}
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<{ contained?: boolean }>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TelaCompleta: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
  args: { contained: true } };

export const CabecalhoEGrade: Story = {
  parameters: { a11y: { test: 'todo' }, layout: 'padded' },
  decorators: [(Story) => <Story />],
  render: function Render() {
    const [month, setMonth] = useState<CalendarDate>(CALENDAR_SHOWCASE_MONTH);
    const [destaque, setDestaque] = useState<CalendarDate | null>(null);
    const monthLabel = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(
      new Date(month.year, month.month - 1, 1),
    );
    return (
      <div className="flex flex-col gap-3">
        <CalendarHeader
          month={month}
          monthLabel={monthLabel}
          onPrevMonth={() => setMonth((m) => m.subtract({ months: 1 }))}
          onNextMonth={() => setMonth((m) => m.add({ months: 1 }))}
          onSelectDate={(d) => {
            setMonth(d.set({ day: 1 }));
            setDestaque(d);
          }}
          onNewEvent={fn()}
        />
        <div className="rounded-3xl bg-background-secondary-default p-3">
          <CalendarMonthGrid
            month={month}
            highlightedDate={destaque}
            onHighlightEnd={() => setDestaque(null)}
          />
        </div>
      </div>
    );
  },
};

export const GradeCompacta: Story = {
  parameters: { a11y: { test: 'todo' }, layout: 'padded' },
  decorators: [(Story) => <Story />],
  render: function Render() {
    return (
      <div className="max-w-[720px] rounded-3xl bg-background-secondary-default p-3">
        <CalendarMonthGrid month={CALENDAR_SHOWCASE_MONTH} compact />
      </div>
    );
  },
};

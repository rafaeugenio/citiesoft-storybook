import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FilterBar, emptyFilterBarValue } from '@/components/application/filter-bar/filter-bar';
import type { FilterBarValue } from '@/components/application/filter-bar/filter-bar';
import { SOLICITACOES_LISTAGEM } from '../../.storybook/fixtures/listagem-solicitacoes';
import {
  CAMPOS_CONDICAO,
  ENTIDADE,
  FILTROS_SOLICITACAO,
  filtrarSolicitacoes,
} from './_apoio-listagem';

const meta = {
  title: 'Blocos/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    filters: FILTROS_SOLICITACAO,
    conditionFields: CAMPOS_CONDICAO,
    searchPlaceholder: 'Buscar por paciente ou protocolo',
    searchLabel: 'Buscar solicitações',
    resultNoun: ENTIDADE,
  },
  argTypes: {
    searchDelay: { control: { type: 'number', min: 0, max: 1000, step: 50 } },
  },
  render: function Render(args) {
    const [value, setValue] = useState<FilterBarValue>(args.defaultValue ?? emptyFilterBarValue);
    const resultados = filtrarSolicitacoes(SOLICITACOES_LISTAGEM, value);
    return (
      <div className="flex min-h-[420px] w-full max-w-[960px] flex-col gap-4">
        <FilterBar {...args} value={value} onChange={setValue} resultCount={resultados.length} />
        <p className="text-body-2-regular text-text-secondary">
          {resultados.length} de {SOLICITACOES_LISTAGEM.length} solicitações
        </p>
        <ul className="flex flex-col gap-1 text-body-2-regular text-text-primary">
          {resultados.slice(0, 5).map((r) => (
            <li key={r.id}>
              {r.protocolo} · {r.paciente} · {r.especialidade} · {r.status}
            </li>
          ))}
        </ul>
      </div>
    );
  },
} satisfies Meta<typeof FilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const SoBusca: Story = {
  args: { filters: [], conditionFields: undefined },
};

export const SemCondicoes: Story = {
  args: { conditionFields: undefined },
};

export const ComFiltrosAtivos: Story = {
  args: {
    defaultValue: {
      search: 'ana',
      selections: { status: ['Aprovada'], especialidade: ['Cardiologia', 'Oncologia'] },
      conditions: [{ id: 'c1', fieldId: 'origem', operatorId: 'igual', value: 'Codó' }],
    },
  },
};

export const EsperaDaBuscaMaior: Story = {
  args: { searchDelay: 800 },
};

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
  args: {
    defaultValue: {
      search: '',
      selections: { status: ['Agendada'] },
      conditions: [],
    },
  },
};

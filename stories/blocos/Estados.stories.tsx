import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiAddLine, RiFilter3Line, RiFolderOpenLine, RiLockLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { EmptyState } from '@/components/application/estados/empty-state';
import { ErrorState } from '@/components/application/estados/error-state';
import { TableSkeleton } from '@/components/application/estados/table-skeleton';

const meta = {
  title: 'Blocos/Estados',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    title: 'Nenhuma solicitação cadastrada',
    description: 'As solicitações de TFD criadas aparecem aqui.',
    action: (
      <Button size="small" leadingIcon={RiAddLine}>
        Nova solicitação
      </Button>
    ),
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    tone: { control: 'inline-radio', options: ['neutro', 'erro'] },
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vazio: Story = {};

export const VazioPorFiltro: Story = {
  args: {
    icon: RiFilter3Line,
    title: 'Nenhum resultado para os filtros aplicados',
    description: 'Ajustar ou remover filtros amplia a busca.',
    action: (
      <Button variant="secondary" size="small">
        Limpar filtros
      </Button>
    ),
  },
};

export const AcaoPrimariaESecundaria: Story = {
  args: {
    icon: RiFolderOpenLine,
    title: 'Nenhum documento anexado',
    description: 'Laudos e comprovantes anexados à solicitação aparecem aqui.',
    secondaryAction: (
      <Button variant="ghost" size="small">
        Ver requisitos
      </Button>
    ),
  },
};

export const SemAcao: Story = {
  args: { action: undefined, icon: RiLockLine, title: 'Sem registros neste período', description: 'Escolher outro período mostra mais dados.' },
};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="grid gap-4 md:grid-cols-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="rounded-3xl border border-border-button-default">
          <EmptyState {...args} size={size} />
        </div>
      ))}
    </div>
  ),
};

export const Erro: StoryObj<typeof ErrorState> = {
  render: () => (
    <div className="rounded-3xl border border-border-button-default">
      <ErrorState onRetry={() => {}} />
    </div>
  ),
};

export const ErroTamanhos: StoryObj<typeof ErrorState> = {
  render: () => (
    <div className="grid gap-4 md:grid-cols-3">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className="rounded-3xl border border-border-button-default">
          <ErrorState size={size} onRetry={() => {}} />
        </div>
      ))}
    </div>
  ),
};

export const ErroSemTentarNovamente: StoryObj<typeof ErrorState> = {
  render: () => (
    <div className="rounded-3xl border border-border-button-default">
      <ErrorState
        title="Acesso indisponível"
        description="O serviço de regulação está fora do ar. Os dados não foram alterados."
        secondaryAction={
          <Button variant="ghost" size="small">
            Falar com o suporte
          </Button>
        }
      />
    </div>
  ),
};

export const EsqueletoDeTabela: StoryObj<typeof TableSkeleton> = {
  render: () => (
    <div className="rounded-3xl border border-border-button-default">
      <TableSkeleton rows={6} columns={5} showSelection label="Carregando solicitações" />
    </div>
  ),
};

export const EsqueletoCompacto: StoryObj<typeof TableSkeleton> = {
  render: () => (
    <div className="rounded-3xl border border-border-button-default">
      <TableSkeleton rows={10} columns={4} density="compact" label="Carregando municípios" />
    </div>
  ),
};

export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="flex w-[390px] flex-col gap-4">
        <Story />
        <div className="rounded-3xl border border-border-button-default">
          <ErrorState size="sm" onRetry={() => {}} />
        </div>
        <div className="rounded-3xl border border-border-button-default">
          <TableSkeleton rows={4} columns={3} label="Carregando" />
        </div>
      </div>
    ),
  ],
};

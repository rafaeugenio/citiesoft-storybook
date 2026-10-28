import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiAddLine, RiCalendarLine, RiDownload2Line, RiRefreshLine, RiTimeLine } from '@remixicon/react';
import { PageHeader } from '@/components/application/page-header/page-header';

const meta = {
  title: 'Blocos/PageHeader',
  component: PageHeader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    breadcrumbs: [
      { label: 'Início', href: '#' },
      { label: 'Regulação', href: '#' },
      { label: 'Solicitações de TFD' },
    ],
    title: 'Solicitações de TFD',
    description: 'Pedidos de tratamento fora do domicílio dos pacientes do município.',
    meta: [
      { label: 'Atualizado em', value: '21/10/2026', icon: RiTimeLine },
      { label: 'Total', value: '48 solicitações' },
    ],
    primaryAction: { label: 'Nova solicitação', icon: RiAddLine, onClick: () => {} },
    secondaryActions: [{ label: 'Exportar', icon: RiDownload2Line, onClick: () => {} }],
  },
  argTypes: {
    titleAs: { control: 'inline-radio', options: ['h1', 'h2'] },
  },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Minimo: Story = {
  args: {
    breadcrumbs: undefined,
    description: undefined,
    meta: undefined,
    secondaryActions: undefined,
    title: 'Municípios',
    primaryAction: { label: 'Novo município', icon: RiAddLine, onClick: () => {} },
  },
};

export const SemAcoes: Story = {
  args: { primaryAction: undefined, secondaryActions: undefined },
};

export const AcoesSecundariasMultiplas: Story = {
  args: {
    secondaryActions: [
      { label: 'Atualizar', icon: RiRefreshLine, onClick: () => {} },
      { label: 'Agenda', icon: RiCalendarLine, href: '#agenda' },
      { label: 'Exportar', icon: RiDownload2Line, onClick: () => {} },
    ],
  },
};

export const AcaoPrimariaDesabilitada: Story = {
  args: { primaryAction: { label: 'Nova solicitação', icon: RiAddLine, isDisabled: true } },
};

export const ComAbas: Story = {
  render: function Render(args) {
    const [aba, setAba] = useState('todas');
    return (
      <PageHeader
        {...args}
        tabs={[
          { id: 'todas', label: 'Todas', count: 48 },
          { id: 'andamento', label: 'Em andamento', count: 21 },
          { id: 'agendadas', label: 'Agendadas', count: 9 },
          { id: 'encerradas', label: 'Encerradas' },
        ]}
        selectedTab={aba}
        onTabChange={setAba}
      />
    );
  },
};

export const Mobile: Story = {
  render: function Render(args) {
    const [aba, setAba] = useState('todas');
    return (
      <div className="w-[390px]">
        <PageHeader
          {...args}
          tabs={[
            { id: 'todas', label: 'Todas', count: 48 },
            { id: 'andamento', label: 'Em andamento', count: 21 },
            { id: 'agendadas', label: 'Agendadas', count: 9 },
          ]}
          selectedTab={aba}
          onTabChange={setAba}
        />
      </div>
    );
  },
};

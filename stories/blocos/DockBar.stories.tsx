import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RiDashboardLine,
  RiFileList3Line,
  RiNotification3Line,
  RiSettings3Line,
  RiUserLine,
} from '@remixicon/react';
import { DockBar, type DockBarItem, type DockBarProps } from '@/components/application/dock-bar/dock-bar';

const ITENS: DockBarItem[] = [
  { id: 'painel', label: 'Painel', icon: RiDashboardLine },
  { id: 'solicitacoes', label: 'Solicitações', icon: RiFileList3Line },
  { id: 'avisos', label: 'Avisos', icon: RiNotification3Line },
  { id: 'pacientes', label: 'Pacientes', icon: RiUserLine },
  { id: 'ajustes', label: 'Ajustes', icon: RiSettings3Line },
];

const meta = {
  title: 'Blocos/DockBar',
  component: DockBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { items: ITENS, activeId: 'painel', anchor: 'container' },
  argTypes: {
    position: { control: 'inline-radio', options: ['center', 'stretched'] },
    anchor: { control: 'inline-radio', options: ['viewport', 'container', 'inline'] },
  },
} satisfies Meta<typeof DockBar>;

export default meta;
type Story = StoryObj<typeof meta>;

function Palco({ children, largura = 'w-full' }: { children: React.ReactNode; largura?: string }) {
  return (
    <div className={`relative mx-auto h-[420px] overflow-hidden bg-background-secondary-default ${largura}`}>
      <div className="p-6">
        <h2 className="text-title-3-semibold text-text-primary">Painel de solicitações</h2>
        <p className="text-body-regular text-text-secondary">42 solicitações em análise neste mês.</p>
      </div>
      {children}
    </div>
  );
}

function Interativo(props: Partial<DockBarProps> & { largura?: string }) {
  const { largura, ...resto } = props;
  const [ativo, setAtivo] = useState('painel');
  return (
    <Palco largura={largura}>
      <DockBar items={ITENS} anchor="container" {...resto} activeId={ativo} onSelect={setAtivo} />
    </Palco>
  );
}

export const Padrao: Story = {
  render: function Render(args) {
    return <Interativo position={args.position} />;
  },
};

export const Estendida: Story = {
  render: function Render() {
    return <Interativo position="stretched" />;
  },
};

export const Recolhivel: Story = {
  render: function Render() {
    return <Interativo collapsible />;
  },
};

export const Recolhida: Story = {
  render: function Render() {
    return <Interativo collapsible defaultCollapsed />;
  },
};

export const RotuloPersonalizado: Story = {
  render: function Render() {
    return <Interativo aria-label="Atalhos do painel TFD" collapsible />;
  },
};

export const ComItemDesabilitado: Story = {
  render: function Render() {
    const [ativo, setAtivo] = useState('painel');
    return (
      <Palco>
        <DockBar
          anchor="container"
          activeId={ativo}
          onSelect={setAtivo}
          items={ITENS.map((i) => (i.id === 'ajustes' ? { ...i, isDisabled: true } : i))}
        />
      </Palco>
    );
  },
};

export const Mobile: Story = {
  render: function Render() {
    return <Interativo position="stretched" collapsible largura="w-[390px] max-w-full" />;
  },
};

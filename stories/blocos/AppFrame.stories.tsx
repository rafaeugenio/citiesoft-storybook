import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  RiBankLine,
  RiBuilding2Line,
  RiDashboardLine,
  RiFileList3Line,
  RiHospitalLine,
  RiLogoutBoxRLine,
  RiRouteLine,
  RiSettings4Line,
  RiTeamLine,
  RiUserLine,
} from '@remixicon/react';
import { AppFrame, type AppFrameNavGroup } from '@/components/application/app-frame/app-frame';
import { BrandLogo } from '@/components/application/app-frame/brand-logo';

const grupos: AppFrameNavGroup[] = [
  {
    items: [
      { key: 'painel', label: 'Painel', icon: RiDashboardLine, href: '#painel' },
      { key: 'solicitacoes', label: 'Solicitações TFD', icon: RiFileList3Line, href: '#solicitacoes', badge: 12 },
      { key: 'viagens', label: 'Viagens', icon: RiRouteLine, href: '#viagens' },
    ],
  },
  {
    label: 'Cadastros',
    items: [
      { key: 'pacientes', label: 'Pacientes', icon: RiTeamLine, href: '#pacientes' },
      { key: 'unidades', label: 'Unidades de saúde', icon: RiHospitalLine, href: '#unidades' },
      { key: 'municipios', label: 'Municípios', icon: RiBuilding2Line, href: '#municipios' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { key: 'ajuda-custo', label: 'Ajuda de custo', icon: RiBankLine, href: '#ajuda' },
      { key: 'config', label: 'Configurações', icon: RiSettings4Line, href: '#config' },
    ],
  },
];

const usuario = { name: 'Mariana Souza', role: 'Analista regional', initials: 'MS' };

const menuUsuario = [
  { key: 'perfil', label: 'Meu perfil', icon: RiUserLine, onSelect: fn() },
  { key: 'sair', label: 'Sair', icon: RiLogoutBoxRLine, onSelect: fn() },
];

function Conteudo() {
  return (
    <div className="flex flex-col gap-4 p-1">
      <h1 className="text-title-2-medium text-text-primary">Solicitações TFD</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {['Em análise', 'Aguardando documentos', 'Agendadas'].map((rotulo, i) => (
          <div key={rotulo} className="rounded-3xl border border-border-button-default bg-background-primary-default p-5">
            <p className="text-body-regular text-text-secondary">{rotulo}</p>
            <p className="text-title-1-medium text-text-primary">{[48, 17, 31][i]}</p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-border-button-default bg-background-primary-default p-5">
        <p className="text-body-regular text-text-secondary">
          Área de conteúdo. A moldura rola apenas esta região, com a barra lateral e a barra superior fixas.
        </p>
      </div>
    </div>
  );
}

const meta = {
  title: 'Blocos/AppFrame',
  component: AppFrame,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    navGroups: grupos,
    selected: 'solicitacoes',
    user: usuario,
    userMenuItems: menuUsuario,
    breadcrumb: [{ label: 'Início', href: '#' }, { label: 'Solicitações TFD' }],
    showSearch: true,
    notificationCount: 3,
    onNavigate: fn(),
    onSearch: fn(),
    onNotificationsClick: fn(),
    children: <Conteudo />,
  },
  argTypes: {
    showSearch: { control: 'boolean' },
    contained: { control: 'boolean' },
    notificationCount: { control: 'number' },
  },
} satisfies Meta<typeof AppFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const SemBusca: Story = { args: { showSearch: false } };

export const SemNotificacoesPendentes: Story = { args: { notificationCount: 0 } };

export const SemTrilha: Story = { args: { breadcrumb: undefined } };

export const MarcaPersonalizada: Story = {
  args: { brand: <BrandLogo symbol /> },
};

export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div style={{ ['--template-preview-height' as string]: '560px' }}>
        <Story />
      </div>
    ),
  ],
  parameters: { layout: 'padded' },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

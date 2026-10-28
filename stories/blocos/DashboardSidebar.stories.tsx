import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RiBankLine,
  RiCalendarLine,
  RiFileList3Line,
  RiHomeLine,
  RiTeamLine,
} from '@remixicon/react';
import {
  DashboardSidebar,
  type DashboardNavItem,
} from '@/components/application/dashboard/dashboard-sidebar';
import { DashboardTeamMenu } from '@/components/application/dashboard/dashboard-team-menu';
import { DashboardUserMenu } from '@/components/application/dashboard/dashboard-user-menu';

const itensPt: DashboardNavItem[] = [
  { key: 'inicio', label: 'Início', icon: RiHomeLine, href: '#inicio', badge: 12 },
  { key: 'pacientes', label: 'Pacientes', icon: RiTeamLine, href: '#pacientes' },
  { key: 'agenda', label: 'Agenda de viagens', icon: RiCalendarLine, href: '#agenda' },
  { key: 'solicitacoes', label: 'Solicitações', icon: RiFileList3Line, href: '#solicitacoes', badge: 4 },
  { key: 'financeiro', label: 'Ajuda de custo', icon: RiBankLine, href: '#financeiro' },
];

type SidebarProps = {
  mobile?: boolean;
  onClose?: () => void;
  fluid?: boolean;
  showThemeToggle?: boolean;
  selected?: string;
  items?: DashboardNavItem[];
  flat?: boolean;
  className?: string;
};

// O componente declara as props com `= {}`, o que impede a inferência do Storybook.
function Sidebar(props: SidebarProps) {
  return <DashboardSidebar {...props} />;
}

const meta = {
  title: 'Blocos/DashboardSidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    selected: { control: 'text' },
    mobile: { control: 'boolean' },
    fluid: { control: 'boolean' },
    flat: { control: 'boolean' },
    showThemeToggle: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="h-[760px] bg-background-primary-default p-3">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<SidebarProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
};

export const ItensPersonalizados: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: { items: itensPt, selected: 'pacientes' },
};

export const SemAlternadorDeTema: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: { items: itensPt, selected: 'inicio', showThemeToggle: false },
};

export const ModoMovel: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: { items: itensPt, selected: 'agenda', mobile: true, onClose: () => undefined },
};

export const Plana: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: { items: itensPt, selected: 'solicitacoes', flat: true },
};

export const MenuDeEquipe: Story = {
  parameters: { layout: 'centered' },
  decorators: [],
  render: () => (
    <div className="flex min-h-[420px] w-[260px] items-start">
      <DashboardTeamMenu />
    </div>
  ),
};

export const MenuDeEquipeRecolhido: Story = {
  parameters: { layout: 'centered' },
  decorators: [],
  render: () => (
    <div className="flex min-h-[420px] items-start">
      <DashboardTeamMenu collapsed />
    </div>
  ),
};

export const MenuDeUsuario: Story = {
  parameters: { layout: 'centered' },
  decorators: [],
  render: () => (
    <div className="flex min-h-[420px] w-[260px] items-end">
      <DashboardUserMenu />
    </div>
  ),
};

export const MenuDeUsuarioRecolhido: Story = {
  parameters: { layout: 'centered' },
  decorators: [],
  render: () => (
    <div className="flex min-h-[420px] items-end">
      <DashboardUserMenu collapsed />
    </div>
  ),
};

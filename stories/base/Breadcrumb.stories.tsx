import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiHomeLine, RiFolderLine } from '@remixicon/react';
import { Breadcrumb, BreadcrumbItem } from '@/components/base/breadcrumb/breadcrumb';

const meta = {
  title: 'Base/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  args: { 'aria-label': 'Trilha de navegação', children: null },
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem onClick={() => {}}>Início</BreadcrumbItem>
      <BreadcrumbItem onClick={() => {}}>Projetos</BreadcrumbItem>
      <BreadcrumbItem current>Detalhes</BreadcrumbItem>
    </Breadcrumb>
  ),
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComIcones: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem icon={RiHomeLine} onClick={() => {}}>Início</BreadcrumbItem>
      <BreadcrumbItem icon={RiFolderLine} onClick={() => {}}>Documentos</BreadcrumbItem>
      <BreadcrumbItem current>Relatório mensal</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const ComLinks: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem href="#inicio">Início</BreadcrumbItem>
      <BreadcrumbItem href="#configuracoes">Configurações</BreadcrumbItem>
      <BreadcrumbItem current>Perfil</BreadcrumbItem>
    </Breadcrumb>
  ),
};

export const ItemUnico: Story = {
  render: (args) => (
    <Breadcrumb {...args}>
      <BreadcrumbItem current>Painel</BreadcrumbItem>
    </Breadcrumb>
  ),
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import {
  RiBellLine,
  RiBuilding2Line,
  RiDatabase2Line,
  RiLockLine,
  RiPaletteLine,
  RiShieldUserLine,
  RiTable2,
  RiUserLine,
} from '@remixicon/react';
import { SettingsLayout, type SettingsNavGroup } from '@/components/application/settings-layout/settings-layout';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Switch } from '@/components/base/switch/switch';

const grupos: SettingsNavGroup[] = [
  {
    label: 'Conta',
    items: [
      { key: 'perfil', label: 'Perfil', icon: RiUserLine },
      { key: 'seguranca', label: 'Segurança', icon: RiLockLine },
      { key: 'notificacoes', label: 'Notificações', icon: RiBellLine },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { key: 'aparencia', label: 'Aparência', icon: RiPaletteLine },
      { key: 'perfis', label: 'Perfis de acesso', icon: RiShieldUserLine },
    ],
  },
  {
    label: 'Tabelas auxiliares',
    items: [
      { key: 'municipios', label: 'Municípios', icon: RiBuilding2Line },
      { key: 'especialidades', label: 'Especialidades', icon: RiDatabase2Line },
      { key: 'transportes', label: 'Tipos de transporte', icon: RiTable2 },
    ],
  },
];

function Cartao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section
      aria-label={titulo}
      className="flex flex-col gap-4 rounded-3xl border border-border-button-default bg-background-primary-default p-5"
    >
      <h2 className="text-headline-medium text-text-primary">{titulo}</h2>
      {children}
    </section>
  );
}

const meta = {
  title: 'Blocos/SettingsLayout',
  component: SettingsLayout,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    groups: grupos,
    title: 'Configurações',
    description: 'Preferências da conta e do sistema.',
    onSelect: fn(),
    children: null,
  },
  argTypes: { navWidth: { control: 'inline-radio', options: ['sm', 'md'] } },
} satisfies Meta<typeof SettingsLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: function Render(args) {
    return (
      <SettingsLayout {...args} defaultSelected="perfil">
        <Cartao titulo="Dados pessoais">
          <Input label="Nome completo" defaultValue="Mariana Souza" isRequired />
          <Input label="E-mail" type="email" defaultValue="mariana.souza@exemplo.gov.br" isRequired />
          <div>
            <Button>Salvar alterações</Button>
          </div>
        </Cartao>
      </SettingsLayout>
    );
  },
};

export const Controlado: Story = {
  render: function Render(args) {
    const [selecionado, setSelecionado] = useState('seguranca');
    return (
      <SettingsLayout {...args} selected={selecionado} onSelect={setSelecionado}>
        <Cartao titulo="Verificação em duas etapas">
          <Switch defaultSelected>Exigir código a cada novo acesso</Switch>
        </Cartao>
      </SettingsLayout>
    );
  },
};

export const ComAcoesNoTitulo: Story = {
  args: {
    title: 'Tabelas auxiliares',
    description: 'Cadastros de apoio usados nas solicitações.',
    actions: <Button>Novo registro</Button>,
  },
  render: function Render(args) {
    return (
      <SettingsLayout {...args} defaultSelected="municipios">
        <Cartao titulo="Municípios">
          <p className="text-body-regular text-text-secondary">Lista de municípios cadastrados.</p>
        </Cartao>
      </SettingsLayout>
    );
  },
};

export const NavegacaoEstreita: Story = {
  args: { navWidth: 'sm' },
  render: function Render(args) {
    return (
      <SettingsLayout {...args} defaultSelected="aparencia">
        <Cartao titulo="Tema">
          <Switch>Seguir o tema do dispositivo</Switch>
        </Cartao>
      </SettingsLayout>
    );
  },
};

export const ComLinks: Story = {
  args: {
    groups: grupos.map((g) => ({
      ...g,
      items: g.items.map((i) => ({ ...i, href: `#${i.key}` })),
    })),
  },
  render: function Render(args) {
    return (
      <SettingsLayout {...args} defaultSelected="perfil">
        <Cartao titulo="Perfil">
          <p className="text-body-regular text-text-secondary">Itens com endereço usam links com aria-current.</p>
        </Cartao>
      </SettingsLayout>
    );
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  render: Padrao.render,
};

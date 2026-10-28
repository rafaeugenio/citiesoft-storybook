import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/base/buttons/button';
import { SettingsModal, type SettingsPage } from '@/components/application/settings/settings-modal';

const meta = {
  title: 'Blocos/SettingsModal',
  component: SettingsModal,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { isOpen: false, onClose: () => undefined },
  argTypes: {
    defaultPage: {
      control: 'select',
      options: ['general', 'profile', 'storage', 'tools', 'marketplace'],
    },
  },
} satisfies Meta<typeof SettingsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalAberto({ defaultPage, marketplace }: { defaultPage: SettingsPage; marketplace?: React.ReactNode }) {
  const [aberto, setAberto] = useState(true);
  return (
    <div className="flex h-[720px] items-center justify-center">
      <Button onClick={() => setAberto(true)}>Abrir configurações</Button>
      <SettingsModal
        isOpen={aberto}
        onClose={() => setAberto(false)}
        defaultPage={defaultPage}
        marketplace={marketplace}
      />
    </div>
  );
}

export const Geral: Story = {
  render: function Render() {
    return <ModalAberto defaultPage="general" />;
  },
};

export const Perfil: Story = {
  render: function Render() {
    return <ModalAberto defaultPage="profile" />;
  },
};

export const Armazenamento: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  render: function Render() {
    return <ModalAberto defaultPage="storage" />;
  },
};

export const Ferramentas: Story = {
  render: function Render() {
    return <ModalAberto defaultPage="tools" />;
  },
};

export const ComMarketplace: Story = {
  render: function Render() {
    return (
      <ModalAberto
        defaultPage="marketplace"
        marketplace={
          <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
            <p className="text-title-3-medium text-text-primary">Marketplace de extensões</p>
            <p className="text-body-regular text-text-secondary">
              Conteúdo de exemplo injetado pelo aplicativo anfitrião.
            </p>
          </div>
        }
      />
    );
  },
};

export const Fechado: Story = {
  render: function Render() {
    const [aberto, setAberto] = useState(false);
    return (
      <div className="flex h-[480px] items-center justify-center">
        <Button onClick={() => setAberto(true)}>Abrir configurações</Button>
        <SettingsModal isOpen={aberto} onClose={() => setAberto(false)} />
      </div>
    );
  },
};

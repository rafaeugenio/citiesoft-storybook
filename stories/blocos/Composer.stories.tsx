import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { useState, type FC } from 'react';
import {
  AiChatComposerPreview,
  Composer,
  GlassComposer,
  type ComposerProps,
  StatusBar,
} from '@/components/application/ai-chat/ai-chat-composer';

const meta = {
  title: 'Blocos/Composer',
  component: Composer as FC<ComposerProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { onSubmit: fn(), onValueChange: fn() },
  argTypes: {
    disabled: { control: 'boolean' },
    glassControls: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="mx-auto min-h-[260px] w-full max-w-[720px] pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<ComposerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Desabilitado: Story = { args: { disabled: true } };

export const ControlesEmVidro: Story = { args: { glassControls: true } };

export const Controlado: Story = {
  render: function Render(args) {
    const [texto, setTexto] = useState('Resuma a ata da reunião de ontem');
    const [enviadas, setEnviadas] = useState<string[]>([]);
    return (
      <div className="flex flex-col gap-3">
        <Composer
          {...args}
          value={texto}
          onValueChange={setTexto}
          onSubmit={(v) => {
            if (!v.trim()) return;
            setEnviadas((prev) => [...prev, v]);
            setTexto('');
          }}
        />
        <ul className="text-body-regular text-text-secondary">
          {enviadas.map((m, i) => (
            <li key={i}>Enviada: {m}</li>
          ))}
        </ul>
      </div>
    );
  },
};

export const ComBarraDeStatus: Story = {
  render: () => <AiChatComposerPreview />,
};

export const SomenteBarraDeStatus: Story = {
  render: () => <StatusBar />,
};

export const ComVidroAtivo: Story = {
  render: function Render() {
    const [vidro, setVidro] = useState(true);
    return (
      <div className="flex flex-col gap-4">
        <GlassComposer glass={vidro} />
        <button
          type="button"
          className="self-start text-body-medium text-text-secondary underline"
          onClick={() => setVidro((v) => !v)}
        >
          {vidro ? 'Desativar vidro' : 'Ativar vidro'}
        </button>
      </div>
    );
  },
};

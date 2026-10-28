import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { ComposerLoader } from '@/components/application/composer-loader/composer-loader';

const Campo = ({ texto = 'Resuma o relatório de vendas de setembro' }: { texto?: string }) => (
  <div className="flex h-[52px] items-center px-5 text-body-regular text-text-secondary">{texto}</div>
);

const meta = {
  title: 'Blocos/ComposerLoader',
  component: ComposerLoader,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { active: true, children: null },
  argTypes: {
    active: { control: 'boolean' },
    speed: { control: { type: 'number', min: 1, max: 12, step: 0.5 } },
    intensity: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    bloom: { control: { type: 'number', min: 0, max: 40 } },
    bloomStrength: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    arc: { control: { type: 'number', min: 20, max: 360, step: 10 } },
    radius: { control: { type: 'number', min: 0, max: 40 } },
    line: { control: { type: 'number', min: 1, max: 8, step: 0.5 } },
    taper: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    offset: { control: { type: 'range', min: 0, max: 1, step: 0.05 } },
    reverse: { control: 'boolean' },
    bloomOnly: { control: 'boolean' },
    surface: { control: 'boolean' },
  },
  render: (args) => (
    <div className="mx-auto w-full max-w-xl p-6">
      <ComposerLoader {...args}>
        <Campo />
      </ComposerLoader>
    </div>
  ),
} satisfies Meta<typeof ComposerLoader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Inativo: Story = { args: { active: false } };

export const AlternandoAtivo: Story = {
  render: function Render(args) {
    const [ativo, setAtivo] = useState(false);
    return (
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4 p-6">
        <ComposerLoader {...args} active={ativo}>
          <Campo texto="Aguardando resposta do assistente" />
        </ComposerLoader>
        <button
          type="button"
          onClick={() => setAtivo((v) => !v)}
          className="self-start rounded-full border border-border-button-default px-4 py-2 text-body-medium text-text-primary"
        >
          {ativo ? 'Concluir resposta' : 'Enviar mensagem'}
        </button>
      </div>
    );
  },
};

export const SentidoInverso: Story = { args: { reverse: true } };

export const ArcoLargoEVelocidade: Story = { args: { arc: 220, speed: 2.5 } };

export const ApenasBrilho: Story = { args: { bloomOnly: true, bloom: 24, bloomStrength: 0.5 } };

export const PontasSuavizadas: Story = { args: { taper: 0.6, arc: 160 } };

export const CoresPersonalizadas: Story = {
  args: { colors: ['#fbbf24', '#f97316', '#ef4444', '#a855f7'], intensity: 0.9 },
};

export const CantosArredondados: Story = {
  args: { radius: 16 },
  render: (args) => (
    <div className="mx-auto w-full max-w-xl p-6">
      <ComposerLoader {...args}>
        <div className="flex h-24 items-start p-4 text-body-regular text-text-secondary">
          Escreva aqui o texto da proposta comercial para a Prefeitura de Itaberaba
        </div>
      </ComposerLoader>
    </div>
  ),
};

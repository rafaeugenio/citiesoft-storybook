import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RiDeleteBinLine,
  RiDownloadLine,
  RiEyeLine,
  RiFileCopyLine,
  RiMoreLine,
  RiPencilLine,
  RiPrinterLine,
  RiShareForwardLine,
} from '@remixicon/react';
import { ActionMenu, type ActionMenuEntry } from '@/components/application/action-menu/action-menu';

const ITENS: ActionMenuEntry[] = [
  { id: 'ver', label: 'Ver detalhes', icon: RiEyeLine },
  { id: 'editar', label: 'Editar', icon: RiPencilLine, shortcut: '⌘E' },
  { id: 'duplicar', label: 'Duplicar', icon: RiFileCopyLine },
  { type: 'separator' },
  { id: 'excluir', label: 'Excluir', icon: RiDeleteBinLine, tone: 'danger' },
];

const SECOES: ActionMenuEntry[] = [
  {
    type: 'section',
    id: 'acoes',
    label: 'Solicitação',
    items: [
      { id: 'ver', label: 'Ver detalhes', icon: RiEyeLine },
      { id: 'editar', label: 'Editar', icon: RiPencilLine, shortcut: '⌘E' },
      { id: 'encaminhar', label: 'Encaminhar', icon: RiShareForwardLine, isDisabled: true },
    ],
  },
  {
    type: 'section',
    id: 'saida',
    label: 'Exportar',
    items: [
      { id: 'pdf', label: 'Baixar PDF', icon: RiDownloadLine },
      { id: 'imprimir', label: 'Imprimir', icon: RiPrinterLine, shortcut: '⌘P' },
    ],
  },
  {
    type: 'section',
    id: 'perigo',
    items: [{ id: 'excluir', label: 'Excluir solicitação', icon: RiDeleteBinLine, tone: 'danger' }],
  },
];

const meta = {
  title: 'Blocos/ActionMenu',
  component: ActionMenu,
  tags: ['autodocs'],
  args: { items: ITENS, 'aria-label': 'Ações da solicitação' },
  argTypes: {
    placement: { control: 'inline-radio', options: ['bottom', 'top', 'end'] },
  },
  decorators: [
    (Story) => (
      <div className="flex h-[360px] items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComRotulo: Story = { args: { label: 'Mais ações' } };

export const ComSecoes: Story = { args: { items: SECOES, label: 'Ações', 'aria-label': 'Ações da solicitação' } };

export const AbreParaCima: Story = { args: { placement: 'top' } };

export const AbreParaOLado: Story = { args: { placement: 'end' } };

export const GatilhoProprio: Story = {
  args: {
    trigger: (
      <>
        <RiMoreLine className="size-5" aria-hidden />
        <span className="ms-1 text-body-medium">Opções</span>
      </>
    ),
    triggerClassName: 'h-9 rounded-2lg border border-border-button-default px-3 text-text-primary hover:bg-background-primary-hover',
  },
};

export const Desabilitado: Story = { args: { isDisabled: true } };

export const NaLinhaDeTabela: Story = {
  parameters: { layout: 'padded' },
  decorators: [],
  render: function Render(args) {
    const [ultima, setUltima] = useState('nenhuma');
    return (
      <div className="flex min-h-[320px] flex-col gap-3">
        <div className="flex items-center justify-between rounded-2xl border border-border-table px-4 py-2">
          <div className="flex flex-col">
            <span className="text-body-medium text-text-primary">TFD-2026-004812</span>
            <span className="text-body-2-medium text-text-secondary">Maria das Graças Oliveira, Cardiologia</span>
          </div>
          <ActionMenu {...args} onAction={setUltima} aria-label="Ações da solicitação TFD-2026-004812" />
        </div>
        <p className="text-body-2-medium text-text-secondary" aria-live="polite">
          Última ação: {ultima}
        </p>
      </div>
    );
  },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  args: { items: SECOES, label: 'Ações' },
  decorators: [
    (Story) => (
      <div className="flex h-[420px] w-[390px] max-w-full items-start justify-end p-4">
        <Story />
      </div>
    ),
  ],
};

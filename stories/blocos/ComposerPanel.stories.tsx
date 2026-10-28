import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ComposerPanel,
  ComposerStatusTab,
  PermissionMenu,
  type ComposerAttachment,
  type ComposerPermission,
} from '@/components/application/composer-panel/composer-panel';
import { ComposerWithAttachments } from '@/components/application/composer-panel/composer-attachments';

const ANEXOS: ComposerAttachment[] = [
  { id: 'a1', name: 'relatorio-setembro.pdf', kind: 'document' },
  { id: 'a2', name: 'orcamento-2026.xlsx', kind: 'spreadsheet' },
  { id: 'a3', name: 'apresentacao-comite.pptx', kind: 'presentation' },
  { id: 'a4', name: 'migracao.ts', kind: 'code' },
];

const Moldura = ({ children }: { children: ReactNode }) => (
  <div className="mx-auto w-full max-w-3xl pt-24">{children}</div>
);

const meta = {
  title: 'Blocos/ComposerPanel',
  component: ComposerPanel,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { placeholder: 'Pergunte qualquer coisa ao assistente' },
  argTypes: {
    disabled: { control: 'boolean' },
    defaultPermission: { control: 'inline-radio', options: ['auto', 'manual', 'plan', 'bypass'] },
    effort: { control: { type: 'number', min: 0, max: 5, step: 1 } },
  },
  render: (args) => (
    <Moldura>
      <ComposerPanel {...args} />
    </Moldura>
  ),
} satisfies Meta<typeof ComposerPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Desabilitado: Story = { args: { disabled: true } };

export const ModoPlanejamento: Story = { args: { defaultPermission: 'plan' } };

export const SemAbaDeStatus: Story = { args: { status: null } };

export const AbaDeStatusPersonalizada: Story = {
  args: { status: <ComposerStatusTab branch="feature/relatorios" project="portal-transparencia" context={82} /> },
};

export const ComAnexos: Story = {
  args: {
    attachments: [
      { id: 'i1', name: 'foto-obra.png', kind: 'image' },
      { id: 'd1', name: 'edital-042.pdf', kind: 'document' },
      { id: 'p1', name: 'medicoes.xlsx', kind: 'spreadsheet', progress: 64 },
      { id: 'v1', name: 'visita-tecnica.mp4', kind: 'video', progress: 100 },
    ],
  },
};

export const Controlado: Story = {
  render: function Render(args) {
    const [texto, setTexto] = useState('');
    const [enviadas, setEnviadas] = useState<string[]>([]);
    return (
      <Moldura>
        <div className="flex flex-col gap-4">
        <ComposerPanel
          {...args}
          value={texto}
          onValueChange={setTexto}
          onSubmit={(valor) => {
            if (!valor.trim()) return;
            setEnviadas((lista) => [...lista, valor]);
            setTexto('');
          }}
        />
        <ul className="list-disc ps-6 text-body-regular text-text-secondary">
          {enviadas.length === 0 ? <li>Nenhuma mensagem enviada.</li> : enviadas.map((m, i) => <li key={i}>{m}</li>)}
        </ul>
        </div>
      </Moldura>
    );
  },
};

export const ComFilaDeUpload: Story = {
  render: function Render(args) {
    const [anexos, setAnexos] = useState<ComposerAttachment[]>(
      ANEXOS.map((a) => ({ ...a, progress: 0 })),
    );
    return (
      <Moldura>
        <ComposerWithAttachments {...args} attachments={anexos} onAttachmentsChange={setAnexos} />
      </Moldura>
    );
  },
};

export const MenuDePermissoes: Story = {
  parameters: { layout: 'centered' },
  render: function Render() {
    const [modo, setModo] = useState<ComposerPermission>('manual');
    return (
      <div className="min-h-[360px] pt-64">
        <PermissionMenu value={modo} onChange={setModo} />
      </div>
    );
  },
};

export const AbaDeStatus: Story = {
  parameters: { layout: 'centered' },
  render: () => (
    <div className="w-[560px]">
      <ComposerStatusTab branch="main" project="sistema-protocolo" context={34} />
    </div>
  ),
};

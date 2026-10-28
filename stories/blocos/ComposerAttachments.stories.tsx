import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { useState } from 'react';
import { ComposerWithAttachments } from '@/components/application/composer-panel/composer-attachments';
import type { ComposerAttachment } from '@/components/application/composer-panel/composer-panel';

const ANEXOS_PRONTOS: ComposerAttachment[] = [
  { id: 'a1', name: 'proposta.docx', kind: 'document' },
  { id: 'a2', name: 'orcamento.xlsx', kind: 'spreadsheet' },
  { id: 'a3', name: 'apresentacao.pptx', kind: 'presentation' },
  { id: 'a4', name: 'script.ts', kind: 'code' },
  { id: 'a5', name: 'demo.mp4', kind: 'video' },
];

const FILA: ComposerAttachment[] = [
  { id: 'f1', name: 'relatorio-mensal.docx', kind: 'document', progress: 0 },
  { id: 'f2', name: 'custos-q3.xlsx', kind: 'spreadsheet', progress: 0 },
  { id: 'f3', name: 'roteiro.mp4', kind: 'video', progress: 0 },
];

const meta = {
  title: 'Blocos/ComposerAttachments',
  component: ComposerWithAttachments,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    attachments: ANEXOS_PRONTOS,
    placeholder: 'Pergunte algo sobre os arquivos',
    onAttachmentsChange: fn(),
    onUploadComplete: fn(),
    onAllUploaded: fn(),
    onSubmit: fn(),
  },
  decorators: [
    (Story) => (
      <div className="mx-auto min-h-[320px] w-full max-w-[640px] pt-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ComposerWithAttachments>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ArquivosJaEnviados: Story = {
  render: function Render(args) {
    const [lista, setLista] = useState(args.attachments);
    return <ComposerWithAttachments {...args} attachments={lista} onAttachmentsChange={setLista} />;
  },
  // Os anexos entram com transição de opacidade; o axe só mede depois que ela termina.
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
  },
};

export const FilaDeUpload: Story = {
  args: { attachments: FILA },
  render: function Render(args) {
    const [lista, setLista] = useState(args.attachments);
    return <ComposerWithAttachments {...args} attachments={lista} onAttachmentsChange={setLista} />;
  },
};

export const UploadLento: Story = {
  args: { attachments: FILA.slice(0, 1), uploadDuration: 4000 },
};

export const AdicionandoArquivos: Story = {
  render: function Render(args) {
    const [lista, setLista] = useState<ComposerAttachment[]>([]);
    const adicionar = () =>
      setLista((prev) => [
        ...prev,
        { id: `n${prev.length + 1}`, name: `contrato-${prev.length + 1}.docx`, kind: 'document', progress: 0 },
      ]);
    return (
      <div className="flex flex-col gap-4">
        <ComposerWithAttachments {...args} attachments={lista} onAttachmentsChange={setLista} />
        <button
          type="button"
          onClick={adicionar}
          className="self-start text-body-medium text-text-secondary underline"
        >
          Adicionar arquivo
        </button>
      </div>
    );
  },
};

export const SemAnexos: Story = { args: { attachments: [] } };

export const Desabilitado: Story = { args: { disabled: true } };

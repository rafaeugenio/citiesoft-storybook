import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiFileTextLine } from '@remixicon/react';
import { FileUpload } from '@/components/base/file-upload/file-upload';

const meta = {
  title: 'Base/FileUpload',
  component: FileUpload,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[533px] max-w-full">
        <Story />
      </div>
    ),
  ],
  argTypes: {
    maxBytes: { control: 'number' },
    allowedExtensions: { control: 'object' },
  },
} satisfies Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  parameters: { a11y: { test: 'todo' } }, // FileUpload: controle aninhado do Citiesoft. Demais: contraste da paleta accent; some ao mapear a marca (fase Fundação)
};

export const SomentePdf: Story = {
  parameters: { a11y: { test: 'todo' } }, // FileUpload: controle aninhado do Citiesoft. Demais: contraste da paleta accent; some ao mapear a marca (fase Fundação)
  args: { allowedExtensions: ['pdf'], maxBytes: 2 * 1024 * 1024 },
};

export const IconeDoArquivoPersonalizado: Story = {
  parameters: { a11y: { test: 'todo' } }, // FileUpload: controle aninhado do Citiesoft. Demais: contraste da paleta accent; some ao mapear a marca (fase Fundação)
  args: {
    renderFileIcon: () => <RiFileTextLine className="size-6 shrink-0 text-foreground-icon-secondary" aria-hidden />,
  },
};

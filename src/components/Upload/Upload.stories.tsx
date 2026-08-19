import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Upload, formatarTamanho } from './Upload';

const meta = {
  title: 'Formulário/Upload',
  component: Upload,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Envio de arquivos. Spec: `03-components/upload.md` v2.0.0. Equivalente PrimeNG: `p-fileupload`. O modo Advanced é o padrão quando o anexo é peça central do processo.',
      },
    },
  },
  args: { instrucao: 'PDF ou JPG até 10 MB.' },
} satisfies Meta<typeof Upload>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vazio: Story = {
  name: 'Estado · vazio',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A instrução do estado vazio informa formato e limite.
    await expect(canvas.getByText('PDF ou JPG até 10 MB.')).toBeVisible();
    await expect(canvas.getByText('Arraste um arquivo ou selecione')).toBeVisible();
  },
};

export const Pronto: Story = {
  name: 'Estado · arquivo selecionado',
  args: {
    arquivos: [
      { id: '1', nome: 'laudo-medico.pdf', tamanho: 2_411_724, estado: 'pronto' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('laudo-medico.pdf')).toBeVisible();
    await expect(canvas.getByText('2,3 MB')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Remover laudo-medico.pdf' })).toBeVisible();
  },
};

export const Enviando: Story = {
  name: 'Estado · enviando',
  args: {
    arquivos: [
      { id: '1', nome: 'laudo-medico.pdf', tamanho: 2_411_724, estado: 'enviando', progresso: 62 },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('progressbar', { name: 'Enviando laudo-medico.pdf' });
    await expect(barra).toHaveAttribute('aria-valuenow', '62');
  },
};

export const Enviado: Story = {
  name: 'Estado · concluído',
  args: {
    arquivos: [
      { id: '1', nome: 'laudo-medico.pdf', tamanho: 2_411_724, estado: 'enviado' },
      { id: '2', nome: 'comprovante-residencia.jpg', tamanho: 840_120, estado: 'enviado' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: 'O ícone de sucesso acompanha a cor, porque cor sozinha não pode indicar estado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('laudo-medico.pdf enviado')).toBeInTheDocument();
  },
};

export const ComErro: Story = {
  name: 'Estado · erro',
  args: {
    arquivos: [
      { id: '1', nome: 'laudo-medico.pdf', tamanho: 2_411_724, estado: 'enviado' },
      {
        id: '2',
        nome: 'exame-completo.pdf',
        tamanho: 14_680_064,
        estado: 'erro',
        erro: 'Arquivo acima de 10 MB. Reduza o tamanho ou envie outro.',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'O motivo vem no padrão o que aconteceu mais como resolver, nunca código cru, e os demais arquivos válidos são preservados.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText('Arquivo acima de 10 MB. Reduza o tamanho ou envie outro.'),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
    // O arquivo válido continua na lista.
    await expect(canvas.getByText('laudo-medico.pdf')).toBeVisible();
  },
};

export const Basic: Story = {
  name: 'Variante · basic',
  args: { variante: 'basic' },
  parameters: {
    docs: {
      description: {
        story: 'Exceção para quando o upload é secundário no formulário. O botão nomeia a ação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Selecionar arquivo' })).toBeVisible();
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
};

export const Tamanhos: Story = {
  name: 'Formatação de tamanho',
  render: () => (
    <ul style={{ fontFamily: 'var(--citie-font-ui)', fontSize: 14 }}>
      <li>{formatarTamanho(820)}</li>
      <li>{formatarTamanho(840_120)}</li>
      <li>{formatarTamanho(2_411_724)}</li>
    </ul>
  ),
  play: async () => {
    await expect(formatarTamanho(820)).toBe('820 B');
    await expect(formatarTamanho(840_120)).toBe('820 KB');
    await expect(formatarTamanho(2_411_724)).toBe('2,3 MB');
  },
};

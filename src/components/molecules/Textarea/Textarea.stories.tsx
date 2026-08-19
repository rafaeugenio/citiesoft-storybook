import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Textarea } from './Textarea';

const meta = {
  title: 'Moléculas/Campos/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Área de texto de várias linhas. Spec: `03-components/textarea.md` v2.0.0. Equivalente PrimeNG: `pTextarea`.\n\n**Quando usar:** texto livre redigido pelo próprio servidor, com mais de uma linha e sem formato fixo: justificativa de afastamento, parecer técnico, observação do processo.\n\n**Quando não usar:** dado de uma linha com formato definido (nome, número de processo, CPF, e-mail), porque a caixa alta convida à quebra de linha que depois quebra a busca, o filtro e a exportação; use `Moléculas/Campos/Input`. Escolha entre opções já conhecidas digitada como texto livre, que impede filtro e relatório e enche a base de grafias diferentes para a mesma coisa: `Moléculas/Campos/Select`, `Moléculas/Campos/MultiSelect` ou `Moléculas/Campos/AutoComplete`. Texto que precisa de negrito, lista ou link: `Organismos/Entrada/Editor`. Conteúdo somente leitura, que fica melhor exibido dentro de `Moléculas/Contêineres/Card` do que num controle focável e editável que sugere edição possível.\n\nQuando a regra de negócio tem limite de caracteres, passe `limit`: sem ele a contagem do rodapé não aparece e o servidor só descobre o corte no envio, depois de escrever o parecer inteiro.',
      },
    },
  },
  args: {
    label: 'Justificativa do afastamento',
    placeholder: 'Ex.: Participação em capacitação técnica em São Luís.',
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Justificativa do afastamento');
    // A spec exige no mínimo 3 linhas visíveis.
    await expect(campo).toHaveAttribute('rows', '3');
  },
};

export const Preenchido: Story = {
  name: 'Estado · preenchido',
  args: {
    defaultValue:
      'Participação na capacitação de gestão de processos administrativos, realizada na sede da SES em São Luís.',
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, defaultValue: 'Justificativa registrada e homologada.' },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    defaultValue: 'Viagem.',
    error: 'Justificativa muito curta. Descreva o motivo em pelo menos 20 caracteres.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Justificativa do afastamento');
    await expect(campo).toHaveAttribute('aria-invalid', 'true');
    // O texto digitado é preservado no erro.
    await expect(campo).toHaveValue('Viagem.');
  },
};

export const ComContagem: Story = {
  name: 'Variante · com contagem de caracteres',
  args: { limit: 40, helper: 'Descreva o motivo do afastamento.' },
  parameters: {
    docs: {
      description: {
        story:
          'A contagem vive em uma região de status, então o leitor de tela anuncia a aproximação do limite. O aviso muda de cor a partir de 90% e o erro só apareceria ao ultrapassar.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Justificativa do afastamento');

    await expect(canvas.getByText('0/40')).toBeVisible();
    await userEvent.type(campo, 'Capacitação técnica');
    await expect(canvas.getByText('19/40')).toBeVisible();
  },
};

export const Filled: Story = {
  name: 'Variante · filled',
  args: { filled: true },
};

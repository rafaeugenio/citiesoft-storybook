import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Input } from './Input';

const meta = {
  title: 'Moléculas/Campos/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Família de entrada de linha. Spec: `03-components/inputs.md` v2.0.0. Equivalente PrimeNG: `pInputText`, `p-inputnumber`, `p-password`, `p-inputgroup`.',
          '',
          '**O Input é o padrão de entrada do DS e o ponto de partida de qualquer campo.** Ele é a escolha certa quando o valor é texto livre de uma linha, sem conjunto fechado de respostas: nome, matrícula, número de ofício, valor monetário, senha. Todo campo especializado abaixo existe porque digitar livremente naquele dado produziria erro caro.',
          '',
          '**Quando não usar:**',
          '',
          '- **O valor pertence a uma lista fechada.** Digitar "S. Luis", "Sao Luiz" e "São Luís" gera três municípios distintos no processo, e a correção depois exige abrir chamado. Use `Moléculas/Campos/Select` para lista plana, `Moléculas/Campos/AutoComplete` quando o catálogo for grande demais para rolar, `Moléculas/Campos/CascadeSelect` ou `Moléculas/Campos/TreeSelect` quando a lista for hierárquica, e `Moléculas/Campos/MultiSelect` quando couber mais de um valor.',
          '- **O valor é uma data.** Data digitada sem máscara chega ao processo em formatos misturados. Use `Moléculas/Campos/DatePicker`, que exibe e devolve sempre em dd/mm/aaaa.',
          '- **O texto passa de uma linha.** Justificativa de afastamento ou parecer técnico truncam no Input, e a pessoa perde de vista o que já escreveu. Use `Moléculas/Campos/Textarea`.',
          '- **O valor é um código curto de verificação.** Use `Moléculas/Campos/InputOtp`, que divide o código em casas e avança sozinho.',
          '- **O campo filtra uma listagem em vez de gravar dado.** Use `Moléculas/Busca/Search`, que já traz o ícone, o botão de limpar, a contagem de resultados em região `aria-live` e o mínimo de caracteres.',
          '- **Só há duas ou três respostas possíveis.** Use `Átomos/Escolha/Checkbox`, `Átomos/Escolha/Switch` ou `Moléculas/Escolha/RadioGroup`, que mostram as alternativas sem exigir que a pessoa adivinhe o vocabulário aceito.',
          '',
          '**Sobre o rótulo:** o Input embute rótulo fixo acima do campo pelo `FieldWrapper`, que é o padrão do DS. Se a tela precisar economizar altura, `Moléculas/Campos/IftaLabel` e `Moléculas/Campos/FloatLabel` são as exceções documentadas, e a escolha vale para a tela inteira.',
          '',
          '**Sobre o `addonStart` e o `addonEnd`:** eles marcam unidade fixa ("R$", "@", "kg") e não substituem o rótulo. Um addon que precise mudar o significado do campo pede um campo separado.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['small', 'normal', 'large'] },
  },
  args: {
    label: 'Nome do colaborador',
    placeholder: 'Ex.: Maria Souza Lima',
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Label associado ao campo: o placeholder nunca substitui o label.
    await expect(canvas.getByLabelText('Nome do colaborador')).toBeVisible();
  },
};

export const ComHelper: Story = {
  name: 'Estado · com helper text',
  args: {
    label: 'Matrícula',
    placeholder: 'Ex.: 00123456',
    helper: 'Oito dígitos, sem pontos ou traços.',
  },
};

export const Obrigatorio: Story = {
  name: 'Estado · obrigatório',
  args: { required: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Nome do colaborador/)).toHaveAttribute(
      'aria-required',
      'true',
    );
  },
};

export const Preenchido: Story = {
  name: 'Estado · preenchido',
  args: { defaultValue: 'Maria Souza Lima' },
};

export const Foco: Story = {
  name: 'Estado · foco por teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Nome do colaborador');
    await userEvent.click(campo);
    await expect(campo).toHaveFocus();
    await expect(getComputedStyle(campo).boxShadow).not.toBe('none');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, defaultValue: 'Maria Souza Lima' },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    label: 'CPF',
    defaultValue: '123.456.789-00',
    error: 'CPF inválido. Verifique os dígitos e tente novamente.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Erro no padrão o que aconteceu mais como resolver. O valor digitado é preservado e o ícone de alerta acompanha o texto, porque a cor não pode ser o único indicador.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('CPF');

    await expect(campo).toHaveAttribute('aria-invalid', 'true');
    await expect(campo).toHaveValue('123.456.789-00');

    // aria-describedby precisa apontar para a mensagem de erro visível.
    const idMensagem = campo.getAttribute('aria-describedby');
    await expect(idMensagem).toBeTruthy();
    await expect(canvasElement.querySelector(`#${idMensagem}`)).toHaveTextContent(
      'CPF inválido. Verifique os dígitos e tente novamente.',
    );
  },
};

export const Carregando: Story = {
  name: 'Estado · validação assíncrona',
  args: {
    label: 'Número do processo',
    defaultValue: '2025/0481',
    loading: true,
    helper: 'Conferindo o número no SIGEP.',
  },
};

export const Tamanhos: Story = {
  name: 'Tamanhos · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Input {...args} size="small" label="Small" />
      <Input {...args} size="normal" label="Normal" />
      <Input {...args} size="large" label="Large" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alturas = ['Small', 'Normal', 'Large'].map(
      (nome) => canvas.getByLabelText(nome).getBoundingClientRect().height,
    );
    await expect(alturas).toEqual([32, 40, 48]);
  },
};

export const Filled: Story = {
  name: 'Variante · filled',
  args: { filled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Para formulários densos onde a borda some no fundo. Nunca misturar campo com borda e campo preenchido na mesma tela.',
      },
    },
  },
};

export const GrupoComPrefixo: Story = {
  name: 'Variante · InputGroup com prefixo',
  args: {
    label: 'Valor da diária',
    addonStart: 'R$',
    placeholder: 'Ex.: 1.234,56',
    helper: 'Formato pt-BR, com vírgula decimal.',
  },
};

export const GrupoComSufixo: Story = {
  name: 'Variante · InputGroup com sufixo',
  args: {
    label: 'Carga horária semanal',
    addonEnd: 'horas',
    placeholder: 'Ex.: 40',
  },
};

export const Senha: Story = {
  name: 'Variante · senha',
  args: {
    label: 'Nova senha',
    type: 'password',
    defaultValue: 'senhaforte123',
    helper: 'Mínimo de 8 caracteres, com letra e número.',
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { InputOtp } from './InputOtp';

const meta = {
  title: 'Moléculas/Campos/InputOtp',
  component: InputOtp,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Código de verificação. Origem: Figma CitieOne, página ❖ InputOtp (variante Size: Normal | Small | Large). As alturas seguem a escala de controle do DS (32 / 36 / 40). Equivalente PrimeNG: `p-inputotp`.',
          '',
          '**Quando usar:** código numérico curto, de uso único, que a pessoa acabou de receber e vai transcrever de outra tela: confirmação de login por SMS, validação de e-mail, autorização de uma operação sensível. As casas separadas dão o feedback de progresso e o `autoComplete="one-time-code"` deixa o celular oferecer o código do SMS.',
          '',
          '**Quando não usar:**',
          '',
          '- **Dado que a pessoa consulta em um documento e confere caractere a caractere.** CPF, matrícula, número de processo e CEP são lidos em blocos ("605.922.293-51"), e as casas isoladas apagam essa formatação. Use `Moléculas/Campos/Input` com máscara.',
          '- **Código com letras.** A implementação filtra tudo que não for dígito (`replace(/\\D/g, \'\')`), então um código alfanumérico simplesmente não entra e a pessoa fica batendo numa casa que não aceita o que ela digita. Use `Moléculas/Campos/Input`.',
          '- **Código longo.** Acima de oito casas a linha estoura em tela estreita e o avanço automático passa a atrapalhar quem revisa o que digitou. Use `Moléculas/Campos/Input`.',
          '- **Senha.** Senha é editada, corrigida e colada inteira; o campo por casas impede tudo isso. Use `Moléculas/Campos/Input` do tipo senha. A propriedade `mask` daqui serve para ocultar um código de uso único em tela compartilhada, sem virar campo de senha.',
          '- **Exibir um código gerado pelo sistema.** Protocolo e número de ofício que o servidor precisa copiar são texto selecionável, com botão de copiar ao lado. Casas de entrada sugerem que o valor é editável.',
          '',
          'Sempre acompanhe o campo de um caminho de saída visível: reenviar o código e trocar o canal. Sem isso, quem não recebe o SMS fica sem atendimento e o problema chega à ouvidoria.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Código enviado por SMS' },
} satisfies Meta<typeof InputOtp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Size · normal',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Cada casa carrega a posição no nome acessível.
    const primeira = canvas.getByLabelText('Código enviado por SMS, dígito 1 de 6');
    await expect(primeira).toBeVisible();
    // Altura normal de controle do UI Kit: 36px (era 40 antes do Lote 0).
    await expect(primeira.getBoundingClientRect().height).toBe(36);
  },
};

export const AvancoAutomatico: Story = {
  name: 'Comportamento · avanço automático',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primeira = canvas.getByLabelText('Código enviado por SMS, dígito 1 de 6');

    await userEvent.type(primeira, '4');
    // Digitar avança para a próxima casa sozinho.
    await expect(canvas.getByLabelText('Código enviado por SMS, dígito 2 de 6')).toHaveFocus();

    await userEvent.keyboard('{Backspace}');
    // Backspace numa casa vazia volta para a anterior.
    await expect(primeira).toHaveFocus();
  },
};

export const SomenteNumeros: Story = {
  name: 'Comportamento · só aceita dígito',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primeira = canvas.getByLabelText('Código enviado por SMS, dígito 1 de 6');

    await userEvent.type(primeira, 'a');
    await expect(primeira).toHaveValue('');
  },
};

export const Tamanhos: Story = {
  name: 'Size · 32 / 36 / 40px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <InputOtp {...args} size="small" label="Small" length={4} />
      <InputOtp {...args} size="normal" label="Normal" length={4} />
      <InputOtp {...args} size="large" label="Large" length={4} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alturas = ['Small', 'Normal', 'Large'].map(
      (nome) => canvas.getByLabelText(`${nome}, dígito 1 de 4`).getBoundingClientRect().height,
    );
    await expect(alturas).toEqual([32, 36, 40]);
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    invalid: true,
    error: 'Código incorreto. Confira os dígitos ou solicite um novo envio.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primeira = canvas.getByLabelText('Código enviado por SMS, dígito 1 de 6');
    await expect(primeira).toHaveAttribute('aria-invalid', 'true');
    await expect(primeira).toHaveAttribute('aria-describedby');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
};

export const Mascarado: Story = {
  name: 'Variante · mascarado',
  args: { label: 'Senha de acesso', mask: true, length: 4 },
};

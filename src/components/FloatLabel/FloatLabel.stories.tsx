import type { InputHTMLAttributes } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { FloatLabel } from './FloatLabel';
import { Input } from '../Input/Input';
import '../Field/Field.css';

/** Campo de texto no mesmo desenho do Input, sem o rótulo fixo que ele embute. */
function CampoTexto({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={['citie-field-control', 'citie-field-control--normal', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  );
}

const meta = {
  title: 'Formulário/FloatLabel',
  component: FloatLabel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Invólucro que faz o rótulo do campo flutuar quando ele recebe foco ou já tem valor.',
          'Página do Figma `❖ FloatLabel` (7421:322901), componente `floatlabel` 4.0.0.',
          'Variantes do arquivo: `🎲 Variant` (Over · On · In), `⚙️ State` (Default · Hover · Active),',
          '`❌ Invalid`, `🚫 Disabled` e `🟦 Filled`. Equivalente PrimeNG: `p-floatlabel`.',
          '',
          '**O padrão do DS Citiesoft é rótulo fixo acima do campo** (`Input`, `Select`, `Textarea`).',
          'O rótulo flutuante é exceção, reservada a telas de alta densidade onde a coluna do rótulo',
          'custa altura demais: grades de lançamento, filtros lado a lado, formulários longos de',
          'competência. Escolha um padrão por tela e não misture os dois.',
          '',
          '**Quando não usar:** formulário comum de cadastro; campo com helper text permanente',
          '(a instrução some do topo e o olho precisa varrer duas alturas); rótulo longo, que trunca',
          'dentro do campo; tela usada por quem preenche de forma esporádica, onde o rótulo sempre',
          'visível na mesma posição vale mais que os 20px economizados; e qualquer tela que já use',
          'rótulo fixo.',
          '',
          'O rótulo continua sendo um `<label>` ligado ao campo por `htmlFor`: ele muda de posição,',
          'nunca vira placeholder e nunca desaparece ao digitar. A transição respeita',
          '`prefers-reduced-motion`.',
        ].join('\n'),
      },
    },
  },
  argTypes: {
    variante: { control: 'inline-radio', options: ['over', 'on', 'in'] },
    size: { control: 'inline-radio', options: ['small', 'normal', 'large'] },
  },
  args: {
    label: 'Número do processo',
    children: <CampoTexto />,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof FloatLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Over: Story = {
  name: 'Variante · over (padrão)',
  args: { variante: 'over' },
  parameters: {
    docs: {
      description: {
        story:
          'O rótulo sobe para fora do campo. É a variante mais legível das três, porque o rótulo flutuado não divide espaço com o valor digitado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Número do processo');

    // Em repouso o rótulo já está visível e associado: não é placeholder.
    await expect(campo).toBeVisible();
    await expect(canvasElement.querySelector('.citie-floatlabel--flutuando')).toBeNull();

    await userEvent.click(campo);
    await expect(campo).toHaveFocus();
    await expect(canvasElement.querySelector('.citie-floatlabel--flutuando')).not.toBeNull();

    // Continua sendo o mesmo rótulo, ainda associado ao campo, depois de digitar.
    await userEvent.type(campo, '2025/0481');
    await expect(canvas.getByLabelText('Número do processo')).toHaveValue('2025/0481');
  },
};

export const On: Story = {
  name: 'Variante · on',
  args: { variante: 'on', label: 'Competência' },
  parameters: {
    docs: {
      description: {
        story:
          'O rótulo flutuado encaixa sobre a borda superior e abre um vão nela. Não combina com o campo preenchido, que não tem borda para interromper.',
      },
    },
  },
};

export const In: Story = {
  name: 'Variante · in',
  args: { variante: 'in', label: 'Secretaria de origem' },
  parameters: {
    docs: {
      description: {
        story:
          'O rótulo fica dentro do campo, acima do valor. O campo cresce para 56px (normal) para acomodar os dois, então essa variante economiza altura só quando substitui rótulo fixo mais campo.',
      },
    },
  },
};

export const Preenchido: Story = {
  name: 'Estado · preenchido',
  args: { children: <CampoTexto defaultValue="2025/0481" /> },
  play: async ({ canvasElement }) => {
    // Valor de partida já mantém o rótulo flutuado, sem depender de foco.
    await expect(canvasElement.querySelector('.citie-floatlabel--flutuando')).not.toBeNull();
  },
};

export const Foco: Story = {
  name: 'Estado · foco por teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Número do processo');
    await userEvent.tab();
    await expect(campo).toHaveFocus();
    await expect(getComputedStyle(campo).boxShadow).not.toBe('none');
  },
};

export const Obrigatorio: Story = {
  name: 'Estado · obrigatório',
  args: { required: true, helper: 'Formato ano/sequencial, como 2025/0481.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Número do processo/)).toHaveAttribute(
      'aria-required',
      'true',
    );
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    label: 'Número do processo',
    children: <CampoTexto defaultValue="0481" />,
    error: 'Número incompleto. Informe o ano e o sequencial, como 2025/0481.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'O valor digitado é preservado e o ícone de alerta acompanha o texto, porque a cor não pode ser o único indicador do erro.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Número do processo');

    await expect(campo).toHaveAttribute('aria-invalid', 'true');
    await expect(campo).toHaveValue('0481');

    const idMensagem = campo.getAttribute('aria-describedby');
    await expect(idMensagem).toBeTruthy();
    await expect(canvasElement.querySelector(`#${idMensagem}`)).toHaveTextContent(
      'Número incompleto. Informe o ano e o sequencial, como 2025/0481.',
    );
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { children: <CampoTexto defaultValue="2025/0481" disabled /> },
  parameters: {
    docs: {
      description: {
        story:
          'O rótulo mantém a cor de texto auxiliar mesmo desabilitado: ele precisa continuar legível para quem lê a tela em modo consulta.',
      },
    },
  },
};

export const Filled: Story = {
  name: 'Variante · filled',
  args: {
    filled: true,
    children: (
      <CampoTexto
        className="citie-field-control--filled"
        defaultValue="Maria de Fátima Souza"
      />
    ),
    label: 'Servidor',
  },
};

export const ComPlaceholder: Story = {
  name: 'Estado · com placeholder',
  args: {
    helper: 'O placeholder mostra o formato; o rótulo diz o que é o dado.',
    children: <CampoTexto placeholder="Ex.: 2025/0481" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Com placeholder o rótulo já nasce flutuado: os dois ocupariam o mesmo lugar em repouso. Não use placeholder só para repetir o rótulo.',
      },
    },
  },
};

export const ComSelect: Story = {
  name: 'Composição · com select',
  args: {
    label: 'Município de destino',
    children: (
      <select className="citie-field-control citie-field-control--normal" defaultValue="">
        <option value="" disabled />
        <option value="sao-luis">São Luís</option>
        <option value="imperatriz">Imperatriz</option>
        <option value="caxias">Caxias</option>
      </select>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'O invólucro serve qualquer controle que aceite `id`, `onFocus`, `onBlur` e `onChange`. Num `select` a opção vazia fica sem texto para o rótulo em repouso não competir com ela.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Município de destino');
    await userEvent.selectOptions(campo, 'imperatriz');
    await expect(canvasElement.querySelector('.citie-floatlabel--flutuando')).not.toBeNull();
  },
};

export const Tamanhos: Story = {
  name: 'Tamanhos · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <FloatLabel {...args} size="small" label="Small">
        <input className="citie-field-control citie-field-control--small" />
      </FloatLabel>
      <FloatLabel {...args} size="normal" label="Normal">
        <input className="citie-field-control citie-field-control--normal" />
      </FloatLabel>
      <FloatLabel {...args} size="large" label="Large">
        <input className="citie-field-control citie-field-control--large" />
      </FloatLabel>
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

export const ComparacaoComOPadrao: Story = {
  name: 'Comparação · rótulo fixo é o padrão',
  args: { label: 'Número do processo' },
  parameters: {
    docs: {
      description: {
        story:
          'À esquerda o padrão do DS: rótulo fixo acima do campo, sempre na mesma altura. À direita a exceção de alta densidade. A diferença de altura é de cerca de 20px por campo; só vale quando a tela tem muitos campos e quem preenche a usa todo dia.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 32 }}>
      <Input label="Número do processo" placeholder="Ex.: 2025/0481" />
      <FloatLabel {...args}>
        <CampoTexto />
      </FloatLabel>
    </div>
  ),
};

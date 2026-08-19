import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { IftaLabel } from './IftaLabel';
import '../../molecules/Select/Select.css';

const MUNICIPIOS = [
  { value: 'sao-luis', label: 'São Luís' },
  { value: 'imperatriz', label: 'Imperatriz' },
  { value: 'caxias', label: 'Caxias' },
  { value: 'timon', label: 'Timon' },
];

/** Chevron do Select nativo, posicionado pela caixa do IftaLabel. */
function Chevron() {
  return (
    <svg
      className="citie-select__chevron"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const meta = {
  title: 'Moléculas/Campos/IftaLabel',
  component: IftaLabel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Rótulo pequeno e **fixo dentro da caixa**, acima do valor (padrão *infield top-aligned label*).',
          'Página do Figma CitieOne `7462:106719`, component set `iftalabel`. Variantes cobertas:',
          '`⚙️ State` (Default · Hover · Active), `❌ Invalid`, `🚫 Disabled` e `🟦 Filled`.',
          'Equivalente PrimeNG: `p-iftalabel`.',
          '',
          '**IftaLabel x FloatLabel:** no IftaLabel o rótulo nasce pequeno no topo da caixa e nunca se move.',
          'Ele convive com o valor e continua legível com o campo vazio, preenchido ou desabilitado.',
          'No FloatLabel o rótulo começa ocupando o lugar do valor e sobe (animado) quando o campo recebe',
          'conteúdo ou foco, o que apaga a instrução no exato momento em que a pessoa digita.',
          '',
          '**O padrão do DS Citiesoft continua sendo rótulo fixo acima do campo** (`Field` / `Input` / `Select`).',
          'Use o IftaLabel só em telas densas que já vêm assim do CitieOne, e nunca misturado com rótulo externo',
          'na mesma linha: a caixa do IftaLabel é 16px mais alta e o alinhamento quebra.',
          '',
          '**Quando não usar:**',
          '',
          '- **Formulário comum de cadastro.** O rótulo acima do campo (`Moléculas/Campos/Input`, `Moléculas/Campos/Select`)',
          '  alinha todos os rótulos numa mesma coluna à esquerda, e é essa coluna que permite varrer um formulário',
          '  longo de cima a baixo sem ler campo por campo.',
          '- **Rótulo longo.** Ele divide a largura da caixa com o valor: "Órgão de origem do encaminhamento" trunca,',
          '  e o servidor perde justamente a parte que distingue esse campo do vizinho. Use `Moléculas/Campos/Input`.',
          '- **Campo com texto de ajuda permanente ou máscara visível.** Formato de data, limite de caracteres e',
          '  exemplo de preenchimento competem com o rótulo dentro da mesma caixa. Use `Moléculas/Campos/Input`,',
          '  com o `helper` abaixo do campo.',
          '- **Tela usada de forma esporádica.** Quem abre a tela uma vez por mês depende do rótulo na posição de',
          '  sempre; economizar altura não compensa nada nesse caso.',
          '- **A tela já usa rótulo acima do campo.** Misturar os dois padrões desalinha a grade, porque a caixa',
          '  do IftaLabel é mais alta. Escolha um padrão por tela.',
          '- **Controle que não tem caixa de texto.** Checkbox, switch, rating e slider não têm onde alojar o',
          '  rótulo interno. Use os componentes de `Átomos/Escolha` e `Átomos/Entrada` com o rótulo próprio deles.',
          '',
          'Entre as duas exceções de densidade, o IftaLabel é o mais seguro: o rótulo continua legível com o campo',
          'preenchido. O `Moléculas/Campos/FloatLabel` economiza um pouco mais de altura e paga com o rótulo saindo',
          'do lugar durante a digitação.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Número do processo',
    children: ({ id, describedBy, invalid, className }) => (
      <input
        id={id}
        className={className}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        defaultValue="2025/0481"
      />
    ),
  },
} satisfies Meta<typeof IftaLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O rótulo é um <label> de verdade: getByLabelText só acha se o for/id fechou.
    const campo = canvas.getByLabelText('Número do processo');
    await expect(campo).toHaveValue('2025/0481');
  },
};

export const Vazio: Story = {
  name: 'Estado · vazio',
  args: {
    label: 'Servidor responsável',
    helper: 'Nome completo, como consta na matrícula.',
    children: ({ id, describedBy, className }) => (
      <input id={id} className={className} aria-describedby={describedBy} defaultValue="" />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Campo vazio e rótulo continua visível: é o que separa o ifta do float.
    const campo = canvas.getByLabelText('Servidor responsável');
    await expect(campo).toHaveValue('');
    await expect(canvas.getByText('Servidor responsável')).toBeVisible();
  },
};

export const Foco: Story = {
  name: 'Estado · foco (Active)',
  args: { label: 'Servidor responsável' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Servidor responsável');
    await userEvent.click(campo);
    await expect(campo).toHaveFocus();
    // Rótulo não sai do lugar ao focar.
    await expect(canvas.getByText('Servidor responsável')).toBeVisible();
  },
};

export const Preenchido: Story = {
  name: 'Estado · digitando',
  args: {
    label: 'Servidor responsável',
    children: ({ id, className }) => <input id={id} className={className} defaultValue="" />,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Servidor responsável');
    await userEvent.type(campo, 'Maria de Fátima Souza');
    await expect(campo).toHaveValue('Maria de Fátima Souza');
    await expect(canvas.getByText('Servidor responsável')).toBeVisible();
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    label: 'Competência',
    required: true,
    error: 'Competência fora do exercício vigente. Informe um mês entre 01/2025 e 12/2025.',
    children: ({ id, describedBy, invalid, className }) => (
      <input
        id={id}
        className={className}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        defaultValue="13/2024"
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText(/Competência/);
    await expect(campo).toHaveAttribute('aria-invalid', 'true');
    await expect(campo).toHaveAccessibleDescription(/exercício vigente/);
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: {
    label: 'Matrícula',
    helper: 'Gerada pelo sistema, não editável.',
    children: ({ id, describedBy, className }) => (
      <input
        id={id}
        className={className}
        aria-describedby={describedBy}
        defaultValue="SES-MA 118.402"
        disabled
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O rótulo mantém contraste de leitura mesmo sobre o fundo desabilitado.
    await expect(canvas.getByText('Matrícula')).toBeVisible();
    await expect(canvas.getByLabelText('Matrícula')).toBeDisabled();
  },
};

export const Filled: Story = {
  name: 'Variante · filled',
  args: {
    label: 'Valor da diária',
    filled: true,
    children: ({ id, className }) => (
      <input id={id} className={className} defaultValue="R$ 320,00" />
    ),
  },
};

export const ComSelect: Story = {
  name: 'Variante · com Select',
  args: {
    label: 'Município de destino',
    helper: 'Município onde o tratamento será realizado.',
    children: ({ id, describedBy, className }) => (
      <>
        <select id={id} className={`${className} citie-select`} aria-describedby={describedBy} defaultValue="">
          <option value="" disabled>
            Selecione o município
          </option>
          {MUNICIPIOS.map((opcao) => (
            <option key={opcao.value} value={opcao.value}>
              {opcao.label}
            </option>
          ))}
        </select>
        <Chevron />
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Município de destino');
    await userEvent.selectOptions(campo, 'imperatriz');
    await expect(campo).toHaveDisplayValue('Imperatriz');
  },
};

export const Tamanhos: Story = {
  name: 'Variante · tamanhos',
  args: { label: 'Número do processo' },
  render: () => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 320 }}>
      {(['small', 'normal', 'large'] as const).map((tamanho) => (
        <IftaLabel key={tamanho} label={`Processo (${tamanho})`} size={tamanho}>
          {({ id, className }) => (
            <input id={id} className={className} defaultValue="2025/0481" />
          )}
        </IftaLabel>
      ))}
    </div>
  ),
};

export const CampoComoElemento: Story = {
  name: 'Composição · campo como elemento',
  args: { label: 'Número do processo' },
  parameters: {
    docs: {
      description: {
        story:
          'Mesma API de invólucro do FloatLabel: o campo pode vir como elemento direto, e o `id`, o `aria-describedby`, o `aria-invalid` e as classes são injetados por clonagem.',
      },
    },
  },
  render: () => (
    <IftaLabel label="Benefício concedido" helper="Conforme a portaria vigente.">
      <input defaultValue="Auxílio-transporte" />
    </IftaLabel>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Benefício concedido');
    await expect(campo).toHaveValue('Auxílio-transporte');
    await expect(campo).toHaveAccessibleDescription('Conforme a portaria vigente.');
  },
};

export const LinhaDeFormulario: Story = {
  name: 'Composição · linha de formulário',
  args: { label: 'Número do processo' },
  parameters: {
    docs: {
      description: {
        story:
          'Numa mesma linha, todos os campos precisam ser IftaLabel: a caixa é mais alta que a do campo com rótulo externo e misturar os dois desalinha a base dos controles.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 560 }}>
      <IftaLabel label="Número do processo">
        {({ id, className }) => (
          <input id={id} className={className} defaultValue="2025/0481" />
        )}
      </IftaLabel>
      <IftaLabel label="Servidor responsável">
        {({ id, className }) => (
          <input id={id} className={className} defaultValue="Maria de Fátima Souza" />
        )}
      </IftaLabel>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const processo = canvas.getByLabelText('Número do processo');
    const servidor = canvas.getByLabelText('Servidor responsável');
    // Mesma altura de caixa mantém a linha alinhada.
    await expect(processo.getBoundingClientRect().height).toBe(
      servidor.getBoundingClientRect().height,
    );
  },
};

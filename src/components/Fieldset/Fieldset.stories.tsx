import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Fieldset } from './Fieldset';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';

const SECRETARIAS = [
  { value: 'ses', label: 'Secretaria de Estado da Saúde' },
  { value: 'seduc', label: 'Secretaria de Estado da Educação' },
  { value: 'sead', label: 'Secretaria de Estado da Administração' },
];

const VINCULOS = [
  { value: 'efetivo', label: 'Efetivo' },
  { value: 'comissionado', label: 'Comissionado' },
  { value: 'contrato', label: 'Contrato temporário' },
];

const grade = { display: 'grid', gap: 16, maxWidth: 480 } as const;

function DadosPessoais() {
  return (
    <div style={grade}>
      <Input label="Nome completo" defaultValue="Maria de Fátima Souza" />
      <Input label="CPF" defaultValue="605.922.293-51" />
      <Input label="Data de nascimento" type="date" defaultValue="1978-04-12" />
    </div>
  );
}

function DadosFuncionais() {
  return (
    <div style={grade}>
      <Input label="Matrícula" defaultValue="0048217" />
      <Select label="Secretaria de lotação" options={SECRETARIAS} placeholder="Selecione a secretaria" />
      <Select label="Vínculo" options={VINCULOS} placeholder="Selecione o vínculo" />
    </div>
  );
}

const meta = {
  title: 'Formulário/Fieldset',
  component: Fieldset,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Agrupamento semântico de campos em `<fieldset>`/`<legend>`, para que o leitor de tela anuncie a legenda junto de cada campo interno. Figma CitieOne, página `6738:49735` (sets `fieldset` e `fieldset-legend`, eixos Toggleable, Collapsed, Hover e Expanded). Equivalente PrimeNG: `p-fieldset`.',
      },
    },
  },
  args: {
    legend: 'Dados pessoais',
    children: <DadosPessoais />,
  },
} satisfies Meta<typeof Fieldset>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Variante · fixo',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A legenda precisa entrar no nome acessível de cada campo do grupo.
    const grupo = canvas.getByRole('group', { name: 'Dados pessoais' });
    await expect(grupo).toBeInTheDocument();
    await expect(canvas.getByLabelText('CPF')).toHaveValue('605.922.293-51');
  },
};

export const ColapsavelAberto: Story = {
  name: 'Colapsável · aberto',
  args: {
    legend: 'Dados funcionais',
    toggleable: true,
    children: <DadosFuncionais />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'O gatilho fica dentro da legend, com ícone de menos e `aria-expanded="true"`. Recolher esconde os campos sem tirá-los do formulário.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Dados funcionais' });

    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByLabelText('Matrícula')).toBeVisible();

    await userEvent.click(gatilho);
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    // O conteúdo continua no formulário, apenas escondido do fluxo e do leitor.
    await expect(canvas.getByLabelText('Matrícula')).not.toBeVisible();
  },
};

export const ColapsavelRecolhido: Story = {
  name: 'Colapsável · recolhido',
  args: {
    legend: 'Dependentes acompanhantes',
    toggleable: true,
    defaultCollapsed: true,
    children: (
      <div style={grade}>
        <Input label="Nome do acompanhante" defaultValue="José Ribamar Souza" />
        <Input label="Grau de parentesco" defaultValue="Filho" />
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Dependentes acompanhantes' });

    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(gatilho);
    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByLabelText('Nome do acompanhante')).toBeVisible();
  },
};

export const FocoPorTeclado: Story = {
  name: 'Colapsável · foco por teclado',
  args: {
    legend: 'Dados bancários',
    toggleable: true,
    children: (
      <div style={grade}>
        <Input label="Banco" defaultValue="001 — Banco do Brasil" />
        <Input label="Agência" defaultValue="3391-2" />
        <Input label="Conta corrente" defaultValue="18.402-7" />
      </div>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Dados bancários' });

    await userEvent.tab();
    await expect(gatilho).toHaveFocus();

    // Enter no gatilho recolhe: o grupo é operável só pelo teclado.
    await userEvent.keyboard('{Enter}');
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Formulario: Story = {
  name: 'Composição · cadastro de servidor',
  parameters: {
    docs: {
      description: {
        story:
          'Formulário de cadastro de servidor dividido em três grupos. O primeiro fica fixo porque é obrigatório; os demais são colapsáveis para encurtar a rolagem da tela.',
      },
    },
  },
  render: () => (
    <form style={{ display: 'grid', gap: 20, maxWidth: 560 }}>
      <Fieldset legend="Dados pessoais">
        <DadosPessoais />
      </Fieldset>
      <Fieldset legend="Dados funcionais" toggleable>
        <DadosFuncionais />
      </Fieldset>
      <Fieldset legend="Endereço" toggleable defaultCollapsed>
        <div style={grade}>
          <Input label="Logradouro" defaultValue="Rua das Palmeiras, 214" />
          <Input label="Bairro" defaultValue="Cohab Anil" />
          <Input label="CEP" defaultValue="65051-290" />
        </div>
      </Fieldset>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('group')).toHaveLength(3);
    await expect(
      canvas.getByRole('button', { name: 'Endereço' }),
    ).toHaveAttribute('aria-expanded', 'false');
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Accordion, Tabs } from './Tabs';

const ABAS = [
  { id: 'dados', rotulo: 'Dados', conteudo: 'Maria de Fátima Souza, matrícula 00123456.' },
  { id: 'documentos', rotulo: 'Documentos', conteudo: 'Laudo médico e comprovante de residência.', contagem: 2 },
  { id: 'historico', rotulo: 'Histórico', conteudo: 'Quatro eventos registrados no processo.' },
];

const meta = {
  title: 'Layout/Tabs e Accordion',
  component: Tabs,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Abas e sanfona. Spec: `03-components/tabs-accordion.md` v2.0.0. Equivalente PrimeNG: `p-tabs`, `p-accordion`. Máximo recomendado de 7 abas visíveis.',
      },
    },
  },
  args: { label: 'Seções do processo', abas: ABAS },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Line: Story = {
  name: 'Variante · line (padrão)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('tablist', { name: 'Seções do processo' });

    await expect(lista).toBeVisible();
    await expect(canvas.getByRole('tab', { name: /Dados/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('tabpanel')).toHaveTextContent(
      'Maria de Fátima Souza, matrícula 00123456.',
    );
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação por teclado',
  parameters: {
    docs: {
      description: {
        story:
          'Setas andam entre as abas em anel, Home e End vão às pontas. Só a aba ativa fica na ordem de tabulação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.tab();
    await expect(canvas.getByRole('tab', { name: /Dados/ })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: /Documentos/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('tab', { name: 'Histórico' })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    // Anel: da última volta para a primeira.
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('tab', { name: /Dados/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const ComContagem: Story = {
  name: 'Conteúdo · badge de contagem',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tab', { name: /Documentos/ })).toHaveTextContent('2');
  },
};

export const ComErroNoPainel: Story = {
  name: 'Estado · erro no painel',
  args: {
    abas: [
      ABAS[0],
      { ...ABAS[1], erro: true },
      { ...ABAS[2], disabled: true },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Formulário com validação em aba inativa sinaliza o erro na própria aba, nunca esconde o problema até a troca manual.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('com erro de preenchimento')).toBeVisible();
    await expect(canvas.getByRole('tab', { name: 'Histórico' })).toBeDisabled();
  },
};

export const Pill: Story = {
  name: 'Variante · pill',
  args: { variante: 'pill' },
};

export const Vertical: Story = {
  name: 'Variante · vertical',
  args: { variante: 'vertical' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('tablist')).toHaveAttribute('aria-orientation', 'vertical');
  },
};

export const Tamanhos: Story = {
  name: 'Tamanhos · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <Tabs {...args} size="sm" label="Subtabs" />
      <Tabs {...args} size="md" label="Padrão de produto" />
      <Tabs {...args} size="lg" label="Navegação primária" />
    </div>
  ),
};

export const Sanfona: Story = {
  name: 'Accordion · seções',
  render: () => (
    <Accordion
      abertoInicial={['elegibilidade']}
      itens={[
        {
          id: 'elegibilidade',
          titulo: 'Critérios de elegibilidade',
          conteudo: 'O servidor precisa ter vínculo ativo e laudo emitido nos últimos 90 dias.',
        },
        {
          id: 'documentos',
          titulo: 'Documentos obrigatórios',
          conteudo: 'Laudo médico, comprovante de residência e documento de identidade.',
        },
        {
          id: 'prazos',
          titulo: 'Prazos de análise',
          conteudo: 'A regulação tem 48 horas para emitir o parecer após o recebimento.',
        },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Documentos obrigatórios' });

    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(gatilho);
    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');

    // Sem `multiplo`, abrir uma fecha a anterior.
    await expect(
      canvas.getByRole('button', { name: 'Critérios de elegibilidade' }),
    ).toHaveAttribute('aria-expanded', 'false');
  },
};

export const SanfonaMultipla: Story = {
  name: 'Accordion · múltiplas abertas',
  render: () => (
    <Accordion
      multiplo
      abertoInicial={['a', 'b']}
      itens={[
        { id: 'a', titulo: 'Identificação', conteudo: 'Nome, CPF e matrícula.' },
        { id: 'b', titulo: 'Vínculo', conteudo: 'Secretaria, cargo e data de admissão.' },
        { id: 'c', titulo: 'Benefícios', conteudo: 'Plano de saúde e vale transporte.' },
      ]}
    />
  ),
};

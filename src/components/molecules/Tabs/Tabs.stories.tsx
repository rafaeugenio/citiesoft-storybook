import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tabs } from './Tabs';

const ABAS = [
  { id: 'dados', rotulo: 'Dados', conteudo: 'Maria de Fátima Souza, matrícula 00123456.' },
  { id: 'documentos', rotulo: 'Documentos', conteudo: 'Laudo médico e comprovante de residência.', contagem: 2 },
  { id: 'historico', rotulo: 'Histórico', conteudo: 'Quatro eventos registrados no processo.' },
];

const meta = {
  title: 'Moléculas/Contêineres/Tabs',
  component: Tabs,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Abas. Spec: `03-components/tabs-accordion.md` v2.0.0. Equivalente PrimeNG: `p-tabs`. Máximo recomendado de 7 abas visíveis.',
          '',
          '**Quando usar Tabs e não Accordion:** Tabs mostra uma seção por vez, para conteúdo paralelo e de mesmo peso, que o usuário consulta em qualquer ordem e alterna várias vezes na mesma sessão (ficha de servidor, detalhe de processo). Se o usuário precisa ver mais de uma seção ao mesmo tempo, ou o conteúdo é de leitura sequencial ou de consulta pontual, use `Accordion`. Etapas sequenciais de um fluxo são Stepper, não Tabs.',
          '',
          '**Quando não usar:** mais de 7 abas, porque a fileira quebra em duas linhas e a posição de cada aba muda a cada redimensionamento, apagando a memória espacial de quem abre a tela todo dia; etapas com ordem obrigatória e validação por etapa, que pedem `Moléculas/Navegação/Stepper`; conteúdo que precisa ser conferido de uma vez antes de um parecer, já que a aba escondida escapa da busca do navegador e da impressão, e dado de processo passa despercebido na conferência; e uma única seção, onde a barra de abas só ocupa altura. Para ver várias seções ao mesmo tempo, use `Moléculas/Contêineres/Accordion`. Para trocar de módulo do sistema, o caminho é roteamento com `Organismos/Menus/Menubar` ou `Organismos/Navegação/Sidebar`.',
          '',
          '**Diferença de papel ARIA:** Tabs monta `tablist` com `tab` e `tabpanel`, então o leitor de tela anuncia a aba ativa dentro de um conjunto e o painel correspondente. O Accordion usa cabeçalho com `aria-expanded` mais região, e anuncia cada seção como aberta ou fechada de forma independente.',
        ].join('\n'),
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

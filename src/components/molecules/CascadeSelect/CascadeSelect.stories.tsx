import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { CascadeSelect, type OpcaoCascata } from './CascadeSelect';

/** Lotação: Secretaria → Departamento → Setor. */
const LOTACAO: OpcaoCascata[] = [
  {
    value: 'saude',
    label: 'Secretaria de Saúde',
    filhos: [
      {
        value: 'atencao-basica',
        label: 'Atenção Básica',
        filhos: [
          { value: 'esf', label: 'Estratégia Saúde da Família' },
          { value: 'vacinacao', label: 'Sala de Vacinação' },
        ],
      },
      {
        value: 'regulacao',
        label: 'Regulação',
        filhos: [
          { value: 'tfd', label: 'Setor de TFD' },
          { value: 'auditoria', label: 'Auditoria de Contas' },
        ],
      },
    ],
  },
  {
    value: 'educacao',
    label: 'Secretaria de Educação',
    filhos: [
      {
        value: 'ensino-fundamental',
        label: 'Ensino Fundamental',
        filhos: [
          { value: 'merenda', label: 'Merenda Escolar' },
          { value: 'transporte-escolar', label: 'Transporte Escolar' },
        ],
      },
    ],
  },
  {
    value: 'gabinete',
    label: 'Gabinete do Prefeito',
  },
];

/** Encaminhamento de TFD: Estado → Município → Unidade de saúde. */
const UNIDADES: OpcaoCascata[] = [
  {
    value: 'ma',
    label: 'Maranhão',
    filhos: [
      {
        value: 'sao-luis',
        label: 'São Luís',
        filhos: [
          { value: 'hu-ufma', label: 'Hospital Universitário da UFMA' },
          { value: 'hospital-tarquinio', label: 'Hospital Tarquínio Lopes Filho' },
        ],
      },
      {
        value: 'imperatriz',
        label: 'Imperatriz',
        filhos: [{ value: 'hospital-materno', label: 'Hospital Materno Infantil' }],
      },
    ],
  },
  {
    value: 'pa',
    label: 'Pará',
    filhos: [
      {
        value: 'belem',
        label: 'Belém',
        filhos: [{ value: 'ophir-loyola', label: 'Hospital Ophir Loyola' }],
      },
    ],
  },
];

const meta = {
  title: 'Moléculas/Campos/CascadeSelect',
  component: CascadeSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Escolha única dentro de uma hierarquia, com o painel em colunas: o item ativo de um nível define o conteúdo do nível seguinte, até 3 níveis. Origem: Figma CitieOne, página 6738:22639 (`cascadeselect` State: Idle | Open | Hover e Hierarchy: 1 | 2 | 3; `cascadeselect-input` State, Invalid, Disabled, Filled, Size, Show Label, Show Helper, Show Clear Icon; `cascadeselect-option` State: Default | Hover / Focus | Selected e Group). O campo mostra o caminho inteiro, porque a folha isolada ("Regulação") não diz de qual secretaria veio. Teclado: seta direita entra no nível seguinte, seta esquerda volta, Escape fecha e devolve o foco ao gatilho. Equivalente PrimeNG: `p-cascadeselect`.',
          '',
          '**CascadeSelect ou TreeSelect?** Os dois resolvem hierarquia, e a diferença decide o registro que vai para o processo. **Neste componente só a folha é selecionável:** acionar um item que tem filhos abre o nível seguinte e nunca grava valor. Use o CascadeSelect quando a profundidade for previsível (até 3 níveis) e a resposta válida for sempre o último nível, como Estado, Município e Unidade de saúde. Use `Moléculas/Campos/TreeSelect` quando a profundidade variar entre os ramos ou quando um nó intermediário for resposta válida por si só, como lotar um servidor diretamente na secretaria sem passar por departamento.',
          '',
          '**Quando não usar:**',
          '',
          '- **Lista plana.** Sem filhos, o painel vira uma coluna única com o custo visual de três. Use `Moléculas/Campos/Select`.',
          '- **Hierarquia com ramos de profundidades diferentes.** No exemplo desta página, "Gabinete do Prefeito" não tem filhos e é selecionável no primeiro nível, enquanto "Secretaria de Saúde" só grava valor no terceiro. Esse comportamento assimétrico é aceitável em lista curta e conhecida, e vira armadilha em estrutura grande, onde o servidor não sabe se já pode parar. Nesse caso, `Moléculas/Campos/TreeSelect`.',
          '- **Mais de um valor.** O componente grava um caminho por vez. Use `Moléculas/Campos/TreeSelect` no modo `checkbox` ou `Moléculas/Campos/MultiSelect` se a hierarquia puder ser achatada.',
          '- **Muitos itens por nível.** As colunas não têm filtro, então uma coluna com 200 municípios exige rolagem dentro do painel. Use `Moléculas/Campos/AutoComplete`, com o caminho completo no texto de cada sugestão.',
          '- **A pessoa já sabe o nome da folha.** Quem digita "Hospital Ophir Loyola" não precisa percorrer Pará e Belém antes. Ofereça `Moléculas/Campos/AutoComplete` como caminho principal e deixe o CascadeSelect para quem está explorando a estrutura.',
          '- **Navegar entre telas do sistema.** Painel em colunas com submenus é `Organismos/Menus/TieredMenu` ou `Organismos/Menus/MegaMenu`. O CascadeSelect é campo de formulário e grava dado.',
          '',
          'Uma restrição de espaço a considerar antes de escolher: cada coluna do painel tem no mínimo 180px e elas ficam lado a lado, então três níveis abertos pedem perto de 570px de largura livre a partir da borda esquerda do campo. Em drawer estreito ou em coluna lateral de formulário, o `TreeSelect`, que cresce para baixo, se comporta melhor.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Lotação do servidor',
    opcoes: LOTACAO,
    placeholder: 'Selecione a lotação',
  },
} satisfies Meta<typeof CascadeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  name: 'State · idle',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Lotação do servidor' });

    await expect(gatilho).toHaveAttribute('aria-haspopup', 'listbox');
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const Aberto: Story = {
  name: 'State · open',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Lotação do servidor' });
    await userEvent.click(gatilho);

    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');

    const primeiroNivel = canvas.getByRole('listbox', { name: 'Lotação do servidor' });
    await expect(primeiroNivel).toHaveFocus();
    await expect(within(primeiroNivel).getAllByRole('option')).toHaveLength(3);
  },
};

export const Hierarquia: Story = {
  name: 'Hierarchy · 3 níveis',
  parameters: {
    docs: {
      description: {
        story: 'Cada nível abre uma coluna nova rotulada pelo item pai, e o nível anterior filtra o seguinte.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Lotação do servidor' }));

    await userEvent.click(canvas.getByRole('option', { name: /Secretaria de Saúde/ }));
    await expect(canvas.getAllByRole('listbox')).toHaveLength(2);

    await userEvent.click(canvas.getByRole('option', { name: /^Regulação/ }));
    const terceiroNivel = canvas.getByRole('listbox', { name: 'Regulação' });
    await expect(within(terceiroNivel).getAllByRole('option')).toHaveLength(2);
  },
};

export const CaminhoCompleto: Story = {
  name: 'State · selected (caminho completo)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Lotação do servidor' });

    await userEvent.click(gatilho);
    await userEvent.click(canvas.getByRole('option', { name: /Secretaria de Saúde/ }));
    await userEvent.click(canvas.getByRole('option', { name: /^Regulação/ }));
    await userEvent.click(canvas.getByRole('option', { name: 'Setor de TFD' }));

    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(gatilho).toHaveTextContent('Secretaria de Saúde / Regulação / Setor de TFD');
  },
};

export const Teclado: Story = {
  name: 'Comportamento · teclado entre níveis',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Lotação do servidor' }));

    // Seta direita entra no nível seguinte, seta esquerda volta.
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('listbox', { name: 'Secretaria de Saúde' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('listbox', { name: 'Regulação' })).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('listbox', { name: 'Secretaria de Saúde' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await userEvent.keyboard('{ArrowDown}');
    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: 'Lotação do servidor' })).toHaveTextContent(
      'Secretaria de Saúde / Regulação / Auditoria de Contas',
    );
  },
};

export const FecharComEscape: Story = {
  name: 'Comportamento · Escape devolve o foco',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Lotação do servidor' });

    await userEvent.click(gatilho);
    await userEvent.keyboard('{Escape}');

    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
    await expect(gatilho).toHaveFocus();
  },
};

export const ValorInicial: Story = {
  name: 'Estado · com valor inicial',
  args: { defaultValue: ['educacao', 'ensino-fundamental', 'merenda'] },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('button', { name: 'Lotação do servidor' }),
    ).toHaveTextContent('Secretaria de Educação / Ensino Fundamental / Merenda Escolar');
  },
};

export const ComLimpar: Story = {
  name: 'Variante · ícone de limpar',
  args: { comLimpar: true, defaultValue: ['gabinete'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Limpar lotação do servidor' }));

    await expect(canvas.getByRole('button', { name: 'Lotação do servidor' })).toHaveTextContent(
      'Selecione a lotação',
    );
  },
};

export const ComHelper: Story = {
  name: 'Estado · com helper',
  args: {
    required: true,
    helper: 'A lotação define quem aprova as diárias do servidor.',
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: { error: 'Escolha a lotação até o setor para concluir o cadastro.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Lotação do servidor' });

    await expect(gatilho).toHaveAttribute('aria-invalid', 'true');
    await expect(
      canvas.getByText('Escolha a lotação até o setor para concluir o cadastro.'),
    ).toBeVisible();
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, defaultValue: ['saude', 'regulacao', 'tfd'] },
};

export const Filled: Story = {
  name: 'Variante · filled',
  args: { filled: true },
};

export const Tamanhos: Story = {
  name: 'Size · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <CascadeSelect {...args} size="small" label="Small" />
      <CascadeSelect {...args} size="normal" label="Normal" />
      <CascadeSelect {...args} size="large" label="Large" />
    </div>
  ),
};

export const UnidadeDeSaude: Story = {
  name: 'Uso · unidade de destino do TFD',
  args: {
    label: 'Unidade de destino',
    opcoes: UNIDADES,
    placeholder: 'Selecione a unidade',
    helper: 'Estado, município e unidade que vão receber o paciente do processo 2025/0481.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Unidade de destino' }));
    await userEvent.click(canvas.getByRole('option', { name: /Maranhão/ }));
    await userEvent.click(canvas.getByRole('option', { name: /São Luís/ }));
    await userEvent.click(canvas.getByRole('option', { name: 'Hospital Universitário da UFMA' }));

    await expect(canvas.getByRole('button', { name: 'Unidade de destino' })).toHaveTextContent(
      'Maranhão / São Luís / Hospital Universitário da UFMA',
    );
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { AutoComplete } from './AutoComplete';

const MUNICIPIOS = [
  { value: 'sao-luis', label: 'São Luís' },
  { value: 'imperatriz', label: 'Imperatriz' },
  { value: 'caxias', label: 'Caxias' },
  { value: 'timon', label: 'Timon' },
  { value: 'bacabal', label: 'Bacabal' },
  { value: 'balsas', label: 'Balsas' },
  { value: 'santa-ines', label: 'Santa Inês' },
];

const SERVIDORES = [
  { value: '1', label: 'Maria de Fátima Souza' },
  { value: '2', label: 'João Batista Ribeiro' },
  { value: '3', label: 'Ana Cláudia Ferreira' },
  { value: '4', label: 'Raimundo Nonato Lima' },
];

const ESPECIALIDADES = [
  { value: 'cardio', label: 'Cardiologia', grupo: 'Clínicas' },
  { value: 'neuro', label: 'Neurologia', grupo: 'Clínicas' },
  { value: 'onco', label: 'Oncologia', grupo: 'Clínicas' },
  { value: 'ortopedia', label: 'Ortopedia', grupo: 'Cirúrgicas' },
  { value: 'buco', label: 'Bucomaxilofacial', grupo: 'Cirúrgicas' },
  { value: 'vascular', label: 'Cirurgia vascular', grupo: 'Cirúrgicas' },
];

const meta = {
  title: 'Moléculas/Campos/AutoComplete',
  component: AutoComplete,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Campo de busca com sugestões em tempo real. Origem: Figma CitieOne, página 6728:52564 (`autocomplete` com State: Idle | Open, Dropdown e Multiple; `autocomplete-option` com State: Default | Hover / Focus | Highlight e Group; `autocomplete-chip` com State: Default | Focus; campo em Normal | Small | Large, mais Invalid, Disabled e Filled). O foco nunca sai do campo: as setas movem o destaque via `aria-activedescendant`, Enter escolhe e Escape fecha. Equivalente PrimeNG: `p-autocomplete`.\n\n**Quando usar:** para escolher um item de uma lista longa que o servidor já conhece pelo nome (município, servidor, especialidade, unidade de saúde), onde digitar três letras chega mais rápido do que rolar.\n\n**Quando não usar:** para lista curta e fechada, de até cerca de dez opções, como situação do processo ou tipo de vínculo. O campo em branco não revela quais são as opções, e quem entra na tela uma vez por mês não sabe o que digitar para começar; use `Select`, que mostra o conjunto inteiro, ou pelo menos ative `comDropdown`. Para valor que o servidor pode escrever livremente, fora da lista: o componente só devolve itens de `opcoes` e o texto sem correspondência se perde quando o campo perde o foco, levando junto o que a pessoa acabou de digitar; use `Input`. Para escolha múltipla numa lista fechada e conhecida, `MultiSelect` mostra o total e o estado de cada item, enquanto as fichas do modo múltiplo aqui exigem digitar item por item. Para dado que só faz sentido dentro de uma hierarquia (unidade dentro da secretaria, município dentro da regional), use `CascadeSelect` ou `TreeSelect`, que deixam o caminho visível e evitam a escolha do nome repetido no nível errado. E para procurar registros e ir até eles, o caminho é `Search` ou `FilterBar`: o AutoComplete preenche o valor de um campo e não leva a lugar nenhum.',
      },
    },
  },
  args: {
    label: 'Município de destino',
    opcoes: MUNICIPIOS,
    placeholder: 'Digite o município',
  },
} satisfies Meta<typeof AutoComplete>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  name: 'State · idle',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Município de destino' });

    await expect(campo).toHaveAttribute('aria-expanded', 'false');
    await expect(campo).toHaveAttribute('aria-autocomplete', 'list');
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const Aberto: Story = {
  name: 'State · open (filtra ao digitar)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Município de destino' });

    await userEvent.type(campo, 'ba');

    await expect(campo).toHaveAttribute('aria-expanded', 'true');
    const lista = canvas.getByRole('listbox', { name: 'Município de destino' });
    await expect(campo).toHaveAttribute('aria-controls', lista.id);
    // Bacabal e Balsas.
    await expect(canvas.getAllByRole('option')).toHaveLength(2);
  },
};

export const Teclado: Story = {
  name: 'Comportamento · setas e Enter',
  parameters: {
    docs: {
      description: {
        story:
          'A seta move o destaque sem tirar o foco do campo: quem usa leitor de tela continua ouvindo o que digitou enquanto a opção destacada é anunciada por `aria-activedescendant`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Município de destino' });

    await userEvent.type(campo, 'ba');
    await userEvent.keyboard('{ArrowDown}');

    const primeira = canvas.getByRole('option', { name: /Bacabal/ });
    await expect(campo).toHaveAttribute('aria-activedescendant', primeira.id);
    await expect(campo).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(campo).toHaveAttribute(
      'aria-activedescendant',
      canvas.getByRole('option', { name: /Balsas/ }).id,
    );

    await userEvent.keyboard('{Enter}');
    await expect(campo).toHaveValue('Balsas');
    await expect(campo).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Escape: Story = {
  name: 'Comportamento · Escape fecha',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Município de destino' });

    await userEvent.type(campo, 'ba');
    await expect(canvas.getByRole('listbox')).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    await expect(campo).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const ComDropdown: Story = {
  name: 'Dropdown · true',
  args: {
    comDropdown: true,
    label: 'Servidor solicitante',
    opcoes: SERVIDORES,
    placeholder: 'Busque pelo nome',
  },
  parameters: {
    docs: {
      description: {
        story:
          'O botão mostra a lista inteira sem digitar nada, para quem não sabe de cor como o nome está cadastrado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Mostrar todas as opções de servidor solicitante' }),
    );

    await expect(canvas.getAllByRole('option')).toHaveLength(4);
    await expect(canvas.getByRole('combobox', { name: 'Servidor solicitante' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  },
};

export const Grupos: Story = {
  name: 'Option · grupos',
  args: {
    label: 'Especialidade',
    opcoes: ESPECIALIDADES,
    comDropdown: true,
    placeholder: 'Digite a especialidade',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Grupos montados com `div role="group"` nomeado, nunca `ul`/`li`: `role="group"` não é permitido em item de lista.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', { name: 'Mostrar todas as opções de especialidade' }),
    );

    await expect(canvas.getByRole('group', { name: 'Clínicas' })).toBeInTheDocument();
    await expect(canvas.getByRole('group', { name: 'Cirúrgicas' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('option')).toHaveLength(6);
  },
};

export const Multiplo: Story = {
  name: 'Multiple · chips',
  args: {
    multiplo: true,
    label: 'Especialidades autorizadas',
    opcoes: ESPECIALIDADES,
    placeholder: 'Adicione uma especialidade',
    helper: 'Adicione quantas forem necessárias para o processo.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByRole('combobox', { name: 'Especialidades autorizadas' });

    await userEvent.type(campo, 'onco');
    await userEvent.click(canvas.getByRole('option', { name: /Oncologia/ }));

    await expect(canvas.getByRole('button', { name: 'Remover Oncologia' })).toBeVisible();
    // O campo continua aberto para a próxima escolha, com o texto já limpo.
    await expect(campo).toHaveValue('');
  },
};

export const RemoverChip: Story = {
  name: 'Multiple · remover ficha',
  args: {
    multiplo: true,
    label: 'Especialidades autorizadas',
    opcoes: ESPECIALIDADES,
    defaultValue: ['cardio', 'ortopedia'],
    placeholder: 'Adicione uma especialidade',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getAllByRole('button', { name: /^Remover/ })).toHaveLength(2);

    await userEvent.click(canvas.getByRole('button', { name: 'Remover Cardiologia' }));

    await expect(canvas.queryByRole('button', { name: 'Remover Cardiologia' })).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Remover Ortopedia' })).toBeVisible();
  },
};

export const SemResultado: Story = {
  name: 'Comportamento · sem resultado',
  parameters: {
    docs: {
      description: {
        story:
          'Sem itens, o container deixa de ser `listbox`: texto solto dentro de uma lista de opções quebra a estrutura ARIA.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByRole('combobox', { name: 'Município de destino' }),
      'petrolina',
    );

    await expect(canvas.getByText('Nenhuma opção corresponde ao que você digitou')).toBeVisible();
    await expect(canvas.queryByRole('listbox')).not.toBeInTheDocument();
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    required: true,
    error: 'Informe o município de destino para calcular a diária.',
  },
  play: async ({ canvasElement }) => {
    const campo = within(canvasElement).getByRole('combobox', { name: /Município de destino/ });
    await expect(campo).toHaveAttribute('aria-invalid', 'true');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: {
    disabled: true,
    defaultValue: ['sao-luis'],
    helper: 'O município já foi fixado pela autorização do processo 2025/0481.',
  },
};

export const Filled: Story = {
  name: 'Variante · filled',
  args: { filled: true, comDropdown: true },
};

export const Tamanhos: Story = {
  name: 'Size · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <AutoComplete {...args} size="small" label="Município (small)" />
      <AutoComplete {...args} size="normal" label="Município (normal)" />
      <AutoComplete {...args} size="large" label="Município (large)" />
    </div>
  ),
};

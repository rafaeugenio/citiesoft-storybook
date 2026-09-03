import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Listbox } from './Listbox';

const ESPECIALIDADES = [
  { value: 'cardio', label: 'Cardiologia', grupo: 'Clínicas' },
  { value: 'neuro', label: 'Neurologia', grupo: 'Clínicas' },
  { value: 'onco', label: 'Oncologia', grupo: 'Clínicas' },
  { value: 'orto', label: 'Ortopedia', grupo: 'Cirúrgicas' },
  { value: 'oftalmo', label: 'Oftalmologia', grupo: 'Cirúrgicas' },
  { value: 'vascular', label: 'Cirurgia vascular', grupo: 'Cirúrgicas', disabled: true },
];

const meta = {
  title: 'Moléculas/Campos/Listbox',
  component: Listbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Lista sempre visível, sem overlay. Origem: Figma CitieOne, página ❖ Listbox (State: Idle | Invalid | Disabled, Show Filter, e a opção com State, Group e Checkmark). Equivalente PrimeNG: `p-listbox`.',
          '',
          '**O padrão do DS para escolher um valor num formulário é o campo fechado** (`Moléculas/Campos/Select`, `Moléculas/Campos/MultiSelect`). O Listbox é a exceção para quando ver o conjunto inteiro faz parte da tarefa: painel de transferência lado a lado, tela de conferência onde o servidor marca especialidades e confere o que marcou sem reabrir nada, seleção que fica visível enquanto o resultado é lido ao lado. Ele ocupa altura fixa (`altura`, 220px por padrão) e essa altura é o preço.',
          '',
          '**Quando não usar:**',
          '',
          '- **Formulário de cadastro comum.** Uma lista aberta de 12 especialidades entre dois campos de texto quebra o ritmo de leitura da coluna e empurra os campos seguintes para fora da dobra. Use `Moléculas/Campos/Select` ou `Moléculas/Campos/MultiSelect`.',
          '- **Duas a cinco opções.** A caixa com borda e rolagem custa mais atenção que as opções soltas. Use `Moléculas/Escolha/RadioGroup` para escolha única e `Átomos/Escolha/Checkbox` em grupo para múltipla.',
          '- **Catálogo longo.** Mesmo com `comFiltro`, rolar milhares de linhas dentro de 220px é penoso. Use `Moléculas/Campos/AutoComplete`.',
          '- **Opções hierárquicas.** O `grupo` deste componente entrega um nível de cabeçalho e nada além. Para secretaria, departamento e setor, use `Moléculas/Campos/CascadeSelect` ou `Moléculas/Campos/TreeSelect`.',
          '- **Mover itens entre duas listas ou ordenar o que foi escolhido.** Use `Organismos/Coleções/PickList` para transferência e `Organismos/Coleções/OrderList` para ordem.',
          '- **Listar registros para consulta, sem escolher nada.** Um `role="listbox"` sobre conteúdo que ninguém seleciona faz o leitor de tela anunciar opções inexistentes. Use `Organismos/Tabelas/Table` ou `Organismos/Coleções/DataView`.',
          '',
          'Sobre acessibilidade: o foco fica no container da lista, com setas, Home, End, Enter e espaço operando a opção ativa. Isso mantém um único ponto de parada no Tab, o que ajuda em formulário longo, e exige que o rótulo acima descreva o conjunto, porque é ele que o leitor de tela anuncia ao entrar na região.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Especialidade', opcoes: ESPECIALIDADES },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'State · idle',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('listbox', { name: 'Especialidade' });

    await expect(lista).toBeVisible();
    // Item de 32 do kit (padding 4 × 8 incluído): antes media 40 em content-box.
    for (const opcao of canvas.getAllByRole('option')) {
      await expect(opcao.getBoundingClientRect().height).toBe(32);
    }
    await userEvent.click(canvas.getByRole('option', { name: 'Neurologia' }));
    await expect(canvas.getByRole('option', { name: 'Neurologia' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const Agrupada: Story = {
  name: 'Option · agrupada',
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho de grupo por categoria, com as opções em um grupo nomeado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Clínicas' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: 'Cirúrgicas' })).toBeVisible();
  },
};

export const Multipla: Story = {
  name: 'Variante · múltipla com checkmark',
  args: { multiplo: true, defaultValue: ['cardio'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('listbox');

    await expect(lista).toHaveAttribute('aria-multiselectable', 'true');
    await userEvent.click(canvas.getByRole('option', { name: /Ortopedia/ }));

    await expect(canvas.getByRole('option', { name: /Cardiologia/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('option', { name: /Ortopedia/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const ComFiltro: Story = {
  name: 'Show Filter · com filtro',
  args: { comFiltro: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('searchbox', { name: 'Filtrar especialidade' }), 'onco');
    await expect(canvas.getByRole('option', { name: 'Oncologia' })).toBeVisible();
    await expect(canvas.queryByRole('option', { name: 'Ortopedia' })).toBeNull();
  },
};

export const SemResultado: Story = {
  name: 'Estado · filtro sem resultado',
  args: { comFiltro: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox'), 'zzz');
    await expect(canvas.getByText('Nenhuma opção para o filtro aplicado')).toBeVisible();
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação por teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('listbox');

    lista.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(canvas.getByRole('option', { name: 'Oncologia' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const Invalida: Story = {
  name: 'State · invalid',
  args: { error: 'Escolha a especialidade para seguir com a solicitação.' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Escolha a especialidade para seguir com a solicitação.'),
    ).toBeVisible();
  },
};

export const Desabilitada: Story = {
  name: 'State · disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('listbox')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  },
};

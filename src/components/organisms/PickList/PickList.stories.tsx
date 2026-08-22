import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { PickList } from './PickList';

const PERFIS_DISPONIVEIS = [
  { value: 'tfd-solicitante', label: 'TFD · Solicitante', descricao: 'Abre e acompanha solicitações' },
  { value: 'tfd-autorizador', label: 'TFD · Autorizador', descricao: 'Defere ou indefere o pedido' },
  { value: 'diaria-lancamento', label: 'Diária · Lançamento', descricao: 'Registra diária por competência' },
  { value: 'beneficio-consulta', label: 'Benefício · Consulta', descricao: 'Somente leitura' },
  { value: 'relatorio-gerencial', label: 'Relatório gerencial', descricao: 'Exporta consolidados da secretaria' },
];

const PERFIS_ATRIBUIDOS = [
  { value: 'protocolo', label: 'Protocolo', descricao: 'Recebe e distribui processos' },
];

const UNIDADES = [
  { value: 'ubs-centro', label: 'UBS Centro', descricao: 'São Luís · 12 equipes' },
  { value: 'ubs-cohab', label: 'UBS Cohab', descricao: 'São Luís · 8 equipes' },
  { value: 'hosp-imperatriz', label: 'Hospital Regional de Imperatriz', descricao: 'Imperatriz · 24 leitos' },
  { value: 'ubs-caxias', label: 'UBS Caxias Sede', descricao: 'Caxias · 6 equipes' },
];

const meta = {
  title: 'Organismos/Coleções/PickList',
  component: PickList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Duas listas lado a lado com transferência por botão. Origem: Figma CitieOne, página ❖ PickList, nó `picklist` (sem eixos de variante: `controls` · `listbox` · `controls` · `listbox` · `controls`, com as colunas das pontas reordenando e a central transferindo). Cada lista tem nome acessível próprio, é `role="listbox"` com `aria-multiselectable` e itens `role="option"` navegáveis por setas, Home e End; Espaço ou Enter marca. Toda transferência é anunciada em região `aria-live="polite"` com a contagem das duas listas. Arrastar não é oferecido como caminho único: os botões são a via principal. Equivalente PrimeNG: `p-pickList`.',
          '',
          '**Quando usar:** atribuição em que o servidor precisa revisar o antes e o depois na mesma tela',
          'antes de salvar, como perfis de acesso de um usuário ou unidades vinculadas a uma secretaria.',
          'A lista de destino é o resultado, e ele fica auditável à vista.',
          '',
          '**Quando não usar:** escolha em que só importa quais itens ficaram marcados, sem revisão lado',
          'a lado, porque duas colunas mais três blocos de botões custam muito mais altura e cliques do',
          'que uma lista com caixas de seleção (use `MultiSelect` ou `Checkbox`); origem com centenas de',
          'itens, já que o componente não tem busca e a coluna vira rolagem longa até achar o item (use',
          '`MultiSelect` ou `AutoComplete`, que filtram por digitação); reordenar uma lista só, que é do',
          '`OrderList`; vínculo que carrega dado próprio por item, como vigência, matrícula ou data de',
          'início, porque aqui o item é apenas rótulo e descrição, sem campo editável (use `Table`); e',
          'telas estreitas, onde as duas listas e as colunas de controle não cabem lado a lado e a',
          'comparação, que é a razão de existir do componente, se perde.',
        ].join('\n'),
      },
    },
  },
  args: {
    legenda: 'Perfis de acesso do servidor Maria de Fátima Souza',
    rotuloOrigem: 'Perfis disponíveis',
    rotuloDestino: 'Perfis atribuídos',
    itensOrigem: PERFIS_DISPONIVEIS,
    itensDestino: PERFIS_ATRIBUIDOS,
  },
} satisfies Meta<typeof PickList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · padrão',
  parameters: {
    docs: {
      description: {
        story:
          'Atribuição de perfis de acesso ao servidor. As duas listas aparecem com nomes distintos e os botões de transferência começam desabilitados enquanto nada estiver marcado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('listbox', { name: /Perfis disponíveis/ })).toBeVisible();
    await expect(canvas.getByRole('listbox', { name: /Perfis atribuídos/ })).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Mover selecionados para Perfis atribuídos' }),
    ).toBeDisabled();
  },
};

export const Transferencia: Story = {
  name: 'Comportamento · transferir selecionados',
  parameters: {
    docs: {
      description: {
        story: 'O item marcado sai da origem, entra no destino e o resultado é anunciado com a contagem das duas listas.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('option', { name: /TFD · Autorizador/ }));
    const mover = canvas.getByRole('button', { name: 'Mover selecionados para Perfis atribuídos' });
    await expect(mover).toBeEnabled();
    await userEvent.click(mover);

    const destino = canvas.getByRole('listbox', { name: /Perfis atribuídos/ });
    await expect(within(destino).getByRole('option', { name: /TFD · Autorizador/ })).toBeVisible();

    const origem = canvas.getByRole('listbox', { name: /Perfis disponíveis/ });
    await expect(within(origem).getAllByRole('option')).toHaveLength(4);
    await expect(
      canvas.getByText(
        '1 item movido para Perfis atribuídos. Perfis disponíveis: 4 itens. Perfis atribuídos: 2 itens.',
      ),
    ).toBeInTheDocument();
  },
};

export const TransferirTodos: Story = {
  name: 'Comportamento · transferir todos',
  parameters: {
    docs: {
      description: {
        story: 'Esvaziada a origem, o container abandona o papel `listbox`, que é inválido sem opções, e exibe a mensagem de vazio.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Mover todos para Perfis atribuídos' }));

    await expect(canvas.queryByRole('listbox', { name: /Perfis disponíveis/ })).toBeNull();
    await expect(canvas.getByText('Nenhum item em perfis disponíveis')).toBeVisible();
    await expect(
      within(canvas.getByRole('listbox', { name: /Perfis atribuídos/ })).getAllByRole('option'),
    ).toHaveLength(6);
  },
};

export const Teclado: Story = {
  name: 'Comportamento · navegação por teclado',
  parameters: {
    docs: {
      description: {
        story: 'A lista recebe foco, as setas movem o item ativo e Espaço marca sem tirar o foco do container.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const origem = canvas.getByRole('listbox', { name: /Perfis disponíveis/ });

    origem.focus();
    await expect(origem).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await userEvent.keyboard(' ');

    await expect(canvas.getByRole('option', { name: /Diária · Lançamento/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(
      canvas.getByRole('button', { name: 'Mover selecionados para Perfis atribuídos' }),
    ).toBeEnabled();
  },
};

export const ComReordenacao: Story = {
  name: 'Variante · com reordenação',
  args: {
    legenda: 'Unidades de saúde do mutirão de cirurgias eletivas',
    rotuloOrigem: 'Unidades disponíveis',
    rotuloDestino: 'Unidades do mutirão',
    itensOrigem: UNIDADES,
    itensDestino: [],
    comReordenacao: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Colunas das pontas do Figma ativas: a ordem do destino define a sequência de atendimento do mutirão. Cada botão de reordenação diz em qual lista atua.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('group', { name: 'Reordenar Unidades disponíveis' })).toBeVisible();
    await expect(canvas.getByText('Nenhum item em unidades do mutirão')).toBeVisible();

    await userEvent.click(canvas.getByRole('option', { name: /UBS Caxias Sede/ }));
    await userEvent.click(canvas.getByRole('button', { name: 'Mover para o topo de Unidades disponíveis' }));

    const opcoes = within(canvas.getByRole('listbox', { name: /Unidades disponíveis/ })).getAllByRole(
      'option',
    );
    await expect(opcoes[0]).toHaveTextContent('UBS Caxias Sede');
  },
};

export const Desabilitada: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Com o processo já homologado os perfis ficam travados. As listas rolam, então continuam focáveis: o estado é comunicado por `aria-disabled`, não pela remoção do foco.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const origem = canvas.getByRole('listbox', { name: /Perfis disponíveis/ });

    await expect(origem).toHaveAttribute('aria-disabled', 'true');
    await expect(origem).toHaveAttribute('tabindex', '0');
    await expect(canvas.getByRole('button', { name: 'Mover todos para Perfis atribuídos' })).toBeDisabled();
  },
};

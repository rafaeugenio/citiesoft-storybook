import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { OrderList } from './OrderList';

const ETAPAS_DO_FLUXO = [
  { id: 'recepcao', label: 'Recepção da solicitação', detalhe: 'Setor de protocolo' },
  { id: 'triagem', label: 'Triagem pela regulação', detalhe: 'Central de regulação' },
  { id: 'analise', label: 'Análise do médico regulador', detalhe: 'Médico regulador de plantão' },
  { id: 'autorizacao', label: 'Autorização da diária', detalhe: 'Coordenação do TFD' },
  { id: 'passagem', label: 'Emissão da passagem', detalhe: 'Setor de transporte' },
  { id: 'confirmacao', label: 'Confirmação com o paciente', detalhe: 'Atendimento' },
  { id: 'prestacao', label: 'Prestação de contas', detalhe: 'Financeiro' },
];

const FILA_DE_REGULACAO = [
  { id: 'p-0481', label: 'Processo 2025/0481, Maria de Fátima Souza', detalhe: 'Oncologia · urgente' },
  { id: 'p-0512', label: 'Processo 2025/0512, João Batista Lima', detalhe: 'Cardiologia · eletivo' },
  { id: 'p-0533', label: 'Processo 2025/0533, Antônia Ribeiro', detalhe: 'Oftalmologia · eletivo' },
  { id: 'p-0547', label: 'Processo 2025/0547, Raimundo Nonato', detalhe: 'Ortopedia · prioritário' },
];

const meta = {
  title: 'Organismos/Coleções/OrderList',
  component: OrderList,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista reordenável por botões de mover (para cima, para o topo, para baixo, para o fim). Origem: Figma CitieOne, página ❖ OrderList, com um componente `orderlist` sem eixos de variante, composto por uma coluna `controls` com quatro botões `Severity: Secondary` + `Icon Only: True` (angle-up, angle-double-up, angle-down, angle-double-down) ao lado de uma instância de `listbox`, com exemplos em Mode Light e Mode Dark. Equivalente PrimeNG: `p-orderList`.\n\nOs botões são o caminho principal de reordenação, não o secundário: arrastar sozinho exclui quem usa teclado ou leitor de tela. Cada botão nomeia o item que move e todo movimento é anunciado em região `aria-live="polite"` com a nova posição. Pelo teclado, as setas movem a seleção e `Alt` + setas movem o item; `Alt + Home` e `Alt + End` levam ao início e ao fim.',
      },
    },
  },
  args: {
    titulo: 'Ordem das etapas do fluxo de aprovação',
    itens: ETAPAS_DO_FLUXO,
  },
} satisfies Meta<typeof OrderList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Padrão · etapas do fluxo de aprovação',
  args: {
    descricao: 'A ordem define a sequência em que cada setor recebe o processo.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('listbox')).toHaveAccessibleName(
      'Ordem das etapas do fluxo de aprovação',
    );
    await expect(canvas.getAllByRole('option')).toHaveLength(7);
  },
};

export const SemSelecao: Story = {
  name: 'Estado · sem item selecionado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Sem item escolhido não há o que mover: os quatro controles ficam inertes
    // e o próprio nome acessível diz o que falta fazer.
    const botao = canvas.getByRole('button', {
      name: 'Mover uma posição para cima: selecione um item da lista',
    });
    await expect(botao).toBeDisabled();
    await expect(canvas.queryAllByRole('option', { selected: true })).toHaveLength(0);
  },
};

export const MoverParaCima: Story = {
  name: 'Comportamento · mover uma posição para cima',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('option', { name: /Autorização da diária/ }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mover Autorização da diária uma posição para cima' }),
    );

    const opcoes = canvas.getAllByRole('option');
    await expect(opcoes[2]).toHaveTextContent('Autorização da diária');
    await expect(opcoes[3]).toHaveTextContent('Análise do médico regulador');
  },
};

export const MoverParaOTopo: Story = {
  name: 'Comportamento · mover para o início da lista',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('option', { name: /Prestação de contas/ }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mover Prestação de contas para o início da lista' }),
    );

    await expect(canvas.getAllByRole('option')[0]).toHaveTextContent('Prestação de contas');
    // No topo não há mais para onde subir, e o foco volta para a lista em vez de
    // sumir junto com o botão desabilitado.
    await expect(canvas.getByRole('listbox')).toHaveFocus();
  },
};

export const MoverParaOFim: Story = {
  name: 'Comportamento · mover para o fim da lista',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('option', { name: /Recepção da solicitação/ }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mover Recepção da solicitação para o fim da lista' }),
    );

    const opcoes = canvas.getAllByRole('option');
    await expect(opcoes[opcoes.length - 1]).toHaveTextContent('Recepção da solicitação');
  },
};

export const AnuncioDaNovaPosicao: Story = {
  name: 'A11y · anúncio da nova posição',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('option', { name: /Autorização da diária/ }));
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mover Autorização da diária uma posição para cima' }),
    );

    const regiao = canvas.getByRole('status');
    await expect(regiao).toHaveAttribute('aria-live', 'polite');
    await expect(regiao).toHaveTextContent('movido para a posição 3 de 7');
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação e movimento por teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('listbox');

    lista.focus();
    // Setas movem a seleção; com Alt movem o próprio item.
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    await expect(canvas.getByRole('option', { name: /Triagem pela regulação/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );

    await userEvent.keyboard('{Alt>}{ArrowDown}{/Alt}');
    await expect(canvas.getAllByRole('option')[2]).toHaveTextContent('Triagem pela regulação');
    await expect(canvas.getByRole('status')).toHaveTextContent('movido para a posição 3 de 7');
  },
};

export const ControlesNaDireita: Story = {
  name: 'Variante · controles à direita',
  args: {
    titulo: 'Prioridade da fila de regulação',
    descricao: 'O primeiro processo da lista é o próximo a ser analisado.',
    itens: FILA_DE_REGULACAO,
    controlesNaDireita: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('group', { name: 'Reordenar prioridade da fila de regulação' }),
    ).toBeInTheDocument();
    await expect(canvas.getAllByRole('option')).toHaveLength(4);
  },
};

export const SemNumeroDePosicao: Story = {
  name: 'Variante · sem número de posição',
  args: {
    titulo: 'Prioridade da fila de regulação',
    itens: FILA_DE_REGULACAO,
    mostrarPosicao: false,
  },
};

export const Desabilitada: Story = {
  name: 'Estado · desabilitada',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('listbox');

    // Desabilitada a lista continua rolável e focável: o estado é comunicado por
    // aria-disabled, não removendo o acesso pelo teclado.
    await expect(lista).toHaveAttribute('aria-disabled', 'true');
    lista.focus();
    await expect(lista).toHaveFocus();
  },
};

export const Vazia: Story = {
  name: 'Estado · sem itens',
  args: { itens: [] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Sem opções o papel de listbox seria inválido, então o container vira status.
    await expect(canvas.queryByRole('listbox')).toBeNull();
    await expect(canvas.getByText('Nenhuma etapa cadastrada para ordenar')).toBeVisible();
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Select } from './Select';
import { corDoToken } from '../../primitives/Field/medicao';

const MUNICIPIOS = [
  { value: 'sao-luis', label: 'São Luís' },
  { value: 'imperatriz', label: 'Imperatriz' },
  { value: 'caxias', label: 'Caxias' },
  { value: 'timon', label: 'Timon' },
];

const meta = {
  title: 'Moléculas/Campos/Select',
  component: Select,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Campo de formulário para uma escolha entre muitas opções em lista fechada, com o painel de opções oculto até abrir. Spec: `03-components/select.md` v2.0.0. Equivalente PrimeNG: `p-select`, `p-multiselect`, `p-cascadeselect`.',
          '',
          '**Quando usar este e não o SelectButton:** use o Select quando as opções são muitas e não cabem visíveis na tela (município, órgão, tipo de processo) e o objetivo é coletar um dado de cadastro. Para 2 a 4 opções exclusivas que valem estar sempre visíveis e que alternam a visão de uma tabela ou lista logo acima dela, use `Moléculas/Campos/SelectButton`.',
          '',
          'Por ser campo de formulário, o Select usa o `FieldWrapper` e herda dele rótulo, texto de ajuda, mensagem de erro e a ligação de acessibilidade (`aria-describedby`, `aria-invalid`).',
          '',
          '**Quando não usar:**',
          '',
          '- **Duas a quatro opções que valem estar sempre visíveis.** O painel fechado esconde alternativas que caberiam na tela e cobra um clique a mais por escolha. Use `Moléculas/Campos/SelectButton` para alternar a visão de uma lista, ou `Moléculas/Escolha/RadioGroup` quando as opções precisarem ser comparadas antes da decisão, com o texto de cada uma legível de uma vez.',
          '- **Mais de um valor por campo.** O `<select>` nativo com `multiple` obriga Ctrl e clique, gesto que quase ninguém descobre sozinho, e a seleção inteira se perde num clique errado. Use `Moléculas/Campos/MultiSelect`.',
          '- **Catálogo longo, acima de mais ou menos 25 opções.** Rolar uma lista de 5.570 municípios até achar o certo custa mais que digitar as três primeiras letras. Use `Moléculas/Campos/AutoComplete`.',
          '- **As opções são hierárquicas.** Uma lista plana com "Regulação" e "Auditoria de Contas" lado a lado apaga de qual secretaria cada setor veio, e o servidor grava a lotação errada. Use `Moléculas/Campos/CascadeSelect` quando a hierarquia tiver profundidade fixa de até 3 níveis e a escolha for sempre a folha, ou `Moléculas/Campos/TreeSelect` quando a profundidade variar ou um nó intermediário for resposta válida.',
          '- **Comparar as opções faz parte da tarefa.** No painel fechado a pessoa vê uma opção por vez na memória. Quando ela precisa ler o conjunto inteiro para decidir, ou marcar vários de uma lista que fica aberta ao lado do resultado, use `Moléculas/Campos/Listbox`.',
          '- **O valor é livre.** Use `Moléculas/Campos/Input`.',
          '',
          'Uma observação de implementação: este Select usa o `<select>` nativo, então o painel de opções é desenhado pelo sistema operacional e não aceita ícone, descrição secundária nem opção em duas linhas. Se o desenho exigir isso, o componente da vez é o `Listbox`, o `MultiSelect` ou o `AutoComplete`, que renderizam o painel em HTML.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Município de destino',
    options: MUNICIPIOS,
    placeholder: 'Selecione o município',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Município de destino');
    // O placeholder mostra a ação de escolha e nunca fica vazio.
    await expect(campo).toHaveDisplayValue('Selecione o município');
  },
};

export const Selecionado: Story = {
  name: 'Estado · selecionado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Município de destino');

    // Escolher endurece a borda para o degrau de preenchido: numa coluna de
    // campos, o que falta escolher se distingue de relance, e a asserção mede
    // a borda computada antes e depois da seleção.
    // A espera tem função exata: a borda muda por transição de 140ms, e o valor
    // computado no quadro seguinte à escolha ainda é o de partida. Sem ela, a
    // asserção fotografa o começo do percurso e reprova a regra que funciona.
    const bordaVazio = getComputedStyle(campo).borderTopColor;
    await userEvent.selectOptions(campo, 'imperatriz');
    await expect(campo).toHaveDisplayValue('Imperatriz');

    // O foco sai antes da medição por uma razão de comportamento: escolher
    // deixa o campo focado, e o foco pinta a borda de marca. A pista de
    // preenchido existe para quem varre a coluna de campos com o olho, com o
    // foco em outro lugar, e é nessa condição que ela precisa ser medida.
    await userEvent.tab();
    await waitFor(() =>
      expect(getComputedStyle(campo).borderTopColor).toBe(
        corDoToken(campo, '--citie-form-field-border-hover'),
      ),
    );
    await expect(getComputedStyle(campo).borderTopColor).not.toBe(bordaVazio);
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
};

export const SomenteLeitura: Story = {
  name: 'Estado · somente leitura',
  args: {
    label: 'Órgão de lotação',
    // Duas opções de propósito: a asserção só prova o bloqueio se existir
    // um valor vizinho para o qual a seta tentaria mover.
    options: [
      { value: 'ses', label: 'Secretaria de Estado da Saúde' },
      { value: 'seduc', label: 'Secretaria de Estado da Educação' },
    ],
    defaultValue: 'ses',
    readOnly: true,
    helper: 'Definido pela unidade de RH. Para alterar, abra processo de remoção.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'O `<select>` nativo não conhece `readonly`, então o componente comunica por `aria-readonly`, bloqueia a abertura do painel e as teclas que trocam o valor, e esconde a seta, cuja promessa de abrir seria falsa. O campo segue na ordem de Tab e o valor segue legível na tinta plena, o contrário do desabilitado, que sai do fluxo e desbota.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Órgão de lotação');

    await expect(campo).not.toBeDisabled();
    await expect(campo).toHaveAttribute('aria-readonly', 'true');
    await userEvent.tab();
    await expect(campo).toHaveFocus();

    // As teclas de troca de valor são bloqueadas: o dado está consolidado.
    await userEvent.keyboard('{ArrowDown}');
    await expect(campo).toHaveDisplayValue('Secretaria de Estado da Saúde');
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    required: true,
    error: 'Escolha o município de destino para calcular a diária.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Município de destino/)).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};

export const Tamanhos: Story = {
  name: 'Tamanhos · 32 / 36 / 40px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Select {...args} size="small" label="Small" />
      <Select {...args} size="normal" label="Normal" />
      <Select {...args} size="large" label="Large" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alturas = ['Small', 'Normal', 'Large'].map(
      (nome) => canvas.getByLabelText(nome).getBoundingClientRect().height,
    );
    await expect(alturas).toEqual([32, 36, 40]);
  },
};

/**
 * Linha de filtro do Sismental: o select de escopo fica ao lado da busca sem
 * rótulo pintado, porque o placeholder ("Todos os setores") já diz o escopo.
 * O rótulo continua no DOM, ligado ao campo, e é o nome acessível.
 */
export const RotuloOculto: Story = {
  name: 'Composição · rótulo oculto na linha de filtro',
  args: {
    label: 'Setor',
    placeholder: 'Todos os setores',
    rotuloOculto: true,
    options: [
      { value: 'regulacao', label: 'Regulação' },
      { value: 'tfd', label: 'TFD' },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O nome acessível sobrevive: o leitor de tela ainda ouve "Setor".
    const campo = canvas.getByLabelText('Setor');
    await expect(campo).toBeInTheDocument();

    // O rótulo existe no DOM, mas não ocupa a linha: caixa de 1px recortada.
    const rotulo = canvasElement.querySelector<HTMLLabelElement>('label[for]')!;
    await expect(rotulo).toHaveClass('citie-visualmente-oculto');
    const caixa = rotulo.getBoundingClientRect();
    await expect(caixa.height).toBeLessThanOrEqual(1);
    await expect(caixa.width).toBeLessThanOrEqual(1);

    // Sem rótulo pintado, o campo é a primeira linha do bloco: o topo do
    // select coincide com o topo do `.citie-field` (sem deslocamento de 28px).
    const bloco = canvasElement.querySelector('.citie-field')!.getBoundingClientRect();
    await expect(Math.round(campo.getBoundingClientRect().top - bloco.top)).toBe(0);
  },
};

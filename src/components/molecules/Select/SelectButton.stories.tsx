import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SelectButton } from './Select';

const meta = {
  title: 'Moléculas/Campos/SelectButton',
  component: SelectButton,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Grupo de 2 a 4 opções mutuamente exclusivas sempre visíveis, em botões segmentados. Spec: `03-components/select.md` v2.0.0. Equivalente PrimeNG: `p-selectbutton`.',
          '',
          '**Quando usar este e não o Select:** use o SelectButton para alternar a visão de uma tabela ou lista logo acima dela (situação da solicitação, modo de exibição, filtro rápido), quando as poucas opções valem estar sempre à vista. Ele não serve para coletar dado de cadastro: para escolher uma opção entre muitas em lista fechada, com o painel oculto até abrir, use `Moléculas/Campos/Select`.',
          '',
          '**Quando não usar:** mais de 4 opções, porque os segmentos comprimem o rótulo e a barra estoura a largura útil em 1366px, resolução comum das estações das secretarias; escolha obrigatória de cadastro, que precisa de rótulo, texto de ajuda e mensagem de erro e por isso pede `Moléculas/Campos/Select` ou `Moléculas/Escolha/RadioGroup`; opção solitária que liga e desliga um estado, papel do `Átomos/Escolha/ToggleButton`; troca de seção de conteúdo dentro da ficha do servidor, que pede `Moléculas/Contêineres/Tabs` e o papel `tablist`; e rótulos longos, que só cabem no segmento depois de abreviados, deixando a tela ilegível para quem entra nela uma vez por mês.',
          '',
          'Diferente do Select, o SelectButton **não usa o `FieldWrapper`**, porque não é campo com rótulo, texto de ajuda e mensagem de erro, e sim um grupo de botões: o nome acessível vem do `legend` no `role="group"` e o segmento ativo é anunciado como pressionado via `aria-pressed`.',
        ].join('\n'),
      },
    },
  },
  args: {
    legend: 'Situação da solicitação',
    options: [
      { value: 'pendentes', label: 'Pendentes' },
      { value: 'aprovadas', label: 'Aprovadas' },
      { value: 'negadas', label: 'Negadas' },
    ],
    defaultValue: ['pendentes'],
  },
} satisfies Meta<typeof SelectButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelectButtonUnico: Story = {
  name: 'SelectButton · escolha única',
  parameters: {
    docs: {
      description: {
        story:
          'De 2 a 4 opções exclusivas sempre visíveis, tipicamente alternando a visão de uma tabela logo acima dela. O segmento ativo é anunciado como pressionado.',
      },
    },
  },
  render: () => (
    <SelectButton
      legend="Situação da solicitação"
      options={[
        { value: 'pendentes', label: 'Pendentes' },
        { value: 'aprovadas', label: 'Aprovadas' },
        { value: 'negadas', label: 'Negadas' },
      ]}
      defaultValue={['pendentes']}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pendentes = canvas.getByRole('button', { name: 'Pendentes' });
    const aprovadas = canvas.getByRole('button', { name: 'Aprovadas' });

    await expect(pendentes).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(aprovadas);
    await expect(aprovadas).toHaveAttribute('aria-pressed', 'true');
    // Escolha única: marcar uma desmarca a anterior.
    await expect(pendentes).toHaveAttribute('aria-pressed', 'false');
  },
};

export const SelectButtonMultiplo: Story = {
  name: 'SelectButton · escolha múltipla',
  render: () => (
    <SelectButton
      legend="Tipos de benefício"
      multiple
      options={[
        { value: 'saude', label: 'Saúde' },
        { value: 'transporte', label: 'Transporte' },
        { value: 'alimentacao', label: 'Alimentação' },
      ]}
      defaultValue={['saude']}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Transporte' }));

    await expect(canvas.getByRole('button', { name: 'Saúde' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Transporte' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};

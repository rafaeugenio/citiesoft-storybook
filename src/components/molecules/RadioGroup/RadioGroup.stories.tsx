import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { RadioGroup } from './RadioGroup';

const meta = {
  title: 'Moléculas/Escolha/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Grupo de rádios sob uma legenda, para escolher exatamente uma opção entre 2 e 5 alternativas visíveis ao mesmo tempo. Estrutura a escolha de tipo dentro do fieldset de um formulário. Spec: `03-components/checkbox-radio-switch.md` v2.0.0. Equivalente PrimeNG: `p-radiobutton`.\n\n**Por que molécula e não átomo:** um rádio isolado não resolve nada — a escolha única só existe em relação às outras opções. O RadioGroup **compõe vários rádios sob uma legenda** e é essa composição que resolve a tarefa do usuário (escolher um entre poucos), incluindo o nome acessível do grupo, o `name` compartilhado que torna as opções mutuamente exclusivas e a mensagem de erro do grupo obrigatório. `Checkbox`, `Switch` e `ToggleButton` são átomos porque cada um é indivisível e já cumpre sua função sozinho.\n\n**Quando usar este e não os irmãos:** aqui a escolha é **exclusiva**. Se as opções podem ser combinadas, use `Checkbox`; se a chave liga ou desliga algo de efeito imediato, use `Switch` (o Switch promete efeito imediato, o Checkbox aguarda o submit); se é filtro ou modo de visualização em toolbar, use `ToggleButton`. Acima de 5 opções, troque por Select; para 2 a 4 opções que valem como botões segmentados, use SelectButton. Para uma única opção obrigatória de aceite, use Checkbox, nunca um rádio solto.\n\nA legenda é obrigatória por spec e vira o nome acessível do grupo. Grupo obrigatório em erro recebe `aria-describedby` apontando para a mensagem.',
      },
    },
  },
  args: {
    legend: 'Tipo de deslocamento',
    name: 'tipo-deslocamento',
    options: [
      { value: 'terrestre', label: 'Terrestre' },
      { value: 'aereo', label: 'Aéreo' },
      { value: 'fluvial', label: 'Fluvial' },
    ],
  },
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Radio: Story = {
  name: 'Radio · grupo com legenda',
  render: () => (
    <RadioGroup
      legend="Tipo de deslocamento"
      name="tipo-deslocamento"
      defaultValue="terrestre"
      options={[
        { value: 'terrestre', label: 'Terrestre' },
        { value: 'aereo', label: 'Aéreo' },
        { value: 'fluvial', label: 'Fluvial' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O grupo precisa de nome acessível vindo da legenda.
    await expect(canvas.getByRole('group', { name: 'Tipo de deslocamento' })).toBeVisible();

    await userEvent.click(canvas.getByRole('radio', { name: 'Aéreo' }));
    await expect(canvas.getByRole('radio', { name: 'Aéreo' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Terrestre' })).not.toBeChecked();
  },
};

export const RadioInvalido: Story = {
  name: 'Radio · grupo obrigatório em erro',
  render: () => (
    <RadioGroup
      legend="Tipo de deslocamento"
      name="tipo-deslocamento-erro"
      error="Escolha o tipo de deslocamento para seguir."
      options={[
        { value: 'terrestre', label: 'Terrestre' },
        { value: 'aereo', label: 'Aéreo' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText('Escolha o tipo de deslocamento para seguir.'),
    ).toBeVisible();
  },
};

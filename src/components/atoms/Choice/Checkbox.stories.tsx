import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox } from './Choice';

const meta = {
  title: 'Átomos/Escolha/Checkbox',
  component: Checkbox,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Caixa de marcação para opções independentes que podem ser combinadas: permissões, filtros acumuláveis, aceite de termos, seleção de linhas em tabela. Spec: `03-components/checkbox-radio-switch.md` v2.0.0. Equivalente PrimeNG: `p-checkbox`.\n\n**Quando usar este e não os irmãos:** o Checkbox **aguarda o submit** — a escolha só passa a valer quando o formulário é salvo. O `Switch` promete o contrário, efeito imediato, e por isso nunca deve aparecer em formulário que só aplica ao salvar; quando a opção depende de um botão Salvar, o componente correto é sempre o Checkbox. Para escolher exatamente uma opção entre 2 e 5 alternativas visíveis, use `RadioGroup`. Para alternar um filtro ou modo de visualização dentro de uma toolbar, use `ToggleButton`. Para uma única opção obrigatória de aceite, use Checkbox, nunca um rádio solto.\n\nO rótulo fica sempre à direita do controle e é clicável junto com ele: o alvo de toque mínimo de 24x24px (WCAG 2.5.8) inclui o texto, não apenas a caixa.',
      },
    },
  },
  args: { label: 'Aceito os termos de uso' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CheckboxDefault: Story = {
  name: 'Checkbox · desmarcado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('checkbox', { name: 'Aceito os termos de uso' });

    // O rótulo é clicável junto com o controle, então o alvo inclui o texto.
    await userEvent.click(canvas.getByText('Aceito os termos de uso'));
    await expect(controle).toBeChecked();
  },
};

export const CheckboxMarcado: Story = {
  name: 'Checkbox · marcado',
  args: { defaultChecked: true },
};

export const CheckboxIndeterminado: Story = {
  name: 'Checkbox · indeterminado',
  args: { label: 'Todos os colaboradores', indeterminate: true },
  parameters: {
    docs: {
      description: {
        story:
          'Estado parcial de um grupo, tipicamente no cabeçalho de seleção de uma tabela quando só alguns itens estão marcados.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('checkbox') as HTMLInputElement;
    await expect(controle.indeterminate).toBe(true);
  },
};

export const CheckboxDesabilitado: Story = {
  name: 'Checkbox · desabilitado',
  args: { disabled: true, defaultChecked: true },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ToggleButton } from './Choice';

const meta = {
  title: 'Átomos/Escolha/ToggleButton',
  component: ToggleButton,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Botão de dois estados que ativa um filtro, modo de visualização ou preferência pontual dentro de uma toolbar. Vive em barras de ação de tabela e cabeçalhos de listagem, ao lado dos botões de ação. Spec: `03-components/checkbox-radio-switch.md` v2.0.0. Equivalente PrimeNG: `p-togglebutton`.\n\n**Quando usar este e não os irmãos:** o ToggleButton pertence à **toolbar**, não ao formulário. Se a opção mora dentro de um formulário que só aplica ao salvar, use `Checkbox`; se ela liga ou desliga uma configuração de efeito imediato numa tela de preferências, use `Switch` (o Switch promete efeito imediato, o Checkbox aguarda o submit); se a escolha é uma entre poucas alternativas exclusivas, use `RadioGroup`.\n\nO estado pressionado é comunicado por `aria-pressed`, não só pela cor. Na variante somente ícone, `aria-label` é obrigatório e o tooltip é exigido pela spec.',
      },
    },
  },
  args: { label: 'Somente pendentes' },
} satisfies Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Toggle: Story = {
  name: 'ToggleButton · com rótulo',
  render: () => <ToggleButton label="Somente pendentes" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Somente pendentes' });

    await expect(botao).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(botao);
    await expect(botao).toHaveAttribute('aria-pressed', 'true');
  },
};

export const ToggleSomenteIcone: Story = {
  name: 'ToggleButton · somente ícone',
  render: () => (
    <ToggleButton
      aria-label="Alternar visão em lista"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Alternar visão em lista' })).toBeVisible();
  },
};

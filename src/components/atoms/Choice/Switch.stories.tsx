import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Switch } from './Choice';

const meta = {
  title: 'Átomos/Escolha/Switch',
  component: Switch,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Chave que liga ou desliga uma configuração cujo efeito é imediato, sem botão de salvar. Agrupa preferências em telas de configuração. Spec: `03-components/checkbox-radio-switch.md` v2.0.0. Equivalente PrimeNG: `p-toggleswitch`.\n\n**Quando usar este e não os irmãos:** o Switch **promete efeito imediato** e o `Checkbox` **aguarda o submit**. Essa é a única diferença que importa entre os dois, e ela é semântica, não estética: ao acionar um switch o usuário entende que a mudança já valeu. **Nunca use Switch dentro de formulário que só aplica ao salvar** — nesse caso o componente correto é o Checkbox. Para escolha única entre poucas alternativas visíveis, use `RadioGroup`; para um filtro ou modo de visualização dentro de uma toolbar, use `ToggleButton`.\n\nO rótulo descreve o estado ligado, nunca a ação: "Notificações por e-mail", jamais "Clique para ativar". O controle expõe `role="switch"` e alterna com a tecla Espaço, com o estado anunciado como ligado ou desligado.',
      },
    },
  },
  args: { label: 'Notificações por e-mail' },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SwitchLigado: Story = {
  name: 'Switch · efeito imediato',
  parameters: {
    docs: {
      description: {
        story:
          'Rótulo descreve o estado ligado, nunca a ação. Nunca usar dentro de formulário que só aplica ao salvar.',
      },
    },
  },
  render: () => <Switch label="Notificações por e-mail" defaultChecked />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('switch', { name: 'Notificações por e-mail' });

    await expect(controle).toBeChecked();
    await userEvent.click(controle);
    await expect(controle).not.toBeChecked();
  },
};

export const SwitchDesabilitado: Story = {
  name: 'Switch · desabilitado',
  render: () => <Switch label="Notificações por SMS" disabled />,
};

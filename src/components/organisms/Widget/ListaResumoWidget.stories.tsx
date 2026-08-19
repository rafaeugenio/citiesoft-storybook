import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ListaResumoWidget } from './Widget';
import { StatusIndicator } from '../../atoms/Badge/Badge';

const meta = {
  title: 'Organismos/Painel/ListaResumoWidget',
  component: ListaResumoWidget,
  tags: ['autodocs', 'organism', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Widget de fila do painel. Spec: `03-components/dashboard-widgets.md` v2.0.0. Mostra de 3 a 7 itens de uma fila, cada um com identificador, nome e marcador de estado, e sempre oferece o link "Ver tudo" para a listagem completa.\n\n**Quando usar este e não o `KpiWidget`:** a lista-resumo responde "o que exige minha atenção agora". Ela nomeia os itens da fila, não os conta — o recorte é curto de propósito, porque o painel serve para decidir por onde começar, e o resto fica atrás do "Ver tudo". Se a pergunta do usuário for "qual é o número agora", com variação acompanhada do período de comparação explícito, o componente certo é o `KpiWidget`.',
      },
    },
  },
  args: {
    titulo: 'Processos aguardando parecer',
    alerta: 'warn',
    onVerTudo: () => {},
    itens: [
      {
        id: '1',
        principal: '2025/0481',
        secundario: 'Maria de Fátima Souza',
        marcador: <StatusIndicator estado="Em Análise" size="sm" />,
      },
      {
        id: '2',
        principal: '2025/0483',
        secundario: 'Carlos Andrade',
        marcador: <StatusIndicator estado="Devolvido" size="sm" />,
      },
      {
        id: '3',
        principal: '2025/0490',
        secundario: 'Ana Beatriz Lima',
        marcador: <StatusIndicator estado="Pendente" size="sm" />,
      },
    ],
  },
} satisfies Meta<typeof ListaResumoWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ListaResumo: Story = {
  name: 'Lista-resumo · fila que exige atenção',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Atenção')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Ver tudo' })).toBeVisible();
  },
};

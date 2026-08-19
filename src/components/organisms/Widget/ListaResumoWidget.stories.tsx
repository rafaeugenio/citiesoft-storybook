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
        component: [
          'Widget de fila do painel. Spec: `03-components/dashboard-widgets.md` v2.0.0. Mostra de 3 a 7 itens de uma fila, cada um com identificador, nome e marcador de estado, e sempre oferece o link "Ver tudo" para a listagem completa.',
          '',
          '**Quando usar este e não o `KpiWidget`:** a lista-resumo responde "o que exige minha atenção agora". Ela nomeia os itens da fila, não os conta — o recorte é curto de propósito, porque o painel serve para decidir por onde começar, e o resto fica atrás do "Ver tudo". Se a pergunta do usuário for "qual é o número agora", com variação acompanhada do período de comparação explícito, o componente certo é o `KpiWidget`.',
          '',
          '**Quando não usar:** como listagem de trabalho do dia. Este widget não ordena, não filtra',
          'e não pagina, então uma fila de trinta processos aqui vira rolagem dentro de um cartão do',
          'painel e o servidor perde o registro que estava procurando: a tela de trabalho é',
          '`FilterBar` mais `Table`, e o "Ver tudo" existe justamente para levar até ela. Também não',
          'use para ação em massa sobre a fila, que exige seleção por linha e a barra de',
          '`acoesEmMassa` da `Table`; para histórico do que já aconteceu, com data e autor, que é a',
          '`Timeline`; para atalhos fixos de navegação, papel do `Menu` ou do `Dock`; e para aviso',
          'do que acabou de acontecer na sessão, que é `Toast` ou `Message`, porque o widget mostra',
          'estado de fila e não evento.',
          '',
          'Cuidado B2G: o `alerta` de atenção acompanha a fila inteira, e cada item traz o próprio',
          '`marcador`. Sem esse marcador em cada linha, o cartão sugere urgência sem dizer qual',
          'processo está atrasado, e quem abre o painel de forma esporádica começa pelo item errado.',
          'Fila vazia é informação boa: mostre o `EmptyState` dizendo que não há pendência, em vez',
          'de esconder o widget e deixar dúvida sobre o sistema ter carregado.',
        ].join('\n'),
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

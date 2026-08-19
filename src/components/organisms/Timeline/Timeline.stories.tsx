import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { MudancaDeAuditoria, Timeline, type EventoDaTimeline } from './Timeline';

const HISTORICO: EventoDaTimeline[] = [
  {
    id: '4',
    titulo: 'Parecer emitido',
    data: '2025-03-18T14:32:00',
    ator: 'Dr. Carlos Andrade',
    estado: 'atual',
    detalhe: 'Parecer favorável ao deslocamento, com indicação de acompanhante.',
  },
  {
    id: '3',
    titulo: 'Solicitação encaminhada à regulação',
    data: '2025-03-15T09:10:00',
    ator: 'Sistema Citiesoft',
    estado: 'concluido',
    realce: 'sistema',
  },
  {
    id: '2',
    titulo: 'Documentação anexada',
    data: '2025-03-14T16:45:00',
    ator: 'Maria de Fátima Souza',
    estado: 'concluido',
  },
  {
    id: '1',
    titulo: 'Solicitação recebida',
    data: '2025-03-12T08:05:00',
    ator: 'Maria de Fátima Souza',
    estado: 'concluido',
  },
];

const meta = {
  title: 'Organismos/Histórico/Timeline',
  component: Timeline,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Timeline e audit log. Spec: `03-components/timeline-audit-log.md` v2.0.0. Título do evento é verbo no passado em voz ativa, e data mais ator são obrigatórios em todo evento humano.',
          '',
          '**Use a Timeline quando o que importa é o que já aconteceu, em ordem, e quem fez.** É a',
          'tramitação do processo e a trilha de auditoria: cada evento carrega data, ator e, quando',
          'preciso, o detalhe da mudança. O registro é imutável e serve de prova do que o órgão fez',
          'com o pedido do cidadão.',
          '',
          '**Quando não usar:** etapas de um fluxo que o usuário ainda vai percorrer, com avançar e',
          'voltar, que é o `Stepper` (na Timeline o servidor não tem o que clicar para prosseguir e',
          'passa a procurar o botão que não existe); eventos que o servidor precisa filtrar por',
          'período, ordenar por autor e exportar, porque a Timeline não ordena nem pagina e uma',
          'trilha de centenas de registros vira rolagem infinita, caso da `Table`; contagem de',
          'ocorrências por período, que é gráfico (`LineChart` ou `BarChart`); estado atual de um',
          'único registro, que se resolve com `StatusIndicator` ou `Tag` no cabeçalho da tela; e',
          'aviso pontual sobre o que acabou de ser feito, papel do `Toast` ou do `Message`.',
          '',
          'Não use a Timeline como fonte única do histórico de um processo longo. Ela mostra o',
          'recorte recente dentro da tela de detalhe; a trilha completa, que a auditoria precisa',
          'percorrer inteira, pede a listagem tabular com filtro por competência e por ator.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Histórico do processo', eventos: HISTORICO },
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  name: 'Variante · vertical (padrão)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('list', { name: 'Histórico do processo' });

    await expect(lista.tagName).toBe('OL');
    await expect(canvas.getAllByRole('listitem')).toHaveLength(4);

    // A data usa <time datetime> em ISO 8601.
    const tempo = canvasElement.querySelector('time')!;
    await expect(tempo).toHaveAttribute('datetime', '2025-03-18T14:32:00');
    await expect(tempo).toHaveTextContent('18/03/2025 às 14:32');
  },
};

export const CorpoExpansivel: Story = {
  name: 'Estado · corpo expansível',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alternar = canvas.getByRole('button', { name: 'Ver detalhes' });

    await expect(alternar).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(alternar);
    await expect(canvas.getByRole('button', { name: 'Ocultar detalhes' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  },
};

export const EstadoPorTexto: Story = {
  name: 'A11y · estado não vai só na cor',
  parameters: {
    docs: {
      description: {
        story:
          'Cada marcador carrega o estado por texto no nome acessível, então quem usa leitor de tela recebe a mesma informação que a cor transmite.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('(Etapa atual)')).toBeInTheDocument();
    await expect(canvas.getAllByText('(Concluído)')).toHaveLength(3);
  },
};

export const TodosOsEstados: Story = {
  name: 'Estados do marcador',
  args: {
    eventos: [
      { id: 'a', titulo: 'Etapa concluída', data: '2025-03-01T10:00:00', ator: 'Maria Souza', estado: 'concluido' },
      { id: 'b', titulo: 'Etapa em andamento', data: '2025-03-02T10:00:00', ator: 'Dr. Carlos Andrade', estado: 'atual' },
      { id: 'c', titulo: 'Aguardando documentação', data: '2025-03-03T10:00:00', ator: 'Maria Souza', estado: 'pendente' },
      { id: 'd', titulo: 'Processo bloqueado', data: '2025-03-04T10:00:00', ator: 'Sistema Citiesoft', estado: 'bloqueado' },
      { id: 'e', titulo: 'Solicitação cancelada', data: '2025-03-05T10:00:00', ator: 'Maria Souza', estado: 'cancelado' },
      { id: 'f', titulo: 'Emissão da autorização', data: '2025-03-06T10:00:00', ator: 'Sistema Citiesoft', estado: 'futuro' },
    ],
  },
};

export const Compacta: Story = {
  name: 'Variante · compacta',
  args: { compacta: true },
};

export const Vazia: Story = {
  name: 'Estado · vazio',
  args: { eventos: [] },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Nenhum evento registrado ainda')).toBeVisible();
  },
};

export const AuditLog: Story = {
  name: 'Audit log · diff de valores',
  parameters: {
    docs: {
      description: {
        story:
          'Valores sempre em texto humano legível, com o nome de UI do campo. Valor anterior riscado em danger, valor novo em success, ausência em itálico.',
      },
    },
  },
  args: {
    label: 'Auditoria do cadastro',
    eventos: [
      {
        id: 'aud-2',
        titulo: 'Cadastro alterado',
        data: '2025-03-20T11:20:00',
        ator: 'Laryssa Ferreira',
        estado: 'informacional',
        detalhe: (
          <>
            <MudancaDeAuditoria campo="Salário base" de="R$ 3.200,00" para="R$ 3.480,00" />
            <MudancaDeAuditoria campo="Situação" de="Suspenso" para="Ativo" />
            <MudancaDeAuditoria campo="Observação" de={null} para="Promoção por tempo de serviço" />
          </>
        ),
      },
      {
        id: 'aud-1',
        titulo: 'Benefício excluído',
        data: '2025-03-19T17:02:00',
        ator: 'Laryssa Ferreira',
        estado: 'bloqueado',
        realce: 'critico',
        detalhe: <MudancaDeAuditoria campo="Plano de saúde" de="Unimed Ouro" para={null} />,
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getAllByRole('button', { name: 'Ver detalhes' })[0]);

    await expect(canvas.getByText('R$ 3.200,00')).toBeVisible();
    await expect(canvas.getByText('R$ 3.480,00')).toBeVisible();
    await expect(canvas.getByText('vazio')).toBeVisible();
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PrazoIndicador, calcularPrazo } from './PrazoIndicador';

/** Data de referência fixa em todas as stories: a suíte precisa ser determinística. */
const HOJE = '2026-08-19';

const meta = {
  title: 'Moléculas/Visualização/PrazoIndicador',
  component: PrazoIndicador,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Semáforo de prazo. Fecha a lacuna nº 13 do mapa do protótipo TFD, onde a coluna `Data limite` de Acompanhamento precisa priorizar a fila por urgência.',
          '',
          '**Quando usar:** quando a pessoa varre uma fila decidindo o que atacar primeiro e a decisão depende de quanto tempo resta. As quatro faixas (`atrasado`, `hoje`, `proximo`, `folgado`) mudam a forma do texto junto com a cor: `Atrasado 3d`, `Hoje`, `Faltam 5d`. O rótulo que declara a base do prazo é sempre visível, porque "faltam 5 dias" sem dizer para quê não informa nada.',
          '',
          '**A urgência vem por prop, nunca do relógio.** `prazo` e `referencia` são recebidos de fora. Um `new Date()` interno tornaria cada story não determinística e a suíte passaria a mudar de resultado conforme o dia da execução. Quem consome passa o "hoje" da aplicação.',
          '',
          '**Cor nunca sozinha.** Cada faixa tem ícone de silhueta própria (triângulo de alerta, círculo de atenção, relógio, calendário) e texto próprio. A faixa `folgado` fica em cinza e não em verde: verde numa coluna de prazo é lido como "resolvido", e o que ela diz é apenas que ainda há tempo.',
          '',
          '**O nome acessível carrega a data absoluta**, além da relativa: "Faltam 5 dias, vence em 24/08/2026". Prazo relativo sozinho é ambíguo para quem volta à tela horas depois.',
          '',
          'O cálculo é exposto como `calcularPrazo`, porque a ordenação da fila por urgência precisa da mesma conta que o indicador exibe, e duas contas paralelas divergiriam. Ele conta dias de calendário, com as datas normalizadas para a meia-noite UTC do dia civil, o que evita o erro de um dia inteiro na virada de horário de verão.',
          '',
          '**Quando não usar:**',
          '',
          '- **Para a etapa nomeada de um fluxo** (Rascunho, Em Análise, Aprovado). Isso é `Átomos/Marcadores/StatusIndicator`, que trabalha com o dicionário fixo `ESTADOS_DE_FLUXO`. Os dois são coisas diferentes: um diz em que caixa o processo está, o outro diz quanto tempo resta.',
          '- **Para data que não cobra ação** (data de cadastro, data de emissão). Sem prazo a vencer, a pílula colorida inventa urgência onde não existe. Mostre a data no `render` da coluna de `Organismos/Tabelas/Table`.',
          '- **Para escolher ou editar a data.** Este componente só apresenta. A entrada é `Moléculas/Campos/DatePicker`.',
          '- **Para andamento quantitativo** ("7 de 12 documentos"). Aí o que falta é medido em itens, e não em dias, o que é `Átomos/Feedback/ProgressBar`.',
          '- **Para prazo ainda não definido.** Sem data, o componente não tem o que calcular. Use `SemRegistro`, exportado de `Organismos/Tabelas/Table`, com a causa escrita ("Sem data definida").',
        ].join('\n'),
      },
    },
  },
  args: { prazo: '2026-08-24', referencia: HOJE, rotulo: 'Prazo para agendamento' },
} satisfies Meta<typeof PrazoIndicador>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Folgado: Story = {
  name: 'Faixa · folgado',
  args: { prazo: '2026-09-10' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Faltam 22d')).toBeVisible();
    await expect(
      canvas.getByText('Prazo para agendamento: faltam 22 dias, vence em 10/09/2026.'),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelector('.citie-sev--secondary')).not.toBeNull();
  },
};

export const Proximo: Story = {
  name: 'Faixa · próximo',
  args: { prazo: '2026-08-21' },
  parameters: {
    docs: {
      description: {
        story:
          'Até três dias, ajustável por `limiteProximo`. É a faixa que separa o que ainda cabe no planejamento do que já entrou na fila do dia.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Faltam 2d')).toBeVisible();
    await expect(canvasElement.querySelector('.citie-sev--info')).not.toBeNull();
  },
};

export const Hoje: Story = {
  name: 'Borda · vence hoje',
  args: { prazo: HOJE },
  parameters: {
    docs: {
      description: {
        story:
          'O texto muda de forma, e não só de cor: "Hoje" no lugar de "Faltam 0d", que seria lido como prazo já perdido.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Hoje')).toBeVisible();
    await expect(
      canvas.getByText('Prazo para agendamento: vence hoje, 19/08/2026.'),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelector('.citie-sev--warn')).not.toBeNull();
  },
};

export const AtrasadoUmDia: Story = {
  name: 'Borda · atrasado há um dia',
  args: { prazo: '2026-08-18' },
  parameters: {
    docs: {
      description: {
        story: 'No singular o nome acessível diz "1 dia", enquanto o texto compacto segue "1d".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Atrasado 1d')).toBeVisible();
    await expect(
      canvas.getByText('Prazo para agendamento: atrasado 1 dia, venceu em 18/08/2026.'),
    ).toBeInTheDocument();
  },
};

export const AtrasadoHaMuitoTempo: Story = {
  name: 'Borda · vencido há muito tempo',
  args: { prazo: '2026-02-02', rotulo: 'Prazo para prestação de contas' },
  parameters: {
    docs: {
      description: {
        story:
          'Atraso longo continua na mesma faixa e na mesma pílula: a contagem cresce, a forma não muda, então a coluna não quebra o alinhamento.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Atrasado 198d')).toBeVisible();
    await expect(canvasElement.querySelector('.citie-sev--danger')).not.toBeNull();
  },
};

export const FilaCompleta: Story = {
  name: 'Uso · fila ordenada por urgência',
  parameters: {
    docs: {
      description: {
        story:
          'As quatro faixas na mesma coluna, na ordem em que a fila deve ser atacada. Cada uma tem ícone e texto próprios, então a leitura se sustenta sem cor.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 12, width: 260 }}>
      <PrazoIndicador prazo="2026-08-05" referencia={HOJE} rotulo="Prazo para agendamento" />
      <PrazoIndicador prazo={HOJE} referencia={HOJE} rotulo="Prazo para emissão da passagem" />
      <PrazoIndicador prazo="2026-08-21" referencia={HOJE} rotulo="Prazo para conferência" />
      <PrazoIndicador prazo="2026-09-30" referencia={HOJE} rotulo="Prazo para prestação de contas" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Atrasado 14d')).toBeVisible();
    await expect(canvas.getByText('Hoje')).toBeVisible();
    // Quatro faixas, quatro silhuetas de ícone diferentes.
    const desenhos = new Set(
      [...canvasElement.querySelectorAll('.citie-prazo__pilula svg')].map((s) => s.innerHTML),
    );
    await expect(desenhos.size).toBe(4);
  },
};

export const Compacto: Story = {
  name: 'Densidade · sm',
  args: { size: 'sm' },
};

export const CalculoDeterministico: Story = {
  name: 'Cálculo · dias de calendário',
  parameters: {
    docs: {
      description: {
        story:
          '`calcularPrazo` é exportado para a fila ordenar pela mesma conta que o indicador exibe. A story confere as fronteiras das quatro faixas e a travessia do horário de verão, em que subtrair carimbos de tempo erraria em um dia.',
      },
    },
  },
  play: async () => {
    await expect(calcularPrazo('2026-08-19', HOJE).faixa).toBe('hoje');
    await expect(calcularPrazo('2026-08-18', HOJE).faixa).toBe('atrasado');
    await expect(calcularPrazo('2026-08-22', HOJE).faixa).toBe('proximo');
    await expect(calcularPrazo('2026-08-23', HOJE).faixa).toBe('folgado');
    await expect(calcularPrazo('2026-08-23', HOJE, 7).faixa).toBe('proximo');
    // Datas em lados opostos de uma virada de horário de verão do Sul.
    await expect(calcularPrazo('2026-11-05', '2026-10-15').dias).toBe(21);
    // `Date` e string produzem o mesmo dia civil.
    await expect(calcularPrazo(new Date(2026, 7, 24), HOJE).dias).toBe(5);
  },
};

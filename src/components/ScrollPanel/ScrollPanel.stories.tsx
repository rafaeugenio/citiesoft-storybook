import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ScrollPanel } from './ScrollPanel';

const eventos = [
  ['12/03/2025 09:14', 'Processo 2025/0481 autuado na Secretaria de Saúde'],
  ['12/03/2025 09:31', 'Solicitação de TFD registrada para Maria de Fátima Souza'],
  ['13/03/2025 10:02', 'Documentação anexada: laudo médico e comprovante de residência'],
  ['13/03/2025 15:47', 'Encaminhado à regulação para análise de elegibilidade'],
  ['14/03/2025 08:20', 'Parecer técnico favorável emitido pela regulação'],
  ['17/03/2025 11:05', 'Diária de deslocamento calculada para a competência 03/2025'],
  ['17/03/2025 16:38', 'Passagem intermunicipal reservada para 24/03/2025'],
  ['18/03/2025 09:12', 'Acompanhante autorizado conforme parecer da junta médica'],
  ['19/03/2025 14:26', 'Empenho da diária enviado à Secretaria de Fazenda'],
  ['21/03/2025 08:55', 'Pagamento da diária liquidado na competência 03/2025'],
  ['24/03/2025 07:40', 'Deslocamento realizado para São Luís'],
  ['26/03/2025 17:03', 'Comprovante de comparecimento anexado pela unidade de destino'],
  ['27/03/2025 10:18', 'Prestação de contas conferida pelo setor administrativo'],
  ['28/03/2025 09:00', 'Processo 2025/0481 concluído e arquivado'],
];

function HistoricoDoProcesso() {
  return (
    <ol style={{ margin: 0, paddingInlineStart: 0, listStyle: 'none' }}>
      {eventos.map(([quando, oQue]) => (
        <li
          key={quando}
          style={{
            display: 'grid',
            gap: 2,
            padding: 'var(--citie-spacing-2) 0',
            borderBlockEnd: '1px solid var(--citie-border-default)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--citie-font-size-body-sm)',
              color: 'var(--citie-text-secondary)',
            }}
          >
            {quando}
          </span>
          <span>{oQue}</span>
        </li>
      ))}
    </ol>
  );
}

const competencias = [
  '01/2025',
  '02/2025',
  '03/2025',
  '04/2025',
  '05/2025',
  '06/2025',
  '07/2025',
  '08/2025',
  '09/2025',
  '10/2025',
  '11/2025',
  '12/2025',
];

function DiariasPorCompetencia() {
  return (
    <div style={{ display: 'flex', gap: 'var(--citie-spacing-2)' }}>
      {competencias.map((competencia) => (
        <div
          key={competencia}
          style={{
            flex: '0 0 auto',
            width: 160,
            padding: 'var(--citie-spacing-3)',
            border: '1px solid var(--citie-border-default)',
            borderRadius: 'var(--citie-radius-md)',
          }}
        >
          <div
            style={{
              fontSize: 'var(--citie-font-size-body-sm)',
              color: 'var(--citie-text-secondary)',
            }}
          >
            Competência {competencia}
          </div>
          <div style={{ fontWeight: 600 }}>4 diárias pagas</div>
        </div>
      ))}
    </div>
  );
}

const meta = {
  title: 'Layout/ScrollPanel',
  component: ScrollPanel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'ScrollPanel. Página do Figma CitieOne `6738:49737`. Variantes do arquivo: `scrollpanel` Type = Default | Custom Bar (aqui `variante` padrão/personalizada) e `scrollpanel-bar` Focus = False | True (estado de foco da região). Equivalente PrimeNG: `p-scrollpanel`. A rolagem é a nativa do navegador, só estilizada por `scrollbar-width` e `::-webkit-scrollbar`, para preservar teclado, toque e leitor de tela.',
      },
    },
  },
  args: {
    rotulo: 'Histórico do processo 2025/0481',
    children: <HistoricoDoProcesso />,
  },
} satisfies Meta<typeof ScrollPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BarraPadrao: Story = {
  name: 'Variante · barra padrão',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regiao = canvas.getByRole('region', { name: 'Histórico do processo 2025/0481' });
    await expect(regiao.scrollHeight).toBeGreaterThan(regiao.clientHeight);
  },
};

export const BarraPersonalizada: Story = {
  name: 'Variante · barra personalizada',
  args: { variante: 'personalizada' },
  parameters: {
    docs: {
      description: {
        story:
          'Type = Custom Bar do Figma. O arquivo mostra a barra em azul Aura; aqui ela usa o Citie Blue de `--citie-brand-primary`.',
      },
    },
  },
};

export const Horizontal: Story = {
  name: 'Eixo · horizontal',
  args: {
    orientacao: 'horizontal',
    rotulo: 'Diárias pagas por competência em 2025',
    children: <DiariasPorCompetencia />,
    largura: '420px',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regiao = canvas.getByRole('region', { name: 'Diárias pagas por competência em 2025' });
    await expect(regiao.scrollWidth).toBeGreaterThan(regiao.clientWidth);
  },
};

export const Ambas: Story = {
  name: 'Eixo · vertical e horizontal',
  args: {
    orientacao: 'ambas',
    variante: 'personalizada',
    rotulo: 'Diárias pagas por competência em 2025',
    largura: '420px',
    altura: '180px',
    children: (
      <div style={{ display: 'grid', gap: 'var(--citie-spacing-2)' }}>
        <DiariasPorCompetencia />
        <DiariasPorCompetencia />
        <DiariasPorCompetencia />
      </div>
    ),
  },
};

export const FocoPorTeclado: Story = {
  name: 'Estado · foco por teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regiao = canvas.getByRole('region', { name: 'Histórico do processo 2025/0481' });

    await expect(regiao).toHaveAttribute('tabindex', '0');

    await userEvent.tab();
    await expect(regiao).toHaveFocus();

    // As setas continuam com o navegador: o componente não intercepta tecla nenhuma.
    const antes = regiao.scrollTop;
    regiao.scrollTop = antes + 80;
    await expect(regiao.scrollTop).toBeGreaterThan(antes);
  },
};

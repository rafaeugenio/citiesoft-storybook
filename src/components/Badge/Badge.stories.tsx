import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Badge, Chip, ESTADOS_DE_FLUXO, StatusIndicator, Tag, type EstadoDeFluxo } from './Badge';

const meta = {
  title: 'Dados/Marcadores',
  component: Tag,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Badge, Tag, Chip e Status Indicator. Spec: `03-components/badges-tags.md` v2.0.0. Os quatro compartilham o mapa canônico de 7 severidades; hex fora do mapa é proibido.',
      },
    },
  },
  args: { label: 'Cardiologia' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Mapa de severidade ---------- */

export const MapaDeSeveridade: Story = {
  name: 'Mapa canônico · 7 severidades',
  parameters: {
    docs: {
      description: {
        story:
          'Ordem de urgência: danger (ação imediata) acima de warn (atenção), acima de info e primary (andamento), acima de success (concluído), acima de secondary (neutro).',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Tag label="Aprovado" severity="success" />
      <Tag label="Em andamento" severity="info" />
      <Tag label="Pendente" severity="warn" />
      <Tag label="Devolvido" severity="danger" />
      <Tag label="Presencial" severity="secondary" />
      <Tag label="SUS" severity="primary" />
      <Tag label="Destaque" severity="contrast" />
    </div>
  ),
};

/* ---------- Badge ---------- */

export const BadgeContagem: Story = {
  name: 'Badge · contagem sobre ícone',
  render: () => (
    <Badge value={4} severity="danger">
      <button
        type="button"
        style={{
          width: 40,
          height: 40,
          borderRadius: 6,
          border: '1px solid var(--citie-border-default)',
          background: 'var(--citie-background-surface)',
          color: 'var(--citie-text-primary)',
          cursor: 'pointer',
        }}
        // O nome acessível completo vive no pai, incorporando a contagem.
        aria-label="Solicitações pendentes, 4 devoluções"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M18 8a6 6 0 1 0-12 0c0 7-2 9-2 9h16s-2-2-2-9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </Badge>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', { name: 'Solicitações pendentes, 4 devoluções' }),
    ).toBeVisible();
  },
};

export const BadgeAcimaDeNoventaENove: Story = {
  name: 'Badge · acima de 99',
  render: () => <Badge value={132} severity="warn" />,
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('99+')).toBeVisible();
  },
};

export const BadgeZero: Story = {
  name: 'Badge · zero é suprimido',
  parameters: {
    docs: {
      description: { story: 'Contagem zero nunca aparece: o badge some por completo.' },
    },
  },
  render: () => (
    <div>
      <Badge value={0} severity="danger">
        <span style={{ fontFamily: 'var(--citie-font-ui)' }}>Sem pendências</span>
      </Badge>
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.citie-badge')).toBeNull();
  },
};

export const BadgeDot: Story = {
  name: 'Badge · dot de novidade',
  render: () => <Badge dot severity="info" />,
};

/* ---------- Status Indicator ---------- */

export const StatusTodosOsEstados: Story = {
  name: 'Status Indicator · estados oficiais',
  parameters: {
    docs: {
      description: {
        story:
          'Os 11 estados do glossário, cada um com a severidade canônica. Rótulos por extenso, nunca abreviados nem em caixa alta.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(Object.keys(ESTADOS_DE_FLUXO) as EstadoDeFluxo[]).map((estado) => (
        <StatusIndicator key={estado} estado={estado} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Aguardando Assinatura')).toBeVisible();
    // Largura mínima fixa para a coluna de tabela não variar com o estado.
    const largura = canvas.getByText('Rascunho').closest('.citie-status')!.getBoundingClientRect().width;
    await expect(largura).toBeGreaterThanOrEqual(120);
  },
};

/* ---------- Chip ---------- */

export const ChipRemovivel: Story = {
  name: 'Chip · removível',
  render: () => <Chip label="Afastamento" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const remover = canvas.getByRole('button', { name: 'Remover Afastamento' });

    await expect(remover).toBeVisible();
    // Área de clique mínima de 24x24 mesmo com o ícone de 12px.
    const caixa = remover.getBoundingClientRect();
    await expect(caixa.width).toBeGreaterThanOrEqual(24);
    await expect(caixa.height).toBeGreaterThanOrEqual(24);
  },
};

export const ChipSelecionavel: Story = {
  name: 'Chip · selecionável',
  render: () => <Chip label="Somente urgentes" variant="selectable" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const chip = canvas.getByRole('button', { name: 'Somente urgentes' });

    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(chip);
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
  },
};

export const ChipsDeFiltroAplicado: Story = {
  name: 'Chip · filtros aplicados',
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Chip label="São Luís" />
      <Chip label="Em Análise" />
      <Chip label="Cardiologia" />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge } from './Badge';

const meta = {
  title: 'Átomos/Marcadores/Badge',
  component: Badge,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Marcador numérico ou de ponto sobreposto a um ícone, avatar ou botão. Spec: `03-components/badges-tags.md` v2.0.0. Equivalente PrimeNG: `p-badge` e `p-overlayBadge`.\n\n**Quando usar este e não os irmãos:** Badge **conta** pendências sobre outro elemento, para o servidor saber quanto há para resolver sem abrir a tela. Se o que você precisa exibir é a etapa de um fluxo de trabalho (Rascunho, Aprovado), use `StatusIndicator`. Se é um atributo estático do registro (categoria, tipo, vínculo), use `Tag`. Se o usuário pode remover ou alternar o elemento, use `Chip`. Nunca empilhe dois badges no mesmo elemento pai: consolide em um só.\n\nA severidade vem do mapa canônico de 7 valores compartilhado pelos quatro marcadores, documentado em Átomos/Marcadores/Tag; hex fora do mapa é proibido.\n\n**Quando não usar:** para exibir número que o servidor precisa ler exato (saldo, valor empenhado, quantidade em estoque, total de itens da listagem): acima de 99 o componente troca o valor por "99+" e o dado real some da tela; use o número no próprio texto ou um `KpiWidget`. Como único portador da informação: o marcador é `aria-hidden`, então quem usa leitor de tela só recebe o que estiver escrito no `aria-label` do elemento pai, e uma contagem que não foi repetida ali simplesmente não existe para essa pessoa (e-MAG, WCAG 2.2 AA). Sobre elemento que não leva a lugar nenhum: o badge promete "abra aqui e resolva", e quando não há destino o servidor clica, nada acontece e ele volta a clicar. Para erro de validação de formulário, que precisa dizer o que fazer, use `Message`. Para etapa de fluxo use `StatusIndicator`, para atributo de cadastro use `Tag`, para filtro removível use `Chip`.',
      },
    },
  },
  args: { value: 4 },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

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

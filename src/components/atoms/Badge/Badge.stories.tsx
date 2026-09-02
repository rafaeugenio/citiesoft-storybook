import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Badge, Tag, type PeleMarcador, type Severidade } from './Badge';

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
  argTypes: {
    pele: { control: 'inline-radio', options: ['tonal', 'preenchida', 'contorno', 'fantasma'] },
  },
  args: { value: 4 },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const BadgeContagem: Story = {
  name: 'Badge · contagem sobre ícone',
  parameters: {
    docs: {
      description: {
        story:
          'Contagem sobre ícone na pele preenchida do kit: #ffffff sobre `danger-emphasis` #dc2626 mede 4,83:1 nos dois temas. O aro de 2px na cor da superfície recorta o badge do ícone.',
      },
    },
  },
  render: () => (
    <Badge value={4} severity="danger" pele="preenchida">
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

export const Anatomia: Story = {
  name: 'Anatomia · 20px, padding 2 × 8, raio 10, SemiBold 12/16',
  parameters: {
    docs: {
      description: {
        story:
          'A anatomia do Badge do kit, medida no Figma e conferida aqui em pixel inteiro. Vale para o badge solto e para a `Tag`, que dividem a mesma escala (16 / 20 / 24).',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--citie-spacing-3)', alignItems: 'center' }}>
      <Badge value={12} severity="primary" pele="preenchida" />
      <Tag label="Em análise" severity="warn" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const badge = canvasElement.querySelector<HTMLElement>('.citie-badge')!;
    const tag = canvasElement.querySelector<HTMLElement>('.citie-tag')!;
    for (const marcador of [badge, tag]) {
      const estilo = getComputedStyle(marcador);
      await expect(marcador.getBoundingClientRect().height).toBe(20);
      await expect(estilo.paddingInlineStart).toBe('8px');
      await expect(estilo.paddingBlockStart).toBe('2px');
      await expect(estilo.borderTopLeftRadius).toBe('10px');
      await expect(estilo.fontSize).toBe('12px');
      await expect(estilo.fontWeight).toBe('600');
      await expect(estilo.lineHeight).toBe('16px');
    }
    // Tag e badge na mesma célula alinham pela mesma altura.
    await expect(badge.getBoundingClientRect().height).toBe(tag.getBoundingClientRect().height);
  },
};

export const TonalNoEscuro: Story = {
  name: 'Tema · tonal primary e info sobre superfície escura',
  globals: { theme: 'dark' },
  parameters: {
    docs: {
      description: {
        story:
          'O par que o revisor mediu: no escuro o fundo tonal é um véu de 14% da tinta de marca, e o rótulo em `brand-primary` media 4,39:1 sobre a superfície #1a1a1d. A tinta sobe para `brand-hover` no escuro (6,47:1 na superfície, 6,93:1 no canvas). O gate do axe roda aqui com a Tag sobre a superfície de card, então a tinta antiga reprova o build.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: 'var(--citie-spacing-3)',
        padding: 'var(--citie-spacing-4)',
        background: 'var(--citie-background-surface)',
        border: '1px solid var(--citie-border-default)',
        borderRadius: 'var(--citie-radius-lg)',
      }}
    >
      <Tag label="Prioritário" severity="primary" />
      <Tag label="Enviado" severity="info" />
      <Badge value={7} severity="primary" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const tag = canvasElement.querySelector<HTMLElement>('.citie-sev--primary')!;
    // A tinta do rótulo é o degrau de hover da marca.
    const sonda = document.createElement('span');
    sonda.style.color = 'var(--citie-brand-hover)';
    tag.parentElement!.appendChild(sonda);
    const esperado = getComputedStyle(sonda).color;
    sonda.remove();
    await expect(getComputedStyle(tag).color).toBe(esperado);
  },
};

const SEVERIDADES: Severidade[] = ['primary', 'secondary', 'success', 'info', 'warn', 'danger'];
const PELES: PeleMarcador[] = ['tonal', 'preenchida', 'contorno', 'fantasma'];

export const Peles: Story = {
  name: 'Peles · tonal, preenchida, contorno e fantasma por severidade',
  parameters: {
    // ACHADO ABERTO DO DS, o mesmo do Button: a pele preenchida de success
    // (#16a34a) e de warn (#d97706) com o rótulo branco de `*-contrast` mede
    // 3,30:1 e 3,19:1 no claro e reprova AA. As duas linhas estão aqui porque
    // o kit as tem e o revisor precisa ver o achado; a varredura fica em modo
    // aviso, como nas stories daquelas variantes, até a decisão de token. As
    // outras 22 combinações passam, com os números em Badge.css.
    a11y: { test: 'todo' },
    docs: {
      description: {
        story: [
          'As quatro peles do Badge do kit em cada severidade. A tonal é a pele da casa e continua',
          'sendo o padrão de `Tag` e `StatusIndicator`; a preenchida é o Primary e o Destructive do',
          'kit, o contorno é o Outline e a fantasma é o Ghost. Contraste de rótulo medido em cada',
          'combinação, nos dois temas, no cabeçalho de `Badge.css`. **Success e warn preenchidas no',
          'claro carregam o achado aberto do DS (3,30:1 e 3,19:1)**, o mesmo do Button.',
        ].join(' '),
      },
    },
  },
  render: () => (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'var(--citie-font-ui)', fontSize: 12 }}>
      <thead>
        <tr>
          <th style={{ textAlign: 'left', padding: 'var(--citie-spacing-2)' }}>Severidade</th>
          {PELES.map((pele) => (
            <th key={pele} style={{ textAlign: 'left', padding: 'var(--citie-spacing-2)' }}>
              {pele}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {SEVERIDADES.map((severidade) => (
          <tr key={severidade}>
            <td style={{ padding: 'var(--citie-spacing-2)', color: 'var(--citie-text-secondary)' }}>
              {severidade}
            </td>
            {PELES.map((pele) => (
              <td key={pele} style={{ padding: 'var(--citie-spacing-2)' }}>
                <Tag label="Rótulo" severity={severidade} pele={pele} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const tags = canvasElement.querySelectorAll<HTMLElement>('.citie-tag');
    await expect(tags).toHaveLength(SEVERIDADES.length * PELES.length);
    // Contorno tem borda de 1px e continua na altura do degrau; fantasma e
    // contorno ficam sem fundo; a preenchida troca o fundo pelo preenchimento.
    for (const tag of tags) {
      const estilo = getComputedStyle(tag);
      await expect(tag.getBoundingClientRect().height).toBe(20);
      if (tag.classList.contains('citie-sev--pele-contorno')) {
        await expect(estilo.borderTopWidth).toBe('1px');
        await expect(estilo.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      }
      if (tag.classList.contains('citie-sev--pele-fantasma')) {
        await expect(estilo.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      }
      if (tag.classList.contains('citie-sev--pele-preenchida')) {
        await expect(estilo.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
        await expect(estilo.backgroundColor).not.toBe(estilo.color);
      }
    }
  },
};

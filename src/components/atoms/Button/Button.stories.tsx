import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Button } from './Button';

/**
 * Regra do projeto: uma story por ESTADO, não uma story com 8 controles.
 * Só estado nomeado entra no CI, no snapshot visual e na varredura de a11y.
 */

const meta = {
  title: 'Átomos/Ações/Button',
  component: Button,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Botão da família de ação Citiesoft. Spec: `design-system/03-components/buttons.md` v2.0.0. Equivalente PrimeNG: `p-button`.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'success',
        'danger',
        'warn',
        'info',
        'text',
        'contrast',
      ],
      description: 'Hierarquia da ação. Máximo 1 primary por contexto visível.',
    },
    size: { control: 'inline-radio', options: ['small', 'normal', 'large'] },
    touchTarget: { control: 'inline-radio', options: ['default', 'comfortable'] },
    onClick: { action: 'clicado' },
  },
  args: {
    variant: 'primary',
    size: 'normal',
    children: 'Salvar colaborador',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Variantes                                                           */
/* ------------------------------------------------------------------ */

export const Primary: Story = {
  name: 'Primary · ação principal',
  parameters: {
    docs: {
      description: {
        story:
          'Ação principal da tela ou do modal. Rótulo sempre verbo no infinitivo mais objeto específico.',
      },
    },
  },
};

export const Secondary: Story = {
  name: 'Secondary · ação de apoio',
  args: { variant: 'secondary', children: 'Cancelar' },
};

export const Success: Story = {
  name: 'Success · confirmação positiva',
  args: { variant: 'success', children: 'Aprovar prestação de contas' },
  parameters: {
    // ACHADO ABERTO DO DS (não silenciar sem decisão de design):
    // `color.feedback.success.emphasis` #16A34A com rótulo branco dá 3,30:1 e falha
    // WCAG AA para texto de 14px. A spec do botão só validou o par do primary.
    // Enquanto o token não é decidido, a violação fica visível no painel de a11y
    // sem quebrar o CI. Ver story "Success · correção proposta".
    a11y: { test: 'todo' },
    docs: {
      description: {
        story:
          'Reproduz o token oficial. **Falha WCAG AA (3,30:1)** com rótulo branco em 14px. Achado aberto do design system.',
      },
    },
  },
};

export const SuccessCorrigido: Story = {
  name: 'Success · correção proposta',
  args: { variant: 'success', children: 'Aprovar prestação de contas' },
  parameters: {
    docs: {
      description: {
        story:
          'Mesma variante com o preenchimento em `color.feedback.success.text` #15803D: 5,02:1, passa AA e mantém a leitura de sucesso.',
      },
    },
  },
  render: (args) => (
    <div style={{ '--citie-success-emphasis': '#15803D' } as CSSProperties}>
      <Button {...args} />
    </div>
  ),
};

export const Danger: Story = {
  name: 'Danger · ação destrutiva',
  args: { variant: 'danger', children: 'Excluir benefício' },
  parameters: {
    docs: {
      description: {
        story:
          'Somente destruição de dado ou revogação de acesso. O rótulo nomeia a destruição, nunca "Prosseguir".',
      },
    },
  },
};

export const Warn: Story = {
  name: 'Warn · exige atenção',
  args: { variant: 'warn', children: 'Renovar benefício' },
  parameters: {
    // ACHADO ABERTO DO DS: `color.feedback.warning.emphasis` #D97706 com rótulo
    // branco dá 3,19:1 e falha WCAG AA em 14px. Mesma situação do success.
    a11y: { test: 'todo' },
    docs: {
      description: {
        story:
          'Reproduz o token oficial. **Falha WCAG AA (3,19:1)** com rótulo branco em 14px. Achado aberto do design system.',
      },
    },
  },
};

export const WarnCorrigido: Story = {
  name: 'Warn · correção proposta',
  args: { variant: 'warn', children: 'Renovar benefício' },
  parameters: {
    docs: {
      description: {
        story:
          'Preenchimento em `color.feedback.warning.text` #B45309: 5,02:1, passa AA.',
      },
    },
  },
  render: (args) => (
    <div style={{ '--citie-warning-emphasis': '#B45309' } as CSSProperties}>
      <Button {...args} />
    </div>
  ),
};

export const Info: Story = {
  name: 'Info · contexto informativo',
  args: { variant: 'info', children: 'Ver instruções' },
};

export const Text: Story = {
  name: 'Text · ação terciária',
  args: { variant: 'text', children: 'Ver histórico' },
};

export const Contrast: Story = {
  name: 'Contrast · superfícies neutras',
  args: { variant: 'contrast', children: 'Exportar relatório' },
};

/* ------------------------------------------------------------------ */
/* Tamanhos                                                            */
/* ------------------------------------------------------------------ */

export const Tamanhos: Story = {
  name: 'Tamanhos · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <Button {...args} size="small">
        Small 32px
      </Button>
      <Button {...args} size="normal">
        Normal 40px
      </Button>
      <Button {...args} size="large">
        Large 48px
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alturas = ['Small 32px', 'Normal 40px', 'Large 48px'].map((nome) =>
      canvas.getByRole('button', { name: nome }).getBoundingClientRect().height,
    );
    // A spec proíbe altura abaixo de 32px em produto.
    await expect(alturas).toEqual([32, 40, 48]);
  },
};

/* ------------------------------------------------------------------ */
/* Estados obrigatórios                                                */
/* ------------------------------------------------------------------ */

export const Foco: Story = {
  name: 'Estado · foco por teclado',
  parameters: {
    docs: {
      description: {
        story:
          'Anel `color.state.focus` aplicado por `:focus-visible`, sem remover a borda. Obrigatório por WCAG 2.4.7 e 2.4.11.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Salvar colaborador' });

    await userEvent.tab();

    await expect(botao).toHaveFocus();
    await expect(getComputedStyle(botao).boxShadow).not.toBe('none');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
  parameters: {
    docs: {
      description: {
        story:
          'Não recebe foco de teclado. O motivo do bloqueio precisa estar visível ou em tooltip na tela real.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Salvar colaborador' });

    await userEvent.click(botao);
    await expect(args.onClick).not.toHaveBeenCalled();

    await userEvent.tab();
    await expect(botao).not.toHaveFocus();
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: { loading: true, loadingLabel: 'Salvando colaborador' },
  parameters: {
    docs: {
      description: {
        story:
          'Spinner substitui o ícone e o rótulo vai para o gerúndio. O botão continua focável com `aria-disabled` para o leitor de tela anunciar a mudança, e o clique é barrado no componente.',
      },
    },
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Salvando colaborador' });

    await expect(botao).toHaveAttribute('aria-busy', 'true');
    await expect(botao).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(botao);
    await expect(args.onClick).not.toHaveBeenCalled();
  },
};

export const Clique: Story = {
  name: 'Estado · clique dispara a ação',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Salvar colaborador' }));
    await expect(args.onClick).toHaveBeenCalledTimes(1);
  },
};

/* ------------------------------------------------------------------ */
/* Acessibilidade                                                      */
/* ------------------------------------------------------------------ */

const IconeLixeira = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const SomenteIcone: Story = {
  name: 'A11y · somente ícone com nome acessível',
  args: {
    variant: 'text',
    iconOnly: true,
    icon: IconeLixeira,
    children: undefined,
    'aria-label': 'Excluir lançamento',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use apenas em espaço muito restrito. Exige `aria-label` com a ação nomeada e tooltip visível no hover.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Excluir lançamento' })).toBeVisible();
  },
};

export const AlvoDeToqueCidadao: Story = {
  name: 'A11y · alvo de toque 44px (cidadão e mobile)',
  args: { size: 'small', touchTarget: 'comfortable', children: 'Enviar solicitação' },
  parameters: {
    docs: {
      description: {
        story:
          'Visual de 32px com área de toque de 44x44px garantida por pseudo-elemento, conforme a spec para contexto de cidadão.',
      },
    },
  },
};

/* ------------------------------------------------------------------ */
/* Combinações reais de produto                                        */
/* ------------------------------------------------------------------ */

export const BarraDeAcoesDeFormulario: Story = {
  name: 'Combinação · barra de ações de formulário',
  parameters: {
    docs: {
      description: {
        story: 'Primária à direita, "Cancelar" à esquerda dela. Uma única primária no bloco.',
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--citie-spacing-3)',
        padding: 'var(--citie-spacing-4)',
        borderTop: '1px solid var(--citie-border-default)',
        background: 'var(--citie-background-surface)',
      }}
    >
      <Button {...args} variant="secondary">
        Cancelar
      </Button>
      <Button {...args} variant="primary">
        Salvar colaborador
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('button')).toHaveLength(2);
    await expect(canvas.getByRole('button', { name: 'Cancelar' })).toBeVisible();
  },
};

export const ModalDeConfirmacaoDestrutiva: Story = {
  name: 'Combinação · confirmação destrutiva',
  parameters: {
    docs: {
      description: {
        story:
          'O botão danger nomeia a ação destrutiva e "Cancelar" fica à sua direita, o inverso da barra de formulário.',
      },
    },
  },
  render: (args) => (
    <div
      style={{
        maxWidth: 420,
        padding: 'var(--citie-spacing-5)',
        borderRadius: 'var(--citie-radius-lg)',
        border: '1px solid var(--citie-border-strong)',
        background: 'var(--citie-background-surface)',
        fontFamily: 'var(--citie-font-ui)',
        color: 'var(--citie-text-base)',
      }}
    >
      <h2
        style={{
          margin: '0 0 var(--citie-spacing-2)',
          fontFamily: 'var(--citie-font-display)',
          fontSize: 18,
          color: 'var(--citie-text-primary)',
        }}
      >
        Excluir benefício
      </h2>
      <p style={{ margin: '0 0 var(--citie-spacing-5)', fontSize: 14 }}>
        O benefício Plano de saúde será removido do colaborador. Os lançamentos já
        registrados permanecem no histórico.
      </p>
      <div style={{ display: 'flex', gap: 'var(--citie-spacing-3)' }}>
        <Button {...args} variant="danger">
          Excluir benefício
        </Button>
        <Button {...args} variant="secondary">
          Cancelar
        </Button>
      </div>
    </div>
  ),
};

/* ------------------------------------------------------------------ */
/* Anti-padrão                                                         */
/* ------------------------------------------------------------------ */

export const AntiPadraoDuasPrimarias: Story = {
  name: 'Anti-padrão · duas primárias no mesmo bloco',
  tags: ['anti-padrao'],
  parameters: {
    docs: {
      description: {
        story:
          'Errado de propósito. Com duas primárias lado a lado o usuário perde a referência de qual é a ação esperada, e a spec limita a uma por contexto visível. Documentado aqui para servir de comparação em revisão de tela.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: 'var(--citie-spacing-3)' }}>
      <Button {...args} variant="primary">
        Salvar colaborador
      </Button>
      <Button {...args} variant="primary">
        Salvar e continuar
      </Button>
    </div>
  ),
};

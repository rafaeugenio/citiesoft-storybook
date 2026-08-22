import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
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
          'Botão da família de ação Citiesoft. Spec: `design-system/03-components/buttons.md` v2.0.0. Equivalente PrimeNG: `p-button`.\n\n**Quando usar:** para executar uma ação na tela atual (salvar, enviar, aprovar, excluir, filtrar), com no máximo um `primary` por contexto visível para o olho saber qual é o caminho principal.\n\n**Quando não usar:** para navegar entre telas. Navegação de rota pede um link de verdade, e um botão que troca a rota tira do servidor o clique do meio, o "abrir em nova aba" e o menu de copiar endereço, coisas que quem trabalha com dois processos abertos usa o dia inteiro; a navegação estrutural fica em `Menubar`, `Menu`, `Sidebar` e `Breadcrumb`. Para empilhar várias ações na mesma linha de uma listagem (a linha cresce até estourar a largura da tabela e a ação principal se perde entre as secundárias): use `SplitButton`, que deixa a ação frequente à vista e recolhe o resto. Para estado que fica ligado ou desligado, como um filtro rápido: o botão comum não comunica que está ativo depois do clique, e o servidor volta a clicar sem saber se aplicou; use `ToggleButton` ou `SelectButton`. Para ação irreversível sobre dado de processo (excluir lançamento, cancelar solicitação), o botão sozinho não basta: encadeie `ConfirmPopup` ou `ConfirmDialog`. Para comunicar situação, o lugar é outro: etapa do registro fica em `StatusIndicator` e atributo fica em `Tag`, porque um retângulo clicável que só informa faz o servidor clicar à toa.',
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

/**
 * Resolve `--citie-state-focus-ring` pelo próprio navegador, criando uma sonda
 * descartável que consome o token e devolve o valor computado. É o que mantém a
 * asserção independente de tema: no claro e no escuro o token tem valores
 * diferentes, e nenhum deles precisa ser escrito aqui.
 */
function anelDoSistema(referencia: Element) {
  const sonda = document.createElement('span');
  sonda.style.boxShadow = 'var(--citie-state-focus-ring)';
  referencia.parentElement?.appendChild(sonda);
  const valor = getComputedStyle(sonda).boxShadow;
  sonda.remove();
  return valor;
}

const TODAS_AS_VARIANTES = [
  'primary',
  'secondary',
  'text',
  'success',
  'danger',
  'warn',
  'info',
  'contrast',
] as const;

export const FocoEmTodasAsVariantes: Story = {
  name: 'Regressão · anel de foco existe em toda variante',
  parameters: {
    // Esta story existe para medir o ANEL DE FOCO, e por isso precisa render as
    // oito variantes juntas. Duas delas, `success` e `warn`, carregam o achado
    // aberto de contraste do design system (3,30:1 e 3,19:1 com rótulo branco),
    // já documentado nas stories próprias e ainda sem decisão do dono da marca.
    // A varredura fica visível no painel sem derrubar o CI, no mesmo tratamento
    // que as stories daquelas variantes já recebem. O que esta verificação mede
    // continua sendo asseverado de forma dura na `play`.
    a11y: { test: 'todo' },
    docs: {
      description: {
        story: [
          'Esta story existe por causa de um defeito real, encontrado por um revisor independente',
          'e não pela suíte.',
          '',
          'O anel de foco compõe a elevação da variante numa lista de sombras. A versão anterior',
          'usava `var(--citie-elevacao-do-botao, none)` como reserva. Acontece que `box-shadow`',
          'aceita `none` apenas como valor único: `sombra, none` é lista inválida, e o navegador',
          'descarta a declaração inteira. Com `outline: none` já aplicado por cima, as variantes',
          'que não definiam a propriedade (`secondary`, `text`, `info`, `contrast`) ficavam',
          '**sem indicador de foco nenhum**, o que reprova a WCAG 2.4.7.',
          '',
          'A suíte não pegou porque a story de foco cobria apenas a `primary`, que define a',
          'propriedade e por isso funcionava. A correção foi declarar uma sombra nula válida',
          '(`0 0 0 0 transparent`) na classe base.',
          '',
          'Esta verificação percorre as oito variantes e mede o `box-shadow` computado de cada',
          'uma sob foco. Se alguém reintroduzir o defeito, ela reprova.',
        ].join('\n'),
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--citie-spacing-3)' }}>
      {TODAS_AS_VARIANTES.map((variante) => (
        <Button key={variante} variant={variante}>
          {variante}
        </Button>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Navegação por teclado de verdade, e não `.focus()` programático: o
    // `:focus-visible` depende de heurística do navegador sobre a última forma
    // de interação, e foco por script pode não acioná-lo. Testar com `.focus()`
    // mediria um estado que o usuário de teclado nunca vê.
    for (const variante of TODAS_AS_VARIANTES) {
      await userEvent.tab();

      const botao = canvas.getByRole('button', { name: variante });
      await expect(botao).toHaveFocus();

      // A medição espera a transição assentar. `box-shadow` está na lista de
      // transições do botão, então ler o computado no instante do foco devolve
      // o valor de PARTIDA, ainda em curso, e não o de chegada. Foi esse
      // artefato que fez a primeira versão desta verificação acusar defeito
      // onde não havia.
      await waitFor(async () => {
        const estilo = getComputedStyle(botao);
        // O anel precisa existir de fato: lista inválida vira `none`, e o
        // `outline` já está suprimido, então `none` aqui é foco invisível.
        await expect(estilo.boxShadow).not.toBe('none');
        // E precisa ser o anel do sistema, e não qualquer sombra sobrando.
        //
        // A comparação lê o token pelo navegador em vez de trazer o valor para
        // cá. A primeira versão desta asserção escrevia a cor do anel claro
        // como literal, e por isso reprovava no tema escuro, onde o token tem
        // outro valor: era literal justamente na verificação que existe para
        // provar que o sistema de token funciona.
        await expect(estilo.boxShadow.startsWith(anelDoSistema(botao))).toBe(true);
      });
    }
  },
};

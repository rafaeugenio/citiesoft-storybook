import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { Dock, type ItemDoDock } from './Dock';

/* Ícones desenhados aqui mesmo, no traço de 2 do resto do kit. */
const IconePainel = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconeProcesso = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h8l4 4v14H6z" strokeLinejoin="round" />
    <path d="M14 3v5h4" strokeLinejoin="round" />
    <path d="M9 13h6M9 17h4" strokeLinecap="round" />
  </svg>
);

const IconeAgenda = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
  </svg>
);

const IconeRelatorio = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20V4" strokeLinecap="round" />
    <path d="M4 20h16" strokeLinecap="round" />
    <path d="M8 16v-5M13 16V7M18 16v-8" strokeLinecap="round" />
  </svg>
);

const IconeArquivo = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="4" rx="1" />
    <path d="M5 8v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8" strokeLinejoin="round" />
    <path d="M10 12h4" strokeLinecap="round" />
  </svg>
);

const ATALHOS: ItemDoDock[] = [
  { id: 'painel', rotulo: 'Painel do setor', icone: <IconePainel /> },
  { id: 'processos', rotulo: 'Processos de TFD', icone: <IconeProcesso /> },
  { id: 'agenda', rotulo: 'Agenda de viagens', icone: <IconeAgenda /> },
  { id: 'relatorios', rotulo: 'Relatório de diárias', icone: <IconeRelatorio /> },
  { id: 'arquivo', rotulo: 'Processos arquivados', icone: <IconeArquivo /> },
];

/* A moldura simula a área útil de uma tela para mostrar em que borda a barra
   encosta. Cinza neutro no lugar do papel de parede do Figma. */
function AreaDeTrabalho({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '240px',
        padding: '16px',
        background: 'var(--citie-background-subtle)',
        border: '1px solid var(--citie-border-default)',
        borderRadius: 'var(--citie-radius-lg)',
      }}
    >
      {children}
    </div>
  );
}

const meta = {
  title: 'Organismos/Menus/Dock',
  component: Dock,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Barra flutuante de atalhos por ícone. Página do Figma CitieOne `6738:52935` (❖ Dock),',
          'componente `dock` com o eixo `Location` (Bottom, Top, Left, Right) e a parte `dock-item`',
          'com o eixo `Focus` (False, True), que no arquivo é o ícone ampliado sob o ponteiro.',
          'Equivalente PrimeNG: `p-dock` (`model`, `position`).',
          '',
          '**Quando usar:** quase nunca. O Dock é componente de vitrine do kit PrimeNG, herdado do',
          'dock do macOS, e tem pouco uso previsto em sistema B2G denso. Ele serve, no máximo, como',
          'atalho secundário para 3 a 6 telas muito visitadas dentro de um painel operacional.',
          '',
          '**Quando NÃO usar:** navegação principal do sistema. Menu de módulos, submenus e qualquer',
          'estrutura que precise de rótulo permanente vão em `Sidebar` ou `Menubar`. Item só de ícone',
          'obriga o servidor a decorar símbolo, flutua por cima do conteúdo e não comporta hierarquia.',
          'Se a lista tende a crescer, o componente já é a escolha errada.',
          '',
          'A ampliação do ícone é decorativa: acontece só no desenho, nunca no alvo de clique, e some',
          'por completo com `prefers-reduced-motion: reduce`. O rótulo de cada item é ao mesmo tempo',
          'nome acessível e dica visível no hover e no foco.',
        ].join(' '),
      },
    },
  },
  args: {
    rotulo: 'Atalhos do painel de TFD',
    itens: ATALHOS,
  },
} satisfies Meta<typeof Dock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inferior: Story = {
  name: 'Posição · inferior',
  parameters: {
    docs: {
      description: {
        story:
          'Posição padrão do Figma (`Location: Bottom`). Cinco atalhos é o teto confortável: acima disso a fileira de ícones vira adivinhação.',
      },
    },
  },
  render: (args) => (
    <AreaDeTrabalho>
      <Dock {...args} posicao="bottom" />
    </AreaDeTrabalho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('toolbar', { name: 'Atalhos do painel de TFD' });

    await expect(barra).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(within(barra).getAllByRole('button')).toHaveLength(5);
    // Cada botão é só ícone, então o nome acessível é a única identificação.
    await expect(canvas.getByRole('button', { name: 'Processos de TFD' })).toBeVisible();
  },
};

export const Superior: Story = {
  name: 'Posição · superior',
  parameters: {
    docs: {
      description: {
        story:
          '`Location: Top`. A dica cresce para baixo, para não sair da área visível quando a barra encosta no topo.',
      },
    },
  },
  render: (args) => (
    <AreaDeTrabalho>
      <Dock {...args} posicao="top" />
    </AreaDeTrabalho>
  ),
};

export const Esquerda: Story = {
  name: 'Posição · esquerda',
  parameters: {
    docs: {
      description: {
        story:
          '`Location: Left`. Em coluna, a orientação ARIA vira vertical e as setas que andam pelos itens passam a ser ↑ e ↓.',
      },
    },
  },
  render: (args) => (
    <AreaDeTrabalho>
      <Dock {...args} posicao="left" />
    </AreaDeTrabalho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('toolbar', { name: 'Atalhos do painel de TFD' });

    await expect(barra).toHaveAttribute('aria-orientation', 'vertical');

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Painel do setor' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'Processos de TFD' })).toHaveFocus();
  },
};

export const Direita: Story = {
  name: 'Posição · direita',
  parameters: {
    docs: {
      description: {
        story: '`Location: Right`. A dica cresce para dentro da área, à esquerda de cada ícone.',
      },
    },
  },
  render: (args) => (
    <AreaDeTrabalho>
      <Dock {...args} posicao="right" />
    </AreaDeTrabalho>
  ),
};

export const NavegacaoPorSetas: Story = {
  name: 'Teclado · setas com roving tabindex',
  parameters: {
    docs: {
      description: {
        story:
          'A barra inteira ocupa uma única parada de Tab. Dentro dela, ← e → andam entre os atalhos, Home vai para o primeiro e End para o último, e a lista dá a volta nas pontas.',
      },
    },
  },
  render: (args) => (
    <AreaDeTrabalho>
      <Dock {...args} posicao="bottom" />
    </AreaDeTrabalho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const painel = canvas.getByRole('button', { name: 'Painel do setor' });
    const processos = canvas.getByRole('button', { name: 'Processos de TFD' });
    const arquivo = canvas.getByRole('button', { name: 'Processos arquivados' });

    await userEvent.tab();
    await expect(painel).toHaveFocus();
    await expect(processos).toHaveAttribute('tabindex', '-1');

    await userEvent.keyboard('{ArrowRight}');
    await expect(processos).toHaveFocus();
    await expect(processos).toHaveAttribute('tabindex', '0');

    await userEvent.keyboard('{End}');
    await expect(arquivo).toHaveFocus();

    // Da última posição, seguir adiante volta ao primeiro atalho.
    await userEvent.keyboard('{ArrowRight}');
    await expect(painel).toHaveFocus();

    await userEvent.keyboard('{Home}');
    await expect(painel).toHaveFocus();
  },
};

export const ItemDesabilitado: Story = {
  name: 'Estado · atalho indisponível',
  parameters: {
    docs: {
      description: {
        story:
          'O relatório de diárias fecha na virada da competência. O atalho continua focável e anunciado com `aria-disabled`, em vez de sumir do teclado, e não dispara a ação.',
      },
    },
  },
  args: {
    itens: ATALHOS.map((item) =>
      item.id === 'relatorios' ? { ...item, desabilitado: true } : item,
    ),
  },
  render: (args) => (
    <AreaDeTrabalho>
      <Dock {...args} posicao="bottom" />
    </AreaDeTrabalho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const relatorio = canvas.getByRole('button', { name: 'Relatório de diárias' });

    await expect(relatorio).toHaveAttribute('aria-disabled', 'true');
    await expect(relatorio).not.toBeDisabled();

    relatorio.focus();
    await expect(relatorio).toHaveFocus();
  },
};

export const SemAmpliacao: Story = {
  name: 'Movimento · sem ampliação',
  parameters: {
    docs: {
      description: {
        story:
          'Mesma barra com a ampliação desligada na origem, para painel projetado em telão ou quando o movimento incomoda. A dica no hover e no foco continua funcionando, porque ela é informação, não enfeite.',
      },
    },
  },
  render: (args) => (
    <AreaDeTrabalho>
      <Dock {...args} posicao="bottom" semAmpliacao />
    </AreaDeTrabalho>
  ),
};

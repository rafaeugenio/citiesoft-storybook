import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { expect, userEvent, within } from 'storybook/test';
import { SpeedDial, type AcaoDoSpeedDial } from './SpeedDial';

/* Ícones desenhados aqui mesmo, no traço de 2 do resto do kit. */
const IconeAbrir = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h8l4 4v14H6z" strokeLinejoin="round" />
    <path d="M14 3v5h4" strokeLinejoin="round" />
    <path d="M9 13h6M9 17h4" strokeLinecap="round" />
  </svg>
);

const IconeEncaminhar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12h14" strokeLinecap="round" />
    <path d="m13 7 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconeAnexar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M17 8 9.5 15.5a2.5 2.5 0 0 0 3.5 3.5l6-6a4.5 4.5 0 0 0-6.4-6.3L6 13.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconeDiaria = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="8" />
    <path d="M12 8v8M14.5 10h-4a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4" strokeLinecap="round" />
  </svg>
);

const ATALHOS: AcaoDoSpeedDial[] = [
  { id: 'abrir', rotulo: 'Abrir processo 2025/0481', icone: <IconeAbrir /> },
  { id: 'encaminhar', rotulo: 'Encaminhar à Secretaria de Saúde', icone: <IconeEncaminhar /> },
  { id: 'anexar', rotulo: 'Anexar laudo médico', icone: <IconeAnexar /> },
  { id: 'diaria', rotulo: 'Lançar diária de viagem', icone: <IconeDiaria /> },
];

const PROCESSOS = [
  { numero: '2025/0481', servidor: 'Maria de Fátima Souza', situacao: 'Aguardando laudo' },
  { numero: '2025/0479', servidor: 'Antônio Carlos Ribeiro', situacao: 'Em análise' },
  { numero: '2025/0463', servidor: 'Joana D’Arc Nascimento', situacao: 'Autorizado' },
];

type Ancoragem = 'inferior-direito' | 'superior-esquerdo' | 'centro';

const POSICOES: Record<Ancoragem, { top?: string; bottom?: string; left?: string; right?: string; transform?: string }> = {
  'inferior-direito': { bottom: '16px', right: '16px' },
  'superior-esquerdo': { top: '16px', left: '16px' },
  centro: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
};

/* Listagem de processos de TFD: o contexto real em que o leque vive. Os atalhos
   ficariam como ruído permanente se estivessem sempre abertos na tela. */
function PainelDeProcessos({
  ancoragem = 'inferior-direito',
  children,
}: {
  ancoragem?: Ancoragem;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '340px',
        padding: 'var(--citie-spacing-4)',
        background: 'var(--citie-background-surface)',
        border: '1px solid var(--citie-border-default)',
        borderRadius: 'var(--citie-radius-lg)',
        fontFamily: 'var(--citie-font-ui)',
        overflow: 'hidden',
      }}
    >
      <p
        style={{
          margin: '0 0 var(--citie-spacing-3)',
          color: 'var(--citie-text-primary)',
          fontSize: 'var(--citie-font-size-body-lg)',
          fontWeight: 'var(--citie-font-weight-action)',
        }}
      >
        Processos de TFD · competência 08/2025
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--citie-font-size-body-md)' }}>
        <thead>
          <tr style={{ color: 'var(--citie-text-secondary)', textAlign: 'left' }}>
            <th style={{ padding: 'var(--citie-spacing-2) 0', fontWeight: 'var(--citie-font-weight-action)' }}>
              Processo
            </th>
            <th style={{ padding: 'var(--citie-spacing-2) 0', fontWeight: 'var(--citie-font-weight-action)' }}>
              Servidor
            </th>
            <th style={{ padding: 'var(--citie-spacing-2) 0', fontWeight: 'var(--citie-font-weight-action)' }}>
              Situação
            </th>
          </tr>
        </thead>
        <tbody style={{ color: 'var(--citie-text-base)' }}>
          {PROCESSOS.map((processo) => (
            <tr key={processo.numero} style={{ borderTop: '1px solid var(--citie-border-default)' }}>
              <td style={{ padding: 'var(--citie-spacing-2) 0' }}>{processo.numero}</td>
              <td style={{ padding: 'var(--citie-spacing-2) 0' }}>{processo.servidor}</td>
              <td style={{ padding: 'var(--citie-spacing-2) 0' }}>{processo.situacao}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ position: 'absolute', ...POSICOES[ancoragem] }}>{children}</div>
    </div>
  );
}

/** Abre o leque pelo acionamento, que é como o servidor abre na tela real. */
async function abrirPeloAcionamento(canvasElement: HTMLElement, rotulo: string) {
  const canvas = within(canvasElement);
  const acionador = canvas.getByRole('button', { name: rotulo });
  await userEvent.click(acionador);
  return { canvas, acionador };
}

const ROTULO = 'Atalhos do processo 2025/0481';

const meta = {
  title: 'Ação/SpeedDial',
  component: SpeedDial,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Leque de atalhos flutuantes. Página do Figma CitieOne `6738:49719` (❖ SpeedDial),',
          'componente `speeddial` com os eixos `Display` (False, True), `Direction` (Down, Up, Left,',
          'Right e as quatro diagonais), `Circular` (False, True) e `Circular Type` (Semi-Circle,',
          'Quarter-Circle, Full Circle). Equivalente PrimeNG: `p-speeddial`.',
          '',
          '**Quando usar:** listagens e cards de processo que precisam de atalhos contextuais sem',
          'gastar espaço permanente na tela, como manda a spec de botões da Citiesoft.',
          '',
          '**Quando NÃO usar:** ação principal da tela (essa é botão primário na barra de ações),',
          'lista de ações que cresce (vira Menu com rótulo) e qualquer ação destrutiva. Excluir e',
          'revogar nunca entram no leque: ficam escondidas atrás de um "+" e a mira do ponteiro cai',
          'sobre um alvo de 32px.',
          '',
          'O acionamento tem `aria-haspopup="menu"` e `aria-expanded`. Cada ação é só ícone, então o',
          'rótulo é ao mesmo tempo nome acessível e dica visível no hover e no foco. No teclado,',
          'Enter, Espaço ou seta abrem e o foco vai para o primeiro atalho; as setas percorrem a',
          'lista dando a volta nas pontas; Escape fecha e devolve o foco ao acionamento.',
          '',
          'A animação do leque some por completo com `prefers-reduced-motion: reduce`: as ações',
          'aparecem já no lugar, sem transição.',
        ].join(' '),
      },
    },
  },
  args: {
    rotulo: ROTULO,
    acoes: ATALHOS,
  },
} satisfies Meta<typeof SpeedDial>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fechado: Story = {
  name: 'Estado · fechado',
  parameters: {
    docs: {
      description: {
        story:
          '`Display: False`. Em repouso o componente é um único botão de 40px no canto da listagem. Nada do menu existe no DOM, então o teclado enxerga uma parada só.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos>
      <SpeedDial {...args} />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const acionador = canvas.getByRole('button', { name: ROTULO });

    await expect(acionador).toHaveAttribute('aria-haspopup', 'menu');
    await expect(acionador).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
  },
};

export const Aberto: Story = {
  name: 'Estado · aberto',
  parameters: {
    docs: {
      description: {
        story:
          '`Display: True` com `Direction: Up`, o rumo padrão. Os atalhos sobem em fila a partir do acionamento e o "+" gira para "×", para que a forma comunique o estado junto com a cor.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos>
      <SpeedDial {...args} direcao="up" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    const { canvas, acionador } = await abrirPeloAcionamento(canvasElement, ROTULO);

    await expect(acionador).toHaveAttribute('aria-expanded', 'true');

    const menu = canvas.getByRole('menu', { name: ROTULO });
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(4);
    // Ao abrir, o foco vai para o primeiro atalho, como manda o padrão de menu.
    await expect(canvas.getByRole('menuitem', { name: 'Abrir processo 2025/0481' })).toHaveFocus();
  },
};

export const ParaBaixo: Story = {
  name: 'Direção · para baixo',
  parameters: {
    docs: {
      description: {
        story:
          '`Direction: Down`. Rumo para quando o acionamento fica no cabeçalho da listagem e há espaço livre abaixo dele.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos ancoragem="superior-esquerdo">
      <SpeedDial {...args} direcao="down" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    await abrirPeloAcionamento(canvasElement, ROTULO);
  },
};

export const ParaEsquerda: Story = {
  name: 'Direção · para a esquerda',
  parameters: {
    docs: {
      description: {
        story:
          '`Direction: Left`. O leque corre na horizontal e a dica de cada atalho cresce para a direita, para dentro da área visível.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos>
      <SpeedDial {...args} direcao="left" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    await abrirPeloAcionamento(canvasElement, ROTULO);
  },
};

export const ParaDireita: Story = {
  name: 'Direção · para a direita',
  parameters: {
    docs: {
      description: {
        story:
          '`Direction: Right`. Espelho do anterior: aqui a dica vira para a esquerda do atalho, porque à direita ela sairia da tela.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos ancoragem="superior-esquerdo">
      <SpeedDial {...args} direcao="right" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    await abrirPeloAcionamento(canvasElement, ROTULO);
  },
};

export const Diagonal: Story = {
  name: 'Direção · diagonal (cima e à esquerda)',
  parameters: {
    docs: {
      description: {
        story:
          '`Direction: Up Left`, uma das quatro diagonais do arquivo. A diagonal mantém a mesma distância entre atalhos das direções retas, então a fila não fica mais apertada.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos>
      <SpeedDial {...args} direcao="up-left" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    await abrirPeloAcionamento(canvasElement, ROTULO);
  },
};

export const CirculoCompleto: Story = {
  name: 'Arco · círculo completo',
  parameters: {
    docs: {
      description: {
        story:
          '`Circular: True` com `Circular Type: Full Circle`. Exige folga nos quatro lados do acionamento, o que na prática só acontece no meio de um painel. Em canto de listagem, prefira o semicírculo ou o quarto de círculo.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos ancoragem="centro">
      <SpeedDial {...args} circular="full-circle" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    const { canvas } = await abrirPeloAcionamento(canvasElement, ROTULO);
    await expect(canvas.getAllByRole('menuitem')).toHaveLength(4);
  },
};

export const Semicirculo: Story = {
  name: 'Arco · semicírculo',
  parameters: {
    docs: {
      description: {
        story:
          '`Circular Type: Semi-Circle`. O arco de 180° abre para cima, para o acionamento apoiado no rodapé do painel.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos ancoragem="centro">
      <SpeedDial {...args} circular="semi-circle" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    await abrirPeloAcionamento(canvasElement, ROTULO);
  },
};

export const QuartoDeCirculo: Story = {
  name: 'Arco · quarto de círculo',
  parameters: {
    docs: {
      description: {
        story:
          '`Circular Type: Quarter-Circle`. O arco de 90° sobe e vai para a esquerda, que é o desenho do canto inferior direito no arquivo do Figma, o lugar habitual do leque numa listagem.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos>
      <SpeedDial {...args} circular="quarter-circle" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    await abrirPeloAcionamento(canvasElement, ROTULO);
  },
};

export const ComMascara: Story = {
  name: 'Estado · aberto com máscara',
  parameters: {
    docs: {
      description: {
        story:
          'A spec de botões diz que o estado aberto escurece o fundo ao redor. A máscara não é diálogo modal: ela apenas isola o leque e fecha ao clique. Aqui o Escape fecha ao fim, para não deixar a página de docs escurecida.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos>
      <SpeedDial {...args} direcao="up" mascara />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    const { canvas, acionador } = await abrirPeloAcionamento(canvasElement, ROTULO);

    await expect(canvas.getByRole('menu', { name: ROTULO })).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect(acionador).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Teclado: Story = {
  name: 'Teclado · setas, Escape e devolução do foco',
  parameters: {
    docs: {
      description: {
        story:
          'Enter abre o leque e leva o foco ao primeiro atalho. As setas andam pela lista e dão a volta nas pontas, Home e End vão às extremidades, e Escape fecha devolvendo o foco ao acionamento, sem deixar o servidor perdido na tela.',
      },
    },
  },
  render: (args) => (
    <PainelDeProcessos>
      <SpeedDial {...args} direcao="up" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const acionador = canvas.getByRole('button', { name: ROTULO });

    await userEvent.tab();
    await expect(acionador).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    const abrir = canvas.getByRole('menuitem', { name: 'Abrir processo 2025/0481' });
    const encaminhar = canvas.getByRole('menuitem', { name: 'Encaminhar à Secretaria de Saúde' });
    const diaria = canvas.getByRole('menuitem', { name: 'Lançar diária de viagem' });

    await expect(abrir).toHaveFocus();
    await expect(encaminhar).toHaveAttribute('tabindex', '-1');

    await userEvent.keyboard('{ArrowDown}');
    await expect(encaminhar).toHaveFocus();
    await expect(encaminhar).toHaveAttribute('tabindex', '0');

    await userEvent.keyboard('{End}');
    await expect(diaria).toHaveFocus();

    // Da última posição, seguir adiante volta ao primeiro atalho.
    await userEvent.keyboard('{ArrowDown}');
    await expect(abrir).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(acionador).toHaveFocus();
    await expect(acionador).toHaveAttribute('aria-expanded', 'false');
  },
};

export const AtalhoIndisponivel: Story = {
  name: 'Estado · atalho indisponível',
  parameters: {
    docs: {
      description: {
        story:
          'A diária só pode ser lançada depois do laudo anexado. O atalho continua focável e anunciado com `aria-disabled`, em vez de sumir do teclado, e não dispara nada nem fecha o leque.',
      },
    },
  },
  args: {
    acoes: ATALHOS.map((acao) => (acao.id === 'diaria' ? { ...acao, desabilitado: true } : acao)),
  },
  render: (args) => (
    <PainelDeProcessos>
      <SpeedDial {...args} direcao="up" />
    </PainelDeProcessos>
  ),
  play: async ({ canvasElement }) => {
    const { canvas, acionador } = await abrirPeloAcionamento(canvasElement, ROTULO);
    const diaria = canvas.getByRole('menuitem', { name: 'Lançar diária de viagem' });

    await expect(diaria).toHaveAttribute('aria-disabled', 'true');
    await expect(diaria).not.toBeDisabled();

    await userEvent.click(diaria);
    await expect(acionador).toHaveAttribute('aria-expanded', 'true');
  },
};

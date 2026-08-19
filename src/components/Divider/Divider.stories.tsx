import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { Divider } from './Divider';

const meta = {
  title: 'Layout/Divider',
  component: Divider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Divider. Figma CitieOne, página `6738:49734` (sets `divider` e `divider-content`). Variantes do arquivo: `Direction` (Horizontal · Vertical), `Type` (Solid · Dashed), `Content` (False · True) e `Align` (N/A · Left · Center · Right · Top · Bottom). Equivale ao `p-divider` do PrimeNG. Por padrão o divisor é decorativo e fica fora da árvore de acessibilidade; `semantico` o promove a `role="separator"`.',
      },
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

const Bloco = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      fontFamily: 'var(--citie-font-ui)',
      fontSize: 'var(--citie-font-size-body-md)',
      color: 'var(--citie-text-base)',
    }}
  >
    {children}
  </div>
);

const IconeProcesso = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <path d="M14 2v6h6" />
  </svg>
);

/* ---------- Type ---------- */

export const Solido: Story = {
  name: 'Traço · sólido',
  render: () => (
    <Bloco>
      <p>Processo 2025/0481 — Tratamento Fora do Domicílio</p>
      <Divider />
      <p>Solicitante: Maria de Fátima Souza</p>
    </Bloco>
  ),
};

export const Tracejado: Story = {
  name: 'Traço · tracejado',
  parameters: {
    docs: {
      description: {
        story:
          'O `Type=Dashed` do Figma. Usado quando a separação é provisória, como o corte entre lançamentos já conferidos e os que ainda serão importados na competência.',
      },
    },
  },
  render: () => (
    <Bloco>
      <p>Diárias conferidas — competência 08/2026</p>
      <Divider traco="dashed" />
      <p>Lançamentos aguardando importação</p>
    </Bloco>
  ),
};

/* ---------- Content e Align ---------- */

export const ConteudoTextoAoCentro: Story = {
  name: 'Conteúdo · texto ao centro',
  render: () => (
    <Bloco>
      <p>Encaminhamento emitido pela Secretaria de Saúde</p>
      <Divider>Autorização</Divider>
      <p>Autorizado por Dr. Carlos Andrade em 12/08/2026</p>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Autorização')).toBeVisible();
  },
};

export const ConteudoAlinhadoAEsquerda: Story = {
  name: 'Alinhamento · esquerda',
  render: () => (
    <Bloco>
      <p>Dados do paciente conferidos na recepção</p>
      <Divider alinhamento="left">Dados da viagem</Divider>
      <p>Origem: Imperatriz · Destino: São Luís</p>
    </Bloco>
  ),
};

export const ConteudoAlinhadoADireita: Story = {
  name: 'Alinhamento · direita',
  render: () => (
    <Bloco>
      <p>Ajuda de custo lançada pela Secretaria de Administração</p>
      <Divider alinhamento="right">Total: R$ 1.240,00</Divider>
      <p>Fechamento previsto para 30/08/2026</p>
    </Bloco>
  ),
};

export const ConteudoIconeETexto: Story = {
  name: 'Conteúdo · ícone e texto',
  parameters: {
    docs: {
      description: {
        story:
          'O `Type=Icon and Text` do `divider-content`. O ícone é decorativo (`aria-hidden`) porque o texto ao lado já nomeia a seção.',
      },
    },
  },
  render: () => (
    <Bloco>
      <p>Solicitação recebida em 03/08/2026</p>
      <Divider>
        <IconeProcesso />
        Documentos anexados
      </Divider>
      <p>Laudo médico, comprovante de residência e cartão SUS</p>
    </Bloco>
  ),
};

export const ConteudoBotao: Story = {
  name: 'Conteúdo · botão',
  parameters: {
    docs: {
      description: {
        story:
          'O `Type=Button` do `divider-content`. Divisor com ação **fica decorativo**: dentro de um `role="separator"` o conteúdo vira presentacional e o botão sumiria para o leitor de tela.',
      },
    },
  },
  render: () => (
    <Bloco>
      <p>3 acompanhantes cadastrados no processo 2025/0481</p>
      <Divider>
        <Button variant="text" size="small">
          Adicionar acompanhante
        </Button>
      </Divider>
      <p>Limite de 2 acompanhantes por deslocamento aéreo</p>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O botão continua alcançável porque o divisor é decorativo.
    await expect(canvas.getByRole('button', { name: 'Adicionar acompanhante' })).toBeVisible();
    await expect(canvas.queryByRole('separator')).toBeNull();
  },
};

/* ---------- Direction ---------- */

export const Vertical: Story = {
  name: 'Direção · vertical',
  render: () => (
    <Bloco>
      <div style={{ display: 'flex', alignItems: 'stretch' }}>
        <div>
          <strong>Origem</strong>
          <p>Imperatriz — MA</p>
        </div>
        <Divider direcao="vertical" />
        <div>
          <strong>Destino</strong>
          <p>São Luís — MA</p>
        </div>
      </div>
    </Bloco>
  ),
};

export const VerticalComConteudoAoCentro: Story = {
  name: 'Direção · vertical com conteúdo',
  render: () => (
    <Bloco>
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 140 }}>
        <div>
          <strong>Diária integral</strong>
          <p>R$ 320,00</p>
        </div>
        <Divider direcao="vertical" alinhamento="center">
          ou
        </Divider>
        <div>
          <strong>Meia diária</strong>
          <p>R$ 160,00</p>
        </div>
      </div>
    </Bloco>
  ),
};

export const VerticalTracejadoAoTopo: Story = {
  name: 'Direção · vertical tracejado no topo',
  render: () => (
    <Bloco>
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 160 }}>
        <div>
          <strong>Benefício vigente</strong>
          <p>Vale-alimentação</p>
        </div>
        <Divider direcao="vertical" traco="dashed" alinhamento="top">
          Renovação
        </Divider>
        <div>
          <strong>Vence em</strong>
          <p>30/09/2026</p>
        </div>
      </div>
    </Bloco>
  ),
};

/* ---------- Acessibilidade ---------- */

export const AcessibilidadeDecorativo: Story = {
  name: 'Acessibilidade · decorativo',
  parameters: {
    docs: {
      description: {
        story:
          'Padrão. A linha só reforça visualmente um agrupamento que o leitor de tela já percebe pelo cabeçalho da seção, então recebe `role="presentation"` e não é anunciada. Repetir "separador" a cada bloco só polui a leitura.',
      },
    },
  },
  render: () => (
    <Bloco>
      <h3>Identificação do servidor</h3>
      <p>Maria de Fátima Souza · matrícula 20.418-7</p>
      <Divider />
      <h3>Lotação</h3>
      <p>Secretaria de Estado da Saúde</p>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole('separator')).toBeNull();
  },
};

export const AcessibilidadeSemantico: Story = {
  name: 'Acessibilidade · semântico',
  parameters: {
    docs: {
      description: {
        story:
          'Quando a linha é o único sinal de que uma seção terminou e outra começou, `semantico` a promove a `role="separator"` com `aria-orientation`. O rótulo visível é repetido em `aria-label` porque conteúdo dentro de um `separator` é presentacional.',
      },
    },
  },
  render: () => (
    <Bloco>
      <p>Parecer técnico registrado em 12/08/2026</p>
      <Divider semantico>Decisão da junta médica</Divider>
      <p>Deferido com acompanhante para tratamento em São Luís</p>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const separador = within(canvasElement).getByRole('separator', {
      name: 'Decisão da junta médica',
    });
    await expect(separador).toHaveAttribute('aria-orientation', 'horizontal');
  },
};

export const AcessibilidadeSemanticoVertical: Story = {
  name: 'Acessibilidade · semântico vertical',
  render: () => (
    <Bloco>
      <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 120 }}>
        <div>
          <h3>Solicitações do dia</h3>
          <p>18 processos em análise</p>
        </div>
        <Divider direcao="vertical" semantico rotuloAcessivel="Fim das solicitações do dia" />
        <div>
          <h3>Encerrados</h3>
          <p>7 processos concluídos</p>
        </div>
      </div>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const separador = within(canvasElement).getByRole('separator', {
      name: 'Fim das solicitações do dia',
    });
    await expect(separador).toHaveAttribute('aria-orientation', 'vertical');
  },
};

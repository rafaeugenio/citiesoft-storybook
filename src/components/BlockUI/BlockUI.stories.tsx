import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../Button/Button';
import { BlockUI } from './BlockUI';

/** Painel de competência usado como conteúdo bloqueável nas stories. */
function PainelDeCompetencia() {
  return (
    <div
      style={{
        border: '1px solid var(--citie-border-default)',
        borderRadius: 'var(--citie-radius-lg)',
        overflow: 'hidden',
        fontFamily: 'var(--citie-font-ui)',
        color: 'var(--citie-text-base)',
        background: 'var(--citie-background-surface)',
      }}
    >
      <div
        style={{
          padding: '12px 16px',
          borderBottom: '1px solid var(--citie-border-default)',
          fontWeight: 500,
          color: 'var(--citie-text-primary)',
        }}
      >
        Competência 03/2025 · Secretaria de Estado da Saúde
      </div>
      <div style={{ display: 'grid', gap: 12, padding: 16 }}>
        <p style={{ margin: 0, fontSize: 'var(--citie-font-size-body-md)' }}>
          312 lançamentos conferidos, 4 aguardando parecer. Responsável pela competência:
          Maria de Fátima Souza.
        </p>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary">Encerrar competência</Button>
          <Button variant="secondary">Conferir lançamentos</Button>
        </div>
      </div>
    </div>
  );
}

const meta = {
  title: 'Feedback/BlockUI',
  component: BlockUI,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Máscara que bloqueia uma região ou a tela inteira enquanto uma operação acontece. Página `6738:55108` do Figma CitieOne, equivalente ao `p-blockUI` do PrimeNG. O Figma traz um único desenho, sem eixos de variante: máscara escura cobrindo o container inteiro, em Light e Dark. Aqui ela sempre carrega o indicador de `Feedback/Progresso` e o conteúdo coberto recebe `inert`, saindo da ordem de tabulação e da árvore de acessibilidade.',
      },
    },
  },
  args: {
    bloqueado: false,
    mensagem: 'Processando o fechamento da competência de março de 2025',
    children: <PainelDeCompetencia />,
  },
} satisfies Meta<typeof BlockUI>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desbloqueado: Story = {
  name: 'Estado · liberado',
  render: (args) => (
    <BlockUI {...args}>
      <PainelDeCompetencia />
    </BlockUI>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Conferir lançamentos' });

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Encerrar competência' })).toHaveFocus();
    await expect(botao).toBeEnabled();
  },
};

export const BloqueadoNaRegiao: Story = {
  name: 'Estado · região bloqueada',
  args: {
    bloqueado: true,
  },
  render: (args) => (
    <BlockUI {...args}>
      <PainelDeCompetencia />
    </BlockUI>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'A mensagem nomeia o artefato: quem espera precisa saber que competência está sendo fechada. Bloqueio sem mensagem, ou com "Aguarde" solto, não passa na revisão.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regiao = canvasElement.querySelector('.citie-blockui');
    const conteudo = canvasElement.querySelector('.citie-blockui__conteudo');

    await expect(regiao).toHaveAttribute('aria-busy', 'true');
    // Cobrir não basta: o conteúdo sai da tabulação e da árvore de acessibilidade.
    await expect(conteudo).toHaveAttribute('inert');
    await expect(
      canvas.getByRole('status', {
        name: 'Processando o fechamento da competência de março de 2025',
      }),
    ).toBeInTheDocument();
  },
};

export const ComProgresso: Story = {
  name: 'Variante · progresso conhecido',
  args: {
    bloqueado: true,
    rotulo: 'Importando lote de lançamentos',
    valor: 43,
    mensagem: '52 de 120 lançamentos importados',
  },
  render: (args) => (
    <BlockUI {...args}>
      <PainelDeCompetencia />
    </BlockUI>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Quando o sistema conhece a duração, a máscara troca o spinner pela barra de `Feedback/Progresso`, que já expõe `role="progressbar"` com o valor atual.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const barra = within(canvasElement).getByRole('progressbar', {
      name: 'Importando lote de lançamentos',
    });
    await expect(barra).toHaveAttribute('aria-valuenow', '43');
  },
};

export const TelaInteira: Story = {
  name: 'Escopo · tela inteira',
  parameters: {
    docs: {
      description: {
        story:
          'A máscara de tela cobre a viewport, mas a inércia continua valendo só para o conteúdo envolvido: nesse escopo, envolva a casca da aplicação. Começa liberada, com gatilho, para não cobrir a página de documentação.',
      },
    },
  },
  render: (args) => {
    function Demonstracao() {
      const [bloqueado, setBloqueado] = useState(false);

      return (
        <div style={{ display: 'grid', gap: 16 }}>
          <Button variant="primary" onClick={() => setBloqueado(true)}>
            Importar lote de lançamentos
          </Button>

          <BlockUI
            {...args}
            bloqueado={bloqueado}
            escopo="tela"
            mensagem="Importando o lote 2025/0481 para a competência de março"
          >
            <PainelDeCompetencia />
          </BlockUI>

          {bloqueado ? (
            <Button variant="secondary" onClick={() => setBloqueado(false)}>
              Concluir a importação
            </Button>
          ) : null}
        </div>
      );
    }

    return <Demonstracao />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Importar lote de lançamentos' }));
    await expect(canvasElement.querySelector('.citie-blockui__mascara--tela')).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Concluir a importação' }));
    await expect(canvasElement.querySelector('.citie-blockui__mascara--tela')).toBeNull();
  },
};

export const FocoDevolvido: Story = {
  name: 'Comportamento · foco sai e volta',
  parameters: {
    docs: {
      description: {
        story:
          'Ao bloquear, o foco que estava dentro da região vai para a máscara em vez de cair no início da página. Ao liberar, volta para o mesmo controle.',
      },
    },
  },
  render: (args) => {
    function Demonstracao() {
      const [bloqueado, setBloqueado] = useState(false);

      return (
        <div style={{ display: 'grid', gap: 16 }}>
          <BlockUI {...args} bloqueado={bloqueado}>
            <div style={{ display: 'grid', gap: 12 }}>
              <PainelDeCompetencia />
              <Button variant="primary" onClick={() => setBloqueado(true)}>
                Encerrar a competência 03/2025
              </Button>
            </div>
          </BlockUI>

          <Button variant="secondary" onClick={() => setBloqueado(false)}>
            Liberar o painel
          </Button>
        </div>
      );
    }

    return <Demonstracao />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Encerrar a competência 03/2025' });

    await userEvent.click(gatilho);
    await expect(canvasElement.querySelector('.citie-blockui__mascara')).toHaveFocus();

    await userEvent.click(canvas.getByRole('button', { name: 'Liberar o painel' }));
    await expect(gatilho).toHaveFocus();
  },
};

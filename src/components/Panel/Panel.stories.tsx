import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Panel } from './Panel';
import { Button } from '../Button/Button';

const meta = {
  title: 'Layout/Panel',
  component: Panel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Panel. Figma CitieOne, página `6738:49736` (component set `panel`). Variantes do arquivo: `Toggleable` (False/True), `Toggle Status` (Expanded/Collapsed/N/A), `Show Footer` (False/True) e `Custom Icon` (False/True), esta última mapeada para a área de ações do cabeçalho. Equivalente PrimeNG: `p-panel`. Agrupa **um** bloco de conteúdo com título; para várias seções empilhadas use o `Accordion` em `Navegação/Tabs`.',
      },
    },
  },
  args: {
    titulo: 'Dados do processo 2025/0481',
    children:
      'Solicitante: Maria de Fátima Souza · Matrícula 00123456 · Secretaria Municipal de Saúde. Abertura em 04/03/2025, com prazo de análise até 18/03/2025.',
  },
} satisfies Meta<typeof Panel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Variante · estático',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Dados do processo 2025/0481' })).toBeVisible();
    // Toggleable = False: nenhum gatilho no cabeçalho.
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

export const ColapsavelAberto: Story = {
  name: 'Colapsável · expandido',
  args: {
    colapsavel: true,
    abertoInicial: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', {
      name: 'Recolher painel Dados do processo 2025/0481',
    });

    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');

    const corpo = canvas.getByRole('region', { name: 'Dados do processo 2025/0481' });
    await expect(gatilho).toHaveAttribute('aria-controls', corpo.id);

    await userEvent.click(gatilho);
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('region')).toBeNull();
  },
};

export const ColapsavelRecolhido: Story = {
  name: 'Colapsável · recolhido',
  args: {
    titulo: 'Histórico de tramitação',
    colapsavel: true,
    abertoInicial: false,
    children:
      '12/03/2025 · Encaminhado à Regulação. 08/03/2025 · Parecer técnico favorável. 04/03/2025 · Autuação do processo.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Expandir painel Histórico de tramitação' });

    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    // O corpo continua no DOM com `hidden`, que o tira da árvore de
    // acessibilidade e preserva o estado interno. A asserção é de visibilidade,
    // não de presença.
    await expect(canvas.getByText(/Encaminhado à Regulação/)).not.toBeVisible();

    await userEvent.click(gatilho);
    await expect(canvas.getByRole('region', { name: 'Histórico de tramitação' })).toBeVisible();
  },
};

export const ComRodape: Story = {
  name: 'Variante · com rodapé',
  args: {
    titulo: 'Diária de TFD 2025/0481',
    children:
      'Destino: São Luís/MA · Deslocamento de 12/04/2025 a 15/04/2025 · Acompanhante autorizado.',
    rodape: (
      <>
        4 diárias · valor unitário R$ 148,00 · total R$ 592,00
      </>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/total R\$ 592,00/)).toBeVisible();
  },
};

export const ComAcoes: Story = {
  name: 'Variante · ações no cabeçalho',
  args: {
    titulo: 'Benefício de vale-alimentação',
    colapsavel: true,
    children:
      'Concedido em 01/02/2025 · Renovação prevista para 01/02/2026 · Competência 03/2025 lançada.',
    acoes: (
      <Button
        variant="text"
        size="small"
        iconOnly
        aria-label="Editar benefício de vale-alimentação"
        icon={
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M9.5 1.9 12.1 4.5 4.6 12H2v-2.6z"
              stroke="currentColor"
              strokeWidth="1.3"
              strokeLinejoin="round"
            />
          </svg>
        }
      />
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A ação do cabeçalho e o gatilho de colapsar convivem sem colidir de nome.
    await expect(
      canvas.getByRole('button', { name: 'Editar benefício de vale-alimentação' }),
    ).toBeVisible();
    await expect(
      canvas.getByRole('button', { name: 'Recolher painel Benefício de vale-alimentação' }),
    ).toBeVisible();
  },
};

export const ComRodapeEAcoes: Story = {
  name: 'Variante · completo',
  args: {
    titulo: 'Prestação de contas · competência 03/2025',
    colapsavel: true,
    children:
      'Servidor: Maria de Fátima Souza · Secretaria Municipal de Saúde · 3 lançamentos pendentes de comprovante.',
    rodape: <Button size="small">Enviar comprovantes</Button>,
    acoes: (
      <Button variant="text" size="small">
        Ver histórico
      </Button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Enviar comprovantes' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Ver histórico' })).toBeVisible();
  },
};

export const Controlado: Story = {
  name: 'Estado · controlado pelo pai',
  args: {
    colapsavel: true,
  },
  render: (args) => {
    const [aberto, setAberto] = useState(false);
    return (
      <div style={{ display: 'grid', gap: '12px' }}>
        <Button size="small" variant="secondary" onClick={() => setAberto((atual) => !atual)}>
          {aberto ? 'Recolher pelo pai' : 'Expandir pelo pai'}
        </Button>
        <Panel {...args} aberto={aberto} onAlternar={setAberto} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const externo = canvas.getByRole('button', { name: 'Expandir pelo pai' });

    await userEvent.click(externo);
    await expect(canvas.getByRole('region', { name: 'Dados do processo 2025/0481' })).toBeVisible();

    // Fechar pelo gatilho interno mantém o pai em sincronia.
    await userEvent.click(
      canvas.getByRole('button', { name: 'Recolher painel Dados do processo 2025/0481' }),
    );
    await expect(canvas.getByRole('button', { name: 'Expandir pelo pai' })).toBeVisible();
  },
};

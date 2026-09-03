import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ToggleGroup, type ToggleGroupProps } from './ToggleGroup';

function IconeNegrito() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M7 5h6a3.5 3.5 0 0 1 0 7H7zM7 12h7a3.5 3.5 0 0 1 0 7H7z" strokeLinejoin="round" />
    </svg>
  );
}
function IconeItalico() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M10 5h7M7 19h7M14 5 10 19" strokeLinecap="round" />
    </svg>
  );
}
function IconeSublinhado() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <path d="M6 4v7a6 6 0 0 0 12 0V4M4 20h16" strokeLinecap="round" />
    </svg>
  );
}

const ITENS_FORMATACAO = [
  { valor: 'negrito', rotulo: 'Negrito', icone: <IconeNegrito /> },
  { valor: 'italico', rotulo: 'Itálico', icone: <IconeItalico /> },
  { valor: 'sublinhado', rotulo: 'Sublinhado', icone: <IconeSublinhado /> },
];

const ITENS_PERIODO = [
  { valor: 'dia', rotulo: 'Dia' },
  { valor: 'semana', rotulo: 'Semana' },
  { valor: 'mes', rotulo: 'Mês' },
];

function ExemploUnica(props: Partial<ToggleGroupProps> & { rotulo: string }) {
  const [valor, setValor] = useState<string | null>('semana');
  return (
    <ToggleGroup
      rotulo={props.rotulo}
      itens={props.itens ?? ITENS_PERIODO}
      pele={props.pele}
      tamanho={props.tamanho}
      tipo="unica"
      valor={valor}
      onChange={setValor}
    />
  );
}

function ExemploMultipla(props: Partial<ToggleGroupProps> & { rotulo: string }) {
  const [valor, setValor] = useState<string[]>(['negrito']);
  return (
    <ToggleGroup
      rotulo={props.rotulo}
      itens={props.itens ?? ITENS_FORMATACAO}
      pele={props.pele}
      tamanho={props.tamanho}
      tipo="multipla"
      valor={valor}
      onChange={setValor}
    />
  );
}

const meta = {
  title: 'Moléculas/Escolha/ToggleGroup',
  component: ToggleGroup,
  tags: ['autodocs'],
  // `ToggleGroupProps` é união discriminada (`tipo="unica"` vs `"multipla"`),
  // sem ramo opcional que cubra os dois: toda story abaixo usa `render` com
  // estado próprio, então este `args` só existe para satisfazer o tipo de
  // `StoryObj<typeof meta>`, nunca é lido de fato.
  args: {
    rotulo: 'Período do painel',
    itens: ITENS_PERIODO,
    tipo: 'unica',
    valor: null,
    onChange: () => {},
  },
  parameters: {
    docs: {
      description: {
        component: [
          'ToggleGroup. Segmentos de botão emendados no raio de junção do `ButtonGroup` (Lote 1), com a pele de seleção do kit (`accent-forte`, Lote 0). Equivalente PrimeNG: `p-selectbutton`.',
          '',
          '**Quando usar `tipo="unica"`:** escolha exclusiva e visível entre poucas opções (2 a 5), como um `radiogroup` compacto: período do painel, alinhamento de texto, densidade de tabela.',
          '**Quando usar `tipo="multipla"`:** alternâncias independentes que cabem juntas, como formatação de texto (negrito, itálico, sublinhado podem coexistir).',
          '',
          '**Quando não usar:** mais de 5 opções ou rótulo longo, onde `Moléculas/Campos/Select` cabe melhor sem competir por largura.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof ToggleGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SelecaoUnica: Story = {
  name: 'Tipo · seleção única',
  render: () => <ExemploUnica rotulo="Período do painel" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grupo = canvas.getByRole('radiogroup', { name: 'Período do painel' });
    await expect(grupo).toBeVisible();

    const semana = canvas.getByRole('radio', { name: 'Semana' });
    await expect(semana).toHaveAttribute('aria-checked', 'true');

    const mes = canvas.getByRole('radio', { name: 'Mês' });
    await userEvent.click(mes);
    await expect(mes).toHaveAttribute('aria-checked', 'true');
    await expect(semana).toHaveAttribute('aria-checked', 'false');
  },
};

export const SelecaoMultipla: Story = {
  name: 'Tipo · seleção múltipla',
  render: () => <ExemploMultipla rotulo="Formatação do texto" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grupo = canvas.getByRole('group', { name: 'Formatação do texto' });
    await expect(grupo).toBeVisible();

    const negrito = canvas.getByRole('button', { name: 'Negrito' });
    await expect(negrito).toHaveAttribute('aria-pressed', 'true');

    const italico = canvas.getByRole('button', { name: 'Itálico' });
    await expect(italico).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(italico);
    await expect(italico).toHaveAttribute('aria-pressed', 'true');
    // Independente: negrito continua marcado depois de ligar itálico.
    await expect(negrito).toHaveAttribute('aria-pressed', 'true');
  },
};

export const NavegacaoPorSetas: Story = {
  name: 'Interação · navegação por setas',
  render: () => <ExemploUnica rotulo="Período do painel" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dia = canvas.getByRole('radio', { name: 'Dia' });
    const semana = canvas.getByRole('radio', { name: 'Semana' });
    const mes = canvas.getByRole('radio', { name: 'Mês' });

    // Roving tabindex: só o selecionado (Semana) está no fluxo de tab.
    await expect(dia).toHaveAttribute('tabindex', '-1');
    await expect(semana).toHaveAttribute('tabindex', '0');
    await expect(mes).toHaveAttribute('tabindex', '-1');

    semana.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(mes).toHaveFocus();
    await expect(mes).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{ArrowRight}');
    await expect(dia).toHaveFocus();
    await expect(dia).toHaveAttribute('aria-checked', 'true');
  },
};

export const PeleGhost: Story = {
  name: 'Pele · ghost',
  render: () => <ExemploMultipla rotulo="Formatação do texto" pele="ghost" />,
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('.citie-toggle-group__item') as HTMLElement;
    await expect(getComputedStyle(item).borderStyle).toBe('none');
  },
};

export const Tamanhos: Story = {
  name: 'Anatomia · tamanhos',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'flex-start' }}>
      <ExemploUnica rotulo="Período, default" tamanho="default" />
      <ExemploUnica rotulo="Período, small" tamanho="small" />
      <ExemploUnica rotulo="Período, mini" tamanho="mini" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const alturaEsperada = (token: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(token).trim();

    const [grupoDefault, grupoSmall, grupoMini] = canvasElement.querySelectorAll('.citie-toggle-group');

    await expect(
      getComputedStyle(grupoDefault.querySelector('button')!).height,
    ).toBe(alturaEsperada('--citie-control-height-normal'));
    await expect(
      getComputedStyle(grupoSmall.querySelector('button')!).height,
    ).toBe(alturaEsperada('--citie-control-height-small'));
    await expect(
      getComputedStyle(grupoMini.querySelector('button')!).height,
    ).toBe(alturaEsperada('--citie-control-height-mini'));
  },
};

export const Desabilitado: Story = {
  name: 'Estado · item desabilitado',
  render: () => (
    <ExemploUnica
      rotulo="Período do painel"
      itens={[
        { valor: 'dia', rotulo: 'Dia' },
        { valor: 'semana', rotulo: 'Semana' },
        { valor: 'mes', rotulo: 'Mês', desabilitado: true },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const mes = canvas.getByRole('radio', { name: 'Mês' });
    await expect(mes).toBeDisabled();
  },
};

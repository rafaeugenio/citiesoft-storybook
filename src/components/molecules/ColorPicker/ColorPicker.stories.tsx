import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ColorPicker, PALETA_CITIESOFT, type OpcaoDeCor } from './ColorPicker';

const meta = {
  title: 'Moléculas/Campos/ColorPicker',
  component: ColorPicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Seleção de cor por paleta nomeada mais código hexadecimal. Origem: Figma CitieOne, página ❖ ColorPicker (Type: Inline | Overlay, Overlay: N/A | False | True, State: Idle | Focus). Equivalente PrimeNG: `p-colorPicker`.',
          '',
          '**Decisão de escopo.** O kit CitieOne desenha um seletor HSV: área contínua de saturação mais faixa de matiz. Essa área não tem valor discreto que faça sentido anunciar, e operá-la por teclado significa dois sliders cujo valor ("saturação 137") não diz nada a quem não enxerga o resultado. Aqui a seleção é uma paleta de cores da marca Citiesoft em `radiogroup`, com o campo hexadecimal como caminho acessível principal: tudo que se alcança pelo desenho se alcança pelo texto. Quem precisa de uma cor fora da paleta digita o hexadecimal.',
          '',
          '**Quando não usar.** Em sistema B2G, cor livre quase nunca é o controle certo. Se a cor carrega significado (situação do processo, tipo de benefício, prioridade), use um `Select` de opções nomeadas com cor associada, porque aí a paleta é regra de negócio e não preferência. ColorPicker só se presta a personalização visual sem semântica: cor de etiqueta pessoal, identificação de calendário, marcação de mapa. E cor nunca pode ser o único indicador; acompanhe sempre de rótulo.',
        ].join('\n'),
      },
    },
  },
  args: { label: 'Cor da etiqueta' },
} satisfies Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Inline: Story = {
  name: 'Type · inline',
  args: { label: 'Cor da etiqueta do processo 2025/0481' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const paleta = canvas.getByRole('radiogroup', {
      name: 'Paleta de cores para Cor da etiqueta do processo 2025/0481',
    });
    await expect(within(paleta).getAllByRole('radio')).toHaveLength(PALETA_CITIESOFT.length);

    // O campo hexadecimal é o caminho acessível principal, sempre presente.
    await expect(canvas.getByLabelText('Código hexadecimal')).toHaveValue('#1261E4');
    await expect(canvas.getByRole('radio', { name: 'Citie Blue, #1261E4' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  },
};

export const OverlayFechado: Story = {
  name: 'Type · overlay (fechado)',
  args: {
    tipo: 'overlay',
    label: 'Cor do marcador no mapa de visitas',
    valorInicial: '#16A34A',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O nome acessível do gatilho carrega o valor: cor sozinha não comunica.
    const gatilho = canvas.getByRole('button', {
      name: 'Cor do marcador no mapa de visitas: Verde deferido, #16A34A',
    });
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('dialog')).not.toBeInTheDocument();
  },
};

export const OverlayAberto: Story = {
  name: 'Type · overlay (aberto)',
  args: { tipo: 'overlay', label: 'Cor do marcador no mapa de visitas' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: /Cor do marcador/ });

    await userEvent.click(gatilho);

    const painel = await canvas.findByRole('dialog', {
      name: 'Selecionar Cor do marcador no mapa de visitas',
    });
    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');
    // Ao abrir, o foco vai para o campo de texto, que é o controle principal.
    await waitFor(() => expect(within(painel).getByLabelText('Código hexadecimal')).toHaveFocus());
  },
};

export const FecharComEscape: Story = {
  name: 'Comportamento · Escape devolve o foco ao gatilho',
  args: { tipo: 'overlay', label: 'Cor da agenda da secretaria' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: /Cor da agenda/ });

    await userEvent.click(gatilho);
    await canvas.findByRole('dialog');

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(canvas.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(gatilho).toHaveFocus();
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
  },
};

export const EntradaHexadecimal: Story = {
  name: 'Entrada · código hexadecimal',
  args: { label: 'Cor da etiqueta de diária' },
  parameters: {
    docs: {
      description: {
        story:
          'Digitar e confirmar com Enter grava a cor mesmo quando ela não está na paleta. A forma curta (`#18e`) e o valor sem `#` são normalizados para seis dígitos.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Código hexadecimal');

    await userEvent.clear(campo);
    await userEvent.type(campo, '7c3aed{Enter}');

    await waitFor(() => expect(campo).toHaveValue('#7C3AED'));
    // Cor fora da paleta: nenhuma amostra fica marcada.
    await expect(canvas.queryByRole('radio', { checked: true })).not.toBeInTheDocument();
  },
};

export const HexadecimalInvalido: Story = {
  name: 'Estado · hexadecimal inválido',
  args: { label: 'Cor da etiqueta de benefício' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Código hexadecimal');

    await userEvent.clear(campo);
    await userEvent.type(campo, 'azul do estado{Enter}');

    await waitFor(() => expect(campo).toHaveAttribute('aria-invalid', 'true'));
    await expect(canvas.getByText('Informe um hexadecimal válido, como #1261E4.')).toBeVisible();
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação por teclado na paleta',
  args: { label: 'Cor da etiqueta do processo 2025/0481' },
  parameters: {
    docs: {
      description: {
        story:
          'A paleta é um `radiogroup` com tabulação única: as setas andam entre as amostras e já selecionam, Home e End vão às pontas.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    canvas.getByRole('radio', { name: 'Citie Blue, #1261E4' }).focus();
    await userEvent.keyboard('{ArrowRight}');

    const segunda = canvas.getByRole('radio', { name: 'Azul escuro, #0E4DB8' });
    await expect(segunda).toHaveFocus();
    await expect(segunda).toHaveAttribute('aria-checked', 'true');

    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('radio', { name: 'Grafite, #202020' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(canvas.getByLabelText('Código hexadecimal')).toHaveValue('#202020');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { tipo: 'overlay', label: 'Cor da etiqueta', desabilitado: true },
  play: async ({ canvasElement }) => {
    const gatilho = within(canvasElement).getByRole('button', { name: /Cor da etiqueta/ });

    await expect(gatilho).toHaveAttribute('aria-disabled', 'true');
    // `aria-disabled` em vez de `disabled`: o gatilho continua alcançável pelo teclado.
    await userEvent.click(gatilho);
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
  },
};

/**
 * Lê os tokens de marca do `:root` em tempo de execução e monta a paleta com o
 * valor efetivo do tema atual, em vez de repetir hexadecimais na story.
 */
const TOKENS_DA_MARCA: { nome: string; token: string }[] = [
  { nome: 'Citie Blue', token: '--citie-brand-primary' },
  { nome: 'Azul escuro', token: '--citie-brand-hover' },
  { nome: 'Azul profundo', token: '--citie-brand-active' },
  { nome: 'Informação', token: '--citie-info-emphasis' },
  { nome: 'Sucesso', token: '--citie-success-emphasis' },
  { nome: 'Aviso', token: '--citie-warning-emphasis' },
  { nome: 'Erro', token: '--citie-danger-emphasis' },
  { nome: 'Grafite', token: '--citie-text-primary' },
];

function PaletaDosTokens() {
  const [paleta, setPaleta] = useState<OpcaoDeCor[] | null>(null);

  useEffect(() => {
    const estilo = getComputedStyle(document.documentElement);
    setPaleta(
      TOKENS_DA_MARCA.map(({ nome, token }) => ({
        nome,
        token,
        valor: estilo.getPropertyValue(token).trim().toUpperCase(),
      })),
    );
  }, []);

  if (!paleta) return null;

  return (
    <ColorPicker
      label="Cor da etiqueta da secretaria"
      paleta={paleta}
      valorInicial={paleta[0].valor}
      descricao="Cores da marca Citiesoft, lidas dos tokens do design system."
    />
  );
}

export const PaletaDaMarca: Story = {
  name: 'Paleta · marca Citiesoft (tokens)',
  render: () => <PaletaDosTokens />,
  parameters: {
    docs: {
      description: {
        story:
          'Cada amostra é pintada por `var(--citie-*)` e o valor gravado vem do mesmo token, lido do `:root`. Trocar o tema troca a amostra sem tocar no componente.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(await canvas.findByRole('radio', { name: 'Citie Blue, #1261E4' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
    await expect(canvas.getByRole('radio', { name: 'Sucesso, #16A34A' })).toBeInTheDocument();
  },
};

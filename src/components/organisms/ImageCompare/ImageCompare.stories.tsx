import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ImageCompare } from './ImageCompare';

/**
 * As cenas são SVG embutido em data URI: a suíte roda offline e não pode
 * depender de nenhuma requisição de rede para a imagem aparecer.
 */
const paraUri = (svg: string) => `data:image/svg+xml,${encodeURIComponent(svg)}`;

const cena = (miolo: string) =>
  paraUri(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" width="600" height="400">${miolo}</svg>`,
  );

const ruaSemPavimento = cena(`
  <rect width="600" height="400" fill="#9aa3ad"/>
  <rect y="215" width="600" height="185" fill="#8d7458"/>
  <path d="M0 215h600v18H0z" fill="#7d6449"/>
  <ellipse cx="150" cy="330" rx="70" ry="22" fill="#6b543d"/>
  <ellipse cx="150" cy="326" rx="52" ry="14" fill="#4f3f2e"/>
  <ellipse cx="400" cy="290" rx="48" ry="15" fill="#6b543d"/>
  <ellipse cx="400" cy="287" rx="34" ry="9" fill="#4f3f2e"/>
  <rect x="60" y="120" width="120" height="95" fill="#b9b0a4"/>
  <rect x="95" y="160" width="34" height="55" fill="#6d6459"/>
  <rect x="210" y="140" width="140" height="75" fill="#a9a094"/>
  <rect x="255" y="172" width="40" height="43" fill="#6d6459"/>
  <rect x="470" y="90" width="14" height="128" fill="#5c5c5c" transform="rotate(6 477 154)"/>
  <rect x="440" y="86" width="70" height="8" fill="#5c5c5c" transform="rotate(6 475 90)"/>
`);

const ruaPavimentada = cena(`
  <rect width="600" height="400" fill="#bcd4ea"/>
  <circle cx="500" cy="70" r="34" fill="#f3e7c3"/>
  <rect y="215" width="600" height="185" fill="#4a4f55"/>
  <rect y="215" width="600" height="16" fill="#d8d4cd"/>
  <g fill="#f2f2ef">
    <rect x="30" y="300" width="70" height="8"/>
    <rect x="150" y="300" width="70" height="8"/>
    <rect x="270" y="300" width="70" height="8"/>
    <rect x="390" y="300" width="70" height="8"/>
    <rect x="510" y="300" width="70" height="8"/>
  </g>
  <rect x="60" y="120" width="120" height="95" fill="#eceae5"/>
  <rect x="95" y="160" width="34" height="55" fill="#4d6b8a"/>
  <rect x="210" y="140" width="140" height="75" fill="#e3ded6"/>
  <rect x="255" y="172" width="40" height="43" fill="#4d6b8a"/>
  <rect x="472" y="90" width="12" height="128" fill="#5c5c5c"/>
  <rect x="446" y="86" width="66" height="8" fill="#5c5c5c"/>
  <circle cx="452" cy="98" r="9" fill="#f6e39a"/>
  <circle cx="390" cy="175" r="42" fill="#3f7a48"/>
  <rect x="384" y="175" width="12" height="45" fill="#6b4b2e"/>
`);

const salaDeVacinaAntes = cena(`
  <rect width="600" height="400" fill="#cfc9bd"/>
  <path d="M0 0h600v300H0z" fill="#d9d3c6"/>
  <path d="M40 0c40 60 10 120 60 190 30 42 6 70-20 110H0V0z" fill="#b7ad99" opacity="0.85"/>
  <path d="M430 0c-20 70 20 110 0 170h70V0z" fill="#b7ad99" opacity="0.7"/>
  <rect y="300" width="600" height="100" fill="#9d9484"/>
  <rect x="180" y="90" width="150" height="110" fill="#8fa2ad"/>
  <rect x="180" y="90" width="150" height="110" fill="none" stroke="#6f6555" stroke-width="6"/>
  <path d="M180 90l150 110M330 90L180 200" stroke="#5f5648" stroke-width="4"/>
  <rect x="390" y="215" width="150" height="85" fill="#a89c86"/>
  <rect x="390" y="215" width="150" height="12" fill="#8d8270"/>
  <path d="M60 320h480" stroke="#7e7666" stroke-width="6" stroke-dasharray="26 18"/>
`);

const salaDeVacinaDepois = cena(`
  <rect width="600" height="400" fill="#f4f6f8"/>
  <path d="M0 0h600v300H0z" fill="#ffffff"/>
  <rect y="300" width="600" height="100" fill="#dfe4ea"/>
  <rect y="286" width="600" height="16" fill="#c7ced7"/>
  <rect x="180" y="90" width="150" height="110" fill="#cbe4f7"/>
  <rect x="180" y="90" width="150" height="110" fill="none" stroke="#8fa6b8" stroke-width="6"/>
  <path d="M255 90v110M180 145h150" stroke="#8fa6b8" stroke-width="4"/>
  <rect x="390" y="205" width="150" height="95" fill="#e7ecf2"/>
  <rect x="390" y="205" width="150" height="12" fill="#1261e4"/>
  <rect x="404" y="228" width="122" height="10" fill="#c3ccd8"/>
  <rect x="404" y="248" width="90" height="10" fill="#c3ccd8"/>
  <rect x="60" y="150" width="90" height="150" fill="#eef2f6"/>
  <path d="M60 300l90-60v60z" fill="#1261e4" opacity="0.18"/>
  <rect x="60" y="150" width="90" height="10" fill="#1261e4"/>
`);

const obra = {
  antes: {
    src: ruaSemPavimento,
    alt: 'Rua Antônio Lopes antes da obra: leito de terra batida com buracos alagados, meio-fio inexistente e poste de iluminação inclinado.',
    rotulo: 'Antes da obra',
  },
  depois: {
    src: ruaPavimentada,
    alt: 'Rua Antônio Lopes depois da obra: pista asfaltada com sinalização central, calçada elevada, arborização e poste de iluminação novo.',
    rotulo: 'Depois da obra',
  },
};

const meta = {
  title: 'Organismos/Mídia/ImageCompare',
  component: ImageCompare,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Compara duas imagens do mesmo enquadramento com um divisor deslizante. Origem: Figma CitieOne, página ❖ ImageCompare, cuja única parte com eixos é `imagecompare-handle` (State Idle | Hover, Focus False | True) — aqui traduzidos em `:hover` e `:focus-visible`. Cores e medidas seguem os tokens Citiesoft do vault, não o azul padrão do PrimeOne. Equivalente PrimeNG: `p-imagecompare`. A alça é um `role="slider"` focável: setas e Page Up/Down movem, Home e End vão aos extremos, e o arraste é apenas um atalho de ponteiro.',
          '',
          '**Quando usar:** duas fotografias do mesmo ponto, no mesmo enquadramento e na mesma escala,',
          'separadas por um evento que o processo precisa comprovar: a rua antes e depois da pavimentação,',
          'a sala antes e depois da reforma.',
          '',
          '**Quando não usar:** imagens de enquadramento, ângulo ou escala diferentes, porque o divisor',
          'promete continuidade entre os dois lados e o servidor lê como mudança da obra o que é só',
          'mudança de posição da câmera (use `Galleria`, que mostra cada foto inteira com legenda e data);',
          'mais de duas imagens, já que o componente só admite `antes` e `depois`; o momento em que a',
          'pessoa precisa ver as duas por completo lado a lado para descrever cada uma no parecer, pois',
          'aqui um lado sempre está parcialmente coberto; diferença que está no dado e não no pixel, como',
          'valor empenhado contra valor pago (use `Table`); e qualquer conteúdo destinado à impressão ou',
          'ao PDF do processo, onde o divisor não existe e a captura congela em uma posição só. A alça',
          'exige apontar e arrastar ou usar as setas: em documento que precisa valer como prova, mantenha',
          'as duas imagens também disponíveis inteiras.',
        ].join('\n'),
      },
    },
  },
  args: {
    antes: obra.antes,
    depois: obra.depois,
    legenda: 'Processo 2025/0481 · Pavimentação da Rua Antônio Lopes, vistoria de recebimento.',
  },
} satisfies Meta<typeof ImageCompare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Estado · divisor ao meio',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alca = canvas.getByRole('slider', { name: 'Posição da comparação' });

    await expect(alca).toHaveAttribute('aria-valuenow', '50');
    await expect(alca).toHaveAttribute('aria-valuemin', '0');
    await expect(alca).toHaveAttribute('aria-valuemax', '100');
    await expect(alca).toHaveAttribute('aria-orientation', 'horizontal');

    // As duas imagens continuam descritas em qualquer posição do divisor.
    await expect(canvas.getByAltText(obra.antes.alt)).toBeInTheDocument();
    await expect(canvas.getByAltText(obra.depois.alt)).toBeInTheDocument();
  },
};

export const Teclado: Story = {
  name: 'Comportamento · teclado',
  parameters: {
    docs: {
      description: {
        story:
          'A alça entra na ordem de tabulação. Setas movem de 5 em 5 pontos, Page Up e Page Down de 20 em 20, Home vai a 0% e End a 100%.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alca = canvas.getByRole('slider', { name: 'Posição da comparação' });

    await userEvent.tab();
    await expect(alca).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(alca).toHaveAttribute('aria-valuenow', '55');

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(alca).toHaveAttribute('aria-valuenow', '45');

    await userEvent.keyboard('{Home}');
    await expect(alca).toHaveAttribute('aria-valuenow', '0');

    await userEvent.keyboard('{End}');
    await expect(alca).toHaveAttribute('aria-valuenow', '100');
    await expect(alca).toHaveAttribute(
      'aria-valuetext',
      '100% de Antes da obra, 0% de Depois da obra',
    );
  },
};

export const AberturaAssimetrica: Story = {
  name: 'Estado · aberto em 25%',
  args: { posicaoInicial: 25 },
  parameters: {
    docs: {
      description: {
        story:
          'A posição inicial serve para abrir a comparação já destacando o resultado, útil em relatório de entrega de obra.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const alca = within(canvasElement).getByRole('slider');
    await expect(alca).toHaveAttribute('aria-valuenow', '25');
  },
};

export const PassoFino: Story = {
  name: 'Variante · passo de 1 ponto',
  args: { passo: 1 },
  parameters: {
    docs: {
      description: {
        story: 'Para conferência detalhada de laudo, o passo de 1 ponto dá controle fino pelo teclado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const alca = within(canvasElement).getByRole('slider');
    await userEvent.tab();
    await expect(alca).toHaveFocus();
    await userEvent.keyboard('{ArrowRight}{ArrowRight}{ArrowRight}');
    await expect(alca).toHaveAttribute('aria-valuenow', '53');
  },
};

export const Vistoria: Story = {
  name: 'Conteúdo · vistoria de unidade de saúde',
  args: {
    antes: {
      src: salaDeVacinaAntes,
      alt: 'Sala de vacina da UBS Vila Nova antes da reforma: parede com infiltração, janela com vidro quebrado e piso desgastado.',
      rotulo: 'Vistoria inicial',
    },
    depois: {
      src: salaDeVacinaDepois,
      alt: 'Sala de vacina da UBS Vila Nova depois da reforma: parede pintada, janela nova, bancada de atendimento e piso regularizado.',
      rotulo: 'Após adequação',
    },
    proporcao: '16 / 9',
    legenda:
      'UBS Vila Nova · Sala de vacina · Vistoria de 12/03/2025 comparada à reinspeção de 28/07/2025.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Vistoria inicial')).toBeVisible();
    await expect(canvas.getByText('Após adequação')).toBeVisible();
    await expect(canvas.getByRole('slider')).toHaveAttribute(
      'aria-valuetext',
      '50% de Vistoria inicial, 50% de Após adequação',
    );
  },
};

export const RotuloProprio: Story = {
  name: 'Variante · nome acessível próprio',
  args: {
    rotuloAlca: 'Posição da comparação da pavimentação',
    legenda: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Com mais de uma comparação na mesma tela, cada alça precisa de nome próprio para o leitor de tela distinguir uma da outra.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('slider', { name: 'Posição da comparação da pavimentação' }),
    ).toBeVisible();
  },
};

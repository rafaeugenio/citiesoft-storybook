import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Image } from './Image';

/**
 * As imagens são geradas em SVG inline e servidas como data URI: a suíte roda
 * offline e nenhuma story pode depender de rede.
 */
function comprovante(titulo: string, linhas: string[], tom: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" role="presentation">
    <rect width="600" height="400" fill="#F4F6FA"/>
    <rect x="24" y="24" width="552" height="352" rx="8" fill="#FFFFFF" stroke="#D6DCE6"/>
    <rect x="24" y="24" width="552" height="56" rx="8" fill="${tom}"/>
    <text x="48" y="60" font-family="Inter, sans-serif" font-size="20" fill="#FFFFFF">${titulo}</text>
    ${linhas
      .map(
        (linha, indice) =>
          `<text x="48" y="${132 + indice * 34}" font-family="Inter, sans-serif" font-size="16" fill="#31363F">${linha}</text>`,
      )
      .join('')}
    <rect x="48" y="300" width="220" height="2" fill="#8A94A6"/>
    <text x="48" y="326" font-family="Inter, sans-serif" font-size="13" fill="#6B7280">Assinatura do responsável</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const COMPROVANTE_DIARIA = comprovante(
  'Comprovante de despesa',
  ['Processo 2025/0481', 'Servidora: Maria de Fátima Souza', 'Diária de TFD, competência 03/2025'],
  '#1261E4',
);

const CARIMBO_SECRETARIA = comprovante(
  'Protocolo recebido',
  ['Secretaria Municipal de Saúde', 'Recebido em 12/03/2025'],
  '#0F7B4F',
);

/** Data URI deliberadamente inválido: dispara `onError` sem tocar a rede. */
const ENDERECO_INVALIDO = 'data:image/png;base64,ZmFsaGEtZGUtY2FycmVnYW1lbnRv';

const meta = {
  title: 'Átomos/Mídia/Image',
  component: Image,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Image e ImagePreview. Página Figma `6738:54006` do CitieOne (equivalente PrimeNG: `p-image`). Variantes do arquivo: `image` com eixos `State` (Idle/Hover) e `Preview` (False/True), `image-preview` com a barra `image-toolbar` de cinco ações (girar à esquerda, girar à direita, diminuir, ampliar, fechar) e `image-action` com estados Idle e Focus. A pré-visualização é um `dialog` modal: fecha por Escape e devolve o foco ao gatilho.\n\n**Quando usar:** para exibir o anexo de imagem de um processo (comprovante, carimbo de protocolo, foto de documento) permitindo que o servidor amplie e gire antes de decidir.\n\n**Quando não usar:** para ícone de interface. Ícone entra como SVG inline, herdando `currentColor`, e é assim que os componentes deste catálogo desenham os seus; imagem rasterizada não acompanha a troca de tema e aparece embaçada nas telas de alta densidade que o servidor usa o dia inteiro. Para documento de várias páginas, como laudo digitalizado ou PDF anexado: a barra de pré-visualização só gira e amplia, não pagina nem permite buscar texto, então o servidor fica preso na primeira página; ofereça o arquivo pelo `Upload`, que lista o anexo com nome e download. Para dado do processo que só existe dentro da imagem, como valor ou decisão em captura de tela: quem usa leitor de tela e quem usa a busca do navegador não alcançam esse conteúdo, e a exigência legal de acessibilidade não é atendida por texto alternativo longo; leve o dado para texto real na tela. Para número, série histórica ou comparativo, use os componentes de `Organismos/Gráficos` no lugar de uma imagem de gráfico, que não responde ao tema nem ao zoom. E o `alt` nunca fica vazio quando a imagem carrega informação: sem ele, o anexo simplesmente não existe para parte dos usuários.',
      },
    },
  },
  args: {
    src: COMPROVANTE_DIARIA,
    alt: 'Comprovante de despesa da diária de TFD do processo 2025/0481',
    largura: 300,
    altura: 200,
  },
} satisfies Meta<typeof Image>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basica: Story = {
  name: 'Variante · imagem simples',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      await canvas.findByRole('img', {
        name: 'Comprovante de despesa da diária de TFD do processo 2025/0481',
      }),
    ).toBeVisible();
  },
};

export const ComLegenda: Story = {
  name: 'Variante · com legenda',
  args: {
    legenda: 'Anexado por Maria de Fátima Souza em 12/03/2025',
  },
};

export const AltDescritivoEDecorativo: Story = {
  name: 'Acessibilidade · alt descritivo e decorativo',
  parameters: {
    docs: {
      description: {
        story:
          'À esquerda, imagem que carrega informação: o `alt` vem dos dados do processo e descreve o que o documento comprova. À direita, imagem decorativa (o carimbo repete o que o texto ao lado já diz): `alt=""` explícito a remove da árvore de acessibilidade, evitando que o leitor de tela anuncie ruído. Omitir o `alt` não é a mesma coisa: sem o atributo, o leitor lê o nome do arquivo.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
      <Image {...args} legenda="alt descritivo, vindo dos dados do processo" />
      <Image
        src={CARIMBO_SECRETARIA}
        alt=""
        largura={300}
        altura={200}
        legenda="alt vazio: carimbo decorativo, o texto ao lado já informa"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await waitFor(async () => {
      // Só a imagem informativa entra na árvore de acessibilidade.
      await expect(canvas.getAllByRole('img')).toHaveLength(1);
    });
    await expect(
      canvas.getByRole('img', {
        name: 'Comprovante de despesa da diária de TFD do processo 2025/0481',
      }),
    ).toBeVisible();
  },
};

export const SobreposicaoNoHover: Story = {
  name: 'Estado · sobreposição no gatilho',
  args: { preview: true },
  parameters: {
    docs: {
      description: {
        story:
          'Com `preview`, a imagem vira um botão com nome acessível ("Ampliar a imagem ..."), nunca uma `div` clicável. A máscara escura com o ícone de olho (variante State=Hover, Preview=True do Figma) aparece no hover e também no foco por teclado, para que o alvo não fique invisível para quem navega sem mouse.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = await canvas.findByRole('button', {
      name: 'Ampliar a imagem Comprovante de despesa da diária de TFD do processo 2025/0481',
    });
    await waitFor(async () => {
      await expect(gatilho).toBeEnabled();
    });
    gatilho.focus();
    await expect(gatilho).toHaveFocus();
    const mascara = canvasElement.querySelector('.citie-image__mascara');
    await waitFor(async () => {
      await expect(getComputedStyle(mascara as Element).opacity).toBe('1');
    });
  },
};

export const PreviewAmpliada: Story = {
  name: 'Variante · pré-visualização ampliada',
  args: { preview: true },
  parameters: {
    docs: {
      description: {
        story:
          'A pré-visualização começa fechada e só abre pelo gatilho. É um `dialog` modal: prende o foco, fecha por Escape e devolve o foco ao gatilho que a abriu.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = await canvas.findByRole('button', { name: /^Ampliar a imagem Comprovante/ });
    await waitFor(async () => {
      await expect(gatilho).toBeEnabled();
    });

    // O `dialog` nativo fica montado o tempo todo e alterna por
    // `showModal`/`close`, como em Overlay.tsx. Então a asserção de fechamento é
    // sobre o estado do elemento e sua visibilidade, nunca sobre presença no DOM.
    const dialogo = canvasElement.querySelector('dialog')!;
    await expect(dialogo.open).toBe(false);

    await userEvent.click(gatilho);
    await waitFor(async () => {
      await expect(dialogo.open).toBe(true);
    });
    // O foco inicial vai para o fechar, nunca para a primeira ação da barra.
    await expect(
      within(dialogo).getByRole('button', { name: /^Fechar a pré-visualização/ }),
    ).toHaveFocus();

    // Escape num `dialog` modal é ação padrão do NAVEGADOR: ele emite o evento
    // `cancel`. O userEvent dispara um keydown sintético, que não aciona essa
    // ação padrão, então o caminho de teclado é verificado emitindo o `cancel`
    // diretamente, que é exatamente o que o navegador faz.
    fireEvent(dialogo, new Event('cancel', { cancelable: true }));
    await waitFor(async () => {
      await expect(dialogo.open).toBe(false);
    });
    await expect(dialogo).not.toBeVisible();
    await expect(gatilho).toHaveFocus();
  },
};

export const GirarEAmpliar: Story = {
  name: 'Ação · girar e ampliar',
  args: { preview: true },
  parameters: {
    docs: {
      description: {
        story:
          'A barra reproduz as cinco ações de `image-toolbar`. Girar e ampliar mudam só a aparência, então o resultado é anunciado em texto por uma região `status`: sem isso, quem usa leitor de tela aciona o botão e não recebe retorno nenhum.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = await canvas.findByRole('button', { name: /^Ampliar a imagem Comprovante/ });
    await waitFor(async () => {
      await expect(gatilho).toBeEnabled();
    });
    await userEvent.click(gatilho);

    const dialogo = canvasElement.querySelector('dialog')!;
    await waitFor(async () => {
      await expect(dialogo.open).toBe(true);
    });
    const acoes = within(dialogo);
    await expect(acoes.getByRole('toolbar')).toBeInTheDocument();
    await expect(acoes.getByRole('status')).toHaveTextContent('Zoom 100%, sem rotação');

    await userEvent.click(acoes.getByRole('button', { name: 'Girar à direita' }));
    await userEvent.click(acoes.getByRole('button', { name: 'Aumentar o zoom' }));
    await waitFor(async () => {
      await expect(acoes.getByRole('status')).toHaveTextContent('Zoom 125%, girada 90 graus');
    });

    // O limite inferior desabilita o diminuir em vez de sinalizar só por cor.
    const diminuir = acoes.getByRole('button', { name: 'Diminuir o zoom' });
    await userEvent.click(diminuir);
    await userEvent.click(diminuir);
    await userEvent.click(diminuir);
    await waitFor(async () => {
      await expect(acoes.getByRole('status')).toHaveTextContent('Zoom 50%');
    });
    await expect(diminuir).toBeDisabled();

    await userEvent.click(acoes.getByRole('button', { name: /^Fechar a pré-visualização/ }));
    await waitFor(async () => {
      await expect(dialogo.open).toBe(false);
    });
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: { carregando: true },
  parameters: {
    docs: {
      description: {
        story:
          'Enquanto o arquivo não chega, o skeleton ocupa exatamente a caixa da imagem para não haver salto de layout, e a região anuncia o que está carregando.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('status', {
        name: 'Carregando imagem: Comprovante de despesa da diária de TFD do processo 2025/0481',
      }),
    ).toBeInTheDocument();
  },
};

export const Falhou: Story = {
  name: 'Estado · falha ao carregar',
  args: { src: ENDERECO_INVALIDO },
  parameters: {
    docs: {
      description: {
        story:
          'Quando o arquivo não carrega, o componente diz em texto o que aconteceu e repete a descrição da imagem, para que a pessoa saiba qual documento faltou. Ícone quebrado sozinho não informa nada.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(await canvas.findByText('Não foi possível carregar a imagem')).toBeVisible();
    await expect(
      canvas.getByText('Comprovante de despesa da diária de TFD do processo 2025/0481'),
    ).toBeVisible();
  },
};

export const Contain: Story = {
  name: 'Variante · ajuste contain',
  args: { ajuste: 'contain', largura: 300, altura: 240 },
  parameters: {
    docs: {
      description: {
        story:
          'Documento anexado ao processo usa `contain`: cortar as bordas de um comprovante esconde carimbo, data ou assinatura.',
      },
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { Galleria, type ItemGalleria } from './Galleria';

/**
 * As imagens são SVG inline gerado em código: a suíte roda offline e nenhum
 * arquivo é baixado.
 */
function Placeholder({ matiz, marco }: { matiz: number; marco: 'predio' | 'telhado' | 'rampa' }) {
  const desenhos = {
    predio: <rect x="26" y="34" width="48" height="46" rx="2" fill={`hsl(${matiz} 34% 74%)`} />,
    telhado: <path d="M18 52 50 30l32 22v6H18z" fill={`hsl(${matiz} 34% 70%)`} />,
    rampa: <path d="M16 80h68l-52-26z" fill={`hsl(${matiz} 34% 72%)`} />,
  };

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%">
      <rect width="100" height="100" fill={`hsl(${matiz} 46% 88%)`} />
      <rect y="72" width="100" height="28" fill={`hsl(${matiz} 24% 62%)`} />
      {desenhos[marco]}
      <circle cx="78" cy="20" r="8" fill={`hsl(${matiz} 60% 94%)`} />
    </svg>
  );
}

const anexos: ItemGalleria[] = [
  {
    id: 'anexo-01',
    alt: 'Fachada da Escola Municipal Dom Pedro II com fissura vertical na viga central',
    legenda: 'Fachada principal',
    descricao: 'Vistoria de 12/03/2025 · fiscal Maria de Fátima Souza',
    conteudo: <Placeholder matiz={210} marco="predio" />,
  },
  {
    id: 'anexo-02',
    alt: 'Pátio interno com piso cerâmico solto próximo ao bebedouro',
    legenda: 'Pátio interno',
    descricao: 'Vistoria de 12/03/2025 · fiscal Maria de Fátima Souza',
    conteudo: <Placeholder matiz={162} marco="predio" />,
  },
  {
    id: 'anexo-03',
    alt: 'Quadro de energia do bloco B com disjuntores sem identificação',
    legenda: 'Quadro de energia, bloco B',
    descricao: 'Vistoria de 12/03/2025 · fiscal Ronaldo Lima Barros',
    conteudo: <Placeholder matiz={38} marco="predio" />,
  },
  {
    id: 'anexo-04',
    alt: 'Telhado do bloco A com quatro telhas quebradas sobre a sala 12',
    legenda: 'Telhado do bloco A',
    descricao: 'Vistoria de 13/03/2025 · fiscal Ronaldo Lima Barros',
    conteudo: <Placeholder matiz={4} marco="telhado" />,
  },
  {
    id: 'anexo-05',
    alt: 'Rampa de acesso à secretaria sem corrimão no lado direito',
    legenda: 'Rampa de acesso',
    descricao: 'Vistoria de 13/03/2025 · fiscal Maria de Fátima Souza',
    conteudo: <Placeholder matiz={268} marco="rampa" />,
  },
  {
    id: 'anexo-06',
    alt: 'Reservatório de água na laje com tampa danificada',
    legenda: 'Reservatório na laje',
    descricao: 'Vistoria de 13/03/2025 · fiscal Ronaldo Lima Barros',
    conteudo: <Placeholder matiz={188} marco="telhado" />,
  },
];

const meta = {
  title: 'Organismos/Mídia/Galleria',
  component: Galleria,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Galleria: imagem em destaque, tira de miniaturas e modo tela cheia. Página do Figma CitieOne `6738:54005` (seção Mídia). Variantes cobertas: Thumbnail e Thumbnail Location (Bottom/Top/Left/Right), Indicator e Indicator Location, Inset Indicator, Navigator e Show Caption. Equivalente PrimeNG: `p-galleria`. Cada imagem carrega o texto alternativo vindo do próprio anexo, nunca um rótulo genérico.',
          '',
          '**Quando usar:** conjunto de fotografias do mesmo objeto de processo que o servidor examina',
          'uma a uma para instruir parecer, como as fotos de uma vistoria ou os anexos de imagem de um',
          'auto de infração.',
          '',
          '**Quando não usar:** anexo único, em que a tira de miniaturas e as setas ocupam altura sem',
          'oferecer navegação nenhuma (use `Image`, que já abre em tela cheia); lista de anexos com tipos',
          'misturados, como ofício em PDF ao lado de foto, porque a miniatura não representa o documento',
          'e o servidor perde nome do arquivo, data de juntada e autor, que são justamente o dado do',
          'processo (use `Table` ou `DataView` com essas colunas e o link para abrir); comparação de duas',
          'imagens do mesmo enquadramento antes e depois de uma obra, em que ver uma de cada vez obriga a',
          'guardar a primeira de memória (use `ImageCompare`); e rotação de cards ou destaques em página',
          'inicial, que é outro componente (`Carousel`). Evite também galeria com dezenas de anexos: a',
          'tira de miniaturas passa a exigir rolagem própria e encontrar a foto certa fica mais caro que',
          'em uma listagem com legenda e data.',
        ].join('\n'),
      },
    },
  },
  args: {
    itens: anexos,
    rotulo: 'Anexos de imagem do processo 2025/0481',
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 720, padding: 24 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Galleria>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão · anexos do processo',
  parameters: {
    docs: {
      description: {
        story:
          'Imagem em destaque com setas de navegação e tira de miniaturas embaixo. As setas ficam desabilitadas nas pontas porque a galeria não é circular.',
      },
    },
  },
};

export const MiniaturasAEsquerda: Story = {
  name: 'Miniaturas · à esquerda',
  args: { posicaoMiniaturas: 'left' },
  parameters: {
    docs: {
      description: {
        story:
          'Thumbnail Location Left, com a tira em coluna. Nessa orientação as setas do teclado passam a ser Seta acima e Seta abaixo. Abaixo de 768px a tira volta para baixo da imagem.',
      },
    },
  },
};

export const IndicadoresSobreAImagem: Story = {
  name: 'Indicadores · sobre a imagem',
  args: {
    miniaturas: false,
    indicadores: true,
    indicadoresSobrepostos: true,
    circular: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Inset Indicator para galeria enxuta, sem tira. Com `circular`, a última imagem leva de volta à primeira e as setas nunca desabilitam. O indicador ativo muda de cor e de tamanho, e carrega `aria-current`, porque cor sozinha não comunica estado.',
      },
    },
  },
};

export const ComLegenda: Story = {
  name: 'Legenda · registro fotográfico de vistoria',
  args: { mostrarLegenda: true, indicadores: true },
  parameters: {
    docs: {
      description: {
        story:
          'Show Caption ligado: local do registro e a data com o fiscal responsável. A legenda repete em texto visível o que o alternativo já descreve, então serve tanto para quem vê a foto quanto para quem lê a tela.',
      },
    },
  },
};

export const TelaCheia: Story = {
  name: 'Tela cheia · abre pelo gatilho',
  args: { telaCheia: true },
  parameters: {
    docs: {
      description: {
        story:
          'O modo tela cheia é um `dialog` modal: prisão de foco, Escape fecha e o foco volta ao botão que abriu. Começa fechado de propósito, porque um `dialog` modal sobe para a top layer e cobriria a página de documentação inteira.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Ver em tela cheia' });

    await userEvent.click(gatilho);
    // Escopo no canvas da story: a página de docs tem vários dialogs no DOM.
    const dialogo = canvasElement.querySelector('dialog')!;
    await waitFor(() => expect(dialogo.open).toBe(true));

    // O foco entra na top layer, senão o Escape não chega ao diálogo.
    const fechar = within(dialogo).getByRole('button', { name: 'Fechar tela cheia' });
    await waitFor(() => expect(fechar).toHaveFocus());

    // Escape num `dialog` modal é ação padrão do NAVEGADOR, que emite `cancel`.
    // O keydown sintético do userEvent não dispara essa ação padrão, então o
    // caminho de teclado é verificado emitindo o `cancel` diretamente.
    fireEvent(dialogo, new Event('cancel', { cancelable: true }));
    await waitFor(() => expect(dialogo.open).toBe(false));
    // O foco volta para a origem, e não para o topo do documento.
    await waitFor(() => expect(gatilho).toHaveFocus());
  },
};

export const TecladoNaTira: Story = {
  name: 'Teclado · setas na tira de miniaturas',
  parameters: {
    docs: {
      description: {
        story:
          'A tira é uma lista de botões com tabulação única: Tab entra na miniatura ativa e as setas movem foco e seleção juntos. Home e End vão para a primeira e a última imagem.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const miniaturas = canvas.getAllByRole('button', { name: /^Imagem \d+ de 6:/ });
    await expect(miniaturas).toHaveLength(6);
    await expect(miniaturas[0]).toHaveAttribute('aria-current', 'true');

    miniaturas[0].focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(miniaturas[1]).toHaveFocus();
    await expect(miniaturas[1]).toHaveAttribute('aria-current', 'true');
    await expect(miniaturas[0]).not.toHaveAttribute('aria-current');

    await userEvent.keyboard('{End}');
    await expect(miniaturas[5]).toHaveFocus();
    await expect(miniaturas[5]).toHaveAttribute('aria-current', 'true');
  },
};

export const ImagemUnica: Story = {
  name: 'Item único · anexo isolado',
  args: {
    itens: [anexos[0]],
    rotulo: 'Anexo de imagem do processo 2025/0512',
    navegacao: false,
    miniaturas: false,
    mostrarLegenda: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Um anexo só: sem setas, sem tira e sem indicadores, para não oferecer navegação que não leva a lugar nenhum.',
      },
    },
  },
};

export const SemAnexos: Story = {
  name: 'Estado · sem anexos',
  args: { itens: [], rotulo: 'Anexos de imagem do processo 2025/0733' },
  parameters: {
    docs: {
      description: {
        story:
          'Processo sem registro fotográfico. A mensagem substitui a galeria inteira, em vez de deixar um palco vazio com controles inertes.',
      },
    },
  },
};

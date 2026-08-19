import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, type CSSProperties } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ScrollTop } from './ScrollTop';

type Processo = {
  numero: string;
  paciente: string;
  destino: string;
  situacao: string;
};

/* Listagem longa de processos de TFD: é exatamente o cenário em que o botão de
   voltar ao topo ganha razão de existir. */
const PROCESSOS: Processo[] = [
  { numero: '2025/0481', paciente: 'Maria de Fátima Souza', destino: 'São Luís · MA', situacao: 'Em análise' },
  { numero: '2025/0482', paciente: 'João Batista Ferreira', destino: 'Teresina · PI', situacao: 'Autorizado' },
  { numero: '2025/0483', paciente: 'Antônia Ribeiro Lima', destino: 'Fortaleza · CE', situacao: 'Aguardando laudo' },
  { numero: '2025/0484', paciente: 'Raimundo Nonato Alves', destino: 'São Luís · MA', situacao: 'Em análise' },
  { numero: '2025/0485', paciente: 'Josefa Carvalho Mendes', destino: 'Belém · PA', situacao: 'Autorizado' },
  { numero: '2025/0486', paciente: 'Francisco das Chagas Dias', destino: 'Brasília · DF', situacao: 'Viagem agendada' },
  { numero: '2025/0487', paciente: 'Terezinha de Jesus Rocha', destino: 'São Luís · MA', situacao: 'Aguardando laudo' },
  { numero: '2025/0488', paciente: 'Manoel Pereira Cunha', destino: 'Recife · PE', situacao: 'Em análise' },
  { numero: '2025/0489', paciente: 'Benedita Oliveira Castro', destino: 'Fortaleza · CE', situacao: 'Autorizado' },
  { numero: '2025/0490', paciente: 'Sebastião Martins Viana', destino: 'São Luís · MA', situacao: 'Concluído' },
  { numero: '2025/0491', paciente: 'Luzia Barbosa Nunes', destino: 'Teresina · PI', situacao: 'Em análise' },
  { numero: '2025/0492', paciente: 'Domingos Sávio Aragão', destino: 'Brasília · DF', situacao: 'Viagem agendada' },
  { numero: '2025/0493', paciente: 'Rita de Cássia Moreira', destino: 'São Luís · MA', situacao: 'Aguardando laudo' },
  { numero: '2025/0494', paciente: 'Antônio Carlos Peixoto', destino: 'Belém · PA', situacao: 'Autorizado' },
  { numero: '2025/0495', paciente: 'Marlene Gomes Andrade', destino: 'Fortaleza · CE', situacao: 'Em análise' },
  { numero: '2025/0496', paciente: 'Jorge Luiz Fontenele', destino: 'São Luís · MA', situacao: 'Concluído' },
  { numero: '2025/0497', paciente: 'Cleuza Maria Bezerra', destino: 'Recife · PE', situacao: 'Aguardando laudo' },
  { numero: '2025/0498', paciente: 'Edilson Rodrigues Braga', destino: 'Teresina · PI', situacao: 'Autorizado' },
  { numero: '2025/0499', paciente: 'Vanda Lúcia Sampaio', destino: 'São Luís · MA', situacao: 'Em análise' },
  { numero: '2025/0500', paciente: 'Pedro Henrique Coelho', destino: 'Brasília · DF', situacao: 'Viagem agendada' },
];

const estiloDaLinha: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 'var(--citie-spacing-3)',
  padding: 'var(--citie-spacing-3) var(--citie-spacing-4)',
  borderBottom: '1px solid var(--citie-border-default)',
  fontFamily: 'var(--citie-font-ui)',
  fontSize: 'var(--citie-font-size-body-md)',
  color: 'var(--citie-text-base)',
};

function LinhasDeProcesso() {
  return (
    <>
      {PROCESSOS.map((processo) => (
        <div key={processo.numero} style={estiloDaLinha}>
          <span style={{ fontWeight: 'var(--citie-font-weight-action)' }}>
            {processo.numero} · {processo.paciente}
          </span>
          <span style={{ color: 'var(--citie-text-secondary)', whiteSpace: 'nowrap' }}>
            {processo.destino} · {processo.situacao}
          </span>
        </div>
      ))}
    </>
  );
}

/* Type=Element do Figma: o wrapper com `position: relative` prende o botão ao
   canto da área visível, em vez de deixá-lo rolar junto com as linhas. */
function ListagemAncorada({ limiar, blocos = 1 }: { limiar?: number; blocos?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const cabecalho = useRef<HTMLHeadingElement>(null);

  return (
    <div style={{ position: 'relative', maxWidth: '760px' }}>
      <div
        ref={container}
        role="region"
        aria-label="Processos de TFD da competência 08/2026"
        // Região com overflow precisa entrar na ordem de Tab para rolar por teclado.
        tabIndex={0}
        style={{
          maxHeight: '320px',
          overflowY: 'auto',
          background: 'var(--citie-background-surface)',
          border: '1px solid var(--citie-border-default)',
          borderRadius: 'var(--citie-radius-lg)',
        }}
      >
        <h3
          ref={cabecalho}
          style={{
            margin: 0,
            padding: 'var(--citie-spacing-4)',
            borderBottom: '1px solid var(--citie-border-default)',
            fontFamily: 'var(--citie-font-display)',
            fontSize: 'var(--citie-font-size-body-lg)',
            color: 'var(--citie-text-primary)',
          }}
        >
          Processos de TFD da competência 08/2026
        </h3>
        {Array.from({ length: blocos }, (_, indice) => (
          <LinhasDeProcesso key={indice} />
        ))}
      </div>
      <ScrollTop tipo="elemento" alvo={container} alvoDeFoco={cabecalho} limiar={limiar} />
    </div>
  );
}

const meta = {
  title: 'Navegação/ScrollTop',
  component: ScrollTop,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Botão flutuante que aparece depois de um limiar de rolagem e devolve a pessoa ao topo.',
          'Página do Figma CitieOne `6738:55112` (❖ ScrollTop), componente `scrolltop` com o eixo',
          '`Type` (Window, Element). Equivalente PrimeNG: `p-scrolltop` (`target`, `threshold`,',
          '`behavior`).',
          '',
          '**Window** flutua sobre a viewport e observa a rolagem da página inteira. **Element**',
          'observa um container rolável e fica preso ao canto da área visível dele.',
          '',
          'Voltar ao topo move a rolagem **e** o foco. Rolagem sozinha deixaria quem navega por',
          'teclado parado no meio da listagem, com o botão sumindo debaixo do foco: o clique não',
          'teria efeito nenhum para essa pessoa. Por isso `alvoDeFoco` deve apontar para o título da',
          'listagem; sem ele o foco cai no container rolável (Element) ou no `body` (Window).',
          '',
          'A rolagem é suave por padrão e vira salto direto sob `prefers-reduced-motion: reduce`,',
          'junto com a animação de entrada. A entrada do botão é anunciada em região `polite`, que',
          'espera a leitura em curso terminar em vez de cortá-la.',
          '',
          'O botão tem 44x44, acima do mínimo de 24x24 e no alvo recomendado para controle',
          'flutuante, embora o Figma desenhe 35x35. O círculo preto do PrimeOne dá lugar ao Citie',
          'Blue.',
        ].join(' '),
      },
    },
  },
} satisfies Meta<typeof ScrollTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Ancorado: Story = {
  name: 'Variante · ancorado ao container (Element)',
  parameters: {
    docs: {
      description: {
        story:
          '`Type: Element`. A listagem de processos rola dentro da própria caixa e o botão fica preso ao canto inferior direito da área visível. Ele só existe no DOM depois do limiar, então nunca vira uma parada de Tab vazia.',
      },
    },
  },
  render: () => <ListagemAncorada />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regiao = canvas.getByRole('region', {
      name: 'Processos de TFD da competência 08/2026',
    });

    // Antes do limiar o botão não existe: nada de alvo invisível no caminho do Tab.
    await expect(canvas.queryByRole('button', { name: 'Voltar ao topo' })).toBeNull();

    // Rolar até o fim da área em vez de um número fixo: o navegador limita
    // `scrollTop` à altura rolável real, então um valor cravado pode virar menos
    // que o limiar quando a listagem muda de tamanho.
    regiao.scrollTop = regiao.scrollHeight;
    // A entrada tem animação de opacidade, e `toBeVisible` reprova enquanto ela
    // está em 0. Por isso a asserção inteira fica dentro do `waitFor`.
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Voltar ao topo' })).toBeVisible(),
    );
    const botao = canvas.getByRole('button', { name: 'Voltar ao topo' });

    // A entrada é anunciada em região polite, sem interromper a leitura em curso.
    await expect(canvas.getByRole('status')).toHaveTextContent(
      'Botão para voltar ao topo disponível.',
    );

    await userEvent.click(botao);
    await waitFor(() => expect(regiao.scrollTop).toBe(0));
    await expect(
      canvas.getByRole('heading', { name: 'Processos de TFD da competência 08/2026' }),
    ).toHaveFocus();
  },
};

export const AntesDoLimiar: Story = {
  name: 'Estado · antes do limiar',
  parameters: {
    docs: {
      description: {
        story:
          'Com a listagem no começo, o botão não é renderizado. A região `status` fica vazia, sem anúncio nenhum.',
      },
    },
  },
  render: () => <ListagemAncorada />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('button', { name: 'Voltar ao topo' })).toBeNull();
    await expect(canvas.getByRole('status')).toBeEmptyDOMElement();
  },
};

export const FocoVoltaAoTopo: Story = {
  name: 'Teclado · o foco volta ao topo junto',
  parameters: {
    docs: {
      description: {
        story:
          'Com o botão acionado por teclado, o foco vai para o título da listagem. É o que torna o atalho útil para quem navega sem ponteiro: a próxima tecla Tab continua do topo, não do ponto em que a rolagem parou.',
      },
    },
  },
  render: () => <ListagemAncorada />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regiao = canvas.getByRole('region', {
      name: 'Processos de TFD da competência 08/2026',
    });
    const cabecalho = canvas.getByRole('heading', {
      name: 'Processos de TFD da competência 08/2026',
    });

    regiao.scrollTop = regiao.scrollHeight;
    const botao = await waitFor(() => canvas.getByRole('button', { name: 'Voltar ao topo' }));

    botao.focus();
    await expect(botao).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(cabecalho).toHaveFocus();
    // tabindex -1: recebe o foco por programa sem virar parada extra de Tab.
    await expect(cabecalho).toHaveAttribute('tabindex', '-1');
    await waitFor(() => expect(regiao.scrollTop).toBe(0));
  },
};

export const LimiarAlto: Story = {
  name: 'Comportamento · limiar mais alto',
  parameters: {
    docs: {
      description: {
        story:
          'Limiar de 900 px: em listagens longas o botão só aparece quando a volta ao topo realmente custa. Abaixo disso, rolar de volta é mais rápido que mirar no botão. A listagem aqui é o dobro da anterior, porque um limiar alto só faz sentido quando há altura rolável para ele.',
      },
    },
  },
  render: () => <ListagemAncorada limiar={900} blocos={2} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const regiao = canvas.getByRole('region', {
      name: 'Processos de TFD da competência 08/2026',
    });

    regiao.scrollTop = 400;
    await waitFor(() =>
      expect(canvas.queryByRole('button', { name: 'Voltar ao topo' })).toBeNull(),
    );

    regiao.scrollTop = regiao.scrollHeight;
    await waitFor(() =>
      expect(canvas.getByRole('button', { name: 'Voltar ao topo' })).toBeVisible(),
    );
  },
};

export const PaginaInteira: Story = {
  name: 'Variante · página inteira (Window)',
  parameters: {
    docs: {
      description: {
        story:
          '`Type: Window`. A listagem cresce na altura natural da página e o botão flutua sobre a viewport, observando a rolagem da janela. Role esta história para vê-lo aparecer no canto inferior direito.',
      },
    },
  },
  render: () => {
    function PaginaDeProcessos() {
      const cabecalho = useRef<HTMLHeadingElement>(null);

      return (
        <div style={{ maxWidth: '760px' }}>
          <h3
            ref={cabecalho}
            style={{
              margin: '0 0 var(--citie-spacing-4)',
              fontFamily: 'var(--citie-font-display)',
              fontSize: 'var(--citie-font-size-body-lg)',
              color: 'var(--citie-text-primary)',
            }}
          >
            Processos de TFD da competência 08/2026
          </h3>
          <div
            style={{
              background: 'var(--citie-background-surface)',
              border: '1px solid var(--citie-border-default)',
              borderRadius: 'var(--citie-radius-lg)',
            }}
          >
            <LinhasDeProcesso />
            <LinhasDeProcesso />
          </div>
          <ScrollTop tipo="janela" alvoDeFoco={cabecalho} />
        </div>
      );
    }

    return <PaginaDeProcessos />;
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Link } from './Link';

const meta = {
  title: 'Átomos/Ações/Link',
  component: Link,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Link de texto do sistema.',
          '',
          '**Este átomo nasceu de um defeito encontrado por composição.** O catálogo não tinha',
          'componente de link, então o identificador de processo, que é o principal alvo de',
          'navegação das duas telas mais usadas, era um `<a>` sem classe. O navegador aplicava o',
          'próprio azul `#0000EE`: fora da marca no tema claro, e **1,67:1** contra a linha zebrada',
          'no tema escuro, ilegível e muito abaixo dos 4,5:1 da WCAG 1.4.3. Nenhuma story de',
          'componente isolado pegaria isso, porque o defeito só existe onde o link é usado.',
          '',
          'Com os tokens de marca, o mesmo link mede **5,45:1** sobre o fundo branco, **5,12:1**',
          'sobre a zebra clara, **5,30:1** sobre o fundo escuro e **4,78:1** sobre a zebra escura.',
          'Os quatro passam AA nos dois temas.',
          '',
          '**O sublinhado do papel `padrao` é permanente, por decisão de acessibilidade.** Cor',
          'sozinha não pode ser o único meio de identificar um link dentro de um bloco de texto',
          '(WCAG 1.4.1). A técnica G183 dispensa o traço quando o link mede 3:1 contra o texto',
          'vizinho, e `brand-primary` mede **2,03:1** contra `text-base` e 2,99:1 contra',
          '`text-primary`, então o traço fica. O hover engrossa o traço.',
          '',
          '**`identificador` e `discreto` seguem o kit: sublinhado só no hover e no foco.** São',
          'links soltos, sem texto vizinho de que precisem se distinguir. O identificador sai em',
          'Red Hat Mono com dígitos tabulares, como o CPF e a data das listagens do Sismental; o',
          'discreto sai em `text-secondary` (**4,94:1** sobre o branco, 4,53:1 sobre a zebra clara,',
          '6,39:1 e 5,76:1 no escuro).',
          '',
          '**Quando não usar:** ação que muda estado do sistema, como salvar, enviar, excluir ou',
          'abrir um diálogo, porque o leitor de tela anuncia link como navegação e o usuário perde',
          'a possibilidade de desfazer pelo botão voltar do navegador (use `Button` com',
          '`variant="text"`, que tem a mesma leveza visual e a semântica certa); item de menu de',
          'navegação do sistema, que já vem com estado ativo e marcação de landmark no `Sidebar`,',
          'no `Menubar` ou no `PanelMenu`; trilha de localização, que é `Breadcrumb`; e download de',
          'arquivo dentro de uma listagem de anexos, onde o formato e o tamanho precisam aparecer',
          'ao lado do nome, coisa que o `Upload` já resolve.',
          '',
          'Um link precisa de destino. Se não há `href`, não é link.',
        ].join('\n'),
      },
    },
  },
  args: {
    href: '#/tfd/solicitacoes/2025-0481',
    children: '2025/0481',
  },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Papel · padrão',
  args: {
    href: '#/ajuda/tfd',
    children: 'consulte as regras de concessão de TFD',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'consulte as regras de concessão de TFD' });

    await expect(link).toHaveAttribute('href', '#/ajuda/tfd');
    // O sublinhado permanente é requisito da WCAG 1.4.1: o link vive no texto
    // e a cor de marca mede 2,03:1 contra o texto vizinho. Traço visível em repouso.
    await expect(link).toHaveStyle({ textDecorationLine: 'underline' });
    await expect(getComputedStyle(link).textDecorationColor).toBe(getComputedStyle(link).color);
  },
};

/**
 * Cor do sublinhado resolvida pelo navegador. Em repouso o traço dos papéis
 * soltos é transparente; no hover e no foco ele assume a cor do texto.
 */
const corDoSublinhado = (elemento: Element) => getComputedStyle(elemento).textDecorationColor;

export const Identificador: Story = {
  name: 'Papel · identificador de registro',
  args: { papel: 'identificador' },
  parameters: {
    docs: {
      description: {
        story:
          'Mono com dígitos tabulares, sublinhado só no hover e no foco. O link é o único conteúdo da célula, então a WCAG 1.4.1 não exige o traço permanente, e ele sujaria a coluna que o olho varre.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: '2025/0481' });
    await expect(link).toBeVisible();

    const estilo = getComputedStyle(link);
    await expect(estilo.fontVariantNumeric).toBe('tabular-nums');
    // Mono de verdade: a família resolvida começa pela Red Hat Mono do token.
    await expect(estilo.fontFamily.startsWith('"Red Hat Mono"')).toBe(true);
    // Repouso sem traço visível; foco (e hover, pela mesma regra de CSS) acende
    // o traço na cor do texto. O foco por teclado é o que a suíte consegue
    // provar: `userEvent.hover` aqui despacha eventos sem o estado `:hover`.
    await expect(corDoSublinhado(link)).toBe('rgba(0, 0, 0, 0)');
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await waitFor(async () => {
      await expect(corDoSublinhado(link)).toBe(getComputedStyle(link).color);
    });
  },
};

export const Discreto: Story = {
  name: 'Papel · discreto',
  args: {
    papel: 'discreto',
    href: '#/tfd/solicitacoes/2025-0481/historico',
    children: 'ver histórico completo',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Em `text-secondary`, corpo 13, sublinhado só no hover e no foco. Para área densa em que vários links competem, e para o link de rodapé.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: 'ver histórico completo' });
    await expect(corDoSublinhado(link)).toBe('rgba(0, 0, 0, 0)');
    // Foco por teclado também acende o traço (WCAG 2.4.7 pede indicação visível).
    await userEvent.tab();
    await expect(link).toHaveFocus();
    await waitFor(async () => {
      await expect(corDoSublinhado(link)).toBe(getComputedStyle(link).color);
    });
  },
};

export const NovaAba: Story = {
  name: 'Variante · abre em nova aba',
  args: {
    href: 'https://www.gov.br/saude',
    children: 'Portal do Ministério da Saúde',
    novaAba: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A mudança de contexto precisa chegar ao leitor de tela (WCAG 3.2.5),
    // por isso o nome acessível carrega o aviso que o texto visível não mostra.
    const link = canvas.getByRole('link', { name: /Portal do Ministério da Saúde/ });

    await expect(link).toHaveAccessibleName('Portal do Ministério da Saúde (abre em nova aba)');
    await expect(link).toHaveAttribute('target', '_blank');
    // Sem isso, a página aberta consegue manipular a original pelo window.opener.
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  },
};

export const Foco: Story = {
  name: 'Estado · foco por teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole('link', { name: '2025/0481' });

    await userEvent.tab();
    await expect(link).toHaveFocus();
    // O anel de foco vem do token do sistema, e o outline default do navegador é
    // suprimido, porque ele some sobre fundo escuro. Uma coisa sem a outra deixa
    // o usuário de teclado sem indicação nenhuma (WCAG 2.4.7).
    const estilo = getComputedStyle(link);
    await expect(estilo.boxShadow).not.toBe('none');
    await expect(estilo.outlineStyle).toBe('none');
  },
};

export const EmLinhaDeTabela: Story = {
  name: 'Regressão · identificador sobre linha zebrada',
  parameters: {
    docs: {
      description: {
        story: [
          'O caso exato que motivou o componente. Antes, o `<a>` cru rendia 1,85:1 sobre a linha',
          'ímpar e 1,67:1 sobre a par no tema escuro. Esta story existe para que a regressão volte',
          'a ser visível se alguém trocar o token por um valor literal.',
        ].join(' '),
      },
    },
  },
  render: (args) => (
    <table style={{ borderCollapse: 'collapse', width: '100%', maxWidth: '420px' }}>
      <caption style={{ textAlign: 'left', paddingBottom: 'var(--citie-spacing-2)' }}>
        Solicitações de TFD
      </caption>
      <tbody>
        {['2025/0481', '2025/0482', '2025/0483'].map((protocolo, indice) => (
          <tr
            key={protocolo}
            style={{
              backgroundColor:
                indice % 2 === 0
                  ? 'var(--citie-background-surface)'
                  : 'var(--citie-background-subtle)',
            }}
          >
            <td style={{ padding: 'var(--citie-spacing-3)' }}>
              <Link {...args} papel="identificador" href={`#/tfd/solicitacoes/${protocolo}`}>
                {protocolo}
              </Link>
            </td>
            <td style={{ padding: 'var(--citie-spacing-3)' }}>Imperatriz</td>
          </tr>
        ))}
      </tbody>
    </table>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const links = canvas.getAllByRole('link');

    await expect(links).toHaveLength(3);
    for (const link of links) {
      // Nenhum link pode cair no azul default do navegador.
      await expect(getComputedStyle(link).color).not.toBe('rgb(0, 0, 238)');
    }
  },
};

export const TemaEscuro: Story = {
  name: 'Tema · escuro sobre linha zebrada',
  globals: { theme: 'dark' },
  parameters: {
    docs: {
      description: {
        story:
          'O tema onde o defeito original era pior. O gate do axe roda aqui, então a regressão de contraste reprova o build.',
      },
    },
  },
  render: EmLinhaDeTabela.render,
  play: EmLinhaDeTabela.play,
};

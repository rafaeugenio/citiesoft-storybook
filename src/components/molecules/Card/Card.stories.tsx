import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Card } from './Card';
import { Button } from '../../atoms/Button/Button';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import { SkeletonParagrafo } from '../SkeletonParagrafo/SkeletonParagrafo';
import { StatusIndicator } from '../../atoms/Badge/Badge';

const meta = {
  title: 'Moléculas/Contêineres/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Card. Spec: `03-components/cards.md` v2.0.0. Equivalente PrimeNG: `p-card`. Máximo de 3 ações no rodapé, e ação destrutiva nunca fica exposta em card de lista densa.',
          '',
          '**Quando usar:** um registro por vez, com poucos atributos heterogêneos que valem ser lidos juntos (resumo do servidor, ficha do processo aberto, bloco de KPI). O card ganha quando o conteúdo tem forma própria e nenhuma comparação item a item é esperada.',
          '',
          '**Quando não usar:**',
          '',
          '- **Conjunto de registros com os mesmos atributos.** Cards empilhados repetem os rótulos em cada cartão e tiram do servidor a leitura em coluna, que é como ele confere 40 lançamentos de diária sem ler cada um. Use `Organismos/Tabelas/Table`, ou `Organismos/Coleções/DataView` quando a mesma coleção precisar alternar entre grade e lista.',
          '- **Agrupar campos de um formulário.** O card não expõe legenda de grupo para leitor de tela; use `Organismos/Formulário/Fieldset`, que entrega `fieldset` e `legend`.',
          '- **Só para desenhar uma caixa em volta de conteúdo.** Borda sem hierarquia acrescenta ruído em tela densa. Use `Organismos/Layout/Panel` quando houver cabeçalho e conteúdo recolhível, ou `Átomos/Layout/Divider` quando bastar separar.',
          '- **Só para desenhar uma caixa em volta de conteúdo interativo solto.** Se o que existe ali é um formulário, ele já tem contêiner próprio no catálogo.',
          '',
          '**Card navegável com ação no rodapé, e por que agora pode.** Com `href` e `titulo`, quem carrega o link é o título, e a área de clique dele é esticada até as bordas do card. Antes o componente envolvia tudo num `<a>`, e então qualquer botão de rodapé ficava dentro do link: aninhamento inválido, alvo de teclado ambíguo e nome anunciado ao leitor de tela igual ao card lido por inteiro. O consumidor vinha contornando sozinho, e o `DataView` até hoje suprime as ações do item quando há `href`. A regra que fica: **conteúdo interativo de um card navegável vai no rodapé**, porque no corpo ele ficaria coberto pela área do link. Sem `titulo` não há texto para nomear o destino, então o card inteiro vira o link e aí o rodapé com ação continua proibido.',
          '- **Conteúdo transitório que precisa de resposta.** Aviso que some sozinho é `Moléculas/Feedback/Toast`; alerta ancorado à seção é `Moléculas/Feedback/Message`; ausência de dados é `Moléculas/Feedback/EmptyState`.',
        ].join('\n'),
      },
    },
  },
  args: {
    titulo: 'Dados do servidor',
    subtitulo: 'Atualizado em 18/03/2025',
    children: 'Maria de Fátima Souza · Matrícula 00123456 · Secretaria de Saúde',
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Variante · padrão',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { name: 'Dados do servidor' })).toBeVisible();
  },
};

export const ComRodape: Story = {
  name: 'Variante · com rodapé',
  args: {
    rodape: (
      <>
        <Button variant="secondary" size="small">
          Ver histórico
        </Button>
        <Button variant="primary" size="small">
          Editar cadastro
        </Button>
      </>
    ),
  },
};

export const Clicavel: Story = {
  name: 'Variante · clicável',
  args: { href: '#processo-2025-0481' },
  parameters: {
    docs: {
      description: {
        story:
          'O card inteiro é alvo de navegação por link nativo, nunca por contêiner genérico com manipulador de clique. Quem carrega o `href` é o título, e a área de clique dele é esticada até as bordas do card, então o nome anunciado ao leitor de tela é o título sozinho, sem o subtítulo e o corpo atrás.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Elemento nativo: alcançável por teclado e anunciado como link.
    const link = canvas.getByRole('link', { name: /Dados do servidor/ });
    await expect(link).toBeVisible();

    // O nome do destino é o título sozinho: o subtítulo e o corpo
    // ficam fora do link. Antes, com o `<a>` envolvendo tudo, o leitor de tela
    // anunciava "Dados do servidor Atualizado em 18/03/2025 Maria de Fátima…".
    await expect(link).toHaveAccessibleName('Dados do servidor');
  },
};

export const ClicavelComAcoes: Story = {
  name: 'Variante · clicável com ação no rodapé',
  args: {
    href: '#processo-2025-0481',
    rodape: (
      <Button variant="secondary" size="small">
        Ver histórico
      </Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A combinação que antes era proibida. O link vive no título e cobre o card por um pseudo-elemento; o rodapé se levanta acima dessa área, então o botão fica fora do link, recebe o próprio clique e mantém a própria parada de tabulação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // DOM válido: o botão não está dentro do link.
    const link = canvas.getByRole('link', { name: 'Dados do servidor' });
    const botao = canvas.getByRole('button', { name: 'Ver histórico' });
    await expect(link.contains(botao)).toBe(false);

    // Duas paradas de tabulação distintas, cada uma com o seu alvo.
    botao.focus();
    await expect(botao).toHaveFocus();
    link.focus();
    await expect(link).toHaveFocus();
  },
};

export const ClicavelSemTitulo: Story = {
  name: 'Regra · navegável sem título recusa o rodapé',
  args: {
    titulo: undefined,
    subtitulo: undefined,
    href: '#processo-2025-0481',
    rodape: (
      <Button variant="secondary" size="small">
        Ver histórico
      </Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story: [
          'Sem `titulo` falta texto para nomear o destino, então o card inteiro é que vira o link.',
          'Nessa forma o rodapé com ação seria um botão dentro de um `<a>`, e o componente recusa:',
          'o rodapé é descartado e o desenvolvimento recebe aviso no console dizendo o caminho de',
          'saída, que é dar `titulo` ao card para o link ir para ele.',
          '',
          'A regra vivia só na documentação, e quem consumia descobria pelo axe. Agora ela vale no',
          'runtime.',
        ].join('\n'),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O card inteiro é o link, e o rodapé foi recusado junto com o botão dele.
    const link = canvas.getByRole('link');
    await expect(link).toHaveClass('citie-card');
    await expect(canvas.queryByRole('button', { name: 'Ver histórico' })).toBeNull();
    await expect(canvasElement.querySelector('.citie-card__rodape')).toBeNull();

    // Nenhum interativo aninhado sobrou no documento.
    await expect(canvasElement.querySelector('a a, a button, button a')).toBeNull();
  },
};

export const Selecionado: Story = {
  name: 'Estado · selecionado',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, width: 420 }}>
      <Card {...args} titulo="Em repouso" />
      <Card {...args} titulo="Selecionado" selecionado />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'O trilho de seleção é sombra interna. Com `border-inline-start: 3px` a caixa de conteúdo encolhia 2px e todo o conteúdo do card escorregava para a direita ao ser selecionado: medido, o título saía de 45,00px para 47,00px. Numa lista em que a seleção passa de um card para outro, era um tranco de 2px por troca.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const [repouso, selecionado] = Array.from(
      canvasElement.querySelectorAll('.citie-card__titulo'),
    );
    // Selecionar não desloca conteúdo: a régua vertical dos títulos não se move.
    await expect(selecionado.getBoundingClientRect().left).toBe(
      repouso.getBoundingClientRect().left,
    );
  },
};

export const ComErro: Story = {
  name: 'Estado · erro',
  args: {
    erro: true,
    titulo: 'Documentação do processo',
    children: 'Três anexos obrigatórios não foram enviados.',
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: {
    titulo: undefined,
    subtitulo: undefined,
    children: (
      <div style={{ display: 'grid', gap: 12 }}>
        <Skeleton forma="titulo" />
        <SkeletonParagrafo linhas={3} />
      </div>
    ),
  },
};

export const Densidades: Story = {
  name: 'Densidades · confortável, compacta e ultracompacta',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 420 }}>
      <Card {...args} densidade="confortavel" titulo="Confortável" />
      <Card {...args} densidade="compacta" titulo="Compacta" />
      <Card {...args} densidade="ultracompacta" titulo="Ultracompacta" />
    </div>
  ),
};

export const ComListaInterna: Story = {
  name: 'Variante · com lista interna',
  parameters: {
    docs: {
      description: {
        story: 'No máximo 5 itens visíveis, com link "Ver todos" para o restante.',
      },
    },
  },
  args: {
    titulo: 'Últimas solicitações',
    subtitulo: 'Maria de Fátima Souza',
    children: (
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
        {[
          { processo: '2025/0481', estado: 'Em Análise' },
          { processo: '2025/0402', estado: 'Aprovado' },
          { processo: '2025/0377', estado: 'Devolvido' },
        ].map((item) => (
          <li key={item.processo} style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <span>{item.processo}</span>
            <StatusIndicator estado={item.estado as 'Em Análise'} size="sm" />
          </li>
        ))}
      </ul>
    ),
    rodape: (
      <Button variant="text" size="small">
        Ver todas
      </Button>
    ),
  },
};

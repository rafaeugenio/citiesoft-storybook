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
          '- **Card clicável com botões dentro.** Com `href` o componente vira um `<a>` que envolve todo o conteúdo, então qualquer botão no rodapé fica dentro do link e o alvo do teclado passa a ser ambíguo. Escolha entre o card inteiro navegável ou o rodapé com ações, nunca os dois.',
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
          'O card inteiro é alvo de navegação, então vira link nativo. Nunca um contêiner genérico com manipulador de clique.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Elemento nativo: alcançável por teclado e anunciado como link.
    await expect(canvas.getByRole('link', { name: /Dados do servidor/ })).toBeVisible();
  },
};

export const Selecionado: Story = {
  name: 'Estado · selecionado',
  args: { selecionado: true },
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

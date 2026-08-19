import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tag, type Severidade } from '../Badge/Badge';
import { Carousel, type CarouselItem } from './Carousel';

function Comunicado({
  etiqueta,
  tom,
  titulo,
  resumo,
  data,
}: {
  etiqueta: string;
  tom: Severidade;
  titulo: string;
  resumo: string;
  data: string;
}) {
  return (
    <article
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        gap: 'var(--citie-spacing-2)',
        boxSizing: 'border-box',
        padding: 'var(--citie-spacing-4)',
        border: '1px solid var(--citie-border-default)',
        borderRadius: 'var(--citie-radius-lg)',
        background: 'var(--citie-background-surface)',
        boxShadow: 'var(--citie-shadow-card)',
      }}
    >
      <Tag severity={tom} label={etiqueta} size="sm" />
      <h3
        style={{
          margin: 0,
          fontFamily: 'var(--citie-font-display)',
          fontSize: 'var(--citie-font-size-body-lg)',
          color: 'var(--citie-text-primary)',
        }}
      >
        {titulo}
      </h3>
      <p style={{ margin: 0, fontSize: 'var(--citie-font-size-body-md)' }}>{resumo}</p>
      <p
        style={{
          margin: 'auto 0 0',
          fontSize: 'var(--citie-font-size-body-sm)',
          color: 'var(--citie-text-secondary)',
        }}
      >
        {data}
      </p>
    </article>
  );
}

const comunicados: CarouselItem[] = [
  {
    id: 'com-01',
    rotulo: 'Mutirão de consultas especializadas',
    conteudo: (
      <Comunicado
        etiqueta="Atendimento"
        tom="info"
        titulo="Mutirão de consultas especializadas"
        resumo="Cardiologia e oftalmologia com atendimento ampliado nas unidades de referência."
        data="Publicado em 04/08/2025"
      />
    ),
  },
  {
    id: 'com-02',
    rotulo: 'Campanha de vacinação contra a gripe',
    conteudo: (
      <Comunicado
        etiqueta="Campanha"
        tom="success"
        titulo="Vacinação contra a gripe"
        resumo="Idosos e gestantes têm prioridade em todas as salas de vacina do município."
        data="Publicado em 07/08/2025"
      />
    ),
  },
  {
    id: 'com-03',
    rotulo: 'Novo prazo de prestação de contas',
    conteudo: (
      <Comunicado
        etiqueta="Prazo"
        tom="warn"
        titulo="Prestação de contas do processo 2025/0481"
        resumo="A comprovação de diárias de TFD passa a ser entregue até o dia 10 da competência seguinte."
        data="Publicado em 11/08/2025"
      />
    ),
  },
  {
    id: 'com-04',
    rotulo: 'Transporte sanitário intermunicipal',
    conteudo: (
      <Comunicado
        etiqueta="TFD"
        tom="info"
        titulo="Nova rota de transporte sanitário"
        resumo="Saídas semanais para a capital passam a incluir embarque no distrito sede."
        data="Publicado em 12/08/2025"
      />
    ),
  },
  {
    id: 'com-05',
    rotulo: 'Capacitação das equipes de regulação',
    conteudo: (
      <Comunicado
        etiqueta="Capacitação"
        tom="info"
        titulo="Capacitação das equipes de regulação"
        resumo="Servidor Maria de Fátima Souza conduz a oficina sobre classificação de risco."
        data="Publicado em 13/08/2025"
      />
    ),
  },
  {
    id: 'com-06',
    rotulo: 'Aviso de manutenção do sistema',
    conteudo: (
      <Comunicado
        etiqueta="Sistema"
        tom="warn"
        titulo="Manutenção programada"
        resumo="O módulo de lançamento de benefício fica indisponível no sábado, das 8h às 12h."
        data="Publicado em 14/08/2025"
      />
    ),
  },
];

const meta = {
  title: 'Mídia/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Carrossel de comunicados institucionais. Origem: Figma CitieOne, página ❖ Carousel — o set `carousel` traz Direction (Horizontal | Vertical) e o set `carousel-indicator` traz State (Idle | Hover | Active) e Focus. Autoplay e navegação circular não são variantes do arquivo, entram como propriedades de comportamento, como no `p-carousel`. Equivalente PrimeNG: `p-carousel`.',
      },
    },
  },
  args: {
    rotulo: 'Comunicados da Secretaria de Saúde',
    itens: comunicados,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 900, padding: 'var(--citie-spacing-3)' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  name: 'Orientação · horizontal',
  args: { itensPorPagina: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const carrossel = canvas.getByRole('group', { name: 'Comunicados da Secretaria de Saúde' });
    await expect(carrossel).toHaveAttribute('aria-roledescription', 'carrossel');

    // Só a página visível é exposta: os demais slides ficam inert.
    await expect(canvas.getByRole('group', { name: '1 de 6' })).toBeInTheDocument();
    await expect(canvas.queryByRole('group', { name: '4 de 6' })).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Próximos itens' }));
    await expect(canvas.getByRole('group', { name: '4 de 6' })).toBeInTheDocument();
    await expect(canvas.queryByRole('group', { name: '1 de 6' })).not.toBeInTheDocument();
  },
};

export const Vertical: Story = {
  name: 'Orientação · vertical',
  args: { orientacao: 'vertical', itensPorPagina: 1, altura: '220px' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // No vertical o Figma empilha os controles: chevron acima e abaixo do viewport.
    await expect(canvas.getByRole('button', { name: 'Itens anteriores' })).toBeInTheDocument();
    await expect(canvas.getAllByRole('button', { name: /Página \d de 6/ })).toHaveLength(6);

    await userEvent.click(canvas.getByRole('button', { name: 'Próximos itens' }));
    await expect(canvas.getByRole('group', { name: '2 de 6' })).toBeInTheDocument();
  },
};

export const LimitadoNasPontas: Story = {
  name: 'Navegação · limitada nas pontas',
  args: { itensPorPagina: 3, circular: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'Itens anteriores' })).toBeDisabled();

    await userEvent.click(canvas.getByRole('button', { name: 'Próximos itens' }));
    await expect(canvas.getByRole('button', { name: 'Próximos itens' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Itens anteriores' })).toBeEnabled();
  },
};

export const Circular: Story = {
  name: 'Navegação · circular',
  args: { itensPorPagina: 3, circular: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Na primeira página o botão anterior segue ativo e leva para a última.
    await expect(canvas.getByRole('button', { name: 'Itens anteriores' })).toBeEnabled();

    await userEvent.click(canvas.getByRole('button', { name: 'Itens anteriores' }));
    await expect(canvas.getByRole('group', { name: '4 de 6' })).toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Página 2 de 2' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  },
};

export const Indicadores: Story = {
  name: 'Indicadores · seleção direta de página',
  args: { itensPorPagina: 2 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const indicadores = canvas.getAllByRole('button', { name: /Página \d de 3/ });
    await expect(indicadores).toHaveLength(3);
    await expect(indicadores[0]).toHaveAttribute('aria-current', 'true');

    await userEvent.click(canvas.getByRole('button', { name: 'Página 3 de 3' }));
    await expect(canvas.getByRole('button', { name: 'Página 3 de 3' })).toHaveAttribute(
      'aria-current',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Página 1 de 3' })).not.toHaveAttribute(
      'aria-current',
    );
    await expect(canvas.getByRole('group', { name: '5 de 6' })).toBeInTheDocument();
  },
};

export const AutoplayComPausa: Story = {
  name: 'Autoplay · com controle de pausa',
  args: { itensPorPagina: 3, circular: true, autoplayIntervalo: 4000 },
  parameters: {
    docs: {
      description: {
        story:
          'O controle de pausar fica sempre visível e o avanço automático para no hover e no foco. Em `prefers-reduced-motion: reduce` o autoplay nem começa.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const pausa = canvas.getByRole('button', { name: 'Pausar' });
    await userEvent.click(pausa);
    await expect(canvas.getByRole('button', { name: 'Reproduzir' })).toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Reproduzir' }));
    await expect(canvas.getByRole('button', { name: 'Pausar' })).toBeInTheDocument();
  },
};

export const Teclado: Story = {
  name: 'Teclado · setas, Home e End',
  args: { itensPorPagina: 3 },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const viewport = canvas.getByRole('group', { name: 'Itens de Comunicados da Secretaria de Saúde' });
    viewport.focus();
    await expect(viewport).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('group', { name: '4 de 6' })).toBeInTheDocument();

    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('group', { name: '1 de 6' })).toBeInTheDocument();

    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('button', { name: 'Página 2 de 2' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  },
};

export const SemIndicadores: Story = {
  name: 'Indicadores · ocultos',
  args: { itensPorPagina: 3, indicadores: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('button', { name: /^Página/ })).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Próximos itens' })).toBeInTheDocument();
  },
};

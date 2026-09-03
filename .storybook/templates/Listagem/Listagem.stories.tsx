import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Breadcrumb,
  Button,
  FilterBar,
  Identificador,
  Link,
  Pagination,
  Search,
  Select,
  StatusIndicator,
  Table,
  mascararCPF,
  resumoDePaginacao,
  type Coluna,
} from '../../../src';
import { Listagem } from './Listagem';
import {
  DESTINOS,
  PROCESSOS_DA_FILA,
  formatarData,
  type LinhaDoProcesso,
} from '../../fixtures/processos';

/**
 * O template só conhece regiões; as stories mostram a composição com a
 * fonte única do domínio (`fixtures/dominio-tfd.ts`, projetada por
 * `fixtures/processos.ts`): os mesmos processos da consulta e do painel.
 */
const LINHAS = PROCESSOS_DA_FILA.slice(0, 6);
const TOTAL = PROCESSOS_DA_FILA.length;

const IconeOlho = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconeMais = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

/**
 * Ordem das colunas, como na listagem de prontuários: identificador em duas
 * linhas (nome 14 + CPF em mono 12 muted), protocolo, badge de status, data
 * em mono, e a ação por linha gerada pela própria tabela.
 */
const COLUNAS: Coluna<LinhaDoProcesso>[] = [
  {
    chave: 'paciente',
    cabecalho: 'Paciente',
    ordenavel: true,
    render: (linha) => (
      <Identificador principal={linha.paciente} secundario={mascararCPF(linha.cpf)} />
    ),
  },
  {
    chave: 'protocolo',
    cabecalho: 'Protocolo',
    largura: '132px',
    mono: true,
    // Regra fixa: o identificador leva ao detalhe por link, nunca por botão.
    render: (linha) => (
      <Link papel="identificador" href={`#/tfd/solicitacoes/${linha.protocolo}`}>
        {linha.protocolo}
      </Link>
    ),
  },
  { chave: 'destino', cabecalho: 'Destino', render: (linha) => linha.destino },
  {
    chave: 'situacao',
    cabecalho: 'Situação',
    largura: '172px',
    render: (linha) => <StatusIndicator estado={linha.situacao} size="sm" />,
  },
  {
    chave: 'dataViagem',
    cabecalho: 'Data da viagem',
    ordenavel: true,
    largura: '148px',
    mono: true,
    render: (linha) => formatarData(linha.dataViagem),
  },
];

function tabela({ selecionavel = false }: { selecionavel?: boolean } = {}) {
  return (
    <Table
      legenda={`Solicitações de TFD, ${TOTAL} no total`}
      colunas={COLUNAS}
      linhas={LINHAS}
      chaveDaLinha={(linha) => linha.protocolo}
      rotuloDaLinha={(linha) => `solicitação ${linha.protocolo}`}
      selecionavel={selecionavel}
      acoesDaLinha={(linha) => (
        <Button
          variant="text"
          size="small"
          iconOnly
          icon={IconeOlho}
          aria-label={`Abrir solicitação ${linha.protocolo}`}
        />
      )}
      acoesSempreVisiveis
      acoesEmMassa={
        selecionavel
          ? () => (
              <>
                <Button variant="secondary" size="small">
                  Exportar seleção
                </Button>
                <Button variant="danger" size="small">
                  Cancelar selecionadas
                </Button>
              </>
            )
          : undefined
      }
    />
  );
}

const BUSCA = (
  <Search
    label="Buscar por nome ou protocolo"
    placeholder="Buscar por nome ou nº do protocolo"
    size="md"
  />
);

const ESCOPO = (
  <Select
    label="Destino"
    placeholder="Todos os destinos"
    rotuloOculto
    options={DESTINOS.map((destino) => ({ value: destino, label: destino }))}
  />
);

const FILTROS_COMPLETOS = (
  <FilterBar
    controles={
      <>
        {BUSCA}
        <Select
          label="Situação"
          placeholder="Todas"
          options={[
            { value: 'analise', label: 'Em Análise' },
            { value: 'autorizado', label: 'Autorizado' },
          ]}
        />
      </>
    }
    filtros={[{ id: 'situacao', rotulo: 'Situação', valor: 'Em Análise', dimensao: 'select' }]}
    resultado={{ total: TOTAL, substantivo: ['processo', 'processos'] }}
    densidade="compacta"
  />
);

const meta = {
  title: 'Templates/Listagem/Listagem com filtros',
  component: Listagem,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Estrutura da tela de listagem, a mais usada nos sistemas B2G da Citiesoft, recomposta no',
          'Lote 6b sobre a listagem de prontuários do Sismental (`docs/figma-ui-kit.md`).',
          '',
          'Zonas, na ordem de leitura: **1** cabeçalho de página (título 24, subtítulo muted, ação',
          'primária à direita); **2** barra de filtro (busca larga com lupa + select de escopo com',
          'rótulo oculto, os dois de 36px) ou o `FilterBar` completo com chips; **3** barra de ações',
          'em massa, que substitui a zona 2 quando há seleção; **4** tabela em cartão de raio 10 com',
          'identificador em duas linhas, badge de status, datas em mono e ação por linha; **5** rodapé',
          'com paginação à esquerda e "Mostrando 1 a 6 de 24" à direita.',
          '',
          'Componentes do sistema usados nas stories: `Breadcrumb`, `Button`, `Search`, `Select`,',
          '`FilterBar`, `Table` (com `Identificador`, `mascararCPF` e `resumoDePaginacao`),',
          '`StatusIndicator`, `Link`, `Pagination`. Dados de `fixtures/dominio-tfd.ts`, a fonte',
          'única do domínio. O template em si não importa componente nenhum: recebe tudo por slot.',
        ].join('\n'),
      },
    },
    viewport: {
      options: {
        desktopGrande: { name: 'Desktop 1920', styles: { width: '1920px', height: '1080px' } },
        desktop: { name: 'Desktop 1366', styles: { width: '1366px', height: '768px' } },
        tabletCitie: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
        celular: { name: 'Celular 375', styles: { width: '375px', height: '812px' } },
      },
    },
  },
  args: {
    titulo: 'Solicitações de TFD',
    descricao: 'Solicitações de tratamento fora do domicílio encaminhadas pelas unidades de saúde.',
    acaoPrimaria: (
      <Button variant="primary" icon={IconeMais}>
        Nova solicitação
      </Button>
    ),
    busca: BUSCA,
    escopo: ESCOPO,
    tabela: tabela(),
    paginacao: (
      <Pagination
        label="Paginação de solicitações"
        totalRegistros={TOTAL}
        itensPorPagina={6}
        variant="simples"
      />
    ),
    resumo: resumoDePaginacao(1, 6, TOTAL, ['solicitação', 'solicitações']),
  },
} satisfies Meta<typeof Listagem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Estrutura: Story = {
  name: 'Estrutura · listagem do Sismental',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Zona 1: um único `main`, um único `h1` de 24 SemiBold, ação à direita.
    await expect(canvas.getByRole('main')).toBeVisible();
    const titulo = canvas.getByRole('heading', { level: 1, name: 'Solicitações de TFD' });
    await expect(getComputedStyle(titulo).fontSize).toBe('24px');
    await expect(getComputedStyle(titulo).fontWeight).toBe('600');
    const criar = canvas.getByRole('button', { name: 'Nova solicitação' });
    await expect(criar.closest('.citie-tpl-listagem__cabecalho')).not.toBeNull();
    await expect(criar.getBoundingClientRect().left).toBeGreaterThan(titulo.getBoundingClientRect().right);

    // Zona 2: busca e select de escopo com 36px, sem rótulo pintado no select.
    const busca = canvas.getByRole('searchbox', { name: 'Buscar por nome ou protocolo' });
    const escopo = canvas.getByLabelText('Destino');
    await expect(Math.round(busca.closest('.citie-search')!.getBoundingClientRect().height)).toBe(36);
    await expect(Math.round(escopo.getBoundingClientRect().height)).toBe(36);
    await expect(Math.abs(busca.getBoundingClientRect().top - escopo.getBoundingClientRect().top)).toBeLessThanOrEqual(1);
    await expect(busca.getBoundingClientRect().width).toBeGreaterThan(escopo.getBoundingClientRect().width * 2);

    // Zona 4: tabela em cartão de raio 10, identificador em duas linhas, data em mono.
    const cartao = canvasElement.querySelector<HTMLElement>('.citie-table-wrapper')!;
    await expect(getComputedStyle(cartao).borderRadius).toBe('10px');
    await expect(canvas.getByRole('grid', { name: `Solicitações de TFD, ${TOTAL} no total` })).toBeVisible();
    const identificador = canvasElement.querySelector<HTMLElement>('.citie-table__identificador')!;
    await expect(identificador).toHaveTextContent(mascararCPF(LINHAS[0].cpf));
    const data = canvas.getByText(formatarData(LINHAS[0].dataViagem));
    await expect(getComputedStyle(data.closest('.citie-table__conteudo') ?? data).fontFamily).toContain('Red Hat Mono');
    await expect(canvas.getByRole('button', { name: `Abrir solicitação ${LINHAS[0].protocolo}` })).toBeVisible();

    // Zona 5: paginação à esquerda, resumo à direita.
    const paginacao = canvas.getByRole('navigation', { name: 'Paginação de solicitações' });
    const resumo = canvas.getByText(`Mostrando 1 a 6 de ${TOTAL} solicitações`);
    await expect(paginacao.getBoundingClientRect().right).toBeLessThan(resumo.getBoundingClientRect().left);
  },
};

export const ComFilterBar: Story = {
  name: 'Variação · FilterBar com chips',
  args: { busca: undefined, escopo: undefined, filtros: FILTROS_COMPLETOS },
  parameters: {
    docs: {
      description: {
        story:
          'Quando a tela tem mais de um filtro e precisa mostrar o que está aplicado, a zona 2 recebe o `FilterBar` inteiro: controles na linha de cima, chips removíveis e a contagem na de baixo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Filtros da listagem' })).toBeVisible();
    await expect(canvas.queryByRole('search')).toBeNull();
  },
};

export const SelecaoAtiva: Story = {
  name: 'Estado · seleção substitui os filtros',
  args: { selecaoAtiva: true, tabela: tabela({ selecionavel: true }) },
  parameters: {
    docs: {
      description: {
        story:
          'Com `selecaoAtiva`, a zona 2 sai da tela e o espaço fica para a barra de ações em massa, que o `Table` renderiza acima do cabeçalho com o contador de selecionados.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('search')).toBeNull();
    await expect(canvas.getByRole('grid', { name: `Solicitações de TFD, ${TOTAL} no total` })).toBeVisible();
  },
};

export const ForaDoShell: Story = {
  name: 'Variação · com trilha, fora do shell',
  args: {
    trilha: (
      <Breadcrumb
        niveis={[{ rotulo: 'Início', href: '#' }, { rotulo: 'TFD', href: '#' }, { rotulo: 'Solicitações' }]}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dentro do shell a trilha vive na barra superior. Quando a listagem é renderizada sozinha, o slot `trilha` a coloca acima do título.',
      },
    },
  },
};

export const Desktop1920: Story = {
  name: 'Responsivo · 1920',
  globals: { viewport: { value: 'desktopGrande' } },
};

export const Desktop1366: Story = {
  name: 'Responsivo · 1366',
  globals: { viewport: { value: 'desktop' } },
};

export const Tablet768: Story = {
  name: 'Responsivo · 768',
  globals: { viewport: { value: 'tabletCitie' } },
  parameters: {
    docs: {
      description: {
        story:
          'Abaixo de 900px de largura de contêiner, a ação primária ocupa a linha inteira, o select de escopo desce para baixo da busca e o rodapé empilha.',
      },
    },
  },
};

export const Celular375: Story = {
  name: 'Responsivo · 375',
  globals: { viewport: { value: 'celular' } },
  parameters: {
    docs: {
      description: {
        story:
          'Abaixo de 560px o título reduz de escala e a tabela passa a rolar no eixo horizontal, preservando a ordem das colunas.',
      },
    },
  },
};

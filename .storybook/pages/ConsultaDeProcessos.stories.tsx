import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Breadcrumb,
  Button,
  ConfirmDialog,
  EmptyState,
  FilterBar,
  Pagination,
  Search,
  Select,
  StatusIndicator,
  Table,
  mascararCPF,
  type Coluna,
  type FiltroAtivo,
} from '../../src';
import { Listagem } from '../templates/Listagem/Listagem';
import {
  COMPETENCIAS,
  DESTINOS,
  FILTROS_VAZIOS,
  SITUACOES,
  SOLICITACOES,
  SOLICITACOES_LONGAS,
  filtrar,
  formatarData,
  formatarMoeda,
  type FiltrosDaConsulta,
  type SolicitacaoTFD,
} from '../fixtures/processos';

/* ------------------------------------------------------------------ */
/* Ícones das ações de linha                                           */
/* ------------------------------------------------------------------ */

function IconeOlho() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconeLapis() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 20h4l10-10-4-4L4 16v4Z" strokeLinejoin="round" />
      <path d="m14 6 4 4" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Ponte de seleção                                                    */
/* ------------------------------------------------------------------ */

/**
 * O `Table` detém o estado de seleção e só o expõe dentro da barra de ações em
 * massa. A página precisa desse número para esconder a barra de filtros, então
 * um componente sem marcação viaja junto das ações e devolve a seleção para
 * cima em efeito, nunca durante a renderização. Ao desaparecer a barra (nenhuma
 * linha marcada), a limpeza zera a contagem.
 *
 * Isso é contorno de um gap do design system, registrado no relatório: falta ao
 * `Table` uma seleção controlada (`selecionados` + `onSelecaoChange`).
 */
function PonteDeSelecao({
  selecionados,
  onSelecao,
}: {
  selecionados: string[];
  onSelecao: (selecionados: string[]) => void;
}) {
  const assinatura = selecionados.join('|');

  useEffect(() => {
    onSelecao(assinatura ? assinatura.split('|') : []);
    return () => onSelecao([]);
  }, [assinatura, onSelecao]);

  return null;
}

/* ------------------------------------------------------------------ */
/* A tela                                                              */
/* ------------------------------------------------------------------ */

const TRILHA = (
  <Breadcrumb
    niveis={[
      { rotulo: 'Início', href: '#/' },
      { rotulo: 'TFD', href: '#/tfd' },
      { rotulo: 'Solicitações' },
    ]}
  />
);

/**
 * Ordem fixa das colunas, conforme a spec: seleção, identificador, campos
 * descritivos, campos numéricos e de data, status e ações à direita.
 */
function colunas(): Coluna<SolicitacaoTFD>[] {
  return [
    {
      chave: 'protocolo',
      cabecalho: 'Protocolo',
      ordenavel: true,
      largura: '132px',
      // Regra fixa: o identificador leva ao detalhe por link, nunca por botão.
      render: (linha) => <a href={`#/tfd/solicitacoes/${linha.protocolo}`}>{linha.protocolo}</a>,
    },
    { chave: 'paciente', cabecalho: 'Paciente', render: (linha) => linha.paciente },
    {
      chave: 'cpf',
      cabecalho: 'CPF',
      largura: '128px',
      // CPF sempre mascarado na listagem; valor completo só no detalhe.
      render: (linha) => mascararCPF(linha.cpf),
    },
    { chave: 'destino', cabecalho: 'Destino', render: (linha) => linha.destino },
    { chave: 'unidade', cabecalho: 'Unidade de origem', render: (linha) => linha.unidade },
    {
      chave: 'valorDiarias',
      cabecalho: 'Diárias',
      alinhamento: 'direita',
      ordenavel: true,
      largura: '128px',
      render: (linha) => formatarMoeda(linha.valorDiarias),
    },
    {
      chave: 'dataViagem',
      cabecalho: 'Data da viagem',
      ordenavel: true,
      largura: '148px',
      render: (linha) => formatarData(linha.dataViagem),
    },
    {
      chave: 'situacao',
      cabecalho: 'Situação',
      largura: '164px',
      render: (linha) => <StatusIndicator estado={linha.situacao} size="sm" />,
    },
    {
      chave: 'acoes',
      cabecalho: 'Ações',
      alinhamento: 'direita',
      largura: '104px',
      // A coluna de ações fica à direita e nunca recebe ordenação nem filtro.
      render: (linha) => (
        <>
          <Button
            variant="text"
            size="small"
            iconOnly
            icon={<IconeOlho />}
            aria-label={`Abrir solicitação ${linha.protocolo}`}
          />
          <Button
            variant="text"
            size="small"
            iconOnly
            icon={<IconeLapis />}
            aria-label={`Editar solicitação ${linha.protocolo}`}
          />
        </>
      ),
    },
  ];
}

export interface ConsultaDeProcessosProps {
  /** Conjunto de partida da tela. */
  dados?: SolicitacaoTFD[];
  /** Primeiro carregamento: skeleton nas linhas, cabeçalho e filtros de pé. */
  carregando?: boolean;
  /** Falha na busca dos registros. */
  erro?: boolean;
  /** O perfil autenticado não enxerga solicitações de TFD. */
  semPermissao?: boolean;
  filtrosIniciais?: FiltrosDaConsulta;
}

export function ConsultaDeProcessos({
  dados = SOLICITACOES,
  carregando = false,
  erro = false,
  semPermissao = false,
  filtrosIniciais = FILTROS_VAZIOS,
}: ConsultaDeProcessosProps) {
  const [registros, setRegistros] = useState(dados);
  const [filtros, setFiltros] = useState(filtrosIniciais);
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [confirmando, setConfirmando] = useState(false);
  const [pagina, setPagina] = useState(1);
  const [porPagina, setPorPagina] = useState(10);
  // Trocar a chave remonta a tabela e devolve a seleção interna ao estado zero.
  const [versaoDaTabela, setVersaoDaTabela] = useState(0);
  // A busca é um campo não controlado: a chave a reinicia quando o chip sai.
  const [versaoDaBusca, setVersaoDaBusca] = useState(0);

  const encontrados = erro ? [] : filtrar(registros, filtros);
  const daPagina = encontrados.slice((pagina - 1) * porPagina, pagina * porPagina);
  // O rodapé só existe quando há registros para percorrer.
  const temRodape = !carregando && !erro && encontrados.length > 0;

  const chipsAtivos: FiltroAtivo[] = [
    filtros.situacao
      ? { id: 'situacao', rotulo: 'Situação', valor: filtros.situacao, dimensao: 'select' as const }
      : null,
    filtros.destino
      ? { id: 'destino', rotulo: 'Destino', valor: filtros.destino, dimensao: 'select' as const }
      : null,
    filtros.competencia
      ? {
          id: 'competencia',
          rotulo: 'Competência',
          valor:
            COMPETENCIAS.find((item) => item.value === filtros.competencia)?.label ??
            filtros.competencia,
          dimensao: 'data' as const,
        }
      : null,
    filtros.termo.trim().length >= 3
      ? { id: 'termo', rotulo: 'Busca', valor: filtros.termo.trim(), dimensao: 'busca' as const }
      : null,
  ].filter((chip): chip is FiltroAtivo => chip !== null);

  const atualizar = (parcial: Partial<FiltrosDaConsulta>) => {
    setFiltros((atual) => ({ ...atual, ...parcial }));
    setPagina(1);
  };

  const removerChip = (id: string) => {
    if (id === 'termo') setVersaoDaBusca((versao) => versao + 1);
    atualizar({ [id]: '' } as Partial<FiltrosDaConsulta>);
  };

  const limparTudo = () => {
    setVersaoDaBusca((versao) => versao + 1);
    setFiltros(FILTROS_VAZIOS);
    setPagina(1);
  };

  const cancelarSelecionadas = () => {
    setRegistros((atual) =>
      atual.filter((solicitacao) => !selecionados.includes(solicitacao.protocolo)),
    );
    setSelecionados([]);
    setVersaoDaTabela((versao) => versao + 1);
    setConfirmando(false);
  };

  /* --- Estados sem tabela útil ------------------------------------- */

  if (semPermissao) {
    return (
      <Listagem
        trilha={TRILHA}
        titulo="Solicitações de TFD"
        tabela={
          <Table
            legenda="Solicitações de TFD, nenhum registro visível"
            colunas={colunas()}
            linhas={[]}
            chaveDaLinha={(linha) => linha.protocolo}
            densidade="compacta"
            zebra
            semConteudo={
              <EmptyState
                situacao="permissao"
                size="md"
                titulo="Você não tem acesso às solicitações de TFD"
                descricao="A consulta de processos é restrita aos perfis de regulação da Secretaria de Saúde. Peça acesso ao gestor da sua unidade informando sua matrícula."
                acaoPrimaria={{ rotulo: 'Solicitar acesso' }}
              />
            }
          />
        }
      />
    );
  }

  const quantidadeSelecionada = selecionados.length;

  const semConteudo = erro ? (
    <EmptyState
      situacao="erro"
      size="md"
      titulo="Não foi possível carregar as solicitações"
      descricao="A consulta ao serviço de TFD falhou. Tente novamente em alguns instantes; se o erro continuar, informe o código abaixo ao suporte."
      codigoErro="TFD-503"
      acaoPrimaria={{ rotulo: 'Tentar novamente' }}
    />
  ) : chipsAtivos.length > 0 ? (
    // Vazio por filtro: a causa é a busca, então a saída é limpar os filtros.
    <EmptyState
      situacao="busca-sem-resultado"
      size="md"
      titulo="Nenhuma solicitação encontrada com esses filtros"
      descricao="Nenhuma solicitação de TFD combina com a busca e os filtros aplicados. Remova um filtro ou tente um termo mais amplo."
      acaoPrimaria={{ rotulo: 'Limpar filtros', onClick: limparTudo }}
    />
  ) : (
    // Vazio de primeiro uso: nunca oferece "Limpar filtros", e sim a criação.
    <EmptyState
      situacao="primeiro-uso"
      size="md"
      titulo="Nenhuma solicitação de TFD cadastrada"
      descricao="As solicitações de tratamento fora do domicílio aparecem aqui assim que a primeira for registrada pela unidade de origem."
      acaoPrimaria={{ rotulo: 'Nova solicitação' }}
    />
  );

  /* --- Tela completa ----------------------------------------------- */

  return (
    <>
      <Listagem
        trilha={TRILHA}
        titulo="Solicitações de TFD"
        descricao="Solicitações de tratamento fora do domicílio encaminhadas pelas unidades de saúde do estado."
        acaoPrimaria={<Button variant="primary">Nova solicitação</Button>}
        selecaoAtiva={quantidadeSelecionada > 0}
        filtros={
          <FilterBar
            densidade="compacta"
            controles={
              <>
                <Search
                  key={`busca-${versaoDaBusca}`}
                  label="Buscar por protocolo ou nome do paciente"
                  placeholder="Protocolo ou nome do paciente"
                  size="md"
                  valorInicial={filtros.termo}
                  onSearch={(termo) => atualizar({ termo })}
                />
                <Select
                  label="Situação"
                  placeholder="Todas"
                  size="small"
                  options={SITUACOES.map((situacao) => ({ value: situacao, label: situacao }))}
                  onChange={(evento) => atualizar({ situacao: evento.target.value })}
                />
                <Select
                  label="Destino"
                  placeholder="Todos"
                  size="small"
                  options={DESTINOS.map((destino) => ({ value: destino, label: destino }))}
                  onChange={(evento) => atualizar({ destino: evento.target.value })}
                />
                <Select
                  label="Competência"
                  placeholder="Todas"
                  size="small"
                  options={COMPETENCIAS}
                  onChange={(evento) => atualizar({ competencia: evento.target.value })}
                />
              </>
            }
            filtros={chipsAtivos}
            /*
             * O `FilterBar` fecha a frase com "encontrado/encontrados", sempre no
             * masculino. Substantivo feminino sairia como "24 solicitações
             * encontrados", então a contagem usa "processo", que é o termo da
             * própria tela ("Consulta de processos") e concorda com a frase.
             */
            resultado={{ total: encontrados.length, substantivo: ['processo', 'processos'] }}
            onRemover={removerChip}
            onLimparTudo={limparTudo}
          />
        }
        tabela={
          <Table
            key={`tabela-${versaoDaTabela}`}
            legenda={`Solicitações de TFD, ${encontrados.length} ${
              encontrados.length === 1 ? 'registro' : 'registros'
            }`}
            colunas={colunas()}
            linhas={daPagina}
            chaveDaLinha={(linha) => linha.protocolo}
            rotuloDaLinha={(linha) => `solicitação ${linha.protocolo}`}
            densidade="compacta"
            zebra
            selecionavel={!erro}
            carregando={carregando}
            semConteudo={semConteudo}
            acoesEmMassa={
              erro
                ? undefined
                : (marcados) => (
                    <>
                      <PonteDeSelecao selecionados={marcados} onSelecao={setSelecionados} />
                      <Button variant="secondary" size="small">
                        Exportar seleção
                      </Button>
                      <Button variant="danger" size="small" onClick={() => setConfirmando(true)}>
                        Cancelar solicitações
                      </Button>
                    </>
                  )
            }
          />
        }
        itensPorPagina={
          !temRodape ? undefined : (
            <Select
              label="Itens por página"
              placeholder="10"
              size="small"
              options={[
                { value: '10', label: '10' },
                { value: '25', label: '25' },
                { value: '50', label: '50' },
              ]}
              onChange={(evento) => {
                setPorPagina(Number(evento.target.value));
                setPagina(1);
              }}
            />
          )
        }
        paginacao={
          !temRodape ? undefined : (
            <Pagination
              key={`paginacao-${porPagina}`}
              label="Paginação de solicitações de TFD"
              totalRegistros={encontrados.length}
              itensPorPagina={porPagina}
              onPageChange={setPagina}
            />
          )
        }
      />

      {/* Ação destrutiva em lote: a confirmação nomeia o número exato de registros.
          Sem seleção não há o que confirmar, e o diálogo nem chega a existir na
          árvore: evita deixar na tela um texto que fala de "0 solicitações". */}
      {quantidadeSelecionada > 0 ? (
        <ConfirmDialog
          aberto={confirmando}
          variante="danger"
          titulo={
            quantidadeSelecionada === 1
              ? 'Cancelar 1 solicitação de TFD?'
              : `Cancelar ${quantidadeSelecionada} solicitações de TFD?`
          }
          descricao={
            quantidadeSelecionada === 1
              ? 'A solicitação sai da fila de regulação e o paciente precisa ser avisado pela unidade de origem. O cancelamento não pode ser desfeito.'
              : `As ${quantidadeSelecionada} solicitações saem da fila de regulação e os pacientes precisam ser avisados pelas unidades de origem. O cancelamento não pode ser desfeito.`
          }
          rotuloConfirmar="Cancelar solicitações"
          onConfirm={cancelarSelecionadas}
          onClose={() => setConfirmando(false)}
        />
      ) : null}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Stories                                                             */
/* ------------------------------------------------------------------ */

const meta = {
  title: 'Páginas/Processos/Consulta de processos',
  component: ConsultaDeProcessos,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Consulta de solicitações de TFD (Tratamento Fora do Domicílio), instância do',
          'template `Templates/Listagem/Listagem com filtros`.',
          '',
          'Anatomia e regras: `design-system/09-templates/tela-listagem.md` v1.0.0.',
          'Dados fictícios determinísticos em `.storybook/fixtures/processos.ts`;',
          'nenhum dado pessoal real, CPF sempre mascarado na listagem.',
          '',
          'Componentes do sistema: `Breadcrumb`, `Button`, `Search`, `Select`, `FilterBar`,',
          '`Table`, `Skeleton` (pelo estado de carregamento do `Table`), `StatusIndicator`,',
          '`EmptyState`, `Pagination` e `ConfirmDialog`.',
        ].join('\n'),
      },
    },
    viewport: {
      options: {
        celular: { name: 'Celular 375', styles: { width: '375px', height: '812px' } },
      },
    },
  },
} satisfies Meta<typeof ConsultaDeProcessos>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComDados: Story = {
  name: 'Padrão · com dados',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Solicitações de TFD' }),
    ).toBeVisible();
    // O total precisa bater com as fixtures: 24 registros em processos.ts.
    await expect(canvas.getByRole('grid', { name: 'Solicitações de TFD, 24 registros' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: '2025/0481' })).toBeVisible();
    await expect(canvas.getByText('24 processos encontrados')).toBeVisible();
    // A primeira página mostra 10 dos 24; o 11º registro fica para a próxima.
    await expect(canvas.queryByRole('link', { name: '2025/0491' })).toBeNull();
    await expect(canvas.getByText('1-10 de 24 registros')).toBeVisible();
    await expect(
      canvas.getByRole('navigation', { name: 'Paginação de solicitações de TFD' }),
    ).toBeVisible();
  },
};

export const BuscarELimpar: Story = {
  name: 'Fluxo · buscar e limpar filtro',
  parameters: {
    docs: {
      description: {
        story:
          'A busca reduz o conjunto e vira um chip nomeado. Remover o chip devolve a listagem inteira e esvazia o campo de busca.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Buscar pelo nome do paciente', async () => {
      const busca = canvas.getByRole('searchbox', {
        name: 'Buscar por protocolo ou nome do paciente',
      });
      await userEvent.type(busca, 'Maria');

      await expect(canvas.getByText('Maria de Fátima Souza')).toBeVisible();
      await expect(canvas.queryByRole('link', { name: '2025/0482' })).toBeNull();
    });

    await step('Remover o chip da busca', async () => {
      const chip = await canvas.findByRole('button', { name: 'Remover filtro Busca: Maria' });
      await userEvent.click(chip);

      await expect(canvas.getByRole('link', { name: '2025/0482' })).toBeVisible();
      await expect(canvas.queryByRole('button', { name: /Remover filtro Busca/ })).toBeNull();
      await expect(
        canvas.getByRole('searchbox', { name: 'Buscar por protocolo ou nome do paciente' }),
      ).toHaveValue('');
    });
  },
};

export const AcaoEmMassa: Story = {
  name: 'Fluxo · selecionar linhas e cancelar em lote',
  parameters: {
    docs: {
      description: {
        story:
          'Com seleção ativa, a barra de ações em massa substitui a barra de filtros. A ação destrutiva confirma com o número exato de registros antes de executar.',
      },
    },
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);

    await step('Selecionar duas solicitações', async () => {
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Selecionar solicitação 2025/0481' }));
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Selecionar solicitação 2025/0482' }));

      await expect(canvas.getByText('2 selecionados')).toBeVisible();
      // A barra de filtros dá lugar às ações em massa, nunca as duas juntas.
      await expect(canvas.queryByRole('group', { name: 'Filtros da listagem' })).toBeNull();
    });

    await step('Confirmar o cancelamento em lote', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Cancelar solicitações' }));

      const dialogo = await canvas.findByRole('alertdialog', {
        name: 'Cancelar 2 solicitações de TFD?',
      });
      await userEvent.click(
        within(dialogo).getByRole('button', { name: 'Cancelar solicitações' }),
      );

      await expect(canvas.queryByRole('link', { name: '2025/0481' })).toBeNull();
      await expect(canvas.queryByRole('link', { name: '2025/0482' })).toBeNull();
      // Sem seleção, a barra de filtros volta ao lugar.
      await expect(canvas.getByRole('group', { name: 'Filtros da listagem' })).toBeVisible();
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
          'Primeiro acesso: skeleton nas linhas, cabeçalho da tabela e barra de filtros visíveis, sem indicador global. O paginador só aparece quando há o que paginar.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Filtros da listagem' })).toBeVisible();
    await expect(canvas.getByRole('columnheader', { name: /Protocolo/ })).toBeVisible();
    await expect(
      canvas.queryByRole('navigation', { name: 'Paginação de solicitações de TFD' }),
    ).toBeNull();
  },
};

export const VazioPrimeiroUso: Story = {
  name: 'Estado · vazio de primeiro uso',
  args: { dados: [] },
  parameters: {
    docs: {
      description: {
        story:
          'Nada cadastrado ainda. A saída é criar o primeiro registro, e nunca "Limpar filtros": não há filtro aplicado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Nenhuma solicitação de TFD cadastrada')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Limpar filtros' })).toBeNull();
  },
};

export const VazioPorFiltro: Story = {
  name: 'Estado · vazio por filtro',
  args: {
    filtrosIniciais: { ...FILTROS_VAZIOS, situacao: 'Cancelado', destino: 'Teresina' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Existem registros, mas nenhum combina com os filtros. Causa, texto e ação são outros: a saída é limpar os filtros, sem oferecer criação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText('Nenhuma solicitação encontrada com esses filtros')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Limpar filtros' })).toBeVisible();

    // Limpar devolve os 24 registros, provando que o vazio era do filtro.
    await userEvent.click(canvas.getByRole('button', { name: 'Limpar filtros' }));
    await expect(canvas.getByRole('link', { name: '2025/0481' })).toBeVisible();
  },
};

export const ErroDeCarregamento: Story = {
  name: 'Estado · erro de carregamento',
  args: { erro: true },
  parameters: {
    docs: {
      description: {
        story:
          'Falha na consulta: mensagem, código técnico discreto e "Tentar novamente". Cabeçalho e filtros permanecem de pé para o servidor não perder o contexto.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Consulta pelo papel, não pela frase solta: o título do estado vazio é um
    // heading de nível 2 dentro do corpo da tabela.
    await expect(
      await canvas.findByRole('heading', { level: 2, name: /Não foi possível carregar/ }),
    ).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
    await expect(canvas.getByText('TFD-503')).toBeVisible();
    // Cabeçalho e filtros continuam de pé para o servidor não perder o contexto.
    await expect(canvas.getByRole('heading', { level: 1, name: 'Solicitações de TFD' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: 'Filtros da listagem' })).toBeVisible();
    // Sem registros carregados, a contagem não pode afirmar nenhum total.
    await expect(canvas.getByText('0 processos encontrados')).toBeVisible();
  },
};

export const SemPermissao: Story = {
  name: 'Estado · sem permissão',
  args: { semPermissao: true },
  parameters: {
    docs: {
      description: {
        story:
          'O perfil autenticado não enxerga o módulo. Some a ação de criação, some a barra de filtros e o caminho oferecido é pedir acesso.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Você não tem acesso às solicitações de TFD')).toBeVisible();
    await expect(canvas.queryByRole('button', { name: 'Nova solicitação' })).toBeNull();
    await expect(canvas.queryByRole('group', { name: 'Filtros da listagem' })).toBeNull();
  },
};

export const ConteudoLongo: Story = {
  name: 'Conteúdo longo · nomes e valores extensos',
  args: { dados: SOLICITACOES_LONGAS },
  parameters: {
    docs: {
      description: {
        story:
          'Protocolo com sufixo, nome de paciente completo, unidade de origem longa e valor de cinco dígitos: a ordem das colunas se mantém e a tabela rola no eixo horizontal em vez de estourar a tela.',
      },
    },
  },
};

export const Celular: Story = {
  name: 'Responsivo · celular 375',
  globals: { viewport: { value: 'celular' } },
  parameters: {
    docs: {
      description: {
        story:
          'Em contêiner estreito a ação primária ocupa a linha inteira, o rodapé empilha e a tabela rola na horizontal preservando a ordem das colunas.',
      },
    },
  },
};

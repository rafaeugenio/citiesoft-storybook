import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Avatar,
  Breadcrumb,
  Button,
  Card,
  ConfirmDialog,
  type DadosDoToast,
  type EstadoDeFluxo,
  type EventoDaTimeline,
  Menu,
  Message,
  MudancaDeAuditoria,
  Skeleton,
  SkeletonFormulario,
  SkeletonRegion,
  StatusIndicator,
  Tabs,
  Textarea,
  Timeline,
  ToastStack,
} from '../../src';
import { Detalhe } from '../templates/Detalhe/Detalhe';
import { ListaDeCampos } from '../templates/Detalhe/ListaDeCampos';
import {
  COMENTARIOS,
  DADOS_DO_DESLOCAMENTO,
  DADOS_DO_PACIENTE,
  DADOS_FINANCEIROS,
  HISTORICO_CANCELADO,
  HISTORICO_DO_PROCESSO,
  HISTORICO_EXTENSO,
  PACIENTE_NOME_LONGO,
  PROCESSO,
  RELACIONADOS,
  type EventoDoProcesso,
} from '../fixtures/processo-tfd';

/**
 * Primeira mudança auditada do histórico, derivada da própria fixture.
 *
 * A asserção clica no primeiro evento expansível da timeline, então a
 * expectativa precisa sair desse mesmo evento. Escrever "R$ 2.800,00" à mão
 * testaria o que alguém lembrou de digitar: quando a fonte de domínio mudou a
 * tabela de diárias, o literal quebrou e o teste passou a acusar defeito que
 * não existia.
 */
const PRIMEIRA_MUDANCA_AUDITADA = HISTORICO_DO_PROCESSO.find(
  (evento) => (evento.mudancas?.length ?? 0) > 0,
)!.mudancas![0];

/**
 * Detalhe do processo de TFD: instância do template
 * `Templates/Detalhe/Detalhe de registro` com conteúdo e estados reais do
 * domínio B2G. Todo overlay começa fechado.
 */

const TRILHA = (
  <Breadcrumb
    niveis={[
      { rotulo: 'TFD', href: '#' },
      { rotulo: 'Solicitações', href: '#' },
      { rotulo: `Processo ${PROCESSO.numero}` },
    ]}
  />
);

/** Converte o evento da fixture no evento da Timeline, com o diff de auditoria. */
function paraEventoDaTimeline(evento: EventoDoProcesso): EventoDaTimeline {
  const temDetalhe = Boolean(evento.resumo || evento.mudancas);
  return {
    id: evento.id,
    titulo: evento.titulo,
    data: evento.data,
    ator: evento.ator,
    estado: evento.estado,
    realce: evento.realce,
    detalhe: temDetalhe ? (
      <>
        {evento.resumo ? <p>{evento.resumo}</p> : null}
        {evento.mudancas?.map((mudanca) => (
          <MudancaDeAuditoria
            key={mudanca.campo}
            campo={mudanca.campo}
            de={mudanca.de}
            para={mudanca.para}
          />
        ))}
      </>
    ) : undefined,
  };
}

const EMPILHADO = { display: 'grid', gap: 'var(--citie-spacing-4)' } as const;

function AbaDeDados() {
  return (
    <div style={EMPILHADO}>
      <Card titulo="Paciente" subtitulo="Dados cadastrais da solicitante">
        <ListaDeCampos campos={DADOS_DO_PACIENTE} />
      </Card>
      <Card titulo="Deslocamento" subtitulo="Destino, especialidade e acompanhante">
        <ListaDeCampos campos={DADOS_DO_DESLOCAMENTO} />
      </Card>
      <Card
        titulo="Diárias e ajuda de custo"
        subtitulo={`Valores da competência de ${PROCESSO.competencia}`}
      >
        <ListaDeCampos campos={DADOS_FINANCEIROS} />
      </Card>
    </div>
  );
}

function AbaDeRelacionados() {
  return (
    <div style={EMPILHADO}>
      {RELACIONADOS.map((item) => (
        <Card
          key={item.id}
          titulo={item.titulo}
          subtitulo={item.descricao}
          densidade="compacta"
          rodape={<StatusIndicator estado={item.estado} size="sm" />}
        >
          <p style={{ margin: 0 }}>Vinculado ao processo {PROCESSO.numero}.</p>
        </Card>
      ))}
    </div>
  );
}

function Comentarios({ onPublicar }: { onPublicar: () => void }) {
  return (
    <div style={EMPILHADO}>
      {COMENTARIOS.map((comentario) => (
        <Card
          key={comentario.id}
          titulo={comentario.autor}
          subtitulo={`${comentario.papel} · ${comentario.data}`}
          densidade="compacta"
          midia={<Avatar nome={comentario.autor} decorative />}
        >
          <p style={{ margin: 0 }}>{comentario.texto}</p>
        </Card>
      ))}

      <div style={EMPILHADO}>
        <Textarea
          label="Novo comentário"
          helper="Visível para a coordenação de TFD e para a regulação."
          limit={500}
        />
        <div>
          <Button variant="secondary" onClick={onPublicar}>
            Publicar comentário
          </Button>
        </div>
      </div>
    </div>
  );
}

type EstadoDaTela = 'pronto' | 'carregando' | 'erro';

interface TelaProps {
  estadoDaTela?: EstadoDaTela;
  paciente?: string;
  situacao?: EstadoDeFluxo;
  historico?: EventoDoProcesso[];
  /** Perfil de consulta: as ações de escrita somem, em vez de ficarem inertes. */
  podeEditar?: boolean;
  /** Processo cancelado: sem edição, com aviso explícito do bloqueio. */
  cancelado?: boolean;
}

function DetalheDoProcesso({
  estadoDaTela = 'pronto',
  paciente = PROCESSO.paciente,
  situacao = PROCESSO.estado,
  historico = HISTORICO_DO_PROCESSO,
  podeEditar = true,
  cancelado = false,
}: TelaProps) {
  const [confirmando, setConfirmando] = useState(false);
  const [toasts, setToasts] = useState<DadosDoToast[]>([]);

  const dispensar = (id: string) => setToasts((atuais) => atuais.filter((t) => t.id !== id));
  const anunciar = (toast: DadosDoToast) => setToasts((atuais) => [...atuais, toast]);

  const eventos = historico.map(paraEventoDaTimeline);

  const itensDoMenu = [
    { tipo: 'acao' as const, id: 'exportar', rotulo: 'Exportar processo em PDF' },
    ...(podeEditar
      ? [
          { tipo: 'acao' as const, id: 'duplicar', rotulo: 'Duplicar solicitação' },
          { tipo: 'separador' as const, id: 'sep' },
          {
            tipo: 'acao' as const,
            id: 'excluir',
            rotulo: 'Excluir processo',
            destrutivo: true,
            onSelect: () => setConfirmando(true),
          },
        ]
      : []),
  ];

  const corpo =
    estadoDaTela === 'carregando' ? (
      <SkeletonRegion label={`Carregando o processo ${PROCESSO.numero}`}>
        <Tabs
          label="Dimensões do processo"
          abas={[
            { id: 'dados', rotulo: 'Dados', conteudo: <SkeletonFormulario campos={4} /> },
            { id: 'atividade', rotulo: 'Atividade', conteudo: <SkeletonFormulario campos={3} /> },
            { id: 'relacionados', rotulo: 'Relacionados', conteudo: <SkeletonFormulario campos={2} /> },
          ]}
        />
      </SkeletonRegion>
    ) : estadoDaTela === 'erro' ? (
      <Message
        severidade="error"
        titulo="Não foi possível carregar o processo"
        acoes={[{ rotulo: 'Tentar novamente' }]}
      >
        A consulta ao serviço de TFD falhou. Os dados do processo {PROCESSO.numero} não foram
        recuperados.
      </Message>
    ) : (
      <Tabs
        label="Dimensões do processo"
        abas={[
          { id: 'dados', rotulo: 'Dados', conteudo: <AbaDeDados /> },
          {
            id: 'atividade',
            rotulo: 'Atividade',
            contagem: eventos.length,
            conteudo: <Timeline label={`Histórico do processo ${PROCESSO.numero}`} eventos={eventos} />,
          },
          {
            id: 'relacionados',
            rotulo: 'Relacionados',
            contagem: RELACIONADOS.length,
            conteudo: <AbaDeRelacionados />,
          },
        ]}
      />
    );

  const aviso = cancelado ? (
    <Message severidade="warn" titulo="Processo cancelado">
      Cancelado em 20/03/2025 por Laryssa Mendes. O processo fica disponível apenas para consulta e
      a reabertura é feita pela coordenação de TFD.
    </Message>
  ) : !podeEditar ? (
    <Message severidade="info" titulo="Acesso de consulta">
      Seu perfil acompanha o processo sem alterá-lo. Para editar ou excluir, solicite o perfil de
      coordenação de TFD.
    </Message>
  ) : null;

  const carregandoOuErro = estadoDaTela !== 'pronto';

  return (
    <Detalhe
      trilha={TRILHA}
      identidade={carregandoOuErro ? `Processo ${PROCESSO.numero}` : paciente}
      identificacao={
        estadoDaTela === 'carregando' ? (
          <Skeleton forma="linha" width="420px" />
        ) : (
          `Processo ${PROCESSO.numero} · ${PROCESSO.tipo} · ${PROCESSO.trecho}`
        )
      }
      status={
        estadoDaTela === 'carregando' ? (
          <Skeleton forma="linha" width="96px" height="24px" />
        ) : estadoDaTela === 'erro' ? undefined : (
          <StatusIndicator estado={situacao} />
        )
      }
      acaoPrimaria={
        !carregandoOuErro && podeEditar && !cancelado ? (
          <Button>Editar processo</Button>
        ) : undefined
      }
      menuDeAcoes={
        carregandoOuErro ? undefined : (
          <Menu
            modo="popup"
            rotuloDoGatilho="Mais ações"
            label={`Ações do processo ${PROCESSO.numero}`}
            itens={itensDoMenu}
          />
        )
      }
      aviso={aviso}
      corpo={corpo}
      tituloDoCorpo={`Detalhes do processo ${PROCESSO.numero}`}
      comentarios={
        carregandoOuErro ? undefined : (
          <Comentarios
            onPublicar={() =>
              anunciar({
                id: 'toast-comentario',
                severidade: 'success',
                titulo: 'Comentário publicado',
                mensagem: 'A coordenação de TFD foi notificada.',
              })
            }
          />
        )
      }
      overlays={
        <ConfirmDialog
          aberto={confirmando}
          titulo={`Excluir processo ${PROCESSO.numero}?`}
          descricao="Os anexos, o histórico e os lançamentos vinculados serão removidos permanentemente. A paciente precisará abrir uma nova solicitação."
          rotuloConfirmar="Excluir processo"
          onClose={() => setConfirmando(false)}
          onConfirm={() => {
            setConfirmando(false);
            anunciar({
              id: 'toast-exclusao',
              severidade: 'success',
              titulo: `Processo ${PROCESSO.numero} excluído`,
              mensagem: 'Você voltou para a lista de solicitações de TFD.',
              acao: { rotulo: 'Desfazer' },
            });
          }}
        />
      }
      feedback={<ToastStack toasts={toasts} onDismiss={dispensar} />}
    />
  );
}

const meta = {
  title: 'Páginas/Processos/Detalhe do processo',
  component: DetalheDoProcesso,
  tags: ['page'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          `Processo de TFD ${PROCESSO.numero} da paciente ${PROCESSO.paciente}, no template \`Templates/Detalhe/Detalhe de registro\` (spec \`09-templates/tela-detalhe-registro.md\`).`,
          '',
          'A identidade no cabeçalho é o nome da paciente, o dado mais reconhecível, com o número do processo na linha de apoio. "Editar processo" fica sempre visível; "Excluir processo" só existe dentro do menu de ações e abre o ConfirmDialog, com foco inicial em "Cancelar".',
          '',
          'A aba **Atividade** é a trilha de auditoria: cada evento expande para o diff com `MudancaDeAuditoria`, sempre em texto humano (valor em reais, situação por extenso), nunca o identificador interno. A timeline é ordenada do evento mais recente para o mais antigo.',
          '',
          'Comentários aparecem porque o domínio exige: o processo tramita entre a coordenação de TFD, a regulação e o corpo clínico.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof DetalheDoProcesso>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão · com dados',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Maria de Fátima Souza' }),
    ).toBeInTheDocument();
    await expect(canvas.getByText(new RegExp(`Processo ${PROCESSO.numero} · Tratamento Fora do Domicílio`))).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Editar processo' })).toBeInTheDocument();
    // CPF sempre mascarado.
    await expect(
      canvas.getByText(DADOS_DO_PACIENTE.find((campo) => campo.rotulo === 'CPF')!.valor),
    ).toBeVisible();

    // Um h1 e um h2 por zona antes dos h3 dos Cards, sem salto de nível.
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    await expect(
      canvas.getByRole('heading', { level: 2, name: `Detalhes do processo ${PROCESSO.numero}` }),
    ).toBeInTheDocument();
  },
};

export const TrocaDeAbaPeloTeclado: Story = {
  name: 'Fluxo · trocar de aba pelo teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const abaDados = canvas.getByRole('tab', { name: /Dados/ });
    await expect(abaDados).toHaveAttribute('aria-selected', 'true');

    abaDados.focus();
    await userEvent.keyboard('{ArrowRight}');

    const abaAtividade = canvas.getByRole('tab', { name: /Atividade/ });
    await waitFor(() => expect(abaAtividade).toHaveAttribute('aria-selected', 'true'));
    await expect(abaAtividade).toHaveFocus();

    // O painel da aba ativa mostra a timeline do processo.
    await expect(
      canvas.getByRole('list', { name: `Histórico do processo ${PROCESSO.numero}` }),
    ).toBeVisible();

    // Anel: da última aba a seta volta para a primeira.
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await waitFor(() => expect(abaDados).toHaveAttribute('aria-selected', 'true'));
  },
};

export const ExclusaoConfirmada: Story = {
  name: 'Fluxo · excluir pede confirmação',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O menu começa fechado e "Excluir" nunca é botão solto no cabeçalho.
    await expect(canvas.queryByRole('button', { name: 'Excluir processo' })).toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: 'Mais ações' }));
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Excluir processo' }));

    const dialogo = canvasElement.querySelector('dialog')!;
    await expect(dialogo).toHaveAttribute('role', 'alertdialog');
    // O diálogo entra com fade; a asserção espera a animação assentar.
    await waitFor(() =>
      expect(within(dialogo).getByText(`Excluir processo ${PROCESSO.numero}?`)).toBeVisible(),
    );

    // Foco inicial na ação segura, nunca na destrutiva.
    await waitFor(() =>
      expect(within(dialogo).getByRole('button', { name: 'Cancelar' })).toHaveFocus(),
    );

    await userEvent.click(within(dialogo).getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(dialogo.open).toBe(false));
  },
};

export const AuditoriaExpandida: Story = {
  name: 'Fluxo · expandir evento da timeline',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('tab', { name: /Atividade/ }));

    // O escopo é a própria timeline: o valor também aparece na aba "Dados".
    const historico = within(canvas.getByRole('list', { name: `Histórico do processo ${PROCESSO.numero}` }));

    const primeiro = historico.getAllByRole('button', { name: 'Ver detalhes' })[0];
    await expect(primeiro).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(primeiro);

    // O diff de auditoria usa texto humano, nunca o ID interno.
    await expect(historico.getByText(PRIMEIRA_MUDANCA_AUDITADA.de!)).toBeVisible();
    await expect(historico.getByText(PRIMEIRA_MUDANCA_AUDITADA.para!)).toBeVisible();
    await expect(historico.getAllByRole('button', { name: 'Ocultar detalhes' })[0]).toBeVisible();
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: { estadoDaTela: 'carregando' },
  parameters: {
    docs: {
      description: {
        story:
          'Skeleton no cabeçalho e no corpo, com as abas ainda visíveis. O título mantém o número do processo, que já vem da rota, para a tela não ficar sem nome acessível.',
      },
    },
  },
};

export const ErroAoCarregar: Story = {
  name: 'Estado · erro ao carregar',
  args: { estadoDaTela: 'erro' },
  parameters: {
    docs: {
      description: {
        story:
          'Falha na consulta ao serviço de TFD: mensagem crítica com "Tentar novamente". Sem dado carregado não há ação de escrita no cabeçalho.',
      },
    },
  },
};

export const SemPermissaoDeEdicao: Story = {
  name: 'Estado · sem permissão de edição',
  args: { podeEditar: false },
  parameters: {
    docs: {
      description: {
        story:
          'Perfil de consulta: "Editar processo" e "Excluir processo" não aparecem, em vez de ficarem desabilitados sem explicação. A faixa de aviso diz o que falta e a quem pedir. O que o perfil pode fazer, como exportar o PDF, continua no menu.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.queryByRole('button', { name: 'Editar processo' })).toBeNull();
    await expect(canvas.getByText('Acesso de consulta')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Mais ações' }));
    await expect(canvas.queryByRole('menuitem', { name: 'Excluir processo' })).toBeNull();
    await expect(
      canvas.getByRole('menuitem', { name: 'Exportar processo em PDF' }),
    ).toBeInTheDocument();
  },
};

export const ProcessoCancelado: Story = {
  name: 'Estado · registro cancelado',
  args: {
    situacao: 'Cancelado',
    cancelado: true,
    historico: HISTORICO_CANCELADO,
  },
  parameters: {
    docs: {
      description: {
        story:
          'O badge usa o rótulo do glossário, "Cancelado". A edição sai do cabeçalho e o aviso explica quem pode reabrir. O evento de cancelamento abre a timeline com realce crítico.',
      },
    },
  },
};

export const ConteudoLongo: Story = {
  name: 'Conteúdo longo · nome extenso e histórico de um ano',
  args: {
    paciente: PACIENTE_NOME_LONGO,
    historico: HISTORICO_EXTENSO,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Nome de paciente com 60 caracteres e 24 eventos de histórico. O título quebra dentro da coluna sem empurrar as ações do cabeçalho, e a timeline cresce na altura natural da página.',
      },
    },
  },
};

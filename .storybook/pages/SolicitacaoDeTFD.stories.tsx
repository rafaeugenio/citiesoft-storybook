import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  Card,
  ConfirmDialog,
  DatePicker,
  Input,
  Message,
  Select,
  ToastStack,
  type DadosDoToast,
} from '../../src';
import {
  Wizard,
  WizardCampos,
  WizardItem,
  WizardItens,
  WizardResumo,
  type EtapaDoWizard,
  type IndicadorDoWizard,
} from '../templates/Wizard/Wizard';
import {
  ESPECIALIDADES,
  ETAPAS_DA_SOLICITACAO,
  HOJE,
  IDENTIFICACAO_PREENCHIDA,
  MUNICIPIOS_DE_DESTINO,
  MUNICIPIOS_DE_ORIGEM,
  SECRETARIAS,
  SOLICITACAO_COMPLETA,
  SOLICITACAO_COM_TEXTO_LONGO,
  SOLICITACAO_VAZIA,
  TIPOS_DE_ACOMPANHAMENTO,
  TIPOS_DE_TRANSPORTE,
  formatarDataCurta,
  rotuloDaOpcao,
  type DadosDaSolicitacao,
} from '../fixtures/solicitacao-tfd';

type CampoDaSolicitacao = keyof DadosDaSolicitacao;
type ErrosDaEtapa = Partial<Record<CampoDaSolicitacao, string>>;

type CampoDeTexto =
  | 'paciente'
  | 'cpf'
  | 'cartaoSus'
  | 'municipioOrigem'
  | 'secretaria'
  | 'municipioDestino'
  | 'unidade'
  | 'especialidade'
  | 'transporte'
  | 'numeroDoLaudo'
  | 'medicoSolicitante'
  | 'crm'
  | 'acompanhamento';

type CampoDeData = 'dataDaViagem' | 'dataDoLaudo';

/**
 * Validação por etapa. Cada etapa valida só os próprios campos: o wizard nunca
 * cobra da etapa 1 um dado que só existe na etapa 3.
 */
function validarEtapa(indice: number, dados: DadosDaSolicitacao): ErrosDaEtapa {
  const erros: ErrosDaEtapa = {};

  if (indice === 0) {
    if (!dados.paciente.trim()) {
      erros.paciente = 'Informe o nome do paciente como consta no Cartão SUS.';
    }
    if (!dados.cpf.trim()) {
      erros.cpf = 'Informe o CPF do paciente com 11 dígitos.';
    }
    if (!dados.municipioOrigem) {
      erros.municipioOrigem = 'Selecione o município de residência do paciente.';
    }
    if (!dados.secretaria) {
      erros.secretaria = 'Selecione a secretaria responsável pelo encaminhamento.';
    }
  }

  if (indice === 1) {
    if (!dados.municipioDestino) {
      erros.municipioDestino = 'Selecione o município onde o atendimento será realizado.';
    }
    if (!dados.unidade.trim()) {
      erros.unidade = 'Informe a unidade de saúde de destino indicada no laudo.';
    }
    if (!dados.especialidade) {
      erros.especialidade = 'Selecione a especialidade do atendimento solicitado.';
    }
    if (!dados.transporte) {
      erros.transporte = 'Selecione o meio de transporte previsto para o deslocamento.';
    }
    if (!dados.dataDaViagem) {
      erros.dataDaViagem = 'Escolha a data prevista de saída do paciente.';
    }
  }

  if (indice === 2) {
    if (!dados.numeroDoLaudo.trim()) {
      erros.numeroDoLaudo = 'Informe o número do laudo médico, no formato 2025/0000.';
    }
    if (!dados.medicoSolicitante.trim()) {
      erros.medicoSolicitante = 'Informe o nome do médico que assinou o laudo.';
    }
    if (!dados.dataDoLaudo) {
      erros.dataDoLaudo = 'Escolha a data de emissão do laudo.';
    }
    if (!dados.acompanhamento) {
      erros.acompanhamento = 'Informe se o paciente viaja com acompanhante.';
    }
  }

  return erros;
}

interface NovaSolicitacaoProps {
  /** Índice da etapa em que a tela abre (0 a 3). */
  etapaInicial?: number;
  dadosIniciais?: DadosDaSolicitacao;
  indicador?: IndicadorDoWizard;
  /** Simula uma tentativa de avanço já recusada, para a história de erro. */
  tentativaRecusada?: boolean;
  enviandoInicial?: boolean;
  concluidaInicial?: boolean;
}

function NovaSolicitacaoDeTFD({
  etapaInicial = 0,
  dadosIniciais = SOLICITACAO_VAZIA,
  indicador = 'stepper',
  tentativaRecusada = false,
  enviandoInicial = false,
  concluidaInicial = false,
}: NovaSolicitacaoProps) {
  const [indice, setIndice] = useState(etapaInicial);
  const [dados, setDados] = useState(dadosIniciais);
  const [erros, setErros] = useState<ErrosDaEtapa>(
    tentativaRecusada ? validarEtapa(etapaInicial, dadosIniciais) : {},
  );
  const [tentativas, setTentativas] = useState(0);
  const [enviando, setEnviando] = useState(enviandoInicial);
  const [concluida, setConcluida] = useState(concluidaInicial);
  const [saindo, setSaindo] = useState(false);
  const [toasts, setToasts] = useState<DadosDoToast[]>(
    concluidaInicial
      ? [
          {
            id: 'conclusao',
            severidade: 'success',
            titulo: 'Solicitação de TFD enviada para análise',
            mensagem: 'Protocolo 2026/0184. A regulação responde em até 5 dias úteis.',
            acao: { rotulo: 'Acompanhar solicitação' },
          },
        ]
      : [],
  );

  const camposRef = useRef<HTMLDivElement>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  useEffect(() => {
    // Avanço recusado: o foco vai para o primeiro campo inválido, não para a
    // mensagem, que já é anunciada por conta própria.
    if (tentativas === 0) return;
    camposRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [tentativas]);

  const ultima = indice === ETAPAS_DA_SOLICITACAO.length - 1;

  // Corrigiu o campo: o bloqueio daquele erro sai imediatamente.
  const limparErro = (campo: CampoDaSolicitacao) =>
    setErros((atual) => {
      if (!(campo in atual)) return atual;
      const proximo = { ...atual };
      delete proximo[campo];
      return proximo;
    });

  const atualizar = (campo: CampoDeTexto, valor: string) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    limparErro(campo);
  };

  const atualizarData = (campo: CampoDeData, valor: Date) => {
    setDados((atual) => ({ ...atual, [campo]: valor }));
    limparErro(campo);
  };

  const avancar = () => {
    if (ultima) {
      setEnviando(true);
      temporizador.current = setTimeout(() => {
        setEnviando(false);
        setConcluida(true);
        setToasts([
          {
            id: 'conclusao',
            severidade: 'success',
            titulo: 'Solicitação de TFD enviada para análise',
            mensagem: 'Protocolo 2026/0184. A regulação responde em até 5 dias úteis.',
            acao: { rotulo: 'Acompanhar solicitação' },
          },
        ]);
      }, 900);
      return;
    }

    const encontrados = validarEtapa(indice, dados);
    if (Object.keys(encontrados).length > 0) {
      setErros(encontrados);
      setTentativas((atual) => atual + 1);
      return;
    }

    setErros({});
    setIndice((atual) => atual + 1);
  };

  const voltar = () => {
    // Voltar nunca descarta o preenchido: só o índice muda.
    setErros({});
    setIndice((atual) => Math.max(atual - 1, 0));
  };

  const listaDeErros = Object.values(erros);

  const etapas: EtapaDoWizard[] = ETAPAS_DA_SOLICITACAO.map((etapa, posicao) => ({
    ...etapa,
    estado:
      posicao < indice ? 'concluida'
      : posicao === indice ? (listaDeErros.length > 0 ? 'erro' : 'atual')
      : 'pendente',
  }));

  const aviso =
    concluida ?
      <Message severidade="success" titulo="Solicitação enviada">
        Protocolo 2026/0184 registrado. Nenhuma alteração é possível enquanto a regulação analisa.
      </Message>
    : listaDeErros.length > 0 ?
      <Message
        severidade="error"
        titulo="Não foi possível avançar"
        erros={listaDeErros}
      >
        Corrija os campos abaixo para seguir para a próxima etapa.
      </Message>
    : null;

  const editar = (posicao: number) => () => {
    setErros({});
    setIndice(posicao);
  };

  return (
    <Wizard
      titulo="Nova solicitação de TFD"
      descricao="Encaminhamento de paciente para Tratamento Fora do Domicílio, da identificação ao envio para a regulação."
      indicador={indicador}
      etapas={etapas}
      etapaAtualId={ETAPAS_DA_SOLICITACAO[indice].id}
      rotuloIndicador="Etapas da solicitação de TFD"
      etapaTitulo={ETAPAS_DA_SOLICITACAO[indice].rotulo}
      etapaDescricao={DESCRICAO_DA_ETAPA[indice]}
      aviso={aviso}
      rotuloAvancar={ultima ? 'Enviar solicitação' : 'Avançar'}
      rotuloEnviando="Enviando solicitação"
      onVoltar={voltar}
      onAvancar={avancar}
      avancarDesabilitado={listaDeErros.length > 0 || concluida}
      enviando={enviando}
      acoesRodape={
        <Button variant="text" disabled={enviando || concluida} onClick={() => setSaindo(true)}>
          Sair sem enviar
        </Button>
      }
      resumo={
        ultima ?
          <WizardResumo>
            <Card
              titulo="Identificação"
              rodape={<Button variant="text" onClick={editar(0)}>Editar identificação</Button>}
            >
              <WizardItens>
                <WizardItem rotulo="Paciente" valor={dados.paciente || 'Não informado'} />
                <WizardItem rotulo="CPF" valor={dados.cpf || 'Não informado'} />
                <WizardItem rotulo="Cartão SUS" valor={dados.cartaoSus || 'Não informado'} />
                <WizardItem
                  rotulo="Município de origem"
                  valor={rotuloDaOpcao(MUNICIPIOS_DE_ORIGEM, dados.municipioOrigem)}
                />
                <WizardItem
                  rotulo="Secretaria responsável"
                  valor={rotuloDaOpcao(SECRETARIAS, dados.secretaria)}
                />
              </WizardItens>
            </Card>

            <Card
              titulo="Deslocamento"
              rodape={<Button variant="text" onClick={editar(1)}>Editar deslocamento</Button>}
            >
              <WizardItens>
                <WizardItem
                  rotulo="Município de destino"
                  valor={rotuloDaOpcao(MUNICIPIOS_DE_DESTINO, dados.municipioDestino)}
                />
                <WizardItem rotulo="Unidade de saúde" valor={dados.unidade || 'Não informada'} />
                <WizardItem
                  rotulo="Especialidade"
                  valor={rotuloDaOpcao(ESPECIALIDADES, dados.especialidade)}
                />
                <WizardItem
                  rotulo="Transporte"
                  valor={rotuloDaOpcao(TIPOS_DE_TRANSPORTE, dados.transporte)}
                />
                <WizardItem rotulo="Saída prevista" valor={formatarDataCurta(dados.dataDaViagem)} />
              </WizardItens>
            </Card>

            <Card
              titulo="Documentos"
              rodape={<Button variant="text" onClick={editar(2)}>Editar documentos</Button>}
            >
              <WizardItens>
                <WizardItem rotulo="Laudo médico" valor={dados.numeroDoLaudo || 'Não informado'} />
                <WizardItem
                  rotulo="Médico solicitante"
                  valor={dados.medicoSolicitante || 'Não informado'}
                />
                <WizardItem rotulo="CRM" valor={dados.crm || 'Não informado'} />
                <WizardItem rotulo="Emissão do laudo" valor={formatarDataCurta(dados.dataDoLaudo)} />
                <WizardItem
                  rotulo="Acompanhante"
                  valor={rotuloDaOpcao(TIPOS_DE_ACOMPANHAMENTO, dados.acompanhamento)}
                />
              </WizardItens>
            </Card>
          </WizardResumo>
        : undefined
      }
      overlays={
        <>
          <ConfirmDialog
            aberto={saindo}
            titulo="Descartar a solicitação de TFD?"
            descricao="Os dados preenchidos nas etapas anteriores serão perdidos e a solicitação não chega à regulação."
            rotuloConfirmar="Descartar solicitação"
            onConfirm={() => {
              setSaindo(false);
              setDados(SOLICITACAO_VAZIA);
              setErros({});
              setIndice(0);
            }}
            onClose={() => setSaindo(false)}
          />
          <ToastStack
            toasts={toasts}
            onDismiss={(id) => setToasts((atual) => atual.filter((toast) => toast.id !== id))}
          />
        </>
      }
    >
      {indice === 0 ? (
        <WizardCampos ref={camposRef}>
          <Input
            label="Nome do paciente"
            required
            value={dados.paciente}
            error={erros.paciente}
            helper="Como consta no Cartão SUS."
            onChange={(evento) => atualizar('paciente', evento.target.value)}
          />
          <Input
            label="CPF do paciente"
            required
            value={dados.cpf}
            error={erros.cpf}
            helper="Ex.: 000.000.000-00"
            onChange={(evento) => atualizar('cpf', evento.target.value)}
          />
          <Input
            label="Cartão Nacional de Saúde"
            value={dados.cartaoSus}
            helper="15 dígitos, opcional nesta etapa."
            onChange={(evento) => atualizar('cartaoSus', evento.target.value)}
          />
          <Select
            label="Município de origem"
            required
            options={MUNICIPIOS_DE_ORIGEM}
            defaultValue={dados.municipioOrigem}
            error={erros.municipioOrigem}
            placeholder="Selecione o município"
            onChange={(evento) => atualizar('municipioOrigem', evento.target.value)}
          />
          <Select
            label="Secretaria responsável"
            required
            options={SECRETARIAS}
            defaultValue={dados.secretaria}
            error={erros.secretaria}
            placeholder="Selecione a secretaria"
            onChange={(evento) => atualizar('secretaria', evento.target.value)}
          />
        </WizardCampos>
      ) : null}

      {indice === 1 ? (
        <WizardCampos ref={camposRef}>
          <Select
            label="Município de destino"
            required
            options={MUNICIPIOS_DE_DESTINO}
            defaultValue={dados.municipioDestino}
            error={erros.municipioDestino}
            placeholder="Selecione o município"
            onChange={(evento) => atualizar('municipioDestino', evento.target.value)}
          />
          <Input
            label="Unidade de saúde de destino"
            required
            value={dados.unidade}
            error={erros.unidade}
            helper="Nome da unidade indicada no laudo."
            onChange={(evento) => atualizar('unidade', evento.target.value)}
          />
          <Select
            label="Especialidade do atendimento"
            required
            options={ESPECIALIDADES}
            defaultValue={dados.especialidade}
            error={erros.especialidade}
            placeholder="Selecione a especialidade"
            onChange={(evento) => atualizar('especialidade', evento.target.value)}
          />
          <Select
            label="Meio de transporte"
            required
            options={TIPOS_DE_TRANSPORTE}
            defaultValue={dados.transporte}
            error={erros.transporte}
            placeholder="Selecione o transporte"
            onChange={(evento) => atualizar('transporte', evento.target.value)}
          />
          <DatePicker
            label="Data prevista de saída"
            required
            hoje={HOJE}
            valorInicial={dados.dataDaViagem}
            error={erros.dataDaViagem}
            helper="A viagem precisa começar até 30 dias após o laudo."
            onChange={(data) => atualizarData('dataDaViagem', data)}
          />
        </WizardCampos>
      ) : null}

      {indice === 2 ? (
        <WizardCampos ref={camposRef}>
          <Input
            label="Número do laudo médico"
            required
            value={dados.numeroDoLaudo}
            error={erros.numeroDoLaudo}
            helper="Ex.: 2025/0481"
            onChange={(evento) => atualizar('numeroDoLaudo', evento.target.value)}
          />
          <Input
            label="Médico solicitante"
            required
            value={dados.medicoSolicitante}
            error={erros.medicoSolicitante}
            helper="Nome de quem assinou o laudo."
            onChange={(evento) => atualizar('medicoSolicitante', evento.target.value)}
          />
          <Input
            label="CRM do médico solicitante"
            value={dados.crm}
            helper="Ex.: CRM-MA 00000"
            onChange={(evento) => atualizar('crm', evento.target.value)}
          />
          <DatePicker
            label="Data de emissão do laudo"
            required
            hoje={HOJE}
            valorInicial={dados.dataDoLaudo}
            error={erros.dataDoLaudo}
            onChange={(data) => atualizarData('dataDoLaudo', data)}
          />
          <Select
            label="Acompanhante"
            required
            options={TIPOS_DE_ACOMPANHAMENTO}
            defaultValue={dados.acompanhamento}
            error={erros.acompanhamento}
            placeholder="Selecione a condição"
            onChange={(evento) => atualizar('acompanhamento', evento.target.value)}
          />
        </WizardCampos>
      ) : null}
    </Wizard>
  );
}

const DESCRICAO_DA_ETAPA = [
  'Quem é o paciente e de onde ele sai. Nada do deslocamento é decidido aqui.',
  'Para onde o paciente vai, em qual unidade e por qual meio de transporte.',
  'O laudo que sustenta o encaminhamento e a condição de acompanhamento.',
  'Confira as decisões das três etapas antes de enviar para a regulação.',
];

const VIEWPORTS = {
  desktop: { name: '1366 · desktop padrão', styles: { width: '1366px', height: '768px' } },
  celular: { name: '375 · celular', styles: { width: '375px', height: '812px' } },
};

const meta = {
  title: 'Páginas/Processos/Nova solicitação de TFD',
  component: NovaSolicitacaoDeTFD,
  tags: ['page', 'a11y'],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: VIEWPORTS },
    docs: {
      description: {
        component: [
          'Instância do template `Templates/Wizard/Fluxo em etapas` com o fluxo real de encaminhamento para Tratamento Fora do Domicílio: Identificação, Deslocamento, Documentos e Revisão.',
          '',
          '**Por que wizard e não formulário único**: são 14 campos com dependência entre etapas (o laudo referencia o destino, o destino referencia o paciente) e cada bloco tem regra própria de validação. Em tela única, o servidor da regulação erra por sobrecarga.',
          '',
          '**Bloqueio de avanço**: o botão "Avançar" fica ativo enquanto a etapa está intacta, para que a tentativa produza a mensagem de erro em vez de um botão morto sem explicação. Recusado o avanço, os erros aparecem inline, o foco vai para o primeiro campo inválido e "Avançar" fica desabilitado até que todos os campos apontados sejam corrigidos.',
          '',
          '**Nota de implementação**: os `Select` desta página usam `defaultValue` em vez de `value` porque o componente já define `defaultValue=""` internamente; controlá-lo por `value` dispararia o aviso de campo controlado e não controlado do React. O estado da página continua sendo a fonte do resumo e da validação.',
          '',
          '**Dados fictícios**: `.storybook/fixtures/solicitacao-tfd.ts`, com data de referência fixa em 15/03/2026.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof NovaSolicitacaoDeTFD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimeiraEtapa: Story = {
  name: 'Primeira etapa · campos vazios',
  args: { etapaInicial: 0, dadosIniciais: SOLICITACAO_VAZIA },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Identificação');
    await expect(canvas.getByRole('button', { name: 'Voltar' })).toBeDisabled();
    // Etapa futura não aparece antecipadamente: nenhum campo de deslocamento aqui.
    await expect(canvas.queryByLabelText(/Município de destino/)).not.toBeInTheDocument();
  },
};

export const EtapaIntermediariaPreenchida: Story = {
  name: 'Etapa intermediária · preenchida',
  args: { etapaInicial: 1, dadosIniciais: { ...SOLICITACAO_COMPLETA } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Deslocamento');
    await expect(canvas.getByLabelText(/Unidade de saúde de destino/)).toHaveValue(
      'Hospital Universitário Presidente Dutra',
    );
    await expect(canvas.getByRole('button', { name: 'Avançar' })).toBeEnabled();
  },
};

export const EtapaComErroDeValidacao: Story = {
  name: 'Etapa com erro de validação · avanço bloqueado',
  args: { etapaInicial: 1, dadosIniciais: SOLICITACAO_VAZIA, tentativaRecusada: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('alert')).toHaveTextContent('Não foi possível avançar');
    await expect(canvas.getByRole('button', { name: 'Avançar' })).toBeDisabled();
    // A etapa atual aparece "com erro" no stepper, por texto e não só por cor.
    await expect(canvas.getByRole('button', { name: /Deslocamento.*com erro/s })).toBeVisible();
  },
};

export const ResumoFinal: Story = {
  name: 'Resumo final · revisão antes de confirmar',
  args: { etapaInicial: 3, dadosIniciais: SOLICITACAO_COMPLETA },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'Enviar solicitação' })).toBeEnabled();
    await expect(canvas.getByText('Maria de Fátima Souza')).toBeVisible();
    await expect(canvas.getByText('Cardiologia')).toBeVisible();
    await expect(canvas.getByText('08/04/2026')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Editar deslocamento' })).toBeVisible();
  },
};

export const EnvioEmCurso: Story = {
  name: 'Envio em curso',
  args: { etapaInicial: 3, dadosIniciais: SOLICITACAO_COMPLETA, enviandoInicial: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Ação primária em carregamento (mantém o foco, por isso `aria-disabled`
    // em vez de `disabled`), demais ações desabilitadas.
    const enviar = canvas.getByRole('button', { name: /Enviando solicitação/ });
    await expect(enviar).toHaveAttribute('aria-busy', 'true');
    await expect(enviar).toHaveAttribute('aria-disabled', 'true');
    await expect(canvas.getByRole('button', { name: 'Voltar' })).toBeDisabled();
    await expect(canvas.getByRole('button', { name: 'Sair sem enviar' })).toBeDisabled();
  },
};

export const Concluida: Story = {
  name: 'Concluída · toast de sucesso',
  args: { etapaInicial: 3, dadosIniciais: SOLICITACAO_COMPLETA, concluidaInicial: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O toast entra com animação de opacidade: a asserção espera a entrada
    // terminar, senão ela lê o primeiro quadro, ainda transparente.
    await waitFor(() =>
      expect(canvas.getByText('Solicitação de TFD enviada para análise')).toBeVisible(),
    );
    await expect(canvas.getByRole('button', { name: 'Enviar solicitação' })).toBeDisabled();
  },
};

export const NavegarEntreEtapas: Story = {
  name: 'Avançar e voltar preservando o preenchido',
  args: { etapaInicial: 0, dadosIniciais: IDENTIFICACAO_PREENCHIDA },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Avançar' }));

    // O foco acompanha a troca de etapa, em vez de ficar preso no rodapé.
    await waitFor(() => expect(canvas.getByRole('group', { name: 'Deslocamento' })).toHaveFocus());

    const especialidade = canvas.getByLabelText(/Especialidade do atendimento/);
    await userEvent.selectOptions(especialidade, 'oncologia');

    await userEvent.click(canvas.getByRole('button', { name: 'Voltar' }));
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Identificação');
    // Voltar nunca descarta o que já foi preenchido.
    await expect(canvas.getByLabelText(/Nome do paciente/)).toHaveValue('Maria de Fátima Souza');

    await userEvent.click(canvas.getByRole('button', { name: 'Avançar' }));
    await expect(canvas.getByLabelText(/Especialidade do atendimento/)).toHaveValue('oncologia');
  },
};

export const BloqueioAoAvancar: Story = {
  name: 'Tentar avançar com etapa inválida',
  args: { etapaInicial: 0, dadosIniciais: SOLICITACAO_VAZIA },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Avançar' }));

    // Continua na mesma etapa, com o motivo explicado e o foco no campo a corrigir.
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Identificação');
    await expect(canvas.getByRole('alert')).toHaveTextContent(
      'Informe o nome do paciente como consta no Cartão SUS.',
    );
    await waitFor(() => expect(canvas.getByLabelText(/Nome do paciente/)).toHaveFocus());
    await expect(canvas.getByRole('button', { name: 'Avançar' })).toBeDisabled();

    // Corrigir um campo apaga o erro dele, mas o avanço só volta quando todos
    // os campos apontados forem resolvidos.
    await userEvent.type(canvas.getByLabelText(/Nome do paciente/), 'Maria de Fátima Souza');
    await expect(canvas.getByRole('alert')).not.toHaveTextContent(
      'Informe o nome do paciente como consta no Cartão SUS.',
    );
    await expect(canvas.getByRole('button', { name: 'Avançar' })).toBeDisabled();

    await userEvent.type(canvas.getByLabelText(/CPF do paciente/), '045.812.330-91');
    await userEvent.selectOptions(canvas.getByLabelText(/Município de origem/), 'imperatriz');
    await userEvent.selectOptions(canvas.getByLabelText(/Secretaria responsável/), 'ses');

    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Avançar' })).toBeEnabled();
  },
};

export const DescartarAoSair: Story = {
  name: 'Sair no meio do fluxo · confirmação de descarte',
  args: { etapaInicial: 1, dadosIniciais: IDENTIFICACAO_PREENCHIDA },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O diálogo começa fechado: só o gatilho aparece.
    await expect(canvas.queryByRole('alertdialog')).not.toBeInTheDocument();

    await userEvent.click(canvas.getByRole('button', { name: 'Sair sem enviar' }));

    const dialogo = canvas.getByRole('alertdialog', { name: 'Descartar a solicitação de TFD?' });
    // O diálogo entra com animação de opacidade, e `showModal` mais o foco
    // inicial só assentam depois do efeito: as duas asserções esperam por isso.
    await waitFor(() => expect(dialogo).toBeVisible());
    // O foco inicial fica na ação segura, nunca na destrutiva.
    await waitFor(() =>
      expect(within(dialogo).getByRole('button', { name: 'Cancelar' })).toHaveFocus(),
    );

    await userEvent.click(within(dialogo).getByRole('button', { name: 'Cancelar' }));
    await waitFor(() => expect(canvas.queryByRole('alertdialog')).not.toBeInTheDocument());
    // Cancelar preserva o fluxo onde estava.
    await expect(canvas.getByRole('heading', { level: 2 })).toHaveTextContent('Deslocamento');
  },
};

export const ConteudoLongo: Story = {
  name: 'Conteúdo longo · nome e unidade extensos',
  args: { etapaInicial: 3, dadosIniciais: SOLICITACAO_COM_TEXTO_LONGO },
};

export const IndicadorEmBarra: Story = {
  name: 'Indicador em barra · variação do template',
  args: { etapaInicial: 1, dadosIniciais: IDENTIFICACAO_PREENCHIDA, indicador: 'barra' },
};

export const Em375: Story = {
  name: 'Responsivo · 375',
  args: { etapaInicial: 0, dadosIniciais: SOLICITACAO_VAZIA, indicador: 'barra' },
  globals: { viewport: { value: 'celular' } },
};

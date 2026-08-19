import { useEffect, useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Button,
  Checkbox,
  DatePicker,
  Input,
  Message,
  RadioGroup,
  Select,
  Skeleton,
  SkeletonRegion,
  Textarea,
  ToastStack,
  Upload,
  type ArquivoDoUpload,
  type DadosDoToast,
} from '../../src';
import {
  CampoDoFormulario,
  Formulario,
  SecaoDoFormulario,
  type ApresentacaoFormulario,
} from '../templates/Formulario/Formulario';
import {
  AUDITORIA_DO_SERVIDOR,
  CARGOS,
  HOJE,
  LOTACOES,
  REGIMES,
  SECRETARIAS,
  SERVIDOR_CONTEUDO_LONGO,
  SERVIDOR_EXISTENTE,
  SERVIDOR_VAZIO,
  SITUACOES,
  TRILHA_DO_CADASTRO,
  UFS,
  type ValoresDoServidor,
} from '../fixtures/cadastro-servidor';

const DOCUMENTOS: ArquivoDoUpload[] = [
  { id: 'doc-1', nome: 'portaria-nomeacao-2025-0481.pdf', tamanho: 184320, estado: 'enviado' },
];

/**
 * Campos obrigatórios do cadastro, na ordem em que aparecem no corpo. A mesma
 * ordem alimenta a lista consolidada da Message, para o servidor percorrer a
 * tela de cima para baixo corrigindo.
 */
const OBRIGATORIOS = [
  { campo: 'nome', rotulo: 'Nome completo', comoResolver: 'informe o nome como consta no ato de nomeação' },
  { campo: 'matricula', rotulo: 'Matrícula', comoResolver: 'informe os oito dígitos da matrícula' },
  { campo: 'cpf', rotulo: 'CPF', comoResolver: 'informe o CPF no formato 000.000.000-00' },
  { campo: 'secretaria', rotulo: 'Secretaria', comoResolver: 'escolha a secretaria de vínculo' },
  { campo: 'lotacao', rotulo: 'Lotação', comoResolver: 'escolha a unidade de lotação' },
  { campo: 'cargo', rotulo: 'Cargo', comoResolver: 'escolha o cargo do ato de nomeação' },
  { campo: 'situacao', rotulo: 'Situação funcional', comoResolver: 'escolha a situação atual' },
  { campo: 'admissao', rotulo: 'Data de admissão', comoResolver: 'escolha a data no formato dd/mm/aaaa' },
  { campo: 'regime', rotulo: 'Regime de contratação', comoResolver: 'escolha um dos três regimes' },
] as const;

type CampoObrigatorio = (typeof OBRIGATORIOS)[number]['campo'];

interface CadastroDeServidorProps {
  apresentacao?: ApresentacaoFormulario;
  /** Criar abre vazio; editar traz o registro e a área de auditoria. */
  modo?: 'criar' | 'editar';
  valoresIniciais?: ValoresDoServidor;
  /** Opções de secretaria, lotação e cargo ainda chegando do servidor. */
  carregandoOpcoes?: boolean;
  /** Requisição de salvamento em curso. */
  salvando?: boolean;
  /** Envio inválido já processado, para a story do estado sem depender do play. */
  errosIniciais?: CampoObrigatorio[];
}

/**
 * Tela de cadastro de servidor do módulo Pessoas.
 *
 * O estado vive aqui porque é comportamento de página: o template não conhece
 * servidor, matrícula nem lotação.
 */
function CadastroDeServidor({
  apresentacao = 'drawer',
  modo = 'criar',
  valoresIniciais = SERVIDOR_VAZIO,
  carregandoOpcoes = false,
  salvando = false,
  errosIniciais = [],
}: CadastroDeServidorProps) {
  const emPagina = apresentacao === 'pagina';
  const [aberto, setAberto] = useState(emPagina);
  const [invalidos, setInvalidos] = useState<CampoObrigatorio[]>(errosIniciais);
  const [enviando, setEnviando] = useState(salvando);
  const [toasts, setToasts] = useState<DadosDoToast[]>([]);
  const [admissao, setAdmissao] = useState<Date | undefined>(
    modo === 'editar' ? new Date(2019, 2, 15) : undefined,
  );

  const valores = useRef<ValoresDoServidor>({ ...valoresIniciais });
  const corpoRef = useRef<HTMLDivElement>(null);

  const escrever = (campo: keyof ValoresDoServidor) => (valor: string) => {
    valores.current = { ...valores.current, [campo]: valor };
  };

  // Envio inválido: o foco vai ao primeiro campo inválido, como a spec exige.
  useEffect(() => {
    if (invalidos.length === 0) return;
    corpoRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [invalidos]);

  const validar = (): CampoObrigatorio[] =>
    OBRIGATORIOS.filter(({ campo }) =>
      campo === 'admissao' ? !admissao : !valores.current[campo as keyof ValoresDoServidor],
    ).map(({ campo }) => campo);

  const salvar = () => {
    const faltando = validar();
    setInvalidos(faltando);
    if (faltando.length > 0) return;

    setEnviando(true);
    window.setTimeout(() => {
      setEnviando(false);
      if (!emPagina) setAberto(false);
      setToasts([
        {
          id: 'servidor-salvo',
          severidade: 'success',
          titulo: 'Servidor cadastrado',
          mensagem: 'Maria de Fátima Souza entrou na listagem de servidores.',
        },
      ]);
    }, 300);
  };

  const invalido = (campo: CampoObrigatorio) =>
    invalidos.includes(campo) ? 'Obrigatório.' : undefined;

  /*
   * Consolidação no topo: a lista completa do que corrigir mora numa única
   * Message, e o campo carrega só o marcador curto. Repetir a mensagem inteira
   * em cada campo é o anti-padrão que a spec de feedback proíbe.
   */
  const aviso =
    invalidos.length > 0 ? (
      <Message
        severidade="error"
        titulo="Corrija os campos obrigatórios"
        erros={OBRIGATORIOS.filter(({ campo }) => invalidos.includes(campo)).map(
          ({ rotulo, comoResolver }) => `${rotulo}: ${comoResolver}.`,
        )}
      >
        O cadastro não foi salvo. Os campos abaixo continuam pendentes.
      </Message>
    ) : null;

  const camposDeVinculo = carregandoOpcoes ? (
    <CampoDoFormulario span={12}>
      <SkeletonRegion label="Carregando secretarias, lotações e cargos">
        <div style={{ display: 'grid', gap: 'var(--citie-spacing-4)' }}>
          <Skeleton forma="campo" />
          <Skeleton forma="campo" />
          <Skeleton forma="campo" />
        </div>
      </SkeletonRegion>
    </CampoDoFormulario>
  ) : (
    <>
      <CampoDoFormulario span={6}>
        <Select
          label="Secretaria"
          required
          options={SECRETARIAS}
          defaultValue={valoresIniciais.secretaria}
          error={invalido('secretaria')}
          onChange={(evento) => escrever('secretaria')(evento.currentTarget.value)}
        />
      </CampoDoFormulario>
      <CampoDoFormulario span={6}>
        <Select
          label="Lotação"
          required
          options={LOTACOES}
          defaultValue={valoresIniciais.lotacao}
          error={invalido('lotacao')}
          onChange={(evento) => escrever('lotacao')(evento.currentTarget.value)}
        />
      </CampoDoFormulario>
      <CampoDoFormulario span={4}>
        <Select
          label="Cargo"
          required
          options={CARGOS}
          defaultValue={valoresIniciais.cargo}
          error={invalido('cargo')}
          onChange={(evento) => escrever('cargo')(evento.currentTarget.value)}
        />
      </CampoDoFormulario>
    </>
  );

  const formulario = (
    <div ref={corpoRef}>
      <Formulario
        apresentacao={apresentacao}
        aberto={aberto}
        titulo={modo === 'editar' ? 'Editar servidor' : 'Novo servidor'}
        subtitulo={
          modo === 'editar'
            ? 'Matrícula 00481297 · Secretaria de Estado da Saúde'
            : 'Os dados alimentam a folha, o TFD e o controle de lotação.'
        }
        trilha={TRILHA_DO_CADASTRO}
        aviso={aviso}
        rotuloSalvar="Salvar servidor"
        rotuloSalvando="Salvando..."
        salvando={enviando}
        auditoria={modo === 'editar' ? AUDITORIA_DO_SERVIDOR : undefined}
        onCancelar={() => setAberto(false)}
        onSalvar={salvar}
      >
        <SecaoDoFormulario titulo="Identificação">
          <CampoDoFormulario span={6}>
            <Input
              label="Nome completo"
              required
              autoComplete="name"
              placeholder="Ex.: Maria de Fátima Souza"
              defaultValue={valoresIniciais.nome}
              error={invalido('nome')}
              onChange={(evento) => escrever('nome')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={3}>
            <Input
              label="Matrícula"
              required
              inputMode="numeric"
              placeholder="Ex.: 00481297"
              helper="Oito dígitos, sem pontos ou traços."
              defaultValue={valoresIniciais.matricula}
              error={invalido('matricula')}
              onChange={(evento) => escrever('matricula')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={3}>
            <Input
              label="CPF"
              required
              inputMode="numeric"
              placeholder="000.000.000-00"
              defaultValue={valoresIniciais.cpf}
              error={invalido('cpf')}
              onChange={(evento) => escrever('cpf')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
        </SecaoDoFormulario>

        <SecaoDoFormulario titulo="Vínculo funcional">
          {camposDeVinculo}
          <CampoDoFormulario span={4}>
            <Select
              label="Situação funcional"
              required
              options={SITUACOES}
              defaultValue={valoresIniciais.situacao}
              error={invalido('situacao')}
              onChange={(evento) => escrever('situacao')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={4}>
            <DatePicker
              label="Data de admissão"
              required
              hoje={HOJE}
              valorInicial={admissao}
              error={invalido('admissao')}
              onChange={setAdmissao}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={12}>
            <RadioGroup
              legend="Regime de contratação"
              name="regime"
              options={REGIMES}
              defaultValue={valoresIniciais.regime || undefined}
              error={invalido('regime')}
              onChange={escrever('regime')}
            />
          </CampoDoFormulario>
        </SecaoDoFormulario>

        <SecaoDoFormulario titulo="Contato e endereço" colapsavel>
          <CampoDoFormulario span={6}>
            <Input
              label="E-mail institucional"
              type="email"
              autoComplete="email"
              placeholder="Ex.: nome.sobrenome@ses.ma.gov.br"
              defaultValue={valoresIniciais.email}
              onChange={(evento) => escrever('email')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={3}>
            <Input
              label="Telefone"
              type="tel"
              autoComplete="tel"
              placeholder="(00) 0000-0000"
              defaultValue={valoresIniciais.telefone}
              onChange={(evento) => escrever('telefone')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={3}>
            <Input
              label="CEP"
              autoComplete="postal-code"
              placeholder="00000-000"
              helper="Preenche logradouro e município automaticamente."
              defaultValue={valoresIniciais.cep}
              onChange={(evento) => escrever('cep')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={8}>
            <Input
              label="Logradouro"
              autoComplete="street-address"
              defaultValue={valoresIniciais.logradouro}
              onChange={(evento) => escrever('logradouro')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={2}>
            <Input
              label="Número"
              inputMode="numeric"
              defaultValue={valoresIniciais.numero}
              onChange={(evento) => escrever('numero')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={2}>
            <Select
              label="UF"
              options={UFS}
              defaultValue={valoresIniciais.uf}
              onChange={(evento) => escrever('uf')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
        </SecaoDoFormulario>

        <SecaoDoFormulario titulo="Complementos" colapsavel>
          <CampoDoFormulario span={12}>
            <Textarea
              label="Observações"
              rows={3}
              limit={500}
              helper="Registre portaria, cessão ou acúmulo de função."
              defaultValue={valoresIniciais.observacoes}
              onChange={(evento) => escrever('observacoes')(evento.currentTarget.value)}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={12}>
            <Upload
              instrucao="Anexe a portaria de nomeação e o documento de identificação."
              arquivos={modo === 'editar' ? DOCUMENTOS : []}
            />
          </CampoDoFormulario>
          <CampoDoFormulario span={12}>
            <Checkbox label="Enviar comunicados institucionais para o e-mail cadastrado" />
          </CampoDoFormulario>
        </SecaoDoFormulario>
      </Formulario>
    </div>
  );

  const pilhaDeToasts = (
    <div style={{ position: 'fixed', insetInlineEnd: 20, insetBlockStart: 20, zIndex: 10 }}>
      <ToastStack toasts={toasts} onDismiss={() => setToasts([])} />
    </div>
  );

  if (emPagina) {
    return (
      <>
        {formulario}
        {pilhaDeToasts}
      </>
    );
  }

  // Contexto de origem: o drawer abre sobre a listagem de servidores.
  return (
    <main>
      <h1 style={{ fontFamily: 'var(--citie-font-display)', fontSize: 22, margin: 0 }}>
        Servidores
      </h1>
      <p style={{ color: 'var(--citie-text-secondary)' }}>
        Secretaria de Estado da Saúde · 128 servidores ativos
      </p>
      <Button onClick={() => setAberto(true)}>
        {modo === 'editar' ? 'Editar servidor' : 'Novo servidor'}
      </Button>
      {formulario}
      {pilhaDeToasts}
    </main>
  );
}

const meta = {
  title: 'Páginas/Pessoas/Cadastro de servidor',
  component: CadastroDeServidor,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Instância do template `Templates/Formulário/Cadastro` com o conteúdo real do',
          'módulo Pessoas. Estrutura da spec `09-templates/tela-formulario-cadastro.md`',
          'v1.0.0; a ordem do corpo segue a regra dela: identificadores primeiro',
          '(nome, matrícula, CPF), obrigatórios em seguida (vínculo funcional), opcionais',
          'por último (contato, endereço e complementos).',
          '',
          'São 19 campos, então as seções são nomeadas e as duas últimas colapsáveis,',
          'como a spec pede acima de 12 campos. Cadastro direto abre em drawer, que é o',
          'padrão default da Citiesoft.',
          '',
          'No envio inválido a lista do que corrigir fica consolidada numa única Message',
          'no topo, e cada campo carrega apenas o marcador curto "Obrigatório." — repetir',
          'a mensagem inteira em cada campo é o anti-padrão que `feedback-toast-alert.md`',
          'proíbe. O foco vai para o primeiro campo inválido.',
        ].join('\n'),
      },
    },
    viewport: {
      options: {
        celular: { name: 'Celular 375', styles: { width: '375px', height: '812px' } },
      },
    },
  },
} satisfies Meta<typeof CadastroDeServidor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CriarVazio: Story = {
  name: 'Estado · vazio para criar',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const painel = canvasElement.querySelector('dialog') as HTMLDialogElement;

    /*
     * O drawer começa fechado. A checagem é pelo estado `open` do `dialog`:
     * `.citie-drawer` declara `display: flex` sem qualificar por `[open]`, e
     * regra de autor vence a folha do navegador, então o painel fechado
     * continua na árvore de acessibilidade.
     */
    await expect(painel.open).toBe(false);

    await userEvent.click(canvas.getByRole('button', { name: 'Novo servidor' }));
    await waitFor(() => expect(painel.open).toBe(true));
    const dentro = within(painel);

    await expect(dentro.getByLabelText(/Nome completo/)).toHaveValue('');
    // Auditoria só existe depois do primeiro salvamento.
    await expect(dentro.queryByLabelText('Auditoria do registro')).toBeNull();
  },
};

export const EditarPreenchido: Story = {
  name: 'Estado · preenchido para editar',
  args: { modo: 'editar', valoresIniciais: SERVIDOR_EXISTENTE },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Editar servidor' }));
    const painel = await canvas.findByRole('dialog');
    const dentro = within(painel);

    await expect(dentro.getByLabelText(/Nome completo/)).toHaveValue('Maria de Fátima Souza');
    await expect(dentro.getByLabelText('Auditoria do registro')).toHaveTextContent(
      'Laryssa Ferreira',
    );
  },
};

export const ErroDeValidacaoConsolidado: Story = {
  name: 'Estado · erro de validação consolidado',
  args: {
    errosIniciais: ['nome', 'matricula', 'cpf', 'secretaria', 'lotacao', 'admissao', 'regime'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Novo servidor' }));
    const painel = await canvas.findByRole('dialog');
    const dentro = within(painel);

    const alerta = await dentro.findByRole('alert');
    await expect(alerta).toHaveTextContent('Corrija os campos obrigatórios');
    // Máximo de 5 itens visíveis: o excedente é resumido pela própria Message.
    await expect(alerta).toHaveTextContent('e mais 2 erros');
  },
};

export const Salvando: Story = {
  name: 'Estado · salvando',
  args: { modo: 'editar', valoresIniciais: SERVIDOR_EXISTENTE, salvando: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Editar servidor' }));
    const painel = await canvas.findByRole('dialog');
    await expect(within(painel).getByRole('button', { name: 'Salvando...' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
  },
};

export const CarregandoOpcoesRemotas: Story = {
  name: 'Estado · carregando opções remotas',
  args: { carregandoOpcoes: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Novo servidor' }));
    const painel = await canvas.findByRole('dialog');
    await expect(
      within(painel).getByLabelText('Carregando secretarias, lotações e cargos'),
    ).toBeVisible();
  },
};

export const ConteudoLongo: Story = {
  name: 'Estado · conteúdo longo',
  args: { modo: 'editar', valoresIniciais: SERVIDOR_CONTEUDO_LONGO },
};

export const PaginaCheia: Story = {
  name: 'Apresentação · página cheia',
  args: { apresentacao: 'pagina', modo: 'editar', valoresIniciais: SERVIDOR_EXISTENTE },
};

export const Celular: Story = {
  name: 'Responsivo · 375',
  args: { apresentacao: 'pagina' },
  globals: { viewport: { value: 'celular' } },
};

export const ValidacaoNoEnvio: Story = {
  name: 'Fluxo · salvar com obrigatório vazio',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Novo servidor' }));
    const painel = await canvas.findByRole('dialog');
    const dentro = within(painel);

    // Nada de aviso antes do envio: a validação roda no envio, não na abertura.
    await expect(dentro.queryByRole('alert')).toBeNull();

    await userEvent.click(dentro.getByRole('button', { name: 'Salvar servidor' }));

    const alerta = await dentro.findByRole('alert');
    await expect(alerta).toHaveTextContent('Nome completo');
    await expect(alerta).toHaveTextContent('Matrícula');

    // O primeiro campo inválido recebe o foco e é anunciado como inválido.
    const nome = dentro.getByLabelText(/Nome completo/);
    await expect(nome).toHaveAttribute('aria-invalid', 'true');
    await expect(nome).toHaveFocus();
  },
};

export const SalvarComSucesso: Story = {
  name: 'Fluxo · preencher e salvar',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const painel = canvasElement.querySelector('dialog') as HTMLDialogElement;

    await userEvent.click(canvas.getByRole('button', { name: 'Novo servidor' }));
    await waitFor(() => expect(painel.open).toBe(true));
    const dentro = within(painel);

    await userEvent.type(dentro.getByLabelText(/Nome completo/), 'Maria de Fátima Souza');
    await userEvent.type(dentro.getByLabelText(/Matrícula/), '00481297');
    await userEvent.type(dentro.getByLabelText(/CPF/), '000.481.297-00');
    await userEvent.selectOptions(dentro.getByLabelText(/Secretaria/), 'ses');
    await userEvent.selectOptions(dentro.getByLabelText(/Lotação/), 'tfd');
    await userEvent.selectOptions(dentro.getByLabelText(/Cargo/), 'analista');
    await userEvent.selectOptions(dentro.getByLabelText(/Situação funcional/), 'ativo');
    await userEvent.click(dentro.getByRole('radio', { name: 'Efetivo' }));

    await userEvent.click(dentro.getByRole('button', { name: 'Escolher data de admissão' }));
    await userEvent.click(await dentro.findByRole('button', { name: 'Hoje' }));

    await userEvent.click(dentro.getByRole('button', { name: 'Salvar servidor' }));

    // Sucesso: o drawer sai de cena e a confirmação chega por Toast. O Toast
    // entra com animação a partir de `opacity: 0`, então a visibilidade é
    // aguardada em vez de conferida no primeiro quadro.
    const toast = await canvas.findByText('Servidor cadastrado');
    await waitFor(() => expect(toast).toBeVisible());
    await waitFor(() => expect(painel.open).toBe(false));
  },
};

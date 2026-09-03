import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, DatePicker, Input, Select, Textarea, Timeline, type EventoDaTimeline } from '../../../src';
import {
  CampoDoFormulario,
  Formulario,
  SecaoDoFormulario,
  type FormularioProps,
} from './Formulario';

/**
 * As stories do template usam rótulos genéricos de propósito: aqui se valida
 * estrutura, ordem das regiões e comportamento responsivo. Conteúdo de domínio
 * é assunto da página `Páginas/Pessoas/Cadastro de servidor`.
 */
const CAMPOS_GENERICOS = (
  <>
    <SecaoDoFormulario titulo="Identificação">
      <CampoDoFormulario span={6}>
        <Input label="Identificador principal" required placeholder="Ex.: 00000000" />
      </CampoDoFormulario>
      <CampoDoFormulario span={3}>
        <Input label="Código" required placeholder="Ex.: 000" />
      </CampoDoFormulario>
      <CampoDoFormulario span={3}>
        <Input label="Referência" required placeholder="Ex.: 0000/0000" />
      </CampoDoFormulario>
    </SecaoDoFormulario>

    <SecaoDoFormulario titulo="Dados obrigatórios">
      <CampoDoFormulario span={6}>
        <Select
          label="Classificação"
          required
          options={[
            { value: 'a', label: 'Opção A' },
            { value: 'b', label: 'Opção B' },
          ]}
        />
      </CampoDoFormulario>
      <CampoDoFormulario span={6}>
        <Select
          label="Vínculo"
          required
          options={[
            { value: 'c', label: 'Opção C' },
            { value: 'd', label: 'Opção D' },
          ]}
        />
      </CampoDoFormulario>
    </SecaoDoFormulario>

    <SecaoDoFormulario titulo="Complementos" colapsavel>
      <CampoDoFormulario span={12}>
        <Textarea label="Observações" rows={3} helper="Campo opcional." />
      </CampoDoFormulario>
    </SecaoDoFormulario>
  </>
);

/**
 * Overlay começa fechado, com gatilho: aberto por padrão ele cobriria a
 * documentação da página de docs.
 */
function ComGatilho({
  rotuloGatilho,
  ...props
}: Omit<FormularioProps, 'aberto'> & { rotuloGatilho: string }) {
  const [aberto, setAberto] = useState(false);

  return (
    <main>
      <h1 style={{ fontFamily: 'var(--citie-font-display)', fontSize: 22, margin: 0 }}>
        Listagem de registros
      </h1>
      <p style={{ color: 'var(--citie-text-secondary)' }}>
        O formulário abre sobre a listagem, sem tirar o contexto de quem cadastra.
      </p>
      <Button onClick={() => setAberto(true)}>{rotuloGatilho}</Button>
      <Formulario {...props} aberto={aberto} onCancelar={() => setAberto(false)} />
    </main>
  );
}

const meta = {
  title: 'Templates/Formulário/Cadastro',
  component: Formulario,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Estrutura da tela de captura de um registro. Anatomia da spec',
          '`09-templates/tela-formulario-cadastro.md` v1.0.0, nesta ordem: cabeçalho',
          '(título e trilha de volta, ou botão de fechar no overlay), corpo em grade de',
          '12 colunas com seções nomeadas, rodapé fixo com "Cancelar" à esquerda e o',
          'primário "Salvar [Entidade]" à direita, e área de auditoria somente leitura',
          'exibida após o primeiro salvamento.',
          '',
          'A spec fixa três apresentações e o template as expõe como variante:',
          '**drawer é o padrão** da Citiesoft para cadastro direto, o Dialog atende',
          'criação mínima de 1 a 3 campos de entidade auxiliar, e a página cheia atende',
          'formulário extenso ou com seções internas.',
          '',
          'Componentes do sistema usados: `Drawer`, `Dialog`, `Breadcrumb`, `Fieldset` e',
          '`Button` na estrutura; `Input`, `Select`, `DatePicker`, `Textarea`, `Upload`,',
          '`Checkbox`, `RadioGroup`, `Message`, `Toast` e `Skeleton` entram pelos slots.',
          '',
          '**Formulário longo (Lote 6b):** com `navegacao`, a página cheia ganha a composição da',
          'identificação do prontuário do Sismental: coluna de seções à esquerda (216px, o ativo em',
          'cor de marca), título da seção em 20 Medium, blocos de campos em cartão com grade de 2 a',
          '4 colunas, rótulo com asterisco no obrigatório, ajuda muted sob o campo, e a barra de',
          'ações fixa no rodapé: "Voltar" à esquerda, "Salvar seção" e "Salvar e Avançar" à direita.',
          'A evolução do registro entra como seção com `Timeline`.',
        ].join('\n'),
      },
    },
    viewport: {
      options: {
        desktopGrande: { name: 'Desktop 1920', styles: { width: '1920px', height: '1080px' } },
        notebook: { name: 'Notebook 1366', styles: { width: '1366px', height: '768px' } },
        tablet: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
        celular: { name: 'Celular 375', styles: { width: '375px', height: '812px' } },
      },
    },
  },
  args: {
    titulo: 'Novo registro',
    rotuloSalvar: 'Salvar registro',
    children: CAMPOS_GENERICOS,
  },
} satisfies Meta<typeof Formulario>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Drawer: Story = {
  name: 'Apresentação · drawer (padrão)',
  render: (args) => <ComGatilho {...args} rotuloGatilho="Novo registro" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const painel = canvasElement.querySelector('dialog') as HTMLDialogElement;

    /*
     * O overlay começa fechado e só o gatilho está em cena. A verificação é
     * pelo estado `open` do próprio `dialog`, não pela ausência do papel
     * `dialog`: `.citie-drawer` declara `display: flex` sem qualificar por
     * `[open]`, e regra de autor vence a folha do navegador, então o painel
     * fechado continua na árvore de acessibilidade.
     */
    await expect(painel.open).toBe(false);

    await userEvent.click(canvas.getByRole('button', { name: 'Novo registro' }));
    await waitFor(() => expect(painel.open).toBe(true));

    // Ordem das regiões da anatomia: título, corpo, rodapé, auditoria.
    const dentro = within(painel);
    await expect(dentro.getByRole('heading', { name: 'Novo registro' })).toBeVisible();
    await expect(dentro.getByRole('button', { name: 'Salvar registro' })).toBeVisible();
  },
};

export const DialogMinimo: Story = {
  name: 'Apresentação · dialog para cadastro mínimo',
  args: {
    apresentacao: 'dialog',
    titulo: 'Nova categoria',
    rotuloSalvar: 'Salvar categoria',
    tamanhoDialog: 'sm',
    children: (
      <>
        <CampoDoFormulario span={12}>
          <Input label="Nome da categoria" required placeholder="Ex.: Diária de campo" />
        </CampoDoFormulario>
        <CampoDoFormulario span={12}>
          <Input label="Sigla" placeholder="Ex.: DC" />
        </CampoDoFormulario>
      </>
    ),
  },
  render: (args) => <ComGatilho {...args} rotuloGatilho="Nova categoria" />,
};

export const PaginaCheia: Story = {
  name: 'Apresentação · página cheia',
  args: {
    apresentacao: 'pagina',
    trilha: [
      { rotulo: 'Módulo', href: '#modulo' },
      { rotulo: 'Listagem', href: '#listagem' },
      { rotulo: 'Novo registro' },
    ],
    subtitulo: 'Formulário extenso: rota própria em vez de drawer.',
  },
};

export const ComAuditoria: Story = {
  name: 'Região · auditoria após o primeiro salvamento',
  args: {
    apresentacao: 'pagina',
    titulo: 'Editar registro',
    rotuloSalvar: 'Salvar registro',
    trilha: [
      { rotulo: 'Módulo', href: '#modulo' },
      { rotulo: 'Listagem', href: '#listagem' },
      { rotulo: 'Editar registro' },
    ],
    auditoria: {
      criadoPor: 'Laryssa Ferreira',
      criadoEm: '12/08/2026 às 14:32',
      alteradoPor: 'Dr. Carlos Andrade',
      alteradoEm: '15/08/2026 às 09:07',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const auditoria = canvas.getByLabelText('Auditoria do registro');
    await expect(auditoria).toHaveTextContent('Laryssa Ferreira');
    // A auditoria vem depois do rodapé de ações, como a anatomia fixa.
    const salvar = canvas.getByRole('button', { name: 'Salvar registro' });
    await expect(
      salvar.compareDocumentPosition(auditoria) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  },
};

export const Salvando: Story = {
  name: 'Estado · enviando',
  args: { apresentacao: 'pagina', salvando: true },
};

const SECOES_DO_LONGO = [
  { id: 'identificacao', rotulo: 'Identificação' },
  { id: 'socioeconomicos', rotulo: 'Socioeconômicos' },
  { id: 'diagnostico', rotulo: 'Diagnóstico e CID' },
  { id: 'medicamentos', rotulo: 'Medicamentos' },
  { id: 'riscos', rotulo: 'Riscos e vigilância' },
  { id: 'evolucao', rotulo: 'Evolução' },
];

const OPCOES_GENERICAS = [
  { value: 'a', label: 'Opção A' },
  { value: 'b', label: 'Opção B' },
];

/** Blocos da seção de identificação: grade de 2 a 4 colunas, como no Sismental. */
const CAMPOS_DO_LONGO = (
  <>
    <SecaoDoFormulario titulo="Identificação">
      <CampoDoFormulario span={6}>
        <Input label="Nome completo" required placeholder="Nome completo do paciente" />
      </CampoDoFormulario>
      <CampoDoFormulario span={6}>
        <Input label="Nome social" placeholder="Nome social" />
      </CampoDoFormulario>
      <CampoDoFormulario span={3}>
        <Input label="CPF" required placeholder="000.000.000-00" />
      </CampoDoFormulario>
      <CampoDoFormulario span={3}>
        <Input label="CNS" placeholder="Cartão Nacional de Saúde" />
      </CampoDoFormulario>
      <CampoDoFormulario span={4}>
        <DatePicker label="Data de nascimento" required hoje={new Date(2026, 6, 15)} />
      </CampoDoFormulario>
      <CampoDoFormulario span={2}>
        <Input label="Idade" readOnly value="42" />
      </CampoDoFormulario>
      <CampoDoFormulario span={3}>
        <Select label="Sexo" required options={OPCOES_GENERICAS} />
      </CampoDoFormulario>
      <CampoDoFormulario span={3}>
        <Select label="Identidade de gênero" options={OPCOES_GENERICAS} />
      </CampoDoFormulario>
      <CampoDoFormulario span={3}>
        <Select label="Raça / Cor" options={OPCOES_GENERICAS} />
      </CampoDoFormulario>
      <CampoDoFormulario span={3}>
        <Input label="Telefone de contato" required placeholder="(00) 00000-0000" />
      </CampoDoFormulario>
      <CampoDoFormulario span={6}>
        <Select label="Município de residência" required options={OPCOES_GENERICAS} />
      </CampoDoFormulario>
      <CampoDoFormulario span={6}>
        <Input
          label="Tempo de acompanhamento"
          readOnly
          value="Sem registro"
          helper="Derivado da data do primeiro acolhimento."
        />
      </CampoDoFormulario>
    </SecaoDoFormulario>

    <SecaoDoFormulario titulo="Endereço">
      <CampoDoFormulario span={9}>
        <Input label="Endereço de residência" required placeholder="Rua, avenida, alameda, povoado" />
      </CampoDoFormulario>
      <CampoDoFormulario span={3}>
        <Input label="Número" required placeholder="Sem número: S/N" />
      </CampoDoFormulario>
      <CampoDoFormulario span={4}>
        <Input label="Complemento" placeholder="Apartamento, bloco, quadra" />
      </CampoDoFormulario>
      <CampoDoFormulario span={4}>
        <Input label="Bairro" required placeholder="Bairro" />
      </CampoDoFormulario>
      <CampoDoFormulario span={4}>
        <Select label="Cidade" required options={OPCOES_GENERICAS} />
      </CampoDoFormulario>
    </SecaoDoFormulario>
  </>
);

const EVOLUCAO: EventoDaTimeline[] = [
  {
    id: 'ev-1',
    titulo: 'Atendimento 15/01/2026',
    data: '2026-01-15T14:20:00',
    ator: 'M. Souza',
    estado: 'concluido',
    detalhe:
      'Usuária compareceu ao acolhimento. Relata redução do uso nas últimas semanas. Mantida medicação; encaminhada ao grupo terapêutico às terças.',
  },
];

function FormularioLongoComEstado(props: Omit<FormularioProps, 'aberto'>) {
  const [secao, setSecao] = useState('identificacao');
  return <Formulario {...props} apresentacao="pagina" navegacao={SECOES_DO_LONGO} secaoAtiva={secao} onSecao={setSecao} />;
}

export const FormularioLongo: Story = {
  name: 'Formulário longo · navegação de seções',
  args: {
    apresentacao: 'pagina',
    titulo: 'Cadastro do prontuário',
    rotuloSalvar: 'Salvar e Avançar',
    children: CAMPOS_DO_LONGO,
  },
  render: (args) => <FormularioLongoComEstado {...args} />,
  parameters: {
    docs: {
      description: {
        story:
          'A identificação do prontuário do Sismental: coluna de seções à esquerda com o ativo em cor de marca, título da seção em 20 Medium, blocos de campos em cartão com grade de 2 a 4 colunas e a barra de ações fixa no rodapé.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Coluna de navegação de 216 (`--citie-largura-da-navegacao-de-secoes`), ativo em marca.
    const navegacao = canvas.getByRole('navigation', { name: 'Seções de Cadastro do prontuário' });
    await expect(Math.round(navegacao.getBoundingClientRect().width)).toBe(216);
    const ativa = canvas.getByRole('button', { name: 'Identificação', current: 'step' });
    const sonda = document.createElement('span');
    sonda.style.color = 'var(--citie-brand-primary)';
    navegacao.appendChild(sonda);
    await expect(getComputedStyle(ativa).color).toBe(getComputedStyle(sonda).color);
    await expect(getComputedStyle(ativa).fontWeight).toBe('500');
    sonda.remove();

    // Título da seção em 20 Medium à direita da coluna.
    const tituloDaSecao = canvas.getByRole('heading', { level: 2, name: 'Identificação' });
    await expect(getComputedStyle(tituloDaSecao).fontSize).toBe('20px');
    await expect(tituloDaSecao.getBoundingClientRect().left).toBeGreaterThan(navegacao.getBoundingClientRect().right);

    // Bloco de campos em cartão de raio 10, sem sombra; obrigatório com asterisco.
    const bloco = canvasElement.querySelector<HTMLElement>('.citie-fieldset')!;
    await expect(getComputedStyle(bloco).borderRadius).toBe('10px');
    await expect(getComputedStyle(bloco).boxShadow).toBe('none');
    const rotulo = canvas.getByText('Nome completo');
    await expect(rotulo.querySelector('.citie-field__required')).toHaveTextContent('*');

    // Rodapé: "Voltar" à esquerda; "Salvar seção" e "Salvar e Avançar" à direita, nesta ordem.
    const voltar = canvas.getByRole('button', { name: 'Voltar' });
    const salvarSecao = canvas.getByRole('button', { name: 'Salvar seção' });
    const avancar = canvas.getByRole('button', { name: 'Salvar e Avançar' });
    await expect(voltar.getBoundingClientRect().right).toBeLessThan(salvarSecao.getBoundingClientRect().left);
    await expect(salvarSecao.getBoundingClientRect().right).toBeLessThan(avancar.getBoundingClientRect().left);

    // Trocar de seção pela navegação muda o título e o `aria-current`.
    await userEvent.click(canvas.getByRole('button', { name: 'Evolução' }));
    await expect(canvas.getByRole('heading', { level: 2, name: 'Evolução' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Evolução' })).toHaveAttribute('aria-current', 'step');
  },
};

export const RegistroDeEvolucao: Story = {
  name: 'Formulário longo · registro de evolução com Timeline',
  args: {
    apresentacao: 'pagina',
    titulo: 'Cadastro do prontuário',
    rotuloSalvar: 'Salvar e Avançar',
    navegacao: SECOES_DO_LONGO,
    secaoAtiva: 'evolucao',
    children: (
      <>
        <SecaoDoFormulario titulo="Nova evolução">
          <CampoDoFormulario span={6}>
            <DatePicker label="Data de atendimento" required hoje={new Date(2026, 6, 15)} />
          </CampoDoFormulario>
          <CampoDoFormulario span={6}>
            <DatePicker label="Data da transcrição" hoje={new Date(2026, 6, 15)} />
          </CampoDoFormulario>
          <CampoDoFormulario span={12}>
            <Textarea label="Evolução" rows={4} limit={1000} placeholder="Transcrição literal do prontuário físico" />
          </CampoDoFormulario>
          <CampoDoFormulario span={12}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="primary">Registrar evolução</Button>
            </div>
          </CampoDoFormulario>
        </SecaoDoFormulario>
        <Timeline label="Evoluções registradas" eventos={EVOLUCAO} />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A evolução do prontuário do Sismental: bloco de captura com a ação dentro do cartão e, abaixo, a `Timeline` (Lote 5) com marcador vazado, título em cor de marca, autoria e corpo em cartão de citação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('heading', { level: 2, name: 'Evolução' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Registrar evolução' })).toBeVisible();
    await expect(canvas.getByText('Atendimento 15/01/2026')).toBeVisible();
  },
};

export const Desktop1920: Story = {
  name: 'Responsivo · 1920',
  args: { apresentacao: 'pagina' },
  globals: { viewport: { value: 'desktopGrande' } },
};

export const Notebook1366: Story = {
  name: 'Responsivo · 1366',
  args: { apresentacao: 'pagina' },
  globals: { viewport: { value: 'notebook' } },
};

export const Tablet768: Story = {
  name: 'Responsivo · 768',
  args: { apresentacao: 'pagina' },
  globals: { viewport: { value: 'tablet' } },
};

export const Celular375: Story = {
  name: 'Responsivo · 375',
  args: { apresentacao: 'pagina' },
  globals: { viewport: { value: 'celular' } },
};

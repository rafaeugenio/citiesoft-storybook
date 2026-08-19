import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, Input, Select, Textarea } from '../../../src';
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

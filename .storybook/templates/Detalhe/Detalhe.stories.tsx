import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  Breadcrumb,
  Button,
  Card,
  Menu,
  StatusIndicator,
  Tabs,
  Timeline,
} from '../../../src';
import { Detalhe } from './Detalhe';
import { ListaDeCampos } from './ListaDeCampos';

/**
 * As stories do template usam conteúdo neutro de propósito: quem carrega o
 * domínio é a página (`Páginas/Processos/Detalhe do processo`).
 */

const TRILHA = (
  <Breadcrumb
    niveis={[
      { rotulo: 'Módulo', href: '#' },
      { rotulo: 'Listagem', href: '#' },
      { rotulo: 'Registro' },
    ]}
  />
);

const MENU_DE_ACOES = (
  <Menu
    modo="popup"
    rotuloDoGatilho="Mais ações"
    label="Ações do registro"
    itens={[
      { tipo: 'acao', id: 'duplicar', rotulo: 'Duplicar registro' },
      { tipo: 'acao', id: 'exportar', rotulo: 'Exportar em PDF' },
      { tipo: 'separador', id: 'sep' },
      { tipo: 'acao', id: 'excluir', rotulo: 'Excluir registro', destrutivo: true },
    ]}
  />
);

const CAMPOS_DEMO = [
  { rotulo: 'Campo A', valor: 'Valor A' },
  { rotulo: 'Campo B', valor: 'Valor B' },
  { rotulo: 'Campo C', valor: 'Valor C', somenteLeitura: true },
];

const TIMELINE = (
  <Timeline
    label="Histórico do registro"
    eventos={[
      {
        id: '2',
        titulo: 'Registro atualizado',
        data: '2025-03-18T14:32:00',
        ator: 'Pessoa responsável',
        estado: 'atual',
        detalhe: 'Corpo expansível do evento.',
      },
      {
        id: '1',
        titulo: 'Registro criado',
        data: '2025-03-12T08:05:00',
        ator: 'Pessoa responsável',
        estado: 'concluido',
      },
    ]}
  />
);

const CORPO_EM_ABAS = (
  <Tabs
    label="Dimensões do registro"
    abas={[
      {
        id: 'dados',
        rotulo: 'Dados',
        conteudo: (
          <Card titulo="Bloco de dados">
            <ListaDeCampos campos={CAMPOS_DEMO} />
          </Card>
        ),
      },
      { id: 'atividade', rotulo: 'Atividade', conteudo: TIMELINE },
      {
        id: 'relacionados',
        rotulo: 'Relacionados',
        contagem: 2,
        conteudo: (
          <Card titulo="Registros vinculados">
            <ListaDeCampos
              campos={[
                { rotulo: 'Vínculo 1', valor: 'Descrição do vínculo' },
                { rotulo: 'Vínculo 2', valor: 'Descrição do vínculo' },
              ]}
            />
          </Card>
        ),
      },
    ]}
  />
);

const meta = {
  title: 'Templates/Detalhe/Detalhe de registro',
  component: Detalhe,
  tags: ['template'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Estrutura da tela de detalhe de um registro único. Anatomia e regras fixas vêm de `design-system/09-templates/tela-detalhe-registro.md` v1.0.0, na ordem: **1.** cabeçalho (trilha, identidade, status e ações), **2.** corpo em abas temáticas ou painel lateral de metadados, **3.** timeline de atividade, **4.** comentários, só em domínio com colaboração assíncrona.',
          '',
          'Regras fixas que o template sustenta: "Editar" fica sempre visível no cabeçalho e nunca dentro de menu; "Excluir" fica sempre dentro do menu de ações e abre um ConfirmDialog; a identidade do registro é o dado mais reconhecível, nunca o identificador técnico isolado.',
          '',
          'Hierarquia de heading: um `h1` (identidade do registro) e um `h2` por zona, incluindo a zona 2, cujo título fica oculto visualmente porque as abas já explicam o corpo. Isso existe porque o `Card` traz `h3` próprio: sem o `h2` da zona 2 a tela saltaria de `h1` para `h3` e reprovaria em `heading-order`. O ajuste é do template, nunca do componente.',
          '',
          'Componentes do sistema usados aqui: `Breadcrumb`, `StatusIndicator`, `Button`, `Menu`, `Tabs`, `Timeline`, `MudancaDeAuditoria`, `Card`, `ConfirmDialog`, `Skeleton`, `Toast` e `Avatar`. O template não conhece o domínio: tudo entra por slot.',
        ].join('\n'),
      },
    },
  },
  args: {
    trilha: TRILHA,
    identidade: 'Nome reconhecível do registro',
    identificacao: 'Código 0000/0000 · Tipo do registro',
    status: <StatusIndicator estado="Em Análise" />,
    acaoPrimaria: <Button>Editar</Button>,
    menuDeAcoes: MENU_DE_ACOES,
    corpo: CORPO_EM_ABAS,
  },
} satisfies Meta<typeof Detalhe>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Viewports do projeto, usados nas stories responsivas. */
const VIEWPORTS = {
  larguraDesktopGrande: { name: '1920 · desktop grande', styles: { width: '1920px', height: '1080px' } },
  larguraNotebook: { name: '1366 · notebook', styles: { width: '1366px', height: '768px' } },
  larguraTablet: { name: '768 · tablet', styles: { width: '768px', height: '1024px' } },
  larguraCelular: { name: '375 · celular', styles: { width: '375px', height: '812px' } },
};

export const ComAbas: Story = {
  name: 'Variante · corpo em abas',
  parameters: {
    docs: {
      description: {
        story:
          'Variante para registro com múltiplas dimensões: "Dados", "Atividade" e "Relacionados". A timeline vive dentro da aba de atividade, então a zona 3 do template fica vazia.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Ordem das zonas: trilha antes do título, título antes do corpo.
    await expect(canvas.getByRole('navigation', { name: 'Trilha de navegação' })).toBeInTheDocument();
    await expect(
      canvas.getByRole('heading', { level: 1, name: 'Nome reconhecível do registro' }),
    ).toBeInTheDocument();
    // Escada sem salto: o h2 da zona 2 fica entre o h1 e o h3 dos Cards.
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    await expect(
      canvas.getByRole('heading', { level: 2, name: 'Detalhes do registro' }),
    ).toBeInTheDocument();

    // "Editar" é botão visível no cabeçalho, nunca item de menu.
    await expect(canvas.getByRole('button', { name: 'Editar' })).toBeInTheDocument();
    // O menu começa fechado: "Excluir" só aparece depois do gatilho.
    await expect(canvas.queryByRole('menuitem', { name: 'Excluir registro' })).toBeNull();

    await userEvent.click(canvas.getByRole('button', { name: 'Mais ações' }));
    await expect(canvas.getByRole('menuitem', { name: 'Excluir registro' })).toBeInTheDocument();
  },
};

export const ComPainelLateral: Story = {
  name: 'Variante · painel lateral de metadados',
  parameters: {
    docs: {
      description: {
        story:
          'Variante para registro simples: os dados ocupam a coluna principal e os metadados ficam num painel lateral de 320px, que desce para baixo do corpo abaixo de 1024px. Aqui a timeline é seção própria (zona 3) e os comentários fecham a tela (zona 4).',
      },
    },
  },
  args: {
    layout: 'painel-lateral',
    corpo: (
      <Card titulo="Bloco de dados">
        <ListaDeCampos campos={CAMPOS_DEMO} />
      </Card>
    ),
    tituloDosMetadados: 'Resumo',
    metadados: (
      <Card densidade="compacta">
        <ListaDeCampos
          campos={[
            { rotulo: 'Criado em', valor: '12/03/2025' },
            { rotulo: 'Atualizado em', valor: '18/03/2025' },
            { rotulo: 'Responsável', valor: 'Pessoa responsável' },
          ]}
        />
      </Card>
    ),
    atividade: TIMELINE,
    comentarios: <p>Slot de comentários, presente só quando o domínio exige colaboração.</p>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('complementary', { name: 'Resumo' })).toBeInTheDocument();

    // Hierarquia sem salto: um h1 no cabeçalho e um h2 por zona, inclusive na
    // zona 2, cujo título fica oculto visualmente. O h3 vem dos Cards.
    await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    const titulos = canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    await expect(titulos).toEqual(['Detalhes do registro', 'Resumo', 'Atividade', 'Comentários']);
  },
};

export const Desktop1920: Story = {
  name: 'Responsivo · 1920',
  parameters: { viewport: { options: VIEWPORTS } },
  globals: { viewport: { value: 'larguraDesktopGrande' } },
};

export const Notebook1366: Story = {
  name: 'Responsivo · 1366',
  parameters: { viewport: { options: VIEWPORTS } },
  globals: { viewport: { value: 'larguraNotebook' } },
};

export const Tablet768: Story = {
  name: 'Responsivo · 768',
  args: { ...ComPainelLateral.args },
  parameters: {
    viewport: { options: VIEWPORTS },
    docs: {
      description: {
        story: 'Abaixo de 1024px o painel de metadados abandona a coluna e desce para baixo do corpo.',
      },
    },
  },
  globals: { viewport: { value: 'larguraTablet' } },
};

export const Celular375: Story = {
  name: 'Responsivo · 375',
  parameters: {
    viewport: { options: VIEWPORTS },
    docs: {
      description: {
        story:
          'No celular a identidade e as ações empilham, e o botão "Editar" continua fora do menu, como manda a regra fixa da spec.',
      },
    },
  },
  globals: { viewport: { value: 'larguraCelular' } },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Button } from '../../atoms/Button/Button';
import { ToggleButton } from '../../atoms/Choice/Choice';
import { Search } from '../../molecules/Search/Search';
import { Table, type Coluna } from '../../organisms/Table/Table';
import { Tag } from '../../atoms/Badge/Badge';
import { SeparadorDeToolbar, Toolbar } from './Toolbar';

/* Ícones do próprio Figma da toolbar: plus, print, upload e chevron-down. */
const IconePlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
  </svg>
);

const IconeImprimir = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 9V4h10v5" strokeLinejoin="round" />
    <path d="M5 9h14v7H5z" strokeLinejoin="round" />
    <path d="M7 16h10v4H7z" strokeLinejoin="round" />
  </svg>
);

const IconeExportar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 16V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M4 17v2a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-2" strokeLinecap="round" />
  </svg>
);

interface Processo {
  numero: string;
  interessado: string;
  secretaria: string;
  competencia: string;
  situacao: { rotulo: string; severidade: 'success' | 'warn' | 'info' };
}

const PROCESSOS: Processo[] = [
  {
    numero: '2025/0481',
    interessado: 'Maria de Fátima Souza',
    secretaria: 'Secretaria de Saúde',
    competencia: '03/2025',
    situacao: { rotulo: 'Em análise', severidade: 'warn' },
  },
  {
    numero: '2025/0479',
    interessado: 'João Batista Lima',
    secretaria: 'Secretaria de Saúde',
    competencia: '03/2025',
    situacao: { rotulo: 'Deferido', severidade: 'success' },
  },
  {
    numero: '2025/0468',
    interessado: 'Antônia Ribeiro da Silva',
    secretaria: 'Secretaria de Assistência Social',
    competencia: '02/2025',
    situacao: { rotulo: 'Aguardando documento', severidade: 'info' },
  },
];

const COLUNAS: Coluna<Processo>[] = [
  { chave: 'numero', cabecalho: 'Processo', ordenavel: true, render: (linha) => linha.numero },
  { chave: 'interessado', cabecalho: 'Interessado', render: (linha) => linha.interessado },
  { chave: 'secretaria', cabecalho: 'Secretaria', render: (linha) => linha.secretaria },
  { chave: 'competencia', cabecalho: 'Competência', render: (linha) => linha.competencia },
  {
    chave: 'situacao',
    cabecalho: 'Situação',
    render: (linha) => <Tag label={linha.situacao.rotulo} severity={linha.situacao.severidade} />,
  },
];

function ListaDeProcessos() {
  return (
    <Table
      legenda={`Processos de TFD, ${PROCESSOS.length} registros`}
      colunas={COLUNAS}
      linhas={PROCESSOS}
      chaveDaLinha={(linha) => linha.numero}
      zebra
    />
  );
}

const meta = {
  title: 'Organismos/Layout/Toolbar',
  component: Toolbar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Barra de ações de uma listagem. Página do Figma CitieOne `6738:49741` (❖ Toolbar), componente `toolbar` com `space-between` e três áreas: botões de ícone no início, busca no centro e ação principal no fim. Equivalente PrimeNG: `p-toolbar` (`start`, `center`, `end`). A toolbar só agrupa: os controles são `Button`, `ToggleButton` e `Search` do próprio design system.',
          '',
          '**Use a Toolbar quando as ações valem para o conjunto que está listado abaixo dela:**',
          'criar registro, exportar, imprimir, alternar densidade, buscar dentro da lista. Ela fica',
          'sempre visível, no topo da área de conteúdo, e é o lugar único onde o servidor procura',
          'esses comandos em toda tela do sistema.',
          '',
          '**Quando não usar:** ações que valem para uma linha específica, que pertencem à coluna de',
          'ações da `Table` ou ao `ContextMenu` da linha (na toolbar elas ficam desabilitadas até',
          'que algo seja selecionado, e o servidor clica sem entender por que nada acontece);',
          'navegação entre módulos ou entre seções, papel do `Menubar`, do `PanelMenu` e do',
          '`Breadcrumb`; filtros com vários critérios e chips do que está ativo, papel do',
          '`FilterBar`, porque a toolbar não guarda estado de filtro nem mostra o que está aplicado;',
          'confirmar ou cancelar um formulário, que pede o rodapé do `Dialog` ou do `Drawer`, junto',
          'do conteúdo que está sendo confirmado; e barra flutuante de ação em massa sobre a',
          'seleção, que a própria `Table` renderiza por `acoesEmMassa`.',
          '',
          'Limite real: a barra quebra em várias linhas quando não cabe (`flex-wrap`), sem esconder',
          'nada em menu de excesso. Acima de seis ou sete controles ela come duas alturas da tela em',
          'monitor de 1366px, que é o parque de máquinas comum no serviço público. Mantenha o',
          'essencial visível e mande o resto para um `Menu` de mais ações.',
        ].join('\n'),
      },
    },
  },
  args: { rotulo: 'Ações da lista de processos' },
} satisfies Meta<typeof Toolbar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Padrão · acima da lista de processos',
  parameters: {
    docs: {
      description: {
        story:
          'Onde a barra vive no produto: colada acima da tabela sobre a qual ela age. O nome acessível cita a lista para que o leitor de tela saiba o alvo das ações.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Toolbar
        {...args}
        inicio={
          <>
            <Button variant="primary" size="small" icon={<IconePlus />}>
              Novo processo
            </Button>
            <SeparadorDeToolbar />
            <Button
              variant="text"
              size="small"
              iconOnly
              icon={<IconeImprimir />}
              aria-label="Imprimir a lista de processos"
            />
            <Button
              variant="text"
              size="small"
              iconOnly
              icon={<IconeExportar />}
              aria-label="Exportar a lista para planilha"
            />
          </>
        }
        centro={
          <Search
            label="Buscar processo por número, interessado ou CPF"
            placeholder="Buscar por número, interessado ou CPF"
            size="sm"
          />
        }
        fim={
          <Button variant="secondary" size="small">
            Filtros
          </Button>
        }
      />
      <ListaDeProcessos />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('toolbar', { name: 'Ações da lista de processos' });

    await expect(barra).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(within(barra).getAllByRole('button')).toHaveLength(4);
    await expect(canvas.getByRole('grid', { name: /Processos de TFD/ })).toBeVisible();
  },
};

export const SemCentro: Story = {
  name: 'Área · início e fim, sem centro',
  parameters: {
    docs: {
      description: {
        story:
          'Quando não há busca, início e fim vão para as pontas e a barra mantém o `space-between` do Figma.',
      },
    },
  },
  render: (args) => (
    <Toolbar
      {...args}
      rotulo="Ações do processo 2025/0481"
      inicio={
        <Button variant="secondary" size="small">
          Voltar para a lista
        </Button>
      }
      fim={
        <>
          <Button variant="text" size="small">
            Salvar rascunho
          </Button>
          <Button variant="primary" size="small">
            Encaminhar para análise
          </Button>
        </>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('toolbar', { name: 'Ações do processo 2025/0481' });

    await expect(within(barra).getAllByRole('button')).toHaveLength(3);
  },
};

export const Alternancia: Story = {
  name: 'Composição · recortes alternáveis',
  parameters: {
    docs: {
      description: {
        story:
          'Recortes que ligam e desligam usam `ToggleButton`, que carrega `aria-pressed`. O estado nunca fica só na cor: o botão pressionado também muda de peso e de fundo.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: '16px' }}>
      <Toolbar
        {...args}
        rotulo="Recortes da lista de processos"
        inicio={
          <>
            <ToggleButton label="Somente os meus" defaultPressed />
            <ToggleButton label="Prazo vencido" />
            <ToggleButton label="Sem documento" />
          </>
        }
        fim={
          <Button variant="text" size="small">
            Limpar recortes
          </Button>
        }
      />
      <ListaDeProcessos />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('button', { name: 'Somente os meus' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );

    await userEvent.click(canvas.getByRole('button', { name: 'Prazo vencido' }));
    await expect(canvas.getByRole('button', { name: 'Prazo vencido' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};

export const Vertical: Story = {
  name: 'Variante · orientação vertical',
  parameters: {
    docs: {
      description: {
        story:
          'Barra lateral de ações do processo aberto. `aria-orientation="vertical"` troca o eixo das setas para cima e para baixo.',
      },
    },
  },
  render: (args) => (
    <div style={{ inlineSize: '240px' }}>
      <Toolbar
        {...args}
        rotulo="Ações do processo aberto"
        orientacao="vertical"
        inicio={
          <>
            <Button variant="secondary" size="small" icon={<IconeImprimir />}>
              Imprimir processo
            </Button>
            <Button variant="secondary" size="small" icon={<IconeExportar />}>
              Exportar anexos
            </Button>
          </>
        }
        fim={
          <Button variant="primary" size="small">
            Deferir
          </Button>
        }
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('toolbar', { name: 'Ações do processo aberto' });

    await expect(barra).toHaveAttribute('aria-orientation', 'vertical');

    await userEvent.tab();
    await expect(canvas.getByRole('button', { name: 'Imprimir processo' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: 'Exportar anexos' })).toHaveFocus();
  },
};

export const NavegacaoPorSetas: Story = {
  name: 'A11y · navegação por setas',
  parameters: {
    docs: {
      description: {
        story:
          'A barra é uma parada única de Tab: as setas andam entre os botões em anel, Home e End vão às pontas. O campo de busca fica fora do anel porque as setas ali pertencem ao cursor do texto.',
      },
    },
  },
  render: (args) => (
    <Toolbar
      {...args}
      rotulo="Ações da lista de diárias"
      inicio={
        <>
          <Button variant="primary" size="small" icon={<IconePlus />}>
            Lançar diária
          </Button>
          <Button variant="secondary" size="small">
            Importar competência
          </Button>
          <Button variant="secondary" size="small">
            Conferir pendências
          </Button>
        </>
      }
      centro={
        <Search
          label="Buscar diária por servidor ou matrícula"
          placeholder="Buscar por servidor ou matrícula"
          size="sm"
        />
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lancar = canvas.getByRole('button', { name: 'Lançar diária' });
    const importar = canvas.getByRole('button', { name: 'Importar competência' });
    const conferir = canvas.getByRole('button', { name: 'Conferir pendências' });

    await userEvent.tab();
    await expect(lancar).toHaveFocus();
    await expect(importar).toHaveAttribute('tabindex', '-1');

    await userEvent.keyboard('{ArrowRight}');
    await expect(importar).toHaveFocus();

    await userEvent.keyboard('{End}');
    await expect(conferir).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(lancar).toHaveFocus();

    // O campo de busca continua alcançável por Tab, fora do anel de setas.
    await userEvent.tab();
    await expect(
      canvas.getByRole('searchbox', { name: 'Buscar diária por servidor ou matrícula' }),
    ).toHaveFocus();
  },
};

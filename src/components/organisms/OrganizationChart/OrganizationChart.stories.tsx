import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { OrganizationChart, type NoDoOrganograma } from './OrganizationChart';

const SECRETARIA: NoDoOrganograma = {
  id: 'gabinete',
  titulo: 'Gabinete do Secretário',
  subtitulo: 'Antônio Ribeiro Lima',
  detalhe: 'Secretaria de Estado da Saúde',
  filhos: [
    {
      id: 'atencao-primaria',
      titulo: 'Diretoria de Atenção Primária',
      subtitulo: 'Maria de Fátima Souza',
      filhos: [
        {
          id: 'tfd',
          titulo: 'Coordenação de TFD',
          subtitulo: 'Dr. Carlos Andrade',
          detalhe: '14 servidores',
        },
        {
          id: 'vigilancia',
          titulo: 'Coordenação de Vigilância em Saúde',
          subtitulo: 'Rita de Cássia Nunes',
          detalhe: '9 servidores',
        },
      ],
    },
    {
      id: 'administrativa',
      titulo: 'Diretoria Administrativa e Financeira',
      subtitulo: 'Joana Marques Pereira',
      filhos: [
        { id: 'compras', titulo: 'Coordenação de Compras', subtitulo: 'Luiz Otávio Freire' },
        {
          id: 'diarias',
          titulo: 'Coordenação de Diárias e Passagens',
          subtitulo: 'Laryssa Campos Teixeira',
        },
      ],
    },
    {
      id: 'regulacao',
      titulo: 'Diretoria de Regulação',
      subtitulo: 'Paulo Henrique Barros',
      filhos: [
        {
          id: 'ambulatorial',
          titulo: 'Coordenação de Regulação Ambulatorial',
          subtitulo: 'Sandra Regina Alves',
        },
      ],
    },
  ],
};

const meta = {
  title: 'Organismos/Hierarquia/OrganizationChart',
  component: OrganizationChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Organograma hierárquico, equivalente ao `p-organizationchart` do PrimeNG. Figma CitieOne, página `6738:49724`, com os component sets `organizationchart-node` (State, Toggleable, Selected, Top/Top Left/Top Right/Down) e `organizationchart-nodetogglebutton` (Expanded, State, Focus). Os conectores são decorativos (`aria-hidden`) e a hierarquia é exposta como árvore ARIA (`tree`/`treeitem` com `aria-level` e `aria-expanded`), navegável por setas; o gatilho "Ver lista" oferece a mesma hierarquia como lista aninhada, no espírito do "Ver tabela" dos Gráficos.',
      },
    },
  },
  args: { label: 'Organograma da Secretaria de Estado da Saúde', raiz: SECRETARIA },
} satisfies Meta<typeof OrganizationChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Estado · padrão (raiz aberta)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const raiz = canvas.getByRole('treeitem', { name: 'Gabinete do Secretário' });
    await expect(raiz).toHaveAttribute('aria-expanded', 'true');
    await expect(raiz).toHaveAttribute('aria-level', '1');
    // Diretorias visíveis; coordenações ainda fechadas.
    await expect(canvas.getAllByRole('treeitem')).toHaveLength(4);
  },
};

export const RamosAbertos: Story = {
  name: 'Estado · ramos abertos',
  args: { expandidosPadrao: ['atencao-primaria', 'administrativa', 'regulacao'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const coordenacao = canvas.getByRole('treeitem', { name: 'Coordenação de TFD' });
    await expect(coordenacao).toHaveAttribute('aria-level', '3');
    await expect(coordenacao).not.toHaveAttribute('aria-expanded');
    await expect(canvas.getAllByRole('treeitem')).toHaveLength(9);
  },
};

export const Recolhido: Story = {
  name: 'Estado · recolhido pelo teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const raiz = canvas.getByRole('treeitem', { name: 'Gabinete do Secretário' });
    canvas.getByRole('tree').focus();
    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(raiz).toHaveAttribute('aria-expanded', 'false'));
    await expect(canvas.getAllByRole('treeitem')).toHaveLength(1);
    await userEvent.keyboard('{ArrowRight}');
    await waitFor(() => expect(raiz).toHaveAttribute('aria-expanded', 'true'));
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'Comportamento · navegação por setas',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const arvore = canvas.getByRole('tree');
    // O foco do teclado é do container; o nó ativo vem de aria-activedescendant.
    const ativo = async (nome: string) => {
      const alvo = canvas.getByRole('treeitem', { name: nome });
      await waitFor(() => expect(arvore).toHaveAttribute('aria-activedescendant', alvo.id));
    };

    arvore.focus();
    await expect(arvore).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await ativo('Diretoria de Atenção Primária');

    // Fechada: a seta para a direita abre antes de descer um nível.
    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    await ativo('Coordenação de TFD');

    await userEvent.keyboard('{ArrowLeft}');
    await ativo('Diretoria de Atenção Primária');

    await userEvent.keyboard('{End}');
    await ativo('Diretoria de Regulação');
  },
};

export const Selecionavel: Story = {
  name: 'Variante · nó selecionável',
  args: { selecionavel: true, selecionadoPadrao: 'administrativa' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const administrativa = canvas.getByRole('treeitem', {
      name: 'Diretoria Administrativa e Financeira',
    });
    await expect(administrativa).toHaveAttribute('aria-selected', 'true');

    const regulacao = canvas.getByRole('treeitem', { name: 'Diretoria de Regulação' });
    await userEvent.click(regulacao);
    await expect(regulacao).toHaveAttribute('aria-selected', 'true');
    await expect(administrativa).toHaveAttribute('aria-selected', 'false');
  },
};

export const AlternativaEmLista: Story = {
  name: 'Comportamento · alternativa em lista',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Ver lista' }));
    // A lista traz a hierarquia inteira, independente do que está aberto no desenho.
    await expect(canvas.queryByRole('tree')).not.toBeInTheDocument();
    await expect(canvas.getByText('Coordenação de Diárias e Passagens')).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(9);

    await userEvent.click(canvas.getByRole('button', { name: 'Ver organograma' }));
    await expect(canvas.getByRole('tree')).toBeInTheDocument();
  },
};

export const RamoUnico: Story = {
  name: 'Variante · ramo com filho único',
  args: {
    label: 'Organograma da Coordenação de TFD',
    raiz: {
      id: 'coordenacao-tfd',
      titulo: 'Coordenação de TFD',
      subtitulo: 'Dr. Carlos Andrade',
      filhos: [
        {
          id: 'nucleo-autorizacao',
          titulo: 'Núcleo de Autorização',
          subtitulo: 'Maria de Fátima Souza',
          filhos: [
            {
              id: 'equipe-diarias',
              titulo: 'Equipe de Diárias',
              detalhe: 'Competência 03/2025',
            },
          ],
        },
      ],
    },
    expandidosPadrao: ['nucleo-autorizacao'],
  },
};

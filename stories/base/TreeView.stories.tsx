import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiFileTextLine, RiImageLine } from '@remixicon/react';
import { TreeView, TreeViewItem } from '@/components/base/tree-view/tree-view';

const meta = {
  title: 'Base/TreeView',
  component: TreeView,
  tags: ['autodocs'],
  args: { 'aria-label': 'Arquivos do projeto' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    showGuides: { control: 'boolean' },
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
  },
  decorators: [(Story) => <div className="max-w-sm"><Story /></div>],
  render: (args) => (
    <TreeView {...args} defaultExpandedKeys={['docs', 'contratos']}>
      <TreeViewItem id="docs" label="Documentos">
        <TreeViewItem id="contratos" label="Contratos">
          <TreeViewItem id="c1" label="Contrato 2026.pdf" />
          <TreeViewItem id="c2" label="Aditivo.pdf" />
        </TreeViewItem>
        <TreeViewItem id="atas" label="Atas">
          <TreeViewItem id="a1" label="Ata de outubro.docx" />
        </TreeViewItem>
        <TreeViewItem id="leia" label="Leia-me.txt" />
      </TreeViewItem>
      <TreeViewItem id="midia" label="Mídia">
        <TreeViewItem id="m1" label="Logo.svg" />
      </TreeViewItem>
    </TreeView>
  ),
} satisfies Meta<typeof TreeView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Compacta: Story = { args: { size: 'sm' } };

export const SemGuias: Story = { args: { showGuides: false } };

export const SelecaoMultipla: Story = { args: { selectionMode: 'multiple' } };

export const IconesEConteudoFinal: Story = {
  render: (args) => (
    <TreeView {...args} defaultExpandedKeys={['pasta']}>
      <TreeViewItem id="pasta" label="Relatórios" trailingContent="3">
        <TreeViewItem id="r1" label="Resumo.docx" icon={RiFileTextLine} trailingContent="12 KB" />
        <TreeViewItem id="r2" label="Gráfico.png" icon={RiImageLine} trailingContent="240 KB" />
        <TreeViewItem id="r3" label="Rascunho.docx" icon={RiFileTextLine} isDisabled />
      </TreeViewItem>
    </TreeView>
  ),
};

export const Vazia: Story = {
  render: (args) => <TreeView {...args} renderEmptyState={() => 'Nenhum item encontrado.'}>{[]}</TreeView>,
};

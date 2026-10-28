import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataTableExample } from '@/components/application/data-table/data-table';

const meta = {
  title: 'Blocos/DataTable',
  component: DataTableExample,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    showSizeToggle: { control: 'boolean' },
    pageSize: { control: { type: 'number', min: 3, max: 20, step: 1 } },
  },
} satisfies Meta<typeof DataTableExample>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const CincoPorPagina: Story = { args: { pageSize: 5 } };

export const PaginasMaiores: Story = { args: { pageSize: 15 } };

export const SemSeletorDeDensidade: Story = { args: { showSizeToggle: false } };

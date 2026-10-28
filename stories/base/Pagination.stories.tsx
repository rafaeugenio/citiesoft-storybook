import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pagination } from '@/components/base/pagination/pagination';

const meta = {
  title: 'Base/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  args: {
    page: 1,
    totalPages: 10,
    onChange: () => {},
    previousLabel: 'Anterior',
    nextLabel: 'Próxima',
    'aria-label': 'Paginação',
  },
  argTypes: {
    siblingCount: { control: { type: 'number', min: 0, max: 3 } },
  },
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return <Pagination {...args} page={page} onChange={setPage} />;
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const PoucasPaginas: Story = { args: { totalPages: 4 } };

export const MuitasPaginas: Story = { args: { page: 25, totalPages: 120 } };

export const MaisVizinhas: Story = { args: { page: 10, totalPages: 30, siblingCount: 2 } };

export const Compacta: Story = {
  render: function Render(args) {
    const [page, setPage] = useState(args.page);
    return (
      <div className="w-[320px]">
        <Pagination {...args} page={page} onChange={setPage} />
      </div>
    );
  },
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@/components/base/table/table';

const pessoas = [
  { id: 1, nome: 'Ana Souza', setor: 'Financeiro', status: 'Ativo' },
  { id: 2, nome: 'Bruno Lima', setor: 'Recursos Humanos', status: 'Em férias' },
  { id: 3, nome: 'Carla Mendes', setor: 'Tecnologia', status: 'Ativo' },
  { id: 4, nome: 'Diego Alves', setor: 'Estoque', status: 'Afastado' },
];

const meta = {
  title: 'Base/Table',
  component: Table,
  tags: ['autodocs'],
  args: { 'aria-label': 'Colaboradores' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
  },
  render: (args) => (
    <Table {...args}>
      <TableHeader>
        <TableColumn isRowHeader>Nome</TableColumn>
        <TableColumn>Setor</TableColumn>
        <TableColumn>Situação</TableColumn>
      </TableHeader>
      <TableBody>
        {pessoas.map((p) => (
          <TableRow key={p.id} id={p.id}>
            <TableCell>{p.nome}</TableCell>
            <TableCell>{p.setor}</TableCell>
            <TableCell>{p.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Compacta: Story = { args: { size: 'sm' } };

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      {(['md', 'sm'] as const).map((size) => (
        <Table key={size} {...args} size={size} aria-label={`Colaboradores (${size})`}>
          <TableHeader>
            <TableColumn isRowHeader>Nome</TableColumn>
            <TableColumn>Setor</TableColumn>
          </TableHeader>
          <TableBody>
            {pessoas.slice(0, 2).map((p) => (
              <TableRow key={p.id} id={p.id}>
                <TableCell>{p.nome}</TableCell>
                <TableCell>{p.setor}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ))}
    </div>
  ),
};

export const SelecaoMultipla: Story = { args: { selectionMode: 'multiple' } };

export const SelecaoUnica: Story = { args: { selectionMode: 'single' } };

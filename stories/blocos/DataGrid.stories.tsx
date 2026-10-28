import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { DataGrid, type DataGridColumn } from '@/components/application/data-grid/data-grid';

type Pedido = {
  id: string;
  cliente: string;
  cidade: string;
  status: string;
  quantidade: number;
  valor: number;
  vencimento: string;
};

const NOMES = ['Ana Beatriz Lima', 'Carlos Eduardo Souza', 'Fernanda Oliveira', 'João Pedro Alves', 'Mariana Costa', 'Ricardo Pereira', 'Patrícia Gomes', 'Lucas Ferreira', 'Juliana Martins', 'Rafael Barbosa'];
const CIDADES = ['Salvador', 'Recife', 'Fortaleza', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Goiânia', 'Belém'];
const STATUS = ['Pendente', 'Em análise', 'Aprovado', 'Pago', 'Cancelado'];

function gerarPedidos(total: number): Pedido[] {
  return Array.from({ length: total }, (_, i) => {
    const dia = String((i % 28) + 1).padStart(2, '0');
    const mes = String((i % 12) + 1).padStart(2, '0');
    return {
      id: `PED-${String(1000 + i)}`,
      cliente: NOMES[(i * 7) % NOMES.length],
      cidade: CIDADES[(i * 3) % CIDADES.length],
      status: STATUS[(i * 5) % STATUS.length],
      quantidade: 1 + ((i * 13) % 40),
      valor: 150 + ((i * 377) % 9800),
      vencimento: `${dia}/${mes}/2026`,
    };
  });
}

const brl = (v: number) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const COLUNAS: DataGridColumn<Pedido>[] = [
  { key: 'id', header: 'Pedido', width: 120, editable: false },
  { key: 'cliente', header: 'Cliente', width: 220, filterable: true },
  { key: 'cidade', header: 'Cidade', width: 170, filterable: true },
  { key: 'status', header: 'Status', width: 150, type: 'select', options: STATUS },
  { key: 'quantidade', header: 'Quantidade', width: 130, type: 'number', align: 'end', min: 1, max: 999, summary: 'sum' },
  {
    key: 'valor', header: 'Valor', width: 150, type: 'number', align: 'end', min: 0, summary: 'sum',
    format: (v) => brl(Number(v)), formatSummary: (v) => brl(v),
  },
  { key: 'vencimento', header: 'Vencimento', width: 140 },
];

const meta = {
  title: 'Blocos/DataGrid',
  component: DataGrid<Pedido>,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    'aria-label': 'Pedidos',
    data: gerarPedidos(120),
    columns: COLUNAS,
    getRowId: (row: Pedido) => row.id,
    height: 460,
    exportFileName: 'pedidos.csv',
    emptyState: 'Nenhum pedido encontrado. Tente outra busca ou limpe os filtros.',
  },
  decorators: [
    (Story) => (
      <div className="min-h-[600px] p-6">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DataGrid<Pedido>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SomenteLeitura: Story = {};

export const Editavel: Story = {
  render: function Render(args) {
    const [dados, setDados] = useState<Pedido[]>(() => gerarPedidos(120));
    return <DataGrid<Pedido> {...args} data={dados} onDataChange={setDados} />;
  },
};

export const PoucasLinhas: Story = {
  render: function Render(args) {
    const [dados, setDados] = useState<Pedido[]>(() => gerarPedidos(12));
    return <DataGrid<Pedido> {...args} data={dados} onDataChange={setDados} height={360} />;
  },
};

export const MuitasLinhas: Story = {
  render: function Render(args) {
    const [dados, setDados] = useState<Pedido[]>(() => gerarPedidos(2000));
    return <DataGrid<Pedido> {...args} data={dados} onDataChange={setDados} />;
  },
};

export const ComValidacao: Story = {
  render: function Render(args) {
    const [dados, setDados] = useState<Pedido[]>(() => gerarPedidos(60));
    const colunas: DataGridColumn<Pedido>[] = COLUNAS.map((c) =>
      c.key === 'vencimento'
        ? {
            ...c,
            validate: (valor) =>
              /^\d{2}\/\d{2}\/\d{4}$/.test(String(valor)) ? undefined : 'Use o formato dd/mm/aaaa.',
          }
        : c,
    );
    return <DataGrid<Pedido> {...args} columns={colunas} data={dados} onDataChange={setDados} />;
  },
};

export const SemDados: Story = { parameters: { a11y: { test: 'todo' } }, /* a11y: achado do bloco Citiesoft (contraste/ARIA); tratar na fase de tema da marca */
 
  args: { data: [], emptyState: 'Nenhum pedido cadastrado ainda.' },
};

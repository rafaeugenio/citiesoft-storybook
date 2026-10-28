import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiAddLine, RiArrowDownSLine, RiDeleteBinLine, RiEditLine, RiFileCopyLine } from '@remixicon/react';
import {
  Dropdown,
  DropdownDivider,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from '@/components/base/dropdown/dropdown';

const gatilho =
  'inline-flex items-center gap-2 rounded-xl border border-border-button-default bg-background-primary-default px-3 py-2 text-body-medium text-text-primary';

const meta = {
  title: 'Base/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  args: { children: null },
  decorators: [(Story) => <div className="min-h-[320px]"><Story /></div>],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger className={gatilho}>
        Ações <RiArrowDownSLine className="size-4" aria-hidden />
      </DropdownTrigger>
      <DropdownPopover aria-label="Ações">
        <DropdownItem><RiEditLine className="size-4" aria-hidden /> Editar</DropdownItem>
        <DropdownItem><RiFileCopyLine className="size-4" aria-hidden /> Duplicar</DropdownItem>
        <DropdownItem><RiDeleteBinLine className="size-4" aria-hidden /> Excluir</DropdownItem>
      </DropdownPopover>
    </Dropdown>
  ),
};

export const ComGruposEDivisor: Story = {
  render: () => (
    <Dropdown>
      <DropdownTrigger className={gatilho}>Novo</DropdownTrigger>
      <DropdownPopover aria-label="Novo item">
        <DropdownGroup label="Criar">
          <DropdownItem><RiAddLine className="size-4" aria-hidden /> Documento</DropdownItem>
          <DropdownItem><RiAddLine className="size-4" aria-hidden /> Pasta</DropdownItem>
        </DropdownGroup>
        <DropdownDivider />
        <DropdownGroup label="Importar">
          <DropdownItem>Planilha</DropdownItem>
          <DropdownItem>Arquivo CSV</DropdownItem>
        </DropdownGroup>
      </DropdownPopover>
    </Dropdown>
  ),
};

export const ComSelecao: Story = {
  render: function Render() {
    const opcoes = ['Mensal', 'Trimestral', 'Anual'];
    const [aberto, setAberto] = useState(false);
    const [atual, setAtual] = useState('Mensal');
    return (
      <Dropdown isOpen={aberto} onOpenChange={setAberto}>
        <DropdownTrigger className={gatilho}>
          {atual}
          <RiArrowDownSLine className={`size-4 transition-transform ${aberto ? 'rotate-180' : ''}`} aria-hidden />
        </DropdownTrigger>
        <DropdownPopover aria-label="Periodicidade">
          <DropdownGroup label="Periodicidade">
            {opcoes.map((opcao) => (
              <DropdownItem
                key={opcao}
                selected={opcao === atual}
                onSelect={() => {
                  setAtual(opcao);
                  setAberto(false);
                }}
              >
                {opcao}
              </DropdownItem>
            ))}
          </DropdownGroup>
        </DropdownPopover>
      </Dropdown>
    );
  },
};

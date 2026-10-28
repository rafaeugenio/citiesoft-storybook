import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import {
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAddLine,
  RiArrowDownSLine,
} from '@remixicon/react';
import { ButtonGroup, ButtonGroupItem } from '@/components/base/buttons/button-group';

const meta = {
  title: 'Base/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  args: { 'aria-label': 'Alinhamento', children: null },
  argTypes: {
    size: { control: 'inline-radio', options: ['medium', 'small'] },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem size={args.size}>Esquerda</ButtonGroupItem>
      <ButtonGroupItem size={args.size}>Centro</ButtonGroupItem>
      <ButtonGroupItem size={args.size}>Direita</ButtonGroupItem>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {(['medium', 'small'] as const).map((size) => (
        <ButtonGroup key={size} {...args} size={size}>
          <ButtonGroupItem size={size}>Dia</ButtonGroupItem>
          <ButtonGroupItem size={size}>Semana</ButtonGroupItem>
          <ButtonGroupItem size={size}>Mês</ButtonGroupItem>
        </ButtonGroup>
      ))}
    </div>
  ),
};

export const ComIcones: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem leadingIcon={RiAddLine}>Novo</ButtonGroupItem>
      <ButtonGroupItem trailingIcon={RiArrowDownSLine}>Mais opções</ButtonGroupItem>
    </ButtonGroup>
  ),
};

export const ApenasIcones: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem iconOnly leadingIcon={RiAlignLeft} aria-label="Alinhar à esquerda" />
      <ButtonGroupItem iconOnly leadingIcon={RiAlignCenter} aria-label="Centralizar" />
      <ButtonGroupItem iconOnly leadingIcon={RiAlignRight} aria-label="Alinhar à direita" />
    </ButtonGroup>
  ),
};

export const Selecionavel: Story = {
  render: function Render(args) {
    const [value, setValue] = useState('semana');
    return (
      <ButtonGroup {...args} aria-label="Período">
        {[
          ['dia', 'Dia'],
          ['semana', 'Semana'],
          ['mes', 'Mês'],
        ].map(([id, label]) => (
          <ButtonGroupItem key={id} selected={value === id} onClick={() => setValue(id)}>
            {label}
          </ButtonGroupItem>
        ))}
      </ButtonGroup>
    );
  },
};

export const ItemDesabilitado: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupItem>Ativo</ButtonGroupItem>
      <ButtonGroupItem disabled>Desabilitado</ButtonGroupItem>
      <ButtonGroupItem>Ativo</ButtonGroupItem>
    </ButtonGroup>
  ),
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiFileListLine, RiGroupLine, RiSettings3Line, RiLayoutGridLine, RiListCheck } from '@remixicon/react';
import { Tab, TabList, TabPanel, Tabs } from '@/components/base/tabs/tabs';
import { PillTab, PillTabList } from '@/components/base/tabs/pill-tab';

const meta = {
  title: 'Base/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    keyboardActivation: { control: 'inline-radio', options: ['automatic', 'manual'] },
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Seções do cadastro">
        <Tab id="geral">Geral</Tab>
        <Tab id="documentos">Documentos</Tab>
        <Tab id="historico">Histórico</Tab>
      </TabList>
      <TabPanel id="geral">Dados gerais do cadastro.</TabPanel>
      <TabPanel id="documentos">Documentos anexados ao cadastro.</TabPanel>
      <TabPanel id="historico">Histórico de alterações do cadastro.</TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComIconesEContadores: Story = {
  parameters: { a11y: { test: 'todo' } }, // contraste da paleta accent do Citiesoft: some ao mapear a marca Citiesoft (fase Fundação)
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Seções do projeto">
        <Tab id="tarefas" icon={RiFileListLine} count={12}>Tarefas</Tab>
        <Tab id="equipe" icon={RiGroupLine} count={4}>Equipe</Tab>
        <Tab id="config" icon={RiSettings3Line}>Configurações</Tab>
      </TabList>
      <TabPanel id="tarefas">Lista de tarefas do projeto.</TabPanel>
      <TabPanel id="equipe">Integrantes da equipe.</TabPanel>
      <TabPanel id="config">Preferências do projeto.</TabPanel>
    </Tabs>
  ),
};

export const ComAbaDesabilitada: Story = {
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Seções">
        <Tab id="a">Ativa</Tab>
        <Tab id="b">Disponível</Tab>
        <Tab id="c" isDisabled>Desabilitada</Tab>
      </TabList>
      <TabPanel id="a">Conteúdo da aba ativa.</TabPanel>
      <TabPanel id="b">Conteúdo da aba disponível.</TabPanel>
      <TabPanel id="c">Conteúdo indisponível.</TabPanel>
    </Tabs>
  ),
};

export const Pilulas: Story = {
  parameters: { a11y: { test: 'todo' } }, // contraste da paleta accent do Citiesoft: some ao mapear a marca Citiesoft (fase Fundação)
  render: () => {
    const Demo = () => {
      const [visao, setVisao] = useState('lista');
      const [filtro, setFiltro] = useState('todos');
      return (
        <div className="flex flex-col gap-6">
          <PillTabList aria-label="Modo de visualização">
            <PillTab variant="blue" icon={RiListCheck} isSelected={visao === 'lista'} onSelect={() => setVisao('lista')}>Lista</PillTab>
            <PillTab variant="blue" icon={RiLayoutGridLine} isSelected={visao === 'grade'} onSelect={() => setVisao('grade')}>Grade</PillTab>
          </PillTabList>
          <PillTabList aria-label="Filtro">
            {(['todos', 'ativos', 'arquivados'] as const).map((f) => (
              <PillTab key={f} variant="gray" isSelected={filtro === f} onSelect={() => setFiltro(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </PillTab>
            ))}
          </PillTabList>
        </div>
      );
    };
    return <Demo />;
  },
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiFileList3Line, RiUserAddLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Select, SelectItem } from '@/components/base/select/select';
import { Drawer, type DrawerProps } from '@/components/application/drawer/drawer';
import { DrawerActions } from '@/components/application/drawer/drawer-actions';

const meta = {
  title: 'Blocos/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    isOpen: false,
    onOpenChange: () => undefined,
    title: 'Detalhe da solicitação',
    children: null,
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl'] },
    side: { control: 'inline-radio', options: ['end', 'start'] },
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const DETALHES: [string, string][] = [
  ['Protocolo', 'TFD-2026-004812'],
  ['Paciente', 'Maria das Graças Oliveira (CPF 123.***.***-45)'],
  ['Origem', 'Barreirinhas (MA)'],
  ['Destino', 'São Luís (MA), Hospital Universitário'],
  ['Especialidade', 'Cardiologia'],
  ['Transporte', 'Ambulância simples'],
  ['Consulta', '18/11/2026, 08h30'],
  ['Situação', 'Em análise'],
];

function Detalhes({ linhas = DETALHES }: { linhas?: [string, string][] }) {
  return (
    <dl className="flex flex-col gap-4">
      {linhas.map(([rotulo, valor]) => (
        <div key={rotulo} className="flex flex-col gap-0.5">
          <dt className="text-body-2-medium text-text-secondary">{rotulo}</dt>
          <dd className="text-body-medium text-text-primary">{valor}</dd>
        </div>
      ))}
    </dl>
  );
}

function Formulario({ id, onSubmit }: { id: string; onSubmit?: () => void }) {
  return (
    <form
      id={id}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.();
      }}
      className="flex flex-col gap-4"
    >
      <Input label="Nome do paciente" placeholder="Nome completo" isRequired />
      <Input label="CPF" placeholder="***.***.***-**" />
      <div className="flex flex-col gap-1.5">
        <span className="text-body-medium text-text-primary">Município de origem</span>
        <Select aria-label="Município de origem" defaultSelectedKey="barreirinhas" className="w-full" triggerClassName="w-full">
          <SelectItem id="barreirinhas">Barreirinhas</SelectItem>
          <SelectItem id="paulino">Paulino Neves</SelectItem>
          <SelectItem id="tutoia">Tutóia</SelectItem>
        </Select>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-body-medium text-text-primary">Especialidade</span>
        <Select aria-label="Especialidade" placeholder="Selecionar" className="w-full" triggerClassName="w-full">
          <SelectItem id="cardiologia">Cardiologia</SelectItem>
          <SelectItem id="oncologia">Oncologia</SelectItem>
          <SelectItem id="ortopedia">Ortopedia</SelectItem>
        </Select>
      </div>
      <Input label="Observações" placeholder="Informações para a regulação" hint="Máximo de 300 caracteres." />
    </form>
  );
}

type DemoProps = Partial<DrawerProps> & {
  rotulo?: string;
  conteudo?: (fechar: () => void) => React.ReactNode;
  rodape?: (fechar: () => void) => React.ReactNode;
  inicialmenteAberto?: boolean;
};

function Demo({ rotulo = 'Abrir drawer', conteudo, rodape, inicialmenteAberto = false, ...props }: DemoProps) {
  const [aberto, setAberto] = useState(inicialmenteAberto);
  const fechar = () => setAberto(false);
  return (
    <div className="flex h-[640px] items-start justify-start p-6">
      <Button onClick={() => setAberto(true)}>{rotulo}</Button>
      <Drawer
        title="Detalhe da solicitação"
        {...props}
        isOpen={aberto}
        onOpenChange={setAberto}
        footer={rodape?.(fechar)}
      >
        {conteudo ? conteudo(fechar) : <Detalhes />}
      </Drawer>
    </div>
  );
}

export const Padrao: Story = {
  render: function Render(args) {
    return (
      <Demo
        size={args.size}
        side={args.side}
        description="Solicitação TFD-2026-004812"
        icon={RiFileList3Line}
        rodape={(fechar) => <DrawerActions primaryLabel="Aprovar" secondaryLabel="Fechar" onPrimary={fechar} onSecondary={fechar} />}
      />
    );
  },
};

export const Tamanhos: Story = {
  render: function Render() {
    const [tamanho, setTamanho] = useState<DrawerProps['size']>(undefined);
    return (
      <div className="flex h-[640px] items-start gap-3 p-6">
        {(['sm', 'md', 'lg', 'xl'] as const).map((s) => (
          <Button key={s} variant="secondary" onClick={() => setTamanho(s)}>
            Tamanho {s}
          </Button>
        ))}
        <Drawer
          title="Detalhe da solicitação"
          icon={RiFileList3Line}
          size={tamanho}
          isOpen={tamanho !== undefined}
          onOpenChange={(o) => !o && setTamanho(undefined)}
          footer={<DrawerActions primaryLabel="Fechar" secondaryLabel="" onPrimary={() => setTamanho(undefined)} />}
        >
          <Detalhes />
        </Drawer>
      </div>
    );
  },
};

export const LadoEsquerdo: Story = {
  render: function Render() {
    return (
      <Demo
        rotulo="Abrir pelo lado esquerdo"
        side="start"
        title="Filtros da listagem"
        size="sm"
        conteudo={() => <Detalhes linhas={DETALHES.slice(0, 4)} />}
        rodape={(fechar) => <DrawerActions primaryLabel="Aplicar" secondaryLabel="Limpar" onPrimary={fechar} onSecondary={fechar} />}
      />
    );
  },
};

export const ComFormulario: Story = {
  render: function Render() {
    const [carregando, setCarregando] = useState(false);
    const [aberto, setAberto] = useState(false);
    const salvar = () => {
      setCarregando(true);
      window.setTimeout(() => {
        setCarregando(false);
        setAberto(false);
      }, 1200);
    };
    return (
      <div className="flex h-[640px] items-start p-6">
        <Button onClick={() => setAberto(true)}>Nova solicitação</Button>
        <Drawer
          isOpen={aberto}
          onOpenChange={setAberto}
          isDismissable={!carregando}
          title="Nova solicitação"
          description="Dados do paciente e do atendimento."
          icon={RiUserAddLine}
          footer={<DrawerActions form="form-solicitacao" primaryLabel="Salvar" isLoading={carregando} onSecondary={() => setAberto(false)} />}
        >
          <Formulario id="form-solicitacao" onSubmit={salvar} />
        </Drawer>
      </div>
    );
  },
};

export const RodapeDestrutivo: Story = {
  render: function Render() {
    return (
      <Demo
        rotulo="Editar município"
        title="Editar município"
        icon={RiFileList3Line}
        conteudo={() => <Formulario id="form-municipio" />}
        rodape={(fechar) => (
          <DrawerActions
            destructiveLabel="Excluir"
            primaryLabel="Salvar alterações"
            onPrimary={fechar}
            onSecondary={fechar}
            onDestructive={fechar}
          />
        )}
      />
    );
  },
};

export const Carregando: Story = {
  render: function Render() {
    return (
      <Demo
        rotulo="Abrir drawer salvando"
        title="Editar município"
        conteudo={() => <Formulario id="form-carregando" />}
        rodape={() => <DrawerActions isLoading destructiveLabel="Excluir" />}
      />
    );
  },
};

export const CorpoLongo: Story = {
  render: function Render() {
    const linhas = Array.from({ length: 5 }, () => DETALHES).flat();
    return (
      <Demo
        rotulo="Abrir com corpo longo"
        conteudo={() => <Detalhes linhas={linhas.map(([r, v], i) => [`${r} ${i + 1}`, v])} />}
        rodape={(fechar) => <DrawerActions primaryLabel="Concluir" onPrimary={fechar} onSecondary={fechar} />}
      />
    );
  },
};

export const AbertoNaDocumentacao: Story = {
  parameters: { layout: 'fullscreen' },
  render: function Render() {
    return (
      <Demo
        inicialmenteAberto
        icon={RiFileList3Line}
        description="Solicitação TFD-2026-004812"
        rodape={(fechar) => <DrawerActions primaryLabel="Aprovar" onPrimary={fechar} onSecondary={fechar} />}
      />
    );
  },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: function Render() {
    return (
      <div className="mx-auto w-[390px] max-w-full">
        <Demo
          rotulo="Abrir no celular"
          size="lg"
          icon={RiUserAddLine}
          title="Nova solicitação"
          conteudo={() => <Formulario id="form-mobile" />}
          rodape={(fechar) => <DrawerActions primaryLabel="Salvar" onPrimary={fechar} onSecondary={fechar} />}
        />
      </div>
    );
  },
};

import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiInformationLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Input } from '@/components/base/input/input';
import { Dialog, type DialogProps } from '@/components/application/dialog/dialog';
import { ConfirmDialog, type ConfirmDialogProps } from '@/components/application/dialog/confirm-dialog';
import { DrawerActions } from '@/components/application/drawer/drawer-actions';

const meta = {
  title: 'Blocos/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { isOpen: false, onOpenChange: () => undefined, title: 'Título do diálogo' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

const Quadro = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-[560px] items-start p-6">{children}</div>
);

function DialogDemo({
  rotulo = 'Abrir diálogo',
  inicialmenteAberto = false,
  conteudo,
  ...props
}: Partial<DialogProps> & { rotulo?: string; inicialmenteAberto?: boolean; conteudo?: React.ReactNode }) {
  const [aberto, setAberto] = useState(inicialmenteAberto);
  return (
    <Quadro>
      <Button onClick={() => setAberto(true)}>{rotulo}</Button>
      <Dialog
        title="Reenviar documentos"
        description="Os documentos pendentes serão enviados novamente ao solicitante."
        {...props}
        isOpen={aberto}
        onOpenChange={setAberto}
        footer={
          <DrawerActions
            primaryLabel="Reenviar"
            onPrimary={() => setAberto(false)}
            onSecondary={() => setAberto(false)}
          />
        }
      >
        {conteudo}
      </Dialog>
    </Quadro>
  );
}

export const Padrao: Story = {
  render: function Render(args) {
    return (
      <DialogDemo
        size={args.size}
        icon={RiInformationLine}
        conteudo={<p className="text-body-regular text-text-secondary">Protocolo TFD-2026-004812, paciente com CPF 123.***.***-45.</p>}
      />
    );
  },
};

export const Tamanhos: Story = {
  render: function Render() {
    const [tamanho, setTamanho] = useState<DialogProps['size'] | null>(null);
    return (
      <Quadro>
        <div className="flex gap-3">
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Button key={s} variant="secondary" onClick={() => setTamanho(s)}>
              Tamanho {s}
            </Button>
          ))}
        </div>
        <Dialog
          title="Dados da solicitação"
          description="Resumo para conferência antes do envio."
          size={tamanho ?? 'md'}
          isOpen={tamanho !== null}
          onOpenChange={(o) => !o && setTamanho(null)}
          footer={<DrawerActions primaryLabel="Fechar" secondaryLabel="" onPrimary={() => setTamanho(null)} />}
        >
          <p className="text-body-regular text-text-secondary">Origem: Barreirinhas (MA). Destino: São Luís (MA).</p>
        </Dialog>
      </Quadro>
    );
  },
};

export const ComFormulario: Story = {
  render: function Render() {
    return (
      <DialogDemo
        rotulo="Registrar motivo"
        title="Motivo da negativa"
        description="O motivo fica visível ao solicitante."
        conteudo={
          <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
            <Input label="Motivo" placeholder="Documentação incompleta" isRequired />
            <Input label="Observação" placeholder="Detalhes para o solicitante" />
          </form>
        }
      />
    );
  },
};

export const AbertoNaDocumentacao: Story = {
  render: function Render() {
    return (
      <DialogDemo
        inicialmenteAberto
        icon={RiInformationLine}
        conteudo={<p className="text-body-regular text-text-secondary">Protocolo TFD-2026-004812.</p>}
      />
    );
  },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: function Render() {
    return (
      <div className="mx-auto w-[390px] max-w-full">
        <DialogDemo rotulo="Abrir no celular" size="lg" />
      </div>
    );
  },
};

/* ------------------------------------------------------------ ConfirmDialog */

function ConfirmDemo({
  rotulo,
  inicialmenteAberto = false,
  simularCarga = false,
  ...props
}: Partial<ConfirmDialogProps> & { rotulo: string; inicialmenteAberto?: boolean; simularCarga?: boolean }) {
  const [aberto, setAberto] = useState(inicialmenteAberto);
  const [carregando, setCarregando] = useState(false);
  const confirmar = () => {
    if (!simularCarga) return setAberto(false);
    setCarregando(true);
    window.setTimeout(() => {
      setCarregando(false);
      setAberto(false);
    }, 1200);
  };
  return (
    <Quadro>
      <Button variant={props.tone === 'danger' ? 'danger' : 'primary'} onClick={() => setAberto(true)}>
        {rotulo}
      </Button>
      <ConfirmDialog
        {...props}
        isOpen={aberto}
        onOpenChange={setAberto}
        onConfirm={confirmar}
        isLoading={carregando || props.isLoading}
      />
    </Quadro>
  );
}

export const ConfirmacaoNeutra: Story = {
  render: function Render() {
    return (
      <ConfirmDemo
        rotulo="Encaminhar para regulação"
        title="Encaminhar para regulação?"
        description="A solicitação TFD-2026-004812 segue para análise do regulador."
        confirmLabel="Encaminhar"
      />
    );
  },
};

export const ConfirmacaoDestrutiva: Story = {
  render: function Render() {
    return (
      <ConfirmDemo
        rotulo="Excluir 3 solicitações"
        tone="danger"
        affectedCount={3}
        entitySingular="solicitação"
        entityPlural="solicitações"
        description="A ação não pode ser desfeita. As 3 solicitações selecionadas saem da listagem."
      />
    );
  },
};

export const UmRegistro: Story = {
  render: function Render() {
    return (
      <ConfirmDemo
        rotulo="Excluir município"
        tone="danger"
        affectedCount={1}
        entitySingular="município"
        entityPlural="municípios"
        description="Barreirinhas (MA) deixa de aparecer nos cadastros."
        confirmLabel="Excluir município"
      />
    );
  },
};

export const ConfirmacaoCarregando: Story = {
  render: function Render() {
    return (
      <ConfirmDemo
        rotulo="Excluir 12 registros"
        tone="danger"
        affectedCount={12}
        description="A exclusão está em andamento."
        isLoading
        loadingLabel="Excluindo…"
        inicialmenteAberto
      />
    );
  },
};

export const ConfirmacaoAbertaNaDocumentacao: Story = {
  render: function Render() {
    return (
      <ConfirmDemo
        rotulo="Excluir 3 registros"
        tone="danger"
        affectedCount={3}
        description="A ação não pode ser desfeita."
        inicialmenteAberto
      />
    );
  },
};

export const ConfirmacaoMobile: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: function Render() {
    return (
      <div className="mx-auto w-[390px] max-w-full">
        <ConfirmDemo rotulo="Excluir 3 registros" tone="danger" affectedCount={3} description="A ação não pode ser desfeita." />
      </div>
    );
  },
};

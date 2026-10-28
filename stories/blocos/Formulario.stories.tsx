import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { FormActions } from '@/components/application/formulario/form-actions';
import { FormField, FormGrid } from '@/components/application/formulario/form-grid';
import { FormSection } from '@/components/application/formulario/form-section';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { Input } from '@/components/base/input/input';
import { Select, SelectItem } from '@/components/base/select/select';
import { Textarea } from '@/components/base/textarea/textarea';

const municipios = ['Açailândia', 'Balsas', 'Caxias', 'Imperatriz', 'São Luís'];

function CampoMunicipio({ rotulo, invalido }: { rotulo: string; invalido?: boolean }) {
  return (
    <Select aria-label={rotulo} placeholder="Selecione" isInvalid={invalido} className="w-full">
      {municipios.map((m) => (
        <SelectItem key={m} id={m}>
          {m}
        </SelectItem>
      ))}
    </Select>
  );
}

function Rotulado({ rotulo, obrigatorio, children }: { rotulo: string; obrigatorio?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-body-medium text-text-primary">
        {rotulo}
        {obrigatorio ? <span className="ms-0.5 text-text-error-primary" aria-hidden>*</span> : null}
      </span>
      {children}
    </div>
  );
}

function SecaoPaciente({ comErro = false }: { comErro?: boolean }) {
  return (
    <FormSection
      title="Dados do paciente"
      description="Informações usadas para identificar a solicitação."
      requiredNote="* Campos obrigatórios"
    >
      <FormGrid columns={2}>
        <FormField span={2}>
          <Input
            label="Nome completo"
            placeholder="Nome do paciente"
            isRequired
            isInvalid={comErro}
            hint={comErro ? 'Informe o nome completo.' : undefined}
          />
        </FormField>
        <Input label="CPF" placeholder="000.000.000-00" isRequired inputDir="ltr" />
        <Input label="Cartão SUS" placeholder="000 0000 0000 0000" />
        <Input label="Telefone" type="tel" placeholder="(99) 99999-9999" />
        <Input label="E-mail" type="email" placeholder="nome@exemplo.com.br" />
      </FormGrid>
    </FormSection>
  );
}

function SecaoAtendimento() {
  return (
    <FormSection title="Atendimento" description="Origem, destino e especialidade solicitada.">
      <FormGrid columns={3}>
        <Rotulado rotulo="Município de origem" obrigatorio>
          <CampoMunicipio rotulo="Município de origem" />
        </Rotulado>
        <Rotulado rotulo="Município de destino" obrigatorio>
          <CampoMunicipio rotulo="Município de destino" />
        </Rotulado>
        <Input label="Especialidade" placeholder="Ex.: Cardiologia" isRequired />
        <FormField span="full">
          <Textarea label="Justificativa clínica" placeholder="Descreva o motivo do deslocamento" rows={3} />
        </FormField>
        <FormField span="full">
          <Checkbox>Necessita de acompanhante</Checkbox>
        </FormField>
      </FormGrid>
    </FormSection>
  );
}

const meta = {
  title: 'Blocos/Formulario',
  component: FormActions,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { onCancel: fn(), onSecondary: fn(), onPrimary: fn() },
} satisfies Meta<typeof FormActions>;

export default meta;
type Story = StoryObj<typeof meta>;

function Pagina({ children }: { children: React.ReactNode }) {
  return <div className="flex min-h-dvh flex-col bg-background-full">{children}</div>;
}

export const Padrao: Story = {
  render: function Render(args) {
    return (
      <Pagina>
        <form className="flex flex-1 flex-col" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
            <h1 className="text-title-2-medium text-text-primary">Nova solicitação</h1>
            <SecaoPaciente />
            <SecaoAtendimento />
          </div>
          <FormActions {...args} primaryLabel="Salvar solicitação" onPrimary={undefined} />
        </form>
      </Pagina>
    );
  },
};

export const ComAcaoSecundaria: Story = {
  render: function Render(args) {
    return (
      <Pagina>
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <SecaoPaciente />
        </div>
        <FormActions {...args} secondaryLabel="Salvar rascunho" primaryLabel="Enviar" info="Rascunho salvo às 14:32" />
      </Pagina>
    );
  },
};

export const ComErroDeValidacao: Story = {
  render: function Render(args) {
    return (
      <Pagina>
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <div
            role="alert"
            className="rounded-2lg border border-border-error-default bg-background-tertiary-error p-3 text-body-regular text-text-error-primary"
          >
            Corrija os campos destacados para continuar.
          </div>
          <SecaoPaciente comErro />
        </div>
        <FormActions {...args} />
      </Pagina>
    );
  },
};

export const Enviando: Story = {
  render: function Render(args) {
    return (
      <Pagina>
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <SecaoPaciente />
        </div>
        <FormActions {...args} isLoading />
      </Pagina>
    );
  },
};

export const Desabilitado: Story = {
  render: function Render(args) {
    return (
      <Pagina>
        <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
          <SecaoPaciente />
        </div>
        <FormActions {...args} isDisabled info="Preencha os campos obrigatórios para salvar" />
      </Pagina>
    );
  },
};

export const SecaoSemCartaoEmUmaColuna: Story = {
  parameters: { layout: 'centered' },
  render: function Render() {
    return (
      <div className="w-[420px]">
        <FormSection title="Novo município" description="Cadastro de apoio." card={false} headingLevel={3}>
          <FormGrid columns={1}>
            <Input label="Nome" isRequired />
            <Input label="Código IBGE" placeholder="0000000" />
          </FormGrid>
        </FormSection>
      </div>
    );
  },
};

export const ControleDeColunas: Story = {
  render: function Render() {
    const [colunas, setColunas] = useState<1 | 2 | 3>(3);
    return (
      <div className="flex flex-col gap-4 bg-background-full p-4 sm:p-6">
        <div className="flex gap-2" role="group" aria-label="Colunas da grade">
          {([1, 2, 3] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={colunas === c}
              onClick={() => setColunas(c)}
              className="rounded-2lg border border-border-button-default px-3 py-1.5 text-body-medium text-text-primary aria-pressed:bg-background-tertiary-default"
            >
              {`${c} ${c === 1 ? 'coluna' : 'colunas'}`}
            </button>
          ))}
        </div>
        <FormSection title="Endereço">
          <FormGrid columns={colunas}>
            <Input label="CEP" placeholder="00000-000" />
            <Input label="Logradouro" />
            <Input label="Número" />
            <Input label="Bairro" />
            <Input label="Município" />
            <Input label="UF" />
          </FormGrid>
        </FormSection>
      </div>
    );
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  render: Padrao.render,
};

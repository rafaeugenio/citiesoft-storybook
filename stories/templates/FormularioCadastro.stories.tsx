import type { Meta, StoryObj } from '@storybook/react-vite';
import { FormularioCadastroTela, type FormularioCadastroTelaProps } from '@/components/application/telas/formulario-cadastro';

const meta = {
  title: 'Templates/Sistemas/Formulário de cadastro',
  component: FormularioCadastroTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "Cadastro de paciente com FormSection, FormGrid e barra de ações fixa. Valida CPF, Cartão SUS e datas dd/mm/aaaa. A mesma tela abre em Drawer pelo modo drawer." } },
  },
  argTypes: {
    contained: { control: 'boolean' },
    modo: { control: 'inline-radio', options: ['pagina', 'drawer'] },
    initialValues: { control: 'inline-radio', options: ['vazio', 'preenchido'] },
  },
} satisfies Meta<FormularioCadastroTelaProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div
        className="relative h-[720px] overflow-hidden"
        style={{ ['--template-preview-height' as string]: '720px' }}
      >
        <Story />
      </div>
    ),
  ],
};

/** Viewport de celular. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

/** Envio inválido: aviso no topo e erro em cada campo obrigatório. */
export const ComErros: Story = {
  args: { initialSubmitted: true },
};

/** Formulário com dados fictícios válidos. */
export const Preenchido: Story = {
  args: { initialValues: 'preenchido' },
};

/** Envio em andamento: botão com indicador e campos bloqueados. */
export const Salvando: Story = {
  args: { initialValues: 'preenchido', initialSaving: true },
};

/** O mesmo formulário dentro de um Drawer sobre a listagem de pacientes. */
export const EmDrawer: Story = {
  args: { modo: 'drawer' },
};

/** Drawer com erros de validação. */
export const EmDrawerComErros: Story = {
  args: { modo: 'drawer', initialSubmitted: true },
};

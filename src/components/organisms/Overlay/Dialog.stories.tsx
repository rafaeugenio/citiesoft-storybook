import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Dialog } from './Overlay';
import { Button } from '../../atoms/Button/Button';
import { Input } from '../../molecules/Input/Input';
import { Select } from '../../molecules/Select/Select';

/**
 * Toda story aqui começa FECHADA, com um gatilho visível.
 *
 * `dialog` em modo modal sobe para a top layer do navegador, acima de qualquer
 * z-index. Como a página de docs renderiza todas as stories juntas, abrir por
 * padrão empilhava os overlays uns sobre os outros e cobria a documentação.
 * Abrir pelo gatilho também é o uso real do componente.
 */

const meta = {
  title: 'Organismos/Overlay/Dialog',
  component: Dialog,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Diálogo modal para tarefa que exige foco total: um formulário, um preview ou um aceite que precisa interromper o fluxo até ser concluído. Spec: `03-components/modals-dialogs-drawers.md` v2.0.0. Equivalente PrimeNG: `p-dialog`. **Quando usar este e não os irmãos:** use o Dialog quando a pessoa vai *executar uma tarefa* dentro do overlay; use o [ConfirmDialog](?path=/docs/organismos-overlay-confirmdialog--docs) quando ela só precisa *decidir explicitamente* antes de prosseguir (sem botão de fechar, foco inicial na ação segura); use o [Drawer](?path=/docs/organismos-overlay-drawer--docs) quando o contexto da tela atrás precisa continuar visível, como em filtros, detalhe ou formulário lateral. Existe ainda o ConfirmPopup, irmão leve do ConfirmDialog, ancorado ao próprio gatilho para confirmação de baixo risco: ação destrutiva permanente usa sempre o diálogo modal, nunca o popup. Cada story abre pelo botão, como no produto.',
      },
    },
  },
  args: { aberto: false, titulo: 'Editar benefício de José Carlos Ribeiro', children: null },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Envolve a story num gatilho, mantendo o overlay fora da tela até o clique. */
function ComGatilho({
  rotulo,
  variante = 'primary',
  children,
}: {
  rotulo: string;
  variante?: 'primary' | 'secondary' | 'danger';
  children: (estado: { aberto: boolean; fechar: () => void }) => ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <Button variant={variante} onClick={() => setAberto(true)}>
        {rotulo}
      </Button>
      {children({ aberto, fechar: () => setAberto(false) })}
    </div>
  );
}

export const Formulario: Story = {
  name: 'Dialog · formulário',
  parameters: {
    docs: {
      description: {
        story:
          'Título identifica a tarefa e o objeto, nunca só "Editar". Botão primário nomeia o resultado esperado, e o secundário é sempre "Cancelar".',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Editar benefício">
      {({ aberto, fechar }) => (
        <Dialog
          aberto={aberto}
          onClose={fechar}
          titulo="Editar benefício de José Carlos Ribeiro"
          subtitulo="Matrícula 00123456"
          rodape={
            <>
              <Button variant="secondary" onClick={fechar}>
                Cancelar
              </Button>
              <Button variant="primary">Salvar alterações</Button>
            </>
          }
        >
          <div style={{ display: 'grid', gap: 16 }}>
            <Select
              label="Tipo de benefício"
              options={[
                { value: 'saude', label: 'Plano de saúde' },
                { value: 'transporte', label: 'Vale transporte' },
              ]}
              placeholder="Selecione o benefício"
            />
            <Input label="Data de vencimento" placeholder="Ex.: 31/12/2025" />
          </div>
        </Dialog>
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Editar benefício' }));

    // Escopo no canvas da story: na página de docs há vários dialogs no DOM.
    const dialogo = canvasElement.querySelector('dialog')!;
    await expect(dialogo.open).toBe(true);

    await waitFor(() =>
      expect(within(dialogo).getByRole('button', { name: 'Salvar alterações' })).toBeVisible(),
    );
    await expect(within(dialogo).getByRole('button', { name: 'Fechar diálogo' })).toBeVisible();

    // Fechar devolve a tela ao estado inicial.
    await userEvent.click(within(dialogo).getByRole('button', { name: 'Fechar diálogo' }));
    await waitFor(() => expect(dialogo.open).toBe(false));
  },
};

export const Obrigatorio: Story = {
  name: 'Dialog · obrigatório',
  parameters: {
    docs: {
      description: {
        story:
          'Aceite de termos: sem botão de fechar e sem saída por Escape. A decisão precisa ser explícita.',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Abrir aceite de termos">
      {({ aberto }) => (
        <Dialog
          aberto={aberto}
          obrigatorio
          tamanho="sm"
          titulo="Aceite dos termos de uso"
          rodape={<Button variant="primary">Aceitar os termos</Button>}
        >
          O uso do sistema exige o aceite dos termos vigentes desde 01/03/2025.
        </Dialog>
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Abrir aceite de termos' }));

    const dialogo = canvasElement.querySelector('dialog')!;
    await expect(within(dialogo).queryByRole('button', { name: 'Fechar diálogo' })).toBeNull();

    await userEvent.keyboard('{Escape}');
    // Escape não fecha um modal obrigatório.
    await expect(dialogo.open).toBe(true);
  },
};

export const Tamanhos: Story = {
  name: 'Dialog · tamanhos',
  parameters: {
    docs: {
      description: {
        story:
          'sm 400px para mensagem simples, md 560px para formulário de 3 a 8 campos (padrão), lg 720px para formulário extenso, xl 960px para preview de relatório.',
      },
    },
  },
  render: function Tamanhos() {
    const [tamanho, setTamanho] = useState<'sm' | 'md' | 'lg' | 'xl' | null>(null);
    return (
      <div style={{ display: 'flex', gap: 12, padding: 24 }}>
        {(['sm', 'md', 'lg', 'xl'] as const).map((valor) => (
          <Button key={valor} variant="secondary" onClick={() => setTamanho(valor)}>
            Abrir {valor}
          </Button>
        ))}
        <Dialog
          aberto={tamanho !== null}
          tamanho={tamanho ?? 'md'}
          titulo={`Diálogo ${tamanho ?? ''}`}
          onClose={() => setTamanho(null)}
          rodape={
            <Button variant="secondary" onClick={() => setTamanho(null)}>
              Fechar
            </Button>
          }
        >
          Largura da variante {tamanho}.
        </Dialog>
      </div>
    );
  },
};

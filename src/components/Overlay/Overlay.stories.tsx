import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ConfirmDialog, Dialog, Drawer } from './Overlay';
import { Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { Select } from '../Select/Select';

/**
 * Toda story aqui começa FECHADA, com um gatilho visível.
 *
 * `dialog` em modo modal sobe para a top layer do navegador, acima de qualquer
 * z-index. Como a página de docs renderiza todas as stories juntas, abrir por
 * padrão empilhava os overlays uns sobre os outros e cobria a documentação.
 * Abrir pelo gatilho também é o uso real do componente.
 */

const meta = {
  title: 'Overlay/Dialog e Drawer',
  component: Dialog,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dialog, ConfirmDialog e Drawer. Spec: `03-components/modals-dialogs-drawers.md` v2.0.0. Equivalente PrimeNG: `p-dialog`, `p-confirmdialog`, `p-drawer`. Cada story abre pelo botão, como no produto.',
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

export const Confirmacao: Story = {
  name: 'ConfirmDialog · exclusão',
  parameters: {
    docs: {
      description: {
        story:
          'O título nomeia o objeto afetado e o corpo descreve a consequência. O foco inicial vai para "Cancelar", padrão defensivo contra clique acidental.',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Excluir processo" variante="danger">
      {({ aberto, fechar }) => (
        <ConfirmDialog
          aberto={aberto}
          titulo="Excluir processo 2025/0481?"
          descricao="Os anexos e o histórico do processo serão removidos permanentemente."
          rotuloConfirmar="Excluir processo"
          onClose={fechar}
        />
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Excluir processo' }));

    const dialogo = canvasElement.querySelector('dialog')!;
    await expect(dialogo).toHaveAttribute('role', 'alertdialog');

    // Foco inicial na ação segura, nunca na destrutiva.
    await waitFor(() =>
      expect(within(dialogo).getByRole('button', { name: 'Cancelar' })).toHaveFocus(),
    );
    // Sem botão de fechar: a decisão precisa ser explícita.
    await expect(within(dialogo).queryByRole('button', { name: /Fechar/ })).toBeNull();
  },
};

export const ConfirmacaoEmCurso: Story = {
  name: 'ConfirmDialog · confirmando',
  parameters: {
    docs: {
      description: {
        story: 'Spinner na ação e ambos os botões desabilitados enquanto processa.',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Arquivar processo" variante="secondary">
      {({ aberto, fechar }) => (
        <ConfirmDialog
          aberto={aberto}
          confirmando
          titulo="Arquivar processo 2025/0481?"
          descricao="O processo sai da fila de análise e pode ser reaberto pelo gestor."
          rotuloConfirmar="Arquivar"
          variante="warning"
          onClose={fechar}
        />
      )}
    </ComGatilho>
  ),
};

export const PainelDeFiltros: Story = {
  name: 'Drawer · filtros',
  render: () => (
    <ComGatilho rotulo="Abrir filtros" variante="secondary">
      {({ aberto, fechar }) => (
        <Drawer
          aberto={aberto}
          titulo="Filtros avançados"
          posicao="right-md"
          onClose={fechar}
          rodape={
            <>
              <Button variant="secondary" onClick={fechar}>
                Cancelar
              </Button>
              <Button variant="primary">Aplicar filtros</Button>
            </>
          }
        >
          <Select
            label="Município"
            placeholder="Todos os municípios"
            options={[
              { value: 'sao-luis', label: 'São Luís' },
              { value: 'imperatriz', label: 'Imperatriz' },
            ]}
          />
          <Select
            label="Período"
            placeholder="Qualquer período"
            options={[
              { value: '30', label: 'Últimos 30 dias' },
              { value: '90', label: 'Últimos 90 dias' },
            ]}
          />
        </Drawer>
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Abrir filtros' }));

    const painel = canvasElement.querySelector('dialog')!;
    const fechar = within(painel).getByRole('button', { name: 'Fechar filtros avançados' });

    // Alvo de toque de 44x44 no botão de fechar do painel.
    await expect(fechar.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    // Placeholder de filtro indica ausência de seleção, nunca vazio.
    await expect(within(painel).getByLabelText('Município')).toHaveDisplayValue(
      'Todos os municípios',
    );
  },
};

export const PainelDeLeitura: Story = {
  name: 'Drawer · painel de leitura',
  parameters: {
    docs: {
      description: { story: 'Sem ações, o rodapé é omitido.' },
    },
  },
  render: () => (
    <ComGatilho rotulo="Ver detalhe do processo" variante="secondary">
      {({ aberto, fechar }) => (
        <Drawer
          aberto={aberto}
          titulo="Detalhe do processo 2025/0481"
          posicao="right-sm"
          onClose={fechar}
        >
          <p style={{ margin: 0 }}>
            Solicitação de TFD registrada em 12/03/2025 por Maria de Fátima Souza, com destino a
            São Luís.
          </p>
        </Drawer>
      )}
    </ComGatilho>
  ),
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

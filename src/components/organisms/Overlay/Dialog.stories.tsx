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
        component: [
          'Diálogo modal para tarefa que exige foco total: um formulário, um preview ou um aceite que precisa interromper o fluxo até ser concluído. Spec: `03-components/modals-dialogs-drawers.md` v2.0.0. Equivalente PrimeNG: `p-dialog`. **Quando usar este e não os irmãos:** use o Dialog quando a pessoa vai *executar uma tarefa* dentro do overlay; use o [ConfirmDialog](?path=/docs/organismos-overlay-confirmdialog--docs) quando ela só precisa *decidir explicitamente* antes de prosseguir (sem botão de fechar, foco inicial na ação segura); use o [Drawer](?path=/docs/organismos-overlay-drawer--docs) quando o contexto da tela atrás precisa continuar visível, como em filtros, detalhe ou formulário lateral. Existe ainda o ConfirmPopup, irmão leve do ConfirmDialog, ancorado ao próprio gatilho para confirmação de baixo risco: ação destrutiva permanente usa sempre o diálogo modal, nunca o popup. Cada story abre pelo botão, como no produto.',
          '',
          '**Quando não usar:** formulário longo, com muitos campos, seções ou anexos, porque o `dialog`',
          'nativo em modo modal deixa a tela de trás inerte e o servidor perde de vista o registro que',
          'estava consultando para preencher; nesses casos a tarefa merece tela própria, com URL, ou um',
          '`Drawer` quando a listagem atrás ainda precisa ser lida. Também não use para pergunta de sim',
          'ou não sobre consequência já descrita, que é do `ConfirmDialog` (foco inicial na ação segura e',
          'sem botão de fechar); para aviso do que já aconteceu, sem decisão a tomar, que é `Toast` ou',
          '`Message`; para erro de validação de campo, que pertence à `Message` junto do campo; e para',
          'conteúdo que a pessoa precisa imprimir, copiar, salvar como PDF ou enviar por link, já que o',
          'modal não tem endereço próprio e some ao recarregar.',
          '',
          '**Peso em jornada longa:** abrir um modal por cima de quem está no meio de um preenchimento',
          'de vinte minutos custa caro. O `dialog` nativo fecha por `Escape` e por clique no fundo, o',
          'que dispara `onClose` e pode descartar o que foi digitado dentro. Se o conteúdo do modal tem',
          'campos, guarde rascunho ou use `obrigatorio` para bloquear o fechamento acidental, e nunca',
          'abra o modal a partir de evento automático, apenas de uma ação que a pessoa pediu.',
        ].join('\n'),
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
          'Aceite de termos: sem botão de fechar e sem saída por Escape. A decisão precisa ser explícita. Com um único botão, o rodapé assume a segunda anatomia do kit e o botão ocupa a largura inteira: é a única saída, e o desenho diz isso.',
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

    // Rodapé de um botão só: largura total, a segunda anatomia do kit.
    const rodape = dialogo.querySelector<HTMLElement>('.citie-dialog__rodape');
    const botao = within(dialogo).getByRole('button', { name: 'Aceitar os termos' });
    const larguraUtil =
      (rodape as HTMLElement).clientWidth -
      Number.parseFloat(getComputedStyle(rodape as Element).paddingLeft) -
      Number.parseFloat(getComputedStyle(rodape as Element).paddingRight);
    await expect(Math.abs(botao.getBoundingClientRect().width - larguraUtil)).toBeLessThan(1);
  },
};

export const Anatomia: Story = {
  name: 'Dialog · anatomia do kit',
  parameters: {
    docs: {
      description: {
        story:
          'Dialog do UI Kit: 640px de largura, raio 10, borda de 1px, shadow-lg, título 20 com subtítulo muted, botão de fechar de 30px no canto e rodapé com dois botões à direita. A story abre e mede.',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Abrir diálogo">
      {({ aberto, fechar }) => (
        <Dialog
          aberto={aberto}
          onClose={fechar}
          titulo="Encerrar processo 2025/0481"
          subtitulo="Solicitação de Maria de Fátima Souza"
          rodape={
            <>
              <Button variant="secondary" onClick={fechar}>
                Cancelar
              </Button>
              <Button variant="primary">Encerrar processo</Button>
            </>
          }
        >
          O processo sai da fila de análise e o histórico fica disponível só para consulta.
        </Dialog>
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Abrir diálogo' }));
    const dialogo = canvasElement.querySelector<HTMLDialogElement>('dialog')!;
    await waitFor(() => expect(dialogo.open).toBe(true));

    const estilo = getComputedStyle(dialogo);
    await expect(dialogo.getBoundingClientRect().width).toBe(640);
    await expect(estilo.borderTopLeftRadius).toBe('10px');
    await expect(estilo.borderTopWidth).toBe('1px');
    await expect(estilo.boxShadow).not.toBe('none');

    const titulo = dialogo.querySelector<HTMLElement>('.citie-dialog__titulo');
    await expect(getComputedStyle(titulo as Element).fontSize).toBe('20px');

    const fechar = within(dialogo).getByRole('button', { name: 'Fechar diálogo' });
    await expect(fechar.getBoundingClientRect().width).toBe(30);
    await expect(fechar.getBoundingClientRect().height).toBe(30);

    // Dois botões à direita: o último termina na borda interna do rodapé.
    const rodape = dialogo.querySelector<HTMLElement>('.citie-dialog__rodape')!;
    const primario = within(dialogo).getByRole('button', { name: 'Encerrar processo' });
    const bordaInterna =
      rodape.getBoundingClientRect().right - Number.parseFloat(getComputedStyle(rodape).paddingRight);
    await expect(Math.abs(primario.getBoundingClientRect().right - bordaInterna)).toBeLessThan(1);

    await userEvent.click(fechar);
    await waitFor(() => expect(dialogo.open).toBe(false));
  },
};

export const Tamanhos: Story = {
  name: 'Dialog · tamanhos',
  parameters: {
    docs: {
      description: {
        story:
          'sm 400px para mensagem simples, md 640px para formulário de 3 a 8 campos (padrão, a largura do Dialog do kit), lg 800px para formulário extenso, xl 960px para preview de relatório.',
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

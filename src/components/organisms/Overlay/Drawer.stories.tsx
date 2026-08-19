import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Drawer } from './Overlay';
import { Button } from '../../atoms/Button/Button';
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
  title: 'Organismos/Overlay/Drawer',
  component: Drawer,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Painel lateral para filtros, detalhe de registro ou formulário que mantém o contexto da tela atrás visível. Spec: `03-components/modals-dialogs-drawers.md` v2.0.0. Equivalente PrimeNG: `p-drawer`. **Quando usar este e não os irmãos:** use o Drawer quando a pessoa precisa continuar enxergando a listagem ou a tela de origem enquanto opera o painel; use o [Dialog](?path=/docs/organismos-overlay-dialog--docs) quando a tarefa exige foco total e a tela atrás deve sair de cena; use o [ConfirmDialog](?path=/docs/organismos-overlay-confirmdialog--docs) quando for apenas uma decisão explícita antes de prosseguir, sem botão de fechar e com foco inicial na ação segura. Existe ainda o ConfirmPopup, irmão leve do ConfirmDialog, ancorado ao próprio gatilho para confirmação de baixo risco: ação destrutiva permanente usa sempre o diálogo modal, nunca o popup. Cada story abre pelo botão, como no produto.',
          '',
          '**Limite real desta implementação:** o Drawer usa o `dialog` nativo em modo modal, igual ao',
          '`Dialog`. A tela de trás continua **visível**, e é para isso que ele serve, mas fica inerte:',
          'não dá para rolar a listagem, clicar em uma linha nem copiar um número de matrícula enquanto',
          'o painel está aberto. Se a pessoa precisa operar os dois lados ao mesmo tempo, o caminho é',
          'dividir a tela com `Splitter` ou colocar o conteúdo em um `Panel` fixo na coluna lateral.',
          '',
          '**Quando não usar:** navegação principal do sistema, que é da `Sidebar` e precisa ficar sempre',
          'disponível, sem exigir abertura; confirmação de sim ou não, que é do',
          '[ConfirmDialog](?path=/docs/organismos-overlay-confirmdialog--docs); tarefa que não tem',
          'nenhuma relação com a tela atrás, em que manter a listagem à vista só divide a atenção (use o',
          '[Dialog](?path=/docs/organismos-overlay-dialog--docs)); cadastro longo, com muitas seções e',
          'anexos, que merece tela própria com URL, rascunho e possibilidade de voltar depois; e telas',
          'estreitas, onde o painel ocupa quase toda a largura e o contexto que justificava o Drawer',
          'desaparece.',
          '',
          '**Peso em jornada longa:** o painel fecha por `Escape` e por clique no fundo, e os dois',
          'caminhos chamam `onClose`. Em drawer com campos preenchidos, isso significa perda silenciosa',
          'de dado de processo por um clique fora de alvo. Guarde o que foi digitado ao fechar, ou peça',
          'confirmação antes de descartar.',
        ].join('\n'),
      },
    },
  },
  args: { aberto: false, titulo: 'Filtros avançados', children: null },
} satisfies Meta<typeof Drawer>;

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

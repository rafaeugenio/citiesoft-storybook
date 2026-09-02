import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Badge';

const meta = {
  title: 'Átomos/Marcadores/Tag',
  component: Tag,
  tags: ['autodocs', 'atom', 'a11y'],
  parameters: {
    docs: {
      description: {
        component:
          'Rótulo estático que classifica um registro por atributo: categoria, tipo de procedimento, natureza de despesa, vínculo. Aparece em colunas de tabela e cards. Spec: `03-components/badges-tags.md` v2.0.0. Equivalente PrimeNG: `p-tag`.\n\n**Quando usar este e não os irmãos:** Tag descreve um atributo **estático** do registro e **não é removível** pelo usuário. Se o rótulo puder ser removido ou alternado (filtro aplicado, seleção múltipla, destinatário), use `Chip`. Se ele comunica a etapa de um fluxo de trabalho, use `StatusIndicator`, que é composição de Tag com o mapa de severidade. Se o que se comunica é uma contagem sobreposta a outro elemento, use `Badge`.\n\nEste arquivo guarda o **mapa canônico de 7 severidades** compartilhado pelos quatro marcadores: hex fora do mapa é proibido. Tags do mesmo grupo semântico (por exemplo, todas as especialidades médicas) devem compartilhar a mesma severidade para leitura rápida em tabela. Cor nunca é o único diferencial: o texto sempre muda junto.\n\n**Quando não usar:** para o valor de um campo comum da célula (nome, matrícula, data, lotação): a pílula colorida cria hierarquia visual que o dado não tem e, repetida em todas as linhas, a tabela vira mancha de cor onde nada se destaca mais; deixe texto simples na célula do `Table`. Quando o usuário precisa tirar aquele rótulo dali: Tag não recebe foco nem tem ação, o servidor tenta clicar no rótulo e a tela não responde; use `Chip`. Para muitos rótulos na mesma célula (acima de três, a linha quebra e a altura da tabela passa a variar de registro para registro, atrapalhando a varredura vertical): mostre os dois primeiros e leve o resto para o detalhe do registro. Para etapa de fluxo de trabalho use `StatusIndicator`, que fixa a severidade pelo glossário e evita que o mesmo estado apareça verde numa tela e cinza em outra. Tag também não substitui link nem botão: rótulo que precisa navegar ou executar ação é `Button`.',
      },
    },
  },
  args: { label: 'Cardiologia' },
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Mapa de severidade ---------- */

export const MapaDeSeveridade: Story = {
  name: 'Mapa canônico · 7 severidades',
  parameters: {
    docs: {
      description: {
        story:
          'Ordem de urgência: danger (ação imediata) acima de warn (atenção), acima de info e primary (andamento), acima de success (concluído), acima de secondary (neutro).',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Tag label="Aprovado" severity="success" />
      <Tag label="Em andamento" severity="info" />
      <Tag label="Pendente" severity="warn" />
      <Tag label="Devolvido" severity="danger" />
      <Tag label="Presencial" severity="secondary" />
      <Tag label="SUS" severity="primary" />
      <Tag label="Destaque" severity="contrast" />
    </div>
  ),
};

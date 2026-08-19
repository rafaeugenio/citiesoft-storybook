import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ESTADOS_DE_FLUXO, StatusIndicator, type EstadoDeFluxo } from './Badge';

const meta = {
  title: 'Átomos/Marcadores/StatusIndicator',
  component: StatusIndicator,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Comunica em que etapa de um fluxo de trabalho um registro está: processo TFD, lançamento, licitação, documento em assinatura. Spec: `03-components/badges-tags.md` v2.0.0. Não existe componente dedicado no PrimeOne: é **composição de `Tag`** (pílula com ícone) usando o mapa de severidade canônico, nunca um componente novo criado do zero.\n\n**Quando usar este e não os irmãos:** use StatusIndicator sempre que o registro pertencer a um fluxo com **etapas nomeadas** (Rascunho, Enviado, Em Análise, Aprovado, Devolvido...). Se o rótulo é atributo estático de cadastro, use `Tag` direto. Se é filtro que o usuário remove, use `Chip`. Se é contagem de pendências, use `Badge`.\n\nO rótulo vai por extenso, nunca abreviado nem em caixa alta, e a severidade de cada estado é fixada pelo glossário — o mapa canônico de 7 severidades está documentado em Átomos/Marcadores/Tag. Em coluna de tabela, largura mínima de 120px para a coluna não variar conforme o estado.\n\n**Quando não usar:** para etapa que não está no glossário. O componente aceita apenas os 11 estados de `ESTADOS_DE_FLUXO`, e a saída errada é encaixar o processo no rótulo mais parecido: o servidor lê "Em Análise" numa etapa de perícia e trata o processo na fila errada. Amplie o glossário com o time em vez de contornar com uma `Tag` solta de cor escolhida na hora, porque aí o mesmo estado aparece âmbar numa tela e cinza em outra. Para andamento quantitativo (percentual de conclusão, itens processados de um lote) use `ProgressBar`, que mostra o quanto falta; o status só diz em que caixa o registro está. Para indicar em que passo o usuário está dentro de um formulário longo use `Stepper`, que também oferece o caminho de volta. Para atributo permanente do cadastro use `Tag`, e para filtro que o usuário remove use `Chip`.',
      },
    },
  },
  args: { estado: 'Em Análise' },
} satisfies Meta<typeof StatusIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusTodosOsEstados: Story = {
  name: 'Status Indicator · estados oficiais',
  parameters: {
    docs: {
      description: {
        story:
          'Os 11 estados do glossário, cada um com a severidade canônica. Rótulos por extenso, nunca abreviados nem em caixa alta.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {(Object.keys(ESTADOS_DE_FLUXO) as EstadoDeFluxo[]).map((estado) => (
        <StatusIndicator key={estado} estado={estado} />
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Aguardando Assinatura')).toBeVisible();
    // Largura mínima fixa para a coluna de tabela não variar com o estado.
    const largura = canvas.getByText('Rascunho').closest('.citie-status')!.getBoundingClientRect().width;
    await expect(largura).toBeGreaterThanOrEqual(120);
  },
};

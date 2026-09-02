import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { ButtonGroup } from './ButtonGroup';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Moléculas/Ações/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Botões emendados como um objeto único, para ações irmãs do mesmo nível: paginação manual, zoom, disparos de período. Os cantos ficam só nas extremidades e cada junção tem uma borda, nunca duas. Os filhos são `Átomos/Ações/Button` comuns, sem alteração: o grupo resolve as junções por CSS de vizinhança, e hover, foco e pressão continuam sendo os do próprio Button.\n\nO contêiner é `role="group"` com nome acessível obrigatório (`rotulo`), que dá ao leitor de tela o contexto que a emenda visual dá para quem enxerga.\n\n**Quando não usar:** para escolher um valor entre opções mutuamente exclusivas com estado persistente, que é o `Moléculas/Campos/SelectButton`, ou uma opção liga e desliga, que é o `Átomos/Escolha/ToggleButton`; aqui cada peça é um disparo sem estado. Não usar para pares de hierarquia diferente, como confirmar e cancelar: ação primária e secundária ficam soltas com espaçamento, porque emendar comunica irmandade que elas não têm. E não usar para uma ação principal com variações no mesmo verbo, que é o `Moléculas/Ações/SplitButton`.',
      },
    },
  },
  args: {
    rotulo: 'Período do painel',
    children: null,
  },
} satisfies Meta<typeof ButtonGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  name: 'ButtonGroup · horizontal, junções resolvidas',
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">Dia</Button>
      <Button variant="secondary">Semana</Button>
      <Button variant="secondary">Mês</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grupo = canvas.getByRole('group', { name: 'Período do painel' });
    const botoes = within(grupo).getAllByRole('button');
    await expect(botoes).toHaveLength(3);

    // Canto só nas extremidades, no `radius` do kit (10px): a junção interna é reta dos dois lados.
    const [primeiro, meio, ultimo] = botoes.map((b) => getComputedStyle(b));
    await expect(primeiro.borderTopLeftRadius).toBe('10px');
    await expect(primeiro.borderTopRightRadius).toBe('0px');
    await expect(meio.borderTopLeftRadius).toBe('0px');
    await expect(meio.borderTopRightRadius).toBe('0px');
    await expect(ultimo.borderTopLeftRadius).toBe('0px');
    await expect(ultimo.borderTopRightRadius).toBe('10px');

    // Uma borda por junção: o vizinho recua exatamente a espessura da borda.
    await expect(meio.marginInlineStart).toBe('-1px');
    const caixaPrimeiro = botoes[0].getBoundingClientRect();
    const caixaMeio = botoes[1].getBoundingClientRect();
    await expect(Math.round(caixaMeio.left - caixaPrimeiro.right)).toBe(-1);
  },
};

export const Teclado: Story = {
  name: 'ButtonGroup · teclado e anel de foco acima da junção',
  parameters: {
    docs: {
      description: {
        story:
          'Cada botão segue sendo uma parada de Tab. A peça em foco sobe um plano para o anel não ser coberto pela borda do vizinho, que é o defeito clássico de grupo emendado.',
      },
    },
  },
  render: (args) => (
    <ButtonGroup {...args} rotulo="Zoom do mapa">
      <Button variant="secondary">Aproximar</Button>
      <Button variant="secondary">Afastar</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const aproximar = canvas.getByRole('button', { name: 'Aproximar' });
    const afastar = canvas.getByRole('button', { name: 'Afastar' });

    await userEvent.tab();
    await expect(aproximar).toHaveFocus();
    await userEvent.tab();
    await expect(afastar).toHaveFocus();

    // O botão em foco sobe para o plano 2: o anel vence a junção compartilhada.
    await expect(getComputedStyle(afastar).zIndex).toBe('2');
    // E o grupo isola o empilhamento: o plano 2 vale dentro dele, nunca contra a página.
    await expect(getComputedStyle(afastar.parentElement!).isolation).toBe('isolate');
  },
};

export const Vertical: Story = {
  name: 'ButtonGroup · vertical',
  render: (args) => (
    <ButtonGroup {...args} rotulo="Ordem do item" orientacao="vertical">
      <Button variant="secondary">Subir</Button>
      <Button variant="secondary">Descer</Button>
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const botoes = within(canvas.getByRole('group', { name: 'Ordem do item' })).getAllByRole(
      'button',
    );

    const [primeiro, ultimo] = botoes.map((b) => getComputedStyle(b));
    // Na vertical os cantos vivos são os de cima do primeiro e os de baixo do último.
    await expect(primeiro.borderTopLeftRadius).toBe('10px');
    await expect(primeiro.borderBottomLeftRadius).toBe('0px');
    await expect(ultimo.borderTopLeftRadius).toBe('0px');
    await expect(ultimo.borderBottomLeftRadius).toBe('10px');
    await expect(ultimo.marginBlockStart).toBe('-1px');

    // Emendados na vertical: mesmo eixo, larguras iguais.
    const caixaPrimeiro = botoes[0].getBoundingClientRect();
    const caixaUltimo = botoes[1].getBoundingClientRect();
    await expect(caixaPrimeiro.width).toBe(caixaUltimo.width);
    await expect(Math.round(caixaUltimo.top - caixaPrimeiro.bottom)).toBe(-1);
  },
};

export const SomenteIcone: Story = {
  name: 'ButtonGroup · botões de ícone em barra densa',
  parameters: {
    docs: {
      description: {
        story:
          'Grupo de botões somente-ícone para barra de ferramenta densa. Cada botão mantém o próprio `aria-label`, porque o nome do grupo dá o contexto e não o verbo.',
      },
    },
  },
  render: (args) => (
    <ButtonGroup {...args} rotulo="Alinhamento do texto">
      <Button variant="secondary" size="small" iconOnly aria-label="Alinhar à esquerda" icon={<span aria-hidden="true">⟸</span>} />
      <Button variant="secondary" size="small" iconOnly aria-label="Centralizar" icon={<span aria-hidden="true">≡</span>} />
      <Button variant="secondary" size="small" iconOnly aria-label="Alinhar à direita" icon={<span aria-hidden="true">⟹</span>} />
    </ButtonGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grupo = canvas.getByRole('group', { name: 'Alinhamento do texto' });
    // Cada disparo mantém o próprio nome acessível dentro do contexto do grupo.
    await expect(within(grupo).getByRole('button', { name: 'Centralizar' })).toBeInTheDocument();
    await expect(
      within(grupo).getByRole('button', { name: 'Alinhar à direita' }),
    ).toBeInTheDocument();
  },
};

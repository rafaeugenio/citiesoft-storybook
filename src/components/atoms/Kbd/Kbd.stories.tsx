import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Kbd } from './Kbd';

const meta = {
  title: 'Átomos/Marcadores/Kbd',
  component: Kbd,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Marcador de atalho de teclado: `⌘K` numa linha de menu, `Ctrl + S` num tooltip, `Esc` no rodapé de um diálogo. Anunciar o atalho na interface é o que faz o operador aprendê-lo, e num sistema usado o dia inteiro cada atalho aprendido é tempo devolvido.\n\nO elemento é um `<kbd>` real com cada tecla num `<kbd>` aninhado. A camada visual mostra o símbolo e fica com `aria-hidden`; o nome acessível diz cada tecla por extenso ("Command K"), porque leitor de tela lendo `⌘` não comunica nada. A altura fecha em 20px para caber numa linha de menu de 32px sem inflar a densidade.\n\n**Quando não usar:** para disparar a ação, porque o Kbd é anúncio e não controle; ação se dispara pelo `Átomos/Ações/Button` ou pelo item de menu que carrega o atalho. Não usar para código ou identificador em linha, que é papel de texto em `--citie-font-mono` simples, sem moldura de tecla. E não usar como única forma de expor uma ação: o atalho acompanha o rótulo visível do comando, nunca o substitui.',
      },
    },
  },
  args: { teclas: ['⌘', 'K'] },
} satisfies Meta<typeof Kbd>;

export default meta;
type Story = StoryObj<typeof meta>;

export const NomePorExtenso: Story = {
  name: 'Kbd · símbolo visível, nome por extenso',
  parameters: {
    docs: {
      description: {
        story:
          'O símbolo fica com `aria-hidden` e o leitor de tela recebe "Command K" de um texto oculto. A prop `rotulo` sobrepõe a derivação automática quando a sequência pedir leitura específica.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O nome por extenso existe no acessível, mesmo invisível.
    await expect(canvas.getByText('Command K')).toBeInTheDocument();

    // Cada tecla visual está fora da árvore de acessibilidade.
    const simbolos = canvasElement.querySelectorAll('.citie-kbd__tecla');
    await expect(simbolos).toHaveLength(2);
    for (const simbolo of simbolos) {
      await expect(simbolo).toHaveAttribute('aria-hidden', 'true');
    }

    // `<kbd>` real, aninhado por tecla, como a especificação HTML descreve.
    await expect(canvasElement.querySelector('kbd.citie-kbd')).not.toBeNull();
    await expect(simbolos[0].tagName).toBe('KBD');
  },
};

export const Sequencias: Story = {
  name: 'Kbd · sequências e teclas nomeadas',
  render: () => (
    <div style={{ display: 'flex', gap: 'var(--citie-spacing-5)', alignItems: 'center' }}>
      <Kbd teclas={['⌘', 'K']} />
      <Kbd teclas={['Ctrl', 'S']} />
      <Kbd teclas={['⇧', '⌘', 'P']} />
      <Kbd teclas={['Esc']} />
      <Kbd teclas={['F2']} rotulo="F dois" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Modificadoras conhecidas saem por extenso; tecla fora da tabela passa como veio.
    await expect(canvas.getByText('Control S')).toBeInTheDocument();
    await expect(canvas.getByText('Shift Command P')).toBeInTheDocument();
    await expect(canvas.getByText('Escape')).toBeInTheDocument();
    // `rotulo` vence a derivação automática.
    await expect(canvas.getByText('F dois')).toBeInTheDocument();
  },
};

export const EmLinhaDeMenu: Story = {
  name: 'Kbd · densidade em linha de menu',
  parameters: {
    docs: {
      description: {
        story:
          'O marcador ocupa a trilha da anatomia de linha (líder, conteúdo, trilha) sem passar da altura compacta de 32px. É o teste de densidade que justifica os 20px de altura da tecla.',
      },
    },
  },
  render: () => (
    <div
      style={{
        width: 280,
        border: '1px solid var(--citie-border-default)',
        borderRadius: 'var(--citie-radius-lg)',
        background: 'var(--citie-background-surface)',
        padding: 'var(--citie-spacing-1)',
      }}
    >
      {[
        { acao: 'Buscar processo', teclas: ['⌘', 'K'] },
        { acao: 'Salvar rascunho', teclas: ['Ctrl', 'S'] },
        { acao: 'Fechar painel', teclas: ['Esc'] },
      ].map(({ acao, teclas }) => (
        <div
          key={acao}
          data-testid="linha-de-menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--citie-spacing-3)',
            height: 'var(--citie-control-height-small)',
            paddingInline: 'var(--citie-spacing-3)',
            fontFamily: 'var(--citie-font-ui)',
            fontSize: 'var(--citie-font-size-body-sm)',
            color: 'var(--citie-text-primary)',
          }}
        >
          <span>{acao}</span>
          <Kbd teclas={teclas} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    const linhas = canvasElement.querySelectorAll<HTMLElement>('[data-testid="linha-de-menu"]');
    await expect(linhas).toHaveLength(3);
    for (const linha of linhas) {
      // A linha compacta segue em 32px: o marcador não inflou a altura.
      await expect(linha.getBoundingClientRect().height).toBe(32);
      const tecla = linha.querySelector<HTMLElement>('.citie-kbd__tecla');
      await expect(tecla).not.toBeNull();
      await expect(tecla!.getBoundingClientRect().height).toBeLessThanOrEqual(20);
    }
  },
};

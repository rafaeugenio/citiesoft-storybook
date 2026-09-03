import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { Item } from './Item';
import { Badge } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';

function IconeDocumento() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M7 3h7l5 5v13H7z" strokeLinejoin="round" />
      <path d="M14 3v5h5" strokeLinejoin="round" />
    </svg>
  );
}

const meta = {
  title: 'Moléculas/Contêineres/Item',
  component: Item,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Item. Linha de lista rica do UI Kit: mídia à esquerda, título e descrição no centro, ação à direita. Reaproveita a caixa de ícone do Card de hub (`--citie-hub-caixa-de-icone` 36, `--citie-hub-raio-da-caixa` 8, Lote 3) e o `Avatar`/`AvatarGroup` já publicados, porque o kit não mede uma anatomia própria para esta peça.',
          '',
          '**Quando usar:** listbox do `Command`, resultado de busca, linha de notificação, item de um seletor rico com mídia. Qualquer coleção em que cada linha carregue mídia, título e um metadado curto.',
          '',
          '**Quando não usar:** dado tabular comparável entre linhas (`Organismos/Tabelas/Table`); item de navegação persistente (`Organismos/Navegação/Menu`, que já tem o próprio raio e realce de item).',
        ].join('\n'),
      },
    },
  },
  args: {
    titulo: 'Relatório de ocupação, março',
    descricao: 'Atualizado há 2 dias',
    midia: { tipo: 'icone', icone: <IconeDocumento /> },
  },
} satisfies Meta<typeof Item>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Variante · default',
};

export const Outline: Story = {
  name: 'Variante · outline',
  args: { variante: 'outline' },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('.citie-item') as HTMLElement;
    const estilo = getComputedStyle(item);
    // Raio 10 do kit e borda de 1px na variante que é a própria moldura.
    await expect(estilo.borderRadius).toBe('10px');
    await expect(estilo.borderWidth).toBe('1px');
    await expect(estilo.borderStyle).toBe('solid');
  },
};

export const Muted: Story = {
  name: 'Variante · muted',
  args: { variante: 'muted' },
  play: async ({ canvasElement }) => {
    const item = canvasElement.querySelector('.citie-item') as HTMLElement;
    const esperado = getComputedStyle(document.documentElement).getPropertyValue('--citie-background-subtle').trim();
    await expect(getComputedStyle(item).backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(esperado.length).toBeGreaterThan(0);
  },
};

export const ComRotuloEAcao: Story = {
  name: 'Composição · rótulo e ação',
  args: {
    rotulo: <Badge value={0} dot severity="info" size="sm" pele="tonal" />,
    acao: (
      <Button variant="text" size="mini" iconOnly aria-label="Baixar relatório">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M12 3v12m0 0-4-4m4 4 4-4M5 21h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Button>
    ),
  },
};

export const Avatar: Story = {
  name: 'Mídia · avatar',
  args: {
    midia: { tipo: 'avatar', nome: 'Maria de Fátima Souza' },
    titulo: 'Maria de Fátima Souza',
    descricao: 'Secretaria de Saúde',
  },
};

export const PilhaDeAvatares: Story = {
  name: 'Mídia · pilha de avatares',
  args: {
    midia: {
      tipo: 'pilha',
      pessoas: [
        { nome: 'Maria de Fátima Souza' },
        { nome: 'João Carlos Pereira' },
        { nome: 'Ana Paula Silva' },
        { nome: 'Carlos Eduardo Lima' },
      ],
    },
    titulo: 'Equipe de plantão',
    descricao: '4 responsáveis',
  },
};

export const Small: Story = {
  name: 'Tamanho · small',
  args: { tamanho: 'small' },
  play: async ({ canvasElement }) => {
    const icone = canvasElement.querySelector('.citie-item__icone') as HTMLElement;
    const esperado = getComputedStyle(document.documentElement).getPropertyValue('--citie-control-height-small').trim();
    await expect(getComputedStyle(icone).width).toBe(esperado);
  },
};

export const Interativo: Story = {
  name: 'Interação · linha inteira acionável',
  args: { aoSelecionar: fn() },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const linha = canvas.getByRole('button', { name: /Relatório de ocupação/ });
    await expect(linha).toBeVisible();
    await userEvent.click(linha);
    await expect(args.aoSelecionar).toHaveBeenCalledTimes(1);
    // O clique num `<button>` nativo já dá foco a ele no Chromium.
    await expect(linha).toHaveFocus();

    const anel = getComputedStyle(linha).boxShadow;
    await expect(anel).not.toBe('none');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { aoSelecionar: fn(), desabilitado: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const linha = canvas.getByRole('button', { name: /Relatório de ocupação/ });
    await expect(linha).toBeDisabled();
  },
};

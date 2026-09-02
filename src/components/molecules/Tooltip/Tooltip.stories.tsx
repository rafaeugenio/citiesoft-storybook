import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Tooltip } from './Tooltip';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Moléculas/Overlay/Tooltip',
  component: Tooltip,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Rótulo curto ancorado a um gatilho, para explicar um ícone, uma sigla ou uma coluna abreviada. Spec: `03-components/overlays-tooltip-popover.md` v2.0.0. Biblioteca Figma CitieOne: `07-figma-library/tooltip.md`. Equivalente PrimeNG: diretiva `pTooltip`.\n\n**Quando usar este e não o Popover.** O Tooltip carrega texto curto de até 2 linhas, nunca recebe foco e não pode ter conteúdo interativo dentro. Assim que a necessidade incluir um link, um botão ou um campo, o componente correto passa a ser o [Popover](?path=/docs/moléculas-overlay-popover--docs).\n\n**Quando não usar:** informação necessária para preencher o campo ou decidir sobre o processo, porque em tela de toque o balão só aparece depois de um gesto que ninguém descobre sozinho, e na impressão do processo ele não existe; texto permanente abaixo do campo, via prop `helper` do `Input`, do `Select` ou do `Textarea`, entrega a mesma instrução a todo mundo. Mensagem de erro é a prop `error` do campo mais `Moléculas/Feedback/Message`, que fica visível enquanto o erro durar. Nome acessível de botão de ícone é o `aria-label` do `Átomos/Ações/Button`: apoiar isso no tooltip deixa o botão anônimo para quem navega só por teclado com o foco em outro lugar. Texto longo também não serve, porque trunca depois de 2 linhas e não pode ser selecionado nem copiado; leve para `Moléculas/Overlay/Popover` ou para a própria tela. E qualquer link, botão ou campo dentro do balão exige o Popover, já que o Tooltip nunca recebe foco.',
      },
    },
  },
  args: { conteudo: 'Município de origem: São Luís do Maranhão', children: <button>Gatilho</button> },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PorTeclado: Story = {
  name: 'Tooltip · abre por foco de teclado',
  parameters: {
    docs: {
      description: {
        story:
          'Por teclado abre no foco, sem atraso. O tooltip nunca recebe foco e fica associado ao gatilho para o leitor de tela.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 48 }}>
      <Tooltip {...args}>
        <Button variant="text" aria-label="Município de origem">
          SLZ
        </Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Município de origem' });

    await userEvent.tab();
    await expect(gatilho).toHaveFocus();

    const dica = await canvas.findByRole('tooltip');
    await expect(dica).toHaveTextContent('Município de origem: São Luís do Maranhão');
    // A associação explícita liga o gatilho ao texto.
    await expect(gatilho).toHaveAttribute('aria-describedby', dica.id);
  },
};

export const AtrasoNoHover: Story = {
  name: 'Tooltip · atraso de 400ms no hover',
  parameters: {
    docs: {
      description: {
        story:
          'O atraso evita que a dica pisque durante a varredura rápida de uma tabela. Ao sair do alvo, some na hora.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 48 }}>
      <Tooltip {...args} atraso={120}>
        <Button variant="secondary">Passe o cursor</Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Passe o cursor' });

    await userEvent.hover(gatilho);
    await waitFor(() => expect(canvas.getByRole('tooltip')).toBeVisible());

    await userEvent.unhover(gatilho);
    await waitFor(() => expect(canvas.queryByRole('tooltip')).toBeNull());
  },
};

export const Anatomia: Story = {
  name: 'Tooltip · anatomia invertida do kit',
  parameters: {
    docs: {
      description: {
        story:
          'Tooltip invertido: fundo `--citie-popover` na tinta oposta ao tema, texto `--citie-popover-foreground` em 12/16, padding 6 por 8, raio 10 e seta de 6px na mesma tinta. A story mede cada valor e confere que fundo e texto do balão vêm dos dois tokens de popover, e não da superfície da página.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 48 }}>
      <Tooltip {...args} conteudo="Cadastro Nacional de Estabelecimentos de Saúde">
        <Button variant="text">CNES</Button>
      </Tooltip>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.tab();
    const dica = await canvas.findByRole('tooltip');
    const estilo = getComputedStyle(dica);

    await expect(estilo.fontSize).toBe('12px');
    await expect(estilo.lineHeight).toBe('16px');
    await expect(estilo.paddingTop).toBe('6px');
    await expect(estilo.paddingLeft).toBe('8px');
    await expect(estilo.borderTopLeftRadius).toBe('10px');

    // Fundo e texto invertidos: o balão usa os tokens de popover, e o fundo
    // dele difere da superfície da página.
    const raiz = getComputedStyle(dica.closest('[data-theme]') ?? document.documentElement);
    const superficie = raiz.getPropertyValue('--citie-background-surface').trim();
    await expect(estilo.backgroundColor).not.toBe(superficie);
    await expect(estilo.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');

    // Seta de 6px na tinta do balão.
    const seta = getComputedStyle(dica, '::after');
    await expect(seta.borderTopWidth).toBe('6px');
    await expect(seta.borderTopColor).toBe(estilo.backgroundColor);
  },
};

export const Tamanhos: Story = {
  name: 'Tooltip · tamanhos',
  render: () => (
    <div style={{ display: 'flex', gap: 48, padding: 64 }}>
      <Tooltip conteudo="Sigla da coluna" size="sm">
        <Button variant="text">sm</Button>
      </Tooltip>
      <Tooltip conteudo="Descrição padrão para a maioria dos casos" size="md">
        <Button variant="text">md</Button>
      </Tooltip>
      <Tooltip conteudo="Descrição técnica um pouco mais longa, ainda dentro de duas linhas" size="lg">
        <Button variant="text">lg</Button>
      </Tooltip>
    </div>
  ),
};

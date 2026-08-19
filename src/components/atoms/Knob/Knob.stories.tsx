import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Knob } from './Knob';

const meta = {
  title: 'Átomos/Entrada/Knob',
  component: Knob,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Ajuste radial de valor. Origem: Figma CitieOne, página ❖ Knob (State: Idle | Disabled | Focus, Size: Default | Double, mais o texto do valor). O arco é decorativo; a semântica vive no `role="slider"`. Equivalente PrimeNG: `p-knob`.\n\n**Quando usar:** em painel, para um único indicador de faixa curta que o gestor ajusta de forma grosseira e visual, como a meta percentual de um acompanhamento.\n\n**Quando não usar:** para informar valor exato de processo (percentual de execução do contrato, quantidade de diárias, valor em reais). O controle só anda de `step` em `step` por seta ou arrasto e não aceita valor digitado nem colado, então registrar 37% custa dezenas de toques e o servidor acaba parando no número aproximado, o que corrompe o dado; use `Input`. Para exibição somente leitura: o knob recebe foco e tem `role="slider"`, prometendo que dá para mudar; quando é só acompanhamento, use `ProgressBar` ou `KpiWidget`. Em formulário denso ou coluna de tabela: cada knob ocupa 100px de altura no tamanho Default e 200px no Double, então três campos radiais empurram o botão de salvar para fora da primeira dobra. Para faixa larga, de 0 a 1000, os 270 graus do arco não distinguem valores vizinhos e a leitura depende do número no centro, o que anula a razão de ser do desenho; nesse caso use `Slider` com rótulo ou `Input`. Vários knobs lado a lado também não funcionam: cada um mostra só o próprio valor, sem escala visível, e a comparação entre eles fica no chute.',
      },
    },
  },
  args: { label: 'Percentual de execução' },
} satisfies Meta<typeof Knob>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Size · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('slider', { name: 'Percentual de execução' });

    await expect(controle).toHaveAttribute('aria-valuenow', '60');
    await expect(controle).toHaveAttribute('aria-valuemin', '0');
    await expect(controle).toHaveAttribute('aria-valuemax', '100');
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação por teclado',
  parameters: {
    docs: {
      description: {
        story: 'Setas ajustam pelo step, Page Up e Page Down andam de dez em dez, Home e End vão às pontas.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('slider');

    controle.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(controle).toHaveAttribute('aria-valuenow', '61');

    await userEvent.keyboard('{PageUp}');
    await expect(controle).toHaveAttribute('aria-valuenow', '71');

    await userEvent.keyboard('{Home}');
    await expect(controle).toHaveAttribute('aria-valuenow', '0');

    await userEvent.keyboard('{End}');
    await expect(controle).toHaveAttribute('aria-valuenow', '100');
  },
};

export const Double: Story = {
  name: 'Size · double',
  args: { size: 'double', defaultValue: 78 },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, defaultValue: 40 },
  play: async ({ canvasElement }) => {
    const controle = within(canvasElement).getByRole('slider');
    await expect(controle).toHaveAttribute('aria-disabled', 'true');
    // Fora da ordem de tabulação quando desabilitado.
    await expect(controle).toHaveAttribute('tabindex', '-1');
  },
};

export const Formatado: Story = {
  name: 'Conteúdo · valor formatado',
  args: {
    label: 'Meta da competência',
    defaultValue: 64,
    formatar: (valor: number) => `${valor}%`,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('slider')).toHaveAttribute(
      'aria-valuetext',
      '64%',
    );
  },
};

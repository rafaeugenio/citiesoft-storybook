import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiArchiveLine, RiDeleteBin6Line, RiDownload2Line, RiSendPlaneLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { SelectionBar } from '@/components/application/selection-bar/selection-bar';
import type { SelectionBarAction } from '@/components/application/selection-bar/selection-bar';

const ACOES: SelectionBarAction[] = [
  { id: 'exportar', label: 'Exportar', icon: RiDownload2Line, onPress: () => {} },
  { id: 'encaminhar', label: 'Encaminhar', icon: RiSendPlaneLine, onPress: () => {} },
  { id: 'cancelar', label: 'Cancelar', icon: RiDeleteBin6Line, tone: 'danger', onPress: () => {} },
];

const ITENS = [
  'TFD-2026-004812',
  'TFD-2026-004819',
  'TFD-2026-004826',
  'TFD-2026-004833',
  'TFD-2026-004840',
  'TFD-2026-004847',
];

const meta = {
  title: 'Blocos/SelectionBar',
  component: SelectionBar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { count: 3, actions: ACOES, onClear: () => {}, position: 'viewport' },
  argTypes: {
    position: { control: 'inline-radio', options: ['viewport', 'container'] },
    count: { control: { type: 'number', min: 0, max: 50 } },
  },
} satisfies Meta<typeof SelectionBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: function Render(args) {
    const [count, setCount] = useState(args.count);
    return (
      <div className="flex min-h-[320px] flex-col items-start gap-3 bg-background-full p-4">
        <p className="text-body-medium text-text-secondary">A barra fica fixa na parte de baixo da janela.</p>
        <div className="flex items-center gap-2">
          <Button size="small" variant="secondary" onClick={() => setCount((n) => n + 1)}>
            Selecionar mais um
          </Button>
          <Button size="small" variant="secondary" onClick={() => setCount(0)}>
            Limpar
          </Button>
        </div>
        <SelectionBar {...args} count={count} onClear={() => setCount(0)} />
      </div>
    );
  },
};

export const UmSelecionado: Story = { args: { count: 1 } };

export const SoAcoesNeutras: Story = {
  args: { actions: [ACOES[0], { id: 'arquivar', label: 'Arquivar', icon: RiArchiveLine, onPress: () => {} }] },
};

export const AcaoDestrutiva: Story = {
  args: { actions: [ACOES[2]], count: 12 },
};

export const AcaoDesabilitada: Story = {
  args: { actions: [{ ...ACOES[1], isDisabled: true }, ACOES[2]] },
};

export const NoConteiner: Story = {
  args: { position: 'container' },
  render: function Render(args) {
    const [selecionados, setSelecionados] = useState<Set<string>>(new Set(ITENS.slice(0, 2)));
    const alternar = (item: string, ligado: boolean) =>
      setSelecionados((atual) => {
        const proximo = new Set(atual);
        if (ligado) proximo.add(item);
        else proximo.delete(item);
        return proximo;
      });
    return (
      <div
        tabIndex={0}
        role="region"
        aria-label="Lista rolável de solicitações"
        className="mx-auto h-[320px] max-w-[640px] overflow-y-auto rounded-3xl border border-border-button-default bg-background-primary-default p-3"
      >
        <ul className="flex flex-col gap-3 pb-24">
          {[...ITENS, ...ITENS].map((item, index) => {
            const chave = `${item}-${index}`;
            return (
              <li key={chave} className="border-b border-separator-border pb-3">
                <Checkbox
                  isSelected={selecionados.has(chave)}
                  onChange={(ligado) => alternar(chave, ligado)}
                >
                  {item}
                </Checkbox>
              </li>
            );
          })}
        </ul>
        <SelectionBar
          {...args}
          count={selecionados.size}
          onClear={() => setSelecionados(new Set())}
        />
      </div>
    );
  },
};

export const Mobile: Story = {
  args: { count: 8, position: 'container' },
  decorators: [
    (Story) => (
      <div className="h-[360px] w-[390px] overflow-y-auto">
        <div className="h-[420px] p-3 text-body-medium text-text-secondary">
          Conteúdo da página. A barra acompanha o fim da área visível.
          <Story />
        </div>
      </div>
    ),
  ],
};

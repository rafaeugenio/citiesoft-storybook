import type { Meta, StoryObj } from '@storybook/react-vite';
import { Carousel, CarouselItem } from '@/components/base/carousel/carousel';

const cores = ['bg-background-secondary-default', 'bg-background-tertiary-default', 'bg-background-secondary-hover', 'bg-background-tertiary-hover'];

const Cartoes = ({ total = 5, className }: { total?: number; className?: string }) => (
  <>
    {Array.from({ length: total }, (_, i) => (
      <CarouselItem key={i} className={className}>
        <div className={`flex h-40 items-center justify-center rounded-2xl text-title-2-medium text-text-primary ${cores[i % cores.length]}`}>
          Cartão {i + 1}
        </div>
      </CarouselItem>
    ))}
  </>
);

const meta = {
  title: 'Base/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: { 'aria-label': 'Galeria de cartões', children: null },
  argTypes: {
    align: { control: 'inline-radio', options: ['start', 'center'] },
    showArrows: { control: 'boolean' },
    showDots: { control: 'boolean' },
    gap: { control: { type: 'number', min: 0, max: 48 } },
  },
  decorators: [(Story) => <div className="w-[480px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Carousel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: (args) => (
    <Carousel {...args}>
      <Cartoes />
    </Carousel>
  ),
};

export const ComVisualizacaoParcial: Story = {
  render: (args) => (
    <Carousel {...args}>
      <Cartoes className="w-[70%]" />
    </Carousel>
  ),
};

export const Centralizado: Story = {
  render: (args) => (
    <Carousel {...args} align="center">
      <Cartoes className="w-[70%]" />
    </Carousel>
  ),
};

export const SemControles: Story = {
  render: (args) => (
    <div className="flex flex-col gap-8">
      <Carousel {...args} showArrows={false}>
        <Cartoes />
      </Carousel>
      <Carousel {...args} showDots={false}>
        <Cartoes />
      </Carousel>
    </div>
  ),
};

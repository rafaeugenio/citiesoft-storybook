import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { AgentChat } from '@/components/application/agent-chat/agent-chat';

/**
 * Modo demo, sem rede e sem chave: o AgentChat consulta GET /api/chat ao montar. Aqui a
 * consulta é interceptada e responde "sem chave", o que ativa o transporte de respostas
 * enlatadas (DemoTransport). Nenhuma chamada sai do navegador.
 */
const modoDemo: Decorator = (Story) => {
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem('citiesoft:agent-chat-demo', 'on');
      window.localStorage.removeItem('citiesoft:agent-chat-threads');
    } catch {
      // Sem storage, o aviso de chave aparece.
    }
    const w = window as typeof window & { __chatStarterFetch?: boolean };
    if (!w.__chatStarterFetch) {
      w.__chatStarterFetch = true;
      const original = window.fetch.bind(window);
      window.fetch = (input, init) => {
        const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
        if (url.includes('/api/chat')) {
          return Promise.resolve(
            new Response(JSON.stringify({ configured: false }), {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }),
          );
        }
        return original(input, init);
      };
    }
  }
  return <Story />;
};

const meta = {
  title: 'Templates/Chat Starter',
  component: AgentChat,
  tags: ['autodocs'],
  // a11y em 'todo': páginas completas do Citiesoft com achados (nav sem rótulo, aria-hidden com foco, contraste); tratar na fase de tema da marca.
  parameters: { a11y: { test: 'todo' }, layout: 'fullscreen' },
  decorators: [modoDemo],
} satisfies Meta<typeof AgentChat>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop, com respostas de demonstração. */
export const Padrao: Story = {};

/** Contêiner de altura fixa. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div
        className="relative h-[720px] overflow-hidden"
        style={{ ['--template-preview-height' as string]: '720px' }}
      >
        <Story />
      </div>
    ),
  ],
};

/** Viewport de celular. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

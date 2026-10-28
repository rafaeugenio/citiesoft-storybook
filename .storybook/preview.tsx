import { useState } from 'react';
import { UNSAFE_PortalProvider } from 'react-aria';
import type { Preview } from '@storybook/react-vite';
import '../styles/globals.css';

const preview: Preview = {
  parameters: {
    options: {
      // Camadas do Citiesoft, de baixo para cima (Charts são cards de gráfico montados sobre os Blocos). A lista precisa ficar literal aqui
      // dentro: o Storybook lê este valor por análise estática do arquivo.
      storySort: {
        method: 'alphabetical',
        order: [
          'Marca',
          [
            'Estratégia', 'Manifesto e mensagens', 'Voz e tom', 'Logo', 'Uso do logo', 'Cores da marca',
            'Tipografia da marca', 'Sistema gráfico', 'Ícones, ilustração e fotografia', 'Mascote Citiezinho',
            'Layout e composição', 'Hierarquia e densidade', 'Layouts institucionais', 'Marca no digital',
            'Motion da marca', 'Governança',
          ],
          'Fundação',
          [
            'Introdução', 'Tokens e instalação', 'Cores', 'Tipografia', 'Espaçamento', 'Raios',
            'Sombras', 'Layout e grid', 'Movimento', 'Ícones', 'Biblioteca de ícones', 'Modo escuro', 'Acessibilidade',
          ],
          'Guias',
          [
            'Princípios', 'Conteúdo e UX writing', 'Imagens e ilustração', 'Densidade e layout',
            'Heurísticas e UX', 'Arquitetura da informação', 'Design QA e critérios de aceite', 'Anti-padrões',
            'Marca no produto', 'Movimento de produto', 'Implementação Angular', 'Padrões', 'MCP do Design System',
          ],
          'Base',
          'Blocos',
          'Charts',
          'Templates',
        ],
        locales: 'pt-BR',
      },
    },
    controls: {
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: {
      // Em B2G isso é gate legal (e-MAG / WCAG 2.2 AA).
      test: 'error',
    },
    backgrounds: { disable: true },
    layout: 'centered',
  },

  initialGlobals: {
    theme: import.meta.env.VITE_CITIE_TEMA_PADRAO === 'dark' ? 'dark' : 'light',
  },

  globalTypes: {
    theme: {
      description: 'Tema',
      toolbar: {
        title: 'Tema',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Claro' },
          { value: 'dark', title: 'Escuro' },
        ],
        dynamicTitle: true,
      },
    },
  },

  decorators: [
    (Story, context) => {
      const dark = context.globals.theme === 'dark';
      // O escopo do tema fica em cada história. Assim testes paralelos não
      // alternam os tokens de outra história no meio da auditoria.
      // Drawers, diálogos e menus nascem em portais. O contêiner deles é um irmão da
      // história, dentro do wrapper de tema: herdam a classe de tema e o React Aria
      // consegue ocultar a página de fundo enquanto o overlay está aberto.
      const [portal, setPortal] = useState<HTMLDivElement | null>(null);
      return (
        <div
          className={`${dark ? 'dark' : 'light'} bg-background-primary-default text-text-primary ${context.parameters.layout === 'fullscreen' ? '' : 'p-6'}`}
        >
          {portal ? (
            <UNSAFE_PortalProvider getContainer={() => portal}>
              <div className="contents">
                <Story />
              </div>
            </UNSAFE_PortalProvider>
          ) : null}
          <div ref={setPortal} className="contents" />
        </div>
      );
    },
  ],
};

export default preview;

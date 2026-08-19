import type { Preview } from '@storybook/react-vite';
import '../src/tokens/tokens.css';

const preview: Preview = {
  parameters: {
    options: {
      /**
       * Ordem do catálogo em Atomic Design, de baixo para cima: uma Fundação
       * alimenta um Átomo, que compõe uma Molécula, que compõe um Organismo,
       * que preenche um Template, que vira uma Página com dado real.
       *
       * O Storybook lê este valor por análise estática do arquivo, então a
       * lista precisa estar literal aqui dentro: uma constante declarada fora
       * quebra a geração do índice.
       */
      storySort: {
        method: 'alphabetical',
        order: [
          'Visão geral',
          'Fundações',
          'Átomos',
          'Moléculas',
          'Organismos',
          'Templates',
          'Páginas',
        ],
        locales: 'pt-BR',
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      // 'error' faz o CI quebrar em violação de acessibilidade.
      // Em B2G isso é gate legal (e-MAG / WCAG 2.2 AA), então fica ligado desde o dia 1.
      test: 'error',
    },
    backgrounds: { disable: true },
  },

  initialGlobals: {
    theme: 'light',
  },

  globalTypes: {
    theme: {
      description: 'Tema Citiesoft',
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
      const theme = context.globals.theme === 'dark' ? 'dark' : 'light';
      return (
        <div
          data-theme={theme}
          style={{
            background: 'var(--citie-background-default)',
            color: 'var(--citie-text-base)',
            fontFamily: 'var(--citie-font-ui)',
            padding: 'var(--citie-spacing-5)',
            minHeight: '100%',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;

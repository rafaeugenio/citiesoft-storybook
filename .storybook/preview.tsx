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
          // A ordem aninhada põe a Introdução na frente das páginas de token,
          // que seguem em ordem alfabética pelo curinga. Sem isto, a porta de
          // entrada cairia entre Espaçamento e Marca.
          'Fundações',
          ['Introdução', '*'],
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

  /**
   * Gate de acessibilidade do tema escuro.
   *
   * O axe só varre o tema com que a story de fato renderiza. Sem isto, o
   * padrão fixo 'light' fazia 675 das 676 stories nunca exercitarem os 30
   * tokens do bloco `[data-theme='dark']` de tokens.css: qualquer regressão
   * de contraste exclusiva do escuro passava o gate sem ser vista (achado
   * MAIOR do laudo de acessibilidade e-MAG / WCAG 2.2 AA).
   *
   * `VITE_CITIE_TEMA_PADRAO` troca o tema padrão de TODAS as stories de uma
   * vez, no nível de configuração, sem editar nenhum arquivo de story: é a
   * mesma suíte de 676 testes rodando por cima do outro tema. A story que já
   * fixa `globals.theme` (AppShell.stories.tsx:328) continua fixa no escuro
   * independente desta variável, porque `globals` de story tem prioridade
   * sobre `initialGlobals`.
   *
   * O que falta para o gate morder de verdade: um segundo script no
   * `package.json` (`"test-storybook:dark": "VITE_CITIE_TEMA_PADRAO=dark
   * vitest --project=storybook --run"`) e uma etapa a mais no CI que rode os
   * dois. Fora do escopo deste arquivo; ver laudo de acessibilidade.
   */
  initialGlobals: {
    theme: import.meta.env.VITE_CITIE_TEMA_PADRAO === 'dark' ? 'dark' : 'light',
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

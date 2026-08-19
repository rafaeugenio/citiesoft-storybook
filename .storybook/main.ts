import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    // Páginas escritas à mão (Visão geral, Fundações, guias de composição).
    '../.storybook/docs/**/*.mdx',
    // Templates e páginas de demonstração: vivem fora de `src` porque não fazem
    // parte da biblioteca distribuída, seguindo a recomendação do Brad Frost.
    '../.storybook/templates/**/*.stories.@(ts|tsx)',
    '../.storybook/pages/**/*.stories.@(ts|tsx)',
    // Átomos, moléculas e organismos: a story mora junto do componente.
    '../src/**/*.mdx',
    '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-mcp',
  ],
  framework: '@storybook/react-vite',
};

export default config;

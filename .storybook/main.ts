import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  // O glob de .mdx só entra quando existir página de documentação escrita à mão.
  stories: ['../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
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

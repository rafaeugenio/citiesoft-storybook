import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: [
    // Mesma ordem de camadas da documentação do Citiesoft: Fundação, Base, Blocos, Templates.
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
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

import type { Decorator } from '@storybook/react-vite';

/** Contêiner de altura fixa, como numa pré-visualização embutida. */
export const decoradorContido: Decorator = (Story) => (
  <div
    className="relative h-[720px] overflow-hidden"
    style={{ ['--template-preview-height' as string]: '720px' }}
  >
    <Story />
  </div>
);

/** Viewport de celular usado nas stories `Mobile`. */
export const globaisMobile = { viewport: { value: 'mobile2', isRotated: false } };

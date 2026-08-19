import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming/create';

/**
 * Tema da interface do Storybook (a moldura: barra superior, barra lateral,
 * painel de addons). Nada aqui afeta o que é renderizado dentro da story, que
 * continua governado por `preview.tsx` e pelos tokens de `src/tokens/tokens.css`.
 *
 * Os valores abaixo são os mesmos hexadecimais dos tokens da marca. Eles
 * aparecem duplicados aqui por limitação real da ferramenta: o manager do
 * Storybook roda num documento separado do preview, sem acesso às variáveis CSS
 * do produto, e a API de tema exige valor literal em tempo de configuração. É a
 * única duplicação de cor aceita neste repositório, e ela está anotada para não
 * ser tomada como precedente.
 */

/**
 * A marca tem duas versões horizontais, e a escolha não é estética:
 * `LogoHorizontal3` é a versão para fundo branco e `LogoHorizontal2` é a versão
 * para fundo azul ou escuro. Usar a errada deixa a assinatura ilegível, defeito
 * que já apareceu neste projeto no shell de aplicação em tema escuro.
 */
const LOGO_PARA_FUNDO_CLARO = './marca/LogoHorizontal3.svg';
const LOGO_PARA_FUNDO_ESCURO = './marca/LogoHorizontal2.svg';

const preferenciaEscura =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches;

const comum = {
  brandTitle: 'Design System Citiesoft',
  brandUrl: 'https://citiesoft-storybook.vercel.app',
  brandTarget: '_self' as const,

  fontBase: "'Inter', 'Segoe UI', Arial, sans-serif",
  fontCode: "ui-monospace, 'SF Mono', Menlo, Consolas, monospace",

  colorPrimary: '#1261e4',
  colorSecondary: '#1261e4',

  inputBorderRadius: 6,
  appBorderRadius: 8,
};

const claro = create({
  ...comum,
  base: 'light',
  brandImage: LOGO_PARA_FUNDO_CLARO,

  appBg: '#fafafa',
  appContentBg: '#ffffff',
  appPreviewBg: '#ffffff',
  appBorderColor: '#e8eaed',

  textColor: '#202020',
  textInverseColor: '#ffffff',
  textMutedColor: '#6b7177',

  barTextColor: '#6b7177',
  barSelectedColor: '#1261e4',
  barHoverColor: '#0e4db8',
  barBg: '#ffffff',

  inputBg: '#ffffff',
  inputBorder: '#8f8f8f',
  inputTextColor: '#202020',
});

const escuro = create({
  ...comum,
  base: 'dark',
  brandImage: LOGO_PARA_FUNDO_ESCURO,

  colorPrimary: '#4d8bfc',
  colorSecondary: '#4d8bfc',

  appBg: '#141414',
  appContentBg: '#1a1a1d',
  appPreviewBg: '#1a1a1d',
  appBorderColor: '#34343a',

  textColor: '#f5f5f6',
  textInverseColor: '#202020',
  textMutedColor: '#9a9da3',

  barTextColor: '#9a9da3',
  barSelectedColor: '#4d8bfc',
  barHoverColor: '#84aefd',
  barBg: '#1a1a1d',

  inputBg: '#1a1a1d',
  inputBorder: '#6b6b6b',
  inputTextColor: '#f5f5f6',
});

addons.setConfig({
  theme: preferenciaEscura ? escuro : claro,
  sidebar: {
    /* O catálogo tem sete grupos atômicos: mostrar os rótulos deles ajuda a orientação. */
    showRoots: true,
  },
});

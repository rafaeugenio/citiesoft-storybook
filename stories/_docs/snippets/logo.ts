import type { Abas } from '../Layout';

export const logoUso: Abas = {
  HTML: { codigo: `<!-- Fundo claro: LogoHorizontal3. Fundo escuro ou azul: LogoHorizontal2. -->
<picture>
  <source srcset="/marca/LogoHorizontal2.svg" media="(prefers-color-scheme: dark)" />
  <img src="/marca/LogoHorizontal3.svg" alt="Citiesoft" width="160" />
</picture>

<!-- Sobre uma faixa azul fixa, use sempre a versão negativa. -->
<header style="background: #1261E4">
  <img src="/marca/LogoHorizontal2.svg" alt="Citiesoft" width="160" />
</header>` },
  Angular: { codigo: `import { Component, input } from '@angular/core';

@Component({
  selector: 'app-logo',
  standalone: true,
  template: \`
    <img
      [src]="tema() === 'escuro' ? '/marca/LogoHorizontal2.svg' : '/marca/LogoHorizontal3.svg'"
      alt="Citiesoft"
      [attr.width]="largura()"
    />
  \`,
})
export class LogoComponent {
  tema = input<'claro' | 'escuro'>('claro');
  largura = input(160); // mínimo digital: 120
}` },
  React: { codigo: `type LogoProps = { tema?: 'claro' | 'escuro'; largura?: number };

const ARQUIVO = {
  claro: '/marca/LogoHorizontal3.svg',
  escuro: '/marca/LogoHorizontal2.svg',
} as const;

export function Logo({ tema = 'claro', largura = 160 }: LogoProps) {
  // largura mínima no digital: 120. Abaixo disso, troque pelo símbolo isolado.
  return <img src={ARQUIVO[tema]} alt="Citiesoft" width={largura} />;
}` },
  'Símbolo (favicon e app)': { codigo: `<!-- Favicon: .ico com 16, 32 e 48 px, mais PNG 32x32 e 64x64.
     O símbolo (LogoBranca.svg) fica centralizado sobre Citie Blue, com margem interna de pelo menos 12%. -->
<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png" />
<link rel="icon" type="image/png" sizes="64x64" href="/favicon-64.png" />

<!-- Ícone de app: PNG quadrado, sem cantos arredondados (o sistema aplica o recorte). -->` },
};

import type { Abas } from '../Layout';

export const iconesInstalacao: Abas = {
  'HTML/CSS': { codigo: `<!-- Webfont do Remix Icon -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/remixicon@4.6.0/fonts/remixicon.css">

<i class="ri-search-line" aria-hidden="true"></i>` },
  'SCSS': { codigo: `// npm i remixicon
@use 'remixicon/fonts/remixicon.css';

.icone { font-size: 20px; line-height: 1; color: currentColor; }` },
  'Tailwind': { codigo: `# npm i @remixicon/react
# O pacote entrega SVG como componente; as classes de tamanho e cor vão no className.` },
  'Angular': { codigo: `# npm i remixicon
// angular.json
"styles": ["node_modules/remixicon/fonts/remixicon.css", "src/styles.scss"]

<!-- template -->
<i class="ri-search-line" aria-hidden="true"></i>

<!-- PrimeNG: use a classe no input icon -->
<p-button label="Buscar" icon="ri-search-line" />` },
  'React': { codigo: `// npm i @remixicon/react
import { RiSearchLine } from '@remixicon/react';

<RiSearchLine className="size-5" aria-hidden="true" />` },
};

export const iconesTamanhoCor: Abas = {
  'HTML/CSS': { codigo: `.icone { width: 20px; height: 20px; fill: currentColor; flex-shrink: 0; }

.botao { color: var(--color-text-primary); }
.botao--secundario { color: var(--color-text-secondary); }

<!-- SVG inline herda a cor do texto -->
<svg class="icone" viewBox="0 0 24 24" aria-hidden="true">...</svg>` },
  'SCSS': { codigo: `$tamanhos: (xs: 14px, sm: 16px, md: 18px, lg: 20px, xl: 24px);

@each $nome, $px in $tamanhos {
  .icone--#{$nome} { width: $px; height: $px; }
}
.icone { fill: currentColor; flex-shrink: 0; }` },
  'Tailwind': { codigo: `<button class="flex items-center gap-2 text-text-secondary hover:text-text-primary">
  <RiSearchLine class="size-5 shrink-0" />
  Buscar
</button>` },
  'Angular': { codigo: `/* componente.scss */
i[class^='ri-'] { font-size: 20px; line-height: 1; color: currentColor; }

<!-- tamanhos usados no sistema: 14, 16, 18, 20 e 24 -->` },
  'React': { codigo: `import { RiSearchLine } from '@remixicon/react';

export const Buscar = () => (
  <button className="flex items-center gap-2 text-text-secondary hover:text-text-primary">
    <RiSearchLine className="size-5 shrink-0" aria-hidden="true" />
    Buscar
  </button>
);` },
};

export const iconesAcessivel: Abas = {
  'HTML/CSS': { codigo: `<!-- Decorativo: escondido do leitor de tela -->
<button><i class="ri-add-line" aria-hidden="true"></i> Novo pedido</button>

<!-- Ícone sozinho: o botão precisa de nome -->
<button type="button" aria-label="Fechar"><i class="ri-close-line" aria-hidden="true"></i></button>` },
  'SCSS': { codigo: `// O nome acessível vem do HTML, nunca do estilo.
.botao-icone {
  display: inline-grid;
  place-items: center;
  width: 36px;
  height: 36px;
}` },
  'Tailwind': { codigo: `<button type="button" aria-label="Fechar" class="grid size-9 place-items-center rounded-lg focus-visible:ring-2 focus-visible:ring-border-focus-ring">
  <i class="ri-close-line" aria-hidden="true"></i>
</button>` },
  'Angular': { codigo: `<button type="button" [attr.aria-label]="'Fechar'" (click)="fechar()">
  <i class="ri-close-line" aria-hidden="true"></i>
</button>

<!-- PrimeNG: p-button com icon e ariaLabel -->
<p-button icon="ri-close-line" [rounded]="true" [text]="true" ariaLabel="Fechar" />` },
  'React': { codigo: `import { RiCloseLine } from '@remixicon/react';

export const Fechar = ({ onClick }: { onClick: () => void }) => (
  <button type="button" aria-label="Fechar" onClick={onClick}>
    <RiCloseLine className="size-5" aria-hidden="true" />
  </button>
);` },
};

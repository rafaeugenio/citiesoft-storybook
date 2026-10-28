import type { Abas } from '../Layout';

export const logoPorFundo: Abas = {
  'Angular (PrimeNG)': { codigo: `<!-- Cabeçalho claro -->
<img src="assets/logo/LogoHorizontal3.svg" alt="Citiesoft" height="32" />

<!-- Cabeçalho escuro (classe de tema ativa) -->
<img src="assets/logo/LogoHorizontal2.svg" alt="Citiesoft" height="32" />`, linguagem: 'html' },
  'HTML/CSS': { codigo: `<picture>
  <img class="logo logo--claro" src="LogoHorizontal3.svg" alt="Citiesoft" height="32">
  <img class="logo logo--escuro" src="LogoHorizontal2.svg" alt="" height="32" aria-hidden="true">
</picture>

.logo--escuro { display: none; }
.dark .logo--claro { display: none; }
.dark .logo--escuro { display: inline; }`, linguagem: 'html' },
  'React': { codigo: `export const Logo = ({ escuro }: { escuro: boolean }) => (
  <img
    src={escuro ? 'LogoHorizontal2.svg' : 'LogoHorizontal3.svg'}
    alt="Citiesoft"
    height={32}
  />
);`, linguagem: 'tsx' },
};

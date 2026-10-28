import type { Abas } from '../Layout';

export const navegacaoAcessivel: Abas = {
  'Angular (PrimeNG)': { codigo: `<a class="skip-link" href="#conteudo">Ir para o conteúdo principal</a>

<nav aria-label="Localização atual">
  <p-breadcrumb [model]="caminho" [home]="inicio" />
</nav>

<main id="conteudo" tabindex="-1">
  <router-outlet />
</main>

// app.component.ts: anuncia o título a cada rota
this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
  this.anuncio.set(this.title.getTitle());
});
// template: <div aria-live="polite" class="sr-only">{{ anuncio() }}</div>`, linguagem: 'html' },
  'HTML/CSS': { codigo: `<a class="skip-link" href="#conteudo">Ir para o conteúdo principal</a>
<header role="banner">...</header>
<nav aria-label="Menu principal">...</nav>
<nav aria-label="Localização atual">
  <ol>
    <li><a href="/pessoas">Pessoas</a></li>
    <li aria-current="page">Servidores</li>
  </ol>
</nav>
<main id="conteudo">...</main>

.skip-link { position: absolute; inset-inline-start: -9999px; }
.skip-link:focus { inset-inline-start: 8px; top: 8px; }`, linguagem: 'html' },
  'React': { codigo: `export function Migalhas({ itens }: { itens: { rotulo: string; href?: string }[] }) {
  return (
    <nav aria-label="Localização atual">
      <ol className="flex gap-2">
        {itens.map((i, n) => (
          <li key={i.rotulo} aria-current={n === itens.length - 1 ? 'page' : undefined}>
            {i.href && n < itens.length - 1 ? <a href={i.href}>{i.rotulo}</a> : i.rotulo}
          </li>
        ))}
      </ol>
    </nav>
  );
}`, linguagem: 'tsx' },
};

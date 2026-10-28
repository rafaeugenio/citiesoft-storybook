import type { Abas } from '../Layout';

export const fontesDaMarca: Abas = {
  'HTML': { linguagem: 'html', codigo: `<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Red+Hat+Display:wght@600;700;800;900&family=Red+Hat+Mono:wght@400;500&display=swap">` },
  'CSS': { linguagem: 'css', codigo: `:root {
  --font-titulo: 'Red Hat Display', Inter, system-ui, sans-serif;
  --font-corpo:  Inter, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono:   'Red Hat Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}

h1, h2, h3 { font-family: var(--font-titulo); font-weight: 700; letter-spacing: -0.01em; }
body       { font-family: var(--font-corpo); font-size: 1rem; line-height: 1.6; }
code, kbd  { font-family: var(--font-mono); font-size: 0.875rem; }

/* Números em colunas */
td.numero  { font-family: var(--font-mono); font-variant-numeric: tabular-nums; text-align: end; }` },
};

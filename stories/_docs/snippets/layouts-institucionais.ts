import type { Abas } from '../Layout';

export const blocosDocumentoCodigo: Abas = {
  'CSS': { linguagem: 'css', codigo: `/* Tabela de peça institucional (deck e documento) */
.tabela-institucional th { background: #146BFA; color: #FAFAFA; font: 600 13px Inter; }
.tabela-institucional tr:nth-child(odd)  td { background: #FAFAFA; }
.tabela-institucional tr:nth-child(even) td { background: #EFF5FF; }
.tabela-institucional td, .tabela-institucional th { border: 1px solid #DBE8FF; }

/* Callouts de documento: borda esquerda de 4px */
.callout          { border-left: 4px solid #146BFA; background: #EFF5FF; padding: 16px; }
.callout--alerta  { border-left-color: #D97706; background: #FFFBEB; }
.callout--perigo  { border-left-color: #DC2626; background: #FEF2F2; }
.callout--sucesso { border-left-color: #16A34A; background: #F0FDF4; }

/* Card de peça institucional */
.card-peca { background: #FAFAFA; border: 1px solid #B3CEFE; border-radius: 8px; padding: 24px; }` },
  'Tailwind': { linguagem: 'html', codigo: `<!-- Citie Blue 50 = #EFF5FF, 200 = #B3CEFE, 600 = #1261E4 -->
<div class="rounded-lg border border-blue-200 bg-blue-50 p-8">
  <h3 class="font-inter text-base font-semibold text-[#202020]">Título do card</h3>
  <p class="font-inter text-sm text-[#3C3C3C]">Descrição curta.</p>
</div>
<a class="rounded-lg bg-blue-600 px-5 py-2.5 font-inter font-semibold text-white">Solicitar demonstração</a>` },
};

import type { Abas } from '../Layout';

export const iconesCodigo: Abas = {
  'React': { linguagem: 'tsx', codigo: `import { DownloadSimple, CheckCircle, Trash } from '@phosphor-icons/react';

// Ação: rótulo visível, ícone reforça
<button className="btn-primary">
  <DownloadSimple size={20} weight="bold" aria-hidden="true" />
  <span>Exportar relatório</span>
</button>

// Status semântico: peso fill, cor e texto juntos
<span className="status status--aprovada">
  <CheckCircle size={16} weight="fill" color="#16A34A" aria-hidden="true" />
  Aprovada
</span>

// Ícone sem texto: aria-label e tooltip obrigatórios
<button aria-label="Excluir registro" title="Excluir registro">
  <Trash size={20} />
</button>` },
  'Figma': { linguagem: 'text', codigo: `Plugin oficial do Phosphor Icons
Pesos: thin, light, regular, bold, fill, duotone
Tamanhos em múltiplos de 4: 16, 20, 24, 32, 40, 48
Cores só por token: color-text-base, color-interactive, color-success, color-warning, color-danger` },
};

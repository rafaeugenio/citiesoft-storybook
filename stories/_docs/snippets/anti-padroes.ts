import type { Abas } from '../Layout';

export const semGradienteNoProduto: Abas = {
  'Angular (PrimeNG)': { codigo: `/* Errado: gradiente padrão do Tailwind em botão de produto */
.cta { background: linear-gradient(135deg, #3b82f6, #9333ea); }

/* Certo: botão do preset, cor sólida do token */
<p-button label="Salvar lançamento" severity="primary" />`, linguagem: 'html' },
  'HTML/CSS': { codigo: `/* Errado */
.cta { background: linear-gradient(135deg, #3b82f6, #9333ea); }

/* Certo: cor sólida do token semântico */
.cta { background: var(--color-accent-500); }`, linguagem: 'css' },
  'React': { codigo: `// Errado
<button className="bg-gradient-to-r from-blue-500 to-purple-600">Salvar</button>

// Certo: token semântico
<button className="bg-accent-500">Salvar lançamento</button>`, linguagem: 'tsx' },
};

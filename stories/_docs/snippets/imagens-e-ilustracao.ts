import type { Abas } from '../Layout';

export const imagemEGrafico: Abas = {
  'HTML/CSS': { linguagem: 'html', codigo: `<!-- Ilustração decorativa: o texto já diz tudo -->
<img src="/assets/illustrations/financeiro/empty-state-default.svg"
     alt="" aria-hidden="true" width="240" height="240" />
<h3>Nenhum lançamento no período</h3>
<p>Selecione outro período ou registre um novo lançamento.</p>

<!-- Ilustração informativa: descreve conteúdo e ação, nunca o estilo -->
<img src="/assets/illustrations/shared/error-network.svg"
     alt="Falha de conexão com o servidor. Verifique a rede e tente novamente."
     width="240" height="240" />

<!-- Gráfico com legenda e dados em tabela -->
<figure role="group" aria-labelledby="iss-titulo">
  <figcaption id="iss-titulo">
    Arrecadação de ISS por mês em 2025. Crescimento acumulado de 12%.
  </figcaption>
  <canvas id="iss" aria-hidden="true"></canvas>
  <details>
    <summary>Ver dados em tabela</summary>
    <table>
      <caption>Arrecadação de ISS por mês em 2025 (R$)</caption>
      <thead><tr><th scope="col">Mês</th><th scope="col">Valor</th></tr></thead>
      <tbody><tr><td>Janeiro</td><td>R$ 1.234.567,00</td></tr></tbody>
    </table>
  </details>
</figure>

<style>
  .ilustracao { animation: entrada 320ms cubic-bezier(0.16, 1, 0.3, 1) both; }
  @keyframes entrada {
    from { opacity: 0; transform: translateY(12px) scale(0.96); }
    to { opacity: 1; transform: none; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ilustracao { animation: none; }
  }
</style>` },
  'Angular (PrimeNG)': { linguagem: 'ts', codigo: `// Paleta categórica oficial, na ordem definida
export const CORES_GRAFICO = [
  '#1261E4', '#00B5F0', '#22C55E', '#F59E0B',
  '#8B5CF6', '#EF4444', '#14B8A6', '#EC4899',
];

export const OPCOES_GRAFICO = {
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: { font: { family: 'Inter', size: 13 }, usePointStyle: true },
    },
  },
  scales: {
    x: { grid: { display: false }, border: { display: false } },
    y: { grid: { color: 'rgba(232, 234, 237, 0.8)' }, border: { display: false } },
  },
};

// No template:
// <p-chart type="bar" [data]="dados" [options]="opcoes"
//          aria-label="Arrecadação de ISS por mês em 2025." />` },
  'React': { linguagem: 'tsx', codigo: `type EmptyProps = {
  src: string;
  alt?: string; // vazio para decorativa
  titulo: string;
  subtitulo: string;
  compacto?: boolean;
};

export function EstadoVazio({ src, alt = '', titulo, subtitulo, compacto }: EmptyProps) {
  const lado = compacto ? 120 : 240;
  return (
    <div className="estado-vazio">
      <img
        src={src}
        alt={alt}
        aria-hidden={alt === '' ? true : undefined}
        width={lado}
        height={lado}
      />
      <h3>{titulo}</h3>
      <p>{subtitulo}</p>
    </div>
  );
}` },
};

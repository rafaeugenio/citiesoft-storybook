import { useId } from 'react';
import './Sparkline.css';

export interface SparklineProps {
  valores: number[];
  /** Nome acessível: o sparkline nunca fica sem descrição. */
  label: string;
  cor?: string;
}

/**
 * Linha de tendência indivisível: sem eixo, legenda, tooltip nem alternância
 * para tabela. Por isso é átomo, ao contrário dos gráficos com moldura, que são
 * organismos (`Organismos/Gráficos`).
 */
export function Sparkline({ valores, label, cor = 'var(--citie-chart-cat-1)' }: SparklineProps) {
  const id = useId();
  const maximo = Math.max(...valores, 1);
  const minimo = Math.min(...valores, 0);
  const amplitude = maximo - minimo || 1;

  const pontos = valores
    .map((valor, indice) => {
      const x = (100 / Math.max(1, valores.length - 1)) * indice;
      const y = 40 - ((valor - minimo) / amplitude) * 36;
      return `${indice === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg
      className="citie-sparkline"
      viewBox="0 0 100 44"
      preserveAspectRatio="none"
      role="img"
      aria-labelledby={id}
    >
      <title id={id}>{label}</title>
      <path d={pontos} fill="none" stroke={cor} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

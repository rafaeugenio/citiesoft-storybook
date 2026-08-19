import './Progress.css';

export type EstadoDoProgresso =
  | 'em-progresso'
  | 'concluido'
  | 'erro'
  | 'concluido-com-pendencias'
  | 'desabilitado';

export interface ProgressBarProps {
  /** Nome da operação, na mesma linha do valor percentual. */
  rotulo: string;
  /** Omitido no modo indeterminado, quando o sistema não conhece a duração. */
  valor?: number;
  /** Nomeia o artefato em processamento. Barra sem mensagem é inaceitável. */
  mensagem: string;
  estado?: EstadoDoProgresso;
  /** 4px em faixa de página, 8px em modal ou card, 12px em tela dedicada. */
  altura?: number;
  /** Fluxo multifase: etapa atual e total. */
  etapa?: { atual: number; total: number };
}

const CLASSE_DO_ESTADO: Record<EstadoDoProgresso, string> = {
  'em-progresso': 'citie-progress--info',
  concluido: 'citie-progress--success',
  erro: 'citie-progress--danger',
  'concluido-com-pendencias': 'citie-progress--warn',
  desabilitado: 'citie-progress--neutro',
};

export function ProgressBar({
  rotulo,
  valor,
  mensagem,
  estado = 'em-progresso',
  altura = 8,
  etapa,
}: ProgressBarProps) {
  const indeterminado = valor === undefined;

  return (
    <div className={`citie-progress ${CLASSE_DO_ESTADO[estado]}`}>
      <div className="citie-progress__cabecalho">
        <span className="citie-progress__rotulo">
          {rotulo}
          {etapa ? ` · etapa ${etapa.atual} de ${etapa.total}` : null}
        </span>
        {!indeterminado ? <span className="citie-progress__valor">{valor}%</span> : null}
      </div>

      <div
        className={`citie-progress__trilho${
          indeterminado ? ' citie-progress__trilho--indeterminado' : ''
        }`}
        style={{ height: `${altura}px` }}
        role="progressbar"
        aria-label={rotulo}
        // O valor atual é omitido no modo indeterminado.
        aria-valuenow={indeterminado ? undefined : valor}
        aria-valuemin={indeterminado ? undefined : 0}
        aria-valuemax={indeterminado ? undefined : 100}
        aria-valuetext={indeterminado ? undefined : mensagem}
      >
        <div
          className="citie-progress__preenchimento"
          style={{ width: indeterminado ? undefined : `${valor}%` }}
        />
      </div>

      {/* Anunciada sem interromper a leitura em andamento. */}
      <p className="citie-progress__mensagem" role="status" aria-live="polite">
        {mensagem}
      </p>
    </div>
  );
}

export interface SpinnerProps {
  /** Descreve a operação, nunca "Carregando" solto. */
  label: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Spinner({ label, size = 'md' }: SpinnerProps) {
  return (
    <span className={`citie-spinner citie-spinner--${size}`} role="status" aria-label={label} />
  );
}

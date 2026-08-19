import { useState, type ReactNode } from 'react';
import './Timeline.css';

export type EstadoDoEvento =
  | 'concluido'
  | 'atual'
  | 'pendente'
  | 'bloqueado'
  | 'cancelado'
  | 'futuro'
  | 'informacional';

/** O estado vai por texto no nome acessível, nunca só por cor. */
const ROTULO_DO_ESTADO: Record<EstadoDoEvento, string> = {
  concluido: 'Concluído',
  atual: 'Etapa atual',
  pendente: 'Pendente',
  bloqueado: 'Bloqueado',
  cancelado: 'Cancelado',
  futuro: 'Etapa futura',
  informacional: 'Informativo',
};

const SIMBOLO_DO_ESTADO: Record<EstadoDoEvento, string> = {
  concluido: '✓',
  atual: '',
  pendente: '⏱',
  bloqueado: '✕',
  cancelado: '–',
  futuro: '',
  informacional: 'i',
};

export interface EventoDaTimeline {
  id: string;
  /** Verbo no passado e voz ativa: "Solicitação recebida". */
  titulo: string;
  /** ISO 8601, consumido por leitores de tela e indexação. */
  data: string;
  /** Obrigatório em evento humano; ação automática usa "Sistema Citiesoft". */
  ator: string;
  estado: EstadoDoEvento;
  /** Corpo expansível, oculto por padrão. */
  detalhe?: ReactNode;
  /** Realce lateral: exclusão (crítico) ou ação automática (sistema). */
  realce?: 'critico' | 'sistema';
}

function formatarDataHora(iso: string) {
  const data = new Date(iso);
  const dd = String(data.getDate()).padStart(2, '0');
  const mm = String(data.getMonth() + 1).padStart(2, '0');
  const yyyy = data.getFullYear();
  const hh = String(data.getHours()).padStart(2, '0');
  const min = String(data.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} às ${hh}:${min}`;
}

export interface TimelineProps {
  /** Nome acessível: "Histórico do processo". */
  label: string;
  eventos: EventoDaTimeline[];
  compacta?: boolean;
}

export function Timeline({ label, eventos, compacta = false }: TimelineProps) {
  if (eventos.length === 0) {
    return <p className="citie-timeline__vazio">Nenhum evento registrado ainda</p>;
  }

  return (
    <ol className={`citie-timeline${compacta ? ' citie-timeline--compacta' : ''}`} aria-label={label}>
      {eventos.map((evento) => (
        <ItemDaTimeline key={evento.id} evento={evento} compacta={compacta} />
      ))}
    </ol>
  );
}

function ItemDaTimeline({ evento, compacta }: { evento: EventoDaTimeline; compacta: boolean }) {
  const [aberto, setAberto] = useState(false);
  const temDetalhe = Boolean(evento.detalhe) && !compacta;

  return (
    <li
      className={`citie-timeline__item${
        evento.realce ? ` citie-timeline__item--${evento.realce}` : ''
      }`}
    >
      <span
        className={`citie-timeline__marcador citie-timeline__marcador--${evento.estado}`}
        aria-hidden="true"
      >
        {SIMBOLO_DO_ESTADO[evento.estado]}
      </span>

      <div className="citie-timeline__conteudo">
        <time className="citie-timeline__data" dateTime={evento.data}>
          {formatarDataHora(evento.data)}
        </time>
        <p className="citie-timeline__titulo">
          {evento.titulo}
          <span className="citie-visualmente-oculto"> ({ROTULO_DO_ESTADO[evento.estado]})</span>
        </p>
        <p className="citie-timeline__ator">{evento.ator}</p>

        {temDetalhe ? (
          <>
            <button
              type="button"
              className="citie-timeline__alternar"
              aria-expanded={aberto}
              onClick={() => setAberto(!aberto)}
            >
              {aberto ? 'Ocultar detalhes' : 'Ver detalhes'}
            </button>
            {aberto ? <div className="citie-timeline__detalhe">{evento.detalhe}</div> : null}
          </>
        ) : null}
      </div>
    </li>
  );
}

export interface MudancaDeAuditoriaProps {
  /** Nome de UI do campo ("Salário base"), nunca a chave de banco. */
  campo: string;
  /** Texto humano legível ("R$ 3.200,00"), nunca o ID interno. */
  de: string | null;
  para: string | null;
}

/** Linha de diff do audit log: valor anterior riscado, valor novo em sucesso. */
export function MudancaDeAuditoria({ campo, de, para }: MudancaDeAuditoriaProps) {
  return (
    <p className="citie-audit__mudanca">
      <span className="citie-audit__campo">{campo}:</span>{' '}
      {de === null ? (
        <em className="citie-audit__ausente">vazio</em>
      ) : (
        <span className="citie-audit__anterior">{de}</span>
      )}{' '}
      <span aria-hidden="true">→</span>{' '}
      {para === null ? (
        <em className="citie-audit__ausente">removido</em>
      ) : (
        <span className="citie-audit__novo">{para}</span>
      )}
    </p>
  );
}

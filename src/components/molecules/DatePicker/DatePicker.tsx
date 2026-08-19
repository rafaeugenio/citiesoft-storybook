import { useEffect, useRef, useState } from 'react';
import { FieldWrapper, type FieldSize } from '../../primitives/Field/Field';
import '../../primitives/Field/Field.css';
import './DatePicker.css';

const DIAS_DA_SEMANA = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
const MESES = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export function formatarData(data: Date) {
  const dd = String(data.getDate()).padStart(2, '0');
  const mm = String(data.getMonth() + 1).padStart(2, '0');
  return `${dd}/${mm}/${data.getFullYear()}`;
}

/** Data por extenso para o leitor de tela: "15 de março de 2026". */
export function dataPorExtenso(data: Date) {
  return `${data.getDate()} de ${MESES[data.getMonth()]} de ${data.getFullYear()}`;
}

function mesmoDia(a: Date, b: Date) {
  return (
    a.getDate() === b.getDate() && a.getMonth() === b.getMonth() && a.getFullYear() === b.getFullYear()
  );
}

/** Grade de 6 semanas, incluindo os dias de preenchimento fora do mês corrente. */
export function gradeDoMes(referencia: Date): Date[] {
  const primeiro = new Date(referencia.getFullYear(), referencia.getMonth(), 1);
  const inicio = new Date(primeiro);
  inicio.setDate(1 - primeiro.getDay());

  return Array.from({ length: 42 }, (_, indice) => {
    const dia = new Date(inicio);
    dia.setDate(inicio.getDate() + indice);
    return dia;
  });
}

export interface DatePickerProps {
  label: string;
  size?: FieldSize;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  /** Data de referência do calendário, para a story ser determinística. */
  hoje?: Date;
  valorInicial?: Date;
  onChange?: (data: Date) => void;
}

export function DatePicker({
  label,
  size = 'normal',
  helper,
  error,
  required,
  disabled,
  hoje = new Date(),
  valorInicial,
  onChange,
}: DatePickerProps) {
  const [aberto, setAberto] = useState(false);
  const [selecionada, setSelecionada] = useState<Date | undefined>(valorInicial);
  const [focada, setFocada] = useState<Date>(valorInicial ?? hoje);
  const [mesVisivel, setMesVisivel] = useState<Date>(valorInicial ?? hoje);
  const painelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aberto) return;
    painelRef.current?.querySelector<HTMLButtonElement>('[data-focada="true"]')?.focus();
  }, [aberto, focada]);

  const mover = (dias: number) => {
    const destino = new Date(focada);
    destino.setDate(destino.getDate() + dias);
    setFocada(destino);
    setMesVisivel(destino);
  };

  const moverMes = (meses: number) => {
    const destino = new Date(focada);
    destino.setMonth(destino.getMonth() + meses);
    setFocada(destino);
    setMesVisivel(destino);
  };

  const selecionar = (dia: Date) => {
    setSelecionada(dia);
    setAberto(false);
    onChange?.(dia);
  };

  return (
    <FieldWrapper label={label} required={required} helper={helper} error={error}>
      {({ id, describedBy, invalid }) => (
        <div className="citie-datepicker">
          <div className="citie-field-wrapper citie-field-wrapper--has-affix">
            <input
              id={id}
              className={`citie-field-control citie-field-control--${size}`}
              placeholder="Ex.: 15/03/2026"
              value={selecionada ? formatarData(selecionada) : ''}
              readOnly
              disabled={disabled}
              aria-required={required || undefined}
              aria-invalid={invalid || undefined}
              aria-describedby={describedBy}
              onClick={() => !disabled && setAberto(!aberto)}
              onKeyDown={(evento) => {
                if (evento.key === 'Enter' || evento.key === ' ') {
                  evento.preventDefault();
                  setAberto(true);
                }
              }}
            />
            {/*
              O estado de abertura vive num botão de verdade, não no campo:
              `aria-expanded` só é válido em papéis que o suportam, e num input
              de texto simples o axe reprova.
            */}
            <button
              type="button"
              className="citie-field-wrapper__affix citie-datepicker__gatilho"
              aria-label={`Escolher ${label.toLowerCase()}`}
              aria-haspopup="dialog"
              aria-expanded={aberto}
              disabled={disabled}
              onClick={() => setAberto(!aberto)}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="2" />
                <path d="M3 10h18M8 3v4M16 3v4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {aberto ? (
            <div
              ref={painelRef}
              className="citie-calendario"
              role="dialog"
              aria-label={`Calendário de ${label.toLowerCase()}`}
              onKeyDown={(evento) => {
                const acoes: Record<string, () => void> = {
                  ArrowRight: () => mover(1),
                  ArrowLeft: () => mover(-1),
                  ArrowDown: () => mover(7),
                  ArrowUp: () => mover(-7),
                  PageDown: () => moverMes(1),
                  PageUp: () => moverMes(-1),
                  Escape: () => setAberto(false),
                };
                const acao = acoes[evento.key];
                if (acao) {
                  evento.preventDefault();
                  acao();
                }
              }}
            >
              <div className="citie-calendario__cabecalho">
                <button
                  type="button"
                  className="citie-calendario__navegar"
                  aria-label="Mês anterior"
                  onClick={() => moverMes(-1)}
                >
                  ‹
                </button>
                <span className="citie-calendario__mes">
                  {MESES[mesVisivel.getMonth()]} de {mesVisivel.getFullYear()}
                </span>
                <button
                  type="button"
                  className="citie-calendario__navegar"
                  aria-label="Próximo mês"
                  onClick={() => moverMes(1)}
                >
                  ›
                </button>
              </div>

              <table className="citie-calendario__grade" role="grid">
                <thead>
                  <tr>
                    {DIAS_DA_SEMANA.map((dia) => (
                      <th key={dia} scope="col" abbr={dia}>
                        {dia}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 6 }, (_, semana) => (
                    <tr key={semana}>
                      {gradeDoMes(mesVisivel)
                        .slice(semana * 7, semana * 7 + 7)
                        .map((dia) => {
                          // Dia fora do mês corrente não é clicável.
                          const foraDoMes = dia.getMonth() !== mesVisivel.getMonth();
                          const ehHoje = mesmoDia(dia, hoje);
                          const ehSelecionado = selecionada ? mesmoDia(dia, selecionada) : false;

                          return (
                            // `aria-selected` pertence à célula da grade, não ao
                            // botão: em `button` o atributo não é permitido.
                            <td key={dia.toISOString()} role="gridcell" aria-selected={ehSelecionado}>
                              <button
                                type="button"
                                data-focada={mesmoDia(dia, focada)}
                                className={[
                                  'citie-calendario__dia',
                                  foraDoMes ? 'citie-calendario__dia--fora' : null,
                                  ehHoje ? 'citie-calendario__dia--hoje' : null,
                                  ehSelecionado ? 'citie-calendario__dia--selecionado' : null,
                                ]
                                  .filter(Boolean)
                                  .join(' ')}
                                disabled={foraDoMes}
                                tabIndex={mesmoDia(dia, focada) ? 0 : -1}
                                aria-label={dataPorExtenso(dia)}
                                aria-current={ehHoje ? 'date' : undefined}
                                onClick={() => selecionar(dia)}
                              >
                                {dia.getDate()}
                              </button>
                            </td>
                          );
                        })}
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="citie-calendario__rodape">
                <button
                  type="button"
                  className="citie-calendario__acao"
                  onClick={() => selecionar(hoje)}
                >
                  Hoje
                </button>
                <button
                  type="button"
                  className="citie-calendario__acao"
                  onClick={() => {
                    setSelecionada(undefined);
                    setAberto(false);
                  }}
                >
                  Limpar
                </button>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </FieldWrapper>
  );
}

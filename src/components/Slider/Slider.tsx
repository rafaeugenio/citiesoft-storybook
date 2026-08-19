import { useId, useState, type CSSProperties } from 'react';
import './Slider.css';

/**
 * Slider (Figma CitieOne, página ❖ Slider).
 * Variantes do arquivo: Slide, Input, Range, Direction (Horizontal | Vertical),
 * Disabled. O handle tem os estados Idle, Hover e Focus.
 *
 * Usa `input[type=range]` nativo: entrega teclado (setas, Home, End, PageUp,
 * PageDown), papel de slider e anúncio de valor sem reimplementação.
 */

export interface SliderProps {
  /** Nome do valor que está sendo ajustado. */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  direction?: 'horizontal' | 'vertical';
  disabled?: boolean;
  /** Mostra o campo numérico ao lado, para entrada precisa. */
  comEntrada?: boolean;
  /** Formata o valor exibido e o anunciado ao leitor de tela. */
  formatar?: (valor: number) => string;
  onChange?: (valor: number) => void;
}

export function Slider({
  label,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = 50,
  direction = 'horizontal',
  disabled = false,
  comEntrada = false,
  formatar,
  onChange,
}: SliderProps) {
  const id = useId();
  const [valor, setValor] = useState(defaultValue);
  const preenchido = ((valor - min) / (max - min)) * 100;

  const atualizar = (proximo: number) => {
    setValor(proximo);
    onChange?.(proximo);
  };

  return (
    <div className={`citie-slider citie-slider--${direction}`}>
      <label className="citie-slider__label" htmlFor={id}>
        {label}
      </label>

      <div className="citie-slider__linha">
        <input
          id={id}
          type="range"
          className="citie-slider__controle"
          min={min}
          max={max}
          step={step}
          value={valor}
          disabled={disabled}
          // O trilho preenchido acompanha o valor sem depender de JS no CSS.
          style={{ '--preenchido': `${preenchido}%` } as CSSProperties}
          aria-valuetext={formatar ? formatar(valor) : undefined}
          onChange={(evento) => atualizar(Number(evento.target.value))}
        />

        {comEntrada ? (
          <input
            type="number"
            className="citie-slider__entrada"
            aria-label={`${label}, valor exato`}
            min={min}
            max={max}
            step={step}
            value={valor}
            disabled={disabled}
            onChange={(evento) => atualizar(Number(evento.target.value))}
          />
        ) : (
          <output className="citie-slider__valor" htmlFor={id}>
            {formatar ? formatar(valor) : valor}
          </output>
        )}
      </div>
    </div>
  );
}

export interface RangeSliderProps extends Omit<SliderProps, 'defaultValue' | 'comEntrada'> {
  /** Nomeia as duas pontas, nunca "valor 1" e "valor 2". */
  rotuloInicio: string;
  rotuloFim: string;
  defaultValue?: [number, number];
}

/** Duas pontas, para filtro de faixa. Cada ponta é um controle próprio. */
export function RangeSlider({
  label,
  rotuloInicio,
  rotuloFim,
  min = 0,
  max = 100,
  step = 1,
  defaultValue = [20, 80],
  disabled = false,
  formatar,
}: RangeSliderProps) {
  const [inicio, setInicio] = useState(defaultValue[0]);
  const [fim, setFim] = useState(defaultValue[1]);

  const esquerda = ((Math.min(inicio, fim) - min) / (max - min)) * 100;
  const direita = ((Math.max(inicio, fim) - min) / (max - min)) * 100;

  return (
    <fieldset className="citie-slider citie-slider--range">
      <legend className="citie-slider__label">{label}</legend>

      <div
        className="citie-slider__trilho-duplo"
        style={{ '--inicio': `${esquerda}%`, '--fim': `${direita}%` } as CSSProperties}
      >
        <input
          type="range"
          className="citie-slider__controle citie-slider__controle--sobreposto"
          aria-label={rotuloInicio}
          min={min}
          max={max}
          step={step}
          value={inicio}
          disabled={disabled}
          aria-valuetext={formatar ? formatar(inicio) : undefined}
          onChange={(evento) => setInicio(Math.min(Number(evento.target.value), fim))}
        />
        <input
          type="range"
          className="citie-slider__controle citie-slider__controle--sobreposto"
          aria-label={rotuloFim}
          min={min}
          max={max}
          step={step}
          value={fim}
          disabled={disabled}
          aria-valuetext={formatar ? formatar(fim) : undefined}
          onChange={(evento) => setFim(Math.max(Number(evento.target.value), inicio))}
        />
      </div>

      <p className="citie-slider__valor">
        {formatar ? formatar(inicio) : inicio} a {formatar ? formatar(fim) : fim}
      </p>
    </fieldset>
  );
}

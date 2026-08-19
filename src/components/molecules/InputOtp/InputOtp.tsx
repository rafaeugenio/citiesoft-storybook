import { useRef, useState } from 'react';
import './InputOtp.css';

/**
 * InputOtp (Figma CitieOne, página ❖ InputOtp).
 * Variante do arquivo: Size (Normal | Small | Large).
 *
 * O grupo tem um rótulo único e cada casa carrega a posição no nome acessível,
 * porque "campo 1" sozinho não diz nada a quem usa leitor de tela.
 */

export type TamanhoOtp = 'small' | 'normal' | 'large';

export interface InputOtpProps {
  /** O que o código representa: "Código enviado por SMS". */
  label: string;
  /** Quantidade de casas. */
  length?: number;
  size?: TamanhoOtp;
  disabled?: boolean;
  invalid?: boolean;
  /** Mensagem no padrão o que aconteceu mais como resolver. */
  error?: string;
  /** Oculta os dígitos, para código de acesso sensível. */
  mask?: boolean;
  onComplete?: (codigo: string) => void;
}

export function InputOtp({
  label,
  length = 6,
  size = 'normal',
  disabled = false,
  invalid = false,
  error,
  mask = false,
  onComplete,
}: InputOtpProps) {
  const [digitos, setDigitos] = useState<string[]>(Array.from({ length }, () => ''));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const escrever = (indice: number, valor: string) => {
    const limpo = valor.replace(/\D/g, '').slice(-1);
    const proximos = [...digitos];
    proximos[indice] = limpo;
    setDigitos(proximos);

    // Avança sozinho, que é o comportamento esperado de código de verificação.
    if (limpo && indice < length - 1) refs.current[indice + 1]?.focus();
    if (proximos.every(Boolean)) onComplete?.(proximos.join(''));
  };

  const aoTeclar = (indice: number, evento: React.KeyboardEvent<HTMLInputElement>) => {
    if (evento.key === 'Backspace' && !digitos[indice] && indice > 0) {
      refs.current[indice - 1]?.focus();
    }
    if (evento.key === 'ArrowLeft' && indice > 0) refs.current[indice - 1]?.focus();
    if (evento.key === 'ArrowRight' && indice < length - 1) refs.current[indice + 1]?.focus();
  };

  const mensagemId = `${label.replace(/\s+/g, '-').toLowerCase()}-erro`;

  return (
    <fieldset className={`citie-otp citie-otp--${size}`}>
      <legend className="citie-otp__label">{label}</legend>

      <div className="citie-otp__casas">
        {digitos.map((digito, indice) => (
          <input
            key={indice}
            ref={(elemento) => {
              refs.current[indice] = elemento;
            }}
            type={mask ? 'password' : 'text'}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            className="citie-otp__casa"
            aria-label={`${label}, dígito ${indice + 1} de ${length}`}
            aria-invalid={invalid || undefined}
            aria-describedby={error ? mensagemId : undefined}
            value={digito}
            disabled={disabled}
            onChange={(evento) => escrever(indice, evento.target.value)}
            onKeyDown={(evento) => aoTeclar(indice, evento)}
          />
        ))}
      </div>

      {error ? (
        <p id={mensagemId} className="citie-otp__erro">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

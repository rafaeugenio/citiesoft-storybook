import { useState, type ReactNode } from 'react';

/** Botão que copia `texto` e confirma por um instante. Funciona sem permissão de clipboard avançada. */
export function Copiar({ texto, children, className = '' }: { texto: string; children: ReactNode; className?: string }) {
  const [ok, setOk] = useState(false);
  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch {
      const area = document.createElement('textarea');
      area.value = texto;
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
    }
    setOk(true);
    setTimeout(() => setOk(false), 1200);
  };
  return (
    <button
      type="button"
      onClick={copiar}
      title={`Copiar ${texto}`}
      className={`cursor-pointer rounded-sm text-start outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring ${className}`}
    >
      {ok ? <span className="text-text-secondary">Copiado</span> : children}
    </button>
  );
}

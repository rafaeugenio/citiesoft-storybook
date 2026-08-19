import { useRef, useState } from 'react';
import { Button } from '../../atoms/Button/Button';
import { ProgressBar } from '../../atoms/Progress/Progress';
import './Upload.css';

export type EstadoDoArquivo = 'pronto' | 'enviando' | 'enviado' | 'erro';

export interface ArquivoDoUpload {
  id: string;
  nome: string;
  /** Em bytes; exibido em unidade legível. */
  tamanho: number;
  estado: EstadoDoArquivo;
  progresso?: number;
  /** Motivo no padrão o que aconteceu mais como resolver, nunca código cru. */
  erro?: string;
}

export function formatarTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`.replace('.', ',');
}

export interface UploadProps {
  /** Informa formato e limite: "PDF ou JPG até 10 MB". */
  instrucao: string;
  variante?: 'advanced' | 'basic';
  arquivos?: ArquivoDoUpload[];
  disabled?: boolean;
  onRemover?: (id: string) => void;
}

export function Upload({
  instrucao,
  variante = 'advanced',
  arquivos = [],
  disabled = false,
  onRemover,
}: UploadProps) {
  const [arrastando, setArrastando] = useState(false);
  const entradaRef = useRef<HTMLInputElement>(null);

  const lista =
    arquivos.length > 0 ? (
      <ul className="citie-upload__lista">
        {arquivos.map((arquivo) => (
          <li
            key={arquivo.id}
            className={`citie-upload__item${
              arquivo.estado === 'erro' ? ' citie-upload__item--erro' : ''
            }`}
          >
            <span className="citie-upload__tipo" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
                <path d="M14 3v5h5" />
              </svg>
            </span>

            <div className="citie-upload__dados">
              <p className="citie-upload__nome">{arquivo.nome}</p>
              <p className="citie-upload__meta">{formatarTamanho(arquivo.tamanho)}</p>

              {arquivo.estado === 'enviando' ? (
                <ProgressBar
                  rotulo={`Enviando ${arquivo.nome}`}
                  valor={arquivo.progresso ?? 0}
                  mensagem={`${arquivo.progresso ?? 0}% enviado`}
                  altura={4}
                />
              ) : null}

              {arquivo.estado === 'erro' && arquivo.erro ? (
                <p className="citie-upload__erro">{arquivo.erro}</p>
              ) : null}
            </div>

            {/* A cor não é o único indicador: o ícone acompanha o estado. */}
            {arquivo.estado === 'enviado' ? (
              <span className="citie-upload__sucesso" role="status">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="m5 12 5 5 9-10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="citie-visualmente-oculto">{arquivo.nome} enviado</span>
              </span>
            ) : null}

            {arquivo.estado === 'erro' ? (
              <Button variant="text" size="small">
                Tentar novamente
              </Button>
            ) : null}

            <button
              type="button"
              className="citie-upload__remover"
              aria-label={`Remover ${arquivo.nome}`}
              onClick={() => onRemover?.(arquivo.id)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </li>
        ))}
      </ul>
    ) : null;

  if (variante === 'basic') {
    return (
      <div className="citie-upload">
        <Button variant="secondary" disabled={disabled} onClick={() => entradaRef.current?.click()}>
          Selecionar arquivo
        </Button>
        <p className="citie-upload__instrucao">{instrucao}</p>
        {/* Proxy do botão visível: fora da árvore de acessibilidade e da ordem de tabulação. */}
      <input
        ref={entradaRef}
        type="file"
        className="citie-visualmente-oculto"
        tabIndex={-1}
        aria-hidden="true"
      />
        {lista}
      </div>
    );
  }

  return (
    <div className="citie-upload">
      <button
        type="button"
        className={`citie-upload__area${arrastando ? ' citie-upload__area--ativa' : ''}`}
        disabled={disabled}
        onClick={() => entradaRef.current?.click()}
        onDragOver={(evento) => {
          evento.preventDefault();
          setArrastando(true);
        }}
        onDragLeave={() => setArrastando(false)}
        onDrop={(evento) => {
          evento.preventDefault();
          setArrastando(false);
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M12 16V4m0 0L8 8m4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" strokeLinecap="round" />
        </svg>
        <span className="citie-upload__chamada">Arraste um arquivo ou selecione</span>
        <span className="citie-upload__instrucao">{instrucao}</span>
      </button>

      {/* Proxy do botão visível: fora da árvore de acessibilidade e da ordem de tabulação. */}
      <input
        ref={entradaRef}
        type="file"
        className="citie-visualmente-oculto"
        tabIndex={-1}
        aria-hidden="true"
      />
      {lista}
    </div>
  );
}

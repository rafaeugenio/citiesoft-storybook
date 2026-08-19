import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import './Overlay.css';

/**
 * Dialog, ConfirmDialog e Drawer (modals-dialogs-drawers.md).
 * Os três usam o elemento `dialog` nativo em modo modal, o que entrega prisão de
 * foco, inerte no fundo e fechamento por Escape sem reimplementação.
 */

function useDialogModal(aberto: boolean, onClose?: () => void, obrigatorio = false) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    if (aberto && !elemento.open) elemento.showModal();
    if (!aberto && elemento.open) elemento.close();
  }, [aberto]);

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    const aoCancelar = (evento: Event) => {
      // Modal obrigatório (aceite de termos) não fecha por Escape.
      if (obrigatorio) {
        evento.preventDefault();
        return;
      }
      evento.preventDefault();
      onClose?.();
    };

    elemento.addEventListener('cancel', aoCancelar);
    return () => elemento.removeEventListener('cancel', aoCancelar);
  }, [onClose, obrigatorio]);

  return ref;
}

export type TamanhoDialog = 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen';

export interface DialogProps {
  aberto: boolean;
  /** Identifica a tarefa e o objeto: "Editar benefício de José Carlos Ribeiro". */
  titulo: string;
  subtitulo?: string;
  tamanho?: TamanhoDialog;
  /** Sem fechamento por Escape nem clique no backdrop. */
  obrigatorio?: boolean;
  children: ReactNode;
  rodape?: ReactNode;
  onClose?: () => void;
}

export function Dialog({
  aberto,
  titulo,
  subtitulo,
  tamanho = 'md',
  obrigatorio = false,
  children,
  rodape,
  onClose,
}: DialogProps) {
  const ref = useDialogModal(aberto, onClose, obrigatorio);
  const tituloId = useId();

  return (
    <dialog
      ref={ref}
      className={`citie-dialog citie-dialog--${tamanho}`}
      aria-labelledby={tituloId}
      onClick={(evento) => {
        // Clique no backdrop alcança o próprio dialog, nunca o conteúdo interno.
        if (!obrigatorio && evento.target === ref.current) onClose?.();
      }}
    >
      <header className="citie-dialog__cabecalho">
        <div>
          <h2 className="citie-dialog__titulo" id={tituloId}>
            {titulo}
          </h2>
          {subtitulo ? <p className="citie-dialog__subtitulo">{subtitulo}</p> : null}
        </div>
        {obrigatorio ? null : (
          <button
            type="button"
            className="citie-overlay__fechar"
            aria-label="Fechar diálogo"
            onClick={onClose}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        )}
      </header>

      <div className="citie-dialog__corpo">{children}</div>

      {rodape ? <footer className="citie-dialog__rodape">{rodape}</footer> : null}
    </dialog>
  );
}

export interface ConfirmDialogProps {
  aberto: boolean;
  /** Pergunta direta nomeando o objeto: "Excluir processo 2025/0481?". */
  titulo: string;
  /** Consequência mais grave primeiro, sem repetir o comando. */
  descricao: string;
  /** Verbo da ação: "Excluir", "Arquivar", nunca "Sim" ou "OK". */
  rotuloConfirmar: string;
  variante?: 'danger' | 'warning' | 'info';
  confirmando?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

export function ConfirmDialog({
  aberto,
  titulo,
  descricao,
  rotuloConfirmar,
  variante = 'danger',
  confirmando = false,
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const ref = useDialogModal(aberto, onClose);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const tituloId = useId();
  const descricaoId = useId();

  useEffect(() => {
    // `showModal` move o foco para o primeiro focável, que aqui é a ação
    // destrutiva. A spec exige o oposto, então o foco é reposicionado à mão.
    if (aberto) cancelarRef.current?.focus();
  }, [aberto]);

  const variantePorBotao = { danger: 'danger', warning: 'warn', info: 'primary' } as const;

  return (
    <dialog
      ref={ref}
      className="citie-dialog citie-dialog--confirm"
      // Papel de diálogo de alerta: sinaliza urgência ao leitor de tela.
      role="alertdialog"
      aria-labelledby={tituloId}
      aria-describedby={descricaoId}
    >
      <div className="citie-confirm__conteudo">
        <h2 className="citie-dialog__titulo" id={tituloId}>
          {titulo}
        </h2>
        <p className="citie-confirm__descricao" id={descricaoId}>
          {descricao}
        </p>
      </div>

      <footer className="citie-dialog__rodape citie-dialog__rodape--confirm">
        <Button variant={variantePorBotao[variante]} loading={confirmando} onClick={onConfirm}>
          {rotuloConfirmar}
        </Button>
        {/* Foco inicial na ação segura, nunca na destrutiva. */}
        <Button ref={cancelarRef} variant="secondary" disabled={confirmando} onClick={onClose}>
          Cancelar
        </Button>
      </footer>
    </dialog>
  );
}

export type PosicaoDrawer = 'right-sm' | 'right-md' | 'right-lg' | 'right-xl' | 'left' | 'bottom';

export interface DrawerProps {
  aberto: boolean;
  /** Identifica o contexto: "Filtros avançados", "Editar PDI, Ana Paula Silva". */
  titulo: string;
  subtitulo?: string;
  posicao?: PosicaoDrawer;
  children: ReactNode;
  /** Omitido em painéis de leitura. */
  rodape?: ReactNode;
  onClose?: () => void;
}

export function Drawer({
  aberto,
  titulo,
  subtitulo,
  posicao = 'right-md',
  children,
  rodape,
  onClose,
}: DrawerProps) {
  const ref = useDialogModal(aberto, onClose);
  const tituloId = useId();

  return (
    <dialog
      ref={ref}
      className={`citie-drawer citie-drawer--${posicao}`}
      aria-labelledby={tituloId}
      onClick={(evento) => {
        if (evento.target === ref.current) onClose?.();
      }}
    >
      <header className="citie-drawer__cabecalho">
        <div>
          <h2 className="citie-dialog__titulo" id={tituloId}>
            {titulo}
          </h2>
          {subtitulo ? <p className="citie-dialog__subtitulo">{subtitulo}</p> : null}
        </div>
        <button
          type="button"
          className="citie-overlay__fechar citie-overlay__fechar--amplo"
          aria-label={`Fechar ${titulo.toLowerCase()}`}
          onClick={onClose}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="citie-drawer__corpo">{children}</div>

      {rodape ? <footer className="citie-dialog__rodape">{rodape}</footer> : null}
    </dialog>
  );
}

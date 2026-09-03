import { useEffect, useId, useRef, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import './Overlay.css';

/**
 * Dialog, ConfirmDialog e Drawer (modals-dialogs-drawers.md).
 * Os três usam o elemento `dialog` nativo em modo modal, o que entrega inerte
 * no fundo, fechamento por Escape e devolução de foco ao gatilho sem
 * reimplementação. A prisão de foco (Tab não escapar do conteúdo) o `dialog`
 * nativo NÃO entrega sozinho: medido com Tab real em Chromium, o foco sai do
 * último elemento focável direto para o `<body>`. `useDialogModal` fecha esse
 * ciclo por conta própria, no keydown, para Dialog, ConfirmDialog, Drawer e
 * qualquer outro consumidor do hook.
 */

/** Focáveis visíveis dentro do elemento, na ordem do DOM (ordem de Tab). */
function elementosFocaveis(elemento: HTMLElement): HTMLElement[] {
  const seletor =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(elemento.querySelectorAll<HTMLElement>(seletor)).filter(
    (candidato) => candidato.offsetParent !== null,
  );
}

export function useDialogModal(aberto: boolean, onClose?: () => void, obrigatorio = false) {
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

  useEffect(() => {
    const elemento = ref.current;
    if (!elemento) return;

    // Prisão de foco manual: Tab no último focável recicla para o primeiro, e
    // Shift+Tab no primeiro recicla para o último. O `dialog` nativo já torna
    // o fundo da página inerte, então os únicos focáveis alcançáveis por Tab
    // são os de dentro do próprio elemento; sem este listener o navegador
    // deixa o Tab do último sair para a barra de endereço/`<body>`.
    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key !== 'Tab') return;

      const focaveis = elementosFocaveis(elemento);
      if (focaveis.length === 0) return;

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    elemento.addEventListener('keydown', aoTeclar);
    return () => elemento.removeEventListener('keydown', aoTeclar);
  }, []);

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
    // O foco inicial pertence à ação segura, nunca à destrutiva. "Cancelar" já
    // é o primeiro focável na ordem do DOM, mas o `showModal` não dá essa
    // garantia por contrato, então o foco é posicionado explicitamente: uma
    // reordenação futura do rodapé não pode mover o foco para "Excluir".
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
        {/*
         * A ação segura vem primeiro na leitura e no Tab, e o rodapé separa os
         * dois botões nas pontas opostas: a distância física entre "Cancelar"
         * e a ação destrutiva é a última defesa contra o clique que escorrega.
         * Botões adjacentes transformam 8 pixels de erro motor num processo
         * excluído.
         */}
        <Button ref={cancelarRef} variant="secondary" disabled={confirmando} onClick={onClose}>
          Cancelar
        </Button>
        <Button variant={variantePorBotao[variante]} loading={confirmando} onClick={onConfirm}>
          {rotuloConfirmar}
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

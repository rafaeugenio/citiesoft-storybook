import { useEffect, useId, useRef } from 'react';
import { Button, type ButtonVariant } from '../../atoms/Button/Button';
import { useDialogModal } from '../Overlay/Overlay';
import '../../../tokens/severidade.css';
import './AlertDialog.css';

export type SeveridadeAlertDialog = 'destrutiva' | 'critica';

const CLASSE_SEVERIDADE: Record<SeveridadeAlertDialog, string> = {
  destrutiva: 'citie-sev--danger',
  critica: 'citie-sev--warn',
};

const VARIANTE_CONFIRMAR: Record<SeveridadeAlertDialog, ButtonVariant> = {
  destrutiva: 'danger',
  critica: 'primary',
};

function IconeSeveridade({ severidade }: { severidade: SeveridadeAlertDialog }) {
  const comum = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    'aria-hidden': true as const,
  };

  if (severidade === 'destrutiva') {
    return (
      <svg {...comum}>
        <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 11v6M14 11v6" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...comum}>
      <path d="M12 4 2.5 20h19L12 4Z" strokeLinejoin="round" />
      <path d="M12 10v4" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export interface AlertDialogProps {
  aberto: boolean;
  /** Pergunta direta nomeando o objeto: "Excluir processo 2025/0481?". */
  titulo: string;
  /** Consequência mais grave primeiro, sem repetir o comando. */
  descricao: string;
  severidade?: SeveridadeAlertDialog;
  /** Verbo da ação: "Excluir", "Enviar para aprovação". Nunca "Sim" ou "OK". */
  rotuloConfirmar: string;
  rotuloCancelar?: string;
  confirmando?: boolean;
  onConfirm?: () => void;
  onClose?: () => void;
}

/**
 * AlertDialog: confirmação destrutiva ou crítica, com a caixa de ícone de
 * severidade que o `ConfirmDialog` do Lote 3 (`organisms/Overlay`) não tem.
 *
 * Compõe `useDialogModal`, o mesmo hook do `Dialog`, `ConfirmDialog` e
 * `Drawer`: `showModal`/`close` controlados pela prop `aberto`, cancelamento
 * por Escape e a prisão de foco manual (Tab não escapa do conteúdo). O
 * contrato de acessibilidade é o do `ConfirmDialog`: `role="alertdialog"`,
 * foco inicial na ação segura (Cancelar) e Escape cancela.
 */
export function AlertDialog({
  aberto,
  titulo,
  descricao,
  severidade = 'destrutiva',
  rotuloConfirmar,
  rotuloCancelar = 'Cancelar',
  confirmando = false,
  onConfirm,
  onClose,
}: AlertDialogProps) {
  const ref = useDialogModal(aberto, onClose);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const tituloId = useId();
  const descricaoId = useId();

  useEffect(() => {
    // O foco inicial pertence à ação segura, nunca à ação crítica: uma
    // reordenação futura do rodapé não pode mover o foco para a confirmação.
    if (aberto) cancelarRef.current?.focus();
  }, [aberto]);

  return (
    <dialog
      ref={ref}
      className="citie-alert-dialog"
      role="alertdialog"
      aria-labelledby={tituloId}
      aria-describedby={descricaoId}
    >
      <div className="citie-alert-dialog__conteudo">
        <span
          className={`citie-alert-dialog__icone citie-sev ${CLASSE_SEVERIDADE[severidade]}`}
          aria-hidden="true"
        >
          <IconeSeveridade severidade={severidade} />
        </span>
        <div className="citie-alert-dialog__texto">
          <h2 className="citie-alert-dialog__titulo" id={tituloId}>
            {titulo}
          </h2>
          <p className="citie-alert-dialog__descricao" id={descricaoId}>
            {descricao}
          </p>
        </div>
      </div>

      <footer className="citie-alert-dialog__rodape">
        <Button ref={cancelarRef} variant="secondary" disabled={confirmando} onClick={onClose}>
          {rotuloCancelar}
        </Button>
        <Button
          variant={VARIANTE_CONFIRMAR[severidade]}
          loading={confirmando}
          onClick={onConfirm}
        >
          {rotuloConfirmar}
        </Button>
      </footer>
    </dialog>
  );
}

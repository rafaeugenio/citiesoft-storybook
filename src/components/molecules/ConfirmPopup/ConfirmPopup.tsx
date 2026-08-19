import { useCallback, useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import './ConfirmPopup.css';

/**
 * ConfirmPopup — página `❖ ConfirmPopup` do Figma CitieOne (`6738:50208`),
 * component set `confirmpopup` com o eixo `Popup: False | True` (fechado /
 * ancorado ao gatilho). A estrutura do Figma é: cartão com sombra → `content`
 * (ícone de alerta + mensagem) → `footer` alinhado à direita com dois botões
 * pequenos, cancelar antes de confirmar.
 *
 * Irmão leve do `ConfirmDialog`: confirma junto ao botão que disparou a ação,
 * sem escurecer a tela. A spec `03-components/modals-dialogs-drawers.md` reserva
 * o diálogo modal para ação destrutiva, então este popup **não serve para
 * exclusão** nem para qualquer efeito irreversível.
 *
 * O popup não usa `dialog` nativo de propósito: ele precisa ficar ancorado ao
 * gatilho, e a top layer do `dialog` modal ignora o fluxo da página. Prisão de
 * foco, Escape e devolução de foco são implementados aqui à mão.
 */

/** Lado em que o cartão nasce a partir do gatilho. */
export type PosicaoConfirmPopup = 'abaixo' | 'acima';

/** Borda do gatilho com que o cartão se alinha. `fim` evita estouro à direita. */
export type AlinhamentoConfirmPopup = 'inicio' | 'fim';

/** Severidade da ação: define o ícone e a variante do botão de confirmação. */
export type VarianteConfirmPopup = 'aviso' | 'informacao' | 'sucesso';

export interface ConfirmPopupProps {
  aberto: boolean;
  /** O gatilho. Fica sempre visível; o cartão nasce ancorado nele. */
  children: ReactNode;
  /** Pergunta curta nomeando o objeto: "Reenviar o ofício 2025/0481?". */
  mensagem: string;
  /** Consequência da ação, quando não for óbvia pela pergunta. */
  detalhe?: string;
  /** Verbo da ação: "Reenviar", "Duplicar". Nunca "Sim" ou "OK". */
  rotuloConfirmar: string;
  rotuloCancelar?: string;
  variante?: VarianteConfirmPopup;
  posicao?: PosicaoConfirmPopup;
  alinhamento?: AlinhamentoConfirmPopup;
  /** Substitui o ícone padrão da variante. */
  icone?: ReactNode;
  confirmando?: boolean;
  onConfirm?: () => void;
  /** Chamado no Cancelar, no Escape e no clique fora. */
  onCancel?: () => void;
}

const varianteDoBotao = { aviso: 'warn', informacao: 'primary', sucesso: 'success' } as const;

function IconeAviso() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 4.5 2.5 20.5h19L12 4.5Z" strokeLinejoin="round" />
      <path d="M12 10v4.5" strokeLinecap="round" />
      <path d="M12 17.6h.01" strokeLinecap="round" />
    </svg>
  );
}

function IconeInformacao() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5" strokeLinecap="round" />
      <path d="M12 7.6h.01" strokeLinecap="round" />
    </svg>
  );
}

function IconeSucesso() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.3 2.7 2.7L16 9.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const iconePadrao: Record<VarianteConfirmPopup, ReactNode> = {
  aviso: <IconeAviso />,
  informacao: <IconeInformacao />,
  sucesso: <IconeSucesso />,
};

const SELETOR_FOCAVEL =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function ConfirmPopup({
  aberto,
  children,
  mensagem,
  detalhe,
  rotuloConfirmar,
  rotuloCancelar = 'Cancelar',
  variante = 'aviso',
  posicao = 'abaixo',
  alinhamento = 'inicio',
  icone,
  confirmando = false,
  onConfirm,
  onCancel,
}: ConfirmPopupProps) {
  const ancoraRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const cancelarRef = useRef<HTMLButtonElement>(null);
  const gatilhoRef = useRef<HTMLElement | null>(null);
  const mensagemId = useId();
  const detalheId = useId();

  useEffect(() => {
    if (!aberto) return;

    const ancora = ancoraRef.current;
    const ativo = document.activeElement as HTMLElement | null;
    // Quem abriu costuma estar em foco; se a abertura veio de outro lugar,
    // o primeiro focável da âncora (o gatilho) recebe o foco de volta.
    gatilhoRef.current =
      ativo && ancora?.contains(ativo) && !popupRef.current?.contains(ativo)
        ? ativo
        : (ancora?.querySelector<HTMLElement>(SELETOR_FOCAVEL) ?? null);

    // Foco inicial na ação segura, igual ao ConfirmDialog.
    cancelarRef.current?.focus();
  }, [aberto]);

  const cancelar = useCallback(() => {
    gatilhoRef.current?.focus();
    onCancel?.();
  }, [onCancel]);

  useEffect(() => {
    if (!aberto) return;

    const aoApontar = (evento: PointerEvent) => {
      const alvo = evento.target as Node;
      // Clique no próprio gatilho é ignorado: quem controla `aberto` é quem chama.
      if (popupRef.current?.contains(alvo) || gatilhoRef.current?.contains(alvo)) return;
      cancelar();
    };

    document.addEventListener('pointerdown', aoApontar);
    return () => document.removeEventListener('pointerdown', aoApontar);
  }, [aberto, cancelar]);

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (evento.key === 'Escape') {
      evento.stopPropagation();
      cancelar();
      return;
    }
    if (evento.key !== 'Tab') return;

    const focaveis = Array.from(
      popupRef.current?.querySelectorAll<HTMLElement>(SELETOR_FOCAVEL) ?? [],
    );
    if (focaveis.length === 0) return;

    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    const ativo = document.activeElement;

    // Tab circula dentro do popup enquanto ele estiver aberto.
    if (evento.shiftKey && ativo === primeiro) {
      evento.preventDefault();
      ultimo.focus();
    } else if (!evento.shiftKey && ativo === ultimo) {
      evento.preventDefault();
      primeiro.focus();
    }
  };

  return (
    <div className="citie-confirm-popup" ref={ancoraRef}>
      {children}

      {aberto ? (
        <div
          ref={popupRef}
          className={`citie-confirm-popup__cartao citie-confirm-popup__cartao--${posicao} citie-confirm-popup__cartao--${alinhamento}`}
          // Papel de diálogo de alerta: interrompe o leitor de tela, como no ConfirmDialog.
          role="alertdialog"
          aria-labelledby={mensagemId}
          aria-describedby={detalhe ? detalheId : undefined}
          onKeyDown={aoTeclar}
        >
          <div className="citie-confirm-popup__conteudo">
            <span className={`citie-confirm-popup__icone citie-confirm-popup__icone--${variante}`} aria-hidden="true">
              {icone ?? iconePadrao[variante]}
            </span>
            <div>
              <p className="citie-confirm-popup__mensagem" id={mensagemId}>
                {mensagem}
              </p>
              {detalhe ? (
                <p className="citie-confirm-popup__detalhe" id={detalheId}>
                  {detalhe}
                </p>
              ) : null}
            </div>
          </div>

          <div className="citie-confirm-popup__rodape">
            {/* Cancelar antes de confirmar, como no Figma, e é ele quem recebe o foco. */}
            <Button
              ref={cancelarRef}
              size="small"
              variant="secondary"
              disabled={confirmando}
              onClick={cancelar}
            >
              {rotuloCancelar}
            </Button>
            <Button
              size="small"
              variant={varianteDoBotao[variante]}
              loading={confirmando}
              onClick={onConfirm}
            >
              {rotuloConfirmar}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

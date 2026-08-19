import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Input } from '../../molecules/Input/Input';
import { Button } from '../../atoms/Button/Button';
import './Inplace.css';

/** Lápis do estado de exibição: sinaliza que o valor é editável. */
function LapisIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flex: 'none' }}
    >
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

export interface InplaceProps {
  /** Substantivo que nomeia o dado ("Valor da diária"). Vira o label do campo. */
  rotulo: string;
  /** Valor já formatado para leitura ("R$ 1.234,56"). */
  valor: string;
  /** Valor cru que entra no campo, quando difere do exibido. Padrão: `valor`. */
  valorEdicao?: string;
  /** Recebe o conteúdo do campo na confirmação. */
  aoConfirmar: (novoValor: string) => void;
  /** Tipo do campo em edição. */
  tipoCampo?: 'text' | 'number' | 'date';
  /** Addon fixo colado à borda do campo: "R$", "%", unidade. */
  addonStart?: ReactNode;
  /** Regra de preenchimento, visível só durante a edição. */
  helper?: string;
  /** Texto do gatilho quando não há valor registrado. */
  placeholder?: string;
  /**
   * Bloqueia a edição sem tirar o gatilho da ordem de foco: quem navega por
   * teclado precisa alcançar o valor para lê-lo.
   */
  desabilitado?: boolean;
}

/**
 * Edição no lugar: o valor exibido vira campo ao ser acionado.
 *
 * Figma CitieOne, página `6738:55110`. O set `inplace` traz os eixos `State`
 * (Idle · Hover · N/A) e `Active` (False · True): exibição com realce no hover
 * e o conteúdo editável no lugar quando ativo. A part `inplace-content` é o
 * bloco que substitui o display, aqui composto de `Input` mais as ações.
 * Equivalente PrimeNG: `p-inplace`.
 *
 * O Figma desenha o display como texto clicável. Aqui ele é um `button` de
 * verdade com nome acessível que diz o que edita: sem isso o valor não entra na
 * ordem de foco e o leitor de tela não anuncia nenhuma ação disponível.
 */
export function Inplace({
  rotulo,
  valor,
  valorEdicao,
  aoConfirmar,
  tipoCampo = 'text',
  addonStart,
  helper,
  placeholder = 'Não informado',
  desabilitado = false,
}: InplaceProps) {
  const bruto = valorEdicao ?? valor;
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState(bruto);
  const [anuncio, setAnuncio] = useState('');

  const gatilhoRef = useRef<HTMLButtonElement>(null);
  const edicaoRef = useRef<HTMLDivElement>(null);
  /** Só devolve o foco ao gatilho quando a saída da edição partiu do usuário. */
  const devolverFoco = useRef(false);

  useEffect(() => {
    if (!editando) {
      if (devolverFoco.current) {
        devolverFoco.current = false;
        gatilhoRef.current?.focus();
      }
      return;
    }
    const campo = edicaoRef.current?.querySelector('input');
    campo?.focus();
    campo?.select();
  }, [editando]);

  const abrir = () => {
    if (desabilitado) return;
    setRascunho(bruto);
    setAnuncio(`${rotulo} em edição. O campo está em foco. Enter confirma, Esc cancela.`);
    setEditando(true);
  };

  const confirmar = () => {
    devolverFoco.current = true;
    setEditando(false);
    setAnuncio(`${rotulo} atualizado para ${rascunho}.`);
    aoConfirmar(rascunho);
  };

  const cancelar = () => {
    devolverFoco.current = true;
    setEditando(false);
    setRascunho(bruto);
    setAnuncio(`Edição cancelada. ${rotulo} continua ${valor}.`);
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    if (evento.key === 'Escape') {
      evento.preventDefault();
      cancelar();
    }
    if (evento.key === 'Enter') {
      // O bloco de edição não é um form: sem isto o Enter não faz nada.
      evento.preventDefault();
      confirmar();
    }
  };

  const temValor = valor.trim().length > 0;
  const exibido = temValor ? valor : placeholder;

  return (
    <div className="citie-inplace">
      {editando ? (
        <div className="citie-inplace__edicao" ref={edicaoRef} onKeyDown={aoTeclar}>
          <Input
            label={rotulo}
            type={tipoCampo}
            value={rascunho}
            helper={helper}
            addonStart={addonStart}
            onChange={(evento) => setRascunho(evento.target.value)}
          />
          <div className="citie-inplace__acoes">
            <Button size="small" icon={<CheckIcon />} onClick={confirmar}>
              Confirmar
            </Button>
            <Button size="small" variant="text" onClick={cancelar}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <div className="citie-inplace__exibicao">
          <span className="citie-inplace__rotulo">{rotulo}</span>
          <button
            type="button"
            ref={gatilhoRef}
            className="citie-inplace__gatilho"
            aria-disabled={desabilitado || undefined}
            aria-label={
              desabilitado
                ? `${rotulo}, ${exibido}. Edição bloqueada.`
                : `Editar ${rotulo}, atualmente ${exibido}`
            }
            onClick={abrir}
          >
            <span className={`citie-inplace__valor${temValor ? '' : ' citie-inplace__valor--vazio'}`}>
              {exibido}
            </span>
            {desabilitado ? null : <LapisIcon />}
          </button>
        </div>
      )}

      {/* Fica sempre montada: região viva criada junto com o texto não é lida. */}
      <span role="status" aria-live="polite" className="citie-visualmente-oculto">
        {anuncio}
      </span>
    </div>
  );
}

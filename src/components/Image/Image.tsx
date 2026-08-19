import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Skeleton, SkeletonRegion } from '../Skeleton/Skeleton';
import './Image.css';

/**
 * Image (página Figma `6738:54006` do CitieOne, fileKey B6fM1Aig3uPIvQ6amLObZC).
 *
 * Variantes do arquivo respeitadas:
 * - `image`: eixos `State` (Idle / Hover) e `Preview` (False / True). Com
 *   `Preview=True`, o estado Hover cobre a imagem com uma máscara escura e o
 *   ícone de olho.
 * - `image-preview`: a pré-visualização ampliada, com a barra de ações no topo
 *   e a imagem centralizada.
 * - `image-toolbar` e `image-action`: as cinco ações da barra (girar à
 *   esquerda, girar à direita, diminuir, ampliar, fechar), botões de 42px com
 *   estados Idle=Default/Hover e Focus=False/True.
 *
 * Cor, tipografia, raio e espaçamento vêm dos tokens da marca, nunca do Figma.
 */

const ESCALA_MINIMA = 0.5;
const ESCALA_MAXIMA = 3;
const PASSO_DE_ESCALA = 0.25;

/** Modal nativo: prisão de foco, Escape e devolução de foco sem reimplementar. */
function useDialogModal(aberto: boolean, onClose?: () => void) {
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
      evento.preventDefault();
      onClose?.();
    };

    elemento.addEventListener('cancel', aoCancelar);
    return () => elemento.removeEventListener('cancel', aoCancelar);
  }, [onClose]);

  return ref;
}

export type StatusImagem = 'carregando' | 'pronta' | 'falhou';

export interface ImageProps {
  /** Endereço da imagem. Trocar o valor reinicia o ciclo de carregamento. */
  src: string;
  /**
   * Descrição do conteúdo, sempre vinda dos dados: "Comprovante de despesa do
   * processo 2025/0481". Imagem puramente decorativa recebe `alt=""`, o que a
   * remove da árvore de acessibilidade em vez de anunciar ruído.
   */
  alt: string;
  /** Legenda visível abaixo da imagem, usada também no rótulo do gatilho. */
  legenda?: string;
  largura?: number | string;
  altura?: number | string;
  /** Habilita a pré-visualização ampliada com girar e ampliar. */
  preview?: boolean;
  /** Força o estado de carregando enquanto o endereço ainda não chegou. */
  carregando?: boolean;
  /** Recorte dentro da caixa. `contain` preserva o documento inteiro. */
  ajuste?: 'cover' | 'contain';
  aoAbrirPreview?: () => void;
}

export function Image({
  src,
  alt,
  legenda,
  largura,
  altura,
  preview = false,
  carregando = false,
  ajuste = 'cover',
  aoAbrirPreview,
}: ImageProps) {
  const [status, setStatus] = useState<StatusImagem>('carregando');
  const [previewAberta, setPreviewAberta] = useState(false);
  const gatilhoRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setStatus('carregando');
  }, [src]);

  const statusEfetivo: StatusImagem = carregando ? 'carregando' : status;

  // O gatilho precisa de nome próprio mesmo quando a imagem é decorativa.
  const nomeDaImagem = alt || legenda || '';
  const rotuloAmpliar = nomeDaImagem
    ? `Ampliar a imagem ${nomeDaImagem}`
    : 'Ampliar a imagem';

  const fecharPreview = useCallback(() => {
    setPreviewAberta(false);
    gatilhoRef.current?.focus();
  }, []);

  const imagem = (
    <img
      className={`citie-image__midia citie-image__midia--${ajuste}`}
      src={src}
      alt={alt}
      onLoad={() => setStatus('pronta')}
      onError={() => setStatus('falhou')}
      // O elemento fica montado durante o carregamento para disparar onLoad,
      // mas escondido atrás do skeleton para não piscar meia imagem.
      hidden={statusEfetivo !== 'pronta'}
    />
  );

  return (
    <figure className="citie-image" style={{ width: largura, height: altura }}>
      <div className="citie-image__quadro">
        {statusEfetivo === 'carregando' ? (
          <SkeletonRegion
            label={nomeDaImagem ? `Carregando imagem: ${nomeDaImagem}` : 'Carregando imagem'}
          >
            <Skeleton forma="card" width="100%" height="100%" />
          </SkeletonRegion>
        ) : null}

        {statusEfetivo === 'falhou' ? (
          <div className="citie-image__falha">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <path d="M3 16l5-5 4 4 3-3 6 6" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 4l16 16" strokeLinecap="round" />
            </svg>
            <p className="citie-image__falha-titulo">Não foi possível carregar a imagem</p>
            {nomeDaImagem ? (
              <p className="citie-image__falha-descricao">{nomeDaImagem}</p>
            ) : null}
          </div>
        ) : null}

        {statusEfetivo !== 'falhou' ? (
          preview ? (
            <button
              ref={gatilhoRef}
              type="button"
              className="citie-image__gatilho"
              aria-label={rotuloAmpliar}
              // Enquanto carrega, o botão só mantém a imagem montada para que
              // `onLoad` e `onError` disparem; ainda não há o que ampliar.
              disabled={statusEfetivo !== 'pronta'}
              onClick={() => {
                setPreviewAberta(true);
                aoAbrirPreview?.();
              }}
            >
              {imagem}
              {/* Máscara do estado Hover do Figma: reforço visual, o nome do
                  botão já carrega a informação. */}
              <span className="citie-image__mascara" aria-hidden="true">
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" strokeLinejoin="round" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </span>
            </button>
          ) : (
            imagem
          )
        ) : null}
      </div>

      {legenda ? <figcaption className="citie-image__legenda">{legenda}</figcaption> : null}

      {preview ? (
        <ImagePreview
          aberta={previewAberta}
          src={src}
          alt={alt}
          nome={nomeDaImagem}
          onClose={fecharPreview}
        />
      ) : null}
    </figure>
  );
}

export interface ImagePreviewProps {
  aberta: boolean;
  src: string;
  alt: string;
  /** Identifica a imagem no título do diálogo e nos rótulos das ações. */
  nome: string;
  onClose: () => void;
}

/** `image-preview` do Figma: barra de ações no topo e imagem centralizada. */
export function ImagePreview({ aberta, src, alt, nome, onClose }: ImagePreviewProps) {
  const ref = useDialogModal(aberta, onClose);
  const fecharRef = useRef<HTMLButtonElement>(null);
  const tituloId = useId();
  const [escala, setEscala] = useState(1);
  const [rotacao, setRotacao] = useState(0);

  useEffect(() => {
    if (!aberta) return;
    setEscala(1);
    setRotacao(0);
    // `showModal` foca a primeira ação da barra; o fechar é o destino esperado.
    fecharRef.current?.focus();
  }, [aberta]);

  const girar = (graus: number) => setRotacao((atual) => (atual + graus + 360) % 360);
  const ajustarEscala = (delta: number) =>
    setEscala((atual) =>
      Math.min(ESCALA_MAXIMA, Math.max(ESCALA_MINIMA, Number((atual + delta).toFixed(2)))),
    );

  const situacao = `Zoom ${Math.round(escala * 100)}%, ${
    rotacao === 0 ? 'sem rotação' : `girada ${rotacao} graus`
  }`;

  const sufixo = nome ? ` de ${nome}` : '';

  return (
    <dialog ref={ref} className="citie-image-preview" aria-labelledby={tituloId}>
      <h2 className="citie-visualmente-oculto" id={tituloId}>
        {nome ? `Pré-visualização de ${nome}` : 'Pré-visualização da imagem'}
      </h2>

      <div className="citie-image-preview__barra" role="toolbar" aria-label={`Ações da imagem${sufixo}`}>
        <button
          type="button"
          className="citie-image-preview__acao"
          aria-label="Girar à esquerda"
          onClick={() => girar(-90)}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M3 8h10a5 5 0 0 1 0 10H8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M7 4L3 8l4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          className="citie-image-preview__acao"
          aria-label="Girar à direita"
          onClick={() => girar(90)}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 8H11a5 5 0 0 0 0 10h5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <button
          type="button"
          className="citie-image-preview__acao"
          aria-label="Diminuir o zoom"
          disabled={escala <= ESCALA_MINIMA}
          onClick={() => ajustarEscala(-PASSO_DE_ESCALA)}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M8 11h6M20 20l-4.5-4.5" strokeLinecap="round" />
          </svg>
        </button>

        <button
          type="button"
          className="citie-image-preview__acao"
          // Nome distinto do gatilho ("Ampliar a imagem X") para que os dois
          // controles não fiquem homônimos na lista do leitor de tela.
          aria-label="Aumentar o zoom"
          disabled={escala >= ESCALA_MAXIMA}
          onClick={() => ajustarEscala(PASSO_DE_ESCALA)}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M8 11h6M11 8v6M20 20l-4.5-4.5" strokeLinecap="round" />
          </svg>
        </button>

        <button
          ref={fecharRef}
          type="button"
          className="citie-image-preview__acao"
          aria-label={`Fechar a pré-visualização${sufixo}`}
          onClick={onClose}
        >
          <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="citie-image-preview__palco">
        <img
          className="citie-image-preview__midia"
          src={src}
          alt={alt}
          style={{ transform: `rotate(${rotacao}deg) scale(${escala})` }}
        />
      </div>

      {/* Zoom e rotação são mudanças puramente visuais: sem este texto, quem usa
          leitor de tela não recebe retorno nenhum das ações da barra. */}
      <p className="citie-image-preview__situacao" role="status">
        {situacao}
      </p>
    </dialog>
  );
}

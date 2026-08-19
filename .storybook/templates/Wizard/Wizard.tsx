import { useEffect, useId, useRef, type ReactNode, type Ref } from 'react';
import { Button, ProgressBar, Stepper, type EstadoDaEtapa } from '../../../src';
import './Wizard.css';

/**
 * Template de tela de wizard: conduz uma tarefa longa por etapas validáveis
 * isoladamente. Estrutura pura, sem conteúdo de domínio: rótulos, campos,
 * resumo e overlays chegam por props e slots.
 *
 * Anatomia (`09-templates/tela-wizard.md`), na ordem fixa da spec:
 * 1. indicador de progresso; 2. corpo da etapa atual; 3. navegação fixa;
 * 4. resumo final antes da confirmação.
 */

export interface EtapaDoWizard {
  id: string;
  /** Nome curto da etapa, o único dado de etapa futura que pode aparecer. */
  rotulo: string;
  /** Resumo da etapa. O template o esconde enquanto a etapa é futura. */
  sublabel?: string;
  estado: EstadoDaEtapa;
}

/** Barra para fluxo longo e linear; stepper vertical para fluxo com ramificação. */
export type IndicadorDoWizard = 'barra' | 'stepper';

export interface WizardProps {
  /** Nome do fluxo inteiro, no `h1` da tela. */
  titulo: string;
  /** Uma linha sobre o que o fluxo produz ao terminar. */
  descricao?: string;
  indicador?: IndicadorDoWizard;
  etapas: EtapaDoWizard[];
  etapaAtualId: string;
  /** Nome acessível do indicador ("Etapas da solicitação"). */
  rotuloIndicador: string;
  /** Nome da etapa atual, no `h2` do corpo. */
  etapaTitulo: string;
  /** O que a etapa decide, em uma frase. */
  etapaDescricao?: string;
  /** Bloqueio ou aviso da etapa, acima dos campos (tipicamente um `Message`). */
  aviso?: ReactNode;
  /** Corpo da etapa atual: uma decisão ou um grupo coeso de campos. */
  children?: ReactNode;
  /**
   * Resumo final. Quando presente, ocupa o corpo no lugar de `children`,
   * porque a última etapa do fluxo é sempre a revisão antes da confirmação.
   */
  resumo?: ReactNode;
  rotuloVoltar?: string;
  /** Verbo da ação: "Avançar" nas etapas, "Enviar solicitação" no resumo. */
  rotuloAvancar: string;
  /** Rótulo no gerúndio enquanto a confirmação final está em curso. */
  rotuloEnviando?: string;
  onVoltar?: () => void;
  onAvancar?: () => void;
  /** Bloqueia o avanço enquanto a etapa atual tem erro pendente. */
  avancarDesabilitado?: boolean;
  /** Confirmação em curso: ação primária em carregamento, demais desabilitadas. */
  enviando?: boolean;
  /** Ações secundárias do rodapé: sair, salvar rascunho, pular etapa opcional. */
  acoesRodape?: ReactNode;
  onSelecionarEtapa?: (id: string) => void;
  /** Sobreposições da tela: ConfirmDialog de descarte, pilha de toasts. */
  overlays?: ReactNode;
}

export function Wizard({
  titulo,
  descricao,
  indicador = 'barra',
  etapas,
  etapaAtualId,
  rotuloIndicador,
  etapaTitulo,
  etapaDescricao,
  aviso,
  children,
  resumo,
  rotuloVoltar = 'Voltar',
  rotuloAvancar,
  rotuloEnviando,
  onVoltar,
  onAvancar,
  avancarDesabilitado = false,
  enviando = false,
  acoesRodape,
  onSelecionarEtapa,
  overlays,
}: WizardProps) {
  const tituloId = useId();
  const etapaTituloId = useId();
  const corpoRef = useRef<HTMLDivElement>(null);
  const etapaAnterior = useRef(etapaAtualId);

  useEffect(() => {
    // Trocou de etapa: o foco vai para o início do corpo novo. Sem isso, quem
    // navega por teclado continua no rodapé, lendo a etapa anterior.
    if (etapaAnterior.current === etapaAtualId) return;
    etapaAnterior.current = etapaAtualId;
    corpoRef.current?.focus();
  }, [etapaAtualId]);

  const indice = Math.max(
    etapas.findIndex((etapa) => etapa.id === etapaAtualId),
    0,
  );
  const total = etapas.length;
  const percentual = Math.round(((indice + 1) / total) * 100);

  // Regra da spec: etapa futura só aparece como rótulo colapsado. O template
  // apaga o sublabel das pendentes para que a página não consiga violá-la.
  const etapasDoIndicador = etapas.map((etapa) =>
    etapa.estado === 'pendente' ? { ...etapa, sublabel: undefined } : etapa,
  );

  return (
    <main className="citie-wizard" aria-labelledby={tituloId}>
      <header className="citie-wizard__cabecalho">
        <h1 className="citie-wizard__titulo" id={tituloId}>
          {titulo}
        </h1>
        {descricao ? <p className="citie-wizard__descricao">{descricao}</p> : null}
      </header>

      <div className={`citie-wizard__conteudo citie-wizard__conteudo--${indicador}`}>
        {/* 1. Indicador de progresso */}
        <div className="citie-wizard__indicador">
          {indicador === 'barra' ? (
            <ProgressBar
              rotulo={rotuloIndicador}
              valor={percentual}
              // Anunciada em região polite: mantém o indicador em dia com o corpo.
              mensagem={etapaTitulo}
              etapa={{ atual: indice + 1, total }}
            />
          ) : (
            <nav className="citie-wizard__stepper" aria-label={rotuloIndicador}>
              <Stepper
                label={rotuloIndicador}
                etapas={etapasDoIndicador}
                orientacao="vertical"
                onSelecionar={onSelecionarEtapa}
              />
            </nav>
          )}
        </div>

        {/* 2. Corpo da etapa atual (ou 4. resumo final, na última etapa) */}
        <div
          className="citie-wizard__corpo"
          ref={corpoRef}
          tabIndex={-1}
          role="group"
          aria-labelledby={etapaTituloId}
        >
          <h2 className="citie-wizard__etapa-titulo" id={etapaTituloId}>
            {etapaTitulo}
          </h2>
          {etapaDescricao ? (
            <p className="citie-wizard__etapa-descricao">{etapaDescricao}</p>
          ) : null}

          {aviso ? <div className="citie-wizard__aviso">{aviso}</div> : null}

          {resumo ?? children}
        </div>
      </div>

      {/* 3. Navegação fixa */}
      <footer className="citie-wizard__navegacao">
        <div className="citie-wizard__navegacao-secundaria">{acoesRodape}</div>
        <div className="citie-wizard__navegacao-principal">
          <Button
            variant="secondary"
            onClick={onVoltar}
            // Voltar preserva o preenchido; na primeira etapa não há para onde ir.
            disabled={indice === 0 || enviando}
          >
            {rotuloVoltar}
          </Button>
          <Button
            variant="primary"
            onClick={onAvancar}
            disabled={avancarDesabilitado}
            loading={enviando}
            loadingLabel={rotuloEnviando}
          >
            {rotuloAvancar}
          </Button>
        </div>
      </footer>

      {overlays}
    </main>
  );
}

export interface WizardCamposProps {
  children: ReactNode;
  /** Uma coluna para decisão única, duas para grupo coeso de campos curtos. */
  colunas?: 1 | 2;
  ref?: Ref<HTMLDivElement>;
}

/** Grade dos campos da etapa. Layout do corpo é responsabilidade do template. */
export function WizardCampos({ children, colunas = 2, ref }: WizardCamposProps) {
  return (
    <div ref={ref} className={`citie-wizard__campos citie-wizard__campos--${colunas}`}>
      {children}
    </div>
  );
}

export interface WizardResumoProps {
  children: ReactNode;
}

/** Pilha dos blocos de revisão do resumo final, um por etapa concluída. */
export function WizardResumo({ children }: WizardResumoProps) {
  return <div className="citie-wizard__resumo">{children}</div>;
}

export interface WizardItensProps {
  children: ReactNode;
}

/** Lista de definição dos dados revisados de uma etapa, dentro de um `Card`. */
export function WizardItens({ children }: WizardItensProps) {
  return <dl className="citie-wizard__itens">{children}</dl>;
}

export interface WizardItemProps {
  /** Nome do dado revisado. */
  rotulo: string;
  /** Valor decidido na etapa, já formatado para leitura. */
  valor: ReactNode;
}

/** Par rótulo/valor do resumo. */
export function WizardItem({ rotulo, valor }: WizardItemProps) {
  return (
    <div className="citie-wizard__item">
      <dt className="citie-wizard__item-rotulo">{rotulo}</dt>
      <dd className="citie-wizard__item-valor">{valor}</dd>
    </div>
  );
}

import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Breadcrumb, Button, Sidebar, type NivelDaTrilha, type SecaoDoMenu } from '../../../src';
import './AppShell.css';

/* ------------------------------------------------------------------ */
/* Ícones do próprio shell (moldura, não conteúdo de domínio)          */
/* ------------------------------------------------------------------ */

const IconeMenu = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
  </svg>
);

const IconeColapsar = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 5v14" strokeLinecap="round" />
    <path d="M20 12H9m4-4-4 4 4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconeExpandir = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 5v14" strokeLinecap="round" />
    <path d="M9 12h11m-4-4 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconeFechar = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* API de slots                                                        */
/* ------------------------------------------------------------------ */

export interface AppShellProps {
  /* ---------- Barra superior ---------- */

  /**
   * Nome do módulo atual. Reflete exatamente o item ativo do menu lateral
   * (consistência absoluta, spec de navegação). Renderizado como texto, nunca
   * como heading: a hierarquia de heading pertence ao conteúdo da página.
   */
  moduloAtual: string;
  /**
   * Slot central da barra: a busca global. Preencha com `Search` do sistema,
   * porque só a página conhece o escopo ("Buscar processos, servidores...").
   */
  busca?: ReactNode;
  /**
   * Slot do fim da barra, antes do perfil: notificações, alternador de tema e
   * outras ações globais. Preencha com `Button` e `Badge`.
   */
  acoesDaBarra?: ReactNode;
  /** Slot do fim da barra: avatar e menu de perfil. Preencha com `Avatar`. */
  perfil?: ReactNode;
  /**
   * Fundo da barra superior, que decide qual logotipo oficial entra:
   * `claro` usa LogoHorizontal3.svg, `escuro` usa LogoHorizontal2.svg.
   */
  fundoDaBarra?: 'claro' | 'escuro';
  /** Barra compacta de 48px, para telas que precisam de máxima área de conteúdo. */
  compacto?: boolean;

  /* ---------- Menu lateral ---------- */

  /** Seções do menu principal. Item sem permissão não entra nesta lista. */
  secoes: SecaoDoMenu[];
  /** Identificador do item ativo do menu. */
  itemAtivo: string;
  /** Slot do rodapé do menu lateral: ações de perfil ou versão do sistema. */
  rodapeDoMenu?: ReactNode;
  /**
   * Estado inicial do colapso. O colapso em si é sempre ação explícita do
   * usuário pelo botão da barra, nunca reação automática à largura da tela.
   */
  colapsadaInicial?: boolean;

  /* ---------- Trilha de navegação ---------- */

  /** Níveis da trilha. Omitido, a região não é renderizada. */
  trilha?: NivelDaTrilha[];
  /**
   * Slot alinhado à direita da trilha: ações de escopo da tela inteira
   * (exportar, nova solicitação). Preencha com `Button` ou `Menubar`.
   */
  acoesDaTrilha?: ReactNode;

  /* ---------- Conteúdo ---------- */

  /** Conteúdo da tela. Vai dentro do único `main` do documento. */
  children: ReactNode;

  /* ---------- Painel lateral direito ---------- */

  /** Slot opcional do painel lateral direito: detalhe, ajuda ou histórico. */
  painelLateral?: ReactNode;
  /** Nome acessível do painel lateral, obrigatório quando há painel. */
  rotuloDoPainelLateral?: string;
}

/* ------------------------------------------------------------------ */
/* Shell de aplicação                                                  */
/* ------------------------------------------------------------------ */

/**
 * Moldura persistente das telas autenticadas: barra superior, menu lateral,
 * trilha, conteúdo e painel opcional. Anatomia de
 * `03-components/navigation-sidebar-header.md` v2.0.0.
 *
 * O menu lateral é o componente `Sidebar` do sistema, que já traz skip link,
 * `aria-current` no item ativo, variante colapsada e a regra de item sem
 * permissão ausente do DOM. Nada disso é reimplementado aqui.
 */
export function AppShell({
  moduloAtual,
  busca,
  acoesDaBarra,
  perfil,
  fundoDaBarra = 'claro',
  compacto = false,
  secoes,
  itemAtivo,
  rodapeDoMenu,
  colapsadaInicial = false,
  trilha,
  acoesDaTrilha,
  children,
  painelLateral,
  rotuloDoPainelLateral,
}: AppShellProps) {
  // Colapso e drawer são estados distintos: o primeiro é preferência de
  // trabalho no desktop, o segundo é a única forma de ver o menu abaixo de
  // 768px. Nenhum dos dois muda sozinho por causa da largura da viewport.
  const [colapsada, setColapsada] = useState(colapsadaInicial);
  const [drawerAberto, setDrawerAberto] = useState(false);

  const idDaLateral = useId();
  const gatilhoDoDrawer = useRef<HTMLButtonElement>(null);
  const lateral = useRef<HTMLDivElement>(null);

  // Ao abrir, o foco entra no drawer; ao fechar, volta ao botão que o abriu.
  useEffect(() => {
    if (!drawerAberto) return;

    const primeiro = lateral.current?.querySelector<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    primeiro?.focus();
  }, [drawerAberto]);

  function fecharDrawer() {
    setDrawerAberto(false);
    gatilhoDoDrawer.current?.focus();
  }

  // Enquanto o drawer está aberto o foco fica preso nele, e Escape fecha.
  function aoTeclarNoDrawer(evento: KeyboardEvent<HTMLDivElement>) {
    if (!drawerAberto) return;

    if (evento.key === 'Escape') {
      evento.stopPropagation();
      fecharDrawer();
      return;
    }

    if (evento.key !== 'Tab') return;

    const focaveis = Array.from(
      lateral.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ?? [],
    );
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
  }

  const logotipo =
    fundoDaBarra === 'escuro' ? '/marca/LogoHorizontal2.svg' : '/marca/LogoHorizontal3.svg';

  return (
    <div
      className={`citie-app-shell${compacto ? ' citie-app-shell--compacto' : ''}`}
      data-fundo-da-barra={fundoDaBarra}
    >
      {/* ---------- Barra superior ---------- */}
      <header className="citie-app-shell__barra">
        <div className="citie-app-shell__barra-inicio">
          {/* Abaixo de 768px o menu vira drawer, acionado só por este botão. */}
          <Button
            ref={gatilhoDoDrawer}
            className="citie-app-shell__so-mobile"
            variant="text"
            iconOnly
            icon={IconeMenu}
            aria-label="Abrir menu principal"
            aria-expanded={drawerAberto}
            aria-controls={idDaLateral}
            touchTarget="comfortable"
            onClick={() => setDrawerAberto(true)}
          />

          {/* No desktop o mesmo canto controla o colapso, sempre explícito. */}
          <Button
            className="citie-app-shell__so-desktop"
            variant="text"
            iconOnly
            icon={colapsada ? IconeExpandir : IconeColapsar}
            aria-label={colapsada ? 'Expandir menu principal' : 'Colapsar menu principal'}
            aria-expanded={!colapsada}
            aria-controls={idDaLateral}
            onClick={() => setColapsada((atual) => !atual)}
          />

          <img className="citie-app-shell__marca" src={logotipo} alt="Citiesoft" />

          <span className="citie-app-shell__divisor" aria-hidden="true" />

          <span className="citie-app-shell__modulo">{moduloAtual}</span>
        </div>

        {busca ? <div className="citie-app-shell__barra-centro">{busca}</div> : null}

        <div className="citie-app-shell__barra-fim">
          {acoesDaBarra ? (
            <div className="citie-app-shell__barra-acoes">{acoesDaBarra}</div>
          ) : null}
          {perfil ? <div className="citie-app-shell__barra-perfil">{perfil}</div> : null}
        </div>
      </header>

      <div className="citie-app-shell__corpo">
        {/* ---------- Menu lateral ---------- */}
        {/* Uma única instância no DOM: coluna fixa no desktop, off-canvas no
            celular. Duplicar a Sidebar duplicaria skip link e landmark. */}
        <div
          id={idDaLateral}
          ref={lateral}
          className="citie-app-shell__lateral"
          data-aberta={drawerAberto ? 'sim' : 'nao'}
          onKeyDown={aoTeclarNoDrawer}
        >
          <Sidebar secoes={secoes} ativo={itemAtivo} colapsada={colapsada} />

          {/* Fechar só existe no drawer; no desktop o CSS o remove. */}
          <div className="citie-app-shell__lateral-fechar citie-app-shell__so-mobile">
            <Button
              variant="text"
              iconOnly
              icon={IconeFechar}
              aria-label="Fechar menu principal"
              touchTarget="comfortable"
              onClick={fecharDrawer}
            />
          </div>

          {rodapeDoMenu ? (
            <div className="citie-app-shell__lateral-rodape">{rodapeDoMenu}</div>
          ) : null}
        </div>

        {drawerAberto ? (
          <div
            className="citie-app-shell__cortina"
            role="presentation"
            onClick={fecharDrawer}
          />
        ) : null}

        <div className="citie-app-shell__area">
          {/* ---------- Trilha de navegação ---------- */}
          {trilha || acoesDaTrilha ? (
            <div className="citie-app-shell__trilha">
              {trilha ? <Breadcrumb niveis={trilha} /> : null}
              {acoesDaTrilha ? (
                <div className="citie-app-shell__trilha-acoes">{acoesDaTrilha}</div>
              ) : null}
            </div>
          ) : null}

          <div
            className={`citie-app-shell__palco${
              painelLateral ? ' citie-app-shell__palco--com-painel' : ''
            }`}
          >
            {/* ---------- Conteúdo principal ---------- */}
            {/* `conteudo` é o alvo do skip link que a Sidebar já publica. */}
            <main id="conteudo" className="citie-app-shell__conteudo" tabIndex={-1}>
              {children}
            </main>

            {/* ---------- Painel lateral direito ---------- */}
            {painelLateral ? (
              <aside className="citie-app-shell__painel" aria-label={rotuloDoPainelLateral}>
                {painelLateral}
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

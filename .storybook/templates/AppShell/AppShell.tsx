import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Breadcrumb, Button, Link, Sidebar, type NivelDaTrilha, type SecaoDoMenu } from '../../../src';
import './AppShell.css';

/* ------------------------------------------------------------------ */
/* Ícones do próprio shell (moldura, não conteúdo de domínio)          */
/* ------------------------------------------------------------------ */

const IconeMenu = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
  </svg>
);

/** Painel lateral com a divisória, o ícone de recolher do Sismental. */
const IconeColapsar = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
    <path d="m15 10-2 2 2 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconeExpandir = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M9 4v16" />
    <path d="m13 10 2 2-2 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconeFechar = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
  </svg>
);

const IconeSair = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" strokeLinecap="round" />
    <path d="M14 8l4 4-4 4M18 12H9" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Chevron duplo do seletor de contexto: o rótulo "troca" sem ser um select. */
const IconeChevronDuplo = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m8 9 4-4 4 4M8 15l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Peças do shell                                                      */
/* ------------------------------------------------------------------ */

export interface BotaoDaBarraProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Ação nomeada: "Buscar no sistema", "Notificações: 3 não lidas". */
  'aria-label': string;
  icone: ReactNode;
}

/**
 * Botão de ícone da barra superior: 30px (`--citie-botao-fechar`, a mesma
 * medida do fechar de diálogo e dos botões da barra do Sismental), raio
 * `md`, borda 1px. O `Button` da casa desce a 24 e sobe a 32; 30 é a medida
 * da barra, então a peça vive no shell.
 */
export function BotaoDaBarra({ icone, className, ...rest }: BotaoDaBarraProps) {
  return (
    <button type="button" className={`citie-app-shell__botao${className ? ` ${className}` : ''}`} {...rest}>
      <span aria-hidden="true">{icone}</span>
    </button>
  );
}

export interface SeletorDeContextoProps {
  /** Escopo ativo da sessão: "Unidade de Saúde", "Secretaria", "Cliente". */
  rotulo: string;
  /** Ícone de 16 desenhado no traço do sistema. */
  icone: ReactNode;
  /** Nome acessível da ação de trocar: "Trocar unidade". */
  acao: string;
  onClick?: () => void;
}

/**
 * Cartão de contexto do topo da navegação fixa, medido no Sismental: ícone
 * em caixa de 28 com tinta de marca sobre accent, rótulo 14 Medium e chevron
 * duplo à direita. É um botão porque troca o escopo da sessão inteira.
 */
export function SeletorDeContexto({ rotulo, icone, acao, onClick }: SeletorDeContextoProps) {
  return (
    <button type="button" className="citie-app-shell__contexto" aria-label={`${acao}: ${rotulo}`} onClick={onClick}>
      <span className="citie-app-shell__contexto-icone" aria-hidden="true">
        {icone}
      </span>
      <span className="citie-app-shell__contexto-rotulo">{rotulo}</span>
      <span className="citie-app-shell__contexto-chevron" aria-hidden="true">
        {IconeChevronDuplo}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* API de slots                                                        */
/* ------------------------------------------------------------------ */

export interface AppShellProps {
  /* ---------- Barra superior ---------- */

  /**
   * Nome do módulo atual. Reflete exatamente o item ativo do menu lateral
   * (consistência absoluta, spec de navegação). Aparece na barra quando não
   * há trilha, e no celular no lugar dela. Renderizado como texto, nunca como
   * heading: a hierarquia de heading pertence ao conteúdo da página.
   */
  moduloAtual: string;
  /**
   * Trilha de navegação, na barra superior, com o ícone de casa no primeiro
   * nível (Breadcrumb). Omitida, a barra mostra `moduloAtual`.
   */
  trilha?: NivelDaTrilha[];
  /**
   * Slot central da barra, para a busca global expandida (`Search`). O shell
   * do Sismental prefere a busca como botão de ícone em `acoesDaBarra`; este
   * slot fica para telas cuja tarefa principal é buscar.
   */
  busca?: ReactNode;
  /**
   * Slot do fim da barra, antes do divisor e do perfil: busca e notificações
   * como `BotaoDaBarra` de 30px, tema e outras ações globais.
   */
  acoesDaBarra?: ReactNode;
  /** Slot do fim da barra: avatar de 32 e menu de perfil. Preencha com `Avatar`. */
  perfil?: ReactNode;
  /**
   * Fundo da barra superior, que decide qual logotipo oficial entra:
   * `claro` usa LogoHorizontal3.svg, `escuro` usa LogoHorizontal2.svg.
   */
  fundoDaBarra?: 'claro' | 'escuro';

  /* ---------- Menu lateral ---------- */

  /** Seções do menu principal. Item sem permissão não entra nesta lista. */
  secoes: SecaoDoMenu[];
  /** Identificador do item ativo do menu. */
  itemAtivo: string;
  /** Cartão de contexto no topo da navegação (`SeletorDeContexto`). */
  contexto?: ReactNode;
  /**
   * Ação de encerrar a sessão, ancorada no rodapé da navegação, em vermelho,
   * como no Sismental. Omitida, o rodapé fica com `rodapeDoMenu` ou vazio.
   */
  onSair?: () => void;
  /** Slot livre do rodapé do menu lateral: versão do sistema, por exemplo. */
  rodapeDoMenu?: ReactNode;
  /**
   * Estado inicial do colapso. O colapso em si é sempre ação explícita do
   * usuário pelo botão da barra, nunca reação automática à largura da tela.
   */
  colapsadaInicial?: boolean;

  /* ---------- Conteúdo ---------- */

  /**
   * Ações de escopo da tela inteira (exportar, competência), numa linha acima
   * do conteúdo. Preencha com `Button` ou `Menubar`.
   */
  acoesDaTrilha?: ReactNode;
  /**
   * `direto`: o conteúdo fica sobre o fundo cinza da página (listagem simples).
   * `cartao`: o conteúdo vive num cartão branco de raio 16 a 8px do fundo
   * (formulário e administração), como no Sismental.
   */
  moldura?: 'direto' | 'cartao';
  /** Conteúdo da tela. Vai dentro do único `main` do documento. */
  children: ReactNode;
  /** Rodapé "Desenvolvido por Citiesoft @ 2026" com a marca em link. Ligado por padrão. */
  rodape?: boolean;

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
 * Moldura persistente das telas autenticadas, medida no Sismental: barra
 * superior de 52, navegação fixa de 257 com seletor de contexto e "Sair" no
 * rodapé, trilha na barra, conteúdo direto ou em cartão de raio 16, rodapé
 * com a marca. Anatomia em `docs/figma-ui-kit.md`, "Composição de tela".
 *
 * O menu lateral é o `Sidebar` do sistema na variante `fixa` (Lote 4), que já
 * traz skip link, `aria-current` no item ativo, colapso e a regra de item sem
 * permissão ausente do DOM. Nada disso é reimplementado aqui.
 */
export function AppShell({
  moduloAtual,
  trilha,
  busca,
  acoesDaBarra,
  perfil,
  fundoDaBarra = 'claro',
  secoes,
  itemAtivo,
  contexto,
  onSair,
  rodapeDoMenu,
  colapsadaInicial = false,
  acoesDaTrilha,
  moldura = 'direto',
  children,
  rodape = true,
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

  const rodapeDaNavegacao =
    onSair || rodapeDoMenu ? (
      <>
        {onSair ? (
          <button type="button" className="citie-app-shell__sair" onClick={onSair}>
            <span aria-hidden="true">{IconeSair}</span>
            {colapsada ? <span className="citie-visualmente-oculto">Sair</span> : 'Sair'}
          </button>
        ) : null}
        {rodapeDoMenu && !colapsada ? (
          <div className="citie-app-shell__lateral-rodape">{rodapeDoMenu}</div>
        ) : null}
      </>
    ) : undefined;

  return (
    <div
      className={`citie-app-shell citie-app-shell--${moldura}`}
      data-fundo-da-barra={fundoDaBarra}
    >
      {/* ---------- Barra superior ---------- */}
      <header className="citie-app-shell__barra">
        <div className="citie-app-shell__barra-inicio">
          <img className="citie-app-shell__marca" src={logotipo} alt="Citiesoft" />

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
            className="citie-app-shell__so-desktop citie-app-shell__recolher"
            variant="text"
            iconOnly
            size="small"
            icon={colapsada ? IconeExpandir : IconeColapsar}
            aria-label={colapsada ? 'Expandir menu principal' : 'Colapsar menu principal'}
            aria-expanded={!colapsada}
            aria-controls={idDaLateral}
            onClick={() => setColapsada((atual) => !atual)}
          />
        </div>

        <div className="citie-app-shell__barra-centro">
          {trilha ? (
            <div className="citie-app-shell__trilha">
              <Breadcrumb niveis={trilha} />
            </div>
          ) : null}
          {/* No celular a trilha inteira não cabe: fica o nome do módulo. */}
          <span className={`citie-app-shell__modulo${trilha ? ' citie-app-shell__so-mobile' : ''}`}>
            {moduloAtual}
          </span>
          {busca ? <div className="citie-app-shell__busca">{busca}</div> : null}
        </div>

        <div className="citie-app-shell__barra-fim">
          {acoesDaBarra ? (
            <div className="citie-app-shell__barra-acoes">{acoesDaBarra}</div>
          ) : null}
          {acoesDaBarra && perfil ? (
            <span className="citie-app-shell__divisor" aria-hidden="true" />
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

          <Sidebar
            variante="fixa"
            secoes={secoes}
            ativo={itemAtivo}
            colapsada={colapsada}
            cabecalho={colapsada ? undefined : contexto}
            rodape={rodapeDaNavegacao}
          />
        </div>

        {drawerAberto ? (
          <div
            className="citie-app-shell__cortina"
            role="presentation"
            onClick={fecharDrawer}
          />
        ) : null}

        <div className="citie-app-shell__area">
          {acoesDaTrilha ? (
            <div className="citie-app-shell__acoes-da-tela">{acoesDaTrilha}</div>
          ) : null}

          <div
            className={`citie-app-shell__palco${
              painelLateral ? ' citie-app-shell__palco--com-painel' : ''
            }`}
          >
            {/* ---------- Conteúdo principal ---------- */}
            {/* `conteudo` é o alvo do skip link que a Sidebar já publica. A
                moldura em cartão é o próprio `main`: raio 16, borda, 8px do fundo. */}
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

          {rodape ? (
            <footer className="citie-app-shell__rodape">
              Desenvolvido por{' '}
              <Link href="https://citiesoft.com.br" papel="padrao" novaAba>
                Citiesoft
              </Link>{' '}
              @ 2026
            </footer>
          ) : null}
        </div>
      </div>
    </div>
  );
}

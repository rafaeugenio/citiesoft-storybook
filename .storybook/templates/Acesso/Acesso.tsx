import { useId, type ReactNode } from 'react';
import { Link } from '../../../src';
import './Acesso.css';

/**
 * Template das telas de acesso (entrar, criar conta, recuperar senha,
 * verificar e-mail, criar nova senha), medido no fluxo de acesso do Sismental
 * (`docs/figma-ui-kit.md`, "Acesso"), na cor da Citiesoft.
 *
 * Cartão dividido a 10px da tela (`--citie-margem-do-acesso`), raio 16:
 * painel branco à esquerda com a marca no topo esquerdo e a contraparte ("Não
 * tem uma conta? Cadastre-se") no topo direito; no centro, ícone em círculo
 * com anel de marca, título 24, subtítulo, campos com ícone à esquerda e a
 * ação primária de largura total; rodapé Citiesoft. Painel de marca à direita
 * em azul Citiesoft, 38% da largura, que some abaixo de 900px.
 *
 * O template só conhece regiões. Os campos, a validação e o envio chegam por
 * slot: quem sabe o que é uma senha válida é a página.
 */
export interface AcessoProps {
  /** Ícone de 20 desenhado no traço do sistema, dentro do círculo com anel de marca. */
  icone: ReactNode;
  /** Nome da tarefa: "Entrar na sua conta", "Crie uma nova conta". Único `h1`. */
  titulo: string;
  /** Uma linha de contexto: o que fazer aqui, ou para onde o código foi. */
  subtitulo?: ReactNode;
  /**
   * Pergunta e ação do topo direito: "Não tem uma conta?" + botão "Cadastre-se".
   * Omitida, o topo fica só com a marca.
   */
  contraparte?: { pergunta: string; acao: ReactNode };
  /** Campos do formulário (`Input` com `addonStart`, `InputOtp`). */
  children: ReactNode;
  /** Ação primária, de largura total ("Entrar no sistema"). */
  acao: ReactNode;
  /** Ação secundária abaixo da primária: "Reenviar código", "Voltar ao login". */
  secundaria?: ReactNode;
  /** Chamado ao enviar o formulário (Enter em qualquer campo ou clique na ação). */
  onEnviar?: () => void;
  /**
   * Conteúdo do painel de marca. Vazio por padrão: o painel é a cor da casa,
   * sem claim inventado. Entra aqui uma marca institucional ou uma foto real.
   */
  painelDeMarca?: ReactNode;
  /**
   * Links jurídicos do rodapé (termos de uso, política de privacidade). O
   * template dá o lugar; o texto aprovado é insumo da página.
   */
  rodapeLegal?: ReactNode;
}

export function Acesso({
  icone,
  titulo,
  subtitulo,
  contraparte,
  children,
  acao,
  secundaria,
  onEnviar,
  painelDeMarca,
  rodapeLegal,
}: AcessoProps) {
  const tituloId = useId();

  return (
    <div className="citie-tpl-acesso">
      <div className="citie-tpl-acesso__cartao">
        <main className="citie-tpl-acesso__painel" aria-labelledby={tituloId}>
          <header className="citie-tpl-acesso__topo">
            <img className="citie-tpl-acesso__marca" src="/marca/LogoHorizontal3.svg" alt="Citiesoft" />
            {contraparte ? (
              <p className="citie-tpl-acesso__contraparte">
                <span>{contraparte.pergunta}</span>
                {contraparte.acao}
              </p>
            ) : null}
          </header>

          <div className="citie-tpl-acesso__centro">
            <span className="citie-tpl-acesso__icone" aria-hidden="true">
              {icone}
            </span>
            <h1 className="citie-tpl-acesso__titulo" id={tituloId}>
              {titulo}
            </h1>
            {subtitulo ? <p className="citie-tpl-acesso__subtitulo">{subtitulo}</p> : null}

            <form
              className="citie-tpl-acesso__formulario"
              noValidate
              onSubmit={(evento) => {
                evento.preventDefault();
                onEnviar?.();
              }}
            >
              <div className="citie-tpl-acesso__campos">{children}</div>
              <div className="citie-tpl-acesso__acao">{acao}</div>
              {secundaria ? <div className="citie-tpl-acesso__secundaria">{secundaria}</div> : null}
            </form>
          </div>

          <footer className="citie-tpl-acesso__rodape">
            <p className="citie-tpl-acesso__creditos">
              Desenvolvido por{' '}
              <Link href="https://citiesoft.com.br" papel="padrao" novaAba>
                Citiesoft
              </Link>{' '}
              @ 2026
            </p>
            {rodapeLegal ? <p className="citie-tpl-acesso__legal">{rodapeLegal}</p> : null}
          </footer>
        </main>

        <aside className="citie-tpl-acesso__marca-painel" aria-hidden={painelDeMarca ? undefined : true}>
          {painelDeMarca}
        </aside>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { LoginSimples, type LoginIdentifierType, type LoginLayout, type LoginSimplesValues } from "@/components/application/login-simples/login-simples";
import { AvisoFormulario } from "./campos";
import {
  CREDENCIAIS_EXEMPLO,
  ERRO_CREDENCIAL,
  ERRO_CREDENCIAL_CPF,
  RODAPE_AUTENTICACAO,
} from "./dados/autenticacao";

export interface LoginTelaProps {
  /** Altura fixa de janela (previews). */
  contained?: boolean;
  layout?: LoginLayout;
  identifierType?: LoginIdentifierType;
  /** Começa com o aviso de credencial incorreta. */
  initialError?: boolean;
  /** Começa com o botão em carregamento. */
  initialLoading?: boolean;
  onForgot?: () => void;
}

/**
 * Tela de login. Aceita a senha de exemplo; qualquer outra gera o erro de
 * credencial, que nunca aponta qual campo está incorreto.
 */
export function LoginTela({
  contained = false,
  layout = "card",
  identifierType = "email",
  initialError = false,
  initialLoading = false,
  onForgot,
}: LoginTelaProps) {
  const mensagemErro = identifierType === "cpf" ? ERRO_CREDENCIAL_CPF : ERRO_CREDENCIAL;
  const [error, setError] = useState<string | undefined>(initialError ? mensagemErro : undefined);
  const [loading, setLoading] = useState(initialLoading);
  const [ok, setOk] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const alvo = raiz.current?.querySelector<HTMLElement>("input[name=identifier]");
    alvo?.focus({ preventScroll: true });
    return () => clearTimeout(timer.current);
  }, []);

  const enviar = (valores: LoginSimplesValues) => {
    setError(undefined);
    setOk(false);
    setLoading(true);
    timer.current = setTimeout(() => {
      setLoading(false);
      if (valores.password === CREDENCIAIS_EXEMPLO.senha) setOk(true);
      else setError(mensagemErro);
    }, 900);
  };

  return (
    <div ref={raiz} className="contents">
      <LoginSimples
        layout={layout}
        identifierType={identifierType}
        title="Entrar"
        description="Acesse o sistema com as credenciais da sua secretaria."
        error={error}
        isLoading={loading}
        onSubmit={enviar}
        onForgot={onForgot ?? (() => undefined)}
        extra={ok ? <AvisoFormulario tone="sucesso" role="status">Acesso autorizado. Abrindo o painel…</AvisoFormulario> : null}
        footer={RODAPE_AUTENTICACAO}
        className={contained ? "h-[var(--template-preview-height,640px)] min-h-0 overflow-y-auto" : undefined}
      />
    </div>
  );
}

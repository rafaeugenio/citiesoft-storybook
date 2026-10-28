"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { RiArrowLeftLine, RiLoader4Line, RiMailCheckLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { LinkButton } from "@/components/base/buttons/link-button";
import { Input } from "@/components/base/input/input";
import { AuthMoldura, type AuthLayout } from "./auth-moldura";
import { AvisoFormulario } from "./campos";
import { RODAPE_AUTENTICACAO } from "./dados/autenticacao";
import { emailValido } from "./validacao";

export interface EsqueciSenhaTelaProps {
  contained?: boolean;
  layout?: AuthLayout;
  /** Etapa inicial: formulário ou confirmação de envio. */
  initialStep?: "formulario" | "confirmacao";
  /** Começa com o aviso de falha técnica de envio. */
  initialError?: boolean;
  /** Começa com o botão em carregamento. */
  initialLoading?: boolean;
  onBack?: () => void;
}

/**
 * Esqueci a senha: um campo, um botão. A resposta é sempre a mesma, exista ou
 * não o e-mail na base.
 */
export function EsqueciSenhaTela({
  contained = false,
  layout = "card",
  initialStep = "formulario",
  initialError = false,
  initialLoading = false,
  onBack,
}: EsqueciSenhaTelaProps) {
  const [etapa, setEtapa] = useState(initialStep);
  const [email, setEmail] = useState(initialStep === "confirmacao" ? "mariana.souza@saude.ma.gov.br" : "");
  const [tocou, setTocou] = useState(false);
  const [carregando, setCarregando] = useState(initialLoading);
  const [falha, setFalha] = useState(initialError);
  const [reenviado, setReenviado] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const titulo = useRef<HTMLDivElement>(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const erro = !tocou ? undefined : email.trim() === "" ? "Informe o e-mail." : !emailValido(email) ? "Informe um e-mail válido." : undefined;

  const enviar = (evento: FormEvent) => {
    evento.preventDefault();
    if (carregando) return;
    setTocou(true);
    if (email.trim() === "" || !emailValido(email)) return;
    setFalha(false);
    setCarregando(true);
    timer.current = setTimeout(() => {
      setCarregando(false);
      setEtapa("confirmacao");
    }, 900);
  };

  const voltar = (
    <LinkButton leadingIcon={RiArrowLeftLine} className="self-center" onClick={onBack ?? (() => undefined)}>
      Voltar para o login
    </LinkButton>
  );

  if (etapa === "confirmacao") {
    return (
      <AuthMoldura
        layout={layout}
        contained={contained}
        title="Verifique seu e-mail"
        description="Se o endereço informado estiver cadastrado, o link de redefinição chega em poucos minutos."
        footer={RODAPE_AUTENTICACAO}
        autoFocus={false}
      >
        <div ref={titulo} className="flex flex-col gap-4">
          <div role="status" aria-live="polite" className="flex items-start gap-3 rounded-2lg border border-border-button-default bg-background-secondary-default p-4">
            <RiMailCheckLine className="mt-0.5 size-5 shrink-0 text-foreground-icon-secondary" aria-hidden />
            <p className="text-body-regular text-text-primary">
              Enviamos um link de redefinição para o e-mail informado. Verifique sua caixa de entrada.
            </p>
          </div>
          <p className="text-caption-1-regular text-text-secondary">O link vale por 30 minutos e só pode ser usado uma vez.</p>
          <div className="flex flex-col items-center gap-3">
            <LinkButton variant="secondary" onClick={() => setReenviado(true)}>
              Reenviar link
            </LinkButton>
            <p role="status" aria-live="polite" className="min-h-4 text-caption-1-regular text-text-secondary">
              {reenviado ? "Um novo link foi enviado." : ""}
            </p>
            {voltar}
          </div>
        </div>
      </AuthMoldura>
    );
  }

  return (
    <AuthMoldura
      layout={layout}
      contained={contained}
      title="Esqueceu sua senha?"
      description="Informe seu e-mail e enviaremos um link para redefinir sua senha."
      footer={RODAPE_AUTENTICACAO}
    >
      <form onSubmit={enviar} noValidate className="flex flex-col gap-4">
        <Input
          name="email"
          type="email"
          autoComplete="email"
          label="E-mail"
          placeholder="nome@municipio.gov.br"
          value={email}
          onChange={setEmail}
          isRequired
          isDisabled={carregando}
          isInvalid={Boolean(erro)}
          hint={erro}
        />
        {falha ? (
          <AvisoFormulario>Não foi possível enviar o link agora. Tente novamente em instantes.</AvisoFormulario>
        ) : null}
        <Button
          type="submit"
          className="w-full"
          aria-disabled={carregando || undefined}
          aria-busy={carregando || undefined}
          leadingIcon={carregando ? RiLoader4Line : undefined}
        >
          {carregando ? "Enviando…" : "Enviar link de redefinição"}
        </Button>
        {voltar}
      </form>
    </AuthMoldura>
  );
}

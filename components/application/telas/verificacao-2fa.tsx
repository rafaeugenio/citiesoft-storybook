"use client";

import { useEffect, useRef, useState } from "react";
import { RiArrowLeftLine, RiLoader4Line, RiLockLine } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { LinkButton } from "@/components/base/buttons/link-button";
import { InputOtp } from "@/components/base/input-otp/input-otp";
import { AuthMoldura, type AuthLayout } from "./auth-moldura";
import { AvisoFormulario } from "./campos";
import {
  CREDENCIAIS_EXEMPLO,
  ESPERA_REENVIO_SEGUNDOS,
  RODAPE_AUTENTICACAO,
  TENTATIVAS_MAXIMAS_2FA,
} from "./dados/autenticacao";

export type Canal2fa = "autenticador" | "sms" | "email";

export interface Verificacao2faTelaProps {
  contained?: boolean;
  layout?: AuthLayout;
  canal?: Canal2fa;
  /** Começa com o aviso de código inválido. */
  initialError?: boolean;
  /** Começa com o botão em carregamento e o campo desabilitado. */
  initialLoading?: boolean;
  /** Começa bloqueada após 3 tentativas inválidas. */
  initialBlocked?: boolean;
  /** Segundos restantes do reenvio ao montar. Zero libera o reenvio. */
  initialCooldown?: number;
}

const INSTRUCAO: Record<Canal2fa, string> = {
  autenticador: "Digite o código de 6 dígitos gerado no seu aplicativo autenticador.",
  sms: "Enviamos um código por SMS para o número terminado em 1234.",
  email: "Enviamos um código para o e-mail m***@saude.ma.gov.br.",
};

/** Verificação em duas etapas com código de 6 dígitos. O código de exemplo é 123456. */
export function Verificacao2faTela({
  contained = false,
  layout = "card",
  canal = "sms",
  initialError = false,
  initialLoading = false,
  initialBlocked = false,
  initialCooldown = ESPERA_REENVIO_SEGUNDOS,
}: Verificacao2faTelaProps) {
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState(initialError);
  const [carregando, setCarregando] = useState(initialLoading);
  const [tentativas, setTentativas] = useState(initialBlocked ? TENTATIVAS_MAXIMAS_2FA : initialError ? 1 : 0);
  const [espera, setEspera] = useState(canal === "autenticador" ? 0 : initialCooldown);
  const [anuncio, setAnuncio] = useState("");
  const [ok, setOk] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const raiz = useRef<HTMLDivElement>(null);

  const bloqueado = tentativas >= TENTATIVAS_MAXIMAS_2FA;
  const completo = codigo.length === 6;

  useEffect(() => () => clearTimeout(timer.current), []);

  /* Anúncio para leitor de tela em intervalos discretos, nunca a cada segundo. */
  useEffect(() => {
    if (espera <= 0) return;
    const id = setTimeout(() => {
      const proximo = espera - 1;
      setEspera(proximo);
      if (proximo === 0) setAnuncio("Já é possível reenviar o código.");
      else if (proximo % 10 === 0) setAnuncio(`Reenvio disponível em ${proximo} segundos.`);
    }, 1000);
    return () => clearTimeout(id);
  }, [espera]);

  const focarCampo = () => {
    setTimeout(() => raiz.current?.querySelector<HTMLInputElement>("input")?.focus({ preventScroll: true }), 0);
  };

  const verificar = (valor: string) => {
    if (bloqueado || carregando || valor.length !== 6) return;
    setErro(false);
    setCarregando(true);
    timer.current = setTimeout(() => {
      setCarregando(false);
      if (valor === CREDENCIAIS_EXEMPLO.codigo) {
        setOk(true);
        return;
      }
      setErro(true);
      setCodigo("");
      setTentativas((t) => t + 1);
      focarCampo();
    }, 900);
  };

  const reenviar = () => {
    setEspera(ESPERA_REENVIO_SEGUNDOS);
    setErro(false);
    setAnuncio(`Código reenviado. Reenvio disponível em ${ESPERA_REENVIO_SEGUNDOS} segundos.`);
  };

  const mensagemErro = bloqueado
    ? "Muitas tentativas inválidas. Aguarde alguns minutos ou use um código de recuperação."
    : erro
      ? "Código inválido ou expirado. Tente novamente."
      : undefined;

  return (
    <AuthMoldura
      layout={layout}
      contained={contained}
      title="Verificação em duas etapas"
      description={INSTRUCAO[canal]}
      footer={RODAPE_AUTENTICACAO}
      autoFocus={!bloqueado && !initialLoading}
    >
      <div ref={raiz} className="flex flex-col gap-4">
        <form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            verificar(codigo);
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <InputOtp
              aria-label="Código de verificação de 6 dígitos"
              length={6}
              value={codigo}
              onChange={setCodigo}
              onComplete={verificar}
              isDisabled={carregando || bloqueado}
              className="justify-center"
            />
            {mensagemErro ? (
              <p role="alert" className="text-center text-caption-1-medium text-text-error-primary">
                {mensagemErro}
              </p>
            ) : null}
          </div>

          {bloqueado ? (
            <AvisoFormulario role="status" tone="info">
              <span className="flex items-start gap-2">
                <RiLockLine className="mt-0.5 size-4 shrink-0" aria-hidden />
                Bloqueio temporário ativo. O código de recuperação é o único caminho disponível.
              </span>
            </AvisoFormulario>
          ) : null}

          {ok ? <AvisoFormulario role="status" tone="sucesso">Identidade confirmada. Abrindo o painel…</AvisoFormulario> : null}

          <Button
            type="submit"
            className="w-full"
            disabled={(!completo || bloqueado) && !carregando}
            aria-busy={carregando || undefined}
            leadingIcon={carregando ? RiLoader4Line : undefined}
          >
            {carregando ? "Verificando…" : "Verificar código"}
          </Button>
        </form>

        <div className="flex flex-col items-center gap-3">
          {canal !== "autenticador" ? (
            espera > 0 ? (
              <p className="text-body-regular text-text-secondary">
                Reenviar código em <span className="text-body-medium text-text-primary">{espera}s</span>
              </p>
            ) : (
              <LinkButton variant="secondary" disabled={bloqueado || carregando} onClick={reenviar}>
                Reenviar código
              </LinkButton>
            )
          ) : null}
          <p role="status" aria-live="polite" className="sr-only">
            {anuncio}
          </p>
          <LinkButton onClick={() => undefined}>Usar código de recuperação</LinkButton>
          <LinkButton variant="secondary" leadingIcon={RiArrowLeftLine} onClick={() => undefined}>
            Voltar para o login
          </LinkButton>
        </div>
      </div>
    </AuthMoldura>
  );
}

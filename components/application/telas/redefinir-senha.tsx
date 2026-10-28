"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { RiArrowLeftLine, RiCheckLine, RiCheckboxCircleLine, RiCircleLine, RiLoader4Line } from "@remixicon/react";
import { Button } from "@/components/base/buttons/button";
import { LinkButton } from "@/components/base/buttons/link-button";
import { cx } from "@/utils/cx";
import { AuthMoldura, type AuthLayout } from "./auth-moldura";
import { AvisoFormulario } from "./campos";
import { CampoSenha } from "./campo-senha";
import { RODAPE_AUTENTICACAO } from "./dados/autenticacao";
import { forcaSenha, requisitosSenha } from "./validacao";

export type RedefinirSenhaEstado = "formulario" | "expirado" | "sucesso";

export interface RedefinirSenhaTelaProps {
  contained?: boolean;
  layout?: AuthLayout;
  initialState?: RedefinirSenhaEstado;
  /** Senha inicial (para demonstrar requisitos já atendidos). */
  initialPassword?: string;
  initialConfirmation?: string;
  /** Começa com o botão em carregamento. */
  initialLoading?: boolean;
  /** Começa com o aviso de falha técnica. */
  initialError?: boolean;
}

const COR_FORCA = ["bg-separator-border", "bg-status-rose-text", "bg-status-yellow-text", "bg-status-blue-text", "bg-status-lime-text"];

/** Redefinição de senha: força, requisitos visíveis e confirmação. */
export function RedefinirSenhaTela({
  contained = false,
  layout = "card",
  initialState = "formulario",
  initialPassword = "",
  initialConfirmation = "",
  initialLoading = false,
  initialError = false,
}: RedefinirSenhaTelaProps) {
  const [estado, setEstado] = useState(initialState);
  const [senha, setSenha] = useState(initialPassword);
  const [confirmacao, setConfirmacao] = useState(initialConfirmation);
  const [carregando, setCarregando] = useState(initialLoading);
  const [falha, setFalha] = useState(initialError);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const requisitos = requisitosSenha(senha);
  const atendidos = requisitos.filter((r) => r.atendido).length;
  const forca = forcaSenha(senha);
  const todosAtendidos = atendidos === requisitos.length;
  const coincide = confirmacao !== "" && confirmacao === senha;
  const divergente = confirmacao !== "" && confirmacao !== senha;
  const pode = todosAtendidos && coincide && !carregando;

  const salvar = (evento: FormEvent) => {
    evento.preventDefault();
    if (!pode) return;
    setFalha(false);
    setCarregando(true);
    timer.current = setTimeout(() => {
      setCarregando(false);
      setEstado("sucesso");
    }, 900);
  };

  const voltar = (
    <LinkButton leadingIcon={RiArrowLeftLine} className="self-center" onClick={() => undefined}>
      Voltar para o login
    </LinkButton>
  );

  if (estado === "expirado") {
    return (
      <AuthMoldura
        layout={layout}
        contained={contained}
        title="Link expirado"
        description="O link de redefinição venceu ou já foi usado. Solicite um novo envio para continuar."
        footer={RODAPE_AUTENTICACAO}
        autoFocus={false}
      >
        <div className="flex flex-col gap-4">
          <AvisoFormulario role="status" tone="info">
            Por segurança, cada link vale por 30 minutos.
          </AvisoFormulario>
          <Button className="w-full" onClick={() => undefined}>
            Solicitar novo link
          </Button>
          {voltar}
        </div>
      </AuthMoldura>
    );
  }

  if (estado === "sucesso") {
    return (
      <AuthMoldura
        layout={layout}
        contained={contained}
        title="Senha redefinida"
        description="As sessões anteriores foram encerradas. Entre com a nova senha."
        footer={RODAPE_AUTENTICACAO}
        autoFocus={false}
      >
        <div className="flex flex-col gap-4">
          <div role="status" className="flex items-start gap-3 rounded-2lg border border-border-button-default bg-status-lime-background p-4 text-status-lime-text">
            <RiCheckboxCircleLine className="mt-0.5 size-5 shrink-0" aria-hidden />
            <p className="text-body-regular">Senha alterada com sucesso.</p>
          </div>
          <Button className="w-full" onClick={() => undefined}>
            Ir para o login
          </Button>
        </div>
      </AuthMoldura>
    );
  }

  return (
    <AuthMoldura
      layout={layout}
      contained={contained}
      title="Redefinir senha"
      description="Crie uma nova senha para acessar o sistema."
      footer={RODAPE_AUTENTICACAO}
    >
      <form onSubmit={salvar} noValidate className="flex flex-col gap-4">
        <CampoSenha label="Nova senha" name="nova-senha" value={senha} onChange={setSenha} isDisabled={carregando} />

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div aria-hidden className="flex flex-1 gap-1">
              {[1, 2, 3, 4].map((n) => (
                <span
                  key={n}
                  className={cx("h-1.5 flex-1 rounded-full", forca.nivel >= n ? COR_FORCA[forca.nivel] : "bg-separator-border")}
                />
              ))}
            </div>
            <p className="w-16 text-end text-caption-1-medium text-text-secondary">
              <span className="sr-only">Força da senha: </span>
              {forca.nivel === 0 ? "" : forca.rotulo}
            </p>
          </div>
          <ul aria-label="Requisitos da senha" className="flex flex-col gap-1.5">
            {requisitos.map((r) => (
              <li key={r.id} className="flex items-center gap-2 text-caption-1-regular">
                {r.atendido ? (
                  <RiCheckLine className="size-4 shrink-0 text-status-lime-text" aria-hidden />
                ) : (
                  <RiCircleLine className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                )}
                <span className={r.atendido ? "text-text-primary" : "text-text-secondary"}>
                  {r.rotulo}
                  <span className="sr-only">{r.atendido ? ", atendido" : ", pendente"}</span>
                </span>
              </li>
            ))}
          </ul>
          <p role="status" aria-live="polite" className="sr-only">
            {`${atendidos} de ${requisitos.length} requisitos atendidos`}
          </p>
        </div>

        <CampoSenha
          label="Confirmar senha"
          name="confirmar-senha"
          value={confirmacao}
          onChange={setConfirmacao}
          placeholder="Repita a nova senha"
          isDisabled={carregando}
          isInvalid={divergente}
          hint={divergente ? "As senhas não coincidem." : undefined}
        />

        {falha ? <AvisoFormulario>Não foi possível salvar a senha agora. Tente novamente em instantes.</AvisoFormulario> : null}

        <Button
          type="submit"
          className="w-full"
          disabled={!pode && !carregando}
          aria-busy={carregando || undefined}
          leadingIcon={carregando ? RiLoader4Line : undefined}
        >
          {carregando ? "Salvando…" : "Salvar nova senha"}
        </Button>
        {voltar}
      </form>
    </AuthMoldura>
  );
}

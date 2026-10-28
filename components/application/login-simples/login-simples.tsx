"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { RiEyeLine, RiEyeOffLine, RiLoader4Line } from "@remixicon/react";
import { BrandLogo } from "@/components/application/app-frame/brand-logo";
import { Button } from "@/components/base/buttons/button";
import { LinkButton } from "@/components/base/buttons/link-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { maskCpf } from "./mask-cpf";

export type LoginIdentifierType = "email" | "cpf" | "texto";
export type LoginLayout = "card" | "dividido";

export interface LoginSimplesValues {
  identifier: string;
  password: string;
  remember: boolean;
}

export interface LoginSimplesProps {
  /** Tipo do campo de identificação. `cpf` aplica a máscara 000.000.000-00. */
  identifierType?: LoginIdentifierType;
  identifierLabel?: string;
  identifierPlaceholder?: string;
  passwordLabel?: string;
  /** Marca acima do título. Padrão: logo Citiesoft. */
  brand?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  /** `card` centraliza um cartão; `dividido` coloca um painel de marca ao lado. */
  layout?: LoginLayout;
  /** Conteúdo do painel de marca no layout `dividido`. */
  panel?: ReactNode;
  showRemember?: boolean;
  rememberLabel?: string;
  defaultRemember?: boolean;
  forgotLabel?: string;
  forgotHref?: string;
  onForgot?: () => void;
  submitLabel?: string;
  loadingLabel?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
  /** Erro de credencial. Exibido em um banner com `role="alert"` acima do botão. */
  error?: ReactNode;
  onSubmit?: (values: LoginSimplesValues) => void;
  /** Conteúdo extra entre o formulário e o rodapé (aviso de ambiente, ajuda). */
  extra?: ReactNode;
  /** Rodapé abaixo do cartão (links, versão, suporte). */
  footer?: ReactNode;
  headingLevel?: 1 | 2 | 3;
  className?: string;
}

const DEFAULTS: Record<LoginIdentifierType, { label: string; placeholder: string; empty: string }> = {
  email: { label: "E-mail", placeholder: "nome@municipio.gov.br", empty: "Informe o e-mail." },
  cpf: { label: "CPF", placeholder: "000.000.000-00", empty: "Informe o CPF." },
  texto: { label: "Usuário", placeholder: "Nome de usuário", empty: "Informe o usuário." },
};

export function LoginSimples({
  identifierType = "email",
  identifierLabel,
  identifierPlaceholder,
  passwordLabel = "Senha",
  brand,
  title = "Entrar",
  description,
  layout = "card",
  panel,
  showRemember = true,
  rememberLabel = "Lembrar de mim",
  defaultRemember = false,
  forgotLabel = "Esqueci a senha",
  forgotHref = "#",
  onForgot,
  submitLabel = "Entrar",
  loadingLabel = "Entrando",
  isLoading = false,
  isDisabled = false,
  error,
  onSubmit,
  extra,
  footer,
  headingLevel = 1,
  className,
}: LoginSimplesProps) {
  const Title = `h${headingLevel}` as const;
  const base = DEFAULTS[identifierType];
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(defaultRemember);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);

  const idError = !touched
    ? undefined
    : identifier.trim() === ""
      ? base.empty
      : identifierType === "cpf" && identifier.replace(/\D/g, "").length !== 11
        ? "O CPF deve ter 11 dígitos."
        : undefined;
  const pwError = touched && password === "" ? "Informe a senha." : undefined;
  const blocked = isLoading || isDisabled;

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (blocked) return;
    setTouched(true);
    const idOk =
      identifier.trim() !== "" && (identifierType !== "cpf" || identifier.replace(/\D/g, "").length === 11);
    if (!idOk || password === "") return;
    onSubmit?.({ identifier, password, remember });
  };

  const form = (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-4">
        {brand ?? <BrandLogo className="self-start" />}
        <div className="flex flex-col gap-1.5">
          <Title className="text-title-2-medium text-text-primary">{title}</Title>
          {description ? <p className="text-body-regular text-text-secondary">{description}</p> : null}
        </div>
      </div>

      <form onSubmit={submit} noValidate className="flex flex-col gap-4">
        <Input
          name="identifier"
          type={identifierType === "email" ? "email" : "text"}
          inputMode={identifierType === "cpf" ? "numeric" : undefined}
          autoComplete={identifierType === "email" ? "email" : "username"}
          label={identifierLabel ?? base.label}
          placeholder={identifierPlaceholder ?? base.placeholder}
          value={identifier}
          onChange={(v) => setIdentifier(identifierType === "cpf" ? maskCpf(v) : v)}
          isRequired
          isDisabled={isDisabled}
          isInvalid={Boolean(idError)}
          hint={idError}
          inputDir={identifierType === "cpf" ? "ltr" : undefined}
        />

        <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              label={passwordLabel}
              placeholder="Digite a senha"
              value={password}
              onChange={setPassword}
              isRequired
              isDisabled={isDisabled}
              isInvalid={Boolean(pwError)}
              hint={pwError}
              inputClassName="pe-9"
            />
            <button
              type="button"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={showPassword}
              disabled={isDisabled}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute end-2 top-8 flex size-5 cursor-pointer items-center justify-center rounded-sm text-foreground-icon-tertiary outline-none hover:text-foreground-icon-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed"
            >
              {showPassword ? <RiEyeOffLine className="size-5" aria-hidden /> : <RiEyeLine className="size-5" aria-hidden />}
            </button>
        </div>

        {showRemember || forgotLabel ? (
          <div className="flex flex-wrap items-center justify-between gap-2">
            {showRemember ? (
              <Checkbox size="sm" isSelected={remember} onChange={setRemember} isDisabled={isDisabled}>
                {rememberLabel}
              </Checkbox>
            ) : (
              <span />
            )}
            {onForgot ? (
              <LinkButton onClick={onForgot} disabled={isDisabled}>
                {forgotLabel}
              </LinkButton>
            ) : (
              <LinkButton href={forgotHref} disabled={isDisabled}>
                {forgotLabel}
              </LinkButton>
            )}
          </div>
        ) : null}

        {error ? (
          <div
            role="alert"
            className="rounded-2lg border border-border-error-default bg-background-tertiary-error p-3 text-body-regular text-text-error-primary"
          >
            {error}
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full"
          aria-disabled={blocked || undefined}
          aria-busy={isLoading || undefined}
          leadingIcon={isLoading ? RiLoader4Line : undefined}
        >
          {isLoading ? `${loadingLabel}…` : submitLabel}
        </Button>
      </form>

      {extra}
    </div>
  );

  const footerNode = footer ? (
    <div className="text-center text-caption-1-regular text-text-tertiary">{footer}</div>
  ) : null;

  if (layout === "dividido") {
    return (
      <div className={cx("grid min-h-dvh w-full bg-background-full lg:grid-cols-2", className)}>
        <div className="relative hidden flex-col justify-between bg-accent-800 p-10 text-white lg:flex">
          {panel ?? (
            <>
              <BrandLogo tone="on-dark" />
              <div className="flex max-w-md flex-col gap-3">
                <p className="text-title-1-medium">Gestão pública com menos burocracia.</p>
                <p className="text-body-regular text-white/80">
                  Solicitações, regulação e acompanhamento no mesmo lugar, com histórico de cada etapa.
                </p>
              </div>
              <p className="text-caption-1-regular text-white/70">Citiesoft</p>
            </>
          )}
        </div>
        <div className="flex flex-col items-center justify-center gap-6 p-6 sm:p-10">
          <div className="w-full max-w-[400px]">{form}</div>
          {footerNode}
        </div>
      </div>
    );
  }

  return (
    <div className={cx("flex min-h-dvh w-full flex-col items-center justify-center gap-4 bg-background-full p-4", className)}>
      <div className="w-full max-w-[400px] rounded-3xl border border-border-button-default bg-background-primary-default p-6 shadow-xs sm:p-8">
        {form}
      </div>
      {footerNode}
    </div>
  );
}

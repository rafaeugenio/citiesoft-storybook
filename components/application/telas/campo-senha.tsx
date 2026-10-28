"use client";

import { useState, type ReactNode } from "react";
import { RiEyeLine, RiEyeOffLine } from "@remixicon/react";
import { Input } from "@/components/base/input/input";

export interface CampoSenhaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoComplete?: string;
  name?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  hint?: ReactNode;
  required?: boolean;
}

/** Campo de senha com botão de mostrar e ocultar, no mesmo comportamento do login. */
export function CampoSenha({
  label,
  value,
  onChange,
  placeholder = "Digite a senha",
  autoComplete = "new-password",
  name,
  isDisabled,
  isInvalid,
  hint,
  required = true,
}: CampoSenhaProps) {
  const [visivel, setVisivel] = useState(false);
  return (
    <div className="relative">
      <Input
        name={name}
        type={visivel ? "text" : "password"}
        autoComplete={autoComplete}
        label={label}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        isRequired={required}
        isDisabled={isDisabled}
        isInvalid={isInvalid}
        hint={hint}
        inputClassName="pe-9"
      />
      <button
        type="button"
        aria-label={visivel ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
        aria-pressed={visivel}
        disabled={isDisabled}
        onClick={() => setVisivel((v) => !v)}
        className="absolute end-2 top-8 flex size-5 cursor-pointer items-center justify-center rounded-sm text-foreground-icon-tertiary outline-none hover:text-foreground-icon-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed"
      >
        {visivel ? <RiEyeOffLine className="size-5" aria-hidden /> : <RiEyeLine className="size-5" aria-hidden />}
      </button>
    </div>
  );
}

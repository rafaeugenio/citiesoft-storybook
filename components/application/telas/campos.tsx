"use client";

import { useId, type ReactNode } from "react";
import { Select, SelectItem } from "@/components/base/select/select";

export interface SelectFieldProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  hint?: ReactNode;
  disabled?: boolean;
  name?: string;
}

/** Select com rótulo visível, asterisco de obrigatório e mensagem de erro associada. */
export function SelectField({
  label,
  options,
  value,
  onChange,
  onBlur,
  required = false,
  placeholder = "Selecione",
  error,
  hint,
  disabled,
  name,
}: SelectFieldProps) {
  const id = useId();
  const messageId = `${id}-msg`;
  const message = error ?? hint;
  return (
    <div className="flex flex-col gap-1.5" data-campo={name}>
      <span id={`${id}-label`} className="flex items-center gap-0.5 text-body-medium text-text-primary">
        {label}
        {required ? (
          <span aria-hidden className="text-body-medium text-text-error-primary">
            *
          </span>
        ) : null}
      </span>
      <Select
        name={name}
        aria-labelledby={`${id}-label`}
        aria-describedby={message ? messageId : undefined}
        placeholder={placeholder}
        selectedKey={value === "" ? null : value}
        onSelectionChange={(key) => {
          onChange(key === null ? "" : String(key));
          onBlur?.();
        }}
        isInvalid={Boolean(error)}
        isRequired={required}
        isDisabled={disabled}
        className="w-full"
      >
        {options.map((opcao) => (
          <SelectItem key={opcao} id={opcao}>
            {opcao}
          </SelectItem>
        ))}
      </Select>
      {message ? (
        <p id={messageId} className={error ? "text-caption-1-medium text-text-error-primary" : "text-caption-1-medium text-text-secondary"}>
          {message}
        </p>
      ) : null}
    </div>
  );
}

/** Banner de alerta de formulário (erro de sistema ou aviso de correção). */
export function AvisoFormulario({
  children,
  tone = "erro",
  role = "alert",
  id,
}: {
  children: ReactNode;
  tone?: "erro" | "sucesso" | "info";
  role?: "alert" | "status";
  id?: string;
}) {
  const classe =
    tone === "erro"
      ? "border-border-error-default bg-background-tertiary-error text-text-error-primary"
      : tone === "sucesso"
        ? "border-border-button-default bg-status-lime-background text-status-lime-text"
        : "border-border-button-default bg-status-blue-background text-status-blue-text";
  return (
    <div id={id} role={role} className={`rounded-2lg border p-3 text-body-regular ${classe}`}>
      {children}
    </div>
  );
}

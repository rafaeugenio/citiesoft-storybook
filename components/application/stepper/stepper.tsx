"use client";

import { RiAlertFill, RiCheckLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

export type StepStatus = "complete" | "current" | "upcoming" | "error";

export interface StepperStep {
  key: string;
  label: string;
  description?: string;
  /** Marca a etapa como opcional ("Opcional" ao lado do rótulo). */
  optional?: boolean;
  /** Força um estado (ex.: `error`). Sem isso, o estado vem da posição em `current`. */
  status?: StepStatus;
  /** Mensagem exibida com o estado de erro. */
  errorMessage?: string;
  isDisabled?: boolean;
}

export interface StepperProps {
  steps: StepperStep[];
  /** Índice (a partir de 0) da etapa atual. */
  current: number;
  orientation?: "horizontal" | "vertical";
  /**
   * Etapas clicáveis: `false` (padrão), `"completed"` (concluídas e com erro)
   * ou `"all"`. Exige `onStepClick`.
   */
  clickable?: false | "completed" | "all";
  onStepClick?: (index: number, step: StepperStep) => void;
  "aria-label"?: string;
  className?: string;
}

const STATUS_TEXT: Record<StepStatus, string> = {
  complete: "Concluída",
  current: "Etapa atual",
  upcoming: "Pendente",
  error: "Com erro",
};

function resolve(step: StepperStep, index: number, current: number): StepStatus {
  if (step.status) return step.status;
  if (index < current) return "complete";
  if (index === current) return "current";
  return "upcoming";
}

export function Stepper({
  steps,
  current,
  orientation = "horizontal",
  clickable = false,
  onStepClick,
  "aria-label": ariaLabel = "Etapas",
  className,
}: StepperProps) {
  const vertical = orientation === "vertical";

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ol className={cx("flex", vertical ? "flex-col" : "items-start gap-2")}>
        {steps.map((step, index) => {
          const status = resolve(step, index, current);
          const isCurrent = index === current;
          const last = index === steps.length - 1;
          const canClick =
            Boolean(onStepClick) &&
            !step.isDisabled &&
            clickable !== false &&
            (clickable === "all" || status === "complete" || status === "error");

          const circle = (
            <span
              aria-hidden
              className={cx(
                "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-body-medium",
                status === "complete" && "border-accent-500 bg-accent-500 text-white",
                status === "current" && "border-accent-500 bg-background-primary-default text-text-brand",
                status === "upcoming" && "border-border-button-default bg-background-primary-default text-text-secondary",
                status === "error" &&
                  "border-border-error-default bg-background-tertiary-error text-foreground-icon-error",
              )}
            >
              {status === "complete" ? (
                <RiCheckLine className="size-4" />
              ) : status === "error" ? (
                <RiAlertFill className="size-4" />
              ) : (
                index + 1
              )}
            </span>
          );

          const text = (
            <span
              className={cx(
                "flex min-w-0 flex-col text-start",
                // No celular, a barra horizontal mostra só o rótulo da etapa atual.
                !vertical && !isCurrent && "max-sm:sr-only",
              )}
            >
              <span
                className={cx(
                  "text-body-medium",
                  status === "error" ? "text-text-error-primary" : isCurrent ? "text-text-primary" : "text-text-secondary",
                )}
              >
                {step.label}
                {step.optional ? (
                  <span className="ms-1.5 text-caption-1-regular text-text-tertiary">Opcional</span>
                ) : null}
              </span>
              {status === "error" && step.errorMessage ? (
                <span className="text-caption-1-regular text-text-error-primary">{step.errorMessage}</span>
              ) : step.description ? (
                <span className="text-caption-1-regular text-text-secondary">{step.description}</span>
              ) : null}
              <span className="sr-only">{`, ${STATUS_TEXT[status]}`}</span>
            </span>
          );

          const inner = (
            <>
              {circle}
              {text}
            </>
          );

          const rowClass = cx(
            "flex items-start gap-3 rounded-2lg text-start outline-none",
            !vertical && "items-center",
          );

          return (
            <li
              key={step.key}
              aria-current={isCurrent ? "step" : undefined}
              className={cx(
                "flex",
                vertical ? "flex-col" : "min-w-0 items-center gap-2 max-sm:last:flex-none sm:flex-1 sm:last:flex-none",
                !vertical && isCurrent && "max-sm:flex-1",
              )}
            >
              {canClick ? (
                <button
                  type="button"
                  onClick={() => onStepClick?.(index, step)}
                  className={cx(rowClass, "cursor-pointer focus-visible:ring-2 focus-visible:ring-border-focus-ring")}
                >
                  {inner}
                </button>
              ) : (
                <div className={rowClass}>{inner}</div>
              )}
              {last ? null : (
                <span
                  aria-hidden
                  className={cx(
                    "bg-separator-border",
                    status === "complete" && "bg-accent-500",
                    vertical ? "my-1 ms-[15px] min-h-6 w-0.5 flex-1" : "h-0.5 min-w-4 flex-1",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

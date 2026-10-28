import type { ComponentType, ReactNode } from "react";
import { RiCircleFill } from "@remixicon/react";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export type TimelineTone = "neutral" | "brand" | "success" | "warning" | "danger";

export interface TimelineEvent {
  key: string;
  title: ReactNode;
  description?: ReactNode;
  /** Data exibida (ex.: "15/07/2026 às 14:32"). */
  date: string;
  /** Valor ISO para o atributo `datetime`. */
  dateTime?: string;
  author?: string;
  icon?: IconComponent;
  tone?: TimelineTone;
  /** Conteúdo extra abaixo do texto (anexo, comentário, lista). */
  extra?: ReactNode;
}

export interface TimelineProps {
  events: TimelineEvent[];
  /** Texto quando não há eventos. */
  emptyText?: string;
  "aria-label"?: string;
  className?: string;
}

const TONE: Record<TimelineTone, string> = {
  neutral: "bg-background-tertiary-default text-foreground-icon-secondary",
  brand: "bg-status-blue-background text-status-blue-text",
  success: "bg-status-lime-background text-status-lime-text",
  warning: "bg-status-yellow-background text-status-yellow-text",
  danger: "bg-status-rose-background text-status-rose-text",
};

/**
 * Linha do tempo de eventos. Passe os eventos já ordenados: o padrão do
 * template de detalhe é do mais recente para o mais antigo.
 */
export function Timeline({
  events,
  emptyText = "Nenhum evento registrado.",
  "aria-label": ariaLabel = "Histórico",
  className,
}: TimelineProps) {
  if (events.length === 0) {
    return <p className={cx("text-body-regular text-text-secondary", className)}>{emptyText}</p>;
  }
  return (
    <ol aria-label={ariaLabel} className={cx("flex flex-col", className)}>
      {events.map((event, index) => {
        const Icon = event.icon ?? RiCircleFill;
        const last = index === events.length - 1;
        return (
          <li key={event.key} className="relative flex gap-3 pb-6 last:pb-0">
            {last ? null : (
              <span aria-hidden className="absolute start-4 top-9 bottom-1 w-px -translate-x-1/2 bg-separator-border" />
            )}
            <span
              aria-hidden
              className={cx(
                "z-[1] flex size-8 shrink-0 items-center justify-center rounded-full",
                TONE[event.tone ?? "neutral"],
              )}
            >
              <Icon className={event.icon ? "size-4" : "size-2"} />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-body-medium text-text-primary">{event.title}</p>
                <time dateTime={event.dateTime} className="text-caption-1-regular text-text-secondary">
                  {event.date}
                </time>
              </div>
              {event.description ? (
                <p className="text-body-regular text-text-secondary">{event.description}</p>
              ) : null}
              {event.author ? (
                <p className="text-caption-1-regular text-text-tertiary">{`Por ${event.author}`}</p>
              ) : null}
              {event.extra}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

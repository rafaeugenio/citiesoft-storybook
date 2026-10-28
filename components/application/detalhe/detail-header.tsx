import type { ComponentType, ReactNode } from "react";
import { RiEditLine } from "@remixicon/react";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { Button } from "@/components/base/buttons/button";
import { Chip, type ChipProps } from "@/components/base/badges/chip";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface DetailHeaderProps {
  /** Identidade do registro: o dado mais reconhecível (nome, assunto), não o código técnico. */
  title: ReactNode;
  /** Identificador secundário, como o protocolo `TFD-2026-004812`. */
  identifier?: string;
  statusLabel?: string;
  statusColor?: ChipProps["color"];
  /** Linha de metadados abaixo do título (município, data, responsável). */
  meta?: ReactNode;
  breadcrumb?: { label: string; href?: string }[];
  /** Ação "Editar", sempre visível. Sem `onEdit` nem `editHref`, não aparece. */
  onEdit?: () => void;
  editLabel?: string;
  editIcon?: IconComponent;
  /** Menu de ações secundárias e destrutivas (menu de três pontos). */
  menu?: ReactNode;
  /** Ações adicionais antes de "Editar". */
  actions?: ReactNode;
  headingLevel?: 1 | 2;
  className?: string;
}

/** Cabeçalho de detalhe: trilha, identidade, status e ações. */
export function DetailHeader({
  title,
  identifier,
  statusLabel,
  statusColor = "neutral",
  meta,
  breadcrumb,
  onEdit,
  editLabel = "Editar",
  editIcon = RiEditLine,
  menu,
  actions,
  headingLevel = 1,
  className,
}: DetailHeaderProps) {
  const Heading = `h${headingLevel}` as const;
  return (
    <header className={cx("flex flex-col gap-3", className)}>
      {breadcrumb && breadcrumb.length > 0 ? (
        <Breadcrumb aria-label="Trilha de navegação do registro">
          {breadcrumb.map((crumb, index) => (
            <BreadcrumbItem key={crumb.label} href={crumb.href ?? "#"} current={index === breadcrumb.length - 1}>
              {crumb.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <Heading className="text-title-2-medium text-text-primary">{title}</Heading>
            {statusLabel ? (
              <Chip variant="bold" color={statusColor}>
                {statusLabel}
              </Chip>
            ) : null}
          </div>
          {identifier ? <p className="text-body-medium text-text-secondary">{identifier}</p> : null}
          {meta ? <div className="text-body-regular text-text-secondary">{meta}</div> : null}
        </div>
        <div className="flex items-center gap-2">
          {actions}
          {onEdit ? (
            <Button variant="secondary" leadingIcon={editIcon} onClick={onEdit}>
              {editLabel}
            </Button>
          ) : null}
          {menu}
        </div>
      </div>
    </header>
  );
}

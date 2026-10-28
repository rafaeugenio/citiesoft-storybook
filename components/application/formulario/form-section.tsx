import { useId, type ReactNode } from "react";
import { cx } from "@/utils/cx";

export interface FormSectionProps {
  title: ReactNode;
  description?: ReactNode;
  /** Nota sob o título, por exemplo "* Campos obrigatórios". */
  requiredNote?: ReactNode;
  /** Ação à direita do título (ex.: "Limpar seção"). */
  action?: ReactNode;
  /** Nível do título. Padrão: 2. */
  headingLevel?: 2 | 3 | 4;
  /** Desenha o cartão (borda e fundo). Desligue dentro de drawer ou diálogo. */
  card?: boolean;
  children: ReactNode;
  className?: string;
}

/** Seção de formulário com título e descrição, associada ao conteúdo por `aria-labelledby`. */
export function FormSection({
  title,
  description,
  requiredNote,
  action,
  headingLevel = 2,
  card = true,
  children,
  className,
}: FormSectionProps) {
  const id = useId();
  const Heading = `h${headingLevel}` as const;
  return (
    <section
      aria-labelledby={id}
      className={cx(
        "flex flex-col gap-5",
        card && "rounded-3xl border border-border-button-default bg-background-primary-default p-5 sm:p-6",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <Heading id={id} className="text-headline-medium text-text-primary">
            {title}
          </Heading>
          {description ? <p className="text-body-regular text-text-secondary">{description}</p> : null}
          {requiredNote ? <p className="text-caption-1-regular text-text-tertiary">{requiredNote}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

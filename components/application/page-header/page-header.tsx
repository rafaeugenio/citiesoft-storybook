"use client";

import type { ComponentType, ReactNode } from "react";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { Button, ButtonLink } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface PageHeaderCrumb {
  label: string;
  href?: string;
  icon?: IconComponent;
  onClick?: () => void;
}

export interface PageHeaderMeta {
  label: string;
  value: ReactNode;
  icon?: IconComponent;
}

export interface PageHeaderAction {
  label: string;
  icon?: IconComponent;
  onClick?: () => void;
  /** Quando informado, a ação vira um link. */
  href?: string;
  isDisabled?: boolean;
}

export interface PageHeaderTab {
  id: string;
  label: string;
  count?: ReactNode;
  href?: string;
}

export interface PageHeaderProps {
  /** Trilha de navegação. O último item é a página atual. */
  breadcrumbs?: PageHeaderCrumb[];
  breadcrumbLabel?: string;
  /** Título: plural da entidade. */
  title: ReactNode;
  titleAs?: "h1" | "h2";
  description?: ReactNode;
  /** Metadados em linha (por exemplo, última atualização e total). */
  meta?: PageHeaderMeta[];
  /** Ação primária, sempre no cabeçalho ("Novo ..."). */
  primaryAction?: PageHeaderAction;
  secondaryActions?: PageHeaderAction[];
  /** Abas de seção (navegação da página, não troca de painel). */
  tabs?: PageHeaderTab[];
  selectedTab?: string;
  onTabChange?: (id: string) => void;
  tabsLabel?: string;
  className?: string;
}

function ActionButton({
  action,
  variant,
}: {
  action: PageHeaderAction;
  variant: "primary" | "secondary";
}) {
  if (action.href && !action.isDisabled) {
    return (
      <ButtonLink variant={variant} leadingIcon={action.icon} href={action.href}>
        {action.label}
      </ButtonLink>
    );
  }
  return (
    <Button
      variant={variant}
      leadingIcon={action.icon}
      onClick={action.onClick}
      disabled={action.isDisabled}
    >
      {action.label}
    </Button>
  );
}

/**
 * Cabeçalho de página: trilha, título no plural da entidade, descrição,
 * metadados, ações (a primária "Novo ..." fica sempre aqui, nunca na barra de
 * filtros) e abas opcionais.
 */
export function PageHeader({
  breadcrumbs,
  breadcrumbLabel = "Trilha de navegação",
  title,
  titleAs: Title = "h1",
  description,
  meta,
  primaryAction,
  secondaryActions,
  tabs,
  selectedTab,
  onTabChange,
  tabsLabel = "Seções da página",
  className,
}: PageHeaderProps) {
  const hasActions = Boolean(primaryAction) || Boolean(secondaryActions?.length);

  return (
    <header className={cx("flex w-full flex-col gap-3", className)}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb aria-label={breadcrumbLabel}>
          {breadcrumbs.map((crumb, index) => (
            <BreadcrumbItem
              key={`${crumb.label}-${index}`}
              icon={crumb.icon}
              href={crumb.href}
              onClick={crumb.onClick}
              current={index === breadcrumbs.length - 1}
            >
              {crumb.label}
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <Title className="text-title-2-semibold text-text-primary">{title}</Title>
          {description ? (
            <p className="max-w-[640px] text-body-regular text-text-secondary">{description}</p>
          ) : null}
          {meta && meta.length > 0 ? (
            <dl className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              {meta.map((item) => (
                <div key={item.label} className="flex items-center gap-1.5 text-body-2-regular">
                  {item.icon ? (
                    <item.icon className="size-4 shrink-0 text-foreground-icon-tertiary" aria-hidden />
                  ) : null}
                  <dt className="text-text-secondary">{item.label}:</dt>
                  <dd className="text-text-primary">{item.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>

        {hasActions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            {secondaryActions?.map((action) => (
              <ActionButton key={action.label} action={action} variant="secondary" />
            ))}
            {primaryAction ? <ActionButton action={primaryAction} variant="primary" /> : null}
          </div>
        ) : null}
      </div>

      {tabs && tabs.length > 0 ? (
        <nav aria-label={tabsLabel} className="-mb-px w-full overflow-x-auto border-b border-separator-border">
          <ul className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isCurrent = tab.id === selectedTab;
              const className = cx(
                "relative inline-flex cursor-pointer items-center gap-2.5 px-2.5 py-2 whitespace-nowrap outline-none",
                "transition-colors duration-150 ease",
                "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                isCurrent
                  ? "text-body-medium text-text-brand after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-accent-600"
                  : "text-body-regular text-text-primary hover:text-text-secondary",
              );
              const content = (
                <>
                  {tab.label}
                  {tab.count != null ? (
                    <span
                      className={cx(
                        "inline-flex items-center justify-center rounded-sm px-1 py-px text-caption-1-medium",
                        isCurrent
                          ? "bg-tab-count-selected-background text-text-brand"
                          : "bg-background-tertiary-default text-text-secondary",
                      )}
                    >
                      {tab.count}
                    </span>
                  ) : null}
                </>
              );
              return (
                <li key={tab.id}>
                  {tab.href ? (
                    <a
                      href={tab.href}
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={onTabChange ? () => onTabChange(tab.id) : undefined}
                      className={className}
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      type="button"
                      aria-current={isCurrent ? "page" : undefined}
                      onClick={() => onTabChange?.(tab.id)}
                      className={className}
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}

"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { Select, SelectItem } from "@/components/base/select/select";
import { cx } from "@/utils/cx";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface SettingsNavItem {
  key: string;
  label: string;
  icon?: IconComponent;
  href?: string;
}

export interface SettingsNavGroup {
  label?: string;
  items: SettingsNavItem[];
}

export interface SettingsLayoutProps {
  groups: SettingsNavGroup[];
  /** Item selecionado (controlado). */
  selected?: string;
  /** Item inicial quando não controlado. Padrão: o primeiro. */
  defaultSelected?: string;
  onSelect?: (key: string) => void;
  title?: ReactNode;
  description?: ReactNode;
  /** Ações à direita do título. */
  actions?: ReactNode;
  /** Rótulo único da navegação lateral. */
  navLabel?: string;
  /** Rótulo do seletor exibido no celular. */
  selectLabel?: string;
  /** Largura da navegação lateral. */
  navWidth?: "sm" | "md";
  children: ReactNode;
  className?: string;
}

/**
 * Página de configurações com navegação lateral agrupada. Abaixo de `md` a
 * navegação vira um seletor acima do conteúdo.
 */
export function SettingsLayout({
  groups,
  selected,
  defaultSelected,
  onSelect,
  title = "Configurações",
  description,
  actions,
  navLabel = "Navegação de configurações",
  selectLabel = "Seção de configurações",
  navWidth = "md",
  children,
  className,
}: SettingsLayoutProps) {
  const all = groups.flatMap((g) => g.items);
  const [inner, setInner] = useState(defaultSelected ?? all[0]?.key);
  const current = selected ?? inner;
  const choose = (key: string) => {
    setInner(key);
    onSelect?.(key);
  };

  return (
    <div className={cx("flex w-full flex-col gap-6 p-4 sm:p-6", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-title-2-medium text-text-primary">{title}</h1>
          {description ? <p className="text-body-regular text-text-secondary">{description}</p> : null}
        </div>
        {actions}
      </header>

      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <Select
          aria-label={selectLabel}
          selectedKey={current}
          onSelectionChange={(key) => key !== null && choose(String(key))}
          className="md:hidden"
        >
          {all.map((item) => (
            <SelectItem key={item.key} id={item.key}>
              {item.label}
            </SelectItem>
          ))}
        </Select>

        <nav
          aria-label={navLabel}
          className={cx(
            "hidden shrink-0 flex-col gap-5 md:flex",
            navWidth === "sm" ? "w-48" : "w-60",
          )}
        >
          {groups.map((group, index) => (
            <div key={group.label ?? index} className="flex flex-col gap-1">
              {group.label ? (
                <p className="px-2 pb-1 text-caption-1-semibold text-text-tertiary">{group.label}</p>
              ) : null}
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isSelected = item.key === current;
                  const Icon = item.icon;
                  const classes = cx(
                    "flex w-full items-center gap-2 rounded-2lg p-2 text-start text-body-medium outline-none",
                    "transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                    isSelected
                      ? "bg-background-tertiary-default text-text-primary"
                      : "text-text-secondary hover:bg-background-secondary-hover",
                  );
                  const content = (
                    <>
                      {Icon ? (
                        <Icon
                          className={cx(
                            "size-5 shrink-0",
                            isSelected ? "text-text-brand" : "text-foreground-icon-secondary",
                          )}
                          aria-hidden
                        />
                      ) : null}
                      <span className="truncate">{item.label}</span>
                    </>
                  );
                  return (
                    <li key={item.key}>
                      {item.href ? (
                        <a
                          href={item.href}
                          aria-current={isSelected ? "page" : undefined}
                          onClick={() => choose(item.key)}
                          className={classes}
                        >
                          {content}
                        </a>
                      ) : (
                        <button
                          type="button"
                          aria-current={isSelected ? "page" : undefined}
                          onClick={() => choose(item.key)}
                          className={classes}
                        >
                          {content}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="flex min-w-0 flex-1 flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}

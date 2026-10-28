"use client";

import { useState, type ComponentType } from "react";
import { RiArrowDownSLine, RiArrowUpSLine } from "@remixicon/react";
import { cx } from "@/utils/cx";

/**
 * DockBar: menu flutuante embaixo da tela, para acesso rápido e navegação
 * móvel. Pílula sobre superfície com sombra do tema; recolhível.
 */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface DockBarItem {
  id: string;
  label: string;
  icon: IconComponent;
  href?: string;
  isDisabled?: boolean;
}

export interface DockBarProps {
  items: DockBarItem[];
  activeId?: string;
  onSelect?: (id: string) => void;
  /** `center` hugs the content; `stretched` ocupa a largura disponível. */
  position?: "center" | "stretched";
  /** `viewport` fixa na janela; `container` fixa no contêiner relativo; `inline` no fluxo. */
  anchor?: "viewport" | "container" | "inline";
  /** Mostra o botão de recolher. */
  collapsible?: boolean;
  defaultCollapsed?: boolean;
  isCollapsed?: boolean;
  onCollapsedChange?: (isCollapsed: boolean) => void;
  "aria-label"?: string;
  collapseLabel?: string;
  expandLabel?: string;
  className?: string;
}

const ANCHOR = {
  viewport: "fixed inset-x-0 bottom-4 z-40",
  container: "absolute inset-x-0 bottom-4 z-40",
  inline: "relative",
} as const;

export function DockBar({
  items,
  activeId,
  onSelect,
  position = "center",
  anchor = "viewport",
  collapsible = false,
  defaultCollapsed = false,
  isCollapsed: controlled,
  onCollapsedChange,
  "aria-label": ariaLabel = "Navegação rápida",
  collapseLabel = "Recolher menu",
  expandLabel = "Expandir menu",
  className,
}: DockBarProps) {
  const [internal, setInternal] = useState(defaultCollapsed);
  const collapsed = collapsible && (controlled ?? internal);
  const toggle = () => {
    setInternal(!collapsed);
    onCollapsedChange?.(!collapsed);
  };
  const stretched = position === "stretched";

  return (
    <div
      className={cx(
        "pointer-events-none flex px-3",
        ANCHOR[anchor],
        stretched && !collapsed ? "justify-stretch" : "justify-center",
        className,
      )}
    >
      <nav
        aria-label={ariaLabel}
        className={cx(
          "pointer-events-auto flex items-center gap-1 rounded-full border border-border-button-default",
          "bg-background-primary-default p-1.5 shadow-dropdown",
          "transition-[width,padding] duration-200 ease-out motion-reduce:transition-none",
          stretched && !collapsed ? "w-full max-w-3xl" : "max-w-full",
        )}
      >
        {!collapsed && (
          <ul className={cx("flex min-w-0 items-center gap-1", stretched && "flex-1")}>
            {items.map((item) => {
              const active = item.id === activeId;
              const Icon = item.icon;
              const classes = cx(
                "flex min-w-14 cursor-pointer flex-col items-center gap-0.5 rounded-full px-3 py-1.5 outline-none",
                "transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-border-focus-ring",
                stretched && "flex-1",
                active
                  ? "bg-background-secondary-hover text-text-primary"
                  : "text-text-secondary hover:bg-background-secondary-hover/60",
                item.isDisabled && "pointer-events-none text-text-tertiary",
              );
              const content = (
                <>
                  <Icon
                    className={cx("size-5 shrink-0", active ? "text-text-brand" : "text-foreground-icon-secondary")}
                    aria-hidden
                  />
                  <span className="max-w-full truncate text-caption-1-semibold">{item.label}</span>
                </>
              );
              return (
                <li key={item.id} className={cx("flex", stretched && "flex-1")}>
                  {item.href ? (
                    <a
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      aria-disabled={item.isDisabled || undefined}
                      onClick={() => onSelect?.(item.id)}
                      className={cx(classes, "w-full")}
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      type="button"
                      aria-current={active ? "page" : undefined}
                      disabled={item.isDisabled}
                      onClick={() => onSelect?.(item.id)}
                      className={cx(classes, "w-full")}
                    >
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {collapsible && (
          <button
            type="button"
            aria-expanded={!collapsed}
            aria-label={collapsed ? expandLabel : collapseLabel}
            onClick={toggle}
            className={cx(
              "flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full",
              "text-foreground-icon-secondary outline-none transition-colors duration-150",
              "hover:bg-background-secondary-hover/60 focus-visible:ring-2 focus-visible:ring-border-focus-ring",
            )}
          >
            {collapsed ? <RiArrowUpSLine className="size-5" aria-hidden /> : <RiArrowDownSLine className="size-5" aria-hidden />}
          </button>
        )}
      </nav>
    </div>
  );
}

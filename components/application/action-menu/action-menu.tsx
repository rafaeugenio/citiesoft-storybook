"use client";

import { useMemo, useRef, useState, type ComponentType, type ReactNode } from "react";
import {
  Button as AriaButton,
  Header,
  Keyboard,
  Menu,
  MenuItem,
  MenuSection,
  MenuTrigger,
  Popover,
  Separator,
} from "react-aria-components";
import { RiArrowDownSLine, RiMore2Fill } from "@remixicon/react";
import { MENU_POPOVER_SURFACE } from "@/components/base/dropdown/menu-styles";
import { cx } from "@/utils/cx";
import { useDismissOnOutsidePress, useTriggerToggle } from "@/utils/use-dismiss-on-outside-press";

/**
 * ActionMenu: menu suspenso de ações ("Mais ações", três pontos de linha).
 * Navegação por setas, busca por letra, Esc fecha e devolve o foco ao gatilho.
 */

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface ActionMenuItem {
  type?: "item";
  id: string;
  label: string;
  icon?: IconComponent;
  /** Texto do atalho exibido à direita (ex.: "⌘E"). */
  shortcut?: string;
  tone?: "default" | "danger";
  isDisabled?: boolean;
  onAction?: () => void;
}

export interface ActionMenuSection {
  type: "section";
  id: string;
  label?: string;
  items: ActionMenuItem[];
}

export interface ActionMenuSeparator {
  type: "separator";
}

export type ActionMenuEntry = ActionMenuItem | ActionMenuSection | ActionMenuSeparator;

export type ActionMenuPlacement = "bottom" | "top" | "end";

export interface ActionMenuProps {
  items: ActionMenuEntry[];
  /** Nome acessível do menu (e do gatilho padrão). */
  "aria-label"?: string;
  placement?: ActionMenuPlacement;
  /** Gatilho padrão: com `label` vira botão com texto e seta; sem, três pontos. */
  label?: string;
  /** Conteúdo próprio do gatilho (renderizado dentro do botão). */
  trigger?: ReactNode;
  triggerClassName?: string;
  isDisabled?: boolean;
  onAction?: (id: string) => void;
  className?: string;
}

const PLACEMENT: Record<ActionMenuPlacement, "bottom start" | "top start" | "end top"> = {
  bottom: "bottom start",
  top: "top start",
  end: "end top",
};

const ITEM_BASE = [
  "flex w-full cursor-pointer items-center gap-2 rounded-2lg p-2 text-start text-body-medium outline-none",
  "transition-colors data-[focused]:bg-dropdown-item-hover-background data-[hovered]:bg-dropdown-item-hover-background",
  "data-[disabled]:cursor-not-allowed data-[disabled]:text-text-tertiary",
].join(" ");

function renderItem(item: ActionMenuItem) {
  const Icon = item.icon;
  const danger = item.tone === "danger";
  return (
    <MenuItem
      key={item.id}
      id={item.id}
      textValue={item.label}
      isDisabled={item.isDisabled}
      onAction={item.onAction}
      className={cx(ITEM_BASE, danger ? "text-text-error-primary" : "text-text-primary")}
    >
      {Icon && (
        <Icon
          className={cx("size-5 shrink-0", danger ? "text-text-error-primary" : "text-foreground-icon-secondary")}
          aria-hidden
        />
      )}
      <span className="flex-1 truncate">{item.label}</span>
      {item.shortcut && <Keyboard className="ms-4 text-body-2-medium text-text-tertiary">{item.shortcut}</Keyboard>}
    </MenuItem>
  );
}

const SEPARATOR = "-mx-2.5 my-1 h-px shrink-0 bg-border-button-default";

export function ActionMenu({
  items,
  "aria-label": ariaLabel = "Mais ações",
  placement = "bottom",
  label,
  trigger,
  triggerClassName,
  isDisabled,
  onAction,
  className,
}: ActionMenuProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const [isOpen, setOpen] = useState(false);
  const refs = useMemo(() => [triggerRef, popoverRef], []);

  useDismissOnOutsidePress(isOpen, () => setOpen(false), refs);
  const allowOpenChange = useTriggerToggle(isOpen, triggerRef);

  return (
    <MenuTrigger isOpen={isOpen} onOpenChange={(open) => allowOpenChange(open) && setOpen(open)}>
      <AriaButton
        ref={triggerRef}
        aria-label={label && !trigger ? undefined : ariaLabel}
        isDisabled={isDisabled}
        className={cx(
          "inline-flex shrink-0 cursor-pointer items-center justify-center outline-none",
          "focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed",
          !trigger && !label && [
            "size-8 rounded-lg text-foreground-icon-secondary hover:bg-button-ghost-hover",
            "data-[pressed]:bg-button-ghost-active data-[disabled]:text-text-tertiary",
          ],
          !trigger && label && [
            "h-9 gap-1 rounded-2lg border border-border-button-default bg-background-primary-default px-3",
            "text-body-medium text-text-primary shadow-xs hover:bg-background-primary-hover",
            "data-[disabled]:bg-background-primary-disabled data-[disabled]:text-text-tertiary",
          ],
          triggerClassName,
        )}
      >
        {trigger ?? (
          label ? (
            <>
              {label}
              <RiArrowDownSLine className="size-5 text-foreground-icon-secondary" aria-hidden />
            </>
          ) : (
            <RiMore2Fill className="size-5" aria-hidden />
          )
        )}
      </AriaButton>
      <Popover
        ref={popoverRef}
        isNonModal
        placement={PLACEMENT[placement]}
        offset={4}
        className={cx(MENU_POPOVER_SURFACE, "min-w-[220px]", className)}
      >
        <Menu
          aria-label={ariaLabel}
          onAction={(key) => {
            onAction?.(String(key));
            setOpen(false);
          }}
          className="flex flex-col gap-1 outline-none"
        >
          {items.map((entry, index) => {
            if (entry.type === "separator") {
              return <Separator key={`sep-${index}`} className={SEPARATOR} />;
            }
            if (entry.type === "section") {
              return (
                <MenuSection key={entry.id} className="flex flex-col gap-1">
                  {index > 0 && items[index - 1]?.type !== "separator" && (
                    <Separator className={SEPARATOR} />
                  )}
                  {entry.label && (
                    <Header className="px-2 pt-1 text-body-2-medium text-text-secondary">{entry.label}</Header>
                  )}
                  {entry.items.map(renderItem)}
                </MenuSection>
              );
            }
            return renderItem(entry);
          })}
        </Menu>
      </Popover>
    </MenuTrigger>
  );
}

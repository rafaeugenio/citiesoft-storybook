"use client";

import { useState, type ComponentType, type ReactNode } from "react";
import { Dialog, Modal, ModalOverlay } from "react-aria-components";
import { RiCloseLine, RiMenuLine, RiNotification3Line, RiSearchLine } from "@remixicon/react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badge";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { IconButton } from "@/components/base/buttons/icon-button";
import {
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownPopover,
  DropdownTrigger,
} from "@/components/base/dropdown/dropdown";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";
import { BrandLogo } from "./brand-logo";

type IconComponent = ComponentType<{
  className?: string;
  "aria-hidden"?: boolean | "true" | "false";
}>;

export interface AppFrameNavItem {
  key: string;
  label: string;
  icon: IconComponent;
  href?: string;
  badge?: string | number;
}

export interface AppFrameNavGroup {
  /** Título do grupo. Sem título, o grupo aparece só como bloco de itens. */
  label?: string;
  items: AppFrameNavItem[];
}

export interface AppFrameUser {
  name: string;
  /** Perfil ou cargo, exibido abaixo do nome. */
  role?: string;
  initials?: string;
  src?: string;
}

export interface AppFrameUserMenuItem {
  key: string;
  label: string;
  icon?: IconComponent;
  onSelect?: () => void;
}

export interface AppFrameCrumb {
  label: string;
  href?: string;
}

export interface AppFrameProps {
  /** Grupos de navegação da barra lateral. */
  navGroups: AppFrameNavGroup[];
  /** Chave do item selecionado. */
  selected?: string;
  onNavigate?: (item: AppFrameNavItem) => void;
  /** Rótulo único da navegação principal (leitores de tela). */
  navLabel?: string;
  user: AppFrameUser;
  /** Itens do menu do avatar na barra superior. */
  userMenuItems?: AppFrameUserMenuItem[];
  /** Marca no topo da barra lateral. O logo Citiesoft muda conforme o tema. */
  brand?: ReactNode;
  /** Rodapé da barra lateral, acima do usuário (ajuda, versão, tema). */
  sidebarFooter?: ReactNode;
  /** Trilha da barra superior. O último item é a página atual. */
  breadcrumb?: AppFrameCrumb[];
  /** Mostra a busca na barra superior. */
  showSearch?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  /** Quantidade de notificações não lidas. Zero oculta o contador. */
  notificationCount?: number;
  onNotificationsClick?: () => void;
  /** Ações extras na barra superior, antes das notificações. */
  topBarActions?: ReactNode;
  /** Altura fixa de janela (previews). Sem isso a moldura ocupa a viewport. */
  contained?: boolean;
  children: ReactNode;
  className?: string;
}

function NavLink({
  item,
  isSelected,
  onNavigate,
}: {
  item: AppFrameNavItem;
  isSelected: boolean;
  onNavigate?: (item: AppFrameNavItem) => void;
}) {
  const Icon = item.icon;
  return (
    <a
      href={item.href ?? "#"}
      aria-current={isSelected ? "page" : undefined}
      onClick={(event) => {
        if (!item.href || item.href === "#") event.preventDefault();
        onNavigate?.(item);
      }}
      className={cx(
        "flex items-center justify-between gap-2 rounded-2lg p-2 outline-none",
        "transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-border-focus-ring",
        isSelected
          ? "bg-linear-to-b from-accent-500 to-accent-600 shadow-nav-selected"
          : "hover:bg-background-secondary-hover",
      )}
    >
      <span className="flex min-w-0 items-center gap-2">
        <Icon
          className={cx("size-5 shrink-0", isSelected ? "text-white" : "text-foreground-icon-secondary")}
          aria-hidden
        />
        <span
          className={cx("truncate text-body-medium", isSelected ? "text-white" : "text-text-secondary")}
        >
          {item.label}
        </span>
      </span>
      {item.badge !== undefined ? (
        <Badge color={isSelected ? "primary" : "neutral"}>{item.badge}</Badge>
      ) : null}
    </a>
  );
}

function Sidebar({
  navGroups,
  selected,
  onNavigate,
  navLabel,
  user,
  brand,
  sidebarFooter,
  onClose,
}: Pick<
  AppFrameProps,
  "navGroups" | "selected" | "onNavigate" | "navLabel" | "user" | "brand" | "sidebarFooter"
> & { onClose?: () => void }) {
  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col justify-between overflow-hidden rounded-3xl border border-border-button-white bg-background-secondary-default p-3 shadow-sidebar">
      <div className="flex min-h-0 flex-col gap-4">
        <div className="flex items-center justify-between gap-2 px-1 pt-1">
          {brand ?? <BrandLogo />}
          {onClose ? (
            <IconButton icon={RiCloseLine} size="small" aria-label="Fechar navegação" onClick={onClose} />
          ) : null}
        </div>
        <nav
          aria-label={navLabel ?? "Navegação principal"}
          className="flex min-h-0 flex-col gap-4 overflow-y-auto [scrollbar-width:none]"
        >
          {navGroups.map((group, index) => (
            <div key={group.label ?? index} className="flex flex-col gap-1">
              {group.label ? (
                <p className="px-2 pb-1 text-caption-1-semibold text-text-tertiary">{group.label}</p>
              ) : null}
              <ul className="flex flex-col gap-1">
                {group.items.map((item) => (
                  <li key={item.key}>
                    <NavLink item={item} isSelected={selected === item.key} onNavigate={onNavigate} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="flex shrink-0 flex-col gap-3 pt-3">
        {sidebarFooter}
        <div className="flex items-center gap-2 rounded-2lg bg-background-tertiary-default p-2">
          <Avatar size="md" color="blue" initials={user.initials ?? user.name.slice(0, 1)} src={user.src} alt="" />
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-body-medium text-text-primary">{user.name}</span>
            {user.role ? <span className="truncate text-caption-1-regular text-text-secondary">{user.role}</span> : null}
          </div>
        </div>
      </div>
    </aside>
  );
}

/**
 * Moldura de sistema Citiesoft: barra lateral com grupos de navegação, barra
 * superior (trilha, busca, notificações, avatar com menu) e área de conteúdo.
 * Abaixo de `lg` a barra lateral vira uma gaveta aberta pelo botão de menu.
 */
export function AppFrame({
  navGroups,
  selected,
  onNavigate,
  navLabel,
  user,
  userMenuItems,
  brand,
  sidebarFooter,
  breadcrumb,
  showSearch = false,
  searchPlaceholder = "Buscar",
  onSearch,
  notificationCount = 0,
  onNotificationsClick,
  topBarActions,
  contained = false,
  children,
  className,
}: AppFrameProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const sidebarProps = { navGroups, selected, onNavigate, navLabel, user, brand, sidebarFooter };

  return (
    <div
      className={cx(
        "flex w-full gap-3 overflow-hidden bg-background-full p-3",
        contained ? "h-[var(--template-preview-height,640px)]" : "h-dvh",
        className,
      )}
    >
      <div className="hidden h-full shrink-0 lg:block">
        <Sidebar {...sidebarProps} />
      </div>

      <ModalOverlay
        isOpen={drawerOpen}
        onOpenChange={setDrawerOpen}
        isDismissable
        className="fixed inset-0 z-50 bg-black/30 lg:hidden"
      >
        <Modal className="fixed inset-y-0 start-0 h-full w-[284px] p-3 outline-none">
          <Dialog aria-label="Navegação" className="h-full outline-none">
            <Sidebar
              {...sidebarProps}
              onNavigate={(item) => {
                onNavigate?.(item);
                setDrawerOpen(false);
              }}
              onClose={() => setDrawerOpen(false)}
            />
          </Dialog>
        </Modal>
      </ModalOverlay>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <header className="flex shrink-0 items-center gap-2 px-1">
          <IconButton
            icon={RiMenuLine}
            size="medium"
            aria-label="Abrir navegação"
            onClick={() => setDrawerOpen(true)}
            className="lg:hidden"
          />
          <div className="min-w-0 flex-1">
            {breadcrumb && breadcrumb.length > 0 ? (
              <Breadcrumb aria-label="Trilha de navegação">
                {breadcrumb.map((crumb, index) => (
                  <BreadcrumbItem
                    key={crumb.label}
                    href={crumb.href ?? "#"}
                    current={index === breadcrumb.length - 1}
                  >
                    {crumb.label}
                  </BreadcrumbItem>
                ))}
              </Breadcrumb>
            ) : null}
          </div>
          {showSearch ? (
            <Input
              aria-label={searchPlaceholder}
              type="search"
              placeholder={`${searchPlaceholder}…`}
              leadingIcon={RiSearchLine}
              onChange={onSearch}
              className="hidden w-64 sm:flex"
            />
          ) : null}
          {topBarActions}
          <div className="relative">
            <IconButton
              icon={RiNotification3Line}
              size="medium"
              aria-label={
                notificationCount > 0 ? `Notificações, ${notificationCount} não lidas` : "Notificações"
              }
              onClick={onNotificationsClick}
            />
            {notificationCount > 0 ? (
              <Badge color="primary" aria-hidden className="pointer-events-none absolute -end-1 -top-1">
                {notificationCount}
              </Badge>
            ) : null}
          </div>
          <Dropdown>
            <DropdownTrigger aria-label={`Menu de ${user.name}`} className="rounded-full">
              <Avatar size="lg" color="blue" initials={user.initials ?? user.name.slice(0, 1)} src={user.src} alt="" />
            </DropdownTrigger>
            <DropdownPopover aria-label="Menu do usuário" placement="bottom end" className="w-60">
              <div className="flex flex-col px-2 py-1.5">
                <span className="text-body-medium text-text-primary">{user.name}</span>
                {user.role ? <span className="text-caption-1-regular text-text-secondary">{user.role}</span> : null}
              </div>
              {userMenuItems && userMenuItems.length > 0 ? (
                <DropdownGroup>
                  {userMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <DropdownItem key={item.key} onSelect={item.onSelect}>
                        {Icon ? <Icon className="size-5 shrink-0 text-foreground-icon-secondary" aria-hidden /> : null}
                        <span className="text-body-medium text-text-primary">{item.label}</span>
                      </DropdownItem>
                    );
                  })}
                </DropdownGroup>
              ) : null}
            </DropdownPopover>
          </Dropdown>
        </header>
        <main className="min-h-0 flex-1 overflow-y-auto rounded-3xl">{children}</main>
      </div>
    </div>
  );
}

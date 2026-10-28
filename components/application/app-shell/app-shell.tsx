"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import {
  RiAddFill,
  RiChatAiLine,
  RiCloseLine,
  RiDashboardLine,
  RiFilter3Fill,
  RiMenuLine,
} from "@remixicon/react";
import type { ComponentType } from "react";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";

import {
  DashboardSidebar,
  type DashboardNavItem,
} from "@/components/application/dashboard/dashboard-sidebar";
import { NotificationBell } from "@/components/application/app-shell/notification-bell";
import { Avatar } from "@/components/base/avatar/avatar";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { cx } from "@/utils/cx";

/**
 * Moldura de página do chat inicial: barra lateral, gaveta no celular e um cartão de
 * conteúdo com título. A navegação é a mesma do chat, então a barra só aponta para
 * páginas que o sistema realmente tem.
 */

/** Prefixo das rotas do chat inicial; vazio quando ele é a raiz do sistema. */
export function useStarterBase(): string {
  return "";
}

export function starterNav(base: string): DashboardNavItem[] {
  return [
    { key: "chat", label: "Chat", icon: RiChatAiLine, href: base || "/" },
    { key: "dashboard", label: "Dashboard", icon: RiDashboardLine, href: `${base}/dashboard` },
  ];
}

/** The nav key of the page at the current URL. */
export function useStarterSelected(): string {
  const pathname = usePathname() ?? "";
  const base = useStarterBase();
  const rest = pathname.slice(base.length);
  if (rest.startsWith("/dashboard")) return "dashboard";
  return "chat";
}

type IconComponent = ComponentType<{ className?: string; "aria-hidden"?: boolean | "true" | "false" }>;

/**
 * O padrão de página de todo template do Design System Citiesoft: o conteúdo fica
 * direto sobre o fundo, numa coluna de 1300px, e cartões e tabelas trazem a própria
 * superfície. Acima dele ficam a trilha de navegação (equipe, pessoa, página) e o título.
 */
export function AppShell({
  title,
  heading = title,
  icon: Icon = RiDashboardLine,
  actions,
  children,
  className,
  columnClassName,
}: {
  /** The page's name, shown as the current breadcrumb item. */
  title: string;
  /** The heading over the content. Defaults to the title. */
  heading?: string;
  /** Icon on the current breadcrumb item. */
  icon?: IconComponent;
  /** Header actions on the right; the dashboard's set by default, `null` for none. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  /** Overrides the 1300px content column, e.g. `max-w-[964px]` for the catalogue's grids. */
  columnClassName?: string;
}) {
  const localize = useTemplateCopy();
  const [navOpen, setNavOpen] = useState(false);
  const items = starterNav(useStarterBase());
  const selected = useStarterSelected();

  return localize((
    <div
      className={cx(
        "relative flex h-dvh w-full gap-4 overflow-hidden bg-background-full p-3",
        className,
      )}
    >
      <DashboardSidebar items={items} selected={selected} className="hidden lg:flex" />

      {/* Below lg the sidebar rides in as an overlay drawer. */}
      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setNavOpen(false)}
            className="absolute inset-0 cursor-pointer bg-black/40"
          />
          <div className="relative flex h-full p-3">
            <DashboardSidebar
              mobile
              items={items}
              selected={selected}
              onClose={() => setNavOpen(false)}
              className="flex"
            />
          </div>
        </div>
      )}

      <main className="relative flex min-h-0 min-w-0 flex-1 justify-center overflow-x-hidden overflow-y-auto bg-background-full sm:pt-3">
        <div className={cx("flex w-full max-w-[1300px] flex-col gap-2.5", columnClassName)}>
          <header className="flex w-full flex-col gap-2">
            <Breadcrumb>
              <BreadcrumbItem href="#">
                <Avatar size="xs" color="blue" initials="C" />
                Equipe Citiesoft
              </BreadcrumbItem>
              <BreadcrumbItem href="#">
                <Avatar size="xs" color="neutral" initials="M" />
                Marina Souza
              </BreadcrumbItem>
              <BreadcrumbItem current icon={Icon}>
                {title}
              </BreadcrumbItem>
            </Breadcrumb>
            <div className="flex w-full flex-wrap items-end justify-between gap-2">
              <div className="flex min-w-0 items-center gap-1.5">
                <IconButton
                  icon={navOpen ? RiCloseLine : RiMenuLine}
                  size="medium"
                  aria-label="Open navigation"
                  onClick={() => setNavOpen((open) => !open)}
                  className="lg:hidden"
                />
                <h1 className="px-1 text-title-2-medium whitespace-nowrap text-text-primary">
                  {heading}
                </h1>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2.5">
                {actions !== undefined ? actions : (
                  <>
                    <NotificationBell />
                    <Button variant="secondary" size="medium" leadingIcon={RiFilter3Fill}>
                      Filters
                    </Button>
                    <Button variant="primary" size="medium" leadingIcon={RiAddFill}>
                      Create ticket
                    </Button>
                  </>
                )}
              </div>
            </div>
          </header>
          <div className="flex w-full flex-col gap-4 pb-4">{children}</div>
        </div>
      </main>
    </div>
  ));
}

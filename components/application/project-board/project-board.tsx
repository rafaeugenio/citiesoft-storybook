"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import { useDirection } from "@/components/foundations/direction/direction";
import { useCallback, useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion } from "motion/react";
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  MeasuringStrategy,
  closestCenter,
  closestCorners,
  pointerWithin,
  defaultDropAnimationSideEffects,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
  useDndContext,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  RiAddLine,
  RiArrowRightSLine,
  RiFolder6Line,
  RiInbox2Line,
  RiKanbanView2,
  RiMenuLine,
  RiMoreLine,
} from "@remixicon/react";

import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Breadcrumb, BreadcrumbItem } from "@/components/base/breadcrumb/breadcrumb";
import { Button } from "@/components/base/buttons/button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { TemplateNotificationCenterMenu } from "@/components/application/notification-center/template-notification-center-menu";
import { cx } from "@/utils/cx";
import { ProjectBoardEmptyState } from "./project-board-empty-state";
import { CreateTicketModal, type NewProjectTicket } from "./create-ticket-modal";
import { TicketDetailModal } from "./ticket-detail-modal";
import { ProjectBoardControls, type BoardSort } from "./project-board-controls";
import {
  PROJECT_COLUMNS,
  PROJECT_MEMBERS,
  type ProjectColumn,
  type ProjectTicket,
  type TicketPriority,
} from "./project-board-data";

const PRIORITY_STYLES: Record<TicketPriority, string> = {
  Low: "bg-status-blue-background text-status-blue-text",
  Medium: "bg-status-yellow-background text-status-yellow-text",
  High: "bg-status-orange-background text-status-orange-text",
  Urgent: "bg-status-rose-background text-status-rose-text",
};
const subscribeToDocument = () => () => {};
const getPortalRoot = () => document.body;
const getServerPortalRoot = () => null;
const SORT_TRANSITION = { duration: 260, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
const DROP_TRANSITION = { duration: 320, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };
const DROP_SIDE_EFFECTS = defaultDropAnimationSideEffects({
  styles: { active: { opacity: "0" } },
});

// Pick the column under the pointer first. Comparing every card's corners
// across columns makes short lists steal the drop from a neighbouring list.
const boardCollisionDetection: CollisionDetection = (args) => {
  if (!args.pointerCoordinates) return closestCorners(args);
  const columnHit = pointerWithin({
    ...args,
    droppableContainers: args.droppableContainers.filter((item) => item.data.current?.type === "column"),
  })[0];
  if (!columnHit) return [];
  const tickets = args.droppableContainers.filter(
    (item) => item.data.current?.type === "ticket" && item.data.current.columnId === columnHit.id,
  );
  if (!tickets.length) return [columnHit];
  return closestCenter({ ...args, droppableContainers: tickets });
};

function cloneColumns(columns: ProjectColumn[]): ProjectColumn[] {
  return columns.map((column) => ({ ...column, tickets: column.tickets.map((ticket) => ({ ...ticket, createdBy: ticket.createdBy ?? ticket.assignees[0] ?? "maya" })) }));
}

function columnFor(columns: ProjectColumn[], id: UniqueIdentifier | null) {
  if (id === null) return null;
  const key = String(id);
  return (
    columns.find((column) => column.id === key)?.id ??
    columns.find((column) => column.tickets.some((ticket) => ticket.id === key))?.id ??
    null
  );
}

function ticketFor(columns: ProjectColumn[], id: UniqueIdentifier | null) {
  if (id === null) return null;
  return columns.flatMap((column) => column.tickets).find((ticket) => ticket.id === String(id)) ?? null;
}

function MemberAvatars({ ids }: { ids: string[] }) {
  const localize = useTemplateCopy();
  return localize((
    <div className="flex items-center ps-1" aria-label={ids.map((id) => PROJECT_MEMBERS[id]?.name).filter(Boolean).join(", ")}>
      {ids.map((id, index) => {
        const member = PROJECT_MEMBERS[id];
        if (!member) return null;
        return (
          <Avatar
            key={member.id}
            size="sm"
            src={member.avatar}
            alt={member.name}
            initials={member.initials}
            className={cx("size-[22px] ring-2 ring-background-primary-default", index > 0 && "-ms-1.5")}
          />
        );
      })}
    </div>
  ));
}

function TicketCard({
  ticket,
  overlay = false,
}: {
  ticket: ProjectTicket;
  overlay?: boolean;
}) {
  const localize = useTemplateCopy();
  return localize((
    <article
      className={cx(
        "relative flex w-full flex-col gap-2 rounded-xl bg-background-primary-default p-3 text-start shadow-[0_1px_1px_rgb(0_0_0/0.05)] dark:bg-background-primary-default/60",
        "ring-[2.5px] ring-transparent transition-[box-shadow,opacity] duration-200 ease-out motion-reduce:transition-none",
        overlay
          ? "cursor-grabbing dark:backdrop-blur-[12px]"
          : "cursor-grab hover:shadow-sm hover:ring-border-button-hover active:cursor-grabbing",
      )}
    >
      <div className="flex min-h-[22px] items-start justify-between gap-3">
        <div className="flex min-w-0 items-center text-body-2-medium text-text-secondary">
          <span className="shrink-0">{ticket.code}</span>
          <RiArrowRightSLine className="size-[15px] shrink-0 text-foreground-icon-tertiary rtl:rotate-180" aria-hidden />
          <span className="truncate">{ticket.area}</span>
        </div>
        <MemberAvatars ids={ticket.assignees} />
      </div>
      <div className="flex flex-col items-start gap-2">
        <div className="flex items-center gap-1.5">
          <Chip className={cx("text-body-2-medium", PRIORITY_STYLES[ticket.priority])}>
            {ticket.priority}
          </Chip>
          <Chip className="gap-1 bg-background-primary-default text-body-2-medium text-text-primary ring-1 ring-inset ring-border-button-default">
            <RiFolder6Line className="size-[13px] shrink-0 opacity-30" aria-hidden />
            <span className="text-text-secondary">{ticket.project}</span>
          </Chip>
        </div>
        <div className="flex w-full flex-col gap-[5px]">
          <h3 className="text-body-medium text-text-primary">{ticket.title}</h3>
          <p className="text-body-2-medium text-text-secondary">{ticket.since}</p>
        </div>
      </div>
    </article>
  ));
}

function SortableTicket({ ticket, columnId, onOpen }: { ticket: ProjectTicket; columnId: string; onOpen: (id: string) => void }) {
  const localize = useTemplateCopy();
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLDivElement | null>(null);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: ticket.id,
    data: {
      type: "ticket",
      ticket,
      columnId,
      getDragDimensions: () => {
        const node = cardRef.current;
        if (!node) return null;
        return { layoutWidth: node.offsetWidth, renderedWidth: node.getBoundingClientRect().width };
      },
    },
    transition: reduceMotion ? null : SORT_TRANSITION,
    animateLayoutChanges: ({ isSorting, wasDragging }) => isSorting || wasDragging,
  });
  const setCardRef = useCallback((node: HTMLDivElement | null) => {
    cardRef.current = node;
    setNodeRef(node);
  }, [setNodeRef]);

  return localize((
    <div
      ref={setCardRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cx("shrink-0 touch-manipulation rounded-xl outline-none focus-visible:ring-[2.5px] focus-visible:ring-border-button-hover", isDragging && "opacity-20")}
      {...attributes}
      {...listeners}
      aria-label={`Open ${ticket.code}: ${ticket.title}`}
      aria-haspopup="dialog"
      onClick={(event) => { event.currentTarget.focus(); onOpen(ticket.id); }}
      onKeyDown={(event) => {
        if (event.key === "Enter") { event.preventDefault(); onOpen(ticket.id); }
        else listeners?.onKeyDown?.(event);
      }}
    >
      {/* Animate inside the measured node so scaling never changes the drop target. */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.7, filter: "blur(6px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
      >
        <TicketCard ticket={ticket} />
      </motion.div>
    </div>
  ));
}

function TicketPresence({ ticket, columnId, onOpen }: { ticket: ProjectTicket; columnId: string; onOpen: (id: string) => void }) {
  const localize = useTemplateCopy();
  const isPresent = useIsPresent();
  const reduceMotion = useReducedMotion();
  const { measureDroppableContainers } = useDndContext();
  const transition = { duration: reduceMotion ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] as const };

  return localize((
    <motion.div
      initial={reduceMotion ? false : { height: 0, paddingBottom: 0 }}
      animate={{ height: "auto", paddingBottom: 6 }}
      exit={{ height: 0, paddingBottom: 0 }}
      transition={transition}
      // The cards keep their own size while this slot resizes, so their
      // ResizeObservers cannot detect the changing positions of their siblings.
      onUpdate={() => measureDroppableContainers([])}
      onAnimationComplete={() => measureDroppableContainers([])}
      className="relative shrink-0 pb-1.5"
      aria-hidden={!isPresent || undefined}
      inert={!isPresent}
    >
      <motion.div
        initial={false}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.7, filter: reduceMotion ? "blur(0px)" : "blur(6px)" }}
        transition={transition}
      >
        {isPresent ? (
          <SortableTicket ticket={ticket} columnId={columnId} onOpen={onOpen} />
        ) : (
          // Unregister the old sortable immediately; only its visual ghost remains.
          <div className="pointer-events-none opacity-20">
            <TicketCard ticket={ticket} overlay />
          </div>
        )}
      </motion.div>
    </motion.div>
  ));
}

function BoardColumn({
  column,
  onAdd,
  onOpen,
}: {
  column: ProjectColumn;
  onAdd: (columnId: string) => void;
  onOpen: (id: string) => void;
}) {
  const localize = useTemplateCopy();
  const [scrollFade, setScrollFade] = useState(0);
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: "column", columnId: column.id },
  });

  return localize((
    <section
      ref={setNodeRef}
      className={cx(
        "relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2-5xl bg-background-secondary-default pt-3",
        "ring-2 ring-inset ring-transparent transition-[box-shadow,background-color] duration-150 ease-out",
        isOver && "bg-background-secondary-hover ring-border-button-hover",
      )}
    >
      <div className="flex h-5 shrink-0 items-center justify-between px-3">
        <div className="flex min-w-0 items-center gap-1.5">
          <h2 className="truncate text-body-medium text-text-primary">{column.title}</h2>
          <span className="text-body-medium text-text-secondary">
            {column.tickets.length}/{column.limit}
          </span>
        </div>
        <div className="flex items-center gap-1 text-foreground-icon-secondary">
          <button
            type="button"
            aria-label={`More options for ${column.title}`}
            className="flex size-5 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 hover:bg-background-tertiary-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiMoreLine className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label={`Add ticket to ${column.title}`}
            onClick={() => onAdd(column.id)}
            className="flex size-5 cursor-pointer items-center justify-center rounded-md transition-colors duration-150 hover:bg-background-tertiary-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring"
          >
            <RiAddLine className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        {/* Keep the items reference stable during pointer updates so reorder transitions stay enabled. */}
        <SortableContext items={column.tickets} strategy={verticalListSortingStrategy}>
          <div
            role="region"
            aria-label={`${column.title} tickets`}
            tabIndex={0}
            onScroll={(event) => setScrollFade(Math.min(1, Math.max(0, event.currentTarget.scrollTop) / 24))}
            className="flex h-full min-h-0 flex-col overflow-x-hidden overflow-y-auto overscroll-y-contain px-1.5 pt-2 [scrollbar-width:thin] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-button-hover"
          >
            <AnimatePresence initial={false}>
              {column.tickets.map((ticket) => (
                <TicketPresence key={ticket.id} ticket={ticket} columnId={column.id} onOpen={onOpen} />
              ))}
            </AnimatePresence>
          </div>
        </SortableContext>
        {/* Fade each layer separately: parent opacity creates a backdrop root that hides the cards from the blur. */}
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6">
          <div className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_bottom,black,transparent)]" style={{ opacity: scrollFade }} />
          <div className="absolute inset-x-0 top-0 h-4 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black,transparent)]" style={{ opacity: scrollFade }} />
          <div className={cx("absolute inset-0 bg-linear-to-b to-transparent", isOver ? "from-background-secondary-hover" : "from-background-secondary-default")} style={{ opacity: scrollFade }} />
        </div>
      </div>
      <AnimatePresence>
        {column.tickets.length === 0 ? <ProjectBoardEmptyState key="empty" /> : null}
      </AnimatePresence>
    </section>
  ));
}

function ProjectBoardHeader({
  controls,
  onMenuClick,
  onAddTicket,
}: {
  controls: ReactNode;
  onMenuClick?: () => void;
  onAddTicket: () => void;
}) {
  const localize = useTemplateCopy();
  return localize((
    <header className="flex w-full shrink-0 flex-col gap-2 sm:gap-0">
      <Breadcrumb>
        <BreadcrumbItem href="/templates/dashboard">
          <Avatar size="xs" color="blue" initials="B" />
          Equipe Citiesoft
        </BreadcrumbItem>
        <BreadcrumbItem href="/templates/dashboard">
          <Avatar size="xs" color="neutral" initials="M" />
          Marina
        </BreadcrumbItem>
        <BreadcrumbItem current icon={RiKanbanView2}>
          Project board
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="flex w-full flex-wrap items-end justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1.5">
          {onMenuClick ? (
            <IconButton
              icon={RiMenuLine}
              size="medium"
              aria-label="Open navigation"
              onClick={onMenuClick}
              className="lg:hidden"
            />
          ) : null}
          <h1 className="px-1 text-title-2-medium whitespace-nowrap text-text-primary">Citiesoft Design Tasks</h1>
        </div>

        <div className="flex w-full flex-wrap items-center justify-start gap-2.5 sm:w-auto sm:justify-end">
          <TemplateNotificationCenterMenu unreadCount={5} />
          <IconButton icon={RiInbox2Line} size="medium" aria-label="Open project inbox" />
          {controls}
          <Button variant="primary" size="medium" leadingIcon={RiAddLine} onClick={onAddTicket}>
            New ticket
          </Button>
        </div>
      </div>
    </header>
  ));
}

export function ProjectBoard({ onMenuClick }: { onMenuClick?: () => void } = {}) {
  const localize = useTemplateCopy();
  const direction = useDirection();
  const dndId = useId();
  const reduceMotion = useReducedMotion();
  const [columns, setColumns] = useState(() => cloneColumns(PROJECT_COLUMNS));
  const [activeTicket, setActiveTicket] = useState<ProjectTicket | null>(null);
  const [dragScale, setDragScale] = useState(1);
  const [dragWidth, setDragWidth] = useState(261);
  const portalRoot = useSyncExternalStore<HTMLElement | null>(
    subscribeToDocument,
    getPortalRoot,
    getServerPortalRoot,
  );
  const [sort, setSort] = useState<BoardSort>("manual");
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority | "all">("all");
  const [projectFilter, setProjectFilter] = useState("all");
  const [showDone, setShowDone] = useState(true);
  const [fillColumns, setFillColumns] = useState(true);
  const visibleColumns = useMemo(() => columns.filter(column => showDone || column.id !== "done").map(column => ({
    ...column,
    tickets: column.tickets.filter(ticket => (priorityFilter === "all" || ticket.priority === priorityFilter) && (projectFilter === "all" || ticket.project === projectFilter)),
  })), [columns, showDone, priorityFilter, projectFilter]);
  function sortTickets(value: BoardSort) {
    setSort(value);
    if (value === "manual") return;
    const rank = { Urgent: 0, High: 1, Medium: 2, Low: 3 };
    setColumns(current => current.map(column => ({ ...column, tickets: [...column.tickets].sort((a, b) => value === "priority" ? rank[a.priority] - rank[b.priority] : a.title.localeCompare(b.title)) })));
  }
  const beforeDrag = useRef<ProjectColumn[] | null>(null);
  const [nextTicket, setNextTicket] = useState(90);
  const boardRef = useRef<HTMLDivElement>(null);

  const [createModal, setCreateModal] = useState({ open: false, session: 0, columnId: undefined as string | undefined });

  const [detail, setDetail] = useState({ id: null as string | null, open: false, session: 0 });
  useEffect(() => {
    const openLinkedTicket = () => {
      const id = new URLSearchParams(window.location.hash.slice(1)).get("ticket");
      if (id && PROJECT_COLUMNS.some((column) => column.tickets.some((ticket) => ticket.id === id))) {
        setDetail((current) => ({ id, open: true, session: current.session + 1 }));
      }
    };
    const frame = requestAnimationFrame(openLinkedTicket);
    window.addEventListener("hashchange", openLinkedTicket);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", openLinkedTicket);
    };
  }, []);
  const lastDragEnd = useRef(0);
  const detailColumn = columns.find((column) => column.tickets.some((ticket) => ticket.id === detail.id));
  const detailTicket = detailColumn?.tickets.find((ticket) => ticket.id === detail.id);
  const openDetail = (id: string) => {
    if (beforeDrag.current || performance.now() - lastDragEnd.current < 350) return;
    setDetail((current) => ({ id, open: true, session: current.session + 1 }));
  };
  const updateTicket = (patch: Partial<ProjectTicket>) => setColumns((current) => current.map((column) => ({
    ...column, tickets: column.tickets.map((ticket) => ticket.id === detail.id ? { ...ticket, ...patch } : ticket),
  })));
  const moveTicket = (columnId: string) => setColumns((current) => {
    const source = current.find((column) => column.tickets.some((ticket) => ticket.id === detail.id));
    const ticket = source?.tickets.find((item) => item.id === detail.id);
    if (!source || !ticket || source.id === columnId || !current.some((column) => column.id === columnId)) return current;
    return current.map((column) => {
      if (column.id === source.id) return { ...column, tickets: column.tickets.filter((item) => item.id !== ticket.id) };
      if (column.id === columnId) return { ...column, tickets: [ticket, ...column.tickets] };
      return column;
    });
  });

  const openCreateModal = (columnId?: string) => {
    setCreateModal((current) => ({ open: true, session: current.session + 1, columnId }));
  };
  const closeCreateModal = () => setCreateModal((current) => ({ ...current, open: false }));

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates, keyboardCodes: { start: ["Space"], cancel: ["Escape"], end: ["Space"] } }),
  );

  const addTicket = (draft: NewProjectTicket) => {
    const sequence = nextTicket;
    setNextTicket(sequence + 1);
    const ticket: ProjectTicket = {
      id: `ticket-new-${sequence}`,
      code: `FE-${sequence}`,
      area: "Project board",
      title: draft.title,
      description: draft.description,
      createdBy: "maya",
      since: "Since just now",
      priority: draft.priority,
      project: draft.project,
      assignees: draft.assignees,
    };
    setColumns((current) =>
      current.map((column) =>
        column.id === draft.columnId ? { ...column, tickets: [ticket, ...column.tickets] } : column,
      ),
    );
    requestAnimationFrame(() => {
      const index = columns.findIndex((column) => column.id === draft.columnId);
      const section = boardRef.current?.querySelectorAll("section")[index];
      section?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduceMotion ? "instant" : "smooth" });
      section?.querySelector('[role="region"]')?.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
    });
  };

  const onDragStart = ({ active }: DragStartEvent) => {
    setSort("manual");
    beforeDrag.current = cloneColumns(columns);
    setActiveTicket(ticketFor(columns, active.id));
    // The overlay is portaled outside scaled previews. Measure the source
    // directly: dnd-kit's initial rect is not populated until after drag start.
    const dimensions = active.data.current?.getDragDimensions?.();
    const width = dimensions?.layoutWidth || 261;
    setDragWidth(width);
    setDragScale((dimensions?.renderedWidth || width) / width);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;
    setColumns((current) => {
      const fromId = columnFor(current, active.id);
      const toId = columnFor(current, over.id);
      if (!fromId || !toId || fromId === toId) return current;

      const from = current.find((column) => column.id === fromId)!;
      const to = current.find((column) => column.id === toId)!;
      const fromIndex = from.tickets.findIndex((ticket) => ticket.id === active.id);
      if (fromIndex < 0) return current;

      const moving = from.tickets[fromIndex];
      const overIndex = to.tickets.findIndex((ticket) => ticket.id === over.id);
      const belowTarget = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height / 2;
      const insertAt = overIndex < 0 ? to.tickets.length : overIndex + (belowTarget ? 1 : 0);

      return current.map((column) => {
        if (column.id === fromId) {
          return { ...column, tickets: column.tickets.filter((ticket) => ticket.id !== active.id) };
        }
        if (column.id === toId) {
          const tickets = [...column.tickets];
          tickets.splice(insertAt, 0, moving);
          return { ...column, tickets };
        }
        return column;
      });
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    lastDragEnd.current = performance.now();
    setActiveTicket(null);
    if (!over && beforeDrag.current) setColumns(beforeDrag.current);
    beforeDrag.current = null;
    if (!over) return;
    setColumns((current) => {
      const columnId = columnFor(current, active.id);
      const overColumnId = columnFor(current, over.id);
      if (!columnId || columnId !== overColumnId || active.id === over.id) return current;
      const column = current.find((item) => item.id === columnId)!;
      const oldIndex = column.tickets.findIndex((ticket) => ticket.id === active.id);
      const newIndex = column.tickets.findIndex((ticket) => ticket.id === over.id);
      if (oldIndex < 0 || newIndex < 0 || oldIndex === newIndex) return current;
      return current.map((item) =>
        item.id === columnId ? { ...item, tickets: arrayMove(item.tickets, oldIndex, newIndex) } : item,
      );
    });
  };

  const onDragCancel = () => {
    lastDragEnd.current = performance.now();
    if (beforeDrag.current) setColumns(beforeDrag.current);
    beforeDrag.current = null;
    setActiveTicket(null);
  };

  return localize((
    <div className="flex min-h-0 w-full flex-1 flex-col gap-2.5">
      <ProjectBoardHeader
        controls={<ProjectBoardControls sort={sort} onSort={sortTickets} priority={priorityFilter} onPriority={setPriorityFilter} project={projectFilter} onProject={setProjectFilter} showDone={showDone} onShowDone={setShowDone} fillColumns={fillColumns} onFillColumns={setFillColumns} />}
        onMenuClick={onMenuClick}
        onAddTicket={() => openCreateModal()}
      />

      <DndContext
        id={dndId}
        sensors={sensors}
        collisionDetection={boardCollisionDetection}
        measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
        autoScroll={{ acceleration: 5, threshold: { x: 0.12, y: 0.12 } }}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        accessibility={{
          screenReaderInstructions: {
            draggable:
              "Press Enter to open a ticket. Press space to pick up a ticket. Use the arrow keys to move it between positions and columns, then press space again to drop it.",
          },
        }}
      >
        <div ref={boardRef} className="-mx-3 min-h-0 flex-1 overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:thin] sm:-mx-6 lg:-me-7" role="region" aria-label="Project board columns" tabIndex={0}>
          <div className={cx("grid h-full w-max grid-flow-col auto-cols-[273px] gap-2 px-3 sm:px-6 lg:pe-7", fillColumns && "min-[1441px]:auto-cols-[minmax(273px,1fr)]", fillColumns && (showDone ? "min-[1441px]:w-[max(100%,1449px)]" : "min-[1441px]:w-[max(100%,1168px)]"))}>
            {visibleColumns.map((column) => (
              <BoardColumn key={column.id} column={column} onAdd={openCreateModal} onOpen={openDetail} />
            ))}
          </div>
        </div>
        {portalRoot
          ? createPortal(
              <DragOverlay
                dropAnimation={reduceMotion ? null : { ...DROP_TRANSITION, sideEffects: DROP_SIDE_EFFECTS }}
              >
                {activeTicket ? (
                  <div
                    dir={direction}
                    className="origin-top-left"
                    style={{ width: dragWidth, transform: `scale(${dragScale})` }}
                  >
                    <TicketCard ticket={activeTicket} overlay />
                  </div>
                ) : null}
              </DragOverlay>,
              portalRoot,
            )
          : null}
      </DndContext>
      {detailTicket && detailColumn && <TicketDetailModal
        key={`${detail.id}-${detail.session}`}
        isOpen={detail.open}
        ticket={detailTicket}
        column={detailColumn}
        columns={columns}
        onClose={() => setDetail((current) => ({ ...current, open: false }))}
        onUpdate={updateTicket}
        onMove={moveTicket}
      />}
      <CreateTicketModal
        key={createModal.session}
        isOpen={createModal.open}
        onClose={closeCreateModal}
        initialColumnId={createModal.columnId}
        columns={columns}
        code={`FE-${nextTicket}`}
        onCreate={addTicket}
      />
    </div>
  ));
}

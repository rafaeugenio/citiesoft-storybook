"use client";

import { useTemplateCopy } from "@/components/foundations/template-copy/template-copy";

import { useDirection } from "@/components/foundations/direction/direction";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Dialog, Focusable, Heading, Modal, ModalOverlay } from "react-aria-components";
import { RiArrowRightSLine, RiArrowUpLine, RiCheckLine, RiCheckboxCircleLine, RiFileCopyLine, RiRestartLine, RiEditLine, RiFolder6Line, RiLinkM, RiMore2Fill } from "@remixicon/react";
import { TokensChartCard } from "@/components/application/ai-profile/tokens-chart-card";
import { Avatar } from "@/components/base/avatar/avatar";
import { Chip } from "@/components/base/badges/chip";
import { Button } from "@/components/base/buttons/button";
import { CloseButton } from "@/components/base/buttons/close-button";
import { IconButton } from "@/components/base/buttons/icon-button";
import { Checkbox } from "@/components/base/checkbox/checkbox";
import { Dropdown, DropdownItem, DropdownPopover, DropdownTrigger } from "@/components/base/dropdown/dropdown";
import { Select, SelectItem } from "@/components/base/select/select";
import { Textarea } from "@/components/base/textarea/textarea";
import { Tooltip, TooltipTrigger } from "@/components/base/tooltip/tooltip";
import { cx } from "@/utils/cx";
import { PROJECT_MEMBERS, type ProjectColumn, type ProjectTicket, type TicketPriority } from "./project-board-data";
import { ticketBrief, ticketDemoActivity } from "./ticket-detail-data";
import { TicketCornerGenieSurface } from "./ticket-corner-genie-surface";
import { TicketAssigneeIcon, TicketFavoriteIcon, TicketStatusIcon } from "./project-board-icons";
import styles from "./ticket-detail-modal.module.css";

const PRIORITIES: TicketPriority[] = ["Low", "Medium", "High", "Urgent"];
const PRIORITY_COLORS = { Low: "blue", Medium: "yellow", High: "orange", Urgent: "rose" } as const;
const PRIORITY_HOVERS = {
  Low: "group-hover/priority:bg-ticket-detail-low-hover",
  Medium: "group-hover/priority:bg-ticket-detail-medium-hover",
  High: "group-hover/priority:bg-ticket-detail-high-hover",
  Urgent: "group-hover/priority:bg-ticket-detail-urgent-hover",
};
const TOOL_BUTTON = "size-6 rounded-lg text-foreground-icon-secondary [&>svg]:size-[18px]";

/** Same 200ms blur/scale crossfade as the docs Copy Page button. */
function TicketLinkIcon({ className }: { className?: string }) {
  const localize = useTemplateCopy();
  return localize((
    <span aria-hidden className={cx("relative inline-flex shrink-0 items-center justify-center", className, "size-[18px]")}>
      <RiLinkM className="absolute size-[18px] scale-100 opacity-100 blur-[0px] transition-all duration-200 ease-out group-data-[copied=true]:scale-75 group-data-[copied=true]:opacity-0 group-data-[copied=true]:blur-[2px] motion-reduce:transition-none" />
      <RiCheckLine className="absolute size-[18px] scale-75 opacity-0 blur-[2px] transition-all duration-200 ease-out group-data-[copied=true]:scale-100 group-data-[copied=true]:opacity-100 group-data-[copied=true]:blur-[0px] motion-reduce:transition-none" />
    </span>
  ));
}

function PropertySelect({ label, value, options, onChange, renderValue, chip = false }: {
  label: string;
  value: string;
  options: { id: string; label: string; icon?: ReactNode }[];
  onChange: (value: string) => void;
  renderValue?: ReactNode;
  chip?: boolean;
}) {
  const localize = useTemplateCopy();
  return localize((
    <Select
      aria-label={label} selectedKey={value}
      onSelectionChange={(key) => key !== null && onChange(String(key))}
      size="sm" renderValue={renderValue} className="-m-1"
      triggerClassName={cx("w-auto min-w-0 justify-start rounded-md border-0 bg-transparent p-1 text-body-medium text-text-primary shadow-none [&>svg]:hidden", chip ? "group/priority hover:bg-transparent" : "hover:bg-background-primary-hover")}
      popoverClassName="z-[120] w-[220px] rounded-[14px] p-1"
    >
      {options.map((option) => <SelectItem id={option.id} key={option.id} textValue={option.label} className="px-2 py-1.5 text-body-medium">{option.icon}{option.label}</SelectItem>)}
    </Select>
  ));
}

/** Figma 4509:12272 — private detail panel bundled with the Project Board. */
export function TicketDetailModal({ isOpen, ticket, column, columns, onClose, onUpdate, onMove }: {
  isOpen: boolean;
  ticket: ProjectTicket;
  column: ProjectColumn;
  columns: ProjectColumn[];
  onClose: () => void;
  onUpdate: (patch: Partial<ProjectTicket>) => void;
  onMove: (columnId: string) => void;
}) {
  const localize = useTemplateCopy();
  const direction = useDirection();
  const brief = ticketBrief(ticket);
  const description = ticket.description || brief.description.split("\n\n").at(-1)!;
  const [comment, setComment] = useState("");
  const [editingDescription, setEditingDescription] = useState(false);
  const [draft, setDraft] = useState(localize(description));
  const [menuOpen, setMenuOpen] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");
  const [scrollFade, setScrollFade] = useState(0);
  const copyResetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {
    if (copyResetTimer.current !== null) clearTimeout(copyResetTimer.current);
  }, []);
  const owner = PROJECT_MEMBERS[ticket.assignees[0]] ?? PROJECT_MEMBERS.maya;
  const creator = PROJECT_MEMBERS[ticket.createdBy ?? "maya"] ?? PROJECT_MEMBERS.maya;
  const demoActivity = useMemo(() => ticketDemoActivity(ticket), [ticket]);
  const comments = ticket.comments ?? [];

  function postComment() {
    if (!comment.trim()) return;
    onUpdate({ comments: [...comments, { id: crypto.randomUUID(), author: "you", body: comment.trim(), time: "Just now" }] });
    setComment("");
  }

  async function copyLink() {
    if (copyResetTimer.current !== null) clearTimeout(copyResetTimer.current);
    try {
      const url = new URL(window.location.href);
      url.hash = `ticket=${encodeURIComponent(ticket.id)}`;
      await navigator.clipboard.writeText(url.toString());
      setCopyMessage("Ticket link copied");
      copyResetTimer.current = setTimeout(() => setCopyMessage(""), 1600);
    } catch {
      setCopyMessage("Could not copy the ticket link. Please try again.");
    }
  }

  async function copyTicketId() {
    if (copyResetTimer.current !== null) clearTimeout(copyResetTimer.current);
    try {
      await navigator.clipboard.writeText(ticket.code);
      setCopyMessage("Ticket ID copied");
      copyResetTimer.current = setTimeout(() => setCopyMessage(""), 1600);
    } catch {
      setCopyMessage("Could not copy the ticket ID. Please try again.");
    }
  }

  return localize((
    <ModalOverlay dir={direction} isOpen={isOpen} onOpenChange={(open) => !open && onClose()} isDismissable
      className="fixed inset-0 z-100 flex items-stretch justify-end overflow-hidden p-3 max-sm:p-2">
      <Modal className={cx("h-full w-full max-w-[609px] outline-none", styles.panel)}>
        <TicketCornerGenieSurface exiting={!isOpen}>
        <Dialog aria-label={`${ticket.code} ticket details`} className="flex h-full min-h-0 flex-col overflow-hidden rounded-3xl bg-ticket-detail-surface outline-none">
          <header className="flex shrink-0 items-center justify-between gap-3 px-6 pt-6 pb-5 max-sm:px-4 max-sm:pt-4">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <div className="flex min-w-0 items-center gap-0.5 text-body-2-medium text-text-secondary">
                <span className="shrink-0">Citiesoft Design Tasks</span>
                <RiArrowRightSLine className="size-[15px] shrink-0 rtl:rotate-180" aria-hidden />
                <span className="shrink-0">{ticket.code}</span>
                <RiArrowRightSLine className="size-[15px] shrink-0 rtl:rotate-180" aria-hidden />
                <span className="truncate">{ticket.area}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <TooltipTrigger delay={200}>
                  <Focusable>
                    <IconButton icon={TicketFavoriteIcon} size="small"
                      className={cx(TOOL_BUTTON, "[&>svg]:size-[17px]", ticket.isFavorite && "text-ticket-detail-favorite [&_path]:fill-current")}
                      aria-label={ticket.isFavorite ? "Remove from favorites" : "Add to favorites"} aria-pressed={!!ticket.isFavorite}
                      onClick={() => onUpdate({ isFavorite: !ticket.isFavorite })} />
                  </Focusable>
                  <Tooltip placement="bottom" className="z-[120]">{ticket.isFavorite ? "Remove from favorites" : "Add to favorites"}</Tooltip>
                </TooltipTrigger>
                <TooltipTrigger delay={200}>
                  <Focusable>
                    <IconButton icon={TicketLinkIcon} size="small" className={cx(TOOL_BUTTON, "group")} data-copied={copyMessage === "Ticket link copied"} aria-label="Copy ticket link" onClick={copyLink} />
                  </Focusable>
                  <Tooltip placement="bottom" className="z-[120]">{copyMessage === "Ticket link copied" ? copyMessage : "Copy ticket link"}</Tooltip>
                </TooltipTrigger>
                <Dropdown isOpen={menuOpen} onOpenChange={setMenuOpen}>
                  <DropdownTrigger aria-label="Ticket actions" className={cx("flex items-center justify-center border border-border-button-default bg-background-primary-default shadow-xs hover:bg-background-primary-hover", TOOL_BUTTON)}>
                    <RiMore2Fill className="size-[18px]" aria-hidden />
                  </DropdownTrigger>
                  <DropdownPopover aria-label="Ticket actions" className="z-[120] w-[220px] rounded-[14px] p-1" placement="bottom end">
                    <DropdownItem className="px-2 py-1.5" onSelect={() => { setDraft(localize(description)); setEditingDescription(true); setMenuOpen(false); }}>
                      <RiEditLine className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
                      <span className="truncate text-body-medium whitespace-nowrap">Edit description</span>
                    </DropdownItem>
                    <DropdownItem className="px-2 py-1.5" onSelect={() => { void copyTicketId(); }}>
                      <RiFileCopyLine className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />
                      <span className="truncate text-body-medium whitespace-nowrap">{copyMessage === "Ticket ID copied" ? "Ticket ID copied" : "Copy ticket ID"}</span>
                    </DropdownItem>
                    <DropdownItem className="px-2 py-1.5" onSelect={() => { setMenuOpen(false); onMove(column.id === "done" ? "todo" : "done"); }}>
                      {column.id === "done" ? <RiRestartLine className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden /> : <RiCheckboxCircleLine className="size-[18px] shrink-0 text-foreground-icon-secondary" aria-hidden />}
                      <span className="truncate text-body-medium whitespace-nowrap">{column.id === "done" ? "Reopen ticket" : "Mark as done"}</span>
                    </DropdownItem>
                  </DropdownPopover>
                </Dropdown>
              </div>
            </div>
            <CloseButton size="sm" className="self-start" aria-label="Close ticket details" onClick={onClose} />
            <span className="sr-only" role="status">{copyMessage}</span>
          </header>

          <div className="relative min-h-0 flex-1">
          <div
            role="region"
            aria-label="Ticket content"
            tabIndex={0}
            onScroll={(event) => setScrollFade(Math.min(1, Math.max(0, event.currentTarget.scrollTop) / 24))}
            className="h-full min-h-0 overflow-y-auto overscroll-contain outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-border-focus-ring"
          >
            <div className="flex min-h-full flex-col">
              <div className="flex flex-col gap-5 px-6 max-sm:px-4">
                <section className="flex flex-col gap-3" aria-label="Description">
                  <div className="flex items-center gap-[13px] text-body-medium">
                    <span className="text-text-secondary">Created by</span>
                    <span className="flex items-center gap-1.5 text-text-primary"><Avatar src={creator.avatar} initials={creator.initials} alt={creator.name} className="size-[18px]" />{creator.name}</span>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Heading slot="title" className="text-headline-medium text-text-primary wrap-anywhere">{ticket.title}</Heading>
                    {editingDescription ? (
                      <form className="flex flex-col gap-3" onSubmit={(event) => {
                        event.preventDefault();
                        if (!draft.trim()) return;
                        onUpdate({ description: draft.trim() });
                        setEditingDescription(false);
                      }}>
                        <Textarea aria-label="Ticket description" value={draft} onChange={setDraft} rows={4} maxLength={5000} autoFocus />
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" size="small" onClick={() => setEditingDescription(false)}>Cancel</Button>
                          <Button type="submit" size="small" disabled={!draft.trim()}>Save description</Button>
                        </div>
                      </form>
                    ) : <p className="whitespace-pre-wrap text-body-regular text-text-secondary wrap-anywhere">{description}</p>}
                  </div>
                </section>

                <div role="group" aria-label="Ticket properties" className="flex items-start gap-5 max-sm:flex-col max-sm:gap-2">
                  <span className="w-[70px] shrink-0 pt-0.5 text-body-medium text-text-secondary">Properties</span>
                  <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-3">
                    <PropertySelect label="Ticket status" value={column.id} options={columns.map((item) => ({ id: item.id, label: item.title, icon: <TicketStatusIcon status={item.id} className="text-foreground-icon-secondary" /> }))} onChange={onMove}
                      renderValue={<span className="flex items-center gap-1.5"><TicketStatusIcon status={column.id} className="text-foreground-icon-secondary" />{column.title}</span>} />
                    <PropertySelect chip label="Ticket priority" value={ticket.priority} options={PRIORITIES.map((priority) => ({ id: priority, label: priority }))}
                      onChange={(priority) => onUpdate({ priority: priority as TicketPriority })}
                      renderValue={<Chip color={PRIORITY_COLORS[ticket.priority]} className={cx("px-[7px] py-0.5 text-body-medium transition-colors duration-150", PRIORITY_HOVERS[ticket.priority], ticket.priority === "Low" && "bg-ticket-detail-low-background text-ticket-detail-low-text")}>{ticket.priority}</Chip>} />
                    <Dropdown>
                      <DropdownTrigger aria-label="Edit assignees" className="-m-1 flex items-center gap-1.5 rounded-md p-1 text-body-medium text-text-primary hover:bg-background-primary-hover">
                        {ticket.assignees.length ? <>
                          <span className="flex items-center -space-x-1.5">
                            {ticket.assignees.slice(0, 3).map((id) => {
                              const person = PROJECT_MEMBERS[id];
                              return person && <Avatar key={id} src={person.avatar} initials={person.initials} alt={person.name} className="size-[18px] ring-2 ring-ticket-detail-surface" />;
                            })}
                          </span>
                          <span>{owner.name}{ticket.assignees.length > 1 ? ` +${ticket.assignees.length - 1}` : ""}</span>
                        </> : <><TicketAssigneeIcon className="size-[18px] text-foreground-icon-tertiary" aria-hidden /><span className="text-text-tertiary">Assignee</span></>}
                      </DropdownTrigger>
                      <DropdownPopover aria-label="Ticket assignees" className="z-[120] w-[220px] rounded-[14px] p-1">
                        {Object.values(PROJECT_MEMBERS).map((person) => <Checkbox key={person.id} isSelected={ticket.assignees.includes(person.id)} onChange={(selected) => onUpdate({ assignees: selected ? [...ticket.assignees, person.id] : ticket.assignees.filter((id) => id !== person.id) })} className="rounded-2lg px-2 py-1.5 hover:bg-background-secondary-hover">
                          <span className="flex items-center gap-2"><Avatar className="size-[18px]" src={person.avatar} initials={person.initials} />{person.name}</span>
                        </Checkbox>)}
                      </DropdownPopover>
                    </Dropdown>
                    <PropertySelect label="Ticket project" value={ticket.project} options={["TFD", "SIGEP", "Citiesoft"].map((project) => ({ id: project, label: project }))} onChange={(project) => onUpdate({ project })}
                      renderValue={<span className="flex items-center gap-1.5"><RiFolder6Line className="size-[18px] text-foreground-icon-secondary" aria-hidden />{ticket.project}</span>} />
                  </div>
                </div>

                <div className="flex items-start gap-5 max-sm:flex-col max-sm:gap-2" aria-label="Resources">
                  <span className="w-[71px] shrink-0 pt-0.5 text-body-medium text-text-secondary">Resources</span>
                  <div className="flex flex-wrap gap-2">
                    {demoActivity.resources.map((resource) => <a key={resource.href} href={resource.href} target="_blank" rel="noreferrer" className="rounded-md outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring">
                      <Chip className="bg-ticket-detail-resource-background px-[7px] py-0.5 text-body-medium text-ticket-detail-resource-text">{resource.label}</Chip>
                    </a>)}
                  </div>
                </div>

                <TokensChartCard title="Tokens burned" series={demoActivity.series} total={demoActivity.total} change={demoActivity.change} startLabel="Sep 1" endLabel="Sep 16" plotHeight={190} />
              </div>

              <section aria-label="Comments" className="mt-auto flex flex-col gap-2.5 px-3 pb-3">
                <div className="flex flex-col" aria-live="polite">
                  {[...demoActivity.comments, ...comments].map((entry) => {
                    const author = Object.values(PROJECT_MEMBERS).find((person) => person.name === entry.author);
                    return <article key={entry.id} className="relative flex flex-col gap-[3px] rounded-2xl p-3 after:pointer-events-none after:absolute after:top-9 after:-bottom-3 after:start-[23.5px] after:w-px after:bg-border-button-default last:after:hidden">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar src={author?.avatar} initials={entry.author === "you" ? "ME" : author?.initials} alt={entry.author === "you" ? "You" : entry.author} className="size-6" />
                      <div className="flex min-w-0 flex-wrap items-center gap-x-2">
                        <span className="truncate text-body-medium text-text-primary">{entry.author === "you" ? "You" : entry.author}</span>
                        <span className="shrink-0 text-body-2-medium text-text-tertiary">{entry.time}</span>
                      </div>
                    </div>
                    <p className="ps-[29px] whitespace-pre-wrap text-body-medium text-text-secondary wrap-anywhere">{entry.body}</p>
                  </article>;
                  })}
                </div>
                <form className="relative" onSubmit={(event) => { event.preventDefault(); postComment(); }}>
                  <Textarea aria-label="Add a comment" placeholder="Enter your comment" value={comment} onChange={setComment} rows={1} maxLength={2000} resize="none" fieldClassName="h-[72px] rounded-xl bg-background-secondary-default pt-3 pb-10" />
                  <Button type="submit" aria-label="Post comment" size="small" disabled={!comment.trim()} className="absolute end-2 bottom-2 size-6 rounded-full p-0"><RiArrowUpLine className="size-[13.333px]" aria-hidden /></Button>
                </form>
              </section>
            </div>
          </div>
          {/* Keep opacity on each layer: fading the parent prevents backdrop blur from sampling the content. */}
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-6">
            <div className="absolute inset-0 backdrop-blur-[1px] [mask-image:linear-gradient(to_bottom,black,transparent)]" style={{ opacity: scrollFade }} />
            <div className="absolute inset-x-0 top-0 h-4 backdrop-blur-[4px] [mask-image:linear-gradient(to_bottom,black,transparent)]" style={{ opacity: scrollFade }} />
            <div className="absolute inset-0 bg-linear-to-b from-ticket-detail-surface to-transparent" style={{ opacity: scrollFade }} />
          </div>
          </div>
        </Dialog>
        </TicketCornerGenieSurface>
      </Modal>
    </ModalOverlay>
  ));
}

import { cx } from "@/utils/cx";
import { RiInboxArchiveLine, RiCheckboxBlankCircleLine, RiPieChart2Line, RiEyeLine, RiCheckboxCircleLine } from "@remixicon/react";

const STATUS_ICONS = {
  backlog: RiInboxArchiveLine,
  todo: RiCheckboxBlankCircleLine,
  "in-progress": RiPieChart2Line,
  review: RiEyeLine,
  done: RiCheckboxCircleLine,
};

/** Consistent status glyphs across ticket creation and detail menus. */
export function TicketStatusIcon({ status, className }: { status: string; className?: string }) {
  const Icon = STATUS_ICONS[status as keyof typeof STATUS_ICONS] ?? RiCheckboxBlankCircleLine;
  return <Icon className={cx("size-[18px] shrink-0", className)} aria-hidden />;
}

/** Exact Figma exports (4491:12647, 4491:12699), embedded to keep template installs self-contained. */

export function TicketAssigneeIcon({ className }: { className?: string }) {
  return <span aria-hidden className={cx("inline-block size-[18px] shrink-0 bg-current", className)} style={{ maskImage: "url(data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMTggMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJGcmFtZSI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik05IDE2LjVDNC44NTc4NiAxNi41IDEuNSAxMy4xNDIxIDEuNSA5QzEuNSA0Ljg1Nzg2IDQuODU3ODYgMS41IDkgMS41QzEzLjE0MjEgMS41IDE2LjUgNC44NTc4NiAxNi41IDlDMTYuNSAxMy4xNDIxIDEzLjE0MjEgMTYuNSA5IDE2LjVaTTkgMTVDMTIuMzEzNyAxNSAxNSAxMi4zMTM3IDE1IDlDMTUgNS42ODYyOSAxMi4zMTM3IDMgOSAzQzUuNjg2MjkgMyAzIDUuNjg2MjkgMyA5QzMgMTIuMzEzNyA1LjY4NjI5IDE1IDkgMTVaTTUuMjUgOUg2Ljc1QzYuNzUgMTAuMjQyNyA3Ljc1NzMyIDExLjI1IDkgMTEuMjVDMTAuMjQyNyAxMS4yNSAxMS4yNSAxMC4yNDI3IDExLjI1IDlIMTIuNzVDMTIuNzUgMTEuMDcxIDExLjA3MSAxMi43NSA5IDEyLjc1QzYuOTI4OTMgMTIuNzUgNS4yNSAxMS4wNzEgNS4yNSA5WiIgZmlsbD0iI0ExQTFBMSIvPgo8L2c+Cjwvc3ZnPgo=)", maskSize: "contain", maskRepeat: "no-repeat" }} />;
}

export function TicketUrgencyIcon({ className }: { className?: string }) {
  return <span aria-hidden className={cx("inline-block size-[18px] shrink-0 bg-current", className)} style={{ maskImage: "url(data:image/svg+xml;base64,PHN2ZyBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJub25lIiBvdmVyZmxvdz0idmlzaWJsZSIgc3R5bGU9ImRpc3BsYXk6IGJsb2NrOyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiB2aWV3Qm94PSIwIDAgMTggMTgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxnIGlkPSJGcmFtZSI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik0xNSA5Ljc1QzE1IDExLjQwNjggMTQuMzI4NSAxMi45MDY4IDEzLjI0MjcgMTMuOTkyN0wxNC4zMDMzIDE1LjA1MzNDMTUuNjYwNSAxMy42OTYxIDE2LjUgMTEuODIxIDE2LjUgOS43NUMxNi41IDUuNjA3ODYgMTMuMTQyMSAyLjI1IDkgMi4yNUM0Ljg1Nzg2IDIuMjUgMS41IDUuNjA3ODYgMS41IDkuNzVDMS41IDExLjgyMSAyLjMzOTQ3IDEzLjY5NjEgMy42OTY3IDE1LjA1MzNMNC43NTczNiAxMy45OTI3QzMuNjcxNTcgMTIuOTA2OCAzIDExLjQwNjggMyA5Ljc1QzMgNi40MzYyOSA1LjY4NjI5IDMuNzUgOSAzLjc1QzEyLjMxMzcgMy43NSAxNSA2LjQzNjI5IDE1IDkuNzVaTTExLjQ2OTggNi4yMTk3M0w3Ljg3NSA5LjM3NUw5LjM3NSAxMC44NzVMMTIuNTMwNCA3LjI4MDM5TDExLjQ2OTggNi4yMTk3M1oiIGZpbGw9IiNBMUExQTEiLz4KPC9nPgo8L3N2Zz4K)", maskSize: "contain", maskRepeat: "no-repeat" }} />;
}

/** 17px ticket favorite glyph with true 1px circular corner arcs. */
export function TicketFavoriteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 17 17" className={cx("size-[17px] shrink-0", className)} fill="none" aria-hidden>
      <path d="M7.5767 2.7199A1 1 0 0 1 9.4233 2.7199 L10.3815 5.0236A1 1 0 0 0 11.2249 5.6363 L13.7119 5.8357A1 1 0 0 1 14.2825 7.5920 L12.3877 9.2151A1 1 0 0 0 12.0655 10.2066 L12.6444 12.6335A1 1 0 0 1 11.1505 13.7189 L9.0213 12.4184A1 1 0 0 0 7.9787 12.4184 L5.8495 13.7189A1 1 0 0 1 4.3556 12.6335 L4.9345 10.2066A1 1 0 0 0 4.6123 9.2151 L2.7175 7.5920A1 1 0 0 1 3.2881 5.8357 L5.7751 5.6363A1 1 0 0 0 6.6185 5.0236Z" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export type TicketSubtask = { id: string; title: string; done: boolean };
export type TicketComment = { id: string; author: string; body: string; time: string };

export type ProjectMember = {
  id: string;
  name: string;
  avatar: string;
  initials: string;
};

export type TicketPriority = "Low" | "Medium" | "High" | "Urgent";

export type ProjectTicket = {
  id: string;
  code: string;
  area: string;
  title: string;
  since: string;
  description?: string;
  subtasks?: TicketSubtask[];
  comments?: TicketComment[];
  isFavorite?: boolean;
  createdBy?: string;
  priority: TicketPriority;
  project: string;
  assignees: string[];
};

export type ProjectColumn = {
  id: string;
  title: string;
  limit: number;
  tickets: ProjectTicket[];
};

/**
 * Photographic placeholders from the open-source Random User Generator.
 * Swap these URLs for people from your product's own user directory.
 */
export const PROJECT_MEMBERS: Record<string, ProjectMember> = {
  maya: {
    id: "maya",
    name: "Maya Chen",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    initials: "MC",
  },
  noah: {
    id: "noah",
    name: "Noah Williams",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    initials: "NW",
  },
  elif: {
    id: "elif",
    name: "Elif Kaya",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    initials: "EK",
  },
  daniel: {
    id: "daniel",
    name: "Daniel Kim",
    avatar: "https://randomuser.me/api/portraits/men/46.jpg",
    initials: "DK",
  },
  priya: {
    id: "priya",
    name: "Priya Shah",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    initials: "PS",
  },
};

export const PROJECT_COLUMNS: ProjectColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    limit: 8,
    tickets: [
      {
        id: "ticket-ds-38",
        code: "DS-38",
        area: "Agent handoff",
        title: "Explore approval cards for agent handoffs",
        since: "Since 14 Sep",
        priority: "Low",
        project: "TFD",
        assignees: ["maya", "priya"],
      },
      {
        id: "ticket-fe-86",
        code: "FE-86",
        area: "Project board",
        title: "Add saved views for each project team",
        since: "Since 13 Sep",
        priority: "Low",
        project: "SIGEP",
        assignees: ["elif"],
      },
      {
        id: "ticket-be-23",
        code: "BE-23",
        area: "Activity API",
        title: "Record an audit trail for agent actions",
        since: "Since 12 Sep",
        priority: "Medium",
        project: "TFD",
        assignees: ["daniel"],
      },
    ],
  },
  {
    id: "todo",
    title: "To do",
    limit: 5,
    tickets: [
      {
        id: "ticket-ds-34",
        code: "DS-34",
        area: "Foundations",
        title: "Define semantic tokens for elevated surfaces",
        since: "Since 12 Sep",
        priority: "High",
        project: "Citiesoft",
        assignees: ["maya"],
      },
      {
        id: "ticket-fe-82",
        code: "FE-82",
        area: "Composer",
        title: "Add keyboard navigation to model picker",
        since: "Since 11 Sep",
        priority: "Low",
        project: "SIGEP",
        assignees: ["noah", "elif"],
      },
      {
        id: "ticket-be-19",
        code: "BE-19",
        area: "Usage API",
        title: "Return rolling limits with reset timestamps",
        since: "Since 10 Sep",
        priority: "Low",
        project: "TFD",
        assignees: ["daniel"],
      },
    ],
  },
  {
    id: "in-progress",
    title: "In progress",
    limit: 4,
    tickets: [
      {
        id: "ticket-fe-79",
        code: "FE-79",
        area: "Agent progress",
        title: "Animate nested task groups as they stream",
        since: "Since 9 Sep",
        priority: "Medium",
        project: "SIGEP",
        assignees: ["elif", "noah"],
      },
      {
        id: "ticket-ds-31",
        code: "DS-31",
        area: "Dark mode",
        title: "Tune chart contrast on dark dashboard cards",
        since: "Since 8 Sep",
        priority: "Urgent",
        project: "Citiesoft",
        assignees: ["maya"],
      },
    ],
  },
  {
    id: "review",
    title: "Review",
    limit: 3,
    tickets: [
      {
        id: "ticket-fe-76",
        code: "FE-76",
        area: "Questionnaire",
        title: "Polish the transition between plan questions",
        since: "Since 7 Sep",
        priority: "Low",
        project: "TFD",
        assignees: ["priya"],
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    limit: 6,
    tickets: [
      {
        id: "ticket-ds-27",
        code: "DS-27",
        area: "Avatars",
        title: "Ship overlapping avatar groups for cards",
        since: "Completed 6 Sep",
        priority: "Low",
        project: "Citiesoft",
        assignees: ["maya"],
      },
      {
        id: "ticket-fe-71",
        code: "FE-71",
        area: "Studio canvas",
        title: "Keep generated screens aligned while zooming",
        since: "Completed 5 Sep",
        priority: "Medium",
        project: "SIGEP",
        assignees: ["noah", "daniel"],
      },
      {
        id: "ticket-be-16",
        code: "BE-16",
        area: "Registry",
        title: "Validate template dependencies during build",
        since: "Completed 4 Sep",
        priority: "Low",
        project: "Citiesoft",
        assignees: ["daniel"],
      },
      {
        id: "ticket-ds-25",
        code: "DS-25",
        area: "Motion",
        title: "Document reduced-motion behavior for blocks",
        since: "Completed 3 Sep",
        priority: "Low",
        project: "Citiesoft",
        assignees: ["priya"],
      },
    ],
  },
];

export type Priority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "todo" | "in-progress" | "done";
export type TeamRole = "admin" | "member" | "viewer";
export type MemberStatus = "active" | "pending";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: TaskStatus;
  dueDate: string;
  assignee?: string; // legacy, keep for compat
  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
  tags: string[];
  createdAt: string;
  user?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TeamMember {
  id: string;
  user: {
    id: string | null; // null when invite is pending (user not yet registered)
    name: string;
    email: string;
  };
  role: TeamRole;
  status: MemberStatus;
  isPending?: boolean;
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  owner: string;
  type: 'personal' | 'team';
  myRole: TeamRole;
  members: TeamMember[];
}

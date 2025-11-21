export enum IssueStatus {
  BACKLOG = 'backlog',
  IN_PROGRESS = 'inProgress',
  DONE = 'done'
}

export enum UserRole {
  ADMIN = 'admin',
  CONTRIBUTOR = 'contributor'
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  status: IssueStatus;
  tags: string[];
  assignee: string;
  severity: number;
  userDefinedRank: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  name: string;
  role: UserRole;
}

export interface UndoAction {
  id: string;
  action: () => void;
  revert: () => void;
  timestamp: number;
  description: string;
}

export interface FilterOptions {
  searchQuery: string;
  assignee: string | null;
  severity: number | null;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  onUndo?: () => void;
}

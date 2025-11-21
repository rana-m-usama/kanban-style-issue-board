import { IssueStatus } from '../types';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'danger' | 'warning';

export const getSeverityVariant = (severity: number): BadgeVariant => {
  if (severity >= 4) return 'danger';
  if (severity >= 3) return 'warning';
  return 'secondary';
};

export const getStatusVariant = (status: IssueStatus): BadgeVariant => {
  switch (status) {
    case IssueStatus.DONE:
      return 'success';
    case IssueStatus.IN_PROGRESS:
      return 'warning';
    case IssueStatus.BACKLOG:
    default:
      return 'secondary';
  }
};

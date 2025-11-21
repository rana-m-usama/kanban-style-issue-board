import { IssueStatus } from '../types';

export const STATUS_LABELS: Record<IssueStatus, string> = {
  [IssueStatus.BACKLOG]: 'Backlog',
  [IssueStatus.IN_PROGRESS]: 'In Progress',
  [IssueStatus.DONE]: 'Done'
};

export const getStatusLabel = (status: IssueStatus): string => {
  return STATUS_LABELS[status];
};

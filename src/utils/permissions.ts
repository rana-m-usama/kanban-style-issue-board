import type { User } from '../types';
import { UserRole } from '../types';

export const canEditIssues = (user: User): boolean => {
  return user.role === UserRole.ADMIN;
};

export const canMoveIssues = (user: User): boolean => {
  return user.role === UserRole.ADMIN;
};

export const canUpdatePriority = (user: User): boolean => {
  return user.role === UserRole.ADMIN;
};

export const canResolveIssues = (user: User): boolean => {
  return user.role === UserRole.ADMIN;
};

export const isReadOnly = (user: User): boolean => {
  return user.role === UserRole.CONTRIBUTOR;
};

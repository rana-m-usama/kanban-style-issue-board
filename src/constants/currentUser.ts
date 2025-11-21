import type { User } from '../types';
import { UserRole } from '../types';

export const currentUser: User = {
  name: 'Alice',
  role: UserRole.ADMIN // Change to UserRole.CONTRIBUTOR to test read-only mode
};

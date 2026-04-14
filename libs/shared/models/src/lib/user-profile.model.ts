import { UserRole } from './user-role.type';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
}

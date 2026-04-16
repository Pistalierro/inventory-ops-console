import { UserRole } from '@inventory-ops-console/shared-models';

export interface UserProfileFirestoreModel {
  email: string;
  displayName: string;
  role: UserRole;
}

import { UserProfile } from '@inventory-ops-console/shared-models';
import { UserProfileFirestoreModel } from './user-profile.firestore-model';

export function mapUserProfileFirestoreModel(
  uid: string,
  model: UserProfileFirestoreModel
): UserProfile {
  return {
    uid,
    email: model.email,
    displayName: model.displayName,
    role: model.role,
  };
}

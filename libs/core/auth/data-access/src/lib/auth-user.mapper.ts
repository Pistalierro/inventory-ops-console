import { User } from '@angular/fire/auth';
import { AuthUser } from './auth-user.model';

export function mapFirebaseAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
  };
}

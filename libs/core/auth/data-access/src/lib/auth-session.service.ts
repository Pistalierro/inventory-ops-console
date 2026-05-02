import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import type { UserCredential } from '@angular/fire/auth';
import {
  Auth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly auth = inject(Auth);
  private readonly injector = inject(EnvironmentInjector);

  signIn(email: string, password: string): Promise<UserCredential> {
    return runInInjectionContext(this.injector, () =>
      signInWithEmailAndPassword(this.auth, email, password)
    );
  }

  signOut(): Promise<void> {
    return runInInjectionContext(this.injector, () => signOut(this.auth));
  }

  sendPasswordReset(email: string): Promise<void> {
    return runInInjectionContext(this.injector, () =>
      sendPasswordResetEmail(this.auth, email)
    );
  }
}

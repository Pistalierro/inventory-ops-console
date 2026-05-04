import {
  EnvironmentInjector,
  inject,
  Injectable,
  runInInjectionContext,
} from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import type { UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthSessionService {
  private readonly auth = inject(Auth);
  private readonly injector = inject(EnvironmentInjector);

  signIn(
    email: string,
    password: string,
    rememberMe: boolean
  ): Promise<UserCredential> {
    return runInInjectionContext(this.injector, async () => {
      await setPersistence(
        this.auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      return signInWithEmailAndPassword(this.auth, email, password);
    });
  }

  signUp(email: string, password: string): Promise<UserCredential> {
    return runInInjectionContext(this.injector, () =>
      createUserWithEmailAndPassword(this.auth, email, password)
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

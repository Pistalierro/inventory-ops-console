import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthLoginService {
  private readonly auth = inject(Auth);

  signIn(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
}

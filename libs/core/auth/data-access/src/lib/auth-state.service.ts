import { inject, Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { mapFirebaseAuthUser } from './auth-user.mapper';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly auth = inject(Auth);

  readonly authUser = toSignal(
    authState(this.auth).pipe(
      map((user) => (user ? mapFirebaseAuthUser(user) : null))
    ),
    { initialValue: null }
  );
}

import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Auth, authState } from '@angular/fire/auth';
import { map, shareReplay } from 'rxjs';
import { mapFirebaseAuthUser } from './auth-user.mapper';

@Injectable({
  providedIn: 'root',
})
export class AuthStateService {
  private readonly auth = inject(Auth);

  readonly authUser$ = authState(this.auth).pipe(
    map((user) => (user ? mapFirebaseAuthUser(user) : null)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  readonly authUser = toSignal(this.authUser$, { initialValue: null });
}

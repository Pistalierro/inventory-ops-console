import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { UserProfile } from '@inventory-ops-console/shared-models';
import { UserProfileFirestoreModel } from './user-profile.firestore-model';
import { mapUserProfileFirestoreModel } from './user-profile.mapper';

@Injectable({
  providedIn: 'root',
})
export class UserProfileFirestoreService {
  private readonly firestore = inject(Firestore);

  getUserProfile(uid: string): Observable<UserProfile> {
    const profileRef = doc(this.firestore, `profiles/${uid}`);

    return docData(profileRef).pipe(
      map((document) =>
        mapUserProfileFirestoreModel(uid, document as UserProfileFirestoreModel)
      )
    );
  }

  createSelfProfile(params: {
    uid: string;
    email: string;
    displayName: string;
  }): Promise<void> {
    const profileRef = doc(this.firestore, `profiles/${params.uid}`);

    return setDoc(profileRef, {
      email: params.email,
      displayName: params.displayName,
      role: 'viewer',
    } satisfies UserProfileFirestoreModel);
  }
}

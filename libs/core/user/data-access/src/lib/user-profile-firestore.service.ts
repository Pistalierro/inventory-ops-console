import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore } from '@angular/fire/firestore';
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
}

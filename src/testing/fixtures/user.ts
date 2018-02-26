import * as firebase from 'firebase/app';

import { User } from '../../app/core/model/user';

export const mockFirebaseUser: firebase.User = {
  uid: 'uid',
  displayName: 'Firebase User',
  email: 'email@example.com',
  photoURL: '/assets/favicon.png',
  metadata: {
    creationTime: '2018-02-19T21:00:16.000Z',
    lastSignInTime: '2018-02-25T00:23:18.000Z',
  },
} as firebase.User;

export const mockUser: User = User.fromFirebase(mockFirebaseUser) as User;

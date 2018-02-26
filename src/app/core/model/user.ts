import * as firebase from 'firebase/app';

/**
 * User representation in the app (instantiated from Firebase user)
 */
export class User {
  public uid: string|null = null;
  public displayName: string|null = null;
  public email: string|null = null;
  public photoUrl: string|null = null;
  public createdAt?: Date;
  public lastLoginAt?: Date;

  /**
   * Create new instance of User from firebase User
   */
  public static fromFirebase(user?: firebase.User): User|undefined {
    if (user) {
      return new User({
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoUrl: user.photoURL,
        createdAt: user.metadata && user.metadata.creationTime ? new Date(user.metadata.creationTime) : undefined,
        lastLoginAt: user.metadata && user.metadata.lastSignInTime ? new Date(user.metadata.lastSignInTime) : undefined,
      });
    } else {
      return undefined;
    }
  }

  public constructor(userData: User) {
    Object.assign(this, userData);
  }
}

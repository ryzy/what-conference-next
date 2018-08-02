import { StitchUser } from 'mongodb-stitch-browser-sdk';

/**
 * User representation in the app
 */
export class User {
  public id: string = '';
  public displayName: string = '';
  public email: string = '';
  public photoUrl: string = '';

  /**
   * Create a new instance of app User from StitchUser
   */
  public static fromStitch(user: Partial<StitchUser>): User {
    return new User({
      id: user.id || 'unknown-id',
      displayName: (user.profile && (user.profile.name || user.profile.email)) || 'User Name',
      email: (user.profile && user.profile.email) || 'unknown@email.com',
      photoUrl: (user.profile && user.profile.pictureUrl) || '/assets/default-avatar.png',
    });
  }

  public constructor(userData: Partial<User>) {
    Object.assign(this, userData);
  }
}

import { User } from './user';
import { mockFirebaseUser, mockUser } from '../../../testing/fixtures/user';

describe('core/model', () => {

  describe('User', () => {
    it('#fromFirebase should create User', () => {
      expect(User.fromFirebase(mockFirebaseUser)).toEqual(mockUser);
    });
  });
});

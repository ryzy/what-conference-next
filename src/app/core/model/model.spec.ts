import { User } from './user';
import { mockStitchUser, mockUser } from '../../../testing/fixtures/user';

describe('core/model', () => {
  describe('User', () => {
    it('#fromStitch should create User', () => {
      let user = User.fromStitch(mockStitchUser);
      expect(user).toEqual(mockUser);

      // try empty obj
      user = User.fromStitch({});
      expect(user).toBeTruthy();
      expect(user.id).toBeTruthy();
      expect(user.email).toBeTruthy();
      expect(user.displayName).toBeTruthy();
    });
  });
});

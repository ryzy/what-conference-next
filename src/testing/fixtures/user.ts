import { StitchUser } from 'mongodb-stitch-browser-sdk';

import { User } from '../../app/core/model/user';

export const mockStitchUser: StitchUser = {
  id: '5b5ccb894fdd1f82c29b1afc',
  loggedInProviderName: 'oauth2-google',
  profile: {
    name: 'Mock User',
    email: 'email@example.com',
    pictureUrl: '/assets/default-avatar.png',
  },
} as StitchUser;

export const mockUser: User = User.fromStitch(mockStitchUser);

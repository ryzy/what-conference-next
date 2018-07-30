// tslint:disable:max-line-length
import { RemoteInsertOneResult, RemoteUpdateResult } from 'mongodb-stitch-browser-sdk';

export const mockStitchInsertOneResponse: RemoteInsertOneResult = {
  insertedId: {
    $oid: '5b5e48101c9d443b15217e3e',
  },
};

/**
 * Response for collection().updateOne() or .updateMany()
 */
export const mockStitchUpdateResponse: RemoteUpdateResult = {
  upsertedId: 'xyz',
  matchedCount: 1,
  modifiedCount: 1,
};

export const mockStitchLoginResponse = {
  access_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzI4ODU5ODIsImlhdCI6MTUzMjg4NDE4MiwiaXNzIjoiNWI1ZGY0ZDY0NjIyNGNlMWU2M2JmZmFkIiwic3RpdGNoX2RhdGEiOm51bGwsInN0aXRjaF9kZXZJZCI6IjViNWRmNGQ2NDYyMjRjZTFlNjNiZmZhYyIsInN0aXRjaF9kb21haW5JZCI6IjViNTdhMGFhZDUyZTkwMWMwZGU5OWZhZiIsInN1YiI6IjViNWNjMTEzMDU4NDI5Yjc4MjBhZjc4ZSIsInR5cCI6ImFjY2VzcyJ9.I4_PqjoREcjF0Kq57qC8jHEd4_DwDHSB66pAee4KHQk',
  refresh_token:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1MzgwNjgxODIsImlhdCI6MTUzMjg4NDE4Miwic3RpdGNoX2RhdGEiOm51bGwsInN0aXRjaF9kZXZJZCI6IjViNWRmNGQ2NDYyMjRjZTFlNjNiZmZhYyIsInN0aXRjaF9kb21haW5JZCI6IjViNTdhMGFhZDUyZTkwMWMwZGU5OWZhZiIsInN0aXRjaF9pZCI6IjViNWRmNGQ2NDYyMjRjZTFlNjNiZmZhZCIsInN0aXRjaF9pZGVudCI6eyJpZCI6IjViNWNjMTEzMDU4NDI5Yjc4MjBhZjc4YiIsInByb3ZpZGVyX3R5cGUiOiJsb2NhbC11c2VycGFzcyIsInByb3ZpZGVyX2lkIjoiNWI1OGI1Y2Y4ZjI1Yjk2OGFiMmI0ZWNmIn0sInN1YiI6IjViNWNjMTEzMDU4NDI5Yjc4MjBhZjc4ZSIsInR5cCI6InJlZnJlc2gifQ.m9gfqKtpp1mVhvoRd8nW9awCfgMC6uaCBAVFxo1kLes',
  user_id: '5b5cc113058429b7820af78e',
  device_id: '5b5df4d646224ce1e63bffac',
};

export const mockStitchProfileResponse = {
  user_id: '5b5cc113058429b7820af78e',
  domain_id: '5b57a0aad52e901c0de99faf',
  identities: [
    { id: '5b5cc113058429b7820af78b', provider_type: 'local-userpass', provider_id: '5b58b5cf8f25b968ab2b4ecf' },
  ],
  data: { email: 'editor@test.com' },
  type: 'normal',
};

/**
 * Returned with status 403 when doing query on a collection w/o any rules configured
 */
export const mockStitchErrorNoMatchingRuleFound = {
  error: `no rule exists for namespace 'xyz'`,
  error_code: 'NoMatchingRuleFound',
  link: 'https://stitch.mongodb.com/groups/5b577ff80bd66b2d8ec6b089/apps/5b57a0aad52e901c0de99fae/logs?co_id=q34rsd',
};

/**
 * Returned for invalid login
 */
export const mockStitchErrorLogin = {
  error: 'invalid username/password',
  link: 'https://stitch.mongodb.com/link-to-stich-console-logs',
};

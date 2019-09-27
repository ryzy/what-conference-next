import { HttpTestingController } from '@angular/common/http/testing';
import { tick } from '@angular/core/testing';
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPasswordCredential, StitchUser, RemoteDeleteResult } from 'mongodb-stitch-browser-sdk';

import { StitchService } from '../app/core/stitch/stitch.service';
import { HttpStitchTransport } from '../app/core/stitch/http-stitch-transport';
import {
  mockLocationResponse,
  mockStitchDeleteResponse,
  mockStitchInsertOneResponse,
  mockStitchLoginResponse,
  mockStitchProfileResponse,
  mockStitchUpdateResponse,
} from './fixtures/stitch';

@Injectable()
export class MockStitchService extends StitchService {
  public constructor(
    zone: NgZone,
    store: Store<any>,
    transport: HttpStitchTransport,
    private httpMock: HttpTestingController,
  ) {
    super(zone, store, transport);
  }

  public mockLogin(
    loginRes: any = mockStitchLoginResponse,
    profileRes: any = mockStitchProfileResponse,
  ): Promise<StitchUser> {
    const login = this.auth.loginWithCredential(new UserPasswordCredential('email', 'pass'));

    const r0 = this.httpMock.expectOne((req) => req.url.includes('/location'));
    r0.flush(mockLocationResponse);
    tick();

    const r1 = this.httpMock.expectOne((req) => req.url.includes('/login'));
    r1.flush(loginRes);
    tick();

    const r2 = this.httpMock.expectOne((req) => req.url.includes('/profile'));
    r2.flush(profileRes);
    tick();

    return login;
  }

  public mockInsertOneResponse(): void {
    tick();
    const r = this.httpMock.expectOne((req) => req.url.includes('/call'));
    r.flush(mockStitchInsertOneResponse);
    tick();
  }

  public mockUpdateResponse(): void {
    tick();
    const r = this.httpMock.expectOne((req) => req.url.includes('/call'));
    r.flush(mockStitchUpdateResponse);
    tick();
  }

  public mockDeleteResponse(response: RemoteDeleteResult = mockStitchDeleteResponse): void {
    tick();
    const r = this.httpMock.expectOne((req) => req.url.includes('/call'));
    r.flush(response);
    tick();
  }

  public mockCollectionFindResponse(collection: string, data: any[]): void {
    tick();
    const r = this.httpMock.expectOne((req) => req.url.includes('/call') && req.body.includes(collection));

    r.flush(
      data.map((item, idx) => {
        return {
          _id: 'mockCollectionFindResponse-' + idx,
          ...item,
        };
      }),
    );
    tick();
  }
}

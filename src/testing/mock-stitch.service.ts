import { HttpTestingController } from '@angular/common/http/testing';
import { tick } from '@angular/core/testing';
import { Injectable, NgZone } from '@angular/core';
import { Store } from '@ngrx/store';
import { UserPasswordCredential, StitchUser } from 'mongodb-stitch-browser-sdk';

import { StitchService } from '../app/core/stitch/stitch.service';
import { HttpStitchTransport } from '../app/core/stitch/http-stitch-transport';
import {
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

    const r1 = this.httpMock.expectOne((req) => req.url.includes('auth/providers'));
    r1.flush(loginRes);
    tick();

    const r2 = this.httpMock.expectOne((req) => req.url.includes('auth/profile'));
    r2.flush(profileRes);
    tick();

    return login;
  }

  public mockInsertOneResponse(): void {
    const r = this.httpMock.expectOne((req) => req.url.includes('/call'));
    r.flush(mockStitchInsertOneResponse);
    tick();
  }

  public mockUpdateResponse(): void {
    const r = this.httpMock.expectOne((req) => req.url.includes('/call'));
    r.flush(mockStitchUpdateResponse);
    tick();
  }

  public mockCollectionFindResponse(data: any[]): void {
    const r = this.httpMock.expectOne((req) => req.url.includes('/call'));
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

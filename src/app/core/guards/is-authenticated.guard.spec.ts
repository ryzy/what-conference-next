import { TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, EMPTY } from 'rxjs';

import { ActivatedRouteStub } from '../../../testing/activated-route.stub';
import { AuthServiceStub, CoreServiceStub } from '../../../testing/service-stubs';
import { mockUser } from '../../../testing/fixtures/user';
import { CoreService } from '../services/core.service';
import { IsAuthenticatedGuard } from './is-authenticated.guard';
import { AuthService } from '../services/auth.service';

describe('IsAuthenticatedGuard', () => {
  let activatedRoute: ActivatedRouteStub;
  let guard: IsAuthenticatedGuard;
  let authService: AuthService;
  let coreService: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, MatSnackBarModule],
      providers: [
        { provide: CoreService, useValue: CoreServiceStub },
        { provide: AuthService, useValue: AuthServiceStub },
      ],
    });

    guard = TestBed.get(IsAuthenticatedGuard);
    authService = TestBed.get(AuthService);
    coreService = TestBed.get(CoreService);
  });

  describe('should return true for authenticated user', () => {
    beforeEach(() => {
      activatedRoute = new ActivatedRouteStub();
      spyOn(coreService, 'whenAuthAndDbReady').and.returnValue(of(true));
      spyOn(authService, 'getUser').and.returnValue(of(mockUser));
    });

    it('#canActivate', () => {
      let canActivate: boolean | undefined;
      guard.canActivate(activatedRoute.snapshot).subscribe((res) => (canActivate = res));
      expect(canActivate).toBe(true);
    });

    it('#canActivateChild', () => {
      let canActivateChild: boolean | undefined;
      guard.canActivateChild(activatedRoute.snapshot).subscribe((res) => (canActivateChild = res));
      expect(canActivateChild).toBe(true);
    });

    it('#canLoad', () => {
      let canLoad: boolean | undefined;
      guard.canLoad({}).subscribe((res) => (canLoad = res));
      expect(canLoad).toBe(true);
    });
  });

  describe("should should do nothing if auth didn't complete yet", () => {
    beforeEach(() => {
      activatedRoute = new ActivatedRouteStub();
      spyOn(coreService, 'whenAuthAndDbReady').and.returnValue(EMPTY);
    });
    it('#canActivate', () => {
      let canActivate: boolean | undefined;
      guard.canActivate(activatedRoute.snapshot).subscribe((res) => (canActivate = res));
      expect(canActivate).toBe(undefined);
    });
    it('#canActivateChild', () => {
      let canActivateChild: boolean | undefined;
      guard.canActivateChild(activatedRoute.snapshot).subscribe((res) => (canActivateChild = res));
      expect(canActivateChild).toBe(undefined);
    });
    it('#canLoad', () => {
      let canLoad: boolean | undefined;
      guard.canLoad({}).subscribe((res) => (canLoad = res));
      expect(canLoad).toBe(undefined);
    });
  });
  describe('should return false and redirect for anonymous user', () => {
    const loginUrl = 'login-url';
    beforeEach(() => {
      activatedRoute = new ActivatedRouteStub();
      spyOn(coreService, 'whenAuthAndDbReady').and.returnValue(of(true));
      spyOn(authService, 'getUser').and.returnValue(of(false));
      spyOn(authService, 'navigateToLoginScreen');
    });
    it('#canActivate', () => {
      let canActivate: boolean | undefined;
      guard.canActivate(activatedRoute.snapshot).subscribe((res) => (canActivate = res));
      expect(canActivate).toBe(false);
      expect(authService.navigateToLoginScreen).toHaveBeenCalledWith(undefined);

      // test case: provide data with `canActivateRedirectUrl` and check if we're redirected there...
      activatedRoute.testData = { canActivateRedirectUrl: loginUrl };
      let canActivate2: boolean | undefined;
      guard.canActivate(activatedRoute.snapshot).subscribe((res) => (canActivate2 = res));
      expect(canActivate2).toBe(false);
      expect(authService.navigateToLoginScreen).toHaveBeenCalledWith(loginUrl);
    });
    it('#canActivateChild', () => {
      activatedRoute.testData = { canActivateRedirectUrl: loginUrl };
      let canActivateChild: boolean | undefined;
      guard.canActivateChild(activatedRoute.snapshot).subscribe((res) => (canActivateChild = res));
      expect(canActivateChild).toBe(false);
      expect(authService.navigateToLoginScreen).toHaveBeenCalledWith(loginUrl);
    });
    it('#canLoad', () => {
      let canLoad: boolean | undefined;
      guard.canLoad({ data: { canActivateRedirectUrl: loginUrl } }).subscribe((res) => (canLoad = res));
      expect(canLoad).toBe(false);
      expect(authService.navigateToLoginScreen).toHaveBeenCalledWith(loginUrl);
    });
  });
});

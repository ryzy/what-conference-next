import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { ActivatedRouteStub } from '../../../testing/activated-route.stub';
import { AuthServiceStub } from '../../../testing/service-stubs';
import { mockUser } from '../../../testing/fixtures/user';
import { IsAnonymousGuard } from './is-anonymous.guard';
import { AuthService } from '../services/auth.service';

describe('IsAnonymousGuard', () => {
  let activatedRoute: ActivatedRouteStub;
  let guard: IsAnonymousGuard;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: AuthService, useValue: AuthServiceStub }],
    });
    guard = TestBed.get(IsAnonymousGuard);
    authService = TestBed.get(AuthService);
  });
  describe('should return true for anonymous user', () => {
    beforeEach(() => {
      activatedRoute = new ActivatedRouteStub();
      spyOn(authService, 'getUser').and.returnValue(of(undefined));
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
      guard.canActivate(activatedRoute.snapshot).subscribe((res) => (canLoad = res));
      expect(canLoad).toBe(true);
    });
  });

  describe('should return false and redirect for authenticated user', () => {
    const afterLoginUrl = 'foo-url';
    beforeEach(() => {
      activatedRoute = new ActivatedRouteStub();
      spyOn(authService, 'getUser').and.returnValue(of(mockUser));
      spyOn(authService, 'navigateToAfterLoginScreen');
    });

    it('#canActivate', () => {
      let canActivate1: boolean | undefined;
      guard.canActivate(activatedRoute.snapshot).subscribe((res) => (canActivate1 = res));
      expect(canActivate1).toBe(false);
      expect(authService.navigateToAfterLoginScreen).toHaveBeenCalledWith(undefined);

      // test case: provide data with `canActivateRedirectUrl` and check if we're redirected there...
      activatedRoute.testData = { canActivateRedirectUrl: afterLoginUrl };
      let canActivate2: boolean | undefined;
      guard.canActivate(activatedRoute.snapshot).subscribe((res) => (canActivate2 = res));
      expect(canActivate2).toBe(false);
      expect(authService.navigateToAfterLoginScreen).toHaveBeenCalledWith(afterLoginUrl);
    });

    it('#canActivateChild', () => {
      activatedRoute.testData = { canActivateRedirectUrl: afterLoginUrl };
      let canActivateChild: boolean | undefined;
      guard.canActivate(activatedRoute.snapshot).subscribe((res) => (canActivateChild = res));
      expect(canActivateChild).toBe(false);
      expect(authService.navigateToAfterLoginScreen).toHaveBeenCalledWith(afterLoginUrl);
    });

    it('#canLoad', () => {
      let canLoad: boolean | undefined;
      guard.canLoad({ data: { canActivateRedirectUrl: afterLoginUrl } }).subscribe((res) => (canLoad = res));
      expect(canLoad).toBe(false);
      expect(authService.navigateToAfterLoginScreen).toHaveBeenCalledWith(afterLoginUrl);
    });
  });
});

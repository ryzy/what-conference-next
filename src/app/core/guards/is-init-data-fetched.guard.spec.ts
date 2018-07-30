import { TestBed } from '@angular/core/testing';
import { of, EMPTY } from 'rxjs';

import { ActivatedRouteStub } from '../../../testing/activated-route.stub';
import { CoreServiceStub } from '../../../testing/service-stubs';
import { CoreService } from '../services/core.service';
import { IsInitDataFetchedGuard } from './is-init-data-fetched.guard';

describe('IsInitDataFetchedGuard', () => {
  let activatedRoute: ActivatedRouteStub;
  let guard: IsInitDataFetchedGuard;
  let coreService: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CoreService, useValue: CoreServiceStub }],
    });

    guard = TestBed.get(IsInitDataFetchedGuard);
    coreService = TestBed.get(CoreService);
    activatedRoute = new ActivatedRouteStub();
  });

  it('#canActivate when data is NOT fetched should wait...', () => {
    spyOn(coreService, 'whenInitDataFetched').and.returnValue(EMPTY);
    let canActivate: boolean | undefined;
    guard.canActivateChild(activatedRoute.snapshot).subscribe((res) => (canActivate = res));
    expect(canActivate).toBe(undefined);
  });

  it('#canActivate should pass when data IS fetched', () => {
    spyOn(coreService, 'whenInitDataFetched').and.returnValue(of(true));
    let canActivate: boolean | undefined;
    guard.canActivateChild(activatedRoute.snapshot).subscribe((res) => (canActivate = res));
    expect(canActivate).toBe(true);
  });
});

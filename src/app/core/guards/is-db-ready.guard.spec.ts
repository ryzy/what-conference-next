import { TestBed } from '@angular/core/testing';
import { of, EMPTY } from 'rxjs';

import { ActivatedRouteStub } from '../../../testing/activated-route.stub';
import { CoreServiceStub } from '../../../testing/service-stubs';
import { CoreService } from '../services/core.service';
import { IsDbReadyGuard } from './is-db-ready.guard';

describe('IsDbReadyGuard', () => {
  let activatedRoute: ActivatedRouteStub;
  let guard: IsDbReadyGuard;
  let coreService: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: CoreService, useValue: CoreServiceStub }],
    });

    guard = TestBed.get(IsDbReadyGuard);
    coreService = TestBed.get(CoreService);
    activatedRoute = new ActivatedRouteStub();
  });

  it('#canActivate when db is NOT ready should wait...', () => {
    spyOn(coreService, 'whenAuthAndDbReady').and.returnValue(EMPTY);
    let canActivate: boolean | undefined;
    guard.canActivateChild(activatedRoute.snapshot).subscribe((res) => (canActivate = res));
    expect(canActivate).toBe(undefined);
  });

  it('#canActivate should pass when db is ready', () => {
    spyOn(coreService, 'whenAuthAndDbReady').and.returnValue(of(true));
    let canActivate: boolean | undefined;
    guard.canActivateChild(activatedRoute.snapshot).subscribe((res) => (canActivate = res));
    expect(canActivate).toBe(true);
  });
});

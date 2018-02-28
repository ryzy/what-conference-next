import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterStateSerializer } from '@ngrx/router-store';

import { AppRouterState } from './router';
import { AppRouterStateSerializer } from './router-state-serializer';

describe('AppRouterStateSerializer', () => {
  let serializer: AppRouterStateSerializer;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        { provide: RouterStateSerializer, useClass: AppRouterStateSerializer },
      ],
    });

    serializer = TestBed.get(RouterStateSerializer);
    router = TestBed.get(Router);
  });

  it('should serialize', () => {
    const res: AppRouterState = serializer.serialize(router.routerState.snapshot);
    expect(res.url).toBe('');
    expect(res.fragment).toBe('');
    expect(res.params).toEqual({});
    expect(res.queryParams).toEqual({});
    expect(res.data).toEqual({});
  });
});

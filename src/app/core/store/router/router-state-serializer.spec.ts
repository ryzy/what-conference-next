import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RouterStateSerializer } from '@ngrx/router-store';

import { AppRouterState } from './router';
import { AppRouterStateSerializer } from './router-state-serializer';

describe('AppRouterStateSerializer', () => {
  let serializer: AppRouterStateSerializer;
  let router: Router;
  let routerSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{ provide: RouterStateSerializer, useClass: AppRouterStateSerializer }],
    });

    serializer = TestBed.get(RouterStateSerializer);
    router = TestBed.get(Router);
    routerSnapshot = router.routerState.snapshot;
  });

  it('should serialize', () => {
    const mockUrl = '/mock/url';
    routerSnapshot.url = mockUrl;

    const res: AppRouterState = serializer.serialize(routerSnapshot);
    expect(res.url).toBe(mockUrl);
    expect(res.urlFull).toBe(mockUrl);
    expect(res.fragment).toBe('');
    expect(res.params).toEqual({});
    expect(res.queryParams).toEqual({});
    expect(res.data).toEqual({});
  });

  it('should serialize clean urls', () => {
    let mockUrl: string = '/mock/url';
    let mockUrlFull: string = mockUrl;
    routerSnapshot.url = mockUrlFull;
    let res: AppRouterState = serializer.serialize(routerSnapshot);
    expect(res.url).toBe(mockUrl);
    expect(res.urlFull).toBe(mockUrlFull);

    mockUrl = '/some/url';
    mockUrlFull = `${mockUrl};with=customParam;another=param?some=queryParams#andFragment`;
    routerSnapshot.url = mockUrlFull;
    res = serializer.serialize(routerSnapshot);
    expect(res.url).toBe(mockUrl);
    expect(res.urlFull).toBe(mockUrlFull);

    mockUrl = '/';
    mockUrlFull = `${mockUrl}?some=queryParams&some=other#andFragment`;
    routerSnapshot.url = mockUrlFull;
    res = serializer.serialize(routerSnapshot);
    expect(res.url).toBe(mockUrl);
    expect(res.urlFull).toBe(mockUrlFull);

    mockUrl = '/path/';
    mockUrlFull = `${mockUrl}#fragment`;
    routerSnapshot.url = mockUrlFull;
    res = serializer.serialize(routerSnapshot);
    expect(res.url).toBe(mockUrl);
    expect(res.urlFull).toBe(mockUrlFull);
  });
});

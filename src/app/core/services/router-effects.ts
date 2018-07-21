import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as fromRouter from '../store/router/router-actions';
import { RouterActionType } from '../store/router/router-actions';

@Injectable({
  providedIn: 'root',
})
export class RouterEffects {
  @Effect({ dispatch: false })
  public navigate$: Observable<any> = this.actions$.pipe(
    ofType<fromRouter.GoAction>(RouterActionType.GO),
    tap((action: fromRouter.GoAction) => {
      this.router.navigate(action.path, action.extras);
    }),
  );

  @Effect({ dispatch: false })
  public navigateBack$: Observable<Action> = this.actions$.pipe(
    ofType(RouterActionType.BACK),
    tap(() => this.location.back()),
  );

  @Effect({ dispatch: false })
  public navigateForward$: Observable<Action> = this.actions$.pipe(
    ofType(RouterActionType.FORWARD),
    tap(() => this.location.forward()),
  );

  public constructor(private actions$: Actions, private router: Router, private location: Location) {}
}

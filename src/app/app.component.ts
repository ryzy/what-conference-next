import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { User } from './core/model/user';

import { AuthService } from './core/services/auth.service';
import { AppRootState } from './core/store/index';
import { GoAction } from './core/store/router/router-actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public user$: Observable<User|undefined>;

  public constructor(authService: AuthService, private store: Store<AppRootState>) {
    this.user$ = authService.getCurrentUser();
  }

  public goToNewEvent(): void {
    this.store.dispatch(new GoAction(['ev']));
  }
}

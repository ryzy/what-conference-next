import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from './core/model/user';

import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public user$: Observable<User|undefined>;

  public constructor(authService: AuthService) {
    this.user$ = authService.getCurrentUser();
  }
}

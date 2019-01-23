import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { Observable } from 'rxjs';

import { AuthService } from './core/services/auth.service';
import { User } from './core/model/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  public user$: Observable<User | undefined>;

  public constructor(authService: AuthService, ga: Angulartics2GoogleAnalytics) {
    this.user$ = authService.getUser();

    // Needs to be injected/used, so it actually start sending page views...
    ga.startTracking();
    ga.setUserProperties({});
  }
}

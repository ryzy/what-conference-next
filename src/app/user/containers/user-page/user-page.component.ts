import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';

import { User } from '../../../core/model/user';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-view',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPageComponent implements OnInit {
  public user$: Observable<User | undefined>;

  public constructor(public authService: AuthService) {
    this.user$ = this.authService.getUser();
  }

  public ngOnInit(): void {}

  public loginGoogle(): void {
    this.authService.loginWithGoogle();
  }

  public loginFacebook(): void {
    this.authService.loginWithFacebook();
  }

  public logout(): void {
    this.authService.logout();
  }
}

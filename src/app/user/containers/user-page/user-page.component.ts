import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

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
    this.user$ = this.authService.getCurrentUser();
  }

  public ngOnInit(): void {
    (this.authService.getFirebaseUser().pipe(filter((u) => !!u)) as Observable<firebase.User>).subscribe(
      (u: firebase.User) => {
        console.log('UserPageComponent, user', u);
        // if ('editor@test.com' === u.email) {
        //   u.updateProfile({
        //     displayName: 'Test Editor',
        //     photoURL: 'https://cdn0.iconfinder.com/data/icons/iconshock_guys/512/andrew.png'
        //   });
        // }
      },
    );
  }

  public login(): void {
    this.authService.loginWithDefaultMethod();
  }

  public logout(): void {
    this.authService.logout();
  }
}

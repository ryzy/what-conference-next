import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { User } from '../../../core/model/user';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPageComponent implements OnInit {
  public user$: Observable<User|undefined>;

  public constructor(public authService: AuthService) {
    this.user$ = this.authService.getCurrentUser();
  }

  public ngOnInit(): void {

  }

  public login(): void {
    this.authService.loginWithPopup();
  }

  public logout(): void {
    this.authService.logout();
  }
}

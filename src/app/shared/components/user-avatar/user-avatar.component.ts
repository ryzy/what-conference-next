import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { User } from '../../../core/model/user';

@Component({
  selector: 'app-user-avatar',
  host: {
    class: 'app-user-avatar',
    '[class.app-user-avatar--logged-in]': 'user',
  },
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  @Input()
  public user: User | undefined;
}

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

import { User } from '../../../core/model/user';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAvatarComponent {
  @Input() public user: User | undefined;
}

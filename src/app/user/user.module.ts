import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';

import { UserRoutingModule } from './user-routing.module';
import { UserPageComponent } from './containers/user-page/user-page.component';

@NgModule({
  imports: [SharedModule, UserRoutingModule],
  declarations: [UserPageComponent],
})
export class UserModule {}

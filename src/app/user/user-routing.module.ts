import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPageComponent } from './containers/user-page/user-page.component';
import { LoginFormPageComponent } from './containers/login-form-page/login-form-page.component';

const routes: Routes = [
  {
    path: '',
    component: UserPageComponent,
  },
  {
    path: 'login',
    component: LoginFormPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UserRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserPageComponent } from './containers/user-page/user-page.component';
import { LoginFormPageComponent } from './containers/login-form-page/login-form-page.component';
import { LoginApiKeyComponent } from './containers/login-api-key/login-api-key.component';

const routes: Routes = [
  {
    path: '',
    component: UserPageComponent,
  },
  {
    path: 'login',
    component: LoginFormPageComponent,
  },
  {
    path: 'auth',
    component: LoginApiKeyComponent,
  },
  {
    path: 'auth/:apiKey',
    component: LoginApiKeyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class UserRoutingModule {}

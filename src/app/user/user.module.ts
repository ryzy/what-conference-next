import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from '../shared/shared.module';
import { UserRoutingModule } from './user-routing.module';
import { LoginApiKeyComponent } from './containers/login-api-key/login-api-key.component';
import { LoginFormPageComponent } from './containers/login-form-page/login-form-page.component';
import { UserPageComponent } from './containers/user-page/user-page.component';

@NgModule({
  imports: [SharedModule, UserRoutingModule, ReactiveFormsModule, A11yModule, MatInputModule],
  declarations: [UserPageComponent, LoginFormPageComponent, LoginApiKeyComponent],
})
export class UserModule {}

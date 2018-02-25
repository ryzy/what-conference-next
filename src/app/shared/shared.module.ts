import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material';

import { NotFoundPageComponent } from './containers/not-found-page/not-found-page.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';

export const IMPORT_EXPORT_MODULES = [
  CommonModule,
  RouterModule,
  ReactiveFormsModule,
];

// Material Design modules (but only those which truly needs to be shared)
export const MAT_SHARED_MODULES = [
  MatIconModule,
  MatButtonModule,
  MatCardModule,
];

export const APP_COMPONENTS = [
  NotFoundPageComponent,
  UserAvatarComponent,
];

@NgModule({
  imports: [
    ...IMPORT_EXPORT_MODULES,
    ...MAT_SHARED_MODULES,
  ],
  exports: [
    ...IMPORT_EXPORT_MODULES,
    ...MAT_SHARED_MODULES,
    ...APP_COMPONENTS,
  ],
  declarations: [
    ...APP_COMPONENTS,
  ],
})
export class SharedModule {
}

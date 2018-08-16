import { A11yModule } from '@angular/cdk/a11y';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OverlayModule } from '@angular/cdk/overlay';
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatSnackBarModule } from '@angular/material';

import { NotFoundPageComponent } from './containers/not-found-page/not-found-page.component';
import { UserAvatarComponent } from './components/user-avatar/user-avatar.component';
import { ConfirmationComponent } from './components/confirmation/confirmation.component';
import { LoaderComponent } from './components/loader/loader.component';

export const IMPORT_EXPORT_MODULES = [CommonModule, RouterModule];

// Material Design modules (but only those which truly needs to be shared)
export const MAT_SHARED_MODULES = [
  A11yModule,
  OverlayModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatSnackBarModule,
];

export const APP_COMPONENTS = [NotFoundPageComponent, LoaderComponent, UserAvatarComponent, ConfirmationComponent];

@NgModule({
  imports: [...IMPORT_EXPORT_MODULES, ...MAT_SHARED_MODULES],
  exports: [...IMPORT_EXPORT_MODULES, ...MAT_SHARED_MODULES, ...APP_COMPONENTS],
  declarations: [...APP_COMPONENTS],
  entryComponents: [ConfirmationComponent],
})
export class SharedModule {}

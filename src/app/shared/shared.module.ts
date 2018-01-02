import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatCardModule, MatIconModule } from '@angular/material';

import { NotFoundPageComponent } from './containers/not-found-page/not-found-page.component';

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

@NgModule({
  imports: [
    ...IMPORT_EXPORT_MODULES,
    ...MAT_SHARED_MODULES,
  ],
  exports: [
    ...IMPORT_EXPORT_MODULES,
    ...MAT_SHARED_MODULES,
  ],
  declarations: [
    NotFoundPageComponent,
  ],
})
export class SharedModule {
}

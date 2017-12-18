import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  MatSlideToggleModule, MatMenuModule, MatInputModule, MatSelectModule, MatTabsModule,
  MatCheckboxModule, MatIconModule, MatListModule, MatDatepickerModule, MatNativeDateModule, MatCardModule, MatToolbarModule,
  MatTableModule, MatFab, MatButtonModule, MatChipsModule,
} from '@angular/material';

/**
 * All imports which we also want to export from Shared module
 */
const IMPORT_EXPORT_MODULES: any[] = [
  CommonModule,
  RouterModule,

  // CDK modules
  CdkTableModule,
  // MD modules
  MatButtonModule,
  MatCheckboxModule,
  MatCardModule,
  MatChipsModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatTableModule,
  MatToolbarModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatTabsModule,
];

/**
 * Components, directives, pipes declared in Shared module
 */
const APP_DECLARABLES: any[] = [
];

/**
 * Shared module for shared components, directives, pipes.
 * To be used by other feature modules.
 * @see https://angular.io/styleguide#!#04-10
 */
@NgModule({
  imports: [
    ...IMPORT_EXPORT_MODULES,
  ],
  providers: [
  ],
  declarations: [
    ...APP_DECLARABLES,
  ],
  exports: [
    ...IMPORT_EXPORT_MODULES,
    ...APP_DECLARABLES,
  ]
})
export class SharedModule {
}

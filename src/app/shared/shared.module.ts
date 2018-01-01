import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material';

@NgModule({
  imports: [],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,

    // Material Design modules (but only these which are *needed* everywhere)
    MatIconModule,
  ],
})
export class SharedModule {
}

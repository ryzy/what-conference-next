import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepickerModule,
  MatInputModule,
  MatNativeDateModule,
  MatSelectModule,
  MatCheckboxModule,
  MatAutocompleteModule,
  MatProgressSpinnerModule,
  MatTooltipModule,
  MatSnackBarModule,
} from '@angular/material';
import { A11yModule } from '@angular/cdk/a11y';

import { SharedModule } from '../shared/shared.module';
import { EventBaseModule } from '../event-base/event-base.module';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventFormPageComponent } from './event-form-page/event-form-page.component';
import { EventFormRoutingModule } from './event-form-routing.module';

@NgModule({
  imports: [
    ReactiveFormsModule,

    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,

    SharedModule,
    EventBaseModule,
    EventFormRoutingModule,
  ],
  providers: [],
  declarations: [EventFormComponent, EventFormPageComponent],
})
export class EventFormModule {}

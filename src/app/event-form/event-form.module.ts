import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

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

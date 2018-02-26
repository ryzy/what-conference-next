import { NgModule } from '@angular/core';
import { MatDatepickerModule, MatInputModule, MatNativeDateModule, MAT_DATE_LOCALE, MatSelectModule } from '@angular/material';
import { A11yModule } from '@angular/cdk/a11y';

import { SharedModule } from '../shared/shared.module';
import { EventFormComponent } from './components/event-form/event-form.component';
import { EventPageComponent } from './containers/event-page/event-page.component';
import { EventRoutingModule } from './event-routing.module';

@NgModule({
  imports: [
    SharedModule,
    EventRoutingModule,
    A11yModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: window.navigator.language },
  ],
  declarations: [
    EventPageComponent,
    EventFormComponent,
  ],
})
export class EventModule {}

import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatPseudoCheckboxModule,
  MatSelectModule,
  MatSlideToggleModule,
  MatSortModule,
  MatTableModule,
} from '@angular/material';

import { EventBaseModule } from '../event-base/event-base.module';
import { SharedModule } from '../shared/shared.module';
import { EventsFilterComponent } from './components/events-filter/events-filter.component';
import { EventsListRoutingModule } from './events-list-routing.module';
import { EventsPageView } from './events-view/events-page.view';

@NgModule({
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatSlideToggleModule,
    MatSelectModule,
    EventBaseModule,
    SharedModule,
    EventsListRoutingModule,
  ],
  providers: [],
  declarations: [EventsPageView, EventsFilterComponent],
})
export class EventsListModule {}

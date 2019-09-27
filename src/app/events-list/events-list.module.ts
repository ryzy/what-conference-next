import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';

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
    SharedModule,
    EventBaseModule,
    EventsListRoutingModule,
  ],
  providers: [],
  declarations: [EventsPageView, EventsFilterComponent],
})
export class EventsListModule {}

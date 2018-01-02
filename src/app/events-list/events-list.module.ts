import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material';

import { SharedModule } from '../shared/shared.module';
import { EventsListService } from './services/events-list.service';
import { EventsTableComponent } from './components/events-table/events-table.component';
import { EventsListRoutingModule } from './events-list-routing.module';
import { EventsPageComponent } from './containers/events-page/events-page.component';

@NgModule({
  imports: [
    SharedModule,
    MatTableModule,
    EventsListRoutingModule,
  ],
  providers: [
    EventsListService,
  ],
  declarations: [
    EventsPageComponent,
    EventsTableComponent,
  ],
})
export class EventsListModule {}

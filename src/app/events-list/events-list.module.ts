import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { EventsListRoutingModule } from './events-list-routing.module';
import { EventsListComponent } from './events-list.component';

@NgModule({
  imports: [
    SharedModule,
    EventsListRoutingModule,
  ],
  declarations: [
    EventsListComponent,
  ],
})
export class EventsListModule {}

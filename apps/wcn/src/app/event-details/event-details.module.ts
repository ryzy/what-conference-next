import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { EventDetailsPageComponent } from './event-details-page/event-details-page.component';
import { EventDetailsRoutingModule } from './event-details-routing.module';

@NgModule({
  imports: [CommonModule, SharedModule, EventDetailsRoutingModule],
  declarations: [EventDetailsPageComponent],
})
export class EventDetailsModule {}

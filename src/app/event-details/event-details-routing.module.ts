import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventDetailsPageComponent } from './event-details-page/event-details-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/',
  },
  {
    path: ':eventId',
    component: EventDetailsPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EventDetailsRoutingModule {}

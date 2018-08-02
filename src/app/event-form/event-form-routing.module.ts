import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventFormPageComponent } from './event-form-page/event-form-page.component';

const routes: Routes = [
  {
    path: '',
    component: EventFormPageComponent,
  },
  {
    path: ':eventId',
    component: EventFormPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EventFormRoutingModule {}

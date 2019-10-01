import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsPageView } from './events-view/events-page.view';

const routes: Routes = [
  {
    path: '',
    component: EventsPageView,
  },
  {
    path: 'q',
    component: EventsPageView,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class EventsListRoutingModule {}

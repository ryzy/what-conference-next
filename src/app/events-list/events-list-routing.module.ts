import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsPageComponent } from './containers/events-page/events-page.component';

const routes: Routes = [
  {
    path: '',
    component: EventsPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class EventsListRoutingModule {
}

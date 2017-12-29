import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventsListComponent } from './events-list.component';

const routes: Routes = [
  {
    path: '',
    component: EventsListComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class EventsListRoutingModule {
}

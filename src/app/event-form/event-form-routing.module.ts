import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventFormPageComponent } from './containers/event-form-page/event-form-page.component';

const routes: Routes = [
  {
    path: '',
    component: EventFormPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
})
export class EventFormRoutingModule {
}

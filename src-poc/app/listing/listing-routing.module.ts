import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListingPageComponent } from './components/listing-page.component';

const routes: Routes = [
  {
    path: '',
    component: ListingPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class ListingRoutingModule {
}

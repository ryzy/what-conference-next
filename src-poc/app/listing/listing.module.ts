import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { ListingRoutingModule } from './listing-routing.module';
import { ListingPageComponent } from './components/listing-page.component';

@NgModule({
  imports: [
    SharedModule,
    ListingRoutingModule,
  ],
  declarations: [
    ListingPageComponent,
  ]
})
export class ListingModule { }

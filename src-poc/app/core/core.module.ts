import { NgModule, Optional, SkipSelf } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { throwIfAlreadyLoaded } from './utils';

/**
 * CoreModule, must be imported only by root module.
 * @see https://angular.io/styleguide#!#04-11
 */
@NgModule({
  // This is the CoreModule added to the root AppModule.
  // Therefore we import here everything needed by AppModule, incl. BrowserModule.
  imports  : [
    BrowserModule,
    BrowserAnimationsModule,
  ],
  providers: [
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule?: CoreModule) {
    throwIfAlreadyLoaded(parentModule, this.constructor.name);
  }
}

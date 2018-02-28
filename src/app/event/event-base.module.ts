import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { EventEffects } from './services/event-effects';
import { EventsFeatureStoreName, eventsInitialState, eventsReducers } from './store/index';

/**
 * Base module for other Event* feature modules.
 */
@NgModule({
  imports: [
    StoreModule.forFeature(EventsFeatureStoreName, eventsReducers, { initialState: eventsInitialState }),
    EffectsModule.forFeature([EventEffects]),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: window.navigator.language },
  ],
})
export class EventBaseModule {}

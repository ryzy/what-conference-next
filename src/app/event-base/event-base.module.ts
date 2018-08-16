import { NgModule } from '@angular/core';
import { MAT_DATE_LOCALE } from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { EventsEffects } from './services/events-effects';
import { EventsFeatureStoreName, eventsInitialState, eventsReducers } from './store/index';

/**
 * Base module for other Event* feature modules.
 */
@NgModule({
  imports: [
    StoreModule.forFeature(EventsFeatureStoreName, eventsReducers, { initialState: eventsInitialState }),
    EffectsModule.forFeature([EventsEffects]),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: window.navigator.language },
    // { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
})
export class EventBaseModule {}

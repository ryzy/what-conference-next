import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MatChipsModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { EventsEffects } from './services/events-effects';
import { EventsFeatureStoreName, eventsInitialState, eventsReducers } from './store/index';
import { TagsSelectorComponent } from './components/tags-selector/tags-selector.component';

export const FEATURE_MODULE_COMPONENTS: any[] = [TagsSelectorComponent];
export const MAT_MODULES = [MatChipsModule, MatFormFieldModule, MatSelectModule];
/**
 * Base module for other Event* feature modules.
 */
@NgModule({
  imports: [
    SharedModule,
    ReactiveFormsModule,
    StoreModule.forFeature(EventsFeatureStoreName, eventsReducers, { initialState: eventsInitialState }),
    EffectsModule.forFeature([EventsEffects]),
    ...MAT_MODULES,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: window.navigator.language },
    // { provide: ErrorStateMatcher, useClass: ShowOnDirtyErrorStateMatcher },
  ],
  declarations: [...FEATURE_MODULE_COMPONENTS],
  exports: [...FEATURE_MODULE_COMPONENTS, ...MAT_MODULES],
})
export class EventBaseModule {}

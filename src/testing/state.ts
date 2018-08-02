import { AppRootState } from '../app/core/store/index';
import { EventsRootState } from '../app/event-base/store/index';

/**
 * Store shape, for the entire app
 */
export type FullAppRootState = AppRootState & EventsRootState;

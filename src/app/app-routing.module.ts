import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { IsAuthenticatedGuard } from './core/guards/is-authenticated.guard';

import { IsInitDataFetchedGuard } from './core/guards/is-init-data-fetched.guard';
import { NotFoundPageComponent } from './shared/containers/not-found-page/not-found-page.component';

// Application root routes
const appRoutes: Routes = [
  {
    path: '',
    loadChildren: () => import('./events-list/events-list.module').then(m => m.EventsListModule),
    canActivate: [IsInitDataFetchedGuard],
  },
  {
    path: 'ev',
    loadChildren: () => import('./event-details/event-details.module').then(m => m.EventDetailsModule),
    canActivate: [IsInitDataFetchedGuard],
  },
  {
    path: 'edit',
    loadChildren: () => import('./event-form/event-form.module').then(m => m.EventFormModule),
    canActivate: [IsInitDataFetchedGuard, IsAuthenticatedGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [IsInitDataFetchedGuard],
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      // enableTracing: true,
      initialNavigation: 'enabled',
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
      relativeLinkResolution: 'corrected',
      preloadingStrategy: PreloadAllModules,
    }),
  ],
})
export class AppRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { IsDbReadyGuard } from './core/guards/is-db-ready.guard';

import { NotFoundPageComponent } from './shared/containers/not-found-page/not-found-page.component';

// Application root routes
const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './events-list/events-list.module#EventsListModule',
    canActivate: [IsDbReadyGuard],
  },
  {
    path: 'ev',
    loadChildren: './event-details/event-details.module#EventDetailsModule',
    canActivate: [IsDbReadyGuard],
  },
  {
    path: 'edit',
    loadChildren: './event-form/event-form.module#EventFormModule',
    canActivate: [IsDbReadyGuard],
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule',
  },
  {
    path: '**',
    component: NotFoundPageComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
})
export class AppRoutingModule {}

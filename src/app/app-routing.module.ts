import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

import { NotFoundPageComponent } from './shared/containers/not-found-page/not-found-page.component';

// Application root routes
const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './events-list/events-list.module#EventsListModule',
  },
  {
    path: 'event',
    loadChildren: './event/event.module#EventModule',
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
    RouterModule.forRoot( appRoutes, {
      // preloadingStrategy: PreloadAllModules,
    }),
  ],
})
export class AppRoutingModule {}

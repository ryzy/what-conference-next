import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

// Application root routes
const appRoutes: Routes = [
  {
    path: '',
    loadChildren: './events-list/events-list.module#EventsListModule',
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule',
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

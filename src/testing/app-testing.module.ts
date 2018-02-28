import { ModuleWithProviders, NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

@NgModule({
  imports: [
    NoopAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule,
  ],
  providers: [
  ],
})
export class AppTestingModule {
  // public static provideWithFirestore(): ModuleWithProviders {
  //   return {
  //     ngModule: AppTestingModule,
  //     providers: [
  //       { provide: FirestoreDbService, useClass: FirestoreDbTestingService },
  //       // Need to provide AuthEffects too, to have fully working Auth system
  //       // ...(EffectsModule.forFeature([AuthEffects]).providers as Provider[]),
  //     ],
  //   };
  // }
}

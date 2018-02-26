import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreModule } from '../app/core/core.module';
import { SharedModule } from '../app/shared/shared.module';

@NgModule({
  imports: [
    NoopAnimationsModule,
    HttpClientTestingModule,
    RouterTestingModule,
    CoreModule,
    SharedModule,
  ],
  providers: [],
})
export class AppTestingModule {}

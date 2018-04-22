import { NgModule } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

@NgModule({
  imports: [NoopAnimationsModule, HttpClientTestingModule, RouterTestingModule],
  providers: [],
})
export class AppTestingModule {}

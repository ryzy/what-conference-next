import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { AppTestingAuthAndDbModule } from '../testing/app-testing-auth-db.module';
import { AppComponent } from './app.component';
import { RouterEffects } from './core/services/router-effects';
import { SharedModule } from './shared/shared.module';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, AppTestingAuthAndDbModule, EffectsModule.forRoot([RouterEffects])],
      providers: [
        // Provide mocked GA service... no need to test it further for now.
        { provide: Angulartics2GoogleAnalytics, useValue: { setUserProperties: () => undefined } },
      ],
      declarations: [AppComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', async(() => {
    expect(app).toBeTruthy();
  }));
});

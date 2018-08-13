// tslint:disable:rxjs-throw-error
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { ActivatedRouteStub } from '../../../../testing/activated-route.stub';
import { mockUser } from '../../../../testing/fixtures/user';
import { UserModule } from '../../user.module';
import { AppTestingAuthAndDbModule } from '../../../../testing/app-testing-auth-db.module';
import { AuthService } from '../../../core/services/auth.service';
import { LoginApiKeyComponent } from './login-api-key.component';

describe('LoginApiKeyComponent', () => {
  let component: LoginApiKeyComponent;
  let fixture: ComponentFixture<LoginApiKeyComponent>;
  let authService: AuthService;
  let router: Router;
  let activatedRoute: ActivatedRouteStub;

  beforeEach(async(() => {
    activatedRoute = new ActivatedRouteStub();

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppTestingAuthAndDbModule, UserModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  }));

  beforeEach(() => {
    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(LoginApiKeyComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should login', () => {
    activatedRoute.testParams = { apiKey: 'some-api-key' };
    spyOn(authService, 'loginWithUserApiKey').and.returnValue(of(mockUser));
    fixture.detectChanges();
    expect(component.successMsg).toBeTruthy();
    expect(component.errorMsg).toBeFalsy();
  });

  it('should NOT login for invalid api key', () => {
    activatedRoute.testParams = { apiKey: 'some-api-key' };
    spyOn(authService, 'loginWithUserApiKey').and.returnValue(throwError(new Error('invalid API key')));
    fixture.detectChanges();
    expect(component.successMsg).toBeFalsy();
    expect(component.errorMsg).toBeTruthy();
  });
});

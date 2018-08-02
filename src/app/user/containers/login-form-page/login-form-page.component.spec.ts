// tslint:disable:rxjs-throw-error
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { mockStitchUser } from '../../../../testing/fixtures/user';
import { UserModule } from '../../user.module';
import { AppTestingAuthAndDbModule } from '../../../../testing/app-testing-auth-db.module';
import { LoginFormPageComponent } from './login-form-page.component';
import { AuthService } from '../../../core/services/auth.service';

describe('LoginFormPageComponent', () => {
  let component: LoginFormPageComponent;
  let fixture: ComponentFixture<LoginFormPageComponent>;
  let authService: AuthService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppTestingAuthAndDbModule, UserModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    authService = TestBed.get(AuthService);
    router = TestBed.get(Router);
    fixture = TestBed.createComponent(LoginFormPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should login', async () => {
    fixture.detectChanges();
    const signInSpy = spyOn(authService, 'signInWithEmailAndPassword').and.returnValue(of(mockStitchUser));
    const navigateSpy = spyOn(router, 'navigate');

    component.loginForm.setValue({
      username: 'username',
      password: 'password',
    });
    await component.login();
    fixture.detectChanges();

    expect(signInSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalled();
  });

  it('should show login error', async () => {
    fixture.detectChanges();
    const signInSpy = spyOn(authService, 'signInWithEmailAndPassword').and.returnValue(
      throwError({ message: 'some/login/error' }),
    );
    const navigateSpy = spyOn(router, 'navigate');

    // fill the form and call login callback
    expect(component.loginForm.errors).toBeFalsy();
    component.loginForm.setValue({
      username: 'username',
      password: 'password',
    });
    await component.login();
    fixture.detectChanges();

    expect(signInSpy).toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();

    expect((fixture.nativeElement as HTMLElement).innerText).toContain('some/login/error');
  });

  it('should do nothing when user/pass not specified', async () => {
    const signInSpy = spyOn(authService, 'signInWithEmailAndPassword').and.returnValue(of(mockStitchUser));
    await component.login();
    expect(signInSpy).not.toHaveBeenCalled();
  });
});

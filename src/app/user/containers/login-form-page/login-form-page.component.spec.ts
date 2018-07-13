import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireAuth } from 'angularfire2/auth';

import { UserModule } from '../../user.module';
import { AppTestingAuthAndDbModule } from '../../../../testing/app-testing-with-database.module';
import { LoginFormPageComponent } from './login-form-page.component';

describe('LoginFormPageComponent', () => {
  let component: LoginFormPageComponent;
  let fixture: ComponentFixture<LoginFormPageComponent>;
  let afAuth: AngularFireAuth;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, AppTestingAuthAndDbModule, UserModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    afAuth = TestBed.get(AngularFireAuth);
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
    const signInSpy = spyOn(afAuth.auth, 'signInWithEmailAndPassword').and.returnValue(Promise.resolve(true));
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
    const signInSpy = spyOn(afAuth.auth, 'signInWithEmailAndPassword').and.returnValue(
      Promise.reject({
        code: 'some/login/error',
      }),
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
    const signInSpy = spyOn(afAuth.auth, 'signInWithEmailAndPassword').and.returnValue(Promise.resolve(true));
    await component.login();
    expect(signInSpy).not.toHaveBeenCalled();
  });
});

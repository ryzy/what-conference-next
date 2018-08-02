import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTestingAuthAndDbModule } from '../../../../testing/app-testing-auth-db.module';
import { AuthService } from '../../../core/services/auth.service';
import { UserModule } from '../../user.module';
import { UserPageComponent } from './user-page.component';

describe('UserPageComponent', () => {
  let component: UserPageComponent;
  let fixture: ComponentFixture<UserPageComponent>;
  let authService: AuthService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule, UserModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    authService = TestBed.get(AuthService);
    fixture = TestBed.createComponent(UserPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should login', () => {
    const signInSpy = spyOn(authService, 'loginWithGoogle');
    component.loginGoogle();
    expect(signInSpy).toHaveBeenCalled();
  });

  it('should log out', () => {
    const signOutSpy = spyOn(authService, 'logout');
    component.logout();
    expect(signOutSpy).toHaveBeenCalled();
  });
});

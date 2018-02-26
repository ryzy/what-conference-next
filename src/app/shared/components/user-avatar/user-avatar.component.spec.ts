import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mockUser } from '../../../../testing/fixtures/user';

import { User } from '../../../core/model/user';
import { SharedModule } from '../../shared.module';
import { UserAvatarComponent } from './user-avatar.component';

describe('UserAvatarComponent', () => {
  let component: UserAvatarComponent;
  let fixture: ComponentFixture<UserAvatarComponent>;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        SharedModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAvatarComponent);
    component = fixture.componentInstance;
    el = fixture.nativeElement;
  });

  it('should create with anonymous user', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(el.innerHTML).toContain('perm_identity');
  });

  it('should create with logged in user', () => {
    component.user = new User(mockUser);
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(el.innerHTML).toContain('favicon.png');
  });
});

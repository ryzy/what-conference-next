import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SharedModule } from '../../shared.module';

import { ConfirmationComponent } from './confirmation.component';

describe('ConfirmationComponent', () => {
  let component: ConfirmationComponent;
  let fixture: ComponentFixture<ConfirmationComponent>;
  let confirmed: boolean | undefined;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: 'Some confirmation message' },
        { provide: MatDialogRef, useValue: { close: (res) => (confirmed = res) } },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(fixture).toMatchSnapshot();
  });

  it('should confirm', () => {
    component.onConfirm();
    expect(confirmed).toBe(true);
  });

  it('should cancel', () => {
    component.onCancel();
    expect(confirmed).toBe(false);
  });
});

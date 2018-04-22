import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AppTestingWithDatabaseModule } from '../../../../testing/app-testing-with-database.module';
import { CoreModule } from '../../../core/core.module';
import { EventFormModule } from '../../event-form.module';
import { EventFormPageComponent } from './event-form-page.component';

describe('EventFormPageComponent', () => {
  let component: EventFormPageComponent;
  let fixture: ComponentFixture<EventFormPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule, EventFormModule, AppTestingWithDatabaseModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventFormPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});

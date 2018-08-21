import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppTestingAuthAndDbModule } from '../../../../testing/app-testing-auth-db.module';
import { mockTagsWithSub } from '../../../../testing/fixtures/event-tags';
import { EventsFilters } from '../../../event-base/model/events-filters';
import { EventsListModule } from '../../events-list.module';
import { EventsFilterComponent } from './events-filter.component';

describe('TagsSelectorComponent', () => {
  let component: EventsFilterComponent;
  let fixture: ComponentFixture<EventsFilterComponent>;
  let emitValuesSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule, EventsListModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventsFilterComponent);
    component = fixture.componentInstance;
    component.tagsList = mockTagsWithSub;
    emitValuesSpy = spyOn(component.filtersChanged, 'emit').and.callThrough();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set initial filters', () => {
    component.filters = { where: 'europe' };

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.form.getRawValue()).toEqual(
      jasmine.objectContaining({
        where: 'europe',
      }),
    );
  });

  it('should emit values', () => {
    let res: EventsFilters | undefined;
    component.filtersChanged.subscribe((v) => (res = v));
    expect(res).toBe(undefined);

    fixture.detectChanges();
    component.form.patchValue({
      where: 'europe',
    });
    expect(res).toEqual(
      jasmine.objectContaining({
        where: 'europe',
      }),
    );
  });
});

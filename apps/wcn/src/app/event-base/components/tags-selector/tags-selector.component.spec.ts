import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AppTestingAuthAndDbModule } from '../../../../testing/app-testing-auth-db.module';
import { mockTags, mockTagsWithSub } from '../../../../testing/fixtures/event-tags';
import { EventBaseModule } from '../../event-base.module';
import { TagsSelectorComponent, TagsSelectorFormData } from './tags-selector.component';

describe('TagsSelectorComponent', () => {
  let component: TagsSelectorComponent;
  let fixture: ComponentFixture<TagsSelectorComponent>;
  let emitValueSpy: jasmine.Spy;
  let lastValue: string[] | undefined;

  /**
   * Get mat-chips for all primary and secondary tags
   * (Note: that's with the assumption of `secondaryTagsAsChips=true` (default).
   */
  const getPrimaryTagsEls = () => fixture.debugElement.queryAll(By.css('.primary-tags .mat-chip'));
  const getSecondaryTagsEls = () => fixture.debugElement.queryAll(By.css('.secondary-tags .mat-chip'));
  const getSecondaryTagsOptionsEls = () => fixture.debugElement.queryAll(By.css('.secondary-tags .mat-options'));
  /**
   * Get mat-form-field with secondary tags dropdown (if present)
   */
  const getSecondaryTagsContainerEl = () => fixture.debugElement.query(By.css('.secondary-tags'));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [AppTestingAuthAndDbModule, EventBaseModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsSelectorComponent);

    component = fixture.componentInstance;
    emitValueSpy = spyOn(component.tagsChanged, 'emit');
    component.tagsList = mockTagsWithSub;
    component.registerOnChange((v: string[]) => {
      // console.log('[TEST] TagsSelectorComponent.registerOnChange, emitted value', v);
      lastValue = v;
    });
    fixture.detectChanges();
  });

  it('should create w/o any input data and should render primary tags', () => {
    fixture = TestBed.createComponent(TagsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should set initial filters', () => {
    component.writeValue(['angular']);
    expect(component.internalValue).toEqual({ primaryTags: ['frontend'], secondaryTags: ['angular'] });

    fixture.detectChanges();

    // get selected primary chip and check if that's our 'frontend' tag
    const primaryChip = getPrimaryTagsEls().find((v) => v.classes['mat-chip-selected']);
    expect(primaryChip).toBeTruthy();
    expect((primaryChip.nativeElement as HTMLElement).innerText.toLowerCase()).toContain('frontend');

    // we should have some secondary tag rendered
    expect(getSecondaryTagsEls().length).toBeTruthy();
  });

  it('should toggle primary tags and show secondary tags', () => {
    const mockTagIdx = 2;

    // no secondary tags
    expect(getSecondaryTagsEls()).toEqual([]);

    // get tag chips, click on the last `frontend` one which has sub-tags
    const primaryTagEl = getPrimaryTagsEls()[mockTagIdx];
    primaryTagEl.nativeElement.click();
    expect(lastValue).toEqual([mockTagsWithSub[mockTagIdx].id]);

    // test if we have secondary tags selector
    fixture.detectChanges();
    expect(getSecondaryTagsEls()).toBeTruthy();
  });

  it('on value set should update lists of tags to render', () => {
    expect(component.value).toEqual([]);
    expect(component.internalValue).toEqual({ primaryTags: [], secondaryTags: [] });
    expect(component.renderPrimaryTags.length).toBeGreaterThan(1); // we have few mocked primary tags there...
    expect(component.renderSecondaryTags.length).toBe(0); // We don't want secondary tags until some tag is selected

    // select a primary tag... we should have rendered list of secondary tags in that category
    component.writeValue(['angular']);
    expect(component.value).toEqual(['angular']);
    expect(component.internalValue).toEqual({ primaryTags: ['frontend'], secondaryTags: ['angular'] });
    expect(component.renderPrimaryTags.length).toBeGreaterThan(1); // we have few mocked primary tags there...
    expect(component.renderSecondaryTags.length).toBeGreaterThan(1); // now we should also have some secondary tags
  });

  it('#toggleTag should toggle and un-toggle', () => {
    const mockTag0 = mockTags[0];
    const mockTag1 = mockTags[1];

    component.toggleTag(mockTag0);
    component.toggleTag(mockTag1);
    expect(lastValue).toEqual([mockTag0.id, mockTag1.id]);

    // tag0 should be now removed, since it's already there
    component.toggleTag(mockTag0);
    expect(lastValue).toEqual([mockTag1.id]);
  });

  it('#hasAnySecondaryTagsToShow', () => {
    expect(component.hasAnySecondaryTagsToShow()).toBe(false);

    component.form.patchValue(<TagsSelectorFormData>{ primaryTags: [mockTagsWithSub[0].id] });
    expect(component.hasAnySecondaryTagsToShow()).toBe(false);

    component.form.patchValue(<TagsSelectorFormData>{ primaryTags: [mockTagsWithSub[2].id] });
    expect(component.hasAnySecondaryTagsToShow()).toBe(true);
  });

  describe('Form Control', () => {
    /**
     * Test if different values are distributed properly into primary/secondary tags
     */
    it('#valueToFormData', () => {
      expect(component.value).toEqual([]);
      expect(component.internalValue).toEqual({ primaryTags: [], secondaryTags: [] });

      //
      component.writeValue(['angular']);
      expect(component.value).toEqual(['angular']);
      expect(component.internalValue).toEqual({ primaryTags: ['frontend'], secondaryTags: ['angular'] });

      component.writeValue(['angular', 'react', 'aws']);
      expect(component.internalValue).toEqual({
        primaryTags: ['frontend', 'cloud'],
        secondaryTags: ['angular', 'react', 'aws'],
      });

      component.writeValue(['angular', 'react', 'cloud', 'aws']);
      expect(component.internalValue).toEqual({
        primaryTags: ['cloud', 'frontend'],
        secondaryTags: ['angular', 'react', 'aws'],
      });
    });

    /**
     * Test if emitted values are as we want them,
     * clear and only what's needed (e.g. no parent tags)
     *
     * We test it by calling directly `form.patchValue()`
     * since `component.writeValue()` doesn't emit to `lastValue`
     */
    it('#formDataToValue', () => {
      component.form.patchValue({});
      expect(lastValue).toEqual([]);

      component.form.patchValue(<TagsSelectorFormData>{ primaryTags: ['frontend'], secondaryTags: ['angular'] });
      expect(lastValue).toEqual(['angular']);

      component.form.patchValue(<TagsSelectorFormData>{ primaryTags: ['frontend', 'cloud'], secondaryTags: [] });
      expect(lastValue).toEqual(['frontend', 'cloud']);

      component.form.patchValue(<TagsSelectorFormData>{
        primaryTags: ['frontend', 'cloud'],
        secondaryTags: ['angular', 'aws'],
      });
      expect(lastValue).toEqual(['angular', 'aws']);

      component.form.patchValue(<TagsSelectorFormData>{
        primaryTags: ['frontend', 'cloud'],
        secondaryTags: ['angular'],
      });
      expect(lastValue).toEqual(['cloud', 'angular']);

      // since parent category `cloud` is not present anymore in form data
      // expect no `cloud/aws` at all (since it doesn't make sense)
      component.form.patchValue(<TagsSelectorFormData>{
        primaryTags: ['frontend', 'ai'],
        secondaryTags: ['angular', 'aws'],
      });
      expect(lastValue).toEqual(['ai', 'angular']);
    });

    /**
     * Same as above, but with redundant/parent tags
     */
    it('#formDataToValue with redundant tags', () => {
      component.redundantTagsInValue = true;

      component.form.patchValue({});
      expect(lastValue).toEqual([]);

      component.form.patchValue(<TagsSelectorFormData>{ primaryTags: ['frontend'], secondaryTags: ['angular'] });
      expect(lastValue).toEqual(['frontend', 'angular']);

      component.form.patchValue(<TagsSelectorFormData>{ primaryTags: ['frontend', 'cloud'], secondaryTags: [] });
      expect(lastValue).toEqual(['frontend', 'cloud']);

      component.form.patchValue(<TagsSelectorFormData>{
        primaryTags: ['frontend', 'cloud'],
        secondaryTags: ['angular', 'aws'],
      });
      expect(lastValue).toEqual(['frontend', 'cloud', 'angular', 'aws']);

      component.form.patchValue(<TagsSelectorFormData>{
        primaryTags: ['frontend', 'cloud'],
        secondaryTags: ['angular'],
      });
      expect(lastValue).toEqual(['frontend', 'cloud', 'angular']);

      // since parent category `cloud` is not present anymore in form data
      // expect no `cloud/aws` at all (since it doesn't make sense)
      component.form.patchValue(<TagsSelectorFormData>{
        primaryTags: ['frontend', 'ai'],
        secondaryTags: ['angular', 'aws'],
      });
      expect(lastValue).toEqual(['frontend', 'ai', 'angular']);
    });
  });
});

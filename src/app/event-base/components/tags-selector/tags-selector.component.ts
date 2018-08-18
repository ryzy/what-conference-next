import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  EventEmitter,
  ChangeDetectorRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { EventTag } from '../../../event-base/model/event-tag';
import { entitiesById } from '../../../event-base/utils/event-utils';

export interface TagsSelectorFormData {
  primaryTags: string[];
  secondaryTags: string[];
}

export type OnChangeFn = (tags: string[]) => any;

@Component({
  selector: 'app-tags-selector',
  templateUrl: './tags-selector.component.html',
  styleUrls: ['./tags-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: TagsSelectorComponent,
      multi: true,
    },
  ],
  host: {
    class: 'app-tags-selector',
    '(blur)': 'onTouchedFn()',
  },
})
export class TagsSelectorComponent implements OnInit, OnDestroy, ControlValueAccessor {
  /**
   * List of all available tags in Store
   */
  @Input()
  public set tagsList(tags: EventTag[]) {
    this.tags = tags;
    this.tagsById = entitiesById(tags);
  }

  /**
   * Primary/secondary tags TO RENDER in the template.
   * Updated when the `value` with current tags selection is updated.
   * @see _updateValue
   */
  public renderPrimaryTags: EventTag[] = [];
  public renderSecondaryTags: EventTag[] = [];

  /**
   * Get internal tags form data (so with split into primary/secondary tags)
   * with all nested structures initialised to empty/default values
   */
  public get internalValue(): TagsSelectorFormData {
    const formData = this.form.getRawValue() as TagsSelectorFormData;
    formData.primaryTags = formData.primaryTags || [];
    formData.secondaryTags = formData.secondaryTags || [];
    return formData;
  }

  /**
   * By default, emitted value doesn't contain any redundant,
   * i.e. parent tags. Set it to false to include them.
   */
  @Input()
  public redundantTagsInValue: boolean = false;

  /**
   * Should secondary tags be rendered as chip list or as a select dropdown
   */
  @Input()
  public secondaryTagsAsChips: boolean = true;

  public form!: FormGroup;

  @Output()
  public tagsChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  /**
   * Value, as currently exposed outside.
   * Arrives from the form's data, then is parsed by formDataToValue()
   */
  public value: string[] = [];

  private tags: EventTag[] = [];
  private tagsById: { [tagId: string]: EventTag } = {};

  private ngOnDestroy$: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private cdRef: ChangeDetectorRef) {}

  /**
   * Registered by ControlValueAccessor callbacks functions
   */
  public onChangeFn: OnChangeFn = () => undefined;
  public onTouchedFn: () => any = () => undefined;

  public ngOnInit(): void {
    this._updateValue([]);

    this.form = new FormGroup({
      primaryTags: new FormControl(),
      secondaryTags: new FormControl(),
    });

    // This emits when user makes any change in selected tags, either primary or secondary.
    this.form.statusChanges.pipe(takeUntil(this.ngOnDestroy$)).subscribe(() => {
      this._updateValue(this.formDataToValue(this.internalValue));
      // console.log('TagsSelectorComponent value change', { value: this.value, formData: this.form.getRawValue() });
      this.onChangeFn(this.value);
      this.tagsChanged.emit(this.value);
    });
  }

  public writeValue(tags: string[]): void {
    // This is a ControlValueAccessor method. We can't emitEvent as that'd cause an infinite loop,
    // and therefore the `statusChanges` observable from ngInit won't emit. So we need to update
    // the internal `value` snapshot ourself here.
    this._updateValue(tags);
    this.form.patchValue(this.valueToFormData(this.value), { emitEvent: false });
    this.cdRef.markForCheck();
  }

  public registerOnChange(fn: OnChangeFn): void {
    this.onChangeFn = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouchedFn = fn;
  }

  public ngOnDestroy(): void {
    this.ngOnDestroy$.next(true);
  }

  /**
   * Adds/removes primary tag from selection
   */
  public toggleTag(tag: EventTag): void {
    const key: keyof TagsSelectorFormData = tag.parent ? 'secondaryTags' : 'primaryTags';
    let tags: string[] = this.internalValue[key];
    tags = this.isTagSelected(tag) ? tags.filter((t) => t !== tag.id) : [...tags, tag.id];
    this.form.patchValue({ [key]: tags });
  }

  /**
   * Test if given primary tag is already selected
   */
  public isTagSelected(tag: EventTag): boolean {
    const key: keyof TagsSelectorFormData = tag.parent ? 'secondaryTags' : 'primaryTags';
    return this.internalValue[key].includes(tag.id);
  }

  /**
   * Are there any secondary tags to show
   * (for selected primary tags or provided tag)
   */
  public hasAnySecondaryTagsToShow(onlyForTag?: EventTag): boolean {
    const primaryTags = this.internalValue.primaryTags;
    return !!this.tags.find(
      (t: EventTag) => !!t.parent && (onlyForTag ? t.parent === onlyForTag.id : true) && primaryTags.includes(t.parent),
    );
  }

  private _updateValue(value: string[]): void {
    this.value = value || [];

    const { primaryTags, secondaryTags } = this.valueToFormData(this.value);
    this.renderPrimaryTags = this.tags.filter((tag) => !tag.parent);
    this.renderSecondaryTags = this.tags.filter((tag) => !!tag.parent && primaryTags.includes(tag.parent));

    // console.log('_updateValue', { value: this.value, primaryTags: this.primaryTags, secondaryTags: this.secondaryTags });
  }

  /**
   * Map lean `value` to form data, with primary/secondary tags selected appropriately.
   * This must work for case when parent/redundant tag is not present in the `value`
   * and can be derived from just secondary tags.
   */
  private valueToFormData(tags: string[]): TagsSelectorFormData {
    const formData: TagsSelectorFormData = { primaryTags: [], secondaryTags: [] };

    // Convert `tags` into form data to separate fields: primary and secondary tags
    if (tags.length) {
      const tagsDict = this.tagsById;

      const primaryTags: string[] = tags.filter((tid) => !!tagsDict[tid] && !tagsDict[tid].parent);
      const secondaryTags: string[] = tags.filter((tid) => !!tagsDict[tid] && !!tagsDict[tid].parent);

      // For each secondary tag, check if we have corresponding parent tag...
      // If not, add it, so it's marked as selected in the tags list
      // (this info is not carried in the url, as we can derive it from secondary tags, which we do here).
      secondaryTags.forEach((secondaryTid: string) => {
        const primaryTid = tagsDict[secondaryTid].parent as string;
        if (!primaryTags.includes(primaryTid)) {
          primaryTags.push(primaryTid);
        }
      });
      formData.primaryTags = primaryTags;
      formData.secondaryTags = secondaryTags;
    }

    return formData;
  }

  /**
   * Convert current tags selection (primary + secondary) to clean value,
   * i.e. list of tags w/o their parents, if that would be redundant.
   * Unless this.redundantTagsInValue is set, of course - then they ARE included.
   *
   * We do have two use cases here, with and w/o redundant/parent tags:
   * 1) When we want to have as lean list of tags in the URL
   *    and when we use that value for DB query (when we search for frontend/angular
   *    we really need to query for angular only, not the parent frontend,
   *    which would return much more events).
   * 2) When we create new event and tags got selected. Then we WANT extra
   *    parent tags in the database, so we can later on search just for `frontend`,
   *    w/o the need to list all sub-categories explicitly.
   */
  private formDataToValue(data: TagsSelectorFormData): string[] {
    // extract primary tags and secondary tags from form data...
    const { primaryTags, secondaryTags } = data;

    if (primaryTags && secondaryTags) {
      // Filter out tags which shouldn't be here, if their parent tags are not selected.
      // That usually means the parent tag got unselected in the UI, so should its secondary tags.
      const excludedSecondaryTags: string[] = Object.keys(
        secondaryTags.reduce((obj: { [tid: string]: boolean }, secondaryTid) => {
          const primaryTid = this.tagsById[secondaryTid].parent as string;
          if (!primaryTags.includes(primaryTid)) {
            obj[secondaryTid] = true;
          }
          return obj;
        }, {}),
      );
      const newSecondaryTags: string[] = secondaryTags.filter((tid) => !excludedSecondaryTags.includes(tid));

      // Exclude primary tags which can be derived from selected secondary tags.
      // We want clear tags list, only the last leafs (e.g. if frontend/angular is selected,
      // we only want angular, w/o the parent frontend).
      let newPrimaryTags: string[] = primaryTags;
      if (!this.redundantTagsInValue) {
        const excludedPrimaryTags: string[] = Object.keys(
          secondaryTags.reduce((obj: { [tid: string]: boolean }, secondaryTid) => {
            const primaryTid = this.tagsById[secondaryTid].parent as string;
            obj[primaryTid] = true;
            return obj;
          }, {}),
        );
        newPrimaryTags = primaryTags.filter((tid) => !excludedPrimaryTags.includes(tid));
      }

      // merge clean tags and primary tags into one `tags` filter
      return [...newPrimaryTags, ...newSecondaryTags];
    } else if (primaryTags) {
      return primaryTags;
    }
    return [];
  }
}

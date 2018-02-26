import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventFormComponent implements OnInit {

  public eventForm!: FormGroup;

  public constructor() {
  }

  public ngOnInit(): void {
    this.eventForm = new FormGroup({
      name: new FormControl(),
      topicTags: new FormControl(),
      country: new FormControl(),
      city: new FormControl(),
      address: new FormControl(),
      date: new FormControl(),
      eventDuration: new FormControl(),
      workshopDays: new FormControl(),
      website: new FormControl(),
      twitterHandle: new FormControl(),
      description: new FormControl(),
      price: new FormControl(),
      sizeBand: new FormControl(),
    });
  }
}

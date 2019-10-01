import { Component, ChangeDetectionStrategy, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loader',
  host: {
    class: 'app-loader',
    '[class.centered]': 'centered',
    '[class.local]': 'local',
  },
  template: `
    <div class="spinner">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
      </svg>
    </div>
    <h4 *ngIf="message">{{ message }}</h4>
    <ng-content></ng-content>
  `,
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoaderComponent {
  @Input()
  public message: string = 'Loading...';

  /**
   * Vertically centered loader. Useful when you need full screen loader
   */
  @Input()
  public centered: boolean = false;

  /**
   * Local (i.e. not absolutely positioned) loader
   * TODO: probably it needs more thinking/fine-tuning
   */
  @Input()
  public local: boolean = false;
}

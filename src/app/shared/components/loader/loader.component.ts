import { Component, ChangeDetectionStrategy, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-loader',
  host: {
    class: 'app-loader',
    '[class.centered]': 'centered',
  },
  template: `
    <div class="spinner">
      <svg class="circular" viewBox="25 25 50 50">
        <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/>
      </svg>
    </div>
    <h4 *ngIf="message">{{message}}</h4>
    <ng-content></ng-content>
  `,
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class LoaderComponent {
  @Input()
  public message: string = 'Loading...';

  @Input()
  public centered: boolean = false;
}

import { Component, ViewEncapsulation } from '@angular/core';
import { Conference } from '../../core/model/model';

import { ConfDataSource, conferencesData } from '../db';

@Component({
  selector: 'app-listing-page',
  host: {
    'class': 'app-listing-page',
  },
  templateUrl: './listing-page.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class ListingPageComponent {
  dataSource: ConfDataSource = new ConfDataSource(conferencesData);

  tableColumns = ['logo', 'name', 'date', 'badges', 'price', 'focus', 'speakers', 'actions'];

  public constructor() {
    console.log('DATA', this.dataSource);
  }

  public getSizeBadge(conf: Conference): string|undefined {
    if (conf.confSize) {
      if (conf.confSize <= 100) {
        return 'small';
      } else if (conf.confSize > 100 && conf.confSize < 500) {
        return 'medium';
      } else {
        return 'large';
      }
    }
  }
}

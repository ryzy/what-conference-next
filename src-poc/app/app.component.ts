import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="grid-container">
      <router-outlet></router-outlet>
    </div>
  `,
})
export class AppComponent {

}

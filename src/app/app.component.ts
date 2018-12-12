import { Component } from '@angular/core';

@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cc-terminal-app';
  _externalConfig: any;

  constructor() {
    // Add more config support
    this._externalConfig = {
      classes: {
        section: '',
        viewport: '',
        input: '',
        cursor: ''
      }
    };

  }
}

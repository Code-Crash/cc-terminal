import { Component, OnInit } from '@angular/core';
import { CcTerminalService } from '../../projects/cc-terminal/src/public_api';
@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cc-terminal-app';
  _classes: any;
  _tService: CcTerminalService;
  _command = '';
  _config: any;
  _prompt = { end: '$', user: 'Sumit', separator: '@', path: '\\' };

  constructor(_tService: CcTerminalService) {
    // this._tComponent._command = '';
    // this._initializeConfig();
    this._tService = _tService;
    // Add more config support
    this._classes = {
      section: {
        color: 'lightgreen', background: 'black'
      },
      viewport: {
        color: 'yellow', background: 'black'
      },
      input: {
        color: 'red', background: 'black'
      },
      cursor: {
        color: 'green', background: 'black'
      }
    };
  }

  ngOnInit() {
    console.log('here');
  }


}

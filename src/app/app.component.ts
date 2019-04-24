import { Component, OnInit, OnDestroy } from '@angular/core';
import { CcTerminalService } from '../../projects/cc-terminal/src/public_api';
@Component({
  selector: 'cc-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'cc-terminal-app';
  _styles: any;
  _tService: CcTerminalService;
  _command = '';
  _config: any;
  _prompt = { end: '$', user: 'Pravin', separator: '@', path: '\\' };
  store: any;

  constructor(_tService: CcTerminalService) {
    // this._tComponent._command = '';
    // this._initializeConfig();
    this._tService = _tService;

    // Add more config support, custom styling
    this._styles = {
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
    this.initService(); // Setup your custom commands
  }

  initService() {
    this._tService.on<any>('store-ready').subscribe(_store => {
      this.store = _store;
      this.registerExternalCommands(); // Register External or your custom commands
      // Note: you can also register your commands from here using _store also
      _store.addCommand({
        name: 'test',
        details: {
          output: true,
          breakLine: true,
          readonly: false,
          result: [{
            text: 'This is test command'
          }]
        }
      });
    });
  }

  registerExternalCommands = () => {
    this.store.addCommand({
      name: 'about',
      details: {
        output: true,
        breakLine: true,
        readonly: true,
        result: [{
          text: 'This is a web based terminal, easy to use and register your commands and you can feel like using a actual terminal, make your website looks like terminal.'
        }]
      }
    });

    this.store.addCommand({
      name: 'text',
      details: {
        result: [{
          text: () => {
            return 10 + 10;
          }
        }], readonly: true
      },
      callback: () => {
        console.log('hello');
        // this._tService.broadcast('terminal-command', { command: command });
        alert('done');
      }
    });
  }

  ngOnInit() {
    console.log('Custom App Initialized!');
  }

  ngOnDestroy() { }

}

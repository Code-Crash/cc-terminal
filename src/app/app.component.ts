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
      this._tService.broadcast('terminal-output', { // Add a welcome message on store ready
        details: {
          output: true,
          breakLine: true,
          result: [
            { text: 'Welcome Message on external project', css: {color: 'pink'} }
          ]
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

    // TODO: Handle this kind of
    this.store.addCommand({
      name: 'example',
      details: {
        breakLine: true,
        output: true, // Output false have error
        readonly: false,
        result: [{
          text: () => {
            return 10 + 10;
          }
        }],
      },
      callback: () => {
        this._tService.broadcast('terminal-command', { command: 'help' }); // Execute command through code
        this._tService.broadcast('terminal-output', { // To some output to terminal directly
          details: {
            output: true,
            breakLine: true,
            result: [
              { text: 'yum yum' }
            ]
          }
        });
        alert('done');
      }
    });
  }

  ngOnInit() {
    console.log('Custom App Initialized!');
  }

  ngOnDestroy() { }

}
